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
  X, Home, Video, ArrowLeft, Star,
  ShieldCheck, Zap, ChevronDown,
  Building2, Thermometer, Paintbrush, Plug, Truck, Award, Search, Save, Eye
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateModel } from "@/lib/supabase/actions";
import { getPlanLimits } from "@/lib/constants/plans";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FORM_SYSTEM_OPTIONS as TIPOS } from "@/config/construction-systems";
import { SEOPanel } from "@/components/dashboard/seo-panel";
import { RECINTOS_PREDEFINIDOS, ModeloExtendido } from "@/types/modelo-extendido";

// ─────────────────────────────────────────────
// Section Accordion Component
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
// Form Field Helpers
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

function FieldInput({ id, name, placeholder = "", type = "text", required = false, defaultValue, className }: {
  id: string; name: string; placeholder?: string; type?: string; required?: boolean; defaultValue?: any; className?: string;
}) {
  return (
    <Input
      id={id} name={name} type={type} placeholder={placeholder} required={required} defaultValue={defaultValue}
      className={cn("h-12 rounded-2xl bg-background/50 border-border/40 focus:border-primary/40 font-medium", className)}
    />
  );
}

function FieldTextarea({ id, name, placeholder, rows = 3, defaultValue }: { id: string; name: string; placeholder: string; rows?: number; defaultValue?: any }) {
  return (
    <Textarea
      id={id} name={name} placeholder={placeholder} rows={rows} defaultValue={defaultValue}
      className="rounded-2xl bg-background/50 border-border/40 focus:border-primary/40 text-sm p-4 resize-none leading-relaxed"
    />
  );
}

// ─────────────────────────────────────────────
// Recintos Selection Component
// ─────────────────────────────────────────────

