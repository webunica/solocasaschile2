import { sendGAEvent } from "@next/third-parties/google";

/**
 * Tipos de eventos para SolocasasChile en GA4.
 * Diferencia explícitamente entre la audiencia de Compradores (busca casa)
 * y la audiencia de Constructoras (publica modelos / planes).
 */

export type UserAudience = "comprador" | "constructora";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
    dataLayer?: Object[];
  }
}

/**
 * Envío seguro de eventos a Google Analytics sin duplicar scripts
 * y tolerante a bloqueadores de anuncios o entornos SSR.
 */
function trackEvent(action: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  const payload = {
    ...params,
    timestamp: new Date().toISOString(),
  };

  try {
    // 1. Usar sendGAEvent de @next/third-parties/google
    sendGAEvent("event", action, payload);
  } catch {
    // 2. Fallback seguro a window.gtag si estuviera presente
    if (typeof window.gtag === "function") {
      window.gtag("event", action, payload);
    }
  }
}

// ── Eventos de Compradores ──────────────────────────────────────────────────

/**
 * Registra un clic hacia el catálogo de modelos
 */
export function trackCatalogoClick(source: "header" | "hero" | "featured" | "footer" | "banner" | "search" | "final_cta") {
  trackEvent("catalogo_click", {
    audiencia: "comprador" as UserAudience,
    source,
  });
}

/**
 * Registra la visualización de una ficha técnica de modelo
 */
export function trackFichaView(params: {
  modelId: string;
  modelName: string;
  constructoraId: string;
  constructoraName: string;
  tipo?: string;
  precioUf?: number;
}) {
  trackEvent("ficha_view", {
    audiencia: "comprador" as UserAudience,
    model_id: params.modelId,
    model_name: params.modelName,
    constructora_id: params.constructoraId,
    constructora_name: params.constructoraName,
    tipo_construccion: params.tipo || "prefabricada",
    precio_uf: params.precioUf || 0,
  });
}

/**
 * Registra el inicio del proceso de cotización (apertura de modal o foco en formulario)
 */
export function trackCotizacionStart(params: {
  source: "hero_form" | "model_modal" | "model_sticky" | "model_sidebar";
  modelId?: string;
  constructoraId?: string;
}) {
  trackEvent("cotizacion_start", {
    audiencia: "comprador" as UserAudience,
    source: params.source,
    model_id: params.modelId || null,
    constructora_id: params.constructoraId || null,
  });
}

/**
 * Registra el envío exitoso de una cotización
 */
export function trackCotizacionSubmit(params: {
  source: "hero_form" | "model_modal";
  modelId?: string;
  constructoraId?: string;
  region?: string;
}) {
  trackEvent("cotizacion_submit", {
    audiencia: "comprador" as UserAudience,
    source: params.source,
    model_id: params.modelId || null,
    constructora_id: params.constructoraId || null,
    region: params.region || null,
  });
}

// ── Eventos de Constructoras ────────────────────────────────────────────────

/**
 * Registra el acceso hacia la sección o página para constructoras
 */
export function trackConstructorasAccessClick(source: "header" | "hero" | "footer" | "banner" | "final_cta") {
  trackEvent("constructoras_access_click", {
    audiencia: "constructora" as UserAudience,
    source,
  });
}

/**
 * Registra la visualización de la página de planes o información para constructoras
 */
export function trackPlanesView(source?: string) {
  trackEvent("planes_view", {
    audiencia: "constructora" as UserAudience,
    source: source || "direct",
  });
}

/**
 * Registra el inicio del registro de constructora
 */
export function trackRegistroStart(plan: string = "gratis") {
  trackEvent("registro_start", {
    audiencia: "constructora" as UserAudience,
    plan,
  });
}

/**
 * Registra el clic para iniciar el checkout de un plan pagado.
 * NOTA: Esto representa intención de compra, NO una venta confirmada.
 */
export function trackPlanCheckoutClick(params: {
  plan: string;
  billing: "monthly" | "yearly" | "semiannual";
  priceUf: number;
}) {
  trackEvent("plan_checkout_click", {
    audiencia: "constructora" as UserAudience,
    plan: params.plan,
    billing_cycle: params.billing,
    precio_uf: params.priceUf,
  });
}

/**
 * Registra la confirmación verificada de compra de un plan (venta real en /dashboard/success).
 */
export function trackPlanPurchaseConfirmed(params: {
  plan: string;
  constructoraNombre?: string;
}) {
  trackEvent("plan_purchase_confirmed", {
    audiencia: "constructora" as UserAudience,
    plan: params.plan,
    constructora_nombre: params.constructoraNombre || "Desconocida",
    is_conversion: true,
  });
}
