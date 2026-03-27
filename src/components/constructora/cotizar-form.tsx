"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Loader2, Send, 
  User, Mail, Phone, MapPin, MessageSquare 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

interface Props {
  modeloId: string;
  modeloNombre: string;
  constructoraId: string;
  constructoraNombre: string;
}

export function CotizarForm({ modeloId, modeloNombre, constructoraId, constructoraNombre }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const leadData = {
      constructora_id: constructoraId,
      modelo_id: modeloId || null,
      nombre_cliente: (formData.get("name") as string) || "Cliente Anónimo",
      email_cliente: (formData.get("email") as string) || "",
      telefono_cliente: (formData.get("phone") as string) || "No especificado",
      region_cliente: (formData.get("region") as string) || "No especificada",
      mensaje: (formData.get("message") as string) || "",
    };

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase
        .from("leads")
        .insert([leadData]);

      if (insertError) throw insertError;

      setSuccess(true);
    } catch (err: any) {
      console.error("Lead submission error:", err);
      setError("No se pudo enviar la cotización. Revisa tu conexión e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-8 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-6 border-2 border-emerald-500/20">
           <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black font-heading tracking-tight mb-3">¡Solicitud Enviada!</h3>
        <p className="text-[11px] text-muted-foreground font-medium max-w-[240px] leading-relaxed">
          Tu interés por <strong>{modeloNombre}</strong> ha sido notificado a <strong>{constructoraNombre}</strong>.
        </p>
        <div className="mt-8 pt-8 border-t border-border/50 w-full">
           <Button 
             variant="outline" 
             className="w-full rounded-2xl font-black text-[10px] uppercase tracking-widest border-border"
             onClick={() => setSuccess(false)}
           >
             Enviar otra solicitud
           </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Datos de Contacto</label>
        
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-indigo opacity-60" />
          <Input 
            name="name" 
            placeholder="Nombre completo" 
            required 
            className="h-12 bg-muted/30 border-none rounded-xl pl-11 focus:bg-background transition-colors" 
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-indigo opacity-60" />
          <Input 
            name="email" 
            type="email" 
            placeholder="Correo electrónico" 
            required 
            className="h-12 bg-muted/30 border-none rounded-xl pl-11 focus:bg-background transition-colors" 
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-indigo opacity-60" />
            <Input 
              name="phone" 
              placeholder="Teléfono" 
              required
              className="h-12 bg-muted/30 border-none rounded-xl pl-11 focus:bg-background transition-colors" 
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-indigo opacity-60" />
            <Input 
              name="region" 
              placeholder="Región" 
              required
              className="h-12 bg-muted/30 border-none rounded-xl pl-11 focus:bg-background transition-colors" 
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Mensaje Adicional</label>
        <div className="relative">
          <MessageSquare className="absolute left-3.5 top-4 w-4 h-4 text-brand-indigo opacity-60" />
          <Textarea 
            name="message" 
            placeholder="Dudas sobre terreno, terminaciones o plazos..." 
            className="bg-muted/30 border-none rounded-2xl min-h-[120px] pr-4 pt-4 pb-4 pl-12 focus:bg-background transition-colors" 
          />
        </div>
      </div>

      {error && (
        <p className="text-[10px] font-bold text-destructive flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
           {error}
        </p>
      )}

      <Button 
        type="submit" 
        size="lg" 
        disabled={loading}
        className="w-full h-14 rounded-2xl brand-gradient font-black text-[10px] tracking-[0.2em] shadow-xl shadow-primary/20 hover:opacity-95 transition-all group"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            SOLICITAR ASESORÍA GRATIS
            <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </>
        )}
      </Button>

      <p className="text-[9px] text-center text-muted-foreground font-black uppercase tracking-widest opacity-40 py-2">
        Sin compromisos · Gestión Directa
      </p>
    </form>
  );
}