function RecintosSelector({ name, initialValue = [], onChange }: { name: string; initialValue?: string[]; onChange?: () => void }) {
  const [selected, setSelected] = useState<string[]>(initialValue || []);
  const [custom, setCustom] = useState("");

  const notifyChange = () => {
    // Delay to let React render the hidden input first
    setTimeout(() => { onChange?.() }, 50);
  };

  const toggle = (r: string) => {
    setSelected(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
    notifyChange();
  };

  const addCustom = () => {
    const v = custom.trim();
    if (v && !selected.includes(v)) {
      setSelected(prev => [...prev, v]);
      setCustom("");
      notifyChange();
    }
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={JSON.stringify(selected)} />
      <div className="flex flex-wrap gap-2">
        {RECINTOS_PREDEFINIDOS.map((r: string) => (
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
          {selected.map((r: string) => (
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
// Main Component
// ─────────────────────────────────────────────

export function EditModelForm({ modelo, isSuperAdmin }: { modelo: any, isSuperAdmin?: boolean }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>(modelo.imagenes_urls || []);
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(modelo.imagenes_urls || []);
  const [planoFile, setPlanoFile] = useState<File | null>(null);
  const [planoPreview, setPlanoPreview] = useState<string | null>(modelo.construccion?.plano_url || null);
  const [plan, setPlan] = useState<string>("gratis");
  const [planLimits, setPlanLimits] = useState<any>(null);
  const planoInputRef = useRef<HTMLInputElement>(null);
  
  // Real-time SEO Preview track
  const [modelName, setModelName] = useState(modelo.nombre);
  const [modelDesc, setModelDesc] = useState(modelo.descripcion);

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
    const currentTotal = previews.length;
    const limitLeft = maxPhotos - currentTotal;
    
    if (limitLeft <= 0) {
      alert(`Tu plan permite un máximo de ${maxPhotos} fotos.`);
      return;
    }

    const selected = Array.from(e.target.files || []).slice(0, limitLeft);
    setFiles(prev => [...prev, ...selected]);
    setPreviews(prev => [...prev, ...selected.map(f => URL.createObjectURL(f))]);
  };

  const handlePlano = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPlanoFile(file);
      setPlanoPreview(URL.createObjectURL(file));
      handleFormChange();
    }
  };

  const removePlanoWithAutoSave = () => {
    setPlanoFile(null);
    setPlanoPreview(null);
    handleFormChange();
  };

  const removeImage = (idx: number) => {
    const totalExisting = existingImages.length;
    if (idx < totalExisting) {
       setExistingImages(prev => prev.filter((_, i) => i !== idx));
    } else {
       setFiles(prev => prev.filter((_, i) => i !== (idx - totalExisting)));
    }
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const submitHandler = async (e?: React.FormEvent<HTMLFormElement>, isAuto = false) => {
    if (e) e.preventDefault();
    if (!formRef.current) return;

    if (isAuto) setIsAutoSaving(true);
    else setLoading(true);
    
    setError(null);

    const supabase = createClient();
    const formData = new FormData(formRef.current);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      // Upload new images
      const newUrls: string[] = [];
      for (const file of files) {
        const ext = file.name.split('.').pop();
        const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('model_images').upload(path, file);
        if (uploadError) continue;
        const { data: { publicUrl } } = supabase.storage.from('model_images').getPublicUrl(path);
        newUrls.push(publicUrl);
      }

      const finalImages = [...existingImages, ...newUrls];

      // Upload plano si existe
      let finalPlanoUrl = planoPreview; // Usamos el preview actual como base del estado
      
      if (planoFile) {
        const ext = planoFile.name.split('.').pop();
        const path = `${user.id}/plano-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('model_images').upload(path, planoFile);
        if (uploadError) {
          throw new Error("Error al subir el plano: " + uploadError.message);
        } else {
          const { data: { publicUrl } } = supabase.storage.from('model_images').getPublicUrl(path);
          finalPlanoUrl = publicUrl;
        }
      } else if (!planoPreview) {
        finalPlanoUrl = null;
      }

      // Parse JSONB
      const parseJsonField = (field: string) => {
        const keys = Array.from(formData.keys()).filter(k => k.startsWith(`${field}.`));
        if (!keys.length) return undefined;
        const obj: Record<string, string> = {};
        for (const k of keys) {
          const subKey = k.replace(`${field}.`, '');
          const val = formData.get(k) as string;
          if (val?.trim()) obj[subKey] = val.trim();
        }
        return Object.keys(obj).length ? obj : undefined;
      };

      const keywordsRaw = formData.get('seo_keywords') as string;
      const seoKeywords = keywordsRaw ? JSON.parse(keywordsRaw) : (modelo.seo_keywords || []);
      const recintosRaw = formData.get('recintos') as string;
      const recintos = recintosRaw ? JSON.parse(recintosRaw) : (modelo.recintos || []);

      const updateData: any = {
        nombre: formData.get('nombre') as string,
        tipo: formData.get('tipo') as string,
        superficie_m2: Number(formData.get('superficie_m2')),
        dormitorios: Number(formData.get('dormitorios')),
        banos: Number(formData.get('banos')),
        precio_desde_uf: Number(formData.get('precio_desde_uf')),
        tiempo_entrega: formData.get('tiempo_entrega') as string,
        garantia_anos: Number(formData.get('garantia_anos')),
        postventa: formData.get('postventa') === 'true',
        descripcion: formData.get('descripcion') as string,
        imagenes_urls: finalImages,
        disponible: formData.get('disponible') === 'true',
        video_url: formData.get('video_url') as string || null,
        // Extended
        pisos: Number(formData.get('pisos')) || 1,
        codigo_modelo: formData.get('codigo_modelo') as string || null,
        uso: formData.get('uso') as string || 'vivienda',
        recintos,
        construccion: { ...parseJsonField('construccion'), ...(finalPlanoUrl ? { plano_url: finalPlanoUrl } : {}) },
        aislacion: parseJsonField('aislacion') || null,
        terminaciones: parseJsonField('terminaciones') || null,
        instalaciones: parseJsonField('instalaciones') || null,
        logistica: parseJsonField('logistica') || null,
        soporte: parseJsonField('soporte') || null,
        is_featured: formData.get('is_featured') === 'true',
        featured_order: Number(formData.get('featured_order')) || 0,
      };

      // SEO only if paid
      if (isPaidPlan) {
        updateData.seo_title = formData.get('seo_title') as string || null;
        updateData.seo_description = formData.get('seo_description') as string || null;
        updateData.seo_keywords = seoKeywords;
        updateData.seo_og_image = formData.get('seo_og_image') as string || null;
      }

      const result = await updateModel(modelo.id, updateData);

      if (result.error) throw new Error(result.error);

      if (newUrls.length > 0) {
        setExistingImages(finalImages);
        setFiles([]);
        setPreviews(finalImages);
      }
      
      setLastSaved(new Date());

      if (!isAuto) {
        setSuccess(true);
        setTimeout(() => router.push('/dashboard/catalog'), 2000);
      }
    } catch (err: any) {
      console.error("DEBUG: Error en submitHandler:", err);
      setError(err.message || "Error al actualizar");
    } finally {
      setIsAutoSaving(false);
      if (!isAuto) setLoading(false);
    }
  };

  const handleFormChange = () => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      submitHandler(undefined, true);
    }, 2500); // 2.5s debounce
  };

  const handleImagesWithAutoSave = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImages(e);
    handleFormChange();
  };
  
  const removeImageWithAutoSave = (i: number) => {
    removeImage(i);
    handleFormChange();
  };

  if (success) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-10">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-32 h-32 rounded-[2.5rem] bg-brand-indigo flex items-center justify-center shadow-2xl">
        <CheckCircle2 className="w-16 h-16 text-white" />
      </motion.div>
      <div className="text-center space-y-3">
        <h2 className="text-5xl font-heading font-black tracking-tighter text-foreground">Actualización Exitosa</h2>
        <p className="text-xl text-muted-foreground font-medium italic opacity-80">Tu modelo ha sido actualizado en tiempo real.</p>
      </div>
    </div>
  );

  return (
    <div className="py-8 space-y-8 max-w-5xl mx-auto px-4 pb-24">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 text-red-600 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      <form ref={formRef} onSubmit={e => submitHandler(e, false)} onChange={handleFormChange} className="space-y-6">

        {/* ── Identidad ───────────────────────────── */}
        <FormSection
          icon={<Home className="w-5 h-5" />}
          title="Identidad del Proyecto"
          subtitle="Información comercial y visibilidad"
          defaultOpen
        >
          <div className="grid md:grid-cols-2 gap-6">
            <Field id="nombre" label="Nombre Comercial">
              <Input
                id="nombre" name="nombre" required
                defaultValue={modelo.nombre}
                onChange={e => setModelName(e.target.value)}
                className="h-12 rounded-2xl bg-background/50 border-border/40 font-medium"
              />
            </Field>
            <Field id="codigo_modelo" label="Código del Modelo">
              <FieldInput id="codigo_modelo" name="codigo_modelo" defaultValue={modelo.codigo_modelo} placeholder="Ej: RSP-120" />
            </Field>
            <Field id="tipo" label="Sistema Constructivo">
              <select id="tipo" name="tipo" required defaultValue={modelo.tipo}
                className="w-full h-12 rounded-2xl border border-border/40 bg-background/50 px-4 text-sm font-black uppercase tracking-widest focus:ring-0 appearance-none cursor-pointer"
              >
                {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            <Field id="disponible" label="Estado de Publicación">
              <select id="disponible" name="disponible" defaultValue={modelo.disponible ? 'true' : 'false'}
                className="w-full h-12 rounded-2xl border border-border/40 bg-background/50 px-4 text-sm font-black uppercase tracking-widest focus:ring-0 appearance-none cursor-pointer"
              >
                <option value="true">Público (Activo)</option>
                <option value="false">Privado (Borrador)</option>
              </select>
            </Field>
            <Field id="uso" label="Uso Principal">
              <select id="uso" name="uso" defaultValue={modelo.uso || 'vivienda'}
                className="w-full h-12 rounded-2xl border border-border/40 bg-background/50 px-4 text-sm font-black uppercase tracking-widest focus:ring-0 appearance-none cursor-pointer"
              >
                <option value="vivienda">Vivienda</option>
                <option value="cabana">Cabaña</option>
                <option value="oficina">Oficina / Estudio</option>
                <option value="uso-mixto">Uso Mixto</option>
                <option value="social">Vivienda Social</option>
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field id="descripcion" label="Relato de Venta">
                <Textarea
                  id="descripcion" name="descripcion"
                  defaultValue={modelo.descripcion}
                  onChange={e => setModelDesc(e.target.value)}
                  className="min-h-[140px] rounded-2xl bg-background/50 border-border/40 text-sm p-4 resize-none leading-relaxed"
                />
              </Field>
            </div>
          </div>
        </FormSection>

        {/* ── Medidas y Distribución ────────────────── */}
        <FormSection
          icon={<Building2 className="w-5 h-5" />}
          title="Medidas y Distribución"
          subtitle="Superficie, pisos y recintos"
          iconColor="text-brand-teal"
          iconBg="bg-brand-teal/10"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Field id="superficie_m2" label="Superficie">
              <Input id="superficie_m2" name="superficie_m2" type="number" defaultValue={modelo.superficie_m2} required className="h-12 rounded-2xl bg-background/50 font-black text-lg text-center" />
            </Field>
            <Field id="pisos" label="Pisos">
              <Input id="pisos" name="pisos" type="number" defaultValue={modelo.pisos || 1} min={1} className="h-12 rounded-2xl bg-background/50 font-black text-lg text-center" />
            </Field>
            <Field id="dormitorios" label="Dormitorios">
              <Input id="dormitorios" name="dormitorios" type="number" defaultValue={modelo.dormitorios} required className="h-12 rounded-2xl bg-background/50 font-black text-lg text-center" />
            </Field>
            <Field id="banos" label="Baños">
              <Input id="banos" name="banos" type="number" defaultValue={modelo.banos} required className="h-12 rounded-2xl bg-background/50 font-black text-lg text-center" />
            </Field>
          </div>
          <Field label="Recintos Incluidos">
            <RecintosSelector name="recintos" initialValue={modelo.recintos || []} onChange={handleFormChange} />
          </Field>
        </FormSection>

        {/* ── Precio y Postventa ─────────────────────── */}
        <FormSection
          icon={<Zap className="w-5 h-5" />}
          title="Precio y Postventa"
          subtitle="Inversión y soporte"
          iconColor="text-amber-600"
          iconBg="bg-amber-500/10"
        >
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <Field id="precio_desde_uf" label="Precio Desde (UF)">
              <Input id="precio_desde_uf" name="precio_desde_uf" type="number" defaultValue={modelo.precio_desde_uf} required className="h-12 rounded-2xl bg-background/50 font-black text-lg text-center" />
            </Field>
            <Field id="garantia_anos" label="Garantía (Años)">
              <Input id="garantia_anos" name="garantia_anos" type="number" defaultValue={modelo.garantia_anos || 5} className="h-12 rounded-2xl bg-background/50 font-black text-lg text-center" />
            </Field>
            <Field id="tiempo_entrega" label="Tiempo Entrega">
              <FieldInput id="tiempo_entrega" name="tiempo_entrega" defaultValue={modelo.tiempo_entrega} placeholder="90 días" />
            </Field>
            <div className="col-span-full">
              <Field id="postventa" label="Protocolo de Postventa">
                <select id="postventa" name="postventa" defaultValue={modelo.postventa ? 'true' : 'false'}
                  className="w-full h-12 rounded-2xl border border-border/40 bg-background/50 px-4 text-sm font-black uppercase tracking-widest focus:ring-0 appearance-none cursor-pointer"
                >
                  <option value="true">Postventa Incluida</option>
                  <option value="false">No incluida / Opcional</option>
                </select>
              </Field>
            </div>
          </div>
        </FormSection>

        {/* ── Construcción y Estructura ───────────────── */}
        <FormSection
          icon={<Building2 className="w-5 h-5" />}
          title="Construcción y Estructura"
          iconColor="text-slate-600"
          iconBg="bg-slate-500/10"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Sistema">
              <FieldInput id="construccion.sistema_constructivo" name="construccion.sistema_constructivo" defaultValue={modelo.construccion?.sistema_constructivo} placeholder="Ej: SIP 162mm" />
            </Field>
            <Field label="Estructura">
              <FieldInput id="construccion.estructura" name="construccion.estructura" defaultValue={modelo.construccion?.estructura} placeholder="Ej: Madera laminada" />
            </Field>
            <Field label="Muros Ext.">
              <FieldInput id="construccion.muros_exteriores" name="construccion.muros_exteriores" defaultValue={modelo.construccion?.muros_exteriores} placeholder="Ej: Stucco EIFS" />
            </Field>
            <Field label="Techumbre">
              <FieldInput id="construccion.techumbre" name="construccion.techumbre" defaultValue={modelo.construccion?.techumbre} placeholder="Ej: Teja asfáltica" />
            </Field>
          </div>
        </FormSection>

        {/* ── Aislación y Eficiencia ─────────────────── */}
        <FormSection
          icon={<Thermometer className="w-5 h-5" />}
          title="Aislación y Eficiencia"
          iconColor="text-sky-600"
          iconBg="bg-sky-500/10"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Térmica">
              <FieldInput id="aislacion.termica" name="aislacion.termica" defaultValue={modelo.aislacion?.termica} />
            </Field>
            <Field label="Calificación Energética">
              <select id="aislacion.calificacion_energetica" name="aislacion.calificacion_energetica" defaultValue={modelo.aislacion?.calificacion_energetica || ''}
                className="w-full h-12 rounded-2xl border border-border/40 bg-background/50 px-4 text-sm"
              >
                <option value="">No especificada</option>
                <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
              </select>
            </Field>
          </div>
        </FormSection>

        {/* ── Terminaciones e Instalaciones ────────────── */}
        <FormSection
          icon={<Paintbrush className="w-5 h-5" />}
          title="Equipamiento y Terminaciones"
          iconColor="text-violet-600"
          iconBg="bg-violet-500/10"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Ventanas">
              <FieldInput id="terminaciones.ventanas" name="terminaciones.ventanas" defaultValue={modelo.terminaciones?.ventanas} />
            </Field>
            <Field label="Cocina">
              <FieldInput id="terminaciones.cocina" name="terminaciones.cocina" defaultValue={modelo.terminaciones?.cocina} />
            </Field>
            <Field label="Electrica">
              <FieldInput id="instalaciones.electrica" name="instalaciones.electrica" defaultValue={modelo.instalaciones?.electrica} />
            </Field>
            <Field label="Sanitaria">
              <FieldInput id="instalaciones.sanitaria" name="instalaciones.sanitaria" defaultValue={modelo.instalaciones?.sanitaria} />
            </Field>
          </div>
        </FormSection>

        {/* ── Logística y Garantías ──────────────────── */}
        <FormSection
          icon={<Truck className="w-5 h-5" />}
          title="Logística y Soporte"
          iconColor="text-orange-600"
          iconBg="bg-orange-500/10"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="¿Qué incluye?">
              <FieldTextarea id="logistica.que_incluye" name="logistica.que_incluye" defaultValue={modelo.logistica?.que_incluye} placeholder="Estructura, armado..." />
            </Field>
            <Field label="Garantía Estructura">
              <FieldInput id="soporte.garantia_estructura" name="soporte.garantia_estructura" defaultValue={modelo.soporte?.garantia_estructura} placeholder="10 años" />
            </Field>
          </div>
        </FormSection>

        {/* ── Media ──────────────────────────────────── */}
        <FormSection
          icon={<Video className="w-5 h-5" />}
          title="Fotografías y Video"
          iconColor="text-rose-600"
          iconBg="bg-rose-500/10"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-widest opacity-60">Galería de Imágenes ({previews.length})</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border/60 rounded-3xl p-6 text-center cursor-pointer hover:bg-muted/30 transition-all"
              >
                <Upload className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Añadir más fotos</p>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImagesWithAutoSave} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border">
                    <img src={src} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImageWithAutoSave(i)} className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-widest opacity-60">Plano de Distribución</Label>
              <div
                onClick={() => !planoPreview && planoInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed border-border/60 rounded-3xl relative overflow-hidden transition-all",
                  planoPreview ? "" : "p-6 text-center cursor-pointer hover:bg-muted/30"
                )}
              >
                {!planoPreview ? (
                  <>
                    <Upload className="w-10 h-10 mx-auto mb-2 opacity-40 text-brand-indigo" />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Añadir plano (PNG/JPG)</p>
                  </>
                ) : (
                  <div className="relative aspect-video">
                    <img src={planoPreview} className="w-full h-full object-cover" />
                    <button type="button" onClick={removePlanoWithAutoSave} className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <input ref={planoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePlano} />
              </div>
              <Label className="text-xs font-black uppercase tracking-widest opacity-60 mt-4 block">Enlace Video Tour</Label>
              <Input id="video_url" name="video_url" defaultValue={modelo.video_url || ""} placeholder="YouTube/Vimeo URL" className="h-12 rounded-2xl" />
            </div>
          </div>
        </FormSection>

        {/* ── Slider y Destacados (Admin Only) ────────── */}
        {isSuperAdmin && (
          <FormSection
            icon={<Star className="w-5 h-5 text-amber-500" />}
            title="Slider y Destacados"
            subtitle="Configuración para el Carrusel de la Región"
            iconColor="text-amber-500"
            iconBg="bg-amber-500/10"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <Field id="is_featured" label="Destacar en el Slider">
                <select id="is_featured" name="is_featured" defaultValue={modelo.is_featured ? 'true' : 'false'}
                  className="w-full h-12 rounded-2xl border border-border/40 bg-background/50 px-4 text-sm font-black uppercase tracking-widest focus:ring-0 appearance-none cursor-pointer"
                >
                  <option value="true">SÍ - Mostrar en Slider</option>
                  <option value="false">NO - Ocultar del Slider</option>
                </select>
              </Field>
              <Field id="featured_order" label="Orden (Prioridad)">
                <Input 
                  id="featured_order" 
                  name="featured_order" 
                  type="number" 
                  defaultValue={modelo.featured_order || 0} 
                  className="h-12 rounded-2xl bg-background/50 font-black text-lg text-center" 
                />
              </Field>
              <div className="md:col-span-2">
                 <p className="text-[10px] text-muted-foreground italic font-medium opacity-60">
                    * Los modelos destacados aparecerán en el carrusel superior del catálogo cuando se filtre por las regiones de la constructora asociada.
                 </p>
              </div>
            </div>
          </FormSection>
        )}

        {/* ── SEO ────────────────────────────────────── */}
        <FormSection
          icon={<Search className="w-5 h-5" />}
          title="Optimización SEO"
          subtitle={isPaidPlan ? "Controla cómo apareces en Google" : "Mejora a Plan Pro para SEO personalizado"}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-500/10"
        >
          {isPaidPlan ? (
            <SEOPanel
              initialTitle={modelo.seo_title || ""}
              initialDescription={modelo.seo_description || ""}
              initialKeywords={modelo.seo_keywords || []}
              initialOgImage={modelo.seo_og_image || ""}
              modelName={modelName}
              modelDescription={modelDesc}
              modelSlug={modelo.slug}
            />
          ) : (
            <div className="text-center py-6 opacity-60 italic">SEO avanzado no disponible en tu plan actual.</div>
          )}
        </FormSection>

        {/* ── Actions ────────────────────────────────── */}
        <div className="flex flex-col gap-4 pt-6">
          <div className="flex justify-between items-center px-4 mb-2">
            <span className={cn("text-[11px] font-black uppercase tracking-widest text-muted-foreground transition-opacity", 
              isAutoSaving ? "opacity-100 flex items-center text-primary" : "opacity-60"
            )}>
              {isAutoSaving ? <><Loader2 className="w-3 h-3 mr-2 animate-spin" /> Guardando en segundo plano...</> 
                : lastSaved ? `Autoguardado completado a las ${lastSaved.toLocaleTimeString()}` : "Autoguardado activado"}
            </span>
          </div>
          <Button type="submit" disabled={loading || isAutoSaving} className="w-full h-20 rounded-[2.5rem] font-black uppercase tracking-widest bg-brand-indigo text-white shadow-2xl">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Save className="w-5 h-5 mr-3" /> Sincronizar Cambios Definitivos</>}
          </Button>
          <div className="grid grid-cols-2 gap-4">
             <Link href={`/modelo/${modelo.slug}`} target="_blank" className="h-14 rounded-3xl border border-border flex items-center justify-center font-black text-[10px] uppercase tracking-widest hover:bg-muted/50">
                <Eye className="w-4 h-4 mr-2" /> Ver Público
             </Link>
             <Button type="button" variant="outline" onClick={() => router.back()} className="h-14 rounded-3xl font-black text-[10px] uppercase tracking-widest">
                Cancelar
             </Button>
          </div>
        </div>

      </form>
    </div>
  );
}
