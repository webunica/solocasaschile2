"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, CheckCircle2, User, Mail, 
  Phone, MessageSquare, Loader2, Lock, Zap 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

export function HeroLeadForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const leadData = {
      nombre_cliente: formData.get("name") as string,
      email_cliente: formData.get("email") as string,
      telefono_cliente: formData.get("phone") as string,
      mensaje: formData.get("message") as string,
    };

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase
        .from("leads")
        .insert([leadData]);

      if (insertError) throw insertError;

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      console.error("Lead submission error:", err);
      setError("Hubo un problema al enviar tu consulta. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-6">
           <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black font-heading tracking-tight mb-3">¡Consulta enviada!</h3>
        <p className="text-muted-foreground font-medium max-w-xs mb-8">
          Gracias por contactarnos. Un especialista se comunicará contigo a la brevedad.
        </p>
        <Button 
          variant="outline" 
          className="rounded-xl h-12 px-8 font-bold border-border"
          onClick={() => setSuccess(false)}
        >
          Enviar otra consulta
        </Button>
      </motion.div>
    );
  }

  return (
    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-1">
          <label className="form-label">Tu Nombre</label>
          <div className="relative group/input w-full">
             <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-indigo group-focus-within/input:scale-110 transition-all" />
             <Input 
                name="name" 
                placeholder="Nombre y Apellido" 
                className="form-input-premium pl-14" 
                required 
             />
          </div>
        </div>
        <div className="space-y-1">
          <label className="form-label">WhatsApp</label>
          <div className="relative group/input w-full">
             <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-indigo group-focus-within/input:scale-110 transition-all" />
             <Input 
                name="phone" 
                type="tel" 
                placeholder="+56 9 1234 5678" 
                className="form-input-premium pl-14" 
                required 
             />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="form-label">Email</label>
        <div className="relative group/input w-full">
           <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-indigo group-focus-within/input:scale-110 transition-all" />
           <Input 
              name="email" 
              type="email" 
              placeholder="ejemplo@correo.cl" 
              className="form-input-premium pl-14" 
              required 
           />
        </div>
      </div>

      <div className="space-y-1">
        <label className="form-label">¿Cómo podemos ayudarte?</label>
        <div className="relative group/input w-full">
           <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-indigo group-focus-within/input:scale-110 transition-all" />
           <Input 
              name="message" 
              placeholder="Cuéntanos sobre tu proyecto o duda" 
              className="form-input-premium pl-14" 
              required 
           />
        </div>
      </div>

      {error && (
        <motion.p 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-base font-bold text-destructive flex items-center gap-2 bg-destructive/5 p-4 rounded-xl border border-destructive/10"
        >
           <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
           {error}
        </motion.p>
      )}

      <Button 
        type="submit" 
        size="lg" 
        disabled={loading}
        className="w-full bg-brand-indigo font-black text-white h-14 md:h-16 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95 group overflow-hidden relative"
      >
        {/* Shine effect */}
        <div className="absolute inset-0 -translate-x-[150%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />

        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin relative z-10" />
        ) : (
          <div className="flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap relative z-10 w-full px-2">
            <span className="text-sm md:text-base">SOLICITAR ASESORÍA EXPERTA</span>
            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        )}
      </Button>

      <div className="flex flex-col items-center gap-2.5 pt-3">
         <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 opacity-60 text-brand-indigo" /> Tus datos están 100% seguros
         </p>
         <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-1.5 rounded-full">
            <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/20" />
            <p className="text-[10px] text-center text-emerald-700 font-black uppercase tracking-[0.15em]">
               Respuesta profesional garantizada
            </p>
         </div>
      </div>
    </form>
  );
}
