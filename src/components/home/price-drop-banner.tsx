"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, Bell, Send, CheckCircle2, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HoneypotFields } from "@/components/security/honeypot-fields";
import { toast } from "sonner";

export function PriceDropBanner() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formEl = e.currentTarget;
    const b_website = (formEl.elements.namedItem("b_website") as HTMLInputElement)?.value || "";
    const website = (formEl.elements.namedItem("website") as HTMLInputElement)?.value || "";
    const formTime = Number((formEl.elements.namedItem("_form_time") as HTMLInputElement)?.value) || Date.now();

    try {
      const response = await fetch("/api/leads/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelo_id: null,
          constructora_id: null,
          nombre_cliente: "Suscripción General Precios",
          email_cliente: email,
          telefono_cliente: "+56900000000",
          mensaje: "[ALERTA PRECIO HOME] Suscripción general para alertas de baja de precio desde el home.",
          b_website,
          website,
          _form_time: formTime,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || "No se pudo registrar tu suscripción");

      setSuccess(true);
      toast.success("¡Suscripción exitosa! Te avisaremos de las mejores ofertas.");
    } catch {
      toast.error("Error al registrar tu suscripción.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 md:py-16 bg-slate-50/50 dark:bg-slate-950/40 relative overflow-hidden">
      <div className="container px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-[#03262D] via-[#073E48] to-[#041F25] rounded-[2.5rem] md:rounded-[3rem] p-8 sm:p-12 md:p-16 overflow-hidden shadow-2xl shadow-[#073E48]/25 border border-[#27D8BE]/20 group"
        >
          {/* Subtle Ambient Glows and Architectural Grids */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#27D8BE]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none group-hover:bg-[#27D8BE]/15 transition-colors duration-1000" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#8FFFE0]/10 rounded-full blur-[90px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#27D8BE_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />
          
          <div className="relative z-10 grid lg:grid-cols-[1fr_420px] gap-10 lg:gap-14 items-center">
            {/* Left Column: Heading and explanation */}
            <div className="space-y-6 md:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start">
               <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-4">
                  <Badge className="bg-[#27D8BE]/15 text-[#27D8BE] hover:bg-[#27D8BE]/20 border border-[#27D8BE]/30 py-1.5 px-4 font-bold tracking-widest uppercase rounded-full text-[11px] shadow-xs">
                     <Sparkles className="w-3.5 h-3.5 mr-2 text-[#27D8BE]" /> Nuevo Servicio
                  </Badge>
                  <div className="flex items-center gap-2 text-white/85 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
                     <Bell className="w-3.5 h-3.5 text-[#27D8BE] animate-pulse" /> Alertas en tiempo real
                  </div>
               </div>

               <div className="space-y-4">
                  <h2 className="text-[clamp(2.2rem,6vw,3.75rem)] font-heading font-black tracking-tight text-white leading-[1.05]">
                    ¡Avísame cuando<br />
                    <span className="text-[#27D8BE] inline-flex items-center justify-center lg:justify-start gap-3 mt-1.5">
                      baje de precio! <TrendingDown className="w-8 h-8 md:w-12 md:h-12 shrink-0 text-[#27D8BE]" />
                    </span>
                  </h2>
                  <p className="text-white/80 text-base md:text-lg font-normal max-w-xl leading-relaxed">
                    No te pierdas las mejores oportunidades. Suscríbete para recibir notificaciones exclusivas apenas detectemos una rebaja en tus modelos favoritos de casas prefabricadas y modulares.
                  </p>
               </div>
            </div>

            {/* Right Column: Glassmorphic Email Card */}
            <div className="bg-white/[0.08] backdrop-blur-2xl border border-white/15 p-6 sm:p-8 rounded-[2rem] shadow-2xl relative w-full overflow-hidden">
              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                   <div className="w-16 h-16 rounded-full bg-[#27D8BE]/20 border border-[#27D8BE]/40 flex items-center justify-center mx-auto mb-2 text-[#27D8BE] shadow-lg shadow-[#27D8BE]/10">
                      <CheckCircle2 className="w-8 h-8" />
                   </div>
                   <h3 className="text-white font-black text-xl tracking-tight">¡Ya estás en la lista!</h3>
                   <p className="text-white/80 text-sm font-medium leading-relaxed">
                     Te avisaremos de inmediato a tu correo cuando tengamos descuentos y bajas de precio en modelos de tu interés.
                   </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <HoneypotFields />
                  <div className="space-y-2.5">
                     <label className="text-[11px] font-bold uppercase tracking-wider text-white/90 block text-left">
                       Tu correo electrónico
                     </label>
                     <Input 
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-13 rounded-xl border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-[#27D8BE] focus:ring-2 focus:ring-[#27D8BE]/30 font-medium text-base shadow-inner"
                     />
                  </div>
                  <Button 
                     type="submit"
                     disabled={loading}
                     className="w-full h-13 bg-[#27D8BE] text-[#073E48] hover:bg-[#8FFFE0] rounded-xl font-black text-sm uppercase tracking-wider shadow-lg shadow-[#27D8BE]/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center cursor-pointer"
                  >
                     {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                     ) : (
                        <span className="flex items-center justify-center gap-2">
                          Suscribirme ahora <Send className="w-4 h-4 ml-1" />
                        </span>
                     )}
                  </Button>
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/60 font-medium tracking-wide">
                     <ShieldCheck className="w-3.5 h-3.5 text-[#27D8BE]/80 shrink-0" />
                     <span>Sin spam · Respetamos tu privacidad · Cancela cuando quieras</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
