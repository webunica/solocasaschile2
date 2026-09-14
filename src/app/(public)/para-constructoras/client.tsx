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
    id: "gratis",
    nombre: "Gratis",
    duracion: "30 días de prueba",
    precioMensual: "0",
    precioAnualEquiv: "0",
    precioAnualTotal: "0",
    badge: "IDEAL PARA EMPEZAR",
    badgeClass: "bg-muted text-foreground border-border",
    color: "text-muted-foreground",
    bgIcon: "bg-muted",
    borderClass: "border-border/70",
    resultadoClave: "Prueba la plataforma y recibe tus primeras cotizaciones sin costo.",
    audiencia: "Constructoras que quieren validar la demanda en su zona antes de invertir.",
    features: [
      { texto: "Hasta 3 modelos en catálogo público", ok: true },
      { texto: "3 fotografías por modelo", ok: true },
      { texto: "Perfil institucional con datos de contacto", ok: true },
      { texto: "Recepción de cotizaciones directas al panel", ok: true },
      { texto: "Acceso al historial de prospectos de por vida", ok: true },
      { texto: "Sin tarjeta de crédito requerida", ok: true },
      { texto: "Sello de Constructora Verificada ✓", ok: false },
      { texto: "Módulo de Seguimiento de Obras", ok: false },
      { texto: "Prioridad en resultados del catálogo", ok: false },
    ],
    cta: "Probar 30 días gratis",
    ctaHref: "/register?plan=gratis",
    ctaVariant: "outline" as const,
  },
  {
    id: "pro",
    nombre: "Pro",
    duracion: "Mensual o Anual",
    precioMensual: "0.7",
    precioAnualEquiv: "0.56",
    precioAnualTotal: "6.72",
    badge: "MÁS RECOMENDADO",
    badgeClass: "bg-brand-teal text-white border-brand-teal/30",
    color: "text-brand-teal",
    bgIcon: "bg-brand-teal/10",
    borderClass: "border-brand-teal/50 shadow-xl shadow-brand-teal/10 ring-2 ring-brand-teal/20",
    resultadoClave: "Presencia continua, más modelos y sello de confianza para convertir más consultas.",
    audiencia: "Constructoras con oferta activa que necesitan captación mensual de compradores.",
    features: [
      { texto: "Hasta 15 modelos publicados", ok: true },
      { texto: "10 fotografías en alta resolución por modelo", ok: true },
      { texto: "Sello oficial de Constructora Verificada ✓", ok: true },
      { texto: "CRM de prospectos con estados y notas", ok: true },
      { texto: "Sistema de Seguimiento de Obras para clientes", ok: true },
      { texto: "Prioridad de posicionamiento en catálogo", ok: true },
      { texto: "Galería de proyectos entregados", ok: true },
      { texto: "Soporte comercial prioritario vía WhatsApp", ok: true },
    ],
    cta: "Iniciar con Plan Pro",
    ctaHref: "/checkout?plan=pro",
    ctaVariant: "default" as const,
  },
  {
    id: "premium",
    nombre: "Premium",
    duracion: "Por invitación",
    precioMensual: "A consultar",
    precioAnualEquiv: "A consultar",
    precioAnualTotal: "Personalizado",
    badge: "POR INVITACIÓN",
    badgeClass: "bg-slate-900 text-white border-slate-800",
    color: "text-amber-500",
    bgIcon: "bg-amber-500/10",
    borderClass: "border-amber-500/40",
    resultadoClave: "Solución a medida para marcas con alto volumen y proyectos a escala nacional.",
    audiencia: "Fabricantes industriales y constructoras con más de 15 modelos o requerimientos VIP.",
    features: [
      { texto: "Modelos y fotografías ilimitadas", ok: true },
      { texto: "Video tour y recorrido 3D integrado", ok: true },
      { texto: "Acceso exclusivo a la red de proveedores constru", ok: true },
      { texto: "Auditoría técnica de perfil y proyectos", ok: true },
      { texto: "Módulo avanzado de obras y reportabilidad", ok: true },
      { texto: "Ejecutivo de cuenta y onboarding guiado", ok: true },
    ],
    cta: "Solicitar evaluación",
    ctaHref: "https://wa.me/56964130601?text=Hola%20SolocasasChile%2C%20quiero%20evaluar%20el%20Plan%20Premium%20para%20mi%20empresa.",
    ctaVariant: "default" as const,
  },
];

