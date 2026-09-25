"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  Zap,
  Crown,
  LayoutDashboard,
  Users,
  MessageSquare,
  FileText,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Home,
  Loader2,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  trackPlanesView,
  trackPlanCheckoutClick,
  trackRegistroStart,
} from "@/lib/analytics";

const PLANES = [
  {
    id: "basic",
    nombre: "Plan Basic",
    duracion: "Mensual o Anual",
    precioMensual: "1.0",
    precioAnualEquiv: "0.8",
    precioAnualTotal: "9.6",
    precioOriginal: "1.0",
    badge: "3 MODELOS",
    badgeClass: "bg-muted text-foreground border-border",
    color: "text-muted-foreground",
    bgIcon: "bg-muted",
    borderClass: "border-border/70 hover:border-slate-400",
    resultadoClave: "Publica tus primeros 3 modelos y posiciona tu marca en las búsquedas de tu región.",
    audiencia: "Constructoras que inician su catálogo y buscan presencia técnica verificada.",
    features: [
      { texto: "Hasta 3 modelos en catálogo público", ok: true },
      { texto: "5 fotografías por modelo", ok: true },
      { texto: "Perfil institucional con datos de contacto", ok: true },
      { texto: "Presencia en búsquedas por región", ok: true },
      { texto: "Botón de contacto para cotizar", ok: true },
      { texto: "Recepción de leads directos", ok: false },
      { texto: "Posicionamiento destacado", ok: false },
      { texto: "Campañas en redes y blog", ok: false },
    ],
    cta: "Elegir Plan Basic",
    ctaHref: "/checkout?plan=basic",
    ctaVariant: "outline" as const,
  },
  {
    id: "crece",
    nombre: "Plan Crece",
    duracion: "Mensual o Anual",
    precioMensual: "2.0",
    precioAnualEquiv: "1.6",
    precioAnualTotal: "19.2",
    precioOriginal: "2.0",
    badge: "10 MODELOS + LEADS",
    badgeClass: "bg-blue-600 text-white border-blue-500",
    color: "text-blue-600",
    bgIcon: "bg-blue-50 dark:bg-blue-950/40",
    borderClass: "border-blue-200 dark:border-blue-800 hover:border-blue-400 shadow-md shadow-blue-500/5",
    resultadoClave: "Hasta 10 modelos y recepción directa de clientes potenciales en tu correo y WhatsApp.",
    audiencia: "Empresas en expansión que quieren captación mensual activa de compradores.",
    features: [
      { texto: "Hasta 10 modelos en catálogo público", ok: true },
      { texto: "10 fotografías en alta resolución", ok: true },
      { texto: "Recepción de leads directos (WhatsApp/Email)", ok: true },
      { texto: "Panel CRM de cotizaciones y prospectos", ok: true },
      { texto: "Métricas de visitas y consultas", ok: true },
      { texto: "Galería de proyectos terminados", ok: true },
      { texto: "Posición preferente #1", ok: false },
      { texto: "Campañas en redes y blog", ok: false },
    ],
    cta: "Elegir Plan Crece",
    ctaHref: "/checkout?plan=crece",
    ctaVariant: "default" as const,
  },
  {
    id: "pro",
    nombre: "Plan Pro",
    duracion: "Mensual o Anual",
    precioMensual: "3.0",
    precioAnualEquiv: "2.4",
    precioAnualTotal: "28.8",
    precioOriginal: "3.0",
    badge: "MÁS RECOMENDADO",
    badgeClass: "bg-brand-teal text-white border-brand-teal/30",
    color: "text-brand-teal",
    bgIcon: "bg-brand-teal/10",
    borderClass: "border-brand-teal/50 shadow-xl shadow-brand-teal/15 ring-2 ring-brand-teal/30",
    resultadoClave: "Modelos ilimitados, posicionamiento destacado y flujo continuo de prospectos calificados.",
    audiencia: "Constructoras consolidadas que buscan máxima visibilidad y captación continua.",
    features: [
      { texto: "Modelos y fotos ilimitadas", ok: true },
      { texto: "Posicionamiento destacado en catálogo", ok: true },
      { texto: "Prioridad alta en tu región", ok: true },
      { texto: "Leads prioritarios ilimitados", ok: true },
      { texto: "Sello oficial de Constructora Verificada ✓", ok: true },
      { texto: "Módulo de Seguimiento de Obras", ok: true },
      { texto: "Soporte prioritario vía WhatsApp", ok: true },
      { texto: "Campañas en redes y blog", ok: false },
    ],
    cta: "Elegir Plan Pro",
    ctaHref: "/checkout?plan=pro",
    ctaVariant: "default" as const,
  },
  {
    id: "premium",
    nombre: "Plan Pro+",
    duracion: "Mensual o Anual",
    precioMensual: "4.0",
    precioAnualEquiv: "3.2",
    precioAnualTotal: "38.4",
    precioOriginal: "4.0",
    badge: "MÁXIMA PRIORIDAD",
    badgeClass: "bg-amber-500 text-slate-950 font-black border-amber-400",
    color: "text-amber-500",
    bgIcon: "bg-amber-500/10",
    borderClass: "border-amber-500/50 shadow-xl shadow-amber-500/15 ring-2 ring-amber-500/20",
    resultadoClave: "Todo incluido + posición preferente #1 en tu región y campañas publicitarias activas.",
    audiencia: "Líderes de mercado que quieren dominar su región y recibir recomendación prioritaria.",
    features: [
      { texto: "Todo lo incluido en el Plan Pro", ok: true },
      { texto: "Posición preferente #1 en tu región", ok: true },
      { texto: "Campañas activas en redes sociales y blog", ok: true },
      { texto: "Recomendación prioritaria a cotizantes", ok: true },
      { texto: "Co-marketing y menciones de marca", ok: true },
      { texto: "Asesoría comercial personalizada", ok: true },
      { texto: "Ejecutivo de cuenta dedicado 24/7", ok: true },
      { texto: "Acceso exclusivo constru.solocasaschile.com", ok: true },
    ],
    cta: "Elegir Plan Pro+",
    ctaHref: "/checkout?plan=premium",
    ctaVariant: "default" as const,
  },
];

