"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ShieldCheck, Search, MapPin, Phone, Home, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const HERO_BACKGROUND_IMAGE = "/images/bg/casas-prefabricas-hero-home.jpg";

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
    <div className="text-base md:text-xl font-black text-[#5340a1] uppercase tracking-[0.15em] mt-8 h-8 flex flex-row items-center justify-center lg:justify-start w-full drop-shadow-sm">
      {TYPEWRITER_TEXTS[index].substring(0, subIndex)}
      <span className="animate-pulse bg-brand-teal ml-1 w-2.5 h-6 opacity-80 inline-block" />
    </div>
  );
}

export function HeroSection() {
  const [typeIndex, setTypeIndex] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (selectedRegion) {
      router.push(`/catalogo?region=${selectedRegion}`);
    } else {
      router.push(`/catalogo`);
    }
  };

  useEffect(() => {
    const typeTimer = setInterval(() => {
      setTypeIndex((prev) => (prev + 1) % CONSTRUCTION_TYPES.length);
    }, 3000);

    return () => {
      clearInterval(typeTimer);
    };
  }, []);

  return (
    <section className="relative flex items-center pt-[120px] md:pt-[150px] pb-10 md:pb-16 overflow-x-clip w-full hero-bg-custom min-h-auto md:min-h-[70vh]">

      {/* ── Background images ── */}
      <div className="absolute inset-0 z-0">
        {/* Mobile/Tablet Background */}
        <div className="block lg:hidden absolute inset-0">
          <Image
            src={HERO_BACKGROUND_IMAGE}
            alt="Casa prefabricada en Chile"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/88 via-background/72 to-background/96" />
        </div>

        {/* Desktop Background */}
        <div className="hidden lg:block absolute inset-0">
          <Image
            src={HERO_BACKGROUND_IMAGE}
            alt="Casa moderna prefabricada"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/92 via-background/60 to-background/10" />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container relative z-10 max-w-7xl mx-auto px-5 md:px-12 flex flex-col items-center">
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-8 lg:gap-8 items-center lg:items-start w-full">

          {/* Left column */}
          <div className="flex flex-col gap-6 md:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-5 md:space-y-12 flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              {/* Top Text */}
              <div className="text-brand-indigo font-black uppercase tracking-tight text-sm md:text-base pt-6 md:pt-10 leading-tight">
                Cientos de modelos de casas<br />
                Prefabricadas en un solo lugar
              </div>

              {/* Headline */}
              <div className="flex flex-col gap-2 md:gap-5 items-center lg:items-start w-full">
                <h1 className="flex flex-col gap-0 items-center lg:items-start w-full">
                  <span className="text-[clamp(2rem,8vw,3.75rem)] font-black tracking-[-0.05em] leading-none text-brand-indigo uppercase [text-shadow:0_1px_8px_rgba(255,255,255,0.9)]">
                    CASAS
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={typeIndex}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.35 }}
                      className="text-brand-teal text-[clamp(2rem,8vw,64px)] font-black tracking-[-0.05em] leading-none uppercase [text-shadow:0_2px_16px_rgba(0,0,0,0.6),0_0_8px_rgba(0,0,0,0.4)]"
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
                      onChange={(e) => setSelectedRegion(e.target.value)}
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
                        <Link href={href} className="group flex items-center gap-3 text-[11px] md:text-xs font-black text-[#1b0088] tracking-wider hover:translate-x-1 transition-transform">
                          <div className="w-6 h-6 rounded-full bg-brand-teal flex items-center justify-center shrink-0 shadow-lg shadow-brand-teal/20 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="opacity-80 group-hover:opacity-100 group-hover:text-primary transition-all underline decoration-brand-teal/30 underline-offset-4 decoration-2">
                            {type}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                  {/* Item 8: Pronto casas rodantes */}
                  <li className="flex items-center gap-3 text-[11px] md:text-xs font-black text-slate-400 tracking-wider">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                      <Zap className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <span className="text-slate-600 italic font-medium">¡Pronto casas rodantes!</span>
                  </li>
                </ul>
              </div>

              {/* Typewriter replaced CTA and Stats */}
              <div className="space-y-6 w-full">
                <TypewriterLoop />
                
                {/* Blindaje de Identidad */}
                <div className="pt-4 border-t border-brand-indigo/10 lg:max-w-md mx-auto lg:mx-0">
                  <p className="text-[10px] md:text-[11px] font-bold text-brand-indigo/60 uppercase tracking-widest leading-relaxed">
                    <span className="text-brand-indigo font-black">Nota de Independencia:</span> SolocasasChile es un comparador independiente de modelos y constructoras. No somos una constructora ni vendemos directamente viviendas.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Circular Animation Area */}
          <div className="hidden lg:flex flex-col h-full items-center justify-center w-full min-h-[400px]">
            <div className="relative w-[340px] h-[340px] flex items-center justify-center">
              {/* Spinning Dashed Track */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, ease: "linear", repeat: Infinity }}
                className="absolute inset-0 rounded-full border-[2px] border-dashed border-primary/30"
              />

              {/* Center Logo */}
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-2xl z-10 border border-white/50 w-48 h-48 flex items-center justify-center">
                <Image src="/images/busqueda.png" alt="Búsqueda" width={150} height={150} className="w-full h-auto object-contain drop-shadow-md" unoptimized />
              </div>

              {/* Orbiting Icons */}
              {[
                { icon: Search, color: "text-blue-600", bg: "bg-blue-50" },
                { icon: MapPin, color: "text-teal-600", bg: "bg-teal-50" },
                { icon: Home, color: "text-[#1b0088]", bg: "bg-indigo-50" },
                { icon: Phone, color: "text-purple-600", bg: "bg-purple-50" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 pointer-events-none"
                  initial={{ rotate: i * 90 }}
                  animate={{ rotate: 360 + (i * 90) }}
                  transition={{ duration: 30, ease: "linear", repeat: Infinity }}
                >
                  <motion.div
                    className={`absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 ${item.bg} rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-white flex items-center justify-center ${item.color} pointer-events-auto hover:scale-110 transition-transform cursor-help`}
                    initial={{ rotate: -(i * 90) }}
                    animate={{ rotate: -(360 + (i * 90)) }}
                    transition={{ duration: 30, ease: "linear", repeat: Infinity }}
                  >
                    <item.icon className="w-7 h-7" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