const FAQS_CONSTRUCTORAS = [
  {
    q: "¿Por qué existe un plan gratis de 30 días?",
    a: "Porque queremos que pruebes el funcionamiento de la plataforma con tiempo suficiente. Un periodo de 30 días permite publicar tus modelos, recibir consultas de compradores reales en tu región y comprobar el funcionamiento de la plataforma antes de comprometer un presupuesto.",
  },
  {
    q: "¿Qué ocurre con mis datos y prospectos cuando termina el periodo gratis?",
    a: "Los datos de contacto que recibiste son 100% tuyos. Siempre tendrás acceso al historial de cotizaciones en tu panel. Si decides no contratar el Plan Pro al terminar los 30 días, tus modelos pasarán a estado inactivo pero no perderás ningún prospecto ni registro previo.",
  },
  {
    q: "¿En qué moneda se cobra y cómo se calcula?",
    a: "Los planes Pro y Premium se expresan en Unidades de Fomento (UF) para proteger el valor de referencia, y se facturan en pesos chilenos según el valor oficial de la UF a la fecha de emisión del pago mediante Flow (Webpay, transferencia bancaria, tarjetas de débito/crédito).",
  },
  {
    q: "¿Existe permanencia forzada?",
    a: "No en la modalidad mensual: puedes suspender o cancelar la renovación en cualquier momento desde tu panel de facturación. En la modalidad anual, el pago se realiza por adelantado con un 20% de descuento directo y te asegura el valor fijado durante los 12 meses.",
  },
  {
    q: "¿Qué beneficio concreto justifica pasar de Gratis a Pro?",
    a: "La justificación principal es el volumen y la conversión: pasas de 3 a 15 modelos en vitrina, incluyes hasta 10 fotos por casa, obtienes el sello de Constructora Verificada (que aumenta la confianza del comprador al cotizar) y activas el módulo de seguimiento de obras.",
  },
];

