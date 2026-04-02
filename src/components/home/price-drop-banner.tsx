"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, Bell, Send, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { createLead } from "@/lib/supabase/client-services";
import { toast } from "sonner";

export function PriceDropBanner() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await createLead({
        modelo_id: null,
        constructora_id: null,
        nombre_cliente: "Suscripción General Precios",
        email_cliente: email,
        telefono_cliente: "",
        mensaje: "[ALERTA PRECIO HOME] Suscripción general para alertas de baja de precio desde el home.",
      });

      if (error) throw error;

      setSuccess(true);
      toast.success("¡Suscripción exitosa! Te avisaremos de las mejores ofertas.");
    } catch (err) {
      toast.error("Error al registrar tu suscripción.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 bg-background relative overflow-hidden">
      <div className="container px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-emerald-600 rounded-[3rem] p-10 md:p-16 overflow-hidden shadow-2xl shadow-emerald-600/20 group"
        >
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-white/20 transition-colors duration-1000" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-400/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10 grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-16 items-center">
            <div className="space-y-10 lg:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start">
               <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6">
                  <Badge className="bg-white/20 text-white border-none py-1.5 px-4 font-bold tracking-widest uppercase rounded-full w-fit">
                     <Sparkles className="w-3 h-3 mr-2 text-emerald-200" /> Nuevo Servicio
                  </Badge>
                  <div className="flex items-center gap-2 text-white/70 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                     <Bell className="w-3.5 h-3.5 animate-bounce" /> Alertas en tiempo real
                  </div>
               </div>

               <div className="space-y-6 lg:space-y-4">
                  <h2 className="text-[clamp(2rem,8vw,4rem)] lg:text-6xl font-heading font-black tracking-tighter text-white leading-[0.95] lg:leading-[0.9]">
                    ¡Avísame cuando<br />
                    <span className="text-emerald-200 flex items-center justify-center lg:justify-start gap-4 mt-2">
                      baje de precio! <TrendingDown className="w-10 h-10 md:w-16 md:h-16 shrink-0" />
                    </span>
                  </h2>
                  <p className="text-emerald-50/80 text-base md:text-xl font-medium max-w-xl leading-relaxed">
                    No te pierdas las mejores oportunidades. Suscríbete para recibir notificaciones exclusivas apenas detectemos una rebaja en tus modelos favoritos.
                  </p>
               </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-10 rounded-[2.5rem] shadow-2xl relative w-full lg:w-auto overflow-hidden">
              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-4"
                >
                   <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                   </div>
                   <h3 className="text-white font-black text-xl uppercase tracking-tighter">¡Ya estás en lista!</h3>
                   <p className="text-emerald-50 text-sm font-medium">Te notificaremos ante cualquier novedad.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                     <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-emerald-200 opacity-60 text-center lg:text-left">Tu correo electrónico</p>
                     <Input 
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-14 rounded-2xl border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:ring-white/40 font-bold text-base md:text-lg"
                     />
                  </div>
                  <Button 
                     type="submit"
                     disabled={loading}
                     className="w-full h-15 bg-white text-emerald-700 hover:bg-emerald-50 rounded-2xl font-black text-sm uppercase tracking-wider shadow-xl shadow-brand-indigo/10 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center p-4"
                  >
                     {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                     ) : (
                        <span className="flex items-center justify-center gap-3">
                          Suscribirme ahora <Send className="w-4 h-4" />
                        </span>
                     )}
                  </Button>
                  <p className="text-[9px] text-white/40 text-center font-bold uppercase tracking-widest leading-relaxed">
                     Respetamos tu privacidad · Sin spam · Cancela cuando quieras
                  </p>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
