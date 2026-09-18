import Link from "next/link";
import { Phone, Globe, MapPin, Star, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  type ConstructoraUnificada, 
  getTiposCasaConstructora, 
  TIPOS_CASA_CONSTRUCTORA 
} from "@/lib/constructoras-data";

interface Props {
  constructora: ConstructoraUnificada;
  rank: number;
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} de 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < full
              ? "fill-amber-400 text-amber-400"
              : i === full && half
              ? "fill-amber-400/50 text-amber-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

export function RegionConstructoraCard({ constructora: c, rank }: Props) {
  const isPremium = ["premium", "avanza", "pro"].includes(c.plan);
  const tipos = getTiposCasaConstructora(c).filter((t) => t !== "todas");

  return (
    <article
      className={`group relative flex flex-col gap-4 rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
        ${isPremium
          ? "border-primary/30 bg-card shadow-md shadow-primary/5"
          : "border-border/40 bg-card/60 hover:border-border"
        }`}
    >
      {/* Rank badge */}
      <div
        className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-lg
          ${rank <= 3
            ? "bg-amber-400 text-amber-950"
            : "bg-muted text-muted-foreground border border-border"
          }`}
        aria-label={`Posición ${rank}`}
      >
        {rank}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 pt-1">
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold text-base leading-tight text-foreground truncate">
            {c.nombre}
          </h3>
          {c.direccion && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              {c.direccion.split(" - ").pop() ?? c.direccion}
            </p>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {c.verificada && (
            <Badge className="bg-brand-teal/15 text-brand-teal border-brand-teal/30 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 gap-1">
              <BadgeCheck className="w-3 h-3" />
              Verificada
            </Badge>
          )}
          {isPremium && (
            <Badge className="brand-gradient text-white border-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
              {c.plan === "premium" ? "Premium" : c.plan === "avanza" ? "Avanza" : "Pro"}
            </Badge>
          )}
        </div>
      </div>

      {/* Tipologías */}
      {tipos.length > 0 && (
        <div className="flex flex-wrap gap-1 -mt-1">
          {tipos.map((t) => {
            const info = TIPOS_CASA_CONSTRUCTORA.find((tc) => tc.id === t);
            if (!info) return null;
            return (
              <span
                key={t}
                className="text-[10px] font-bold bg-muted/70 text-muted-foreground hover:text-foreground px-2 py-0.5 rounded-lg flex items-center gap-1 border border-border/40"
              >
                <span>{info.emoji}</span>
                <span>{info.badge}</span>
              </span>
            );
          })}
        </div>
      )}

      {/* Rating */}
      {c.rating !== null && (
        <div className="flex items-center gap-2">
          <StarRating rating={c.rating} />
          <span className="text-sm font-bold text-foreground">{c.rating.toFixed(1)}</span>
          {c.reviews !== null && (
            <span className="text-xs text-muted-foreground">
              ({c.reviews.toLocaleString("es-CL")} reseñas)
            </span>
          )}
        </div>
      )}

      {/* Descripcion */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
        {c.descripcion}
      </p>

      {/* Contacto */}
      <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-border/30">
        {c.telefono && (
          <a
            href={`tel:${c.telefono.replace(/\s/g, "")}`}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            aria-label={`Llamar a ${c.nombre}`}
          >
            <Phone className="w-3.5 h-3.5 shrink-0 text-brand-teal" />
            <span className="truncate max-w-[120px]">{c.telefono}</span>
          </a>
        )}
        {c.sitio_web && (
          <a
            href={c.sitio_web}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors ml-auto"
            aria-label={`Visitar sitio web de ${c.nombre}`}
          >
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span>Ver sitio</span>
          </a>
        )}
        {!c.sitio_web && c.slug && (
          <Link
            href={`/constructora/${c.slug}`}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors ml-auto"
          >
            Ver perfil →
          </Link>
        )}
      </div>
    </article>
  );
}
