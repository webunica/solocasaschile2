import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { FlowService } from '@/lib/payments/flow';
import { resend } from '@/lib/resend';
import { z } from 'zod';

const WebhookSchema = z.object({
  token: z.string().min(1, "Token de Flow requerido")
});

/**
 * Recibe la confirmación de pago de Flow (Webhook)
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const tokenRaw = formData.get('token');

    const validation = WebhookSchema.safeParse({ token: tokenRaw });
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { token } = validation.data;

    console.info(`[FLOW-WEBHOOK] Procesando confirmación para token: ${token}`);

    // 1. Validar el estado real del pago llamando a la API de Flow
    const statusResult = await FlowService.getPaymentStatus(token);

    const constructoraId = statusResult.optional?.constructoraId;
    const plan = statusResult.optional?.plan || 'pro';
    const billing = statusResult.optional?.billing || 'monthly';
    const userEmail = statusResult.payer;
    const flowOrder = statusResult.flowOrder;
    const amount = statusResult.amount;

    if (!constructoraId) {
      console.error('Webhook Error: constructoraId not found in statusResult.optional');
      return NextResponse.json({ error: 'ID de constructora no encontrado en los parámetros del pago' }, { status: 400 });
    }

    const supabase = await createClient();

    // Mapping de estados de Flow a nuestra base de datos
    const statusMap: Record<number, string> = {
      1: 'pending',
      2: 'paid',
      3: 'rejected',
      4: 'canceled'
    };
    const dbStatus = statusMap[statusResult.status] || 'pending';

    // 2. Comprobar si ya procesamos este pago como 'paid' para evitar re-procesos
    const { data: existingPayment } = await supabase
      .from('pagos')
      .select('status')
      .eq('flow_order', String(flowOrder))
      .maybeSingle();

    if (existingPayment?.status === 'paid' && dbStatus === 'paid') {
      console.info(`[FLOW-WEBHOOK] El pago ${flowOrder} ya fue procesado como Pagado. Ignorando.`);
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
      console.error('Webhook Error (Record Payment):', paymentError);
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
        console.error('Webhook Error (Database Update):', dbError);
        return NextResponse.json({ error: 'Error al activar plan' }, { status: 500 });
      }

      // Enviar email de éxito
      try {
        // 1. Email al usuario
        await resend.emails.send({
          from: 'SoloCasasChile <contacto@solocasaschile.com>',
          to: [userEmail || 'soporte@solocasaschile.com'],
          subject: '¡Tu plan de SoloCasasChile ha sido activado! 🚀',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border-radius: 20px; overflow: hidden; border: 1px solid #eee;">
               <div style="background: #4f46e5; padding: 40px; text-align: center; color: white;">
                  <h1 style="margin: 0; font-size: 24px;">¡Bienvenido a ${plan.toUpperCase()}!</h1>
               </div>
               <div style="padding: 40px; color: #334155; line-height: 1.6;">
                  <p>Hola <strong>${updatedData?.nombre}</strong>,</p>
                  <p>Tu pago ha sido procesado exitosamente. Tu suscripción ya está activa y puedes disfrutar de todas las ventajas de tu nuevo plan.</p>
                  <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
                     <p style="margin: 5px 0;"><strong>Plan:</strong> ${plan.toUpperCase()}</p>
                     <p style="margin: 5px 0;"><strong>Ciclo:</strong> ${billing === 'yearly' ? 'Anual' : 'Mensual'}</p>
                     <p style="margin: 5px 0;"><strong>Próxima renovación:</strong> ${nextBilling.toLocaleDateString('es-CL')}</p>
                  </div>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: block; background: #4f46e5; color: white; text-align: center; padding: 15px; border-radius: 10px; text-decoration: none; font-weight: bold;">Ir a mi Panel</a>
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
              <p><strong>Ciclo:</strong> ${billing === 'yearly' ? 'Anual' : 'Mensual'}</p>
              <p><strong>Orden Flow:</strong> ${flowOrder}</p>
            </div>
          `
        });
      } catch (e) { console.error('Email error:', e); }

      return NextResponse.json({ message: 'Pago procesado y plan activado.' });
    }

    // --- CASO B: PAGO RECHAZADO (Estado 3) ---
    if (statusResult.status === 3) {
      console.warn(`[FLOW] Pago rechazado para constructora ${constructoraId}`);
      
      try {
        await resend.emails.send({
          from: 'SoloCasasChile <sistema@solocasaschile.cl>',
          to: [userEmail || 'soporte@solocasaschile.cl'],
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
      } catch (e) { console.error('Email error:', e); }

      return NextResponse.json({ message: 'Pago rechazado, notificación enviada.' });
    }

    // --- CASO C: PAGO ANULADO (Estado 4) ---
    if (statusResult.status === 4) {
      console.info(`[FLOW] Pago anulado por el usuario: ${constructoraId}`);
      return NextResponse.json({ message: 'Pago anulado por el usuario.' });
    }

    return NextResponse.json({ message: 'Webhook recibido.' });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Ocurrió un error al procesar el webhook.' }, { status: 500 });
  }
}
