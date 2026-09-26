"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Layers,
  Home,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Info,
} from "lucide-react";

interface SipModelItem {
  id: string;
  tag: string;
  titulo: string;
  subtitulo: string;
  metros: number;
  dormitorios: number;
  banos: number;
  imagen: string;
  alt: string;
  badge: string;
  specs: string;
  descripcionCorta: string;
  ventajas: string[];
}

const SIP_BANNER_MODELS: SipModelItem[] = [
  {
    id: "sip-36m2",
    tag: "Modelo 36 m²",
    titulo: "Casa SIP 36 m² · Compacta y de Alto Rendimiento Térmico",
    subtitulo: "1 Dormitorio · 1 Baño · Sala y Cocina Integrada · Terraza Frontal",
    metros: 36,
    dormitorios: 1,
    banos: 1,
    imagen: "/images/modelos/sip/modelo-sip-36m2-plano.png",
    alt: "Plano arquitectónico y render 3D de casa prefabricada con paneles SIP de 36 m2 en Chile con 1 dormitorio, terraza y corte técnico de panel sándwich",
    badge: "Ideal para Parcela de Agrado o Cabaña Turística",
    specs: "36 m² útiles · Techo asimétrico ventilado · 1D / 1B",
    descripcionCorta:
      "Planta optimizada sin pasillos residuales. El corte constructivo muestra la envolvente en paneles SIP continuos que aíslan la vivienda contra heladas del sur o calor extremo.",
    ventajas: [
      "Montaje de obra gruesa habitable en solo 10 a 15 días",
      "Termopanel en ventanal principal hacia la terraza",
      "Costos de climatización reducidos al mínimo",
    ],
  },
  {
    id: "sip-60m2",
    tag: "Modelo 60 m²",
    titulo: "Casa SIP 60 m² · Diseño Contemporáneo de 2 Aguas",
    subtitulo: "2 Dormitorios · 1 Baño Amplio · Cocina Americana · Terraza Deck",
    metros: 60,
    dormitorios: 2,
    banos: 1,
    imagen: "/images/modelos/sip/modelo-sip-60m2-plano.png",
    alt: "Plano de distribución y fachada exterior de casa de paneles SIP de 60 m2 en Chile con 2 dormitorios, cocina americana y corte de panel estructural",
    badge: "El Metraje Familiar más Cotizado en Chile",
    specs: "60 m² útiles · 2 Dormitorios · 1 Baño · Deck Exterior",
    descripcionCorta:
      "Distribución inteligente que separa el área de descanso del espacio social. Estructura sándwich de alta densidad (EPS + OSB estructural) con ganancia solar pasiva.",
    ventajas: [
      "Ahorro de hasta 55% en calefacción frente a construcción convencional",
      "Estructura liviana y monolítica de excelente respuesta sísmica",
      "Amplio espacio para living-comedor conectado al exterior",
    ],
  },
  {
    id: "sip-80m2",
    tag: "Modelo 80 m²",
    titulo: "Casa SIP 80 m² · Distribución en L con Patio Interior",
    subtitulo: "3 Dormitorios · 2 Baños (Principal en Suite) · Terraza Protegida",
    metros: 80,
    dormitorios: 3,
    banos: 2,
    imagen: "/images/modelos/sip/modelo-sip-80m2-plano.png",
    alt: "Casa prefabricada de paneles SIP en L de 80 m2 en Chile con plano arquitectónico de 3 dormitorios, 2 baños y detalle constructivo de panel térmico",
    badge: "Máximo Confort Térmico y Habitabilidad",
    specs: "80 m² útiles · 3 Dormitorios · 2 Baños · Diseño en L",
    descripcionCorta:
      "La geometría en L crea un microclima exterior protegido de los vientos dominantes y asegura iluminación natural en todos los recintos sin perder aislamiento.",
    ventajas: [
      "Dormitorio principal en suite independiente con walk-in closet",
      "Aislación acústica y térmica certificada en muros perimetrales y techumbre",
      "Diseño adaptable a terrenos planos o con ligera pendiente",
    ],
  },
];

