"use client";

import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  AlertTriangle,
  Award,
  Users,
  Search,
  MapPin,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Building2,
  Lock,
  Scale,
  Sparkles,
  PhoneCall,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FormularioAsesoramiento } from "@/components/verificacion/formulario-asesoramiento";

const CRITERIOS_VIGENTES = [
  {
    title: "Identidad Legal y Vigencia Tributaria",
    icon: FileCheck,
    desc: "Validamos el RUT de la empresa, constitución societaria en el Registro de Empresas y Sociedades del Ministerio de Economía e inicio de actividades vigente ante el SII.",
  },
  {
    title: "Años de Operación y Experiencia",
    icon: Users,
    desc: "Comprobamos trayectoria efectiva y proyectos construidos demostrables para diferenciar fábricas consolidadas de intermediarios improvisados.",
  },
  {
    title: "Contacto e Infraestructura Verificable",
    icon: MapPin,
    desc: "Confirmamos plantas de fabricación, salas de venta físicas, teléfonos corporativos activos y canales oficiales sin intermediarios no autorizados.",
  },
  {
    title: "Cumplimiento Normativo (OGUC / LGUC)",
    icon: Scale,
    desc: "Revisamos que los modelos cumplan con la Ordenanza General de Urbanismo y Construcciones (aislación térmica artículo 4.1.10, cálculo estructural y resistencia al fuego).",
  },
  {
    title: "Garantías y Contratos Estandarizados",
    icon: ShieldCheck,
    desc: "Exigimos contratos claros con plazos de entrega definidos, hitos de pago contra avance de obra y las garantías legales mínimas exigidas por ley.",
  },
  {
    title: "Historial Comercial y Respaldo",
    icon: Search,
    desc: "Evaluación de antecedentes comerciales y comportamiento de postventa para asegurar seriedad en la entrega de la vivienda.",
  },
] as const;

const ESTADOS_AUDITORIA = [
  {
    label: "Verificada documentalmente",
    badgeClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
    titulo: "Nivel Máximo de Confianza",
    desc: "Empresa con antecedentes legales, tributarios y técnicos validados por nuestro equipo. Dispone de contratos formales, historial comprobable y modelos con especificaciones detalladas.",
  },
  {
    label: "Información básica validada",
    badgeClass: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    titulo: "Nivel Estándar",
    desc: "Datos de contacto, RUT e inicio de actividades comprobados. Cuenta con antecedentes operativos y continúa en proceso de validación técnica profunda.",
  },
  {
    label: "Perfil en revisión",
    badgeClass: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    titulo: "En Proceso de Auditoría",
    desc: "Empresa postulante o en actualización de catálogo. Sus antecedentes están siendo revisados por nuestro equipo técnico y legal antes de otorgar certificación activa.",
  },
  {
    label: "No verificada",
    badgeClass: "bg-slate-500/10 text-slate-500 border-slate-500/30",
    titulo: "Sin Validación Técnica",
    desc: "Constructora identificada en el mercado chileno que aún no ha iniciado ni completado el proceso de auditoría independiente de SoloCasasChile.",
  },
];

