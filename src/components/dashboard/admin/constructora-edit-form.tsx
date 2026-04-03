'use client';

import { useState, useRef } from "react";
import { adminUpdateConstructora } from "@/lib/supabase/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, Phone, Globe, MapPin, 
  Image as ImageIcon, Save, CheckCircle2, AlertCircle, Video,
  Search, ShieldCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SEOPanel } from "@/components/dashboard/seo-panel";
import { RegionesSelector } from "@/components/dashboard/regiones-selector";

interface Props {
  initialData: any;
}

export function AdminEditForm({ initialData }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);
    
    // 1. Upload logo if changed (SuperAdmin can use their auth to upload)
    let finalLogoUrl = initialData?.logo_url || "";
    if (logoFile) {
      try {
        const { createClient: createBrowserClient } = await import("@/lib/supabase/client");
        const supabase = createBrowserClient();
        const ext = logoFile.name.split('.').pop();
        const path = `logos/${initialData.id}-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('model_images') 
          .upload(path, logoFile, { upsert: true });

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('model_images')
            .getPublicUrl(path);
          finalLogoUrl = publicUrl;
        }
      } catch (err) {
        console.error("Logo upload failed", err);
      }
    }

    // 2. Upload cover image if changed
    let finalImageUrl = initialData?.image_url || "";
    if (imageFile) {
      try {
        const { createClient: createBrowserClient } = await import("@/lib/supabase/client");
        const supabase = createBrowserClient();
        const ext = imageFile.name.split('.').pop();
        const path = `banners/${initialData.id}-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('model_images') 
          .upload(path, imageFile, { upsert: true });

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('model_images')
            .getPublicUrl(path);
          finalImageUrl = publicUrl;
        }
      } catch (err) {
        console.error("Cover image upload failed", err);
      }
    }

    formData.set("logo_url", finalLogoUrl);
    formData.set("image_url", finalImageUrl);
    formData.set("id", initialData.id);
    formData.append("slug", initialData?.slug || "");
    
    const result = await adminUpdateConstructora(formData);
    
    if (result.success) {
      setMessage({ type: "success", text: "Perfil actualizado correctamente por el Administrador." });
    } else {
      setMessage({ type: "error", text: result.error || "Error al actualizar el perfil." });
    }
    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <Card className="rounded-3xl border-border/40 shadow-xl overflow-hidden">
          <CardContent className="p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold italic">Edición Administrativa</h3>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">ID: {initialData.id}</p>
                </div>
              </div>
              <Badge className="bg-amber-500/10 text-amber-600 border-none font-black uppercase tracking-widest text-[9px]">SOLO SUPERADMIN</Badge>
            </div>
            
            <Separator />

            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-xs font-black uppercase tracking-widest opacity-60">Nombre Comercial</Label>
                  <Input 
                    id="nombre" 
                    name="nombre" 
                    defaultValue={initialData?.nombre || ""} 
                    className="h-12 rounded-xl bg-muted/20 border-border/40"
                    placeholder="Ejem: ModuLar Pro Chile"
                    required
                  />
               </div>
               
               <div className="space-y-2">
                  <Label htmlFor="sitio_web" className="text-xs font-black uppercase tracking-widest opacity-60">Sitio Web</Label>
                  <Input 
                    id="sitio_web" 
                    name="sitio_web" 
                    defaultValue={initialData?.sitio_web || ""} 
                    className="h-12 rounded-xl bg-muted/20 border-border/40"
                    placeholder="https://www.tuweb.cl"
                  />
               </div>
            </div>

            <div className="space-y-2">
               <Label htmlFor="descripcion" className="text-xs font-black uppercase tracking-widest opacity-60">Descripción Pública</Label>
               <Textarea 
                 id="descripcion" 
                 name="descripcion" 
                 defaultValue={initialData?.descripcion || ""} 
                 className="min-h-[150px] rounded-2xl bg-muted/20 border-border/40 p-4 leading-relaxed text-sm"
                 placeholder="Descripción oficial de la constructora..."
               />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-xs font-black uppercase tracking-widest opacity-60">Teléfono</Label>
                  <Input 
                    id="telefono" 
                    name="telefono" 
                    defaultValue={initialData?.telefono || ""} 
                    className="h-12 rounded-xl bg-muted/20 border-border/40"
                  />
               </div>
               
               <div className="space-y-2">
                  <Label htmlFor="direccion" className="text-xs font-black uppercase tracking-widest opacity-60">Dirección</Label>
                  <Input 
                    id="direccion" 
                    name="direccion" 
                    defaultValue={initialData?.direccion || ""} 
                    className="h-12 rounded-xl bg-muted/20 border-border/40"
                  />
               </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/40">
                <div className="flex items-center gap-2">
                   <Video className="w-5 h-5 text-red-500" />
                   <h3 className="font-bold text-sm uppercase tracking-widest leading-none">Video Corporativo</h3>
                </div>
                <Input 
                  id="video_url" 
                  name="video_url" 
                  defaultValue={initialData?.video_url || ""} 
                  placeholder="https://www.youtube.com/watch?v=..." 
                  className="h-12 rounded-xl bg-muted/20 border-border/40"
                />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/40 shadow-xl overflow-hidden">
           <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                 </div>
                 <h3 className="text-xl font-bold">Cobertura</h3>
              </div>
              <Separator />
              <div className="space-y-2">
                  <Label htmlFor="regiones" className="text-xs font-black uppercase tracking-widest opacity-60">Regiones donde opera</Label>
                  <RegionesSelector name="regiones" initialValue={initialData?.regiones || []} />
               </div>
           </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <Card className="rounded-3xl border-border/40 shadow-xl overflow-hidden">
           <CardContent className="p-8 space-y-8">
              <h3 className="text-xl font-bold">Visuales</h3>
              <div className="space-y-8">
                 <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">Logo</Label>
                    <div 
                      onClick={() => logoInputRef.current?.click()}
                      className="w-32 h-32 rounded-3xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden relative group cursor-pointer"
                    >
                      {logoPreview || initialData?.logo_url ? (
                         <img src={logoPreview || initialData.logo_url} className="w-full h-full object-contain p-2" />
                      ) : (
                         <Building2 className="w-8 h-8 opacity-20" />
                      )}
                    </div>
                    <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) { setLogoFile(file); setLogoPreview(URL.createObjectURL(file)); }
                    }} />
                 </div>

                 <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">Banner</Label>
                    <div 
                      onClick={() => imageInputRef.current?.click()}
                      className="w-full h-32 rounded-3xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden relative group cursor-pointer"
                    >
                      {imagePreview || initialData?.image_url ? (
                         <img src={imagePreview || initialData.image_url} className="w-full h-full object-cover" />
                      ) : (
                         <ImageIcon className="w-6 h-6 opacity-20" />
                      )}
                    </div>
                    <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
                    }} />
                 </div>
              </div>
           </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/40 shadow-xl overflow-hidden">
            <CardContent className="p-8 space-y-6">
                <h3 className="text-xl font-bold">SEO</h3>
                <SEOPanel
                    initialTitle={initialData?.seo_title || ""}
                    initialDescription={initialData?.seo_description || ""}
                    initialKeywords={initialData?.seo_keywords || []}
                    modelName={initialData?.nombre || ""}
                />
            </CardContent>
        </Card>

        <Card className="rounded-3xl border-amber-500 bg-amber-500 text-white p-8 space-y-6 shadow-2xl shadow-amber-500/20">
           <h4 className="font-bold text-lg italic">Acción Administrativa</h4>
           {message && (
             <div className={`p-4 rounded-xl flex items-start gap-3 ${message.type === 'success' ? 'bg-white/20 text-white' : 'bg-red-500/20 text-red-100'}`}>
                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                <p className="text-xs font-bold leading-tight">{message.text}</p>
             </div>
           )}
           <Button type="submit" disabled={loading} className="w-full py-7 rounded-2xl bg-white text-amber-600 hover:bg-slate-100 font-black uppercase tracking-widest">
             {loading ? "Procesando..." : "Guardar Cambios Admin"}
             <Save className="w-4 h-4 ml-3" />
           </Button>
        </Card>
      </div>
    </form>
  );
}
