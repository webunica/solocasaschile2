"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { MapPin, Phone, Globe, ShieldCheck, Star, ExternalLink, X, Building2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ConstructoraGeoItem {
  id: string;
  nombre: string;
  slug: string;
  logo_url?: string | null;
  descripcion?: string | null;
  plan?: string | null;
  verificada?: boolean | null;
  score_confianza?: number | null;
  regiones?: string[] | null;
  proyectos_completados?: number | null;
  sitio_web?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  lat?: number | null;
  lng?: number | null;
}

interface InteractiveMapProps {
  constructoras: ConstructoraGeoItem[];
}

// Coordenadas centro de Chile (Región Metropolitana / Zona Central)
const CHILE_CENTER: [number, number] = [-33.4489, -70.6693];
const DEFAULT_ZOOM = 6;

// Coordenadas fallback por región para constructoras sin lat/lng exacto
const REGION_COORDS: Record<string, [number, number]> = {
  arica: [-18.4783, -70.3126],
  tarapaca: [-20.2133, -70.1503],
  antofagasta: [-23.6509, -70.3975],
  atacama: [-27.3668, -70.3323],
  coquimbo: [-29.9533, -71.3436],
  valparaiso: [-33.0472, -71.6127],
  metropolitana: [-33.4489, -70.6693],
  ohiggins: [-34.1708, -70.7444],
  maule: [-35.4264, -71.6554],
  nuble: [-36.6063, -72.1034],
  biobio: [-36.8201, -73.0444],
  araucania: [-38.7359, -72.5904],
  losrios: [-39.8142, -73.2459],
  loslagos: [-41.4693, -72.9424],
  aysen: [-45.5752, -72.0662],
  magallanes: [-53.1638, -70.9171],
};

function normalizeRegionKey(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}