const FAQS_VERIFICACION = [
  {
    q: "¿Por qué SoloCasasChile audita y verifica a las empresas?",
    a: "SoloCasasChile es una entidad independiente, no una constructora. Nuestra misión es transparentar el mercado de casas prefabricadas y modulares en Chile, protegiendo a las familias de malas prácticas, contratos abusivos o constructoras sin respaldo técnico.",
  },
  {
    q: "¿Qué debo hacer si la constructora que me interesa aparece 'En revisión' o 'No verificada'?",
    a: "Te recomendamos extremar precauciones: nunca transfieras anticipos sin verificar la existencia de la fábrica, exige siempre contrato notarial con hitos de pago contra avance y solicita asesoramiento gratuito con nuestros especialistas a través del formulario de esta página antes de firmar.",
  },
  {
    q: "¿Tiene algún costo el servicio de asesoramiento para el comprador?",
    a: "No. El asesoramiento técnico y la orientación para compradores es 100% gratuito. Nuestro objetivo es ayudarte a evaluar presupuestos (valor UF/m² real), especificaciones de materiales y cláusulas contractuales.",
  },
  {
    q: "¿Qué garantías exige la ley chilena para una casa prefabricada?",
    a: "La Ley General de Urbanismo y Construcciones (LGUC) establece garantías irrenunciables: 10 años por fallas que afecten la estructura de la vivienda, 5 años por fallas de elementos constructivos o instalaciones, y 3 años por terminaciones o acabados.",
  },
  {
    q: "¿Cómo puede una empresa constructora solicitar su verificación?",
    a: "Las empresas interesadas pueden postular su verificación enviando sus antecedentes a contacto@solocasaschile.com o suscribiéndose a los planes comerciales para iniciar el proceso de auditoría técnica.",
  },
];

export function VerificacionContent() {
  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6">
      <Link
        href="/constructoras"
        className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al directorio de constructoras
      </Link>

      <div className="mb-16 space-y-6 text-center md:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-teal/20 bg-brand-teal/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-brand-teal shadow-sm">
          <ShieldCheck className="h-4 w-4" />
          Auditoría Técnica y Transparencia
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.05]">
          Verificación de empresas <br className="hidden sm:block" />
          <span className="gradient-text">constructoras en Chile</span>
        </h1>

        <p className="max-w-3xl text-lg sm:text-xl font-medium leading-relaxed text-muted-foreground">
          <strong>SoloCasasChile no es una constructora.</strong> Somos una plataforma independiente que audita la identidad legal, capacidad operativa y antecedentes técnicos de las empresas de casas prefabricadas y modulares para que construyas con seguridad.
        </p>
      </div>

      {/* Estados de Auditoría */}
      <section className="mb-20 space-y-8">
        <div className="space-y-3 text-center md:text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-teal">
            Niveles de Auditoría
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Estados de verificación y sellos visibles
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {ESTADOS_AUDITORIA.map((estado, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl p-6 space-y-3 shadow-sm hover:border-brand-teal/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider",
                    estado.badgeClass
                  )}
                >
                  {estado.label}
                </span>
                <span className="text-xs font-black text-muted-foreground opacity-40">#{idx + 1}</span>
              </div>
              <h3 className="font-heading text-lg font-black text-foreground">
                {estado.titulo}
              </h3>
              <p className="text-xs sm:text-sm font-medium leading-relaxed text-muted-foreground">
                {estado.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Criterios de Auditoría */}
      <section className="mb-20 space-y-8">
        <div className="space-y-3 text-center md:text-left">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-teal">
            Metodología de Validación
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            ¿Qué auditamos en cada empresa constructora?
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CRITERIOS_VIGENTES.map((crit, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-border/60 bg-card p-6 space-y-4 shadow-sm hover:border-brand-teal/30 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                  <crit.icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-base font-black text-foreground">
                  {crit.title}
                </h3>
                <p className="text-xs font-medium leading-relaxed text-muted-foreground">
                  {crit.desc}
                </p>
              </div>
              <div className="pt-2 border-t border-border/40 text-[10px] font-bold text-emerald-600 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Requisito obligatorio
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Asesoramiento */}
      <section className="mb-24 space-y-12">
        <div className="rounded-[3rem] border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card to-background p-8 sm:p-12 space-y-8 shadow-xl">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-amber-600">
              <AlertTriangle className="w-3.5 h-3.5" />
              Alerta para Cotizantes
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl font-black tracking-tight text-foreground">
              ¿La constructora que te interesa no está verificada?
            </h2>
            <p className="text-sm sm:text-base font-medium leading-relaxed text-muted-foreground">
              Te asesoramos de forma personalizada y sin costo antes de transferir dinero o firmar contrato.
            </p>
          </div>

          <FormularioAsesoramiento />
        </div>
      </section>
    </div>
  );
}
