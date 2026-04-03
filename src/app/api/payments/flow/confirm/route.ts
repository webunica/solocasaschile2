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
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; padding: 24px;">
              <h2 style="color: #4f46e5;">¡Felicidades, ${updatedData?.nombre || 'Constructora'}!</h2>
              <p>Tu pago ha sido procesado con éxito y tu plan <strong>${plan.toUpperCase()}</strong> ya está activo.</p>
              <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Detalles de la suscripción:</p>
                <p style="margin: 4px 0; font-weight: bold;">Plan: ${plan.toUpperCase()}</p>
                <p style="margin: 4px 0; font-weight: bold;">Ciclo: ${billing === 'yearly' ? 'Anual (50% OFF)' : 'Mensual'}</p>
                <p style="margin: 4px 0; font-weight: bold;">Próximo Cobro: ${nextBilling.toLocaleDateString('es-CL')}</p>
              </div>
              <p>Ahora puedes publicar tus modelos sin las limitaciones del plan gratuito y destacar en nuestro catálogo nacional.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">Ir al Dashboard</a>
              <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;" />
              <p style="font-size: 12px; color: #9ca3af;">Si tienes dudas, contáctanos vía WhatsApp al soporte dedicado.</p>
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
