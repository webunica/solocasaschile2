import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { FlowService } from '@/lib/payments/flow';
import { resend } from '@/lib/resend';

/**
 * Recibe la confirmación de pago de Flow (Webhook)
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const token = formData.get('token') as string;

    if (!token) {
      return NextResponse.json({ error: 'Token no encontrado' }, { status: 400 });
    }

    console.info(`[FLOW-WEBHOOK] Procesando confirmación para token: ${token}`);

    // 1. Validar el estado real del pago llamando a la API de Flow
    const statusResult = await FlowService.getPaymentStatus(token);

        // Flow status: 1: Pendiente, 2: Pagado, 3: Rechazado, 4: Anulado
    if (statusResult.status === 2) {
      const constructoraId = statusResult.optional?.constructoraId;
      const plan = statusResult.optional?.plan || 'pro';
      const billing = statusResult.optional?.billing || 'monthly';
      const userEmail = statusResult.payer; // Flow devuelve el email del pagador

      if (!constructoraId) {
        console.error('Webhook Error: constructoraId not found in statusResult.optional');
        return NextResponse.json({ error: 'ID de constructora no encontrado en los parámetros del pago' }, { status: 400 });
      }

      const supabase = await createClient();

      // Calcular fecha de próximo cobro
      const nextBilling = new Date();
      if (billing === 'yearly') {
        nextBilling.setFullYear(nextBilling.getFullYear() + 1);
      } else {
        nextBilling.setMonth(nextBilling.getMonth() + 1);
      }

      // 2. Activar la suscripción automáticamente en la base de datos
      const { error, data: updatedData } = await supabase
        .from('constructoras')
        .update({
          plan: plan,
          plan_cycle: billing,
          plan_status: 'active',
          next_billing_date: nextBilling.toISOString(),
          verificada: true // Auto-verificar al pagar (opcional según lógica de negocio)
        })
        .eq('id', constructoraId)
        .select('nombre')
        .single();

      if (error) {
        console.error('Webhook Error (Database Update):', error);
        return NextResponse.json({ error: 'Error al actualizar base de datos' }, { status: 500 });
      }

      // 3. Enviar email de confirmación
      try {
        await resend.emails.send({
          from: 'SoloCasasChile <sistema@solocasaschile.cl>',
          to: [userEmail || 'soporte@solocasaschile.cl'],
          subject: '¡Tu plan de SoloCasasChile ha sido activado! 🚀',
          html: `
            <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #f1f5f9; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
              <!-- Header with Logo -->
              <div style="background-color: #ffffff; padding: 40px 0; text-align: center; border-bottom: 1px solid #f8fafc;">
                <img src="${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png" alt="SoloCasasChile" style="height: 48px; width: auto;" />
              </div>

              <!-- Main Content -->
              <div style="padding: 40px;">
                <h1 style="color: #0f172a; font-size: 28px; font-weight: 800; margin: 0 0 16px 0; letter-spacing: -0.025em; text-align: center;">¡Suscripción Activada! 🚀</h1>
                <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0; text-align: center;">Hola, <strong>${updatedData?.nombre || 'Constructora'}</strong>. Tu pago ha sido procesado exitosamente por Flow y tu cuenta ha sido actualizada automáticamente.</p>
                
                <div style="background-color: #f8fafc; border-radius: 16px; padding: 32px;">
                  <h2 style="color: #0f172a; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 16px 0; opacity: 0.6;">Resumen de tu Plan</h2>
                  
                  <div style="border-bottom: 1px solid #e2e8f0; padding: 12px 0; display: flex; justify-content: space-between;">
                    <span style="color: #64748b; font-weight: 500;">Plan Seleccionado</span>
                    <span style="color: #4f46e5; font-weight: 800;">${plan.toUpperCase()}</span>
                  </div>
                  
                  <div style="border-bottom: 1px solid #e2e8f0; padding: 12px 0; display: flex; justify-content: space-between;">
                    <span style="color: #64748b; font-weight: 500;">Ciclo de Facturación</span>
                    <span style="color: #0f172a; font-weight: 700;">${billing === 'yearly' ? 'Anual (50% OFF)' : 'Mensual'}</span>
                  </div>

                  <div style="padding: 12px 0; display: flex; justify-content: space-between;">
                    <span style="color: #64748b; font-weight: 500;">Próximo Cobro</span>
                    <span style="color: #0f172a; font-weight: 700;">${nextBilling.toLocaleDateString('es-CL')}</span>
                  </div>
                </div>

                <!-- Action Button -->
                <div style="margin-top: 40px; text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.4);">Ir al Dashboard de Constructora</a>
                </div>

                <p style="color: #94a3b8; font-size: 14px; margin-top: 40px; text-align: center;">
                  Desde ahora tu perfil aparecerá como <strong>Verificado</strong> y podrás publicar todos tus modelos según los límites de tu nuevo plan.
                </p>
              </div>

              <!-- Footer -->
              <div style="background-color: #f8fafc; padding: 24px; text-align: center;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; 2026 SoloCasasChile. Todos los derechos reservados.</p>
                <p style="color: #94a3b8; font-size: 12px; margin: 12px 0 0 0;">Si tienes cualquier duda, contáctanos respondiendo a este correo o vía soporte prioritario en WhatsApp.</p>
              </div>
            </div>
          `
        });
        console.info(`[FLOW-EMAIL] Correo de éxito enviado a ${userEmail}`);
      } catch (emailError) {
        console.error('Email Send Error:', emailError);
        // No fallamos la respuesta porque el pago ya fue procesado y la DB actualizada
      }

      console.info(`[FLOW] El pago ha sido procesado con éxito para la constructora ${constructoraId}.`);
      return NextResponse.json({ message: 'Pago confirmado y plan activado.' });
    }

    return NextResponse.json({ message: 'Pago recibido (estado no pagado todavía).' });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Ocurrió un error al procesar el webhook.' }, { status: 500 });
  }
}
