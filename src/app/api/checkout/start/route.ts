import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { FlowService } from "@/lib/payments/flow";
import { getUfValue } from "@/lib/payments/uf";
import {
  getBillingCycleLabel,
  getCheckoutCoupon,
  getCheckoutPriceWithCoupon,
  normalizeCouponCode,
} from "@/lib/payments/plans";
import { getRequestId, logError, logInfo, logWarn } from "@/lib/observability-logger";

const CheckoutStartSchema = z.object({
  plan: z.enum(["basic", "crece", "pro", "premium"]),
  billing: z.enum(["monthly", "semiannual", "yearly"]),
  email: z.string().email().max(180),
  password: z.string().max(100).optional().default(""),
  companyName: z.string().min(2).max(140),
  repName: z.string().min(2).max(140),
  phone: z.string().min(6).max(40),
  rut: z.string().max(30).optional().default(""),
  couponCode: z.string().max(40).optional().default(""),
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
    const admin = createAdminClient();
    const supabase = await createClient();
    const { data: { user: sessionUser } } = await supabase.auth.getUser();

    let signedInUserId: string | null = null;
    let email = payload.email.trim().toLowerCase();

    if (sessionUser) {
      // Usuario ya autenticado previamente
      signedInUserId = sessionUser.id;
      if (sessionUser.email) {
        email = sessionUser.email.toLowerCase().trim();
      }
    } else {
      // Usuario no autenticado: requiere contraseña de cuenta
      if (!payload.password || payload.password.length < 6) {
        return NextResponse.json(
          { error: "La contraseña debe tener al menos 6 caracteres." },
          { status: 400 }
        );
      }

      const createdUser = await admin.auth.admin.createUser({
        email,
        password: payload.password,
        email_confirm: true,
        user_metadata: {
          nombre: payload.companyName.trim(),
          representante: payload.repName.trim(),
          telefono: payload.phone.trim(),
          rut: payload.rut?.trim() || "",
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
        signedInUserId = createdUser.data.user.id;
      }

      const signIn = await supabase.auth.signInWithPassword({
        email,
        password: payload.password,
      });

      if (signIn.error || !signIn.data.user) {
        return NextResponse.json(
          {
            error:
              "Este email ya tiene una cuenta registrada. Si es tuya, inicia sesión en /login y luego vuelve al checkout para continuar.",
          },
          { status: 409 }
        );
      }

      signedInUserId = signIn.data.user.id;
    }

    if (!signedInUserId) {
      return NextResponse.json(
        { error: "No pudimos identificar la sesión de usuario." },
        { status: 401 }
      );
    }

    // Sincronizar metadata de auth
    try {
      await admin.auth.admin.updateUserById(signedInUserId, {
        user_metadata: {
          nombre: payload.companyName.trim(),
          representante: payload.repName.trim(),
          telefono: payload.phone.trim(),
          rut: payload.rut?.trim() || "",
          plan: payload.plan,
        },
      });
    } catch (metaErr) {
      console.warn("No se pudo actualizar metadata en checkout:", metaErr);
    }

    // Buscar constructora previa para consolidar y no perder columnas
    const { data: existingConst } = await admin
      .from("constructoras")
      .select("*")
      .eq("id", signedInUserId)
      .maybeSingle();

    const baseSlug = slugify(payload.companyName);
    const fallbackSlug = `${baseSlug || "constructora"}-${signedInUserId.slice(0, 5)}`;
    const { updated_at: _unused, ...safeExisting } = existingConst || {};

    const constructoraPayload = {
      ...safeExisting,
      id: signedInUserId,
      nombre: payload.companyName.trim(),
      slug: existingConst?.slug || fallbackSlug,
      email,
      telefono: payload.phone.trim() || existingConst?.telefono || null,
      rut: payload.rut?.trim() || existingConst?.rut || null,
      plan: payload.plan,
      plan_cycle: payload.billing,
      plan_status: "pending",
      verificada: existingConst?.verificada ?? false,
      score_confianza: existingConst?.score_confianza ?? 50,
    };

    const { error: profileError } = await admin
      .from("constructoras")
      .upsert([constructoraPayload], { onConflict: "id" });

    if (profileError) {
      logError("checkout_start_profile_upsert_failed", route, requestId, profileError, {
        userId: signedInUserId,
        ms: Date.now() - start,
      });
      return NextResponse.json(
        { error: "No pudimos preparar tu perfil de constructora." },
        { status: 500 }
      );
    }

    const normalizedCouponCode = normalizeCouponCode(payload.couponCode);
    const coupon = normalizedCouponCode ? getCheckoutCoupon(normalizedCouponCode) : null;

    if (normalizedCouponCode && !coupon) {
      return NextResponse.json(
        { error: "El cupon ingresado no es valido o ya expiro." },
        { status: 400 }
      );
    }

    const ufValue = await getUfValue();
    const price = getCheckoutPriceWithCoupon(payload.plan, payload.billing, normalizedCouponCode);
    const amountClp = Math.round(price.totalUf * ufValue);
    const subject = `SoloCasasChile ${payload.plan.toUpperCase()} ${getBillingCycleLabel(payload.billing)}`;

    const flowResult = await FlowService.createPayment({
      subject,
      amount: amountClp,
      email,
      externalId: signedInUserId,
      optional: {
        constructoraId: signedInUserId,
        plan: payload.plan,
        billing: payload.billing,
        uf_valor_usado: String(ufValue),
        subtotal_uf: String(price.subtotalUf),
        descuento_uf: String(price.discountUf),
        coupon_code: coupon?.code ?? "",
        coupon_percent_off: coupon ? String(coupon.percentOff) : "",
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
      userId: signedInUserId,
      plan: payload.plan,
      billing: payload.billing,
      coupon: coupon?.code ?? null,
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
