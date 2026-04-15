import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { FlowService } from '@/lib/payments/flow';
import { getUfValue } from '@/lib/payments/uf';
import { getRequestId, logError, logInfo, logWarn } from '@/lib/observability-logger';
import { z } from 'zod';

const CheckoutSchema = z.object({
  plan: z.enum(['avanza', 'pro', 'premium']),
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

const PLAN_PRICES_CLP_NET = {
  avanza: {
    monthly: 25000,
    yearly: 25000 * 12,
  },
} as const;

const IVA_RATE = 0.19;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export async function POST(req: NextRequest) {
  const route = '/api/payments/flow/checkout';
  const requestId = getRequestId(req);
  const start = Date.now();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    logWarn('flow_checkout_unauthorized', route, requestId, {
      ms: Date.now() - start,
    });
    return NextResponse.json({ error: 'Debes iniciar sesión para realizar un pago.' }, { status: 401 });
  }

  // Verificar configuración antes de seguir
  if (!process.env.FLOW_API_KEY || !process.env.FLOW_SECRET_KEY) {
    logError('flow_checkout_config_missing', route, requestId, new Error('missing_flow_env'));
    return NextResponse.json({ 
      error: 'La pasarela de pago no está configurada correctamente. Contacta a soporte.' 
    }, { status: 500 });
  }

  try {
    const body = await req.json();
    const validation = CheckoutSchema.safeParse(body);
    
    if (!validation.success) {
      logWarn('flow_checkout_validation_failed', route, requestId, {
        ms: Date.now() - start,
      });
      return NextResponse.json({ error: 'Datos de suscripción no válidos.', details: validation.error.format() }, { status: 400 });
    }

    const { plan, billing } = validation.data;

    // 0. Obtener valor dinámico de la UF
    const billingKey = billing === 'yearly' ? 'yearly' : 'monthly';
    const isClpPlan = plan in PLAN_PRICES_CLP_NET;
    const valorUfActual = isClpPlan ? null : await getUfValue();
    const amountClp = isClpPlan
      ? Math.round(PLAN_PRICES_CLP_NET[plan as keyof typeof PLAN_PRICES_CLP_NET][billingKey] * (1 + IVA_RATE))
      : Math.round(PLAN_PRICES_UF[plan as keyof typeof PLAN_PRICES_UF][billingKey] * valorUfActual!);

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
        'optional[uf_valor_usado]': valorUfActual ? String(valorUfActual) : '',
        'optional[precio_neto_clp]': isClpPlan ? String(PLAN_PRICES_CLP_NET[plan as keyof typeof PLAN_PRICES_CLP_NET][billingKey]) : '',
        'optional[iva_rate]': isClpPlan ? String(IVA_RATE) : ''
      }
    });

    // 2. Devolvemos la URL de redirección
    logInfo('flow_checkout_created', route, requestId, {
      plan,
      billing,
      flowOrder: String(flowResult.flowOrder),
      amountClp,
      ms: Date.now() - start,
    });

    return NextResponse.json({ 
        url: `${flowResult.url}?token=${flowResult.token}`,
        order: flowResult.flowOrder 
    });

  } catch (error: unknown) {
    const message = getErrorMessage(error);
    logError('flow_checkout_failed', route, requestId, error, {
      ms: Date.now() - start,
    });
    return NextResponse.json({ 
      error: message.includes('Flow Payment Create Failed') 
        ? `Error de comunicación con Flow: ${message}` 
        : 'Ocurrió un error al procesar el pago. Intenta de nuevo.' 
    }, { status: 500 });
  }
}