export function CasasSipCarouselBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % SIP_BANNER_MODELS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex(
      (prev) => (prev - 1 + SIP_BANNER_MODELS.length) % SIP_BANNER_MODELS.length
    );
  }, []);

  // Rotación automática cada 6 segundos, pausada al pasar el cursor
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const activeModel = SIP_BANNER_MODELS[activeIndex];

  return (
    <section
      id="banner-carrusel-sip"
      aria-label="Catálogo de modelos de casas con paneles SIP y planos de distribución"
      className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Marco contenedor del banner */}
      <div className="relative rounded-3xl sm:rounded-[2.5rem] border-2 border-border/80 bg-card/85 backdrop-blur-md shadow-2xl overflow-hidden p-4 sm:p-7 lg:p-9 space-y-6">
        
        {/* Cabecera superior del banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-teal/15 border border-brand-teal/30 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-brand-teal">
                <Sparkles className="h-3 w-3" />
                INFOGRAFÍA TÉCNICA · ARQUITECTURA SIP
              </span>
              <span className="hidden sm:inline-block text-xs font-semibold text-muted-foreground">
                Exterior + Detalle Panel SIP + Planta Arquitectónica
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-black tracking-tight text-foreground">
              Modelos SIP con Planos y Corte Constructivo
            </h2>
          </div>

          {/* Selector de pestañas para cambiar rápido de modelo */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {SIP_BANNER_MODELS.map((model, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <button
                  key={model.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isCurrent
                      ? "bg-[#073E48] text-white border-2 border-[#27D8BE] shadow-md shadow-[#073E48]/20"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/60"
                  }`}
                  aria-label={`Ver infografía del ${model.tag}`}
                >
                  {model.tag}
                  <span className="hidden lg:inline ml-1 font-normal opacity-80">
                    ({model.dormitorios}D/{model.banos}B)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Área Visual Principal: Imagen Diagrama Panorámico */}
        <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-gradient-to-br from-white via-card to-muted/30 shadow-inner group">
          
          {/* Etiquetas flotantes sobre la imagen */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex flex-wrap gap-2 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-background/95 backdrop-blur-md border border-border/80 px-3 py-1.5 text-xs font-black text-foreground shadow-md">
              <Layers className="h-3.5 w-3.5 text-brand-teal" />
              {activeModel.badge}
            </span>
          </div>

          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 hidden md:flex items-center gap-1.5 rounded-xl bg-card/95 backdrop-blur-md border border-brand-teal/40 px-3 py-1.5 text-xs font-bold text-brand-teal shadow-md pointer-events-none">
            <Info className="h-3.5 w-3.5" />
            <span>Corte Técnico: Panel SIP (EPS + doble OSB)</span>
          </div>

          {/* Imagen con aspect ratio panorámico controlado */}
          <div className="relative w-full aspect-[16/7] sm:aspect-[21/8] md:aspect-[21/7] max-h-[480px] flex items-center justify-center p-2 sm:p-4 bg-white/90">
            <Image
              src={activeModel.imagen}
              alt={activeModel.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
              priority
              className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.01]"
            />
          </div>

          {/* Botones de navegación (Flechas Izquierda / Derecha) */}
          <button
            onClick={prevSlide}
            aria-label="Modelo SIP anterior"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-background/90 hover:bg-background border border-border shadow-lg flex items-center justify-center text-foreground hover:text-brand-teal transition-all duration-200 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Siguiente modelo SIP"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-background/90 hover:bg-background border border-border shadow-lg flex items-center justify-center text-foreground hover:text-brand-teal transition-all duration-200 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Indicadores de diapositiva (Puntos y Contador) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/70 shadow-md">
            {SIP_BANNER_MODELS.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setActiveIndex(dotIdx)}
                aria-label={`Ir al modelo ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  dotIdx === activeIndex
                    ? "w-6 h-2 bg-brand-teal"
                    : "w-2 h-2 bg-muted-foreground/40 hover:bg-muted-foreground"
                }`}
              />
            ))}
            <span className="text-[11px] font-black text-muted-foreground ml-1">
              {activeIndex + 1} / {SIP_BANNER_MODELS.length}
            </span>
          </div>
        </div>

        {/* Fila Inferior con Descripción Técnica y Llamado a la Acción */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
          
          {/* Detalles del modelo actual */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg sm:text-xl font-heading font-black text-foreground">
                {activeModel.titulo}
              </h3>
              <span className="inline-block rounded-lg bg-secondary px-2.5 py-1 text-xs font-bold text-muted-foreground">
                {activeModel.specs}
              </span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {activeModel.descripcionCorta}
            </p>

            {/* Lista de ventajas técnicas específicas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {activeModel.ventajas.map((ventaja, vIdx) => (
                <div key={vIdx} className="flex items-start gap-2 text-xs font-semibold text-foreground/90">
                  <CheckCircle2 className="h-4 w-4 text-brand-teal shrink-0 mt-0.5" />
                  <span>{ventaja}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Botones de acción del banner */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
            <Link
              href={`/catalogo?tipo=sip&superficie_min=${activeModel.metros - 10}&superficie_max=${activeModel.metros + 10}`}
              className="group flex items-center justify-center rounded-2xl bg-[#073E48] hover:bg-[#0a4d59] border-2 border-[#27D8BE] px-6 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-[#073E48]/20 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <span>Ver Modelos Similares en Catálogo</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/constructoras"
              className="flex items-center justify-center rounded-2xl border border-border/80 bg-card hover:bg-muted/60 px-5 py-3 text-xs sm:text-sm font-bold text-foreground transition-all duration-200 cursor-pointer"
            >
              <span>Constructoras que construyen en SIP</span>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
