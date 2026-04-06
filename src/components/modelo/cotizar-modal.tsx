"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Send, User, Mail, Phone, 
  MessageSquare, Loader2, Lock, Zap, 
  CheckCircle2, MapPin, LandPlot 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { submitLead } from "@/lib/supabase/actions";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const REGIONES = [
  "XV - Arica y Parinacota",
  "I - Tarapacá",
  "II - Antofagasta",
  "III - Atacama",
  "IV - Coquimbo",
  "V - Valparaíso",
  "RM - Metropolitana de Santiago",
  "VI - O'Higgins",
  "VII - Maule",
  "XVI - Ñuble",
  "VIII - Biobío",
  "IX - La Araucanía",
  "XIV - Los Ríos",
  "X - Los Lagos",
  "XI - Aysén",
  "XII - Magallanes"
];

interface CotizarModalProps {
  modeloId: string;
  modeloNombre: string;
  constructoraId: string;
  constructoraNombre: string;
  trigger?: React.ReactNode;
}

export function CotizarModal({ 
  modeloId, 
  modeloNombre, 
  constructoraId, 
  constructoraNombre,
  trigger
}: CotizarModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [terreno, setTerreno] = useState<string>("si");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const leadData = {
      nombre_cliente: formData.get("name") as string,
      email_cliente: formData.get("email") as string,
      telefono_cliente: formData.get("phone") as string,
      mensaje: `[COTIZACIÓN MODELO: ${modeloNombre}] - Region: ${formData.get("region")} - Terreno: ${terreno}. Mensaje: ${formData.get("message")}`,
      modelo_id: modeloId,
      constructora_id: constructoraId,
      modelo_nombre: modeloNombre,
      constructora_nombre: constructoraNombre,
    };

    try {
      const { error: submitError, success: submitSuccess } = await submitLead(leadData as any);

      if (submitError) throw new Error(submitError);
      
      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error("Lead submission error:", err);
      setError("Hubo un problema al enviar tu consulta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger || (
          <Button size="lg" variant="secondary" className="font-black rounded-2xl w-full h-16 shadow-xl shadow-brand-teal/20">
            SOLICITAR COTIZACIÓN
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-3xl bg-background">
        <div className="absolute top-0 left-0 right-0 h-2 bg-brand-indigo" />
        
        {success ? (
          <div className="p-12 text-center flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
             <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-8">
                <CheckCircle2 className="w-12 h-12" />
             </div>
             <h2 className="text-3xl font-black tracking-tight mb-4 text-foreground">¡Solicitud recibida!</h2>
             <p className="text-muted-foreground font-medium mb-0">
               Hemos enviado tu solicitud a {constructoraNombre}. <br /> Te contactarán a la brevedad.
             </p>
          </div>
        ) : (
          <div className="p-8 md:p-10">
            <DialogHeader className="mb-8 p-0 text-left">
              <div className="flex items-center gap-2 mb-2">
                 <span className="text-brand-indigo font-black text-2xl uppercase tracking-tighter">ASESORÍA</span>
                 <span className="text-brand-teal font-black text-2xl uppercase tracking-tighter">PROFESIONAL</span>
              </div>
              <DialogDescription className="text-muted-foreground text-sm font-medium leading-relaxed">
                 Cuéntanos sobre tu proyecto para el modelo <span className="text-foreground font-black">{modeloNombre}</span> y recibe atención personalizada.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-indigo opacity-70 ml-1">Tu Nombre</label>
                  <div className="relative group/input">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-indigo/60 group-focus-within/input:text-brand-indigo transition-colors" />
                     <Input 
                        name="name" 
                        placeholder="Nombre y Apellido" 
                        required 
                        className="h-14 pl-12 rounded-2xl bg-muted/10 border-border/30 border-2 font-black text-sm placeholder:text-muted-foreground/40 focus:bg-background transition-all" 
                     />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-indigo opacity-70 ml-1">WhatsApp</label>
                  <div className="relative group/input">
                     <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-indigo/60 group-focus-within/input:text-brand-indigo transition-colors" />
                     <Input 
                        name="phone" 
                        type="tel" 
                        placeholder="+56 9 1234 5678" 
                        required 
                        className="h-14 pl-12 rounded-2xl bg-muted/10 border-border/30 border-2 font-black text-sm placeholder:text-muted-foreground/40 focus:bg-background transition-all" 
                     />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-indigo opacity-70 ml-1">Email</label>
                <div className="relative group/input">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-indigo/60 group-focus-within/input:text-brand-indigo transition-colors" />
                   <Input 
                      name="email" 
                      type="email" 
                      placeholder="ejemplo@correo.cl" 
                      required 
                      className="h-14 pl-12 rounded-2xl bg-muted/10 border-border/30 border-2 font-black text-sm placeholder:text-muted-foreground/40 focus:bg-background transition-all" 
                   />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-indigo opacity-70 ml-1">Región</label>
                    <div className="relative group/input">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-5 h-5 text-brand-indigo/60" />
                       <Select name="region" required>
                          <SelectTrigger className="h-14 pl-12 rounded-2xl bg-muted/10 border-border/30 border-2 font-black text-sm text-left focus:bg-background transition-all">
                             <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-2 border-border/40 shadow-2xl z-[9000] relative">
                             {REGIONES.map(r => (
                               <SelectItem key={r} value={r} className="font-bold py-3 hover:bg-brand-indigo/10">{r}</SelectItem>
                             ))}
                          </SelectContent>
                       </Select>
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-indigo opacity-70 ml-1">¿Tienes Terreno?</label>
                    <div className="flex gap-2 p-1 bg-muted/20 border-2 border-border/30 rounded-2xl h-14">
                       <button 
                          type="button"
                          onClick={() => setTerreno("si")}
                          className={cn(
                             "flex-1 rounded-xl text-[10px] font-black uppercase transition-all",
                             terreno === "si" ? "bg-brand-indigo text-white shadow-lg" : "text-muted-foreground hover:bg-muted/40"
                          )}
                       >
                          SÍ
                       </button>
                       <button 
                          type="button"
                          onClick={() => setTerreno("no")}
                          className={cn(
                             "flex-1 rounded-xl text-[10px] font-black uppercase transition-all",
                             terreno === "no" ? "bg-brand-indigo text-white shadow-lg" : "text-muted-foreground hover:bg-muted/40"
                          )}
                       >
                          NO
                       </button>
                    </div>
                 </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-indigo opacity-70 ml-1">¿Cómo podemos ayudarte?</label>
                <div className="relative group/input">
                   <MessageSquare className="absolute left-4 top-6 w-5 h-5 text-brand-indigo/60" />
                   <Textarea 
                      name="message" 
                      placeholder="Cuéntanos sobre tu proyecto o duda" 
                      required 
                      className="min-h-[100px] pl-12 pt-5 rounded-2xl bg-muted/10 border-border/30 border-2 font-bold text-sm placeholder:text-muted-foreground/40 focus:bg-background transition-all" 
                   />
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                variant="secondary"
                disabled={loading}
                className="w-full font-black h-16 rounded-2xl shadow-xl shadow-brand-teal/20 hover:scale-[1.02] active:scale-95 transition-all group overflow-hidden relative"
              >
                <div className="absolute inset-0 -translate-x-[150%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <div className="flex items-center gap-3">
                    <span>SOLICITAR ASESORÍA EXPERTA</span>
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                )}
              </Button>

              <div className="flex flex-col items-center gap-3 pt-2">
                 <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-brand-indigo/60" /> Tus datos están 100% seguros
                 </p>
                 <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-1.5 rounded-full">
                    <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/20" />
                    <p className="text-[10px] text-emerald-700 font-black uppercase tracking-widest">Respuesta profesional garantizada</p>
                 </div>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
