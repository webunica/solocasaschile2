import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { FlowService } from '@/lib/payments/flow';
import { resend } from '@/lib/resend';
import { getBillingCycleLabel } from '@/lib/payments/plans';
import { getRequestId, logError, logInfo, logWarn } from '@/lib/observability-logger';
import { z } from 'zod';

const WebhookSchema = z.object({
  token: z.string().min(1, "Token de Flow requerido")
});

/**
 * Recibe la confirmación de pago de Flow (Webhook)
 */
export async function POST(req: NextRequest) {
  const route = '/api/payments/flow/confirm';
  const requestId = getRequestId(req);
  const start = Date.now();

  try {
    const formData = await req.formData();
    const tokenRaw = formData.get('token');

    const validation = WebhookSchema.safeParse({ token: tokenRaw });
    if (!validation.success) {
      logWarn('flow_webhook_validation_failed', route, requestId, {
        ms: Date.now() - start,
      });
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { token } = validation.data;

    logInfo('flow_webhook_started', route, requestId);

    // 1. Validar el estado real del pago llamando a la API de Flow
    const statusResult = await FlowService.getPaymentStatus(token);

    const constructoraId = statusResult.optional?.constructoraId;
    const plan = statusResult.optional?.plan || 'pro';
    const billing = statusResult.optional?.billing || 'monthly';
    const userEmail = statusResult.payer;
    const flowOrder = statusResult.flowOrder;
    const amount = statusResult.amount;

    if (!constructoraId) {
      logError('flow_webhook_missing_constructora', route, requestId, new Error('missing_constructora_id'), {
        flowOrder: flowOrder ? String(flowOrder) : undefined,
        ms: Date.now() - start,
      });
      return NextResponse.json({ error: 'ID de constructora no encontrado en los parámetros del pago' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Mapping de estados de Flow a nuestra base de datos
    const statusMap: Record<number, string> = {
      1: 'pending',
      2: 'paid',
      3: 'rejected',
      4: 'canceled'
    };
    const statusCode = typeof statusResult.status === 'number' ? statusResult.status : 1;
    const dbStatus = statusMap[statusCode] || 'pending';

    // 2. Comprobar si ya procesamos este pago como 'paid' para evitar re-procesos
    const { data: existingPayment } = await supabase
      .from('pagos')
      .select('status')
      .eq('flow_order', String(flowOrder))
      .maybeSingle();

    if (existingPayment?.status === 'paid' && dbStatus === 'paid') {
      logInfo('flow_webhook_duplicate_paid_ignored', route, requestId, {
        flowOrder: String(flowOrder),
        ms: Date.now() - start,
      });
      return NextResponse.json({ message: 'Pago ya procesado anteriormente.' });
    }

    // 3. Registrar/Actualizar el intento/resultado del pago en la tabla 'pagos' (Historial)
    const { error: paymentError } = await supabase
      .from('pagos')
      .upsert({
        constructora_id: constructoraId,
        flow_order: String(flowOrder),
        token: token,
        amount: amount,
        status: dbStatus,
        plan: plan,
        billing_cycle: billing,
        updated_at: new Date().toISOString()
      }, { onConflict: 'flow_order' });

    if (paymentError) {
      logError('flow_webhook_payment_record_failed', route, requestId, paymentError, {
        flowOrder: String(flowOrder),
        status: dbStatus,
        ms: Date.now() - start,
      });
      // No bloqueamos el flujo principal si solo falla el registro histórico, 
      // pero es importante loguearlo.
    }

    // 4. LÓGICA SEGÚN ESTADO DE PAGO
    
    // --- CASO A: PAGO EXITOSO (Estado 2) ---
    if (statusResult.status === 2) {
      // Calcular fecha de próximo cobro
      const nextBilling = new Date();
      if (billing === 'yearly') {
        nextBilling.setFullYear(nextBilling.getFullYear() + 1);
      } else if (billing === 'semiannual') {
        nextBilling.setMonth(nextBilling.getMonth() + 6);
      } else {
        nextBilling.setMonth(nextBilling.getMonth() + 1);
      }

      // Activar la suscripción automáticamente
      const { error: dbError, data: updatedData } = await supabase
        .from('constructoras')
        .update({
          plan: plan,
          plan_cycle: billing,
          plan_status: 'active',
          next_billing_date: nextBilling.toISOString(),
          verificada: true
        })
        .eq('id', constructoraId)
        .select('nombre')
        .single();

      if (dbError) {
        logError('flow_webhook_plan_activation_failed', route, requestId, dbError, {
          flowOrder: String(flowOrder),
          ms: Date.now() - start,
        });
        return NextResponse.json({ error: 'Error al activar plan' }, { status: 500 });
      }

      // Enviar email de éxito
      try {
        // 1. Email al usuario
        await resend.emails.send({
          from: 'SoloCasasChile <contacto@solocasaschile.com>',
          to: [userEmail || 'soporte@solocasaschile.com'],
          subject: 'Tu Plan Pro ya esta activo en SoloCasasChile',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border-radius: 20px; overflow: hidden; border: 1px solid #eee;">
               <div style="background: #4f46e5; padding: 40px; text-align: center; color: white;">
                  <h1 style="margin: 0; font-size: 24px;">Tu plan ${plan.toUpperCase()} ya esta activo</h1>
               </div>
               <div style="padding: 40px; color: #334155; line-height: 1.6;">
                  <p>Hola <strong>${updatedData?.nombre}</strong>,</p>
                  <p>Tu pago fue procesado correctamente. Tu cuenta quedo activa y ya puedes entrar a tu panel para publicar modelos y recibir leads.</p>
                  <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
                     <p style="margin: 5px 0;"><strong>Plan:</strong> ${plan.toUpperCase()}</p>
                     <p style="margin: 5px 0;"><strong>Ciclo:</strong> ${getBillingCycleLabel(billing)}</p>
                     <p style="margin: 5px 0;"><strong>Proxima renovacion:</strong> ${nextBilling.toLocaleDateString('es-CL')}</p>
                  </div>
                  <p style="margin: 0 0 10px;"><strong>Primeros pasos recomendados:</strong></p>
                  <ol style="padding-left: 20px; margin-top: 0;">
                    <li>Completa el perfil de tu constructora.</li>
                    <li>Publica tus modelos con fotos, precios y regiones.</li>
                    <li>Activa testimonios, certificaciones y seguimiento de obras.</li>
                    <li>Revisa tus leads desde el panel y responde rapido por WhatsApp.</li>
                  </ol>
                  <div style="background: #ecfeff; border: 1px solid #99f6e4; padding: 18px; border-radius: 12px; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Beneficios activos:</strong> modelos publicados, CRM de leads, badge verificado, soporte prioritario y seguimiento de obras.</p>
                  </div>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: block; background: #4f46e5; color: white; text-align: center; padding: 15px; border-radius: 10px; text-decoration: none; font-weight: bold;">Entrar a mi panel</a>
                  <p style="font-size: 13px; color: #64748b; margin-top: 24px;">Si necesitas ayuda, responde este correo o escribenos por WhatsApp. Estamos para ayudarte a dejar tu perfil vendiendo mejor.</p>
               </div>
            </div>
          `
        });

        // 2. Email al administrador (Aviso de pago exitoso)
        const adminEmail = process.env.ADMIN_EMAIL || 'info.javiermillar@gmail.com';
        await resend.emails.send({
          from: 'SoloCasasChile <contacto@solocasaschile.com>',
          to: [adminEmail],
          subject: `💰 VENTA: Plan ${plan.toUpperCase()} Activado`,
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>¡Nueva Venta Realizada!</h2>
              <p><strong>Constructora:</strong> ${updatedData?.nombre}</p>
              <p><strong>Monto:</strong> ${amount}</p>
              <p><strong>Plan:</strong> ${plan.toUpperCase()}</p>
              <p><strong>Ciclo:</strong> ${getBillingCycleLabel(billing)}</p>
              <p><strong>Orden Flow:</strong> ${flowOrder}</p>
            </div>
          `
        });
      } catch (e) {
        logError('flow_webhook_paid_email_failed', route, requestId, e, {
          flowOrder: String(flowOrder),
          ms: Date.now() - start,
        });
      }

      logInfo('flow_webhook_paid_completed', route, requestId, {
        flowOrder: String(flowOrder),
        plan,
        billing,
        ms: Date.now() - start,
      });

      return NextResponse.json({ message: 'Pago procesado y plan activado.' });
    }

    // --- CASO B: PAGO RECHAZADO (Estado 3) ---
    if (statusResult.status === 3) {
      logWarn('flow_webhook_payment_rejected', route, requestId, {
        flowOrder: String(flowOrder),
        ms: Date.now() - start,
      });
      
      try {
        await resend.emails.send({
          from: 'SoloCasasChile <sistema@solocasaschile.com>',
          to: [userEmail || 'soporte@solocasaschile.com'],
          subject: 'Problema con tu pago en SoloCasasChile ⚠️',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border-radius: 20px; overflow: hidden; border: 1px solid #eee;">
               <div style="background: #f59e0b; padding: 40px; text-align: center; color: white;">
                  <h1 style="margin: 0; font-size: 24px;">Pago no completado</h1>
               </div>
               <div style="padding: 40px; color: #334155; line-height: 1.6;">
                  <p>Hola,</p>
                  <p>Te informamos que tu intento de pago para el plan <strong>${plan.toUpperCase()}</strong> no pudo ser procesado por Flow.</p>
                  <p>Esto puede deberse a fondos insuficientes, problemas con la tarjeta o cancelación de la transacción.</p>
                  <p>Puedes intentar realizar el pago nuevamente desde tu panel de control.</p>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/planes" style="display: block; background: #f59e0b; color: white; text-align: center; padding: 15px; border-radius: 10px; text-decoration: none; font-weight: bold;">Reintentar Pago</a>
               </div>
            </div>
          `
        });
      } catch (e) {
        logError('flow_webhook_rejected_email_failed', route, requestId, e, {
          flowOrder: String(flowOrder),
          ms: Date.now() - start,
        });
      }

      return NextResponse.json({ message: 'Pago rechazado, notificación enviada.' });
    }

    // --- CASO C: PAGO ANULADO (Estado 4) ---
    if (statusResult.status === 4) {
      logInfo('flow_webhook_payment_canceled', route, requestId, {
        flowOrder: String(flowOrder),
        ms: Date.now() - start,
      });
      return NextResponse.json({ message: 'Pago anulado por el usuario.' });
    }

    logInfo('flow_webhook_received', route, requestId, {
      flowOrder: String(flowOrder),
      status: dbStatus,
      ms: Date.now() - start,
    });

    return NextResponse.json({ message: 'Webhook recibido.' });

  } catch (error: unknown) {
    logError('flow_webhook_failed', route, requestId, error, {
      ms: Date.now() - start,
    });
    return NextResponse.json({ error: 'Ocurrió un error al procesar el webhook.' }, { status: 500 });
  }
}
