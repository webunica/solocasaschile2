export type LeadFunnelStage =
  | "nuevo"
  | "contactado"
  | "calificado"
  | "diagnostico"
  | "cotizacion_enviada"
  | "negociacion"
  | "cerrado_ganado"
  | "cerrado_perdido"
  | "postventa";

export type FunnelStageDefinition = {
  key: LeadFunnelStage;
  label: string;
  objective: string;
  action: string;
  sla: string;
  kpi: string;
  next: LeadFunnelStage;
  nextLabel: string;
};

export const LEAD_FUNNEL_STAGES: FunnelStageDefinition[] = [
  {
    key: "nuevo",
    label: "Nuevo",
    objective: "Confirmar recepcion del lead.",
    action: "Responder y asignar ejecutivo.",
    sla: "Inmediato",
    kpi: "% leads contactados",
    next: "contactado",
    nextLabel: "Marcar contactado",
  },
  {
    key: "contactado",
    label: "Contactado",
    objective: "Lograr primer contacto real.",
    action: "Enviar WhatsApp y correo inicial.",
    sla: "< 15 min",
    kpi: "Tiempo primera respuesta",
    next: "calificado",
    nextLabel: "Marcar calificado",
  },
  {
    key: "calificado",
    label: "Calificado",
    objective: "Validar fit de presupuesto y plazo.",
    action: "Levantar datos clave del proyecto.",
    sla: "< 24 h",
    kpi: "% leads calificados",
    next: "diagnostico",
    nextLabel: "Pasar a diagnostico",
  },
  {
    key: "diagnostico",
    label: "Diagnostico",
    objective: "Recomendar mejor alternativa.",
    action: "Enviar 2-3 modelos ajustados.",
    sla: "< 48 h",
    kpi: "% apertura propuesta",
    next: "cotizacion_enviada",
    nextLabel: "Enviar cotizacion",
  },
  {
    key: "cotizacion_enviada",
    label: "Cotizacion enviada",
    objective: "Presentar oferta formal.",
    action: "Entregar cotizacion y CTA de avance.",
    sla: "< 72 h",
    kpi: "% cotizaciones respondidas",
    next: "negociacion",
    nextLabel: "Pasar a negociacion",
  },
  {
    key: "negociacion",
    label: "Negociacion",
    objective: "Resolver objeciones y cerrar.",
    action: "Seguimientos en dias 2, 5 y 10.",
    sla: "10 dias",
    kpi: "% avance a cierre",
    next: "cerrado_ganado",
    nextLabel: "Marcar cierre ganado",
  },
  {
    key: "cerrado_ganado",
    label: "Cierre ganado",
    objective: "Confirmar conversion a cliente.",
    action: "Registrar pago/reserva y proximo hito.",
    sla: "Inmediato",
    kpi: "Tasa de cierre",
    next: "postventa",
    nextLabel: "Mover a postventa",
  },
  {
    key: "cerrado_perdido",
    label: "Cierre perdido",
    objective: "Documentar motivo de perdida.",
    action: "Enviar secuencia de reactivacion.",
    sla: "24 h",
    kpi: "% reactivacion",
    next: "nuevo",
    nextLabel: "Reactivar lead",
  },
  {
    key: "postventa",
    label: "Postventa",
    objective: "Generar recomendacion y referidos.",
    action: "Solicitar testimonio y referido.",
    sla: "15-30 dias",
    kpi: "% referidos",
    next: "nuevo",
    nextLabel: "Nuevo ciclo",
  },
];

export const LEAD_FUNNEL_STAGE_MAP: Record<LeadFunnelStage, FunnelStageDefinition> = LEAD_FUNNEL_STAGES.reduce(
  (acc, stage) => {
    acc[stage.key] = stage;
    return acc;
  },
  {} as Record<LeadFunnelStage, FunnelStageDefinition>
);

export type CommunicationTemplate = {
  id: string;
  stage: LeadFunnelStage;
  name: string;
  subject: string;
  message: string;
  mode: "text" | "html";
};

