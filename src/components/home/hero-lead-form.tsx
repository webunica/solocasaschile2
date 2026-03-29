"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Building2, User, Mail, Phone, MessageSquare, Loader2 } from "lucide-react";
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
      mensaje: `[Empresa: ${formData.get("company")}] - ${formData.get("message")}`,
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
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground opacity-60 ml-1">Empresa</label>
          <div className="relative group/input">
             <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-40 group-focus-within/input:opacity-100 transition-opacity" />
             <Input 
                name="company" 
                placeholder="Ej: Constructora Andes" 
                className="bg-muted/50 border-border pl-14 h-14 rounded-2xl focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold placeholder:font-medium placeholder:opacity-50" 
                required 
             />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground opacity-60 ml-1">Tu Nombre</label>
          <div className="relative group/input">
             <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-40 group-focus-within/input:opacity-100 transition-opacity" />
             <Input 
                name="name" 
                placeholder="Nombre y Apellido" 
                className="bg-muted/50 border-border pl-14 h-14 rounded-2xl focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold placeholder:font-medium placeholder:opacity-50" 
                required 
             />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground opacity-60 ml-1">Email</label>
          <div className="relative group/input">
             <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-40 group-focus-within/input:opacity-100 transition-opacity" />
             <Input 
                name="email" 
                type="email" 
                placeholder="ejemplo@correo.cl" 
                className="bg-muted/50 border-border pl-14 h-14 rounded-2xl focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold placeholder:font-medium placeholder:opacity-50" 
                required 
             />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground opacity-60 ml-1">WhatsApp</label>
          <div className="relative group/input">
             <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-40 group-focus-within/input:opacity-100 transition-opacity" />
             <Input 
                name="phone" 
                type="tel" 
                placeholder="+56 9 1234 5678" 
                className="bg-muted/50 border-border pl-14 h-14 rounded-2xl focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold placeholder:font-medium placeholder:opacity-50" 
                required 
             />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground opacity-60 ml-1">Comentarios</label>
        <div className="relative group/input">
           <MessageSquare className="absolute left-4 top-7 w-4 h-4 text-primary opacity-40 group-focus-within/input:opacity-100 transition-opacity" />
           <Textarea 
              name="message" 
              placeholder="¿Cómo podemos ayudarte con tu proyecto?" 
              className="bg-muted/50 border-border pl-16 pt-7 min-h-[140px] rounded-[2rem] focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all resize-none p-5 font-bold placeholder:font-medium placeholder:opacity-50 leading-relaxed" 
              required 
           />
        </div>
      </div>

      {error && (
        <motion.p 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xs font-bold text-destructive/80 flex items-center gap-2 bg-destructive/5 p-4 rounded-xl border border-destructive/10"
        >
           <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
           {error}
        </motion.p>
      )}

      <Button 
        type="submit" 
        size="lg" 
        disabled={loading}
        className="w-full brand-gradient hover:opacity-95 font-black text-white h-14 md:h-16 rounded-2xl shadow-[0_24px_48px_-12px_rgba(var(--primary-rgb),0.3)] tracking-tight xs:tracking-normal md:tracking-[0.2em] text-[10px] sm:text-xs md:text-sm group transition-all px-4"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <div className="flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap">
            <span>SOLICITAR ASESORÍA EXPERTA</span>
            <Send className="w-3.5 h-3.5 md:w-5 md:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
        )}
      </Button>
    </form>
  );
}
