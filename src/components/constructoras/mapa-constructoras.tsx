"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Users2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Regiones de Chile con coordenadas SVG aproximadas para un mapa simplificado
const REGIONES_CHILE = [
  { id: "arica", nombre: "Arica y Parinacota", numero: "XV", x: 97, y: 38 },
  { id: "tarapaca", nombre: "Tarapacá", numero: "I", x: 117, y: 72 },
  { id: "antofagasta", nombre: "Antofagasta", numero: "II", x: 133, y: 130 },
  { id: "atacama", nombre: "Atacama", numero: "III", x: 130, y: 210 },
  { id: "coquimbo", nombre: "Coquimbo", numero: "IV", x: 120, y: 278 },
  { id: "valparaiso", nombre: "Valparaíso", numero: "V", x: 102, y: 326 },
  { id: "metropolitana", nombre: "Metropolitana", numero: "RM", x: 120, y: 342 },
  { id: "ohiggins", nombre: "O'Higgins", numero: "VI", x: 128, y: 362 },
  { id: "maule", nombre: "Maule", numero: "VII", x: 130, y: 395 },
  { id: "nuble", nombre: "Ñuble", numero: "XVI", x: 132, y: 426 },
  { id: "biobio", nombre: "Biobío", numero: "VIII", x: 130, y: 450 },
  { id: "araucania", nombre: "La Araucanía", numero: "IX", x: 125, y: 486 },
  { id: "losrios", nombre: "Los Ríos", numero: "XIV", x: 118, y: 522 },
  { id: "loslagos", nombre: "Los Lagos", numero: "X", x: 108, y: 568 },
  { id: "aysen", nombre: "Aysén", numero: "XI", x: 100, y: 636 },
  { id: "magallanes", nombre: "Magallanes", numero: "XII", x: 90, y: 726 },
];

interface Constructora {
  id: string;
  nombre: string;
  slug: string;
  regiones?: string[];
  plan?: string;
  score_confianza?: number;
}

interface Props {
  constructoras: Constructora[];
}