const FAQS_CONSTRUCTORAS = [
  {
    q: "¿Por qué decimos que la empresa no paga por aparecer sino por clientes potenciales?",
    a: "Estar en una lista estática sin interacción no aporta valor comercial. En SoloCasasChile estructuramos la plataforma para atraer personas que están buscando activamente construir o comprar casas prefabricadas y derivar cotizaciones directas a tu WhatsApp y correo. Con un solo contrato cerrado, tu retorno de inversión está garantizado.",
  },
  {
    q: "¿Cómo se reciben los leads y cotizaciones?",
    a: "A partir del Plan Crece (2 UF), cada cotización ingresada en tus modelos llega directamente a tu panel, correo y WhatsApp con los datos completos del interesado (nombre, teléfono, comuna de construcción y presupuesto estimado). No retenemos clientes ni intermediamos el negocio.",
  },
  {
    q: "¿En qué moneda se cobra y cómo se calcula?",
    a: "Los planes se expresan en Unidades de Fomento (UF) para transparencia y se facturan en pesos chilenos según el valor oficial diario de la UF al momento del pago mediante Flow (Webpay, tarjetas bancarias de débito/crédito y transferencia electrónica). Emitimos factura oficial.",
  },
  {
    q: "¿Existe permanencia forzada?",
    a: "En la modalidad mensual puedes suspender o cambiar tu suscripción en cualquier momento desde tu panel de facturación. La modalidad anual se factura con 20% de descuento directo y te congela el valor durante 12 meses.",
  },
  {
    q: "¿Qué beneficio concreto justifica pasar de Basic a Crece o Pro?",
    a: "El Plan Basic asegura presencia en catálogo. El Plan Crece (2 UF) activa la recepción directa de clientes potenciales (leads). El Plan Pro (3 UF) te otorga modelos ilimitados, posición destacada en catálogo y sello verificado. El Plan Pro+ (4 UF) te sitúa como referente #1 en tu región con campañas publicitarias activas.",
  },
  {
    q: "¿Cómo funciona el acceso para constructoras en SoloCasasChile?",
    a: "Puedes suscribirte de inmediato a cualquiera de nuestros planes de pago (Basic, Crece, Pro y Pro+) para publicar tus modelos y recibir prospectos directos. El acceso gratuito permanente corresponde al Plan Starter (1 modelo publicado), disponible exclusivamente por invitación directa o mediante solicitud de invitación previa validación técnica.",
  },
];

