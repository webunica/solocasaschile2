"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Search, Globe, Tag, Image as ImageIcon, 
  CheckCircle2, XCircle, AlertCircle, 
  TrendingUp, Eye, X 
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface SEOPanelProps {
  /** Valores iniciales (para edición) */
  initialTitle?: string;
  initialDescription?: string;
  initialKeywords?: string[];
  initialOgImage?: string;
  /** Contexto del modelo para calcular score */
  modelName?: string;
  modelDescription?: string;
  modelSlug?: string;
  /** Callbacks `onChange` — notifican al form padre */
  onTitleChange?: (v: string) => void;
  onDescriptionChange?: (v: string) => void;
  onKeywordsChange?: (v: string[]) => void;
  onOgImageChange?: (v: string) => void;
}

interface SEOCheck {
  id: string;
  label: string;
  pass: boolean;
  weight: number; // contribución al score 0-100
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function getCharColor(current: number, min: number, max: number) {
  if (current === 0) return "text-muted-foreground/40";
  if (current < min) return "text-amber-500";
  if (current > max) return "text-red-500";
  return "text-emerald-500";
}

function getBarWidth(current: number, max: number) {
  return Math.min(100, Math.round((current / max) * 100));
}

function getBarColor(current: number, min: number, max: number) {
  if (current === 0) return "bg-muted/40";
  if (current < min) return "bg-amber-400";
  if (current > max) return "bg-red-500";
  return "bg-emerald-500";
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function SEOPanel({
  initialTitle = "",
  initialDescription = "",
  initialKeywords = [],
  initialOgImage = "",
  modelName = "",
  modelDescription = "",
  modelSlug = "",
  onTitleChange,
  onDescriptionChange,
  onKeywordsChange,
  onOgImageChange,
}: SEOPanelProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [keywords, setKeywords] = useState<string[]>(initialKeywords);
  const [ogImage, setOgImage] = useState(initialOgImage);
  const [keywordInput, setKeywordInput] = useState("");

  // Preview URL
  const displaySlug = modelSlug || (modelName || "").toLowerCase().replace(/\s+/g, "-");
  const displayTitle = title || (modelName ? `${modelName} | SolocasasChile` : "Tu Modelo | SolocasasChile");
  const displayDesc = description || modelDescription || "Descubre este modelo en SolocasasChile.";

  // ── SEO Checks ──────────────────────────────
  const primaryKeyword = keywords[0] || "";

  const checks: SEOCheck[] = [
    {
      id: "title_length",
      label: "Título entre 40–60 caracteres",
      pass: title.length >= 40 && title.length <= 60,
      weight: 20,
    },
    {
      id: "desc_length",
      label: "Descripción entre 120–160 caracteres",
      pass: description.length >= 120 && description.length <= 160,
      weight: 20,
    },
    {
      id: "keyword_in_title",
      label: "Keyword principal en el título",
      pass: primaryKeyword.length > 0 && title.toLowerCase().includes(primaryKeyword.toLowerCase()),
      weight: 20,
    },
    {
      id: "keyword_in_desc",
      label: "Keyword principal en la descripción",
      pass: primaryKeyword.length > 0 && description.toLowerCase().includes(primaryKeyword.toLowerCase()),
      weight: 15,
    },
    {
      id: "has_keywords",
      label: "Al menos 3 palabras clave definidas",
      pass: keywords.length >= 3,
      weight: 10,
    },
    {
      id: "has_og_image",
      label: "Imagen OG configurada",
      pass: ogImage.trim().length > 0,
      weight: 10,
    },
    {
      id: "desc_has_content",
      label: "Descripción del modelo (campo superior) tiene más de 80 palabras",
      pass: (modelDescription || "").split(/\s+/).length >= 80,
      weight: 5,
    },
  ];

  const score = checks.reduce((acc, c) => acc + (c.pass ? c.weight : 0), 0);

  const scoreColor =
    score >= 80 ? "text-emerald-500" :
    score >= 50 ? "text-amber-500" :
    "text-red-500";

  const scoreBg =
    score >= 80 ? "bg-emerald-500" :
    score >= 50 ? "bg-amber-500" :
    "bg-red-500";

  const scoreLabel =
    score >= 80 ? "Bueno" :
    score >= 50 ? "Mejorable" :
    "Básico";

  // Circumference for circular score
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = circ - (circ * score) / 100;

  // ── Keyword handlers ─────────────────────────
  const addKeyword = useCallback(() => {
    const kw = keywordInput.trim().toLowerCase();
    if (kw && !keywords.includes(kw) && keywords.length < 10) {
      const next = [...keywords, kw];
      setKeywords(next);
      onKeywordsChange?.(next);
      setKeywordInput("");
    }
  }, [keywordInput, keywords, onKeywordsChange]);

  const removeKeyword = (kw: string) => {
    const next = keywords.filter(k => k !== kw);
    setKeywords(next);
    onKeywordsChange?.(next);
  };

  return (
    <div className="space-y-8">

      {/* Score + Header */}
      <div className="flex items-center gap-6">
        {/* Circular Score */}
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r={r} fill="none" className="stroke-muted/30" strokeWidth="8" />
            <circle
              cx="50" cy="50" r={r} fill="none"
              className={cn("transition-all duration-700", scoreBg.replace("bg-", "stroke-"))}
              strokeWidth="8"
              strokeDasharray={circ}
              strokeDashoffset={dash}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-2xl font-black tabular-nums", scoreColor)}>{score}</span>
            <span className="text-[8px] font-bold uppercase tracking-widest opacity-40">SEO</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs font-black uppercase tracking-widest opacity-40">Score SEO</span>
          </div>
          <p className={cn("text-3xl font-black tracking-tight", scoreColor)}>{scoreLabel}</p>
          <p className="text-sm text-muted-foreground">
            {score >= 80
              ? "Tu modelo está bien optimizado para Google."
              : score >= 50
                ? "Completa los campos para mejorar el ranking."
                : "Llena todos los campos para aparecer en búsquedas."}
          </p>
        </div>
      </div>

      {/* SERP Preview */}
      <div className="bg-background border border-border/50 rounded-2xl p-5 space-y-1">
        <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-3 flex items-center gap-2">
          <Eye className="w-3 h-3" /> Preview en Google
        </p>
        <p className="text-xs text-emerald-700 font-medium truncate">
          solocasaschile.com › modelo › {displaySlug || "tu-modelo"}
        </p>
        <p className="text-base font-semibold text-blue-700 truncate leading-snug hover:underline cursor-pointer">
          {displayTitle.slice(0, 62)}{displayTitle.length > 62 ? "…" : ""}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {displayDesc.slice(0, 165)}{displayDesc.length > 165 ? "…" : ""}
        </p>
      </div>

      {/* SEO Title */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
            <Search className="w-3.5 h-3.5" /> Meta Título SEO
          </Label>
          <span className={cn("text-xs font-bold tabular-nums", getCharColor(title.length, 40, 60))}>
            {title.length}/60
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted/30 overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-300", getBarColor(title.length, 40, 60))}
            style={{ width: `${getBarWidth(title.length, 60)}%` }}
          />
        </div>
        <Input
          name="seo_title"
          value={title}
          onChange={e => { setTitle(e.target.value); onTitleChange?.(e.target.value); }}
          placeholder={`Ej: ${modelName || "Tu Modelo"} | Casa SIP en Chile | SolocasasChile`}
          className="h-12 rounded-xl bg-background/50 border-border/40 focus:border-primary/40 font-medium"
          maxLength={80}
        />
        <p className="text-[10px] text-muted-foreground opacity-50">
          Si se deja vacío, se genera automáticamente desde el nombre del modelo.
        </p>
      </div>

      {/* Meta Description */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
            <Globe className="w-3.5 h-3.5" /> Meta Descripción
          </Label>
          <span className={cn("text-xs font-bold tabular-nums", getCharColor(description.length, 120, 160))}>
            {description.length}/160
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted/30 overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-300", getBarColor(description.length, 120, 160))}
            style={{ width: `${getBarWidth(description.length, 160)}%` }}
          />
        </div>
        <Textarea
          name="seo_description"
          value={description}
          onChange={e => { setDescription(e.target.value); onDescriptionChange?.(e.target.value); }}
          placeholder="Ej: Descubre el modelo SIP 120m² de TecnoFast Home en Chile. 3 dormitorios, energía eficiente, entrega en 90 días. ¡Cotiza gratis!"
          className="min-h-[90px] rounded-xl bg-background/50 border-border/40 focus:border-primary/40 text-sm p-4 resize-none"
          maxLength={200}
        />
      </div>

      {/* Keywords */}
      <div className="space-y-3">
        <Label className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
          <Tag className="w-3.5 h-3.5" /> Palabras Clave ({keywords.length}/10)
        </Label>
        <input type="hidden" name="seo_keywords" value={JSON.stringify(keywords)} />
        <div className="flex gap-2">
          <Input
            value={keywordInput}
            onChange={e => setKeywordInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addKeyword(); } }}
            placeholder="Ej: casa prefabricada chile"
            className="h-11 rounded-xl bg-background/50 border-border/40 focus:border-primary/40 text-sm"
          />
          <button
            type="button"
            onClick={addKeyword}
            className="h-11 px-5 rounded-xl bg-primary/10 text-primary text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-colors shrink-0"
          >
            + Agregar
          </button>
        </div>
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {keywords.map(kw => (
              <span
                key={kw}
                className="inline-flex items-center gap-1.5 bg-primary/5 border border-primary/10 text-primary text-[11px] font-bold px-3 py-1.5 rounded-full"
              >
                {kw}
                <button type="button" onClick={() => removeKeyword(kw)} className="hover:text-red-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="text-[10px] text-muted-foreground opacity-50">
          La primera keyword es la "principal" y se usa para calcular el score. Presiona Enter o el botón para agregar.
        </p>
      </div>

      {/* OG Image */}
      <div className="space-y-3">
        <Label className="text-xs font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
          <ImageIcon className="w-3.5 h-3.5" /> Imagen Open Graph (Redes Sociales)
        </Label>
        <Input
          name="seo_og_image"
          value={ogImage}
          onChange={e => { setOgImage(e.target.value); onOgImageChange?.(e.target.value); }}
          placeholder="https://solocasaschile.com/images/og-modelo.jpg (1200×630px)"
          className="h-11 rounded-xl bg-background/50 border-border/40 focus:border-primary/40 text-sm"
        />
        <p className="text-[10px] text-muted-foreground opacity-50">
          Si se deja vacío, se usa la primera foto del modelo. Tamaño recomendado: 1200×630 px.
        </p>
      </div>

      {/* Analysis Checklist */}
      <div className="bg-muted/10 border border-border/30 rounded-2xl p-5 space-y-3">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">Análisis SEO</p>
        {checks.map(c => (
          <div key={c.id} className="flex items-center gap-3">
            {c.pass
              ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              : <XCircle className="w-4 h-4 text-red-400/60 shrink-0" />
            }
            <span className={cn("text-sm font-medium", c.pass ? "text-foreground" : "text-muted-foreground/60")}>
              {c.label}
            </span>
            <span className="ml-auto text-[10px] font-black opacity-30">{c.weight}pts</span>
          </div>
        ))}
      </div>

    </div>
  );
}
