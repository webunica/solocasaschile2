"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateSettings } from "@/lib/supabase/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, MapPin,
  Image as ImageIcon, Save, CheckCircle2, AlertCircle, Video,
  Search, Plus, Trash2, Star, MessageSquare, Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SEOPanel } from "@/components/dashboard/seo-panel";
import { RegionesSelector } from "@/components/dashboard/regiones-selector";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Testimonio {
  nombre: string;
  texto: string;
  cargo: string;
  estrellas: number;
  modelo_id?: string;
}

interface ModelOption {
  id: string;
  nombre: string;
}

interface ConstructoraSettings {
  nombre?: string | null;
  razon_social?: string | null;
  rut?: string | null;
  sitio_web?: string | null;
  email?: string | null;
  plan?: string | null;
  video_url?: string | null;
  descripcion?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  especialidad_principal?: string | null;
  anio_inicio?: number | string | null;
  regiones?: string[] | null;
  testimonios?: Testimonio[] | null;
  logo_url?: string | null;
  image_url?: string | null;
  slug?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
}

interface Props {
  initialData: ConstructoraSettings | null;
  userEmail: string | undefined;
  models: ModelOption[];
}

function TestimoniosSelector({ name, initialValue = [], models }: { name: string; initialValue?: Testimonio[]; models: ModelOption[] }) {
  const [testimonios, setTestimonios] = useState<Testimonio[]>(initialValue || []);

  const addTestimonio = () => {
    setTestimonios([...testimonios, { nombre: "", texto: "", cargo: "", estrellas: 5, modelo_id: "general" }]);
  };

  const removeTestimonio = (index: number) => {
    setTestimonios(testimonios.filter((_, i) => i !== index));
  };

  const updateTestimonio = (index: number, field: keyof Testimonio, value: string | number) => {
    setTestimonios((current) =>
      current.map((testimonio, currentIndex) =>
        currentIndex === index ? { ...testimonio, [field]: value } : testimonio
      )
    );
  };

  return (
    <div className="space-y-6">
      <input type="hidden" name={name} value={JSON.stringify(testimonios)} />
      
      {testimonios.map((t, index) => (
        <div key={index} className="p-6 bg-muted/20 border border-border/40 rounded-2xl space-y-4 relative group">
          <button 
            type="button" 
            onClick={() => removeTestimonio(index)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-60">Nombre del Cliente</Label>
              <Input 
                value={t.nombre} 
                onChange={(e) => updateTestimonio(index, "nombre", e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="h-10 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-60">Cargo / Ubicación</Label>
              <Input 
                value={t.cargo} 
                onChange={(e) => updateTestimonio(index, "cargo", e.target.value)}
                placeholder="Ej: Propietario en Colina"
                className="h-10 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-60">Testimonio</Label>
              <Textarea 
                value={t.texto} 
                onChange={(e) => updateTestimonio(index, "texto", e.target.value)}
                placeholder="¿Qué dijo el cliente sobre su experiencia?"
                className="min-h-[80px] rounded-xl resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase opacity-60">Asignar a Modelo</Label>
                <select 
                  className="w-full h-10 px-3 rounded-xl bg-background border border-border text-xs font-bold focus:ring-1 focus:ring-primary/20 outline-none"
                  value={t.modelo_id || "general"}
                  onChange={(e) => updateTestimonio(index, "modelo_id", e.target.value)}
                >
                  <option value="general">General (Toda la constructora)</option>
                  {models.map(m => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase opacity-60 block mb-2">Valoración</Label>
                <div className="flex gap-1 h-10 items-center">
                  {[1,2,3,4,5].map(star => (
                    <button 
                      key={star} 
                      type="button" 
                      onClick={() => updateTestimonio(index, "estrellas", star)}
                    >
                      <Star className={cn("w-4 h-4", t.estrellas >= star ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <Button 
        type="button" 
        variant="outline" 
        onClick={addTestimonio}
        className="w-full h-12 border-dashed rounded-xl flex items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all"
      >
        <Plus className="w-4 h-4" /> Agregar Testimonio
      </Button>
    </div>
  );
}

const SISTEMAS_CONSTRUCTIVOS = [
  "Casas Prefabricadas",
  "Casas Modulares",
  "Paneles SIP",
  "Steel Framing (Metalcon)",
  "Construcción en Madera",
  "Hormigón y Tradicional",
  "Casas Container",
  "Construcción Llave en Mano",
  "Tiny Houses y Cabañas",
  "Casas Sociales y Subsidios",
];

export function SettingsForm({ initialData, userEmail, models }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [especialidad, setEspecialidad] = useState(initialData?.especialidad_principal || "");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const logoSrc = logoPreview || initialData?.logo_url || null;
  const imageSrc = imagePreview || initialData?.image_url || null;

  function validateRut(rut: string) {
    if (!rut) return true; // Optional field in some contexts, but if provided, validate it
    const cleanRut = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
    if (cleanRut.length < 8) return false;

    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);

    if (!body.match(/^[0-9]+$/)) return false;

    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const expectedDv = 11 - (sum % 11);
    const dvChar = expectedDv === 11 ? "0" : expectedDv === 10 ? "K" : expectedDv.toString();

    return dvChar === dv;
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    // Validate RUT if provided
    const rut = formData.get("rut") as string;
    if (rut && !validateRut(rut)) {
      toast.error("El RUT ingresado no es válido. Revisa el dígito verificador.");
      setMessage({ type: "error", text: "El RUT ingresado no es válido. Revisa el dígito verificador." });
      setLoading(false);
      return;
    }

    const toastId = toast.loading("Guardando y sincronizando ficha de la constructora...");
    
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
      toast.success("¡Configuración guardada y sincronizada correctamente!", { id: toastId });
      setMessage({ type: "success", text: "Configuración guardada y sincronizada correctamente." });
      router.refresh();
    } else {
      toast.error(result.error || "Error al guardar los cambios.", { id: toastId });
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
                  <Label htmlFor="razon_social" className="text-xs font-black uppercase tracking-widest opacity-60">Razón Social (Legal)</Label>
                  <Input 
                    id="razon_social" 
                    name="razon_social" 
                    defaultValue={initialData?.razon_social || ""} 
                    className="h-12 rounded-xl bg-muted/20 border-border/40"
                    placeholder="Ejem: Constructora Master SpA"
                  />
               </div>

               <div className="space-y-2">
                  <Label htmlFor="rut" className="text-xs font-black uppercase tracking-widest opacity-60">RUT Empresa</Label>
                  <Input 
                    id="rut" 
                    name="rut" 
                    defaultValue={initialData?.rut || ""} 
                    className="h-12 rounded-xl bg-muted/20 border-border/40"
                    placeholder="76.123.456-K"
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

                <div className="space-y-2">
                   <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest opacity-60">Email de Contacto</Label>
                   <Input 
                     id="email" 
                     name="email" 
                     type="email"
                     defaultValue={initialData?.email || userEmail || ""} 
                     className="h-12 rounded-xl bg-muted/20 border-border/40 font-bold text-primary"
                     placeholder="contacto@tuempresa.cl"
                   />
                   <p className="text-[10px] text-muted-foreground italic">Este email recibirá todas las cotizaciones por defecto.</p>
                </div>
            
            {(initialData?.plan === 'avanza' || initialData?.plan === 'pro' || initialData?.plan === 'premium') && (
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

               <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="especialidad_principal" className="text-xs font-black uppercase tracking-widest opacity-60">
                      Especialidad Principal / Sistema Constructivo
                    </Label>
                    <span className="text-[10px] text-muted-foreground font-medium">Elige de la lista o escribe tu propia especialidad</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <select
                      aria-label="Seleccionar sistema constructivo"
                      className="h-12 rounded-xl bg-muted/20 border border-border/40 px-3 text-sm font-medium text-foreground focus:ring-1 focus:ring-primary/20 outline-none cursor-pointer"
                      value={SISTEMAS_CONSTRUCTIVOS.includes(especialidad) ? especialidad : (especialidad ? "otro" : "")}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val !== "otro" && val !== "") {
                          setEspecialidad(val);
                        }
                      }}
                    >
                      <option value="">Selecciona tipo de modelo / sistema...</option>
                      {SISTEMAS_CONSTRUCTIVOS.map((sistema) => (
                        <option key={sistema} value={sistema}>
                          {sistema}
                        </option>
                      ))}
                      <option value="otro">Otro Sistema Constructivo (Escribir en el campo)</option>
                    </select>
                    <Input 
                      id="especialidad_principal" 
                      name="especialidad_principal" 
                      value={especialidad}
                      onChange={(e) => setEspecialidad(e.target.value)}
                      className="h-12 rounded-xl bg-muted/20 border-border/40 font-medium"
                      placeholder="Ejem: Casas Modulares, Construcción SIP..."
                    />
                  </div>
                  {/* Selector rápido con chips clickeables */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground mr-1">Rápidos:</span>
                    {["Casas Prefabricadas", "Casas Modulares", "Paneles SIP", "Steel Framing", "Madera", "Llave en Mano"].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setEspecialidad(chip)}
                        className={cn(
                          "text-[11px] px-2.5 py-1 rounded-lg border transition-all font-medium",
                          especialidad === chip
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/40"
                        )}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
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

        {/* Testimonios Section */}
        <Card className="rounded-3xl border-border/40 shadow-xl overflow-hidden">
           <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                 </div>
                 <h3 className="text-xl font-bold">Testimonios de Clientes</h3>
              </div>
              
              <Separator />

              <TestimoniosSelector name="testimonios" initialValue={initialData?.testimonios || []} models={models} />
              
              <p className="text-[10px] text-muted-foreground italic">
                Los testimonios ayudan a construir confianza con potenciales compradores. Se mostrarán en las fichas de tus modelos.
              </p>
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
                      {logoSrc ? (
                         <Image src={logoSrc} alt="Logo preview" fill sizes="128px" className="object-contain p-2" unoptimized />
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
                      {imageSrc ? (
                         <Image src={imageSrc} alt="Cover preview" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" unoptimized />
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
        {(initialData?.plan === 'avanza' || initialData?.plan === 'pro' || initialData?.plan === 'premium') && (
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
             className="w-full py-7 rounded-2xl bg-white text-primary hover:bg-slate-100 font-black uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-95 shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
           >
             {loading ? (
               <>
                 <Loader2 className="w-5 h-5 animate-spin text-primary" />
                 <span>Sincronizando y Guardando...</span>
               </>
             ) : (
               <>
                 <span>Sincronizar Perfil</span>
                 <Save className="w-4 h-4 ml-1" />
               </>
             )}
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
