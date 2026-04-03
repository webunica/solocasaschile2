import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { FlowService } from '@/lib/payments/flow';

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

    // 1. Validar el estado real del pago llamando a la API de Flow
    const statusResult = await FlowService.getPaymentStatus(token);

    // Flow status: 1: Pendiente, 2: Pagado, 3: Rechazado, 4: Anulado
    if (statusResult.status === 2) {
      const constructoraId = statusResult.externalId;
      const plan = statusResult.optional?.plan || 'pro'; // Default to pro if missing
      const billing = statusResult.optional?.billing || 'monthly';

      const supabase = await createClient();

      // Calcular fecha de próximo cobro
      const nextBilling = new Date();
      if (billing === 'yearly') {
        nextBilling.setFullYear(nextBilling.getFullYear() + 1);
      } else {
        nextBilling.setMonth(nextBilling.getMonth() + 1);
      }

      // 2. Activar la suscripción automáticamente en la base de datos
      const { error } = await supabase
        .from('constructoras')
        .update({
          plan: plan,
          plan_cycle: billing,
          plan_status: 'active',
          next_billing_date: nextBilling.toISOString()
        })
        .eq('id', constructoraId);

      if (error) {
        console.error('Webhook Error (Database Update):', error);
        return NextResponse.json({ error: 'Error al actualizar base de datos' }, { status: 500 });
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
