"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ShieldCheck, Search, MapPin, Phone, Home, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const HERO_BACKGROUND_IMAGES = [
  {
    src: "/images/bg/casas-prefabricas-hero-home.jpg",
    alt: "Casa prefabricada en Chile",
  },
  {
    src: "/images/bg/casas-prefabricas-hero-home-2.jpg",
    alt: "Casa moderna prefabricada",
  },
] as const;

const HERO_MOBILE_BACKGROUND = {
  src: "/images/bg/casas-prefabricas-hero-home-mobile.jpg",
  alt: "Casa prefabricada optimizada para vista mobile",
} as const;

const CONSTRUCTION_TYPES = [
  "PREFABRICADAS",
  "PANEL SIP",
  "MODULARES",
  "CONTAINERS",
  "STEEL FRAMING",
  "MADERA",
  "HORMIGÓN",
];

const TYPEWRITER_TEXTS = [
  "Fichas Claras de Modelos",
  "Constructoras validadas",
  "En 16 Regiones"
];

function TypewriterLoop() {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = TYPEWRITER_TEXTS[index];
    const delay = subIndex === currentText.length && !isDeleting ? 1500 : isDeleting ? 30 : 60;

    const timeout = setTimeout(() => {
      if (!isDeleting && subIndex < currentText.length) {
        setSubIndex((prev) => prev + 1);
        return;
      }

      if (!isDeleting) {
        setIsDeleting(true);
        return;
      }

      if (subIndex > 0) {
        setSubIndex((prev) => prev - 1);
        return;
      }

      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % TYPEWRITER_TEXTS.length);
    }, delay);

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting]);

  return (
    <div className="mt-8 flex h-8 w-full flex-row items-center justify-center text-[18px] font-black uppercase tracking-[0.15em] text-white md:text-[22px] lg:justify-start">
      {TYPEWRITER_TEXTS[index].substring(0, subIndex)}
      <span className="animate-pulse bg-brand-teal ml-1 w-2.5 h-6 opacity-80 inline-block" />
    </div>
  );
}

