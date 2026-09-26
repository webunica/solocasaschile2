"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ThermometerSnowflake,
  Zap,
  ShieldCheck,
  Clock,
  Layers,
  CheckCircle2,
  PhoneCall,
} from "lucide-react";

interface CasasSipHeroProps {
  totalModelos?: number;
}

export function CasasSipHero({ totalModelos = 45 }: CasasSipHeroProps) {
  return (
    <section
      aria-labelledby="hero-sip-heading"
      className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-brand-teal/5 via-card/30 to-background pt-4 sm:pt-6 lg:pt-8 pb-10 sm:pb-12"
    >
      {/* Patrón de fondo y resplandor sutil */}
      <div
        className="absolute inset-0 bg-dot-pattern opacity-[0.08] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 right-1/4 w-96 h-96 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Cabecera Principal */}
        <div className="max-w-4xl space-y-5">
          {/* Eyebrow badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-teal/15 border border-brand-teal/30 px-3.5 py-1.5 text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] text-brand-teal shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-brand-teal shrink-0" aria-hidden="true" />
              <span>TECNOLOGÍA TÉRMICA & EFICIENCIA ENERGÉTICA</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 border border-border/60 px-3 py-1 text-[11px] font-bold text-muted-foreground">
              <Layers className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>Paneles SIP Certificados</span>
            </span>
          </div>

          {/* H1 SEO Optimizado */}
          <h1
            id="hero-sip-heading"
            className="font-heading font-black text-foreground tracking-tight leading-[1.08] text-[clamp(2.1rem,6vw,3.6rem)] text-balance"
          >
            Casas Prefabricadas con Paneles SIP en Chile.{" "}
            <span className="text-brand-teal block sm:inline">
              Aislación térmica extrema y montaje rápido.
            </span>
          </h1>

          {/* Descripción con keywords clave */}
          <p className="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed max-w-3xl text-pretty">
            El sistema constructivo industrializado con mayor eficiencia energética del mercado chileno. 
            Los <strong>paneles SIP</strong> (<em>Structural Insulated Panels</em>) combinan estructura monolítica 
            y aislamiento térmico continuo (núcleo de EPS de alta densidad entre placas OSB estructurales), 
            reduciendo hasta un <strong>60% el gasto en calefacción</strong> con un montaje hasta tres veces más rápido que la albañilería tradicional.
          </p>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
            <a
              href="#banner-carrusel-sip"
              className="group relative flex w-full sm:w-auto min-h-[52px] sm:min-h-[56px] items-center justify-center rounded-2xl bg-[#073E48] hover:bg-[#0a4d59] border-2 border-[#27D8BE] px-7 sm:px-8 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-[#073E48]/25 transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27D8BE] cursor-pointer"
            >
              <span>Ver Modelos y Planos SIP</span>
              <ArrowRight
                className="ml-2.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>

            <Link
              href="/catalogo?tipo=sip"
              className="group flex w-full sm:w-auto min-h-[52px] sm:min-h-[56px] items-center justify-center rounded-2xl border-2 border-border/80 bg-card hover:bg-muted/60 px-6 sm:px-7 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-foreground transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
            >
              <span>Catálogo Completo SIP ({totalModelos}+)</span>
            </Link>

            <Link
              href="/constructoras"
              className="group flex w-full sm:w-auto min-h-[52px] sm:min-h-[56px] items-center justify-center rounded-2xl border border-border/60 bg-transparent hover:bg-card/50 px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-bold tracking-wide text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
            >
              <span>Constructoras SIP</span>
            </Link>
          </div>

          {/* Micro-beneficios con check */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs text-muted-foreground font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-brand-teal shrink-0" />
              Cumple norma térmica OGUC Art. 4.1.10
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-brand-teal shrink-0" />
              Cálculo antisísmico NCh433
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-brand-teal shrink-0" />
              Kits y llave en mano en 16 regiones
            </span>
          </div>
        </div>

        {/* 4 Tarjetas de Pilares Técnicos SIP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          
          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xs p-5 hover:border-brand-teal/40 transition-colors">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal shrink-0">
                <ThermometerSnowflake className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-black text-sm text-foreground">Aislación Continua</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Elimina los puentes térmicos en tabiques y techumbres. Mantiene la casa fresca en verano y cálida en invierno.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xs p-5 hover:border-brand-teal/40 transition-colors">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-black text-sm text-foreground">Hasta 60% Ahorro</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ahorro radical en combustible y climatización eléctrica gracias a la hermeticidad de la envolvente SIP.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xs p-5 hover:border-brand-teal/40 transition-colors">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-black text-sm text-foreground">Montaje Exprés</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Paneles modulados en fábrica que se ensamblan en seco. Estructura armada en semanas reduciendo costos de obra.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xs p-5 hover:border-brand-teal/40 transition-colors">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-black text-sm text-foreground">Estructura Sólida</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Comportamiento monolítico de alta resistencia a sismos, vientos cordilleranos y humedad en el sur de Chile.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
