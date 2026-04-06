"use client";

import { useState, useRef } from "react";
import { updateSettings } from "@/lib/supabase/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, Phone, Globe, MapPin, 
  Image as ImageIcon, Save, CheckCircle2, AlertCircle, Video,
  Search, Tag, X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SEOPanel } from "@/components/dashboard/seo-panel";
import { RegionesSelector } from "@/components/dashboard/regiones-selector";

interface Props {
  initialData: any;
  userEmail: string | undefined;
}

export function SettingsForm({ initialData, userEmail }: Props) {
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
    
    // 1. Upload logo if changed
    let finalLogoUrl = initialData?.logo_url || "";
    if (logoFile) {
      try {
        const { createClient: createBrowserClient } = await import("@/lib/supabase/client");
        const supabase = createBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const ext = logoFile.name.split('.').pop();
          const path = `logos/${user.id}-${Date.now()}.${ext}`;
          const { error: uploadError } = await supabase.storage
            .from('model_images') 
            .upload(path, logoFile, { upsert: true });

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('model_images')
              .getPublicUrl(path);
            finalLogoUrl = publicUrl;
          }
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
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const ext = imageFile.name.split('.').pop();
          const path = `banners/${user.id}-${Date.now()}.${ext}`;
          const { error: uploadError } = await supabase.storage
            .from('model_images') 
            .upload(path, imageFile, { upsert: true });

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('model_images')
              .getPublicUrl(path);
            finalImageUrl = publicUrl;
          }
        }
      } catch (err) {
        console.error("Cover image upload failed", err);
      }
    }

    // Add final URLs to formData
    formData.set("logo_url", finalLogoUrl);
    formData.set("image_url", finalImageUrl);
    
    // Add slug for revalidation
    formData.append("slug", initialData?.slug || "");
    
    const result = await updateSettings(formData);
    
    if (result.success) {
      setMessage({ type: "success", text: "Configuración guardada correctamente." });
    } else {
      setMessage({ type: "error", text: result.error || "Error al guardar los cambios." });
    }
    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Basic Info */}
      <div className="lg:col-span-2 space-y-8">
        <Card className="rounded-3xl border-border/40 shadow-xl overflow-hidden">
          <CardContent className="p-8 space-y-8">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
               </div>
               <h3 className="text-xl font-bold">Información de la Constructora</h3>
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
            
            {(initialData?.plan === 'pro' || initialData?.plan === 'premium') && (
              <div className="space-y-4 pt-4 border-t border-border/40">
                <div className="flex items-center gap-2">
                   <Video className="w-5 h-5 text-red-500" />
                   <h3 className="font-bold text-sm uppercase tracking-widest leading-none">Video Corporativo (YouTube/Vimeo)</h3>
                   <Badge variant="outline" className="text-[9px] font-black uppercase text-red-500 border-red-500/20">Pro/Premium</Badge>
                </div>
                <div className="space-y-2">
                  <Input 
                    id="video_url" 
                    name="video_url" 
                    defaultValue={initialData?.video_url || ""} 
                    placeholder="https://www.youtube.com/watch?v=..." 
                    className="h-12 rounded-xl bg-muted/20 border-border/40"
                  />
                  <p className="text-[10px] text-muted-foreground font-medium italic">Pega el link de un video institucional para que los clientes conozcan tu constructora en acción.</p>
                </div>
              </div>
            )}
            </div>

            <div className="space-y-2">
               <Label htmlFor="descripcion" className="text-xs font-black uppercase tracking-widest opacity-60">Descripción de la Empresa</Label>
               <Textarea 
                 id="descripcion" 
                 name="descripcion" 
                 defaultValue={initialData?.descripcion || ""} 
                 className="min-h-[150px] rounded-2xl bg-muted/20 border-border/40 p-4 leading-relaxed"
                 placeholder="Cuéntanos sobre tu experiencia, materiales y propuesta de valor..."
               />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <Label htmlFor="telefono" className="text-xs font-black uppercase tracking-widest opacity-60">Teléfono Comercial</Label>
                  <Input 
                    id="telefono" 
                    name="telefono" 
                    defaultValue={initialData?.telefono || ""} 
                    className="h-12 rounded-xl bg-muted/20 border-border/40"
                    placeholder="+56 9 1234 5678"
                  />
               </div>
               
               <div className="space-y-2">
                  <Label htmlFor="direccion" className="text-xs font-black uppercase tracking-widest opacity-60">Oficina / Casa Matriz</Label>
                  <Input 
                    id="direccion" 
                    name="direccion" 
                    defaultValue={initialData?.direccion || ""} 
                    className="h-12 rounded-xl bg-muted/20 border-border/40"
                    placeholder="Av. Kennedy 1234, Santiago"
                  />
               </div>

               <div className="space-y-2">
                  <Label htmlFor="especialidad_principal" className="text-xs font-black uppercase tracking-widest opacity-60">Especialidad Principal</Label>
                  <Input 
                    id="especialidad_principal" 
                    name="especialidad_principal" 
                    defaultValue={initialData?.especialidad_principal || ""} 
                    className="h-12 rounded-xl bg-muted/20 border-border/40"
                    placeholder="Ejem: Casas Modulares, Construcción SIP"
                  />
               </div>

               <div className="space-y-2">
                  <Label htmlFor="anio_inicio" className="text-xs font-black uppercase tracking-widest opacity-60">Año de Fundación</Label>
                  <Input 
                    id="anio_inicio" 
                    name="anio_inicio" 
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    defaultValue={initialData?.anio_inicio || ""} 
                    className="h-12 rounded-xl bg-muted/20 border-border/40"
                    placeholder="Ejem: 2010"
                  />
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/40 shadow-xl overflow-hidden">
           <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                 </div>
                 <h3 className="text-xl font-bold">Cobertura Geográfica</h3>
              </div>
              
              <Separator />

              <div className="space-y-2">
                  <Label htmlFor="regiones" className="text-xs font-black uppercase tracking-widest opacity-60">Regiones donde opera</Label>
                  <RegionesSelector name="regiones" initialValue={initialData?.regiones || []} />
                  <p className="text-[10px] text-muted-foreground italic mt-2">
                    Asegúrate de escribir los nombres correctamente para mejorar tu posicionamiento en los filtros.
                  </p>
               </div>
           </CardContent>
        </Card>
      </div>

      {/* Right Column: Visual, SEO & Status */}
      <div className="space-y-8">
        <Card className="rounded-3xl border-border/40 shadow-xl overflow-hidden">
           <CardContent className="p-8 space-y-8">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center">
                    <ImageIcon className="w-5 h-5" />
                 </div>
                 <h3 className="text-xl font-bold">Imagen de Marca</h3>
              </div>
              
              <Separator />

              <div className="space-y-8">
                 <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">Logo de la Empresa</Label>
                    <div 
                      onClick={() => logoInputRef.current?.click()}
                      className="w-32 h-32 rounded-3xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden relative group cursor-pointer hover:border-primary/40 transition-colors"
                    >
                      {logoPreview || initialData?.logo_url ? (
                         <img src={logoPreview || initialData.logo_url} className="w-full h-full object-contain p-2" alt="Logo preview" />
                      ) : (
                         <span className="text-muted-foreground text-[10px] font-bold text-center p-4 text-balance">Subir Logo</span>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <ImageIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <input 
                      ref={logoInputRef}
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setLogoFile(file);
                          setLogoPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                 </div>

                 <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest opacity-40">Imagen de Portada (Banner)</Label>
                    <div 
                      onClick={() => imageInputRef.current?.click()}
                      className="w-full h-32 rounded-3xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden relative group cursor-pointer hover:border-primary/40 transition-colors"
                    >
                      {imagePreview || initialData?.image_url ? (
                         <img src={imagePreview || initialData.image_url} className="w-full h-full object-cover" alt="Cover preview" />
                      ) : (
                         <div className="flex flex-col items-center gap-2">
                            <ImageIcon className="w-6 h-6 text-muted-foreground opacity-40" />
                            <span className="text-muted-foreground text-[10px] font-bold">Subir Banner de Portada</span>
                         </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <ImageIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <input 
                      ref={imageInputRef}
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImageFile(file);
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                    <p className="text-[10px] text-muted-foreground leading-tight italic">
                       Se recomienda una imagen panorámica de tus proyectos terminados.
                    </p>
                 </div>
              </div>
           </CardContent>
        </Card>

        {/* SEO Card — Pro/Premium only */}
        {(initialData?.plan === 'pro' || initialData?.plan === 'premium') && (
          <Card className="rounded-3xl border-border/40 shadow-xl overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">SEO de la Empresa</h3>
                  <p className="text-xs text-muted-foreground">Cómo aparece tu empresa en Google</p>
                </div>
                <Badge className="ml-auto bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-widest">{initialData?.plan?.toUpperCase()}</Badge>
              </div>

              <Separator />

              <SEOPanel
                initialTitle={initialData?.seo_title || ""}
                initialDescription={initialData?.seo_description || ""}
                initialKeywords={initialData?.seo_keywords || []}
                modelName={initialData?.nombre || ""}
                modelSlug={`constructora/${initialData?.slug || ""}`}
              />
            </CardContent>
          </Card>
        )}

        {/* Action Card */}
        <Card className="rounded-3xl border-primary bg-primary text-white shadow-2xl shadow-primary/20 p-8 space-y-6">
           <div className="space-y-2">
              <h4 className="font-bold text-lg">Guardar Cambios</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                 Toda la información se actualizará instantáneamente en el catálogo público de SolocasasChile.
              </p>
           </div>
           
           {message && (
             <div className={`p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-500 ${message.type === 'success' ? 'bg-white/20 text-white' : 'bg-red-500/20 text-red-100'}`}>
                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                <p className="text-xs font-bold">{message.text}</p>
             </div>
           )}

           <Button 
             type="submit" 
             disabled={loading}
             className="w-full py-7 rounded-2xl bg-white text-primary hover:bg-slate-100 font-black uppercase tracking-widest transition-all hover:scale-[1.02] shadow-xl"
           >
             {loading ? "Guardando..." : "Sincronizar Perfil"}
             <Save className="w-4 h-4 ml-3" />
           </Button>

           <div className="pt-4 text-center">
              <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">
                 Sesión iniciada como: {userEmail}
              </p>
           </div>
        </Card>
      </div>
    </form>
  );
}
