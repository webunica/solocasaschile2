"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Building2, ShieldCheck, Globe, ArrowRight, Search, MapPin, Phone, Home } from "lucide-react";
import { HeroLeadForm } from "./hero-lead-form";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const SLIDER_IMAGES = [
  "/images/slider/m_001.jpg",
  "/images/slider/m_002.jpg",
  "/images/slider/m_003.jpg",
  "/images/slider/m_004.jpg",
  "/images/slider/m_005.jpg",
  "/images/slider/m_006.jpg",
  "/images/slider/m_007.jpg",
  "/images/slider/m_008.jpg",
  "/images/slider/m_009.jpg",
];

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
    if (subIndex === TYPEWRITER_TEXTS[index].length + 1 && !isDeleting) {
      const timeout = setTimeout(() => setIsDeleting(true), 1500);
      return () => clearTimeout(timeout);
    }
    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % TYPEWRITER_TEXTS.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? 30 : 60);

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
    const sliderTimer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % SLIDER_IMAGES.length);
    }, 4500);

    const typeTimer = setInterval(() => {
      setTypeIndex((prev) => (prev + 1) % CONSTRUCTION_TYPES.length);
    }, 3000);

    return () => {
      clearInterval(sliderTimer);
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
            src="/images/bg/hero-main.jpg"
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
            src="/images/bg/hero-main.jpg"
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
              <h1 className="flex flex-col gap-2 md:gap-5 items-center lg:items-start w-full">
                <div className="flex flex-col gap-0 items-center lg:items-start w-full">
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
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md mx-auto lg:mx-0 bg-white/20 backdrop-blur-md p-2 rounded-2xl border border-white/40 shadow-xl mt-6">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5 opacity-60" />
                    <select
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
                      <option value="ohiggins">O'Higgins</option>
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
                    onClick={handleSearch}
                    className="h-12 bg-primary text-white font-black px-8 rounded-xl shadow-lg shadow-primary/30 hover:bg-[#1b0088] transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    Buscar <Search className="w-4 h-4" />
                  </button>
                </div>

                <ul className="grid grid-cols-2 gap-y-2 gap-x-2 mt-4 lg:mt-6 w-full max-w-md mx-auto lg:mx-0">
                  {CONSTRUCTION_TYPES.map((type) => (
                    <li key={type} className="flex items-center gap-2 text-[11px] md:text-xs font-black text-slate-800 tracking-wider">
                      <div className="w-4 h-4 rounded-full bg-brand-teal/20 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-2.5 h-2.5 text-brand-teal" />
                      </div>
                      {type}
                    </li>
                  ))}
                </ul>
              </h1>

              {/* Typewriter replaced CTA and Stats */}
              <TypewriterLoop />
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
