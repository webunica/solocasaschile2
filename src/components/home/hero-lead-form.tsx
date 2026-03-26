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
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Constructora</label>
          <div className="relative">
             <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-60" />
             <Input 
                name="company" 
                placeholder="Nombre de empresa" 
                className="bg-background/40 border-border/40 pl-11 h-12 rounded-xl focus:bg-background transition-all" 
                required 
             />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Contacto</label>
          <div className="relative">
             <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-60" />
             <Input 
                name="name" 
                placeholder="Tu nombre completo" 
                className="bg-background/40 border-border/40 pl-11 h-12 rounded-xl focus:bg-background transition-all" 
                required 
             />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Email Corporativo</label>
          <div className="relative">
             <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-60" />
             <Input 
                name="email" 
                type="email" 
                placeholder="correo@empresa.cl" 
                className="bg-background/40 border-border/40 pl-11 h-12 rounded-xl focus:bg-background transition-all" 
                required 
             />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Teléfono</label>
          <div className="relative">
             <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-60" />
             <Input 
                name="phone" 
                type="tel" 
                placeholder="+56 9 ..." 
                className="bg-background/40 border-border/40 pl-11 h-12 rounded-xl focus:bg-background transition-all" 
                required 
             />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Mensaje o Interés</label>
        <div className="relative">
           <MessageSquare className="absolute left-3.5 top-4 w-4 h-4 text-primary opacity-60" />
           <Textarea 
              name="message" 
              placeholder="Cuéntanos sobre tus requerimientos..." 
              className="bg-background/40 border-border/40 pl-11 min-h-[120px] rounded-2xl focus:bg-background transition-all resize-none p-4" 
              required 
           />
        </div>
      </div>

      {error && (
        <p className="text-xs font-bold text-destructive flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
           {error}
        </p>
      )}

      <Button 
        type="submit" 
        size="lg" 
        disabled={loading}
        className="w-full brand-gradient hover:opacity-95 font-black h-14 rounded-2xl shadow-xl shadow-primary/10 tracking-widest group transition-all"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            ENVIAR SOLICITUD DE DATOS
            <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </Button>
    </form>
  );
}
