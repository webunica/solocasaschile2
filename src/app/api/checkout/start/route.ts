import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { FlowService } from "@/lib/payments/flow";
import { getUfValue } from "@/lib/payments/uf";
import { getBillingCycleLabel, getCheckoutPlanPriceUf } from "@/lib/payments/plans";
import { getRequestId, logError, logInfo, logWarn } from "@/lib/observability-logger";

const CheckoutStartSchema = z.object({
  plan: z.literal("pro"),
  billing: z.enum(["monthly", "semiannual", "yearly"]),
  email: z.string().email().max(180),
  password: z.string().min(6).max(100),
  companyName: z.string().min(2).max(140),
  repName: z.string().min(2).max(140),
  phone: z.string().min(6).max(40),
  rut: z.string().max(30).optional().default(""),
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function POST(req: NextRequest) {
  const route = "/api/checkout/start";
  const requestId = getRequestId(req);
  const start = Date.now();

  if (!process.env.FLOW_API_KEY || !process.env.FLOW_SECRET_KEY) {
    logError("checkout_start_flow_config_missing", route, requestId, new Error("missing_flow_env"));
    return NextResponse.json(
      { error: "La pasarela de pago no esta configurada correctamente. Contacta a soporte." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const parsed = CheckoutStartSchema.safeParse(body);

    if (!parsed.success) {
      logWarn("checkout_start_validation_failed", route, requestId, {
        ms: Date.now() - start,
      });
      return NextResponse.json(
        { error: "Revisa los datos del checkout antes de continuar.", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const payload = parsed.data;
    const email = payload.email.trim().toLowerCase();
    const admin = createAdminClient();
    const supabase = await createClient();

    let userId: string | null = null;
    const createdUser = await admin.auth.admin.createUser({
      email,
      password: payload.password,
      email_confirm: true,
      user_metadata: {
        nombre: payload.companyName.trim(),
        representante: payload.repName.trim(),
        plan: payload.plan,
      },
    });

    if (createdUser.error) {
      const isExistingUser = /already|registered|exists/i.test(createdUser.error.message);

      if (!isExistingUser) {
        logWarn("checkout_start_user_create_failed", route, requestId, {
          message: createdUser.error.message,
          ms: Date.now() - start,
        });
        return NextResponse.json(
          { error: "No pudimos crear la cuenta. Intenta nuevamente." },
          { status: 400 }
        );
      }
    } else {
      userId = createdUser.data.user.id;
    }

    const signIn = await supabase.auth.signInWithPassword({
      email,
      password: payload.password,
    });

    if (signIn.error || !signIn.data.user) {
      return NextResponse.json(
        {
          error:
            "Este email ya existe o la clave no coincide. Inicia sesion y vuelve al checkout para pagar.",
        },
        { status: 409 }
      );
    }

    const signedInUserId = signIn.data.user.id;
    userId = signedInUserId;

    const baseSlug = slugify(payload.companyName);
    const constructoraPayload = {
      id: signedInUserId,
      nombre: payload.companyName.trim(),
      slug: `${baseSlug || "constructora"}-${signedInUserId.slice(0, 5)}`,
      email,
      telefono: payload.phone.trim(),
      rut: payload.rut.trim(),
      plan: payload.plan,
      plan_cycle: payload.billing,
      plan_status: "pending",
      verificada: false,
      score_confianza: 50,
    };

    const { error: profileError } = await admin
      .from("constructoras")
      .upsert([constructoraPayload], { onConflict: "id" });

    if (profileError) {
      logError("checkout_start_profile_upsert_failed", route, requestId, profileError, {
        userId,
        ms: Date.now() - start,
      });
      return NextResponse.json(
        { error: "No pudimos preparar tu perfil de constructora." },
        { status: 500 }
      );
    }

    const ufValue = await getUfValue();
    const price = getCheckoutPlanPriceUf(payload.plan, payload.billing);
    const amountClp = Math.round(price.totalUf * ufValue);
    const subject = `SoloCasasChile PRO ${getBillingCycleLabel(payload.billing)}`;

    const flowResult = await FlowService.createPayment({
      subject,
      amount: amountClp,
      email,
      externalId: signedInUserId,
      optional: {
        "optional[constructoraId]": signedInUserId,
        "optional[plan]": payload.plan,
        "optional[billing]": payload.billing,
        "optional[uf_valor_usado]": String(ufValue),
      },
    });

    const { error: paymentError } = await admin.from("pagos").upsert(
      {
        constructora_id: signedInUserId,
        flow_order: String(flowResult.flowOrder),
        token: flowResult.token,
        amount: amountClp,
        status: "pending",
        plan: payload.plan,
        billing_cycle: payload.billing,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "flow_order" }
    );

    if (paymentError) {
      logError("checkout_start_payment_record_failed", route, requestId, paymentError, {
        flowOrder: String(flowResult.flowOrder),
        ms: Date.now() - start,
      });
    }

    logInfo("checkout_start_created", route, requestId, {
      userId,
      plan: payload.plan,
      billing: payload.billing,
      flowOrder: String(flowResult.flowOrder),
      amountClp,
      ms: Date.now() - start,
    });

    return NextResponse.json({
      url: `${flowResult.url}?token=${flowResult.token}`,
      order: flowResult.flowOrder,
    });
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    logError("checkout_start_failed", route, requestId, error, {
      ms: Date.now() - start,
    });
    return NextResponse.json(
      {
        error: message.includes("Flow Payment Create Failed")
          ? `Error de comunicacion con Flow: ${message}`
          : "Ocurrio un error al preparar el checkout. Intenta de nuevo.",
      },
      { status: 500 }
    );
  }
}