export function ParaConstructorasClient() {
  const [isYearly, setIsYearly] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    trackPlanesView("para_constructoras");
  }, []);

  const handlePlanPurchase = (planId: string, billing: "monthly" | "yearly") => {
    const selectedPlan = PLANES.find((p) => p.id === planId);
    const priceUf = billing === "yearly"
      ? Number(selectedPlan?.precioAnualTotal || 0)
      : Number(selectedPlan?.precioMensual || 0);

    trackPlanCheckoutClick({
      plan: planId,
      billing,
      priceUf,
    });
    startTransition(() => {
      router.push(`/checkout?plan=${planId}&billing=${billing}`);
    });
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border/40 pb-20 pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,38,43,0.06),transparent_35%)]" />
        <div className="container relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
          <Badge className="mb-4 bg-brand-indigo/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-brand-indigo border-brand-indigo/20">
            Portal para Constructoras
          </Badge>

          <h1 className="font-heading text-4xl font-black tracking-tight text-foreground sm:text-6xl md:text-7xl">
            No pagas por aparecer. <br />
            <span className="gradient-text">Pagas por acceder a clientes potenciales.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg font-medium leading-relaxed text-muted-foreground sm:text-xl">
            Súmate a la plataforma líder de casas prefabricadas y modulares en Chile. Publica tus modelos y recibe cotizaciones reales de personas listas para construir en tu región.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#planes"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 rounded-2xl bg-brand-indigo px-8 text-xs font-extrabold uppercase tracking-[0.16em] text-white shadow-xl shadow-brand-indigo/20 hover:bg-brand-indigo/90"
              )}
            >
              Publicar mi constructora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>

            <Link
              href="/invitacion"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-14 rounded-2xl border-border px-8 text-xs font-extrabold uppercase tracking-[0.16em]"
              )}
            >
              Acceder con invitación
            </Link>
          </div>

          {/* Micro stats honestos */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 border-t border-border/40 pt-8 text-xs font-bold text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-teal" />
              <span>Planes desde 1.0 UF/mes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-teal" />
              <span>Leads directos a tu WhatsApp y email</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-teal" />
              <span>Sin comisiones sobre tus obras</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Qué puede publicar una empresa ────────────────────────────── */}
      <section className="border-b border-border/40 py-20 bg-muted/10">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-teal">
              Presencia técnica y profesional
            </p>
            <h2 className="font-heading text-3xl font-black tracking-tight sm:text-5xl">
              ¿Qué puede publicar tu empresa en el catálogo?
            </h2>
            <p className="text-base font-medium text-muted-foreground">
              Cada constructora dispone de espacios diseñados para que el comprador evalúe la solidez técnica y las opciones reales de construcción.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-[2.5rem] border border-border/70 bg-card p-8 shadow-sm space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-brand-indigo/10 flex items-center justify-center text-brand-indigo">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-black tracking-tight">
                1. Perfil institucional completo
              </h3>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                RUT, razón social, logo corporativo, descripción de especialidad constructiva (SIP, modular, madera, etc.) y comunas o regiones donde realizas instalaciones.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-foreground/80 border-t border-border/40 pt-4">
                <li className="flex items-center gap-2">✓ Cobertura geográfica por región</li>
                <li className="flex items-center gap-2">✓ Teléfono, WhatsApp y sitio web oficial</li>
                <li className="flex items-center gap-2">✓ Sello verificado al validar antecedentes</li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="rounded-[2.5rem] border border-border/70 bg-card p-8 shadow-sm space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-black tracking-tight">
                2. Fichas de modelos de casas
              </h3>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                Superficie total en m², distribución de dormitorios y baños, precio referencial expresado en UF, tiempo estimado de entrega y fotografías de proyectos.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-foreground/80 border-t border-border/40 pt-4">
                <li className="flex items-center gap-2">✓ Hasta 10 fotos en alta resolución</li>
                <li className="flex items-center gap-2">✓ Memoria técnica de muros y techumbres</li>
                <li className="flex items-center gap-2">✓ Indicación de qué incluye y qué no incluye</li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="rounded-[2.5rem] border border-border/70 bg-card p-8 shadow-sm space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-black tracking-tight">
                3. Obras y respaldo comprobable
              </h3>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                Galería de obras reales entregadas, certificaciones de calidad estructural y el módulo de seguimiento de etapas para mantener informados a tus clientes.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-foreground/80 border-t border-border/40 pt-4">
                <li className="flex items-center gap-2">✓ Bitácora de avance de obra (Plan Pro)</li>
                <li className="flex items-center gap-2">✓ Enlace a planos y especificaciones</li>
                <li className="flex items-center gap-2">✓ Calificación basada en criterios objetivos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Cómo recibe una consulta (Visual Lead Preview) ─────────────── */}
      <section className="border-b border-border/40 py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <Badge className="bg-brand-teal/10 text-brand-teal border-brand-teal/20 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest">
                Recepción sin intermediarios
              </Badge>
              <h2 className="font-heading text-3xl font-black tracking-tight sm:text-5xl">
                ¿Cómo recibe tu constructora una solicitud de cotización?
              </h2>
              <p className="text-base font-medium leading-relaxed text-muted-foreground">
                Cuando un comprador revisa un modelo en tu catálogo y hace clic en &laquo;Solicitar cotización&raquo;, la consulta llega directamente a tu panel y a tu correo electrónico. No revendemos el contacto a múltiples empresas en simultáneo.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 flex items-center justify-center text-brand-indigo shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">Datos de contacto verificados</p>
                    <p className="text-xs text-muted-foreground font-medium">Nombre, correo y WhatsApp del interesado para contactarlo en minutos.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">Contexto del terreno y ubicación</p>
                    <p className="text-xs text-muted-foreground font-medium">Región donde planea construir y si ya dispone de terreno habilitado.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">Modelo específico de interés</p>
                    <p className="text-xs text-muted-foreground font-medium">Sabes exactamente qué casa y superficie busca el cliente desde el primer mensaje.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mockup visual de la ficha de lead real */}
            <div className="rounded-[2.5rem] border border-border/80 bg-card p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest text-foreground">
                    Nueva cotización recibida
                  </span>
                </div>
                <Badge className="bg-brand-teal/10 text-brand-teal text-[10px] font-bold">
                  Hace 15 min
                </Badge>
              </div>

              {/* Lead Card Example */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-black text-foreground">Ignacio Sepúlveda</p>
                    <p className="text-xs text-muted-foreground font-medium">Cotizando: <strong className="text-brand-indigo">Casa Nogal SIP 120</strong></p>
                  </div>
                  <Badge variant="outline" className="border-border text-[10px] font-bold">
                    Estado: Nuevo
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-muted/40 p-4 rounded-2xl text-xs">
                  <div>
                    <span className="text-muted-foreground font-semibold block text-[10px] uppercase">Región de instalación</span>
                    <span className="font-bold text-foreground">Región de Valparaíso</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-semibold block text-[10px] uppercase">¿Tiene terreno propio?</span>
                    <span className="font-bold text-emerald-600">Sí, con rol propio</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-semibold block text-[10px] uppercase">WhatsApp</span>
                    <span className="font-bold text-foreground">+56 9 8765 4321</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-semibold block text-[10px] uppercase">Correo</span>
                    <span className="font-bold text-foreground">ignacio.s@ejemplo.cl</span>
                  </div>
                </div>

                <div className="bg-muted/20 p-4 rounded-2xl border border-border/30 text-xs text-muted-foreground">
                  <span className="font-bold text-foreground block mb-1">Mensaje del cliente:</span>
                  &ldquo;Hola, tenemos una parcela en Casablanca y queremos construir el modelo Nogal en modalidad llave en mano. ¿Tienen disponibilidad para iniciar obras durante este semestre?&rdquo;
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1 rounded-xl bg-emerald-600 text-white font-bold text-xs h-11 hover:bg-emerald-700">
                    <Phone className="w-3.5 h-3.5 mr-2" /> Responder por WhatsApp
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 rounded-xl font-bold text-xs h-11 border-border">
                    <Mail className="w-3.5 h-3.5 mr-2" /> Enviar presupuesto
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Qué información ve en su panel (Dashboard Preview) ─────────── */}
      <section className="border-b border-border/40 py-20 bg-muted/10">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-indigo">
              Control total en un solo lugar
            </p>
            <h2 className="font-heading text-3xl font-black tracking-tight sm:text-5xl">
              Qué información ves dentro de tu panel de constructora
            </h2>
            <p className="text-base font-medium text-muted-foreground">
              Una plataforma sencilla y sin tecnicismos innecesarios para gestionar tus modelos y dar seguimiento comercial a cada interesado.
            </p>
          </div>

          <div className="rounded-[2.5rem] border border-border/70 bg-card p-6 sm:p-10 shadow-xl space-y-8">
            {/* Header del preview */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-6">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Vista previa del panel</p>
                <h3 className="text-2xl font-black tracking-tight text-foreground">Tu Constructora SpA</h3>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-black">
                  Estado: Plan Activo
                </Badge>
                <Badge variant="outline" className="font-bold text-xs">
                  Score de Confianza: 85/100
                </Badge>
              </div>
            </div>

            {/* 4 KPIs reales del dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/40 p-5 rounded-2xl border border-border/30">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
                  Vistas al catálogo
                </span>
                <p className="text-3xl font-black text-brand-indigo">184</p>
                <span className="text-[11px] font-bold text-muted-foreground">Últimos 30 días</span>
              </div>

              <div className="bg-muted/40 p-5 rounded-2xl border border-border/30">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
                  Cotizaciones recibidas
                </span>
                <p className="text-3xl font-black text-brand-teal">8</p>
                <span className="text-[11px] font-bold text-emerald-600">Prospectos directos</span>
              </div>

              <div className="bg-muted/40 p-5 rounded-2xl border border-border/30">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
                  Modelos publicados
                </span>
                <p className="text-3xl font-black text-foreground">3 / 3</p>
                <span className="text-[11px] font-bold text-muted-foreground">Capacidad según plan</span>
              </div>

              <div className="bg-muted/40 p-5 rounded-2xl border border-border/30">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
                  Tiempo de respuesta
                </span>
                <p className="text-3xl font-black text-emerald-600">&lt; 2 hrs</p>
                <span className="text-[11px] font-bold text-muted-foreground">Atención a cotizaciones</span>
              </div>
            </div>

            {/* Mini CRM overview */}
            <div className="border border-border/40 rounded-2xl p-6 bg-background space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-foreground uppercase tracking-widest">CRM de Cotizaciones Entrantes</p>
                <span className="text-xs font-bold text-muted-foreground">Gestión de estados</span>
              </div>

              <div className="space-y-3">
                {[
                  { cliente: "Ignacio Sepúlveda", modelo: "Casa Nogal SIP 120", estado: "Nuevo", fecha: "Hoy" },
                  { cliente: "Camila Henríquez", modelo: "Casa Roble Prefab 80", estado: "Contactado", fecha: "Ayer" },
                  { cliente: "Patricio Morales", modelo: "Imperio SIP 150", estado: "Cotizado", fecha: "Hace 3 días" },
                ].map((row, idx) => (
                  <div key={idx} className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-muted/30 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand-indigo/10 flex items-center justify-center font-black text-brand-indigo">
                        {row.cliente[0]}
                      </div>
                      <div>
                        <span className="font-bold text-foreground block">{row.cliente}</span>
                        <span className="text-muted-foreground text-[11px]">{row.modelo}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-[10px] font-bold">
                        {row.estado}
                      </Badge>
                      <span className="text-muted-foreground text-[11px]">{row.fecha}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Pasos para empezar ────────────────────────────────────────── */}
      <section className="border-b border-border/40 py-20">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center space-y-4 mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-teal">
              Sin complicaciones técnicas
            </p>
            <h2 className="font-heading text-3xl font-black tracking-tight sm:text-5xl">
              3 pasos para empezar a recibir consultas
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-3 text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg mx-auto md:mx-0 shadow-lg">
                1
              </div>
              <h3 className="font-heading text-lg font-black tracking-tight">Elige tu plan o accede por invitación</h3>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                Selecciona el plan que se adapte al volumen de tu constructora, o ingresa con tu enlace si recibiste una invitación al Plan Starter.
              </p>
            </div>

            <div className="space-y-3 text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-brand-indigo text-white flex items-center justify-center font-black text-lg mx-auto md:mx-0 shadow-lg">
                2
              </div>
              <h3 className="font-heading text-lg font-black tracking-tight">Carga tus primeros modelos</h3>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                Sube fotos de tus casas, dimensiones, dormitorios, baños y valor referencial en UF para que el catálogo muestre tu oferta.
              </p>
            </div>

            <div className="space-y-3 text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-brand-teal text-white flex items-center justify-center font-black text-lg mx-auto md:mx-0 shadow-lg">
                3
              </div>
              <h3 className="font-heading text-lg font-black tracking-tight">Recibe y responde cotizaciones</h3>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                Cada consulta ingresa directamente con los datos de contacto del interesado para que envíes tu presupuesto y cierres contratos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Comparativa de planes según el valor real ─────────────────── */}
      <section id="planes" className="py-24 border-b border-border/40 scroll-mt-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-12">
            <Badge className="bg-primary/10 text-primary border-primary/20 font-black uppercase tracking-widest text-xs px-4 py-1.5">
              Tarifas Transparentes
            </Badge>
            <h2 className="font-heading text-4xl font-black tracking-tight sm:text-6xl">
              Planes claros y enfocados en <span className="gradient-text">clientes potenciales</span>
            </h2>
            <p className="text-base font-medium text-muted-foreground sm:text-lg">
              No pagas por figurar en un listado: pagas por acceder a personas que buscan construir en tu región. Elige el plan adecuado según tu volumen de catálogo.
            </p>

            {/* Toggle de facturación mensual / anual */}
            <div className="pt-6 flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 bg-muted/40 p-1.5 rounded-full border border-border/60">
                <button
                  type="button"
                  onClick={() => setIsYearly(false)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                    !isYearly ? "bg-white dark:bg-slate-900 text-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Mensual
                </button>
                <button
                  type="button"
                  onClick={() => setIsYearly(true)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all relative",
                    isYearly ? "bg-white dark:bg-slate-900 text-foreground shadow-md" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Anual
                  <span className="ml-2 bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black">
                    20% OFF
                  </span>
                </button>
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                {isYearly ? "Facturado anualmente con 20% de descuento · Ahorras hasta 9.6 UF al año" : "Facturación mes a mes sin contrato de permanencia"}
              </p>
            </div>
          </div>

          {/* Grid de 4 planes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
            {PLANES.map((plan) => {
              const currentPrice = isYearly ? plan.precioAnualEquiv : plan.precioMensual;
              const originalPrice = plan.precioOriginal;

              return (
                <div
                  key={plan.id}
                  className={cn(
                    "relative bg-card rounded-[2.5rem] border p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl",
                    plan.borderClass
                  )}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <Badge className={cn("text-[9px] font-black uppercase tracking-widest px-4 py-1 border shadow-sm", plan.badgeClass)}>
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  {/* Header */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-heading font-black tracking-tight text-foreground">
                        {plan.nombre}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {plan.duracion}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="pt-2 border-b border-border/40 pb-5">
                      <div className="flex items-baseline gap-2">
                        {isYearly && originalPrice && (
                          <span className="text-base font-bold text-muted-foreground/40 line-through tracking-tighter">
                            {originalPrice}
                          </span>
                        )}
                        <span className="text-4xl font-black tracking-tighter text-foreground">
                          {currentPrice}
                        </span>
                        <div className="flex flex-col text-xs font-bold text-muted-foreground">
                          <span>UF / mes</span>
                          {isYearly && (
                            <span className="text-[9px] text-brand-teal font-black">
                              Facturado {plan.precioAnualTotal} UF anual
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs font-medium text-muted-foreground mt-3 leading-relaxed">
                        {plan.resultadoClave}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 flex-1 py-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Qué incluye:
                    </p>
                    <ul className="space-y-2 text-xs font-medium">
                      {plan.features.map((feat, i) => (
                        <li
                          key={i}
                          className={cn("flex items-start gap-2 leading-tight", !feat.ok && "opacity-35 line-through")}
                        >
                          <CheckCircle2
                            className={cn(
                              "w-4 h-4 shrink-0 mt-0.5",
                              feat.ok ? "text-brand-teal" : "text-muted-foreground"
                            )}
                          />
                          <span>{feat.texto}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="pt-4 border-t border-border/40">
                    <Button
                      disabled={isPending}
                      onClick={() => handlePlanPurchase(plan.id, isYearly ? "yearly" : "monthly")}
                      className={cn(
                        "w-full h-12 rounded-2xl font-extrabold uppercase tracking-widest text-xs gap-2 transition-all hover:scale-[1.02] active:scale-95",
                        plan.id === "pro"
                          ? "bg-brand-teal text-white hover:bg-brand-teal/90 shadow-lg shadow-brand-teal/20"
                          : plan.id === "premium"
                          ? "bg-amber-500 text-slate-950 font-black hover:bg-amber-600 shadow-lg shadow-amber-500/20"
                          : plan.id === "crece"
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                          : "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90"
                      )}
                    >
                      {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          {plan.cta}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 rounded-2xl bg-muted/30 border border-border/40 p-6 text-center text-xs text-muted-foreground font-medium space-y-1">
            <p>Facturación oficial en pesos chilenos según el valor de la UF del día · Transacciones seguras procesadas por Flow.</p>
            <p>Emisión inmediata de factura electrónica a nombre de tu empresa · Acceso gratuito Starter disponible exclusivamente por invitación.</p>
          </div>
        </div>
      </section>

      {/* ── 7. FAQ Constructoras ─────────────────────────────────────────── */}
      <section className="container max-w-3xl mx-auto px-4 sm:px-6 py-20 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-heading font-black tracking-tight sm:text-4xl">
            Preguntas frecuentes de constructoras
          </h2>
          <p className="text-muted-foreground font-medium text-sm">
            Condiciones comerciales y operativas sin sorpresas.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS_CONSTRUCTORAS.map((faq, idx) => (
            <details
              key={idx}
              className="group rounded-2xl border border-border/60 bg-card p-6 cursor-pointer transition-all open:border-brand-indigo/30"
            >
              <summary className="flex items-center justify-between font-black text-sm list-none gap-4">
                <span>{faq.q}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="pt-4 text-sm text-muted-foreground font-medium leading-relaxed border-t border-border/40 mt-4">
                {faq.a}
              </p>
            </details>
          ))}
        </div>

        <div className="text-center pt-8 space-y-2">
          <p className="text-sm text-muted-foreground font-medium">
            ¿Tienes consultas sobre cómo publicar tu empresa?
          </p>
          <a
            href="mailto:contacto@solocasaschile.com"
            className="text-brand-indigo font-bold text-sm hover:underline"
          >
            contacto@solocasaschile.com
          </a>
        </div>
      </section>
    </div>
  );
}
