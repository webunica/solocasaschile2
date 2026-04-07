import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { FlowService } from '@/lib/payments/flow';
import { getUfValue } from '@/lib/payments/uf';
import { z } from 'zod';

const CheckoutSchema = z.object({
  plan: z.enum(['pro', 'premium']),
  billing: z.enum(['monthly', 'yearly'])
});

const PLAN_PRICES_UF = {
  pro: {
    monthly: 1.9,
    yearly: 0.95 * 12,
  },
  premium: {
    monthly: 2.9,
    yearly: 1.45 * 12,
  }
} as const;

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Debes iniciar sesión para realizar un pago.' }, { status: 401 });
  }

  // Verificar configuración antes de seguir
  if (!process.env.FLOW_API_KEY || !process.env.FLOW_SECRET_KEY) {
    console.error('FLOW_CONFIG_ERROR: Falta API Key o Secret Key de Flow en las variables de entorno.');
    return NextResponse.json({ 
      error: 'La pasarela de pago no está configurada correctamente. Contacta a soporte.' 
    }, { status: 500 });
  }

  try {
    const body = await req.json();
    const validation = CheckoutSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ error: 'Datos de suscripción no válidos.', details: validation.error.format() }, { status: 400 });
    }

    const { plan, billing } = validation.data;

    // 0. Obtener valor dinámico de la UF
    const valorUfActual = await getUfValue();
    const ufAmount = PLAN_PRICES_UF[plan as keyof typeof PLAN_PRICES_UF][billing === 'yearly' ? 'yearly' : 'monthly'];
    const amountClp = Math.round(ufAmount * valorUfActual);

    const subject = `SoloCasasChile ${plan.toUpperCase()} ${billing === 'yearly' ? 'Anual' : 'Mensual'}`;

    // 1. Crear el pago en Flow
    const flowResult = await FlowService.createPayment({
      subject,
      amount: amountClp,
      email: user.email!,
      externalId: user.id,
      optional: {
        'optional[constructoraId]': user.id,
        'optional[plan]': plan,
        'optional[billing]': billing,
        'optional[uf_valor_usado]': String(valorUfActual)
      }
    });

    // 2. Devolvemos la URL de redirección
    return NextResponse.json({ 
        url: `${flowResult.url}?token=${flowResult.token}`,
        order: flowResult.flowOrder 
    });

  } catch (error: any) {
    console.error('[FLOW-CHECKOUT] Detailed Error:', error);
    return NextResponse.json({ 
      error: error.message.includes('Flow Payment Create Failed') 
        ? `Error de comunicación con Flow: ${error.message}` 
        : 'Ocurrió un error al procesar el pago. Intenta de nuevo.' 
    }, { status: 500 });
  }
}
