"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, Users, Send, CheckCircle2, 
  AlertCircle, Smartphone, Eye, History,
  Loader2, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { sendBulkEmail } from "@/lib/supabase/actions";
import { toast } from "sonner";

export function EmailBulkForm() {
  const [loading, setLoading] = useState(false);
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [audiencia, setAudiencia] = useState("todos");
  const [previewMode, setPreviewMode] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!asunto || !mensaje) return toast.error("Completa todos los campos");

    const ok = confirm(`¿Estás seguro de enviar este mensaje a todas las constructoras con plan ${audiencia.toUpperCase()}?`);
    if (!ok) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("asunto", asunto);
    formData.append("mensaje", mensaje);
    formData.append("audiencia", audiencia);

    const result = await sendBulkEmail(formData);
    setLoading(false);

    if (result.success) {
      toast.success(`¡Mensaje enviado con éxito a ${result.count} destinatarios!`);
      setAsunto("");
      setMensaje("");
    } else {
      toast.error(result.error || "Error al enviar el mensaje");
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* Form Side */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-card border border-border/50 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/[0.02] space-y-8"
      >
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Mail className="w-6 h-6" />
           </div>
           <div>
              <h2 className="text-2xl font-heading font-black tracking-tight">Nueva Comunicación</h2>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60">Envío masivo vía Resend</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
             <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Para (Audiencia Seleccionada)</Label>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['todos', 'gratis', 'pro', 'premium'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAudiencia(opt)}
                    className={cn(
                      "h-10 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                      audiencia === opt 
                        ? "brand-gradient text-white border-transparent shadow-lg shadow-primary/20" 
                        : "bg-muted/30 border-border/40 text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    {opt}
                  </button>
                ))}
             </div>
          </div>

          <div className="space-y-3">
             <Label htmlFor="asunto" className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Asunto del Correo</Label>
             <Input 
                id="asunto"
                placeholder="Ej: Nuevas actualizaciones en tu catálogo..."
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                className="h-14 rounded-2xl bg-muted/20 border-border/40 focus:border-primary/40 font-bold"
             />
          </div>

          <div className="space-y-3">
             <Label htmlFor="mensaje" className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Mensaje (Soporta salto de línea)</Label>
             <Textarea 
                id="mensaje"
                placeholder="Escribe aquí el mensaje central para las empresas..."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                className="min-h-[200px] rounded-[2rem] bg-muted/20 border-border/40 focus:border-primary/40 p-6 resize-none font-medium leading-relaxed"
             />
          </div>

          <Button 
            disabled={loading}
            className="w-full h-16 rounded-2xl brand-gradient text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-transform active:scale-95"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <span className="flex items-center gap-2">
                Disparar Envío Masivo <Send className="w-4 h-4" />
              </span>
            )}
          </Button>

          <p className="text-[10px] text-center text-muted-foreground font-medium italic opacity-60">
            * El correo se enviará desde envios@solocasaschile.com usando copia oculta (BCC).
          </p>
        </form>
      </motion.div>

      {/* Preview Side (Mobile Mockup) */}
      <div className="sticky top-24 hidden lg:flex flex-col items-center">
        <div className="mb-6 flex items-center gap-3 bg-muted/30 p-1 rounded-full border border-border/40">
           <button 
             onClick={() => setPreviewMode(true)}
             className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all", previewMode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")}
           >
              Mobile Preview
           </button>
           <button 
             onClick={() => setPreviewMode(false)}
             className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all", !previewMode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")}
           >
              Raw HTML View
           </button>
        </div>

        <div className="relative w-[320px] h-[640px] bg-zinc-900 rounded-[3rem] p-3 shadow-[0_0_0_8px_#18181b,0_20px_50px_rgba(0,0,0,0.3)] border-[2px] border-zinc-800">
           {/* Mobile Top Bar */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-b-2xl z-20 flex items-center justify-center">
              <div className="w-10 h-1 bg-zinc-800 rounded-full" />
           </div>

           <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden flex flex-col">
              <div className="bg-[#1a1b26] p-6 text-center">
                 <h1 className="text-white text-lg font-black tracking-tight m-0">SolocasasChile</h1>
              </div>
              <div className="flex-1 p-6 overflow-y-auto whitespace-pre-line text-sm text-zinc-700 leading-relaxed">
                 {asunto && <div className="font-black text-zinc-900 border-b border-zinc-100 pb-3 mb-4">{asunto}</div>}
                 {mensaje || "Tu mensaje aparecerá aquí..."}
              </div>
              <div className="bg-zinc-50 p-4 text-center border-t border-zinc-100">
                 <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Enviado por SolocasasChile.com</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