export function ParaConstructorasClient() {
  const [isYearly, setIsYearly] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    trackPlanesView("para_constructoras");
  }, []);

  const handleProPurchase = (billing: "monthly" | "yearly") => {
    trackPlanCheckoutClick({
      plan: "pro",
      billing,
      priceUf: billing === "yearly" ? 6.72 : 0.7,
    });
    startTransition(() => {
      router.push(`/checkout?plan=pro&billing=${billing}`);
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
            Publica tus modelos y recibe <br />
            <span className="gradient-text">cotizaciones directas</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg font-medium leading-relaxed text-muted-foreground sm:text-xl">
            Conecta con personas que buscan casas prefabricadas y SIP en Chile. Presenta tus modelos con especificaciones técnicas reales y gestiona cada consulta en un panel ordenado.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register?plan=gratis"
              onClick={() => trackRegistroStart("gratis")}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 rounded-2xl bg-brand-indigo px-8 text-xs font-extrabold uppercase tracking-[0.16em] text-white shadow-xl shadow-brand-indigo/20 hover:bg-brand-indigo/90"
              )}
            >
              Publicar mi constructora (Prueba gratis)
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>

            <Link
              href="#planes"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-14 rounded-2xl border-border px-8 text-xs font-extrabold uppercase tracking-[0.16em]"
              )}
            >
              Ver comparativa de planes
            </Link>
          </div>

          {/* Micro stats honestos */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 border-t border-border/40 pt-8 text-xs font-bold text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-teal" />
              <span>Prueba de 30 días sin tarjeta</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-teal" />
              <span>Tus prospectos son 100% de tu empresa</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand-teal" />
              <span>Facturación transparente en UF</span>
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
                <span className="text-[11px] font-bold text-muted-foreground">Capacidad plan gratis</span>
              </div>

              <div className="bg-muted/40 p-5 rounded-2xl border border-border/30">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
                  Días de prueba restantes
                </span>
                <p className="text-3xl font-black text-amber-500">24 días</p>
                <span className="text-[11px] font-bold text-muted-foreground">De 30 días iniciales</span>
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
              <h3 className="font-heading text-lg font-black tracking-tight">Crea tu cuenta gratis</h3>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                Ingresa tu correo, nombre de empresa, teléfono de contacto y cobertura regional. No solicitamos tarjetas ni datos de pago.
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
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center space-y-4 mb-12">
            <Badge className="bg-primary/10 text-primary border-primary/20 font-black uppercase tracking-widest text-xs px-4 py-1.5">
              Tarifas Transparentes
            </Badge>
            <h2 className="font-heading text-4xl font-black tracking-tight sm:text-6xl">
              Planes claros y enfocados en <span className="gradient-text">resultados</span>
            </h2>
            <p className="text-base font-medium text-muted-foreground sm:text-lg">
              Comienza con 30 días de prueba gratuita y escala a Pro cuando quieras mayor visibilidad y presencia activa.
            </p>

            {/* Toggle de facturación mensual / anual */}
            <div className="pt-6 flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 bg-muted/40 p-1.5 rounded-full border border-border/60">
                <button
                  type="button"
                  onClick={() => setIsYearly(false)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all",
                    !isYearly ? "bg-white text-brand-indigo shadow-md" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Mensual
                </button>
                <button
                  type="button"
                  onClick={() => setIsYearly(true)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all relative",
                    isYearly ? "bg-white text-brand-indigo shadow-md" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Anual
                  <span className="ml-2 bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black">
                    20% OFF
                  </span>
                </button>
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                {isYearly ? "Facturado anualmente (5.76 UF/año) · Ahorras 1.44 UF respecto al mes a mes" : "Facturación mes a mes sin contrato de permanencia"}
              </p>
            </div>
          </div>

          {/* Grid de planes */}
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {PLANES.map((plan) => {
              const currentPrice =
                plan.id === "gratis"
                  ? "0"
                  : plan.id === "premium"
                  ? "Por invitación"
                  : isYearly
                  ? plan.precioAnualEquiv
                  : plan.precioMensual;

              const isNumericPrice = plan.id !== "premium";

              return (
                <div
                  key={plan.id}
                  className={cn(
                    "relative bg-card rounded-[2.5rem] border p-8 sm:p-10 flex flex-col gap-8 transition-all duration-200",
                    plan.borderClass
                  )}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className={cn("text-[9px] font-black uppercase tracking-widest px-4 py-1", plan.badgeClass)}>
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
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        {plan.duracion}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="pt-2 border-b border-border/40 pb-6">
                      {isNumericPrice ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-black tracking-tighter text-foreground">
                            {currentPrice}
                          </span>
                          <div className="flex flex-col text-xs font-bold text-muted-foreground">
                            <span>UF / mes</span>
                            {isYearly && plan.id === "pro" && (
                              <span className="text-[10px] text-brand-indigo font-black">Facturado 6.72 UF anual</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-2xl font-black text-foreground">{currentPrice}</p>
                          <p className="text-xs text-muted-foreground font-medium mt-1">Evaluación personalizada según catálogo</p>
                        </div>
                      )}
                      <p className="text-xs font-semibold text-muted-foreground mt-3 leading-relaxed">
                        {plan.resultadoClave}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Qué incluye:
                    </p>
                    <ul className="space-y-2.5 text-xs font-medium">
                      {plan.features.map((feat, i) => (
                        <li
                          key={i}
                          className={cn("flex items-start gap-2.5", !feat.ok && "opacity-40 line-through")}
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
                    {plan.id === "pro" ? (
                      <Button
                        disabled={isPending}
                        onClick={() => handleProPurchase(isYearly ? "yearly" : "monthly")}
                        className="w-full h-14 rounded-2xl bg-brand-teal text-white font-extrabold uppercase tracking-widest text-xs hover:bg-brand-teal/90 shadow-lg shadow-brand-teal/20"
                      >
                        {isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            {plan.cta}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Link
                        href={plan.ctaHref}
                        onClick={() => {
                          if (plan.id === "gratis") trackRegistroStart("gratis");
                        }}
                        className={cn(
                          buttonVariants({ variant: plan.ctaVariant, size: "lg" }),
                          "w-full h-14 rounded-2xl font-extrabold uppercase tracking-widest text-xs",
                          plan.id === "gratis" && "border-border text-foreground hover:bg-muted"
                        )}
                      >
                        {plan.cta}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 rounded-2xl bg-muted/30 border border-border/40 p-6 text-center text-xs text-muted-foreground font-medium space-y-1">
            <p>Facturación oficial en pesos chilenos según el valor de la UF del día · Transacciones seguras procesadas por Flow.</p>
            <p>Los precios en UF no incluyen IVA · El periodo de prueba gratuito está limitado a una cuenta por empresa constructora.</p>
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
