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
import { createClient } from "@/lib/supabase/client";
import { ModelWithConstructora } from "@/lib/supabase/services";

const TIPOS = [
  { value: "prefabricada", label: "Prefabricada" },
  { value: "sip", label: "Panel SIP" },
  { value: "container", label: "Container" },
  { value: "llave-en-mano", label: "Llave en Mano" },
];

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
       // Is an existing image
       setExistingImages(prev => prev.filter((_, i) => i !== idx));
    } else {
       // Is a new file
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

      // 1. Upload new images if any
      const newUrls: string[] = [];
      if (files.length > 0) {
        for (const file of files) {
          const ext = file.name.split('.').pop();
          const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          
          const { error: uploadError } = await supabase.storage
            .from('model_images')
            .upload(path, file);

          if (uploadError) {
             console.warn("Upload skip:", uploadError.message);
             continue;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('model_images')
            .getPublicUrl(path);
          newUrls.push(publicUrl);
        }
      }

      const finalImages = [...existingImages, ...newUrls];

      // 2. Update model
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
      setTimeout(() => router.push('/dashboard/catalog'), 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al actualizar");
      setLoading(false);
    }
  };

  if (success) return (
    <div className="py-16 flex flex-col items-center justify-center gap-8">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
      </motion.div>
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-heading font-black tracking-tight">¡Modelo Actualizado!</h2>
        <p className="text-muted-foreground font-medium">Los cambios han sido guardados exitosamente.</p>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl p-5 text-sm font-bold flex items-center gap-3">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {/* Images */}
      <div className="glass rounded-[2.5rem] p-8 border border-border/40 space-y-5">
        <h2 className="font-heading font-black text-xl tracking-tight flex items-center gap-3">
          <ImagePlus className="w-6 h-6 text-brand-teal" /> Imágenes
        </h2>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border/60 rounded-2xl p-10 text-center cursor-pointer hover:border-primary/40 hover:bg-muted/20 transition-all opacity-60"
        >
          <Upload className="w-8 h-8 mx-auto mb-3" />
          <p className="font-bold text-sm">Añadir más imágenes</p>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
        
        {previews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
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

      {/* Data */}
      <div className="glass rounded-[2.5rem] p-8 border border-border/40 space-y-6">
        <h2 className="font-heading font-black text-xl tracking-tight flex items-center gap-3">
          <Home className="w-6 h-6 text-brand-indigo" /> General
        </h2>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" name="nombre" defaultValue={modelo.nombre} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo</Label>
            <select id="tipo" name="tipo" defaultValue={modelo.tipo} required
              className="w-full h-12 rounded-xl border border-input bg-background px-3 text-sm font-medium">
              {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="disponible">Estado</Label>
            <select id="disponible" name="disponible" defaultValue={modelo.disponible ? 'true' : 'false'} required
              className="w-full h-12 rounded-xl border border-input bg-background px-3 text-sm font-medium">
              <option value="true">Público (Activo)</option>
              <option value="false">Oculto (Borrador)</option>
            </select>
          </div>
          <div className="space-y-2">
             <Label htmlFor="precio_desde_uf">Precio Desde (UF)</Label>
             <Input id="precio_desde_uf" name="precio_desde_uf" type="number" defaultValue={modelo.precio_desde_uf} required />
          </div>
        </div>
        <div className="space-y-2">
           <Label htmlFor="descripcion">Descripción</Label>
           <Textarea id="descripcion" name="descripcion" defaultValue={modelo.descripcion} className="min-h-32" />
        </div>

        {modelo.constructora.plan !== 'gratis' && (
          <div className="space-y-4 pt-6 border-t border-border/40">
            <div className="flex items-center gap-2">
               <Video className="w-5 h-5 text-red-500" />
               <h3 className="font-bold text-sm uppercase tracking-widest leading-none">Video Tour (YouTube/Vimeo)</h3>
            </div>
            <div className="space-y-2">
              <Input 
                id="video_url" 
                name="video_url" 
                defaultValue={modelo.video_url || ""} 
                placeholder="https://www.youtube.com/watch?v=..." 
                className="h-12 rounded-xl bg-muted/20 border-border/40"
              />
              <p className="text-[10px] text-muted-foreground font-medium italic">Pega el link del video para mostrar un recorrido virtual en este modelo.</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-5 glass rounded-[2.5rem] p-8 border border-border/40">
        <div className="space-y-2">
          <Label htmlFor="superficie_m2">Superficie m²</Label>
          <Input id="superficie_m2" name="superficie_m2" type="number" defaultValue={modelo.superficie_m2} required />
        </div>
        <div className="space-y-2">
           <Label htmlFor="dormitorios">Dormitorios</Label>
           <Input id="dormitorios" name="dormitorios" type="number" defaultValue={modelo.dormitorios} required />
        </div>
        <div className="space-y-2">
           <Label htmlFor="banos">Baños</Label>
           <Input id="banos" name="banos" type="number" defaultValue={modelo.banos} required />
        </div>
        <div className="space-y-2">
           <Label htmlFor="tiempo_entrega">Tiempo Entrega</Label>
           <Input id="tiempo_entrega" name="tiempo_entrega" defaultValue={modelo.tiempo_entrega} />
        </div>
      </div>

      <div className="flex gap-4 pt-10">
        <Button type="button" variant="outline" className="h-14 flex-1 rounded-2xl font-black uppercase tracking-widest text-[10px]" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="h-14 flex-1 rounded-2xl brand-gradient font-black uppercase tracking-widest text-[10px] text-white">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  );
}
