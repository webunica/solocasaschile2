"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload, Loader2, CheckCircle2,
  X, Home, Video, ArrowLeft,
  Sparkles, ShieldCheck, Zap, ChevronDown,
  Building2, Thermometer, Paintbrush, Plug, Truck, Award, Search
} from "lucide-react";
import { createModel } from "@/lib/supabase/actions";
import { createClient } from "@/lib/supabase/client";
import { getPlanLimits } from "@/lib/constants/plans";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FORM_SYSTEM_OPTIONS as TIPOS } from "@/config/construction-systems";
import { SEOPanel } from "@/components/dashboard/seo-panel";
import { RECINTOS_PREDEFINIDOS } from "@/types/modelo-extendido";

// ─────────────────────────────────────────────
// Section Accordion
// ─────────────────────────────────────────────

function FormSection({
  icon,
  title,
  subtitle,
  iconColor = "text-brand-indigo",
  iconBg = "bg-brand-indigo/10",
  children,
  defaultOpen = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  iconColor?: string;
  iconBg?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-[3rem] overflow-hidden shadow-xl shadow-black/[0.02]"
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 p-8 md:p-10 text-left hover:bg-muted/10 transition-colors"
      >
        <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center shrink-0", iconBg)}>
          <span className={iconColor}>{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-heading font-black text-lg tracking-tight text-foreground">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5 font-medium">{subtitle}</p>}
        </div>
        <ChevronDown className={cn("w-5 h-5 text-muted-foreground/40 transition-transform duration-300 shrink-0", open && "rotate-180")} />
      </button>
      <motion.div
        initial={defaultOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.28, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className={cn("px-8 md:px-10 pb-10 space-y-6 border-t border-border/20 pt-6", !open && "pointer-events-none")}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Field helpers
// ─────────────────────────────────────────────

function Field({ id, label, hint, children }: { id?: string; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[10px] font-black uppercase tracking-widest opacity-60 text-foreground/60">
        {label}
      </Label>
      {children}
      {hint && <p className="text-[10px] text-muted-foreground opacity-50 leading-relaxed">{hint}</p>}
    </div>
  );
}

function FieldInput({ id, name, placeholder, type = "text", required = false, className }: {
  id: string; name: string; placeholder: string; type?: string; required?: boolean; className?: string;
}) {
  return (
    <Input
      id={id} name={name} type={type} placeholder={placeholder} required={required}
      className={cn("h-12 rounded-2xl bg-background/50 border-border/40 focus:border-primary/40 font-medium", className)}
    />
  );
}

function FieldTextarea({ id, name, placeholder, rows = 3 }: { id: string; name: string; placeholder: string; rows?: number; }) {
  return (
    <Textarea
      id={id} name={name} placeholder={placeholder} rows={rows}
      className="rounded-2xl bg-background/50 border-border/40 focus:border-primary/40 text-sm p-4 resize-none leading-relaxed"
    />
  );
}

// ─────────────────────────────────────────────
// Recintos Selector
// ─────────────────────────────────────────────

function RecintosSelector({ name }: { name: string }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState("");

  const toggle = (r: string) =>
    setSelected(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);

  const addCustom = () => {
    const v = custom.trim();
    if (v && !selected.includes(v)) {
      setSelected(prev => [...prev, v]);
      setCustom("");
    }
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={JSON.stringify(selected)} />
      <div className="flex flex-wrap gap-2">
        {RECINTOS_PREDEFINIDOS.map(r => (
          <button
            key={r} type="button" onClick={() => toggle(r)}
            className={cn(
              "px-3 py-1.5 rounded-xl border text-xs font-bold transition-all",
              selected.includes(r)
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-muted/20 border-border/40 text-foreground/50 hover:border-primary/20"
            )}
          >
            {r}
          </button>
        ))}
      </div>
      <div className="flex gap-2 pt-2">
        <Input
          value={custom}
          onChange={e => setCustom(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
          placeholder="Agregar recinto personalizado..."
          className="h-10 rounded-xl bg-background/50 border-border/40 text-sm"
        />
        <button
          type="button" onClick={addCustom}
          className="h-10 px-4 rounded-xl bg-primary/10 text-primary text-xs font-black uppercase tracking-wider hover:bg-primary/20 transition-colors shrink-0"
        >
          + Agregar
        </button>
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map(r => (
            <span key={r} className="inline-flex items-center gap-1 bg-primary/5 border border-primary/10 text-primary text-[11px] font-bold px-3 py-1 rounded-full">
              {r}
              <button type="button" onClick={() => setSelected(prev => prev.filter(x => x !== r))} className="hover:text-red-500 transition-colors ml-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

export default function NewModelPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [planoFile, setPlanoFile] = useState<File | null>(null);
  const [planoPreview, setPlanoPreview] = useState<string | null>(null);
  const planoInputRef = useRef<HTMLInputElement>(null);
  const [planLimits, setPlanLimits] = useState<any>(null);
  const [plan, setPlan] = useState<string>("gratis");
  const [modelName, setModelName] = useState("");
  const [modelDesc, setModelDesc] = useState("");

  useEffect(() => {
    async function loadPlan() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('constructoras').select('plan').eq('id', user.id).single();
        const p = data?.plan || 'gratis';
        setPlan(p);
        setPlanLimits(getPlanLimits(p));
      }
    }
    loadPlan();
  }, []);

  const isPaidPlan = plan === 'pro' || plan === 'premium';

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxPhotos = planLimits?.maxPhotos || 3;
    const selected = Array.from(e.target.files || []).slice(0, maxPhotos);
    setFiles(selected);
    setPreviews(selected.map(f => URL.createObjectURL(f)));
  };

  const removeImage = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handlePlano = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPlanoFile(file);
      setPlanoPreview(URL.createObjectURL(file));
    }
  };

  const removePlano = () => {
    setPlanoFile(null);
    setPlanoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const formData = new FormData(e.currentTarget);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("No se detectó sesión activa. Reinicia sesión."); setLoading(false); return; }

      // Upload images
      const imageUrls: string[] = [];
      for (const file of files) {
        try {
          const ext = file.name.split('.').pop();
          const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { error: uploadError } = await supabase.storage.from('model_images').upload(filePath, file, { cacheControl: '3600', upsert: false });
          if (uploadError) continue;
          const { data: { publicUrl } } = supabase.storage.from('model_images').getPublicUrl(filePath);
          imageUrls.push(publicUrl);
        } catch (e) {
          console.error(e);
        }
      }

      let plano_url = null;
      if (planoFile) {
        try {
          const ext = planoFile.name.split('.').pop();
          const filePath = `${user.id}/plano-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { error: uploadError } = await supabase.storage.from('model_images').upload(filePath, planoFile);
          if (uploadError) throw uploadError;
          const { data: { publicUrl } } = supabase.storage.from('model_images').getPublicUrl(filePath);
          plano_url = publicUrl;
        } catch (e: any) {
           throw new Error("Error al subir plano: " + e.message);
        }
      }

      // Parse JSONB sections
      const parseJsonField = (field: string) => {
        try {
          const keys = Array.from(formData.keys()).filter(k => k.startsWith(`${field}.`));
          if (!keys.length) return undefined;
          const obj: Record<string, string> = {};
          for (const k of keys) {
            const subKey = k.replace(`${field}.`, '');
            const val = formData.get(k) as string;
            if (val?.trim()) obj[subKey] = val.trim();
          }
          return Object.keys(obj).length ? obj : undefined;
        } catch { return undefined; }
      };

      // Parse keywords
      const keywordsRaw = formData.get('seo_keywords') as string;
      const seoKeywords = keywordsRaw ? JSON.parse(keywordsRaw) : [];

      // Parse recintos
      const recintosRaw = formData.get('recintos') as string;
      const recintos = recintosRaw ? JSON.parse(recintosRaw) : [];

      const nombre = formData.get('nombre') as string;
      const result = await createModel({
        nombre,
        tipo: formData.get('tipo') as string,
        superficie_m2: Number(formData.get('superficie_m2')),
        dormitorios: Number(formData.get('dormitorios')),
        banos: Number(formData.get('banos')),
        pisos: Number(formData.get('pisos')) || 1,
        precio_desde_uf: Number(formData.get('precio_desde_uf')),
        tiempo_entrega: formData.get('tiempo_entrega') as string,
        garantia_anos: Number(formData.get('garantia_anos')),
        postventa: formData.get('postventa') === 'true',
        descripcion: formData.get('descripcion') as string,
        codigo_modelo: formData.get('codigo_modelo') as string || null,
        uso: formData.get('uso') as string || 'vivienda',
        recintos,
        imagenes_urls: imageUrls,
        video_url: formData.get('video_url') as string || null,
        construccion: { ...parseJsonField('construccion'), ...(plano_url ? { plano_url } : {}) },
        aislacion: parseJsonField('aislacion') || null,
        terminaciones: parseJsonField('terminaciones') || null,
        instalaciones: parseJsonField('instalaciones') || null,
        logistica: parseJsonField('logistica') || null,
        soporte: parseJsonField('soporte') || null,
        // SEO
        seo_title: isPaidPlan ? (formData.get('seo_title') as string || null) : null,
        seo_description: isPaidPlan ? (formData.get('seo_description') as string || null) : null,
        seo_keywords: isPaidPlan ? seoKeywords : [],
        seo_og_image: isPaidPlan ? (formData.get('seo_og_image') as string || null) : null,
      });

      if (result?.error) throw new Error(result.error);
      setSuccess(true);
      setTimeout(() => router.push('/dashboard/catalog'), 2000);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
      setLoading(false);
    }
  };

  if (success) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-10">
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        className="w-32 h-32 rounded-[2.5rem] bg-brand-indigo flex items-center justify-center shadow-2xl shadow-primary/30"
      >
        <CheckCircle2 className="w-16 h-16 text-white" />
      </motion.div>
      <div className="text-center space-y-3">
        <h2 className="text-5xl font-heading font-black tracking-tighter text-foreground">¡Éxito Total!</h2>
        <p className="text-xl text-muted-foreground font-medium italic opacity-80">Tu nuevo modelo está siendo indexado en el catálogo nacional.</p>
      </div>
    </div>
  );

  return (
    <div className="py-12 space-y-8 max-w-5xl mx-auto px-4 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <Link href="/dashboard/catalog" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Volver al Catálogo
          </Link>
          <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-none text-foreground">
            Nuevo <span className="gradient-text italic">Lanzamiento</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium max-w-xl">
            Define las especificaciones completas de tu vivienda para atraer compradores informados.
          </p>
        </div>
        <div className="hidden lg:block">
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center shadow-lg border border-border/40">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Tu Plan Permite</p>
              <p className="font-bold text-sm">{planLimits?.maxModels || '—'} modelos · {planLimits?.maxPhotos || 3} fotos</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 text-red-600 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Sección 1: Identidad ─────────────────────────────────── */}
        <FormSection
          icon={<Home className="w-5 h-5" />}
          title="Identidad del Proyecto"
          subtitle="Nombre, tipo, código y descripción general"
          defaultOpen
        >
          <div className="grid md:grid-cols-2 gap-6">
            <Field id="nombre" label="Nombre Comercial" hint="Nombre visible en el catálogo público">
              <Input
                id="nombre" name="nombre" required
                placeholder="Ej: Casa Roble Premium SIP"
                onChange={e => setModelName(e.target.value)}
                className="h-12 rounded-2xl bg-background/50 border-border/40 focus:border-primary/40 font-medium"
              />
            </Field>
            <Field id="codigo_modelo" label="Código del Modelo" hint="Referencia interna (opcional)">
              <FieldInput id="codigo_modelo" name="codigo_modelo" placeholder="Ej: RSP-120-A" />
            </Field>
            <Field id="tipo" label="Sistema Constructivo">
              <select id="tipo" name="tipo" required
                className="w-full h-12 rounded-2xl border border-border/40 bg-background/50 px-4 text-sm font-black uppercase tracking-widest focus:ring-0 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                <option value="">Seleccionar tipo...</option>
                {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            <Field id="uso" label="Uso Principal">
              <select id="uso" name="uso"
                className="w-full h-12 rounded-2xl border border-border/40 bg-background/50 px-4 text-sm font-black uppercase tracking-widest focus:ring-0 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                <option value="vivienda">Vivienda</option>
                <option value="cabana">Cabaña</option>
                <option value="oficina">Oficina / Estudio</option>
                <option value="uso-mixto">Uso Mixto</option>
                <option value="social">Vivienda Social</option>
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field id="descripcion" label="Relato de Venta (Descripción)" hint="Describe la experiencia de habitar este modelo. Mínimo 80 palabras para mejor SEO.">
                <Textarea
                  id="descripcion" name="descripcion"
                  placeholder="Describe los acabados, eficiencia energética y la experiencia de habitar este modelo..."
                  className="min-h-[140px] rounded-2xl bg-background/50 border-border/40 focus:border-primary/40 text-sm p-4 resize-none leading-relaxed"
                  onChange={e => setModelDesc(e.target.value)}
                />
              </Field>
            </div>
          </div>
        </FormSection>

        {/* ── Sección 2: Medidas y Distribución ───────────────────── */}
        <FormSection
          icon={<Building2 className="w-5 h-5" />}
          title="Medidas y Distribución"
          subtitle="Superficie, pisos, dormitorios, baños y recintos incluidos"
          iconColor="text-brand-teal"
          iconBg="bg-brand-teal/10"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Field id="superficie_m2" label="Superficie" hint="M² totales">
              <Input id="superficie_m2" name="superficie_m2" type="number" placeholder="120" required min={10}
                className="h-12 rounded-2xl bg-background/50 border-border/40 font-black text-lg text-center" />
            </Field>
            <Field id="pisos" label="Pisos" hint="N° de plantas">
              <Input id="pisos" name="pisos" type="number" placeholder="1" min={1} max={5}
                className="h-12 rounded-2xl bg-background/50 border-border/40 font-black text-lg text-center" />
            </Field>
            <Field id="dormitorios" label="Dormitorios">
              <Input id="dormitorios" name="dormitorios" type="number" placeholder="3" required min={1}
                className="h-12 rounded-2xl bg-background/50 border-border/40 font-black text-lg text-center" />
            </Field>
            <Field id="banos" label="Baños">
              <Input id="banos" name="banos" type="number" placeholder="2" required min={1}
                className="h-12 rounded-2xl bg-background/50 border-border/40 font-black text-lg text-center" />
            </Field>
          </div>
          <Field label="Recintos Incluidos" hint="Selecciona los espacios que incluye el modelo">
            <RecintosSelector name="recintos" />
          </Field>
        </FormSection>

        {/* ── Sección 3: Precio y Entrega ─────────────────────────── */}
        <FormSection
          icon={<Zap className="w-5 h-5" />}
          title="Precio y Entrega"
          subtitle="Inversión, tiempo de entrega y postventa"
          iconColor="text-amber-600"
          iconBg="bg-amber-500/10"
        >
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <Field id="precio_desde_uf" label="Precio Desde" hint="En UF">
              <Input id="precio_desde_uf" name="precio_desde_uf" type="number" placeholder="1200" required min={50}
                className="h-12 rounded-2xl bg-background/50 border-border/40 font-black text-lg text-center" />
            </Field>
            <Field id="garantia_anos" label="Garantía" hint="Años">
              <Input id="garantia_anos" name="garantia_anos" type="number" placeholder="5" min={1}
                className="h-12 rounded-2xl bg-background/50 border-border/40 font-black text-lg text-center" />
            </Field>
            <Field id="tiempo_entrega" label="Tiempo de Entrega">
              <FieldInput id="tiempo_entrega" name="tiempo_entrega" placeholder="Ej: 90 días" required />
            </Field>
            <div className="col-span-2 lg:col-span-3">
              <Field id="postventa" label="Protocolo de Postventa">
                <select id="postventa" name="postventa" required
                  className="w-full h-12 rounded-2xl border border-border/40 bg-background/50 px-4 text-sm font-black uppercase tracking-widest focus:ring-0 focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  <option value="true">Servicio de Postventa Incluido</option>
                  <option value="false">Opcional / No incluido</option>
                </select>
              </Field>
            </div>
          </div>
        </FormSection>

        {/* ── Sección 4: Construcción y Estructura ─────────────────── */}
        <FormSection
          icon={<Building2 className="w-5 h-5" />}
          title="Construcción y Estructura"
          subtitle="Sistema constructivo, muros, techumbre y fundaciones"
          iconColor="text-slate-600"
          iconBg="bg-slate-500/10"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <Field id="construccion.sistema_constructivo" label="Sistema Constructivo">
              <FieldInput id="construccion.sistema_constructivo" name="construccion.sistema_constructivo" placeholder="Ej: Panel SIP 162mm" />
            </Field>
            <Field id="construccion.estructura" label="Estructura Principal">
              <FieldInput id="construccion.estructura" name="construccion.estructura" placeholder="Ej: Madera laminada encolada" />
            </Field>
            <Field id="construccion.muros_exteriores" label="Muros Exteriores">
              <FieldInput id="construccion.muros_exteriores" name="construccion.muros_exteriores" placeholder="Ej: SIP 162mm + Stucco" />
            </Field>
            <Field id="construccion.muros_interiores" label="Muros Interiores">
              <FieldInput id="construccion.muros_interiores" name="construccion.muros_interiores" placeholder="Ej: Placa yeso cartón 12mm" />
            </Field>
            <Field id="construccion.techumbre" label="Techumbre">
              <FieldInput id="construccion.techumbre" name="construccion.techumbre" placeholder="Ej: Zinc-aluminio inclinado" />
            </Field>
            <Field id="construccion.piso_interior" label="Piso Interior de Plataforma">
              <FieldInput id="construccion.piso_interior" name="construccion.piso_interior" placeholder="Ej: OSB 18mm sobre estructura" />
            </Field>
            <Field id="construccion.fundacion" label="Fundaciones">
              <FieldInput id="construccion.fundacion" name="construccion.fundacion" placeholder="Ej: Radier hormigón H-25" />
            </Field>
            <Field id="construccion.notas" label="Notas Adicionales">
              <FieldTextarea id="construccion.notas" name="construccion.notas" placeholder="Observaciones adicionales sobre la construcción..." />
            </Field>
          </div>
        </FormSection>

        {/* ── Sección 5: Aislación y Eficiencia ───────────────────── */}
        <FormSection
          icon={<Thermometer className="w-5 h-5" />}
          title="Aislación y Eficiencia Energética"
          subtitle="Térmica, acústica, condensación y zona climática"
          iconColor="text-sky-600"
          iconBg="bg-sky-500/10"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <Field id="aislacion.termica" label="Aislación Térmica">
              <FieldInput id="aislacion.termica" name="aislacion.termica" placeholder="Ej: EPS 100mm muros, 150mm cubierta" />
            </Field>
            <Field id="aislacion.acustica" label="Aislación Acústica">
              <FieldInput id="aislacion.acustica" name="aislacion.acustica" placeholder="Ej: Lana mineral 50mm en medianeros" />
            </Field>
            <Field id="aislacion.condensacion" label="Control de Condensación">
              <FieldInput id="aislacion.condensacion" name="aislacion.condensacion" placeholder="Ej: Barrera de vapor incluida" />
            </Field>
            <Field id="aislacion.zona_climatica" label="Adaptación Climática">
              <FieldInput id="aislacion.zona_climatica" name="aislacion.zona_climatica" placeholder="Ej: Diseñado para Zonas 3-6 (Sur de Chile)" />
            </Field>
            <Field id="aislacion.calificacion_energetica" label="Calificación Energética">
              <select id="aislacion.calificacion_energetica" name="aislacion.calificacion_energetica"
                className="w-full h-12 rounded-2xl border border-border/40 bg-background/50 px-4 text-sm font-medium focus:ring-0 focus:border-primary transition-all appearance-none cursor-pointer"
              >
                <option value="">No especificada</option>
                <option value="A+">A+ (Eficiencia Máxima)</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D (Estándar)</option>
                <option value="E">E</option>
              </select>
            </Field>
            <Field id="aislacion.notas" label="Notas de Eficiencia">
              <FieldTextarea id="aislacion.notas" name="aislacion.notas" placeholder="Ej: Cumple Ordenanza General de Urbanismo y Construcciones..." />
            </Field>
          </div>
        </FormSection>

        {/* ── Sección 6: Terminaciones ─────────────────────────────── */}
        <FormSection
          icon={<Paintbrush className="w-5 h-5" />}
          title="Terminaciones y Equipamiento"
          subtitle="Ventanas, puertas, cocina, baños y revestimientos"
          iconColor="text-violet-600"
          iconBg="bg-violet-500/10"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <Field id="terminaciones.ventanas" label="Ventanas">
              <FieldInput id="terminaciones.ventanas" name="terminaciones.ventanas" placeholder="Ej: PVC doble vidrio termopanel" />
            </Field>
            <Field id="terminaciones.puertas_exteriores" label="Puertas Exteriores">
              <FieldInput id="terminaciones.puertas_exteriores" name="terminaciones.puertas_exteriores" placeholder="Ej: Puerta blindada de acero" />
            </Field>
            <Field id="terminaciones.puertas_interiores" label="Puertas Interiores">
              <FieldInput id="terminaciones.puertas_interiores" name="terminaciones.puertas_interiores" placeholder="Ej: MDF laqueado blanco" />
            </Field>
            <Field id="terminaciones.cocina" label="Cocina">
              <FieldInput id="terminaciones.cocina" name="terminaciones.cocina" placeholder="Ej: Muebles melamina, mesón granito" />
            </Field>
            <Field id="terminaciones.bano_principal" label="Baño Principal">
              <FieldInput id="terminaciones.bano_principal" name="terminaciones.bano_principal" placeholder="Ej: Cerámica 30×60, grifería cromada" />
            </Field>
            <Field id="terminaciones.bano_servicio" label="Baño de Servicio">
              <FieldInput id="terminaciones.bano_servicio" name="terminaciones.bano_servicio" placeholder="Ej: Porcelanato básico, grifería estándar" />
            </Field>
            <Field id="terminaciones.pisos" label="Pisos">
              <FieldInput id="terminaciones.pisos" name="terminaciones.pisos" placeholder="Ej: Piso flotante HDF + porcelanato en húmedos" />
            </Field>
            <Field id="terminaciones.cielos" label="Cielos">
              <FieldInput id="terminaciones.cielos" name="terminaciones.cielos" placeholder="Ej: Yeso cartón pintado blanco mate" />
            </Field>
          </div>
        </FormSection>

        {/* ── Sección 7: Instalaciones ─────────────────────────────── */}
        <FormSection
          icon={<Plug className="w-5 h-5" />}
          title="Instalaciones"
          subtitle="Eléctrica, sanitaria, gas y climatización"
          iconColor="text-emerald-600"
          iconBg="bg-emerald-500/10"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <Field id="instalaciones.electrica" label="Instalación Eléctrica">
              <FieldInput id="instalaciones.electrica" name="instalaciones.electrica" placeholder="Ej: Trifásica 220V, 15 circuitos, tablero diferencial" />
            </Field>
            <Field id="instalaciones.sanitaria" label="Instalación Sanitaria">
              <FieldInput id="instalaciones.sanitaria" name="instalaciones.sanitaria" placeholder="Ej: PVC presión PN-10, uniones encoladas" />
            </Field>
            <Field id="instalaciones.agua_caliente" label="Agua Caliente">
              <FieldInput id="instalaciones.agua_caliente" name="instalaciones.agua_caliente" placeholder="Ej: Calefont gas 13 L/min o termoestato eléctrico" />
            </Field>
            <Field id="instalaciones.gas" label="Gas">
              <FieldInput id="instalaciones.gas" name="instalaciones.gas" placeholder="Ej: Gas centralizado o cilindros exterior" />
            </Field>
            <Field id="instalaciones.climatizacion" label="Climatización">
              <FieldInput id="instalaciones.climatizacion" name="instalaciones.climatizacion" placeholder="Ej: Losa radiante + bomba de calor inverter" />
            </Field>
            <Field id="instalaciones.ventilacion" label="Ventilación">
              <FieldInput id="instalaciones.ventilacion" name="instalaciones.ventilacion" placeholder="Ej: Natural cruzada / VMC mecánica" />
            </Field>
            <Field id="instalaciones.internet_tv" label="Internet y TV">
              <FieldInput id="instalaciones.internet_tv" name="instalaciones.internet_tv" placeholder="Ej: Ductos para fibra óptica y TV cable" />
            </Field>
          </div>
        </FormSection>

        {/* ── Sección 8: Logística y Compra ───────────────────────── */}
        <FormSection
          icon={<Truck className="w-5 h-5" />}
          title="Logística y Compra"
          subtitle="Transporte, montaje, plazos y qué incluye el precio"
          iconColor="text-orange-600"
          iconBg="bg-orange-500/10"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <Field id="logistica.transporte" label="Transporte">
              <FieldInput id="logistica.transporte" name="logistica.transporte" placeholder="Ej: Incluido en radio de 500 km de RM" />
            </Field>
            <Field id="logistica.montaje" label="Montaje">
              <FieldInput id="logistica.montaje" name="logistica.montaje" placeholder="Ej: Equipo especializado incluido" />
            </Field>
            <Field id="logistica.plazo_fabricacion" label="Plazo de Fabricación">
              <FieldInput id="logistica.plazo_fabricacion" name="logistica.plazo_fabricacion" placeholder="Ej: 45-60 días hábiles en planta" />
            </Field>
            <Field id="logistica.plazo_montaje" label="Plazo de Montaje en Terreno">
              <FieldInput id="logistica.plazo_montaje" name="logistica.plazo_montaje" placeholder="Ej: 10-15 días hábiles" />
            </Field>
            <Field id="logistica.que_incluye" label="¿Qué Incluye el Precio?" hint="Sé específico — esto aumenta la conversión">
              <FieldTextarea id="logistica.que_incluye" name="logistica.que_incluye" placeholder="Ej: Estructura completa, instalaciones, terminaciones estándar, transporte y montaje..." />
            </Field>
            <Field id="logistica.que_no_incluye" label="¿Qué NO Incluye?">
              <FieldTextarea id="logistica.que_no_incluye" name="logistica.que_no_incluye" placeholder="Ej: Terreno, fundaciones, permisos de construcción, conexiones de servicios básicos..." />
            </Field>
            <Field id="logistica.personalizacion" label="Opciones de Personalización">
              <FieldTextarea id="logistica.personalizacion" name="logistica.personalizacion" placeholder="Ej: Se pueden modificar distribuciones previo pago de estudio de proyecto..." />
            </Field>
          </div>
        </FormSection>

        {/* ── Sección 9: Soporte y Respaldo ───────────────────────── */}
        <FormSection
          icon={<Award className="w-5 h-5" />}
          title="Soporte y Respaldo"
          subtitle="Garantías, certificaciones y normativas que cumple"
          iconColor="text-teal-600"
          iconBg="bg-teal-500/10"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <Field id="soporte.garantia_estructura" label="Garantía de Estructura">
              <FieldInput id="soporte.garantia_estructura" name="soporte.garantia_estructura" placeholder="Ej: 5 años" />
            </Field>
            <Field id="soporte.garantia_impermeabilizacion" label="Garantía Impermeabilización">
              <FieldInput id="soporte.garantia_impermeabilizacion" name="soporte.garantia_impermeabilizacion" placeholder="Ej: 3 años" />
            </Field>
            <Field id="soporte.garantia_terminaciones" label="Garantía Terminaciones">
              <FieldInput id="soporte.garantia_terminaciones" name="soporte.garantia_terminaciones" placeholder="Ej: 1 año" />
            </Field>
            <Field id="soporte.garantia_instalaciones" label="Garantía Instalaciones">
              <FieldInput id="soporte.garantia_instalaciones" name="soporte.garantia_instalaciones" placeholder="Ej: 2 años" />
            </Field>
            <Field id="soporte.postventa_descripcion" label="Descripción del Servicio Postventa">
              <FieldTextarea id="soporte.postventa_descripcion" name="soporte.postventa_descripcion" placeholder="Ej: Visita técnica a los 30, 90 y 365 días post-entrega..." />
            </Field>
            <Field id="soporte.normativa" label="Normativa que Cumple">
              <FieldTextarea id="soporte.normativa" name="soporte.normativa" placeholder="Ej: NCh 1198 Maderas, DS47 MINVU, NCh 853 Aislación Térmica..." />
            </Field>
            <Field id="soporte.certificaciones" label="Certificaciones">
              <FieldInput id="soporte.certificaciones" name="soporte.certificaciones" placeholder="Ej: INN Chile, MINVU, Passivhaus, ISO 9001" />
            </Field>
          </div>
        </FormSection>

        {/* ── Sección 10: Media ────────────────────────────────────── */}
        <FormSection
          icon={<Video className="w-5 h-5" />}
          title="Fotografías y Video"
          subtitle="Galería de imágenes y tour virtual"
          iconColor="text-rose-600"
          iconBg="bg-rose-500/10"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image upload */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-black uppercase tracking-widest opacity-60">Galería de Imágenes</Label>
                <Badge variant="outline" className="rounded-full px-3 py-1 font-bold text-[10px] text-foreground/60">
                  {previews.length}/{planLimits?.maxPhotos || 3}
                </Badge>
              </div>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative border-2 border-dashed border-border/60 rounded-3xl aspect-square flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/40 hover:bg-muted/30 transition-all duration-500 overflow-hidden"
              >
                <AnimatePresence>
                  {previews.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 p-6">
                      <div className="w-14 h-14 rounded-3xl bg-muted/50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-brand-indigo group-hover:text-white transition-all duration-700 shadow-inner">
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="font-bold uppercase tracking-widest text-sm text-foreground">Subir Renders</p>
                      <p className="text-[10px] text-muted-foreground font-medium opacity-60">JPG o PNG de alta resolución</p>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 p-4 w-full h-full">
                      {previews.map((src, i) => (
                        <div key={i} className="relative rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                          <img src={src} alt="" className="w-full h-full object-cover" />
                          <button type="button" onClick={ev => { ev.stopPropagation(); removeImage(i); }}
                            className="absolute top-2 right-2 w-7 h-7 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      {previews.length < (planLimits?.maxPhotos || 3) && (
                        <div className="flex items-center justify-center border-2 border-dashed border-border/40 rounded-2xl text-muted-foreground/30 font-black text-2xl">+</div>
                      )}
                    </div>
                  )}
                </AnimatePresence>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
            </div>

            {/* Video Y Plano */}
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-xs font-black uppercase tracking-widest opacity-60">Plano de Distribución</Label>
                <div
                  onClick={() => !planoPreview && planoInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed border-border/40 rounded-3xl relative overflow-hidden transition-all bg-card/30 min-h-[160px]",
                    planoPreview ? "" : "p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30"
                  )}
                >
                  {!planoPreview ? (
                    <>
                      <Upload className="w-10 h-10 mx-auto mb-2 text-brand-indigo opacity-40" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-center mt-2">Añadir plano (PNG/JPG)</p>
                    </>
                  ) : (
                    <div className="relative aspect-video w-full">
                      <img src={planoPreview} className="w-full h-full object-cover" />
                      <button type="button" onClick={removePlano} className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <input ref={planoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePlano} />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-black uppercase tracking-widest opacity-60">Video Tour</Label>
                <div className={cn(
                  "space-y-3 p-6 border border-border/40 rounded-3xl bg-card/30",
                  !isPaidPlan && "opacity-40 grayscale pointer-events-none"
                )}>
                  {!isPaidPlan && (
                    <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-widest mb-2">
                      Solo plan Pro/Premium
                    </Badge>
                  )}
                  <Input
                    id="video_url" name="video_url"
                    placeholder="URL de YouTube o Vimeo"
                    className="h-12 rounded-2xl bg-background/50 border-border/40 font-medium"
                  />
                  <p className="text-[10px] font-bold text-muted-foreground opacity-60">Integración con YouTube y Vimeo habilitada.</p>
                </div>
              </div>
            </div>
          </div>
        </FormSection>

        {/* ── Sección 11: SEO (solo planes de pago) ───────────────── */}
        <FormSection
          icon={<Search className="w-5 h-5" />}
          title="Posicionamiento SEO"
          subtitle={isPaidPlan ? "Optimiza cómo aparece este modelo en Google" : "Disponible en planes Pro y Premium"}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-500/10"
        >
          {isPaidPlan ? (
            <SEOPanel
              modelName={modelName}
              modelDescription={modelDesc}
            />
          ) : (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-muted/30 flex items-center justify-center mx-auto">
                <Search className="w-7 h-7 text-muted-foreground/30" />
              </div>
              <p className="text-lg font-black opacity-30">SEO avanzado no disponible en tu plan actual</p>
              <p className="text-sm text-muted-foreground opacity-50">Mejora a Plan Pro o Premium para acceder al panel SEO y aumentar la visibilidad de tus modelos en Google.</p>
              <Link href="/planes" className="inline-flex items-center gap-2 text-primary text-sm font-bold hover:underline">
                Ver planes disponibles →
              </Link>
            </div>
          )}
        </FormSection>

        {/* ── Submit ───────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 pt-4">
          <Button
            type="submit" disabled={loading}
            className="w-full h-18 md:h-20 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] bg-brand-indigo shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-white hover:text-white py-6"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Publicar Lanzamiento"}
          </Button>
          <Button type="button" variant="outline"
            className="w-full h-14 rounded-3xl font-black text-[10px] uppercase tracking-widest border-border hover:bg-muted/50 transition-all opacity-40 hover:opacity-100"
            onClick={() => router.push('/dashboard/catalog')}
          >
            Descartar Borrador
          </Button>
        </div>

        <div className="p-6 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
          <p className="text-[10px] font-medium text-emerald-800 leading-relaxed italic">
            Tus datos están protegidos. Cada publicación es revisada por nuestro sistema de calidad automática.
          </p>
        </div>
      </form>
    </div>
  );
}
