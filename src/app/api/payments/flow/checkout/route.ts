import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { FlowService } from "@/lib/payments/flow";
import { getUfValue } from "@/lib/payments/uf";
import {
  getRequestId,
  logError,
  logInfo,
  logWarn,
  withRequestIdHeaders,
} from "@/lib/observability-logger";
import { createClient } from "@/lib/supabase/server";

const CheckoutSchema = z.object({
  plan: z.enum(["avanza", "pro", "premium"]),
  billing: z.enum(["monthly", "yearly"]),
});

const PLAN_PRICES_UF = {
  pro: {
    monthly: 0.6,
    yearly: 0.48 * 12,
  },
  premium: {
    monthly: 2.9,
    yearly: 1.45 * 12,
  },
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
  const route = "/api/payments/flow/checkout";
  const requestId = getRequestId(req);
  const start = Date.now();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logWarn("flow_checkout_unauthorized", route, requestId, {
      ms: Date.now() - start,
    });
    return NextResponse.json(
      { error: "Debes iniciar sesion para realizar un pago." },
      withRequestIdHeaders({ status: 401 }, requestId)
    );
  }

  if (!process.env.FLOW_API_KEY || !process.env.FLOW_SECRET_KEY) {
    logError("flow_checkout_config_missing", route, requestId, new Error("missing_flow_env"));
    return NextResponse.json(
      { error: "La pasarela de pago no esta configurada correctamente. Contacta a soporte." },
      withRequestIdHeaders({ status: 500 }, requestId)
    );
  }

  try {
    const body = await req.json();
    const validation = CheckoutSchema.safeParse(body);

    if (!validation.success) {
      logWarn("flow_checkout_validation_failed", route, requestId, {
        ms: Date.now() - start,
      });
      return NextResponse.json(
        { error: "Datos de suscripcion no validos.", details: validation.error.format() },
        withRequestIdHeaders({ status: 400 }, requestId)
      );
    }

    const { plan, billing } = validation.data;
    const billingKey = billing === "yearly" ? "yearly" : "monthly";
    const isClpPlan = plan in PLAN_PRICES_CLP_NET;
    const valorUfActual = isClpPlan ? null : await getUfValue();
    const amountClp = isClpPlan
      ? Math.round(
          PLAN_PRICES_CLP_NET[plan as keyof typeof PLAN_PRICES_CLP_NET][billingKey] * (1 + IVA_RATE)
        )
      : Math.round(PLAN_PRICES_UF[plan as keyof typeof PLAN_PRICES_UF][billingKey] * valorUfActual!);

    const subject = `SoloCasasChile ${plan.toUpperCase()} ${billing === "yearly" ? "Anual" : "Mensual"}`;

    const flowResult = await FlowService.createPayment({
      subject,
      amount: amountClp,
      email: user.email!,
      externalId: user.id,
      optional: {
        constructoraId: user.id,
        plan,
        billing,
        uf_valor_usado: valorUfActual ? String(valorUfActual) : "",
        precio_neto_clp: isClpPlan
          ? String(PLAN_PRICES_CLP_NET[plan as keyof typeof PLAN_PRICES_CLP_NET][billingKey])
          : "",
        iva_rate: isClpPlan ? String(IVA_RATE) : "",
      },
    });

    logInfo("flow_checkout_created", route, requestId, {
      plan,
      billing,
      flowOrder: String(flowResult.flowOrder),
      amountClp,
      ms: Date.now() - start,
    });

    return NextResponse.json(
      {
        url: `${flowResult.url}?token=${flowResult.token}`,
        order: flowResult.flowOrder,
      },
      withRequestIdHeaders({}, requestId)
    );
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    logError("flow_checkout_failed", route, requestId, error, {
      ms: Date.now() - start,
    });
    return NextResponse.json(
      {
        error: message.includes("Flow Payment Create Failed")
          ? `Error de comunicacion con Flow: ${message}`
          : "Ocurrio un error al procesar el pago. Intenta de nuevo.",
      },
      withRequestIdHeaders({ status: 500 }, requestId)
    );
  }
}