export const COMMUNICATION_TEMPLATES: CommunicationTemplate[] = [
  {
    id: "nuevo-acuse",
    stage: "nuevo",
    name: "Acuse inmediato",
    subject: "Recibimos tu solicitud en SoloCasasChile",
    message:
      "Hola {{nombre}}, recibimos tu solicitud sobre {{modelo}}. Un asesor te contactara en breve para ayudarte con precios, tiempos y opciones segun tu region.",
    mode: "text",
  },
  {
    id: "contactado-primer-contacto",
    stage: "contactado",
    name: "Primer contacto",
    subject: "Te ayudo a cotizar {{modelo}} hoy",
    message:
      "Hola {{nombre}}, soy {{ejecutivo}}. Ya revise tu solicitud y hoy te puedo enviar opciones ajustadas a tu presupuesto y plazo. Prefieres respuesta por WhatsApp o correo?",
    mode: "text",
  },
  {
    id: "calificado-brief",
    stage: "calificado",
    name: "Brief de calificacion",
    subject: "Para enviarte una propuesta precisa",
    message:
      "Para recomendarte la mejor opcion necesito 4 datos: presupuesto estimado, region/comuna, fecha ideal de inicio y superficie aproximada. Con eso te envio alternativas concretas.",
    mode: "text",
  },
  {
    id: "diagnostico-opciones",
    stage: "diagnostico",
    name: "Recomendacion de opciones",
    subject: "Estas 3 opciones calzan con tu proyecto",
    message:
      "Segun tu perfil, te recomiendo: {{opcion_1}}, {{opcion_2}} y {{opcion_3}}. Si quieres, hoy coordinamos una llamada de 15 minutos para elegir la mejor.",
    mode: "text",
  },
  {
    id: "cotizacion-enviada",
    stage: "cotizacion_enviada",
    name: "Cotizacion enviada",
    subject: "Tu cotizacion de {{modelo}} ya esta lista",
    message:
      "Te envie la cotizacion con detalle de precio, alcance y tiempos. Si estas de acuerdo, el siguiente paso es confirmar reunion tecnica o reserva.",
    mode: "text",
  },
  {
    id: "negociacion-objeciones",
    stage: "negociacion",
    name: "Resolucion de objeciones",
    subject: "Que te falta para avanzar con tu proyecto?",
    message:
      "Quiero ayudarte a decidir con tranquilidad. Si tienes dudas de precio, plazos o especificaciones, te respondo hoy mismo y ajustamos la propuesta.",
    mode: "text",
  },
  {
    id: "ganado-onboarding",
    stage: "cerrado_ganado",
    name: "Onboarding cliente",
    subject: "Bienvenido! Confirmacion de inicio",
    message:
      "Gracias por confiar en nosotros. Tu proyecto quedo confirmado. Proximo paso: {{hito_siguiente}} en fecha {{fecha}}. Te acompanaremos en todo el proceso.",
    mode: "text",
  },
  {
    id: "postventa-referidos",
    stage: "postventa",
    name: "Testimonio y referidos",
    subject: "Nos compartes tu experiencia?",
    message:
      "Nos alegra haberte acompanado. Podrias dejarnos una resena corta? Si conoces a alguien que quiera cotizar, podemos ayudarle igual de rapido.",
    mode: "text",
  },
];

export function normalizeLeadStage(raw: string | null | undefined): LeadFunnelStage {
  if (!raw) return "nuevo";
  if (raw === "convertido") return "cerrado_ganado";
  if (raw === "seguimiento") return "negociacion";

  const match = LEAD_FUNNEL_STAGES.find((stage) => stage.key === raw);
  return match?.key ?? "nuevo";
}

export function getNextLeadStage(current: string | null | undefined): LeadFunnelStage {
  const normalized = normalizeLeadStage(current);
  return LEAD_FUNNEL_STAGE_MAP[normalized].next;
}
