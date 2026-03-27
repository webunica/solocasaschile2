"use client";

import { useState } from "react";
import { updateSettings } from "@/lib/supabase/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, Phone, Globe, MapPin, 
  Image as ImageIcon, Save, CheckCircle2, AlertCircle 
} from "lucide-react";

interface Props {
  initialData: any;
  userEmail: string | undefined;
}

export function SettingsForm({ initialData, userEmail }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);
    
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
                  <Label htmlFor="regiones" className="text-xs font-black uppercase tracking-widest opacity-60">Regiones donde opera (Separadas por coma)</Label>
                  <Input 
                    id="regiones" 
                    name="regiones" 
                    defaultValue={initialData?.regiones?.join(", ") || ""} 
                    className="h-12 rounded-xl bg-muted/20 border-border/40"
                    placeholder="Metropolitana, Valparaiso, Biobio..."
                  />
                  <p className="text-[10px] text-muted-foreground italic mt-2">
                    Asegúrate de escribir los nombres correctamente para mejorar tu posicionamiento en los filtros.
                  </p>
               </div>
           </CardContent>
        </Card>
      </div>

      {/* Right Column: Visual & Status */}
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

              <div className="space-y-4">
                 <div className="w-32 h-32 rounded-3xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden relative group cursor-pointer hover:border-primary/40 transition-colors">
                    {initialData?.logo_url ? (
                       <img src={initialData.logo_url} className="w-full h-full object-contain p-2" alt="Logo preview" />
                    ) : (
                       <span className="text-muted-foreground text-[10px] font-bold text-center p-4">Subir Logo (URL)</span>
                    )}
                 </div>
                 
                 <div className="space-y-2">
                    <Label htmlFor="logo_url" className="text-xs font-black uppercase tracking-widest opacity-60">URL del Logo</Label>
                    <Input 
                      id="logo_url" 
                      name="logo_url" 
                      defaultValue={initialData?.logo_url || ""} 
                      className="h-10 rounded-lg text-xs"
                      placeholder="https://imgur.com/logo.png"
                    />
                 </div>
              </div>
           </CardContent>
        </Card>

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
