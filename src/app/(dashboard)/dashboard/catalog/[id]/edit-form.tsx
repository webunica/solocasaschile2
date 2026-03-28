"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, ImagePlus, Loader2, CheckCircle2, 
  AlertCircle, X, Home, Video, ArrowLeft,
  ShieldCheck, Zap, Eye, Save, Trash2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ModelWithConstructora } from "@/lib/supabase/services";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { FORM_SYSTEM_OPTIONS as TIPOS } from "@/config/construction-systems";

export function EditModelForm({ modelo }: { modelo: ModelWithConstructora }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>(modelo.imagenes_urls || []);
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(modelo.imagenes_urls || []);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []).slice(0, 5);
    setFiles(prev => [...prev, ...selected]);
    setPreviews(prev => [...prev, ...selected.map(f => URL.createObjectURL(f))]);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const formData = new FormData(e.currentTarget);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("No autenticado");
        setLoading(false);
        return;
      }

      const newUrls: string[] = [];
      if (files.length > 0) {
        for (const file of files) {
          const ext = file.name.split('.').pop();
          const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { error: uploadError } = await supabase.storage.from('model_images').upload(path, file);
          if (uploadError) continue;

          const { data: { publicUrl } } = supabase.storage.from('model_images').getPublicUrl(path);
          newUrls.push(publicUrl);
        }
      }

      const finalImages = [...existingImages, ...newUrls];

      const { error: updateError } = await supabase
        .from('modelos')
        .update({
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
        })
        .eq('id', modelo.id);

      if (updateError) throw new Error(updateError.message);

      setSuccess(true);
      setTimeout(() => router.push('/dashboard/catalog'), 2000);
    } catch (err: any) {
      setError(err.message || "Error al actualizar");
      setLoading(false);
    }
  };

  if (success) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-10">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-32 h-32 rounded-[2.5rem] brand-gradient flex items-center justify-center shadow-2xl">
        <CheckCircle2 className="w-16 h-16 text-white" />
      </motion.div>
      <div className="text-center space-y-3">
        <h2 className="text-5xl font-heading font-black tracking-tighter text-foreground">Actualización Exitosa</h2>
        <p className="text-xl text-muted-foreground font-medium italic opacity-80">Tu modelo ha sido actualizado en tiempo real.</p>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-10 pb-20">
      
      <div className="xl:col-span-2 space-y-10">
        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-[2rem] p-6 text-sm font-bold flex items-center gap-4">
                <AlertCircle className="w-6 h-6" /> {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
             <h2 className="text-3xl font-heading font-black tracking-tight text-foreground">Gestión de Identidad</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
             <div className="space-y-3">
                <Label htmlFor="nombre" className="text-xs font-black uppercase tracking-widest opacity-60">Nombre del Modelo</Label>
                <Input id="nombre" name="nombre" defaultValue={modelo.nombre} required className="h-16 rounded-2xl bg-background/50 border-border/40 focus:border-primary/40 text-lg font-medium shadow-inner" />
             </div>
             <div className="space-y-3">
                <Label htmlFor="tipo" className="text-xs font-black uppercase tracking-widest opacity-60">Tipo de Vivienda</Label>
                <select id="tipo" name="tipo" defaultValue={modelo.tipo} required
                  className="w-full h-16 rounded-2xl border border-border/40 bg-background/50 px-5 text-sm font-black uppercase tracking-widest focus:ring-0 focus:border-primary appearance-none cursor-pointer">
                  {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
             </div>
             <div className="space-y-3">
                <Label htmlFor="disponible" className="text-xs font-black uppercase tracking-widest opacity-60">Visibilidad en Catálogo</Label>
                <select id="disponible" name="disponible" defaultValue={modelo.disponible ? 'true' : 'false'} required
                  className="w-full h-16 rounded-2xl border border-border/40 bg-background/50 px-5 text-sm font-black uppercase tracking-widest focus:ring-0 focus:border-primary appearance-none cursor-pointer">
                  <option value="true">Público (Activo)</option>
                  <option value="false">Privado (Borrador)</option>
                </select>
             </div>
             <div className="space-y-3">
                <Label htmlFor="precio_desde_uf" className="text-xs font-black uppercase tracking-widest opacity-60">Inversión Base (UF)</Label>
                <Input id="precio_desde_uf" name="precio_desde_uf" type="number" defaultValue={modelo.precio_desde_uf} required className="h-16 rounded-2xl bg-background/50 border-border/40 font-black text-xl text-center shadow-inner" />
             </div>
             <div className="md:col-span-2 space-y-3">
                <Label htmlFor="descripcion" className="text-xs font-black uppercase tracking-widest opacity-60">Relato del Modelo</Label>
                <Textarea id="descripcion" name="descripcion" defaultValue={modelo.descripcion} className="min-h-[160px] rounded-3xl bg-background/50 border-border/40 text-base font-medium p-6 resize-none leading-relaxed" />
             </div>
          </div>
        </motion.div>

        {/* Section: Technical Specs */}
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
             <h2 className="text-3xl font-heading font-black tracking-tight text-foreground">Ficha Técnica</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
             <div className="space-y-3">
                <Label htmlFor="superficie_m2" className="text-[10px] font-black uppercase tracking-widest opacity-60">Superficie <span className="text-primary/40 block mt-1">M² Proyectados</span></Label>
                <Input id="superficie_m2" name="superficie_m2" type="number" defaultValue={modelo.superficie_m2} required className="h-16 rounded-2xl bg-background/50 border-border/40 font-black text-xl text-center shadow-inner" />
             </div>
             <div className="space-y-3">
                <Label htmlFor="dormitorios" className="text-[10px] font-black uppercase tracking-widest opacity-60 text-foreground/60 text-balance">Dormitorios <span className="text-primary/40 block mt-1">Total Hab.</span></Label>
                <Input id="dormitorios" name="dormitorios" type="number" defaultValue={modelo.dormitorios} required className="h-16 rounded-2xl bg-background/50 border-border/40 font-black text-xl text-center shadow-inner" />
             </div>
             <div className="space-y-3">
                <Label htmlFor="banos" className="text-[10px] font-black uppercase tracking-widest opacity-60">Servicios <span className="text-primary/40 block mt-1">Baños</span></Label>
                <Input id="banos" name="banos" type="number" defaultValue={modelo.banos} required className="h-16 rounded-2xl bg-background/50 border-border/40 font-black text-xl text-center shadow-inner" />
             </div>
             <div className="space-y-3">
                <Label htmlFor="tiempo_entrega" className="text-[10px] font-black uppercase tracking-widest opacity-60">Velocidad <span className="text-primary/40 block mt-1">Entrega</span></Label>
                <Input id="tiempo_entrega" name="tiempo_entrega" defaultValue={modelo.tiempo_entrega} className="h-16 rounded-2xl bg-background/50 border-border/40 font-black text-xs text-center uppercase tracking-widest shadow-inner" />
             </div>
             <div className="space-y-3">
                <Label htmlFor="garantia_anos" className="text-[10px] font-black uppercase tracking-widest opacity-60">Confianza <span className="text-primary/40 block mt-1">Años Garantía</span></Label>
                <Input id="garantia_anos" name="garantia_anos" type="number" defaultValue={modelo.garantia_anos} required className="h-16 rounded-2xl bg-background/50 border-border/40 font-black text-xl text-center shadow-inner" />
             </div>
             <div className="space-y-3">
                <Label htmlFor="postventa" className="text-[10px] font-black uppercase tracking-widest opacity-60">Postventa <span className="text-primary/40 block mt-1">Soporte</span></Label>
                <select id="postventa" name="postventa" defaultValue={modelo.postventa ? 'true' : 'false'} required
                  className="w-full h-16 rounded-2xl border border-border/40 bg-background/50 px-5 text-sm font-black uppercase tracking-widest focus:ring-0 focus:border-primary appearance-none cursor-pointer">
                  <option value="true">Incluido</option>
                  <option value="false">No Inc.</option>
                </select>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Sidebar Storage & Actions */}
      <div className="space-y-10">
        
        {/* Images Galery */}
        <section className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-[3.5rem] p-10 space-y-8 shadow-xl">
           <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-40 text-foreground">Visual Asset Manager</h3>
              <Badge variant="outline" className="rounded-full px-3 py-1 font-bold text-[10px] text-foreground/60">{previews.length}</Badge>
           </div>
           
           <div
             onClick={() => fileInputRef.current?.click()}
             className="group relative border-2 border-dashed border-border/60 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:border-primary/40 hover:bg-muted/30 transition-all duration-500 overflow-hidden"
           >
             <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-2 opacity-60">
                <Upload className="w-5 h-5" />
             </div>
             <p className="font-black text-[10px] uppercase tracking-widest text-foreground/40">Gestionar Medios</p>
             <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
           </div>

           <div className="grid grid-cols-2 gap-3">
              <AnimatePresence>
                {previews.map((src, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ scale: 0.8, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-lg group-hover:scale-[1.03] transition-transform"
                  >
                     <img src={src} alt="" className="w-full h-full object-cover" />
                     <button 
                       type="button" 
                       onClick={() => removeImage(i)}
                       className="absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform hover:bg-black"
                     >
                       <X className="w-4 h-4" />
                     </button>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </section>

        {/* Video Tour Section */}
        <section className={cn(
           "bg-card/40 backdrop-blur-xl border border-border/40 rounded-[3.5rem] p-10 space-y-6 shadow-xl relative overflow-hidden group",
           modelo.constructora.plan === 'gratis' ? "opacity-40 grayscale pointer-events-none" : ""
        )}>
           <div className="flex items-center gap-4">
              <Video className="w-6 h-6 text-red-500" />
              <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-40 text-foreground">Video Walkthrough</h3>
           </div>
           <div className="space-y-3">
              <Input 
                id="video_url" 
                name="video_url" 
                defaultValue={modelo.video_url || ""} 
                placeholder="https://www.youtube.com/watch?v=..." 
                className="h-14 rounded-2xl bg-background/50 border-border/40 font-medium" 
              />
              <p className="text-[10px] font-bold text-muted-foreground opacity-60 text-center">Compatible con 4K y 60FPS.</p>
           </div>
        </section>

        {/* Sidebar Actions */}
        <div className="flex flex-col gap-4">
          <Button type="submit" disabled={loading} className="w-full h-20 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] brand-gradient shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-white hover:text-white">
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Save className="w-5 h-5 mr-3" /> Guardar Cambios</>}
          </Button>

          <div className="grid grid-cols-2 gap-4">
             <Link 
               href={`/modelo/${modelo.slug}`} 
               target="_blank"
               className={cn(buttonVariants({ variant: "outline" }), "h-16 rounded-3xl font-black text-[10px] uppercase tracking-widest border-border hover:bg-muted/50 transition-all gap-2")}
             >
                <Eye className="w-4 h-4" /> Preview
             </Link>
             <Button 
               type="button" 
               variant="outline" 
               onClick={() => router.back()}
               className="h-16 rounded-3xl font-black text-[10px] uppercase tracking-widest border-border hover:bg-muted/50 transition-all"
             >
                Cancelar
             </Button>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-brand-indigo/5 border border-brand-indigo/10 flex items-start gap-4 opacity-60">
           <ShieldCheck className="w-6 h-6 text-brand-indigo shrink-0" />
           <p className="text-[10px] font-medium text-brand-indigo leading-relaxed italic">
              Se guardará una versión histórica de estos cambios para auditoría de calidad. Los cambios pueden tardar hasta 2 minutos en propagarse a nivel mundial.
           </p>
        </div>

      </div>
    </form>
  );
}
