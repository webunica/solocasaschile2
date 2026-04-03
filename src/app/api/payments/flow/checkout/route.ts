import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { FlowService } from '@/lib/payments/flow';

// Valor fijo UF (puedes consultarlo vía API en el futuro si gustas)
const UF_VALOR = 38500;

const PLAN_PRICES = {
  pro: {
    monthly: 1.9 * UF_VALOR,
    yearly: 0.95 * 12 * UF_VALOR,
  },
  premium: {
    monthly: 2.9 * UF_VALOR,
    yearly: 1.45 * 12 * UF_VALOR,
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
    const { plan, billing } = await req.json();

    if (!['pro', 'premium'].includes(plan)) {
      return NextResponse.json({ error: 'Plan no válido.' }, { status: 400 });
    }

    const amount = PLAN_PRICES[plan as keyof typeof PLAN_PRICES][billing === 'yearly' ? 'yearly' : 'monthly'];
    const subject = `Suscripción Plan ${plan.toUpperCase()} (${billing === 'yearly' ? 'Anual' : 'Mensual'})`;

    // 1. Crear el pago en Flow
    const flowResult = await FlowService.createPayment({
      subject,
      amount: Math.round(amount),
      email: user.email!,
      externalId: user.id,
      optional: {
        'optional[plan]': plan,
        'optional[billing]': billing
      }
    });

    // 2. Devolvemos la URL de redirección
    return NextResponse.json({ url: `${flowResult.url}?token=${flowResult.token}` });

  } catch (error: any) {
    console.error('Checkout Error:', error.message);
    return NextResponse.json({ 
      error: error.message.includes('Flow Payment Create Failed') 
        ? 'Error de comunicación con Flow. Verifica tus API Keys.' 
        : 'Ocurrió un error al procesar el pago. Intenta de nuevo.' 
    }, { status: 500 });
  }
}