export default function InteractiveMapClient({ constructoras }: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedConstructora, setSelectedConstructora] = useState<ConstructoraGeoItem | null>(null);
  const [filterRegion, setFilterRegion] = useState<string>("todas");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Obtener items con coordenadas válidas (reales o estimadas por región)
  const itemsWithCoords = constructoras.map((c, index) => {
    if (c.lat && c.lng && !isNaN(c.lat) && !isNaN(c.lng)) {
      return { ...c, validLat: c.lat, validLng: c.lng };
    }

    // Si no tiene lat/lng, estimar a partir de su primera región asignada
    if (c.regiones && c.regiones.length > 0) {
      const firstRegKey = normalizeRegionKey(c.regiones[0]);
      const coords = REGION_COORDS[firstRegKey];
      if (coords) {
        // Dispersión sutil aleatoria para no apilar pines exactamente en el mismo punto
        const jitterLat = (Math.sin(index * 999) * 0.04);
        const jitterLng = (Math.cos(index * 999) * 0.04);
        return {
          ...c,
          validLat: coords[0] + jitterLat,
          validLng: coords[1] + jitterLng,
        };
      }
    }

    return null;
  }).filter((item): item is (ConstructoraGeoItem & { validLat: number; validLng: number }) => item !== null);

  // Filtrado de constructoras
  const filteredConstructoras = itemsWithCoords.filter((c) => {
    const matchesQuery = !searchQuery.trim() || 
      c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.direccion && c.direccion.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRegion = filterRegion === "todas" || 
      (c.regiones && c.regiones.some(r => normalizeRegionKey(r).includes(normalizeRegionKey(filterRegion))));

    return matchesQuery && matchesRegion;
  });

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Crear mapa Leaflet
    const map = L.map(mapContainerRef.current, {
      center: CHILE_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: 4,
      maxZoom: 18,
      scrollWheelZoom: false,
    });

    // Capa de tiles OpenStreetMap con estilo limpio
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Actualizar marcadores cuando cambien los datos o filtros
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    filteredConstructoras.forEach((item) => {
      const isPremium = item.plan === "premium";
      const isPro = item.plan === "pro";

      const pinColor = isPremium ? "#0f766e" : isPro ? "#00262b" : "#64748b";
      const badgeText = isPremium ? "PREMIUM" : isPro ? "PRO" : "INFO";

      const customHtml = `
        <div style="
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          background: ${pinColor};
          color: white;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 14px rgba(0, 38, 43, 0.35);
          cursor: pointer;
          transition: transform 0.15s ease;
        " onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">
          <svg style="width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span style="
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            background: #ffffff;
            color: ${pinColor};
            font-size: 8px;
            font-weight: 900;
            padding: 1px 4px;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            white-space: nowrap;
          ">${badgeText}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: "custom-leaflet-pin",
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const marker = L.marker([item.validLat, item.validLng], { icon: customIcon });

      marker.on("click", () => {
        setSelectedConstructora(item);
        map.flyTo([item.validLat, item.validLng], Math.max(map.getZoom(), 11), {
          duration: 1.2,
        });
      });

      marker.addTo(layer);
    });
  }, [filteredConstructoras]);

  return (
    <div className="space-y-6">
      {/* Controles de búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-card/60 border border-border/50 p-4 rounded-2xl">
        <div className="flex flex-wrap gap-2 items-center text-xs">
          <span className="font-black uppercase tracking-wider text-muted-foreground mr-1">Filtrar:</span>
          {["todas", "metropolitana", "valparaiso", "biobio", "la araucania", "los lagos"].map((reg) => (
            <button
              key={reg}
              type="button"
              onClick={() => setFilterRegion(reg)}
              className={cn(
                "px-3.5 py-1.5 rounded-full font-bold capitalize transition-all",
                filterRegion === reg
                  ? "bg-brand-indigo text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {reg === "todas" ? "Todas las regiones" : reg}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">
            {filteredConstructoras.length} en el mapa
          </span>
        </div>
      </div>

      {/* Contenedor del Mapa y Drawer de Detalle */}
      <div className="relative rounded-[2.5rem] overflow-hidden border border-border/50 shadow-2xl bg-muted/20 min-h-[560px] h-[650px] z-0">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Tarjeta flotante con detalle de constructora seleccionada */}
        {selectedConstructora && (
          <div className="absolute top-4 right-4 z-[500] max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-background/95 backdrop-blur-xl border border-border/60 rounded-[2rem] p-6 shadow-2xl space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] font-black uppercase tracking-widest",
                        selectedConstructora.plan === "premium"
                          ? "bg-brand-teal/10 text-brand-teal border-brand-teal/30"
                          : selectedConstructora.plan === "pro"
                          ? "bg-brand-indigo/10 text-brand-indigo border-brand-indigo/30"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {selectedConstructora.plan === "premium" ? "Empresa Premium" : selectedConstructora.plan === "pro" ? "Plan Pro" : "Directorio Informativo"}
                    </Badge>
                    {selectedConstructora.verificada && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-brand-teal">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verificada
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-heading font-black tracking-tight text-foreground">
                    {selectedConstructora.nombre}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedConstructora(null)}
                  className="rounded-full p-1.5 bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Cerrar detalle"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedConstructora.descripcion && (
                <p className="text-xs font-medium text-muted-foreground line-clamp-3 leading-relaxed">
                  {selectedConstructora.descripcion}
                </p>
              )}

              {/* Información de contacto */}
              <div className="space-y-2 pt-2 border-t border-border/40 text-xs text-foreground/80">
                {selectedConstructora.direccion && (
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 shrink-0 text-brand-teal mt-0.5" />
                    <span className="leading-snug">{selectedConstructora.direccion}</span>
                  </div>
                )}
                {selectedConstructora.telefono && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 shrink-0 text-brand-indigo" />
                    <a href={`tel:${selectedConstructora.telefono}`} className="font-bold hover:underline">
                      {selectedConstructora.telefono}
                    </a>
                  </div>
                )}
                {selectedConstructora.sitio_web && (
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 shrink-0 text-brand-teal" />
                    <a
                      href={selectedConstructora.sitio_web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-brand-teal hover:underline truncate"
                    >
                      {selectedConstructora.sitio_web.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
              </div>

              {/* Enlace a Ficha Oficial si existe */}
              <div className="pt-2">
                <Link
                  href={selectedConstructora.slug ? `/constructora/${selectedConstructora.slug}` : `/catalogo`}
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "w-full rounded-xl bg-brand-indigo text-white font-extrabold text-xs uppercase tracking-wider h-10 hover:bg-brand-indigo/90"
                  )}
                >
                  Ver modelos y cotizar
                  <ExternalLink className="ml-2 w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Leyenda en el mapa */}
        <div className="absolute bottom-4 left-4 z-[400] bg-background/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-border/50 text-[11px] font-bold text-foreground/80 flex items-center gap-4 shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#0f766e] inline-block border border-white" />
            <span>Premium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#00262b] inline-block border border-white" />
            <span>Pro</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#64748b] inline-block border border-white" />
            <span>Informativo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
