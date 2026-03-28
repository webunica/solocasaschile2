"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, ImagePlus, Loader2, CheckCircle2, 
  AlertCircle, X, Home, Video
} from "lucide-react";
import { createModel } from "@/lib/supabase/actions";
import { createClient } from "@/lib/supabase/client";
import { getPlanLimits } from "@/lib/constants/plans";
import { useEffect } from "react";

const TIPOS = [
  { value: "prefabricada", label: "Prefabricada" },
  { value: "sip", label: "Panel SIP" },
  { value: "container", label: "Container" },
  { value: "llave-en-mano", label: "Llave en Mano" },
];

export default function NewModelPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const [planLimits, setPlanLimits] = useState<any>(null);

  useEffect(() => {
    async function loadPlan() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('constructoras').select('plan').eq('id', user.id).single();
        setPlanLimits(getPlanLimits(data?.plan || 'gratis'));
      }
    }
    loadPlan();
  }, []);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxPhotos = planLimits?.maxPhotos || 3;
    const selected = Array.from(e.target.files || []).slice(0, maxPhotos);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const formData = new FormData(e.currentTarget);

    try {
      // 1. Validar sesión activa en el cliente
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("No se detectó sesión activa. Por favor, re-inicia sesión.");
        setLoading(false);
        return;
      }

      // 2. Subir imágenes (opcional — si falla storage, continuamos sin imágenes)
      const imageUrls: string[] = [];
      if (files.length > 0) {
        try {
          for (const file of files) {
            const ext = file.name.split('.').pop();
            const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
            const { error: uploadError } = await supabase.storage
              .from('model_images')
              .upload(filePath, file, { cacheControl: '3600', upsert: false });

            if (uploadError) {
              console.warn("Storage upload warning:", uploadError.message);
              continue; // Saltar esta imagen y continuar
            }

            const { data: { publicUrl } } = supabase.storage
              .from('model_images')
              .getPublicUrl(filePath);
            imageUrls.push(publicUrl);
          }
        } catch (storageErr: any) {
          console.warn("Storage no disponible:", storageErr.message);
          // Continuamos sin imágenes
        }
      }

      // 3. Generar slug único
      const nombre = formData.get('nombre') as string;
      const slug = `${nombre.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')}-${Date.now()}`;

      // 4. Insertar usando Action (para validar límites en servidor)
      const result = await createModel({
        nombre,
        tipo: formData.get('tipo') as string,
        superficie_m2: Number(formData.get('superficie_m2')),
        dormitorios: Number(formData.get('dormitorios')),
        banos: Number(formData.get('banos')),
        precio_desde_uf: Number(formData.get('precio_desde_uf')),
        tiempo_entrega: formData.get('tiempo_entrega') as string,
        garantia_anos: Number(formData.get('garantia_anos')),
        postventa: formData.get('postventa') === 'true',
        descripcion: formData.get('descripcion') as string,
        imagenes_urls: imageUrls,
      });

      if (result?.error) throw new Error(result.error);

      setSuccess(true);
      setTimeout(() => router.push('/dashboard/catalog'), 1500);
    } catch (err: any) {
      console.error("ERROR al crear modelo:", err);
      setError(err.message || "Ocurrió un error inesperado. Intenta de nuevo.");
      setLoading(false);
    }
  };

  if (success) return (
    <div className="py-16 flex flex-col items-center justify-center gap-8">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
      </motion.div>
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-heading font-black tracking-tight">¡Modelo Publicado!</h2>
        <p className="text-muted-foreground font-medium">Tu modelo fue creado exitosamente. Redirigiendo al catálogo...</p>
      </div>
    </div>
  );

  return (
    <div className="py-12 space-y-10 max-w-3xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-heading font-black tracking-tighter">Nuevo <span className="gradient-text">Modelo</span></h1>
        <p className="text-muted-foreground font-medium">Completa los datos de tu nuevo modelo de vivienda.</p>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl px-5 py-4 font-bold text-sm"
        >
          <AlertCircle className="w-5 h-5 shrink-0" /> {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Section: Images */}
        <div className="glass rounded-[2.5rem] p-8 border border-border/40 space-y-5">
          <h2 className="font-heading font-black text-xl tracking-tight flex items-center gap-3">
            <ImagePlus className="w-6 h-6 text-brand-teal" /> Imágenes del Modelo
          </h2>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border/60 rounded-2xl p-10 text-center cursor-pointer hover:border-primary/40 hover:bg-muted/20 transition-all group"
          >
            <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
            <p className="font-bold text-sm">Haz clic para subir imágenes</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG hasta 5MB · Máximo {planLimits?.maxPhotos || 3} imágenes para tu plan</p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
          {previews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-border/40">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Basic Info */}
        <div className="glass rounded-[2.5rem] p-8 border border-border/40 space-y-6">
          <h2 className="font-heading font-black text-xl tracking-tight flex items-center gap-3">
            <Home className="w-6 h-6 text-brand-indigo" /> Información del Modelo
          </h2>
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Modelo *</Label>
                <Input id="nombre" name="nombre" placeholder="Ej: Nogal SIP 120" required className="h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Construcción *</Label>
                <select id="tipo" name="tipo" required
                  className="w-full h-12 rounded-xl border border-input bg-background px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Seleccionar...</option>
                  {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea id="descripcion" name="descripcion" placeholder="Describe las características principales del modelo..." className="min-h-24 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Section: Technical Specs */}
        <div className="glass rounded-[2.5rem] p-8 border border-border/40 space-y-6">
          <h2 className="font-heading font-black text-xl tracking-tight">Especificaciones Técnicas</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="superficie_m2">Superficie m² *</Label>
              <Input id="superficie_m2" name="superficie_m2" type="number" min="20" placeholder="120" required className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="precio_desde_uf">Precio Desde (UF) *</Label>
              <Input id="precio_desde_uf" name="precio_desde_uf" type="number" min="100" placeholder="1200" required className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dormitorios">Dormitorios *</Label>
              <Input id="dormitorios" name="dormitorios" type="number" min="1" max="10" placeholder="3" required className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="banos">Baños *</Label>
              <Input id="banos" name="banos" type="number" min="1" max="8" placeholder="2" required className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiempo_entrega">Tiempo de Entrega</Label>
              <Input id="tiempo_entrega" name="tiempo_entrega" placeholder="Ej: 45-60 días" className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="garantia_anos">Años de Garantía *</Label>
              <Input id="garantia_anos" name="garantia_anos" type="number" min="1" max="50" defaultValue="1" required className="h-12" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="postventa">Servicio Postventa *</Label>
              <select id="postventa" name="postventa" required
                className="w-full h-12 rounded-xl border border-input bg-background px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="true">Disponible</option>
                <option value="false">No Incluido / Consultar</option>
              </select>
            </div>
          </div>
        </div>
        {/* Section: Video Tour */}
        {planLimits?.maxModels > 3 && (
          <div className="glass rounded-[2.5rem] p-8 border border-border/40 space-y-6">
            <h2 className="font-heading font-black text-xl tracking-tight flex items-center gap-3">
              <Video className="w-6 h-6 text-red-500" /> Video Tour (Opcional)
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="video_url">URL del Video (YouTube o Vimeo)</Label>
                <Input id="video_url" name="video_url" placeholder="https://www.youtube.com/watch?v=..." className="h-12" />
                <p className="text-[10px] text-muted-foreground font-medium italic">Incluye un video para que los clientes puedan ver el interior de la casa.</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="button" variant="outline" className="rounded-2xl h-14 px-8 font-black text-xs uppercase tracking-widest border-border"
            onClick={() => router.push('/dashboard/catalog')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}
            className="flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest brand-gradient shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-white hover:text-white">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publicar Modelo"}
          </Button>
        </div>
      </form>
    </div>
  );
}