export function MapaConstructoras({ constructoras }: Props) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Index constructoras by region name (lowercase, normalized)
  const byRegion: Record<string, Constructora[]> = {};
  constructoras.forEach((c) => {
    (c.regiones || []).forEach((r) => {
      const key = r.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (!byRegion[key]) byRegion[key] = [];
      byRegion[key].push(c);
    });
  });

  const getRegionKey = (nombre: string) =>
    nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const getRegionConstructoras = (nombre: string) =>
    byRegion[getRegionKey(nombre)] || [];

  const activeRegion = selectedRegion
    ? REGIONES_CHILE.find((r) => r.id === selectedRegion)
    : hoveredRegion
    ? REGIONES_CHILE.find((r) => r.id === hoveredRegion)
    : null;

  const activeConstructoras = activeRegion
    ? getRegionConstructoras(activeRegion.nombre)
    : [];

  return (
    <div className="flex flex-col xl:flex-row gap-10 items-start">
      {/* SVG Map */}
      <div className="relative flex-shrink-0">
        <svg
          viewBox="0 30 230 760"
          className="w-full max-w-[240px] mx-auto"
          style={{ filter: "drop-shadow(0 20px 40px rgba(27,0,136,0.08))" }}
        >
          {/* Chile mainland silhouette (simplified elongated shape) */}
          <path
            d="M160 32 C155 32 148 36 143 42 L130 65 C124 52 110 48 104 60 L95 82 C88 90 92 108 100 118 L105 145 C100 168 118 190 122 215 L120 245 C115 268 108 288 110 310 L100 330 C90 342 88 356 98 368 L112 375 C118 390 125 405 128 422 L126 448 C122 466 118 484 120 502 L115 525 C108 548 102 570 98 595 L90 625 C85 652 82 680 78 710 L72 738 C75 760 88 768 100 762 L108 750 C115 740 120 728 118 716 L122 695 C128 678 134 660 132 640 L138 610 C144 588 148 566 146 544 L150 518 C154 495 158 472 156 450 L160 425 C164 402 168 378 166 356 L168 335 C170 316 172 296 168 278 L170 255 C172 235 175 215 172 195 L174 170 C176 148 178 126 175 106 L174 84 C172 66 168 48 160 36 Z"
            className="fill-brand-indigo/5 stroke-brand-indigo/20"
            strokeWidth="2"
          />

          {/* Region dots */}
          {REGIONES_CHILE.map((region) => {
            const constructorasHere = getRegionConstructoras(region.nombre);
            const count = constructorasHere.length;
            const isActive = hoveredRegion === region.id || selectedRegion === region.id;
            const hasPremium = constructorasHere.some((c) => c.plan === "premium");

            return (
              <g key={region.id}>
                {/* Glow ring for regions with premium constructoras */}
                {hasPremium && (
                  <circle
                    cx={region.x}
                    cy={region.y}
                    r={count > 0 ? 14 : 8}
                    className="fill-brand-teal/20 animate-pulse"
                  />
                )}
                {/* Main dot */}
                <circle
                  cx={region.x}
                  cy={region.y}
                  r={count > 5 ? 10 : count > 2 ? 8 : count > 0 ? 6 : 4}
                  className={`
                    cursor-pointer transition-all duration-200
                    ${count > 0
                      ? isActive
                        ? "fill-brand-teal stroke-white"
                        : "fill-brand-indigo stroke-white hover:fill-brand-teal"
                      : "fill-muted-foreground/20 stroke-muted-foreground/30 cursor-default"
                    }
                  `}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  onMouseEnter={() => count > 0 && setHoveredRegion(region.id)}
                  onMouseLeave={() => !selectedRegion && setHoveredRegion(null)}
                  onClick={() => count > 0 && setSelectedRegion(selectedRegion === region.id ? null : region.id)}
                />
                {/* Count label */}
                {count > 0 && (
                  <text
                    x={region.x}
                    y={region.y + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white font-black pointer-events-none"
                    fontSize={count > 5 ? 7 : 6}
                    fontWeight="900"
                  >
                    {count}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center max-w-[240px] mx-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <div className="w-3 h-3 rounded-full bg-brand-indigo" />
            Con constructoras
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <div className="w-3 h-3 rounded-full bg-brand-teal" />
            Premium activas
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="flex-1 space-y-6 min-w-0">
        {activeRegion && activeConstructoras.length > 0 ? (
          <motion.div
            key={activeRegion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Badge className="bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20 font-black text-[10px] uppercase tracking-widest">
                Región {activeRegion.numero}
              </Badge>
              <h3 className="text-3xl font-heading font-black tracking-tight">{activeRegion.nombre}</h3>
              <p className="text-muted-foreground font-medium flex items-center gap-2">
                <Users2 className="w-4 h-4" />
                {activeConstructoras.length} constructora{activeConstructoras.length !== 1 ? "s" : ""} activa{activeConstructoras.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="space-y-3">
              {activeConstructoras.map((c) => (
                <Link
                  key={c.id}
                  href={`/constructora/${c.slug}`}
                  className="flex items-center justify-between p-4 rounded-2xl border border-border/60 bg-card/40 hover:bg-card hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-indigo/10 to-brand-teal/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-brand-indigo" />
                    </div>
                    <div>
                      <p className="font-black text-sm tracking-tight">{c.nombre}</p>
                      {c.score_confianza && (
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                          Score {c.score_confianza}/100
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {c.plan === "premium" && (
                      <Badge className="bg-amber-500/10 text-amber-600 border-none text-[9px] uppercase tracking-widest font-black">Premium</Badge>
                    )}
                    {c.plan === "pro" && (
                      <Badge className="bg-blue-500/10 text-blue-600 border-none text-[9px] uppercase tracking-widest font-black">Pro</Badge>
                    )}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center">
              <MapPin className="w-10 h-10 text-muted-foreground opacity-30" />
            </div>
            <div className="space-y-2">
              <p className="font-black text-xl opacity-40 uppercase tracking-wider">
                Selecciona una región
              </p>
              <p className="text-sm text-muted-foreground font-medium max-w-xs">
                Haz clic en un punto del mapa para ver las constructoras activas en esa región de Chile.
              </p>
            </div>
            <div className="text-sm text-muted-foreground font-bold opacity-60 pt-4">
              {constructoras.length} constructoras en todo Chile
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
