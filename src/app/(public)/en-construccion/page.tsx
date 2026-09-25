import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  HardHat,
  Sparkles,
  ShieldCheck,
  Building2,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  Home,
  MessageSquare,
  Clock,
  Hammer,
} from "lucide-react";

export const metadata: Metadata = {
  title: "¡Estamos trabajando para usted! | SoloCasasChile",
  description:
    "Estamos implementando un nuevo sistema de validación y auditoría técnica de empresas constructoras para brindarte la máxima seguridad y transparencia.",
  robots: {
    index: false,
    follow: false,
  },
};

const PROXIMOS_AVANCES = [
  {
    icon: FileCheck2,
    titulo: "Auditoría Legal y Tributaria",
    desc: "Validación automatizada de personería jurídica ante el SII y verificación de antecedentes comerciales para descartar intermediarios informales.",
  },
  {
    icon: ShieldCheck,
    titulo: "Certificación Constructiva y Térmica",
    desc: "Comprobación de cumplimiento de la norma chilena OGUC (artículo 4.1.10 de aislación térmica, cálculo estructural y calidad de paneles SIP o madera).",
  },
  {
    icon: Building2,
    titulo: "Inspección de Obras y Plantas",
    desc: "Verificación en terreno de fábricas de armado, salas de venta y seguimiento visual de proyectos terminados con testimonios de familias reales.",
  },
];

export default function EnConstruccionPage() {
  return (
    <main className="min-h-screen bg-background pb-24 pt-36 relative overflow-hidden flex flex-col justify-center">
      {/* Luces de fondo decorativas */}
      <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-[#27D8BE]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#073E48]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-12">
        {/* Badge superior */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 shadow-sm mx-auto">
          <HardHat className="w-4 h-4 text-amber-500 animate-bounce" />
          <span>Próximamente · Módulo en Desarrollo</span>
        </div>

        {/* Título principal */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground leading-[1.05]">
            ¡Estamos trabajando <br className="hidden sm:block" />
            <span className="gradient-text">para usted!</span>
          </h1>

          <p className="text-base sm:text-xl font-medium text-muted-foreground leading-relaxed">
            Estamos implementando un nuevo y riguroso sistema de validación y auditoría técnica de empresas constructoras para brindarle la máxima seguridad y transparencia al cotizar y construir su vivienda en Chile.
          </p>
        </div>

        {/* Tarjeta central ilustrativa */}
        <div className="rounded-[2.5rem] border border-border/60 bg-card/60 backdrop-blur-xl p-8 sm:p-12 shadow-2xl space-y-8 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-teal">
                Transparencia & Seguridad
              </span>
              <h2 className="text-xl sm:text-2xl font-heading font-black text-foreground">
                ¿Qué estamos preparando para usted?
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground bg-muted/40 px-3.5 py-1.5 rounded-full border border-border/40">
              <Clock className="w-3.5 h-3.5 text-brand-teal" />
              <span>Lanzamiento próximo</span>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {PROXIMOS_AVANCES.map((item, idx) => (
              <div
                key={idx}
                className="space-y-3 rounded-2xl bg-background/50 border border-border/40 p-5 hover:border-brand-teal/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-black text-sm text-foreground">
                  {item.titulo}
                </h3>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de alternativas: no detener al usuario */}
        <div className="space-y-6 pt-2">
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-teal">
              ¿Desea cotizar o comparar modelos ahora?
            </p>
            <p className="text-sm font-medium text-muted-foreground max-w-xl mx-auto">
              Nuestro catálogo de casas prefabricadas y el sistema de cotización inteligente se encuentran 100% operativos:
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center gap-2 h-13 px-8 rounded-full bg-[#073E48] hover:bg-[#0a4d59] text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#073E48]/20 transition-all hover:scale-105 active:scale-95"
            >
              <Home className="w-4 h-4 text-[#27D8BE]" />
              <span>Ver catálogo de modelos</span>
            </Link>

            <Link
              href="/cotizar"
              className="inline-flex items-center justify-center gap-2 h-13 px-8 rounded-full border border-[#073E48] text-[#073E48] dark:text-white dark:border-white/30 hover:bg-slate-50 dark:hover:bg-slate-900 font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#27D8BE]" />
              <span>Cotizar mi casa gratis</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 h-13 px-6 rounded-full text-muted-foreground hover:text-foreground font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <span>Volver al inicio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Contacto de cortesía */}
        <div className="border-t border-border/40 pt-8 text-xs text-muted-foreground space-y-1">
          <p>¿Tiene alguna consulta urgente sobre una empresa o proyecto?</p>
          <p>
            Escríbanos directamente a{" "}
            <a
              href="mailto:contacto@solocasaschile.com"
              className="text-[#27D8BE] font-bold hover:underline"
            >
              contacto@solocasaschile.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