export function HeroSection() {
  const [typeIndex, setTypeIndex] = useState(0);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState("");
  const router = useRouter();
  const currentHeroBackground = HERO_BACKGROUND_IMAGES[heroImageIndex] ?? HERO_BACKGROUND_IMAGES[0];

  const handleSearch = () => {
    if (selectedRegion) {
      router.push(`/catalogo?region=${selectedRegion}`);
    } else {
      router.push(`/catalogo`);
    }
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);

    if (region) {
      router.push(`/catalogo?region=${region}`);
    }
  };

  useEffect(() => {
    const typeTimer = setInterval(() => {
      setTypeIndex((prev) => (prev + 1) % CONSTRUCTION_TYPES.length);
    }, 3000);
    const imageTimer = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % HERO_BACKGROUND_IMAGES.length);
    }, 7000);

    return () => {
      clearInterval(typeTimer);
      clearInterval(imageTimer);
    };
  }, []);

  return (
    <section className="relative z-10 flex items-center pt-[120px] md:pt-[150px] pb-10 md:pb-16 overflow-x-clip w-full hero-bg-custom min-h-auto md:min-h-[70vh]">

      {/* ── Background images ── */}
      <div className="absolute inset-0 z-0">
        {/* Mobile/Tablet Background */}
        <div className="block lg:hidden absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`mobile-${HERO_MOBILE_BACKGROUND.src}`}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={HERO_MOBILE_BACKGROUND.src}
                alt={HERO_MOBILE_BACKGROUND.alt}
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop Background */}
        <div className="hidden lg:block absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`desktop-${currentHeroBackground.src}`}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={currentHeroBackground.src}
                alt={currentHeroBackground.alt}
                fill
                className="object-cover object-center"
                priority={heroImageIndex === 0}
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-black/58 via-black/28 to-black/10" />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container relative z-10 max-w-5xl mx-auto px-5 md:px-12 flex flex-col items-center">
        <div className="flex flex-col items-center w-full">

          {/* Main content centered */}
          <div className="flex flex-col gap-6 md:gap-10 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-5 md:space-y-12 flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              {/* Top Text */}
              <div className="text-brand-indigo font-black uppercase tracking-tight text-sm md:text-base pt-6 md:pt-10 leading-tight lg:text-white">
                Cientos de modelos de casas<br />
                Prefabricadas en un solo lugar
              </div>

              {/* Headline */}
              <div className="flex flex-col gap-2 md:gap-5 items-center lg:items-start w-full">
                <h1 className="flex flex-col gap-0 items-center lg:items-start w-full">
                  <span className="bg-gradient-to-r from-[#dca24e] to-[#b76a1e] bg-clip-text text-[clamp(2.25rem,8vw,4rem)] font-black tracking-[-0.05em] leading-none text-transparent uppercase">
                    CASAS
                  </span>
                  {/* H1 Oculto para SEO - Refuerza la keyword principal ante bots */}
                  <h1 className="sr-only">Casas Prefabricadas Chile — Comparador de modelos, precios y constructoras 2026</h1>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={typeIndex}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.35 }}
                      className="text-brand-teal text-[clamp(2rem,8vw,64px)] font-black tracking-[-0.05em] leading-none uppercase"
                    >
                      {CONSTRUCTION_TYPES[typeIndex]}
                    </motion.span>
                  </AnimatePresence>
                </h1>

                <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md mx-auto lg:mx-0 bg-white/20 backdrop-blur-md p-2 rounded-2xl border border-white/40 shadow-xl mt-6">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5 opacity-60" />
                    <select
                      id="hero-region-select"
                      aria-label="Selecciona la región donde buscas"
                      className="w-full h-12 pl-12 pr-4 bg-white text-slate-800 rounded-xl font-bold appearance-none outline-none focus:ring-2 focus:ring-primary/50 shadow-sm cursor-pointer"
                      value={selectedRegion}
                      onChange={(e) => handleRegionChange(e.target.value)}
                    >
                      <option value="">¿En qué región buscas?</option>
                      <option value="arica">Arica y Parinacota</option>
                      <option value="tarapaca">Tarapacá</option>
                      <option value="antofagasta">Antofagasta</option>
                      <option value="atacama">Atacama</option>
                      <option value="coquimbo">Coquimbo</option>
                      <option value="valparaiso">Valparaíso</option>
                      <option value="metropolitana">Región Metropolitana</option>
                      <option value="ohiggins">O&apos;Higgins</option>
                      <option value="maule">Maule</option>
                      <option value="nuble">Ñuble</option>
                      <option value="biobio">Biobío</option>
                      <option value="araucania">La Araucanía</option>
                      <option value="los-rios">Los Ríos</option>
                      <option value="los-lagos">Los Lagos</option>
                      <option value="aysen">Aysén</option>
                      <option value="magallanes">Magallanes</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleSearch}
                    aria-label="Buscar modelos de casas en la región seleccionada"
                    className="h-12 bg-primary text-white font-black px-8 rounded-xl shadow-lg shadow-primary/30 hover:bg-[#1b0088] transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    Buscar <Search className="w-4 h-4" />
                  </button>
                </div>

                <ul className="grid grid-cols-2 gap-y-3 gap-x-4 mt-6 lg:mt-8 w-full max-w-md mx-auto lg:mx-0">
                  {CONSTRUCTION_TYPES.map((type) => {
                    const hrefMap: Record<string, string> = {
                      "PREFABRICADAS": "/catalogo?tipo=prefabricada",
                      "PANEL SIP": "/catalogo?tipo=sip",
                      "MODULARES": "/catalogo?tipo=modular",
                      "CONTAINERS": "/catalogo?tipo=container",
                      "STEEL FRAMING": "/catalogo?tipo=steel-framing",
                      "MADERA": "/catalogo?tipo=madera",
                      "HORMIGÓN": "/catalogo?tipo=hormigon",
                    };
                    const href = hrefMap[type] || "/catalogo";

                    return (
                      <li key={type}>
                        <Link href={href} className="group flex items-center gap-3 text-[13px] md:text-sm font-black text-white tracking-wider hover:translate-x-1 transition-transform">
                          <div className="w-6 h-6 rounded-full bg-brand-teal flex items-center justify-center shrink-0 shadow-lg shadow-brand-teal/20 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="opacity-95 group-hover:opacity-100 group-hover:text-brand-teal transition-all underline decoration-brand-teal/50 underline-offset-4 decoration-2">
                            {type}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                  {/* Item 8: Pronto casas rodantes */}
                  <li className="flex items-center gap-3 text-[13px] md:text-sm font-black text-white/85 tracking-wider">
                    <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shrink-0 border border-white/50">
                      <Zap className="w-3.5 h-3.5 text-brand-indigo" />
                    </div>
                    <span className="italic font-medium text-white/85">¡Pronto casas rodantes!</span>
                  </li>
                </ul>
              </div>

              {/* Typewriter replaced CTA and Stats */}
              <div className="space-y-6 w-full">
                <TypewriterLoop />
                
                {/* Blindaje de Identidad */}
                <div className="pt-4 border-t border-white/25 lg:max-w-md mx-auto lg:mx-0">
                  <p className="text-xs md:text-[13px] font-bold text-white/82 uppercase tracking-widest leading-relaxed">
                    <span className="text-brand-teal font-black">Nota de Independencia:</span> SolocasasChile es un comparador independiente de modelos y constructoras. No somos una constructora ni vendemos directamente viviendas.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right column removed - Animation removed */}
        </div>
      </div>
    </section>
  );
}
