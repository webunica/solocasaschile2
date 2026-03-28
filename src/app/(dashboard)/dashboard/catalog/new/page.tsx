"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, ImagePlus, Loader2, CheckCircle2, 
  AlertCircle, X, Home, Video, ArrowLeft,
  Sparkles, Info, ShieldCheck, Zap
} from "lucide-react";
import { createModel } from "@/lib/supabase/actions";
import { createClient } from "@/lib/supabase/client";
import { getPlanLimits } from "@/lib/constants/plans";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("No se detectó sesión activa. Por favor, re-inicia sesión.");
        setLoading(false);
        return;
      }

      const imageUrls: string[] = [];
      if (files.length > 0) {
        try {
          for (const file of files) {
            const ext = file.name.split('.').pop();
            const filePath = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
            const { error: uploadError } = await supabase.storage
              .from('model_images')
              .upload(filePath, file, { cacheControl: '3600', upsert: false });

            if (uploadError) continue;

            const { data: { publicUrl } } = supabase.storage
              .from('model_images')
              .getPublicUrl(filePath);
            imageUrls.push(publicUrl);
          }
        } catch (storageErr) {
          console.warn("Storage no disponible");
        }
      }

      const nombre = formData.get('nombre') as string;
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
        video_url: formData.get('video_url') as string || null,
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
        className="w-32 h-32 rounded-[2.5rem] brand-gradient flex items-center justify-center shadow-2xl shadow-primary/30"
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
    <div className="py-12 space-y-12 max-w-5xl mx-auto px-4">
      {/* Header with back button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
           <Link href="/dashboard/catalog" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" /> Volver al Catálogo
           </Link>
           <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter leading-none text-foreground">
             Nuevo <span className="brand-gradient bg-clip-text text-transparent italic">Lanzamiento</span>
           </h1>
           <p className="text-xl text-muted-foreground font-medium max-w-xl">
             Define las especificaciones técnicas y visuales de tu vivienda para atraer a los mejores prospectos.
           </p>
        </div>
        
        <div className="hidden lg:block">
           <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-background flex items-center justify-center shadow-lg border border-border/40">
                 <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Tu Plan Permite</p>
                 <p className="font-bold text-sm">{planLimits?.maxModels || '—'} Modelos totales</p>
              </div>
           </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-10 pb-20">
        
        <div className="xl:col-span-2 space-y-10">
          {/* Section: Basic Identity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative overflow-hidden bg-card/40 backdrop-blur-xl border border-border/40 rounded-[3.5rem] p-10 md:p-14 space-y-10 shadow-2xl shadow-black/[0.02]"
          >
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-brand-indigo/10 flex items-center justify-center text-brand-indigo">
                  <Home className="w-6 h-6" />
               </div>
               <h2 className="text-3xl font-heading font-black tracking-tight text-foreground">Identidad del Proyecto</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <Label htmlFor="nombre" className="text-xs font-black uppercase tracking-widest opacity-60">Nombre Comercial</Label>
                  <Input 
                    id="nombre" 
                    name="nombre" 
                    placeholder="Ej: Casa Roble Premium SIP" 
                    required 
                    className="h-16 rounded-2xl bg-background/50 border-border/40 focus:border-primary/40 text-lg font-medium shadow-inner" 
                  />
               </div>
               <div className="space-y-3 relative">
                  <Label htmlFor="tipo" className="text-xs font-black uppercase tracking-widest opacity-60">Sistema Constructivo</Label>
                  <select 
                    id="tipo" 
                    name="tipo" 
                    required
                    className="w-full h-16 rounded-2xl border border-border/40 bg-background/50 px-5 text-sm font-black uppercase tracking-widest focus:ring-0 focus:border-primary transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Seleccionar Tipo...</option>
                    {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
               </div>
               <div className="md:col-span-2 space-y-3">
                  <Label htmlFor="descripcion" className="text-xs font-black uppercase tracking-widest opacity-60">Relato de Venta (Descripción)</Label>
                  <Textarea 
                    id="descripcion" 
                    name="descripcion" 
                    placeholder="Describe los acabados, eficiencia energética y experiencia de habitar este modelo..." 
                    className="min-h-[160px] rounded-3xl bg-background/50 border-border/40 focus:border-primary/40 text-base font-medium p-6 resize-none leading-relaxed" 
                  />
               </div>
            </div>
          </motion.div>

          {/* Section: Technical Specs Grouped */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative overflow-hidden bg-card/40 backdrop-blur-xl border border-border/40 rounded-[3.5rem] p-10 md:p-14 space-y-10 shadow-2xl shadow-black/[0.02]"
          >
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                  <Zap className="w-6 h-6" />
               </div>
               <h2 className="text-3xl font-heading font-black tracking-tight text-foreground">Ficha Técnica Pro</h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                 { id: "superficie_m2", label: "Superficie", sub: "M² Totales", placeholder: "120", type: "number", min: 10 },
                 { id: "precio_desde_uf", label: "Inversión", sub: "Desde UF", placeholder: "1850", type: "number", min: 100 },
                 { id: "dormitorios", label: "Habitaciones", sub: "Hab", placeholder: "3", type: "number", min: 1 },
                 { id: "banos", label: "Baños", sub: "Total", placeholder: "2", type: "number", min: 1 },
                 { id: "garantia_anos", label: "Garantía", sub: "Años", placeholder: "5", type: "number", min: 1 },
               ].map((spec) => (
                 <div key={spec.id} className="space-y-3">
                    <Label htmlFor={spec.id} className="text-[10px] font-black uppercase tracking-widest opacity-60 line-clamp-1 text-foreground/60">{spec.label} <span className="text-primary/40 block mt-1">{spec.sub}</span></Label>
                    <Input id={spec.id} name={spec.id} type={spec.type} placeholder={spec.placeholder} required className="h-16 rounded-2xl bg-background/50 border-border/40 font-black text-xl text-center shadow-inner" />
                 </div>
               ))}
               
               <div className="space-y-3">
                  <Label htmlFor="tiempo_entrega" className="text-[10px] font-black uppercase tracking-widest opacity-60 line-clamp-1 text-foreground/60">Velocidad <span className="text-primary/40 block mt-1">Estimada</span></Label>
                  <Input id="tiempo_entrega" name="tiempo_entrega" placeholder="Ej: 90 Días" required className="h-16 rounded-2xl bg-background/50 border-border/40 font-black text-xs uppercase tracking-widest text-center shadow-inner" />
               </div>

               <div className="col-span-2 lg:col-span-3 space-y-3">
                  <Label htmlFor="postventa" className="text-xs font-black uppercase tracking-widest opacity-60">Protocolo de Postventa</Label>
                  <select 
                    id="postventa" 
                    name="postventa" 
                    required
                    className="w-full h-16 rounded-2xl border border-border/40 bg-background/50 px-5 text-sm font-black uppercase tracking-widest focus:ring-0 focus:border-primary transition-all appearance-none cursor-pointer"
                  >
                    <option value="true">Servicio de Postventa Incluido</option>
                    <option value="false">Opcional / No incluido</option>
                  </select>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar Space: Media & Actions */}
        <div className="space-y-10">
          
          {/* Images Section */}
          <section className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-[3.5rem] p-10 space-y-8 shadow-xl">
             <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 text-foreground">Galería de Impacto</h3>
                <Badge variant="outline" className="rounded-full px-3 py-1 font-bold text-[10px] text-foreground/60">{previews.length}/{planLimits?.maxPhotos || 3}</Badge>
             </div>
             
             <div
               onClick={() => fileInputRef.current?.click()}
               className="group relative border-2 border-dashed border-border/60 rounded-[2.5rem] aspect-square flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/40 hover:bg-muted/30 transition-all duration-500 overflow-hidden"
             >
               <AnimatePresence>
                 {previews.length === 0 ? (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 p-6">
                      <div className="w-16 h-16 rounded-3xl bg-muted/50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:brand-gradient group-hover:text-white transition-all duration-700 shadow-inner">
                         <Upload className="w-6 h-6" />
                      </div>
                      <p className="font-black text-xs uppercase tracking-widest text-foreground">Subir Renders</p>
                      <p className="text-[10px] text-muted-foreground font-medium opacity-60">Formatos: JPG o PNG <br/> de alta resolución</p>
                   </motion.div>
                 ) : (
                   <div className="grid grid-cols-2 gap-2 p-4 w-full h-full">
                      {previews.map((src, i) => (
                        <div key={i} className="relative rounded-2xl overflow-hidden border border-white/10 shadow-lg group-hover:scale-[1.03] transition-transform">
                           <img src={src} alt="" className="w-full h-full object-cover" />
                           <button 
                             type="button" 
                             onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                             className="absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform hover:bg-black"
                           >
                             <X className="w-4 h-4" />
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
             
             <p className="text-[10px] text-muted-foreground font-medium italic text-center text-balance">
                "Las casas con más de 3 renders de alta calidad aumentan su intención de compra en un 45%."
             </p>
          </section>

          {/* Video Tour Section */}
          <section className={cn(
             "bg-card/40 backdrop-blur-xl border border-border/40 rounded-[3.5rem] p-10 space-y-6 shadow-xl relative overflow-hidden group",
             planLimits?.maxModels && planLimits?.maxModels <= 3 ? "opacity-40 grayscale pointer-events-none" : ""
          )}>
             <div className="flex items-center gap-4">
                <Video className="w-6 h-6 text-red-500" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-40 text-foreground">Video Walkthrough</h3>
             </div>
             <div className="space-y-3">
                <Input 
                  id="video_url" 
                  name="video_url" 
                  placeholder="URL YouTube o Vimeo" 
                  className="h-14 rounded-2xl bg-background/50 border-border/40 font-medium" 
                />
                <p className="text-[10px] font-bold text-muted-foreground opacity-60">Integración con Vimeo y YouTube habilitada.</p>
             </div>
             <div className="absolute top-0 right-0 p-4">
                <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-widest">Premium</Badge>
             </div>
          </section>

          {/* Form Actions */}
          <div className="flex flex-col gap-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-20 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] brand-gradient shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-white hover:text-white"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Publicar Lanzamiento"}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full h-16 rounded-3xl font-black text-[10px] uppercase tracking-widest border-border hover:bg-muted/50 transition-all opacity-40 hover:opacity-100"
              onClick={() => router.push('/dashboard/catalog')}
            >
              Descartar Borrador
            </Button>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-4">
             <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
             <p className="text-[10px] font-medium text-emerald-800 leading-relaxed italic">
                Tus datos están protegidos por el estándar de seguridad bancaria de Chile. Cada publicación es revisada por nuestro sistema de calidad automática.
             </p>
          </div>

        </div>
      </form>
    </div>
  );
}
