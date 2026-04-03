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

  try {
    const { plan, billing } = await req.json();

    if (!['pro', 'premium'].includes(plan)) {
      return NextResponse.json({ error: 'Plan no válido.' }, { status: 400 });
    }

    const amount = PLAN_PRICES[plan as keyof typeof PLAN_PRICES][billing === 'yearly' ? 'yearly' : 'monthly'];
    const subject = `Suscripción SolocasasChile - Plan ${plan.toUpperCase()} (${billing === 'yearly' ? 'Anual' : 'Mensual'})`;

    // 1. Crear el pago en Flow
    const flowResult = await FlowService.createPayment({
      subject,
      amount: Math.round(amount),
      email: user.email!,
      externalId: user.id, // Usamos el ID de la constructora/usuario
      optional: {
        'optional[plan]': plan,
        'optional[billing]': billing
      }
    });

    // 2. Devolvemos la URL de redirección
    return NextResponse.json({ url: `${flowResult.url}?token=${flowResult.token}` });

  } catch (error: any) {
    console.error('Checkout Error:', error);
    return NextResponse.json({ error: 'Ocurrió un error al procesar el pago. Intenta de nuevo.' }, { status: 500 });
  }
}
