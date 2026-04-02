"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle2, Loader2, Mail, Send, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createLead } from "@/lib/supabase/client-services"; 
import { toast } from "sonner";

interface Props {
  modeloId: string;
  modeloNombre: string;
  constructoraId: string;
  currentPrice: number;
}

export function PriceNotify({ modeloId, modeloNombre, constructoraId, currentPrice }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await createLead({
        modelo_id: /^[0-9a-fA-F-]{36}$/.test(modeloId) ? modeloId : null,
        constructora_id: /^[0-9a-fA-F-]{36}$/.test(constructoraId) ? constructoraId : null,
        nombre_cliente: "Interesado en Descuento",
        email_cliente: email,
        telefono_cliente: "",
        mensaje: `[ALERTA PRECIO] Suscripción para alerta de baja de precio de ${modeloNombre}. Precio actual: ${currentPrice} UF`,
      });

      if (error) throw error;

      setSuccess(true);
      toast.success("¡Perfecto! Te avisaremos apenas el precio baje.");
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setEmail("");
      }, 3000);
    } catch (err) {
      toast.error("Hubo un error al registrar tu suscripción.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-full group flex items-center justify-between p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 hover:bg-emerald-500/10 transition-all text-left overflow-hidden relative"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
             <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                   <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                   <p className="font-black text-[10px] uppercase tracking-widest text-emerald-600 leading-none mb-1">Oportunidad Única</p>
                   <p className="text-base font-bold text-foreground leading-none tracking-tight">¡Avísame si baja de precio!</p>
                </div>
             </div>
             <Bell className="w-5 h-5 text-emerald-500 opacity-20 group-hover:opacity-100 group-hover:rotate-12 transition-all" />
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border-2 border-emerald-500/20 rounded-3xl p-6 shadow-xl shadow-emerald-500/5 space-y-4"
          >
            {success ? (
              <div className="text-center py-4 space-y-4">
                 <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                 </div>
                 <p className="text-base font-black text-emerald-600 uppercase tracking-widest">¡Suscripción Exitosa!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                   <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Alerta de Ahorro</p>
                      <button 
                        type="button" 
                        onClick={() => setIsOpen(false)}
                        className="text-[10px] font-bold text-muted-foreground hover:text-foreground"
                      >
                         Cancelar
                      </button>
                   </div>
                   <p className="text-base font-medium text-muted-foreground leading-relaxed italic">
                      Déjanos tu correo y nuestro sistema te notificará automáticamente cuando este modelo tenga un descuento.
                   </p>
                </div>

                <div className="relative group/input">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within/input:text-emerald-500 transition-colors" />
                   <Input 
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 pl-12 rounded-xl border-emerald-500/10 bg-emerald-500/5 focus:ring-emerald-500/20 font-bold text-base"
                   />
                </div>

                <Button 
                   type="submit" 
                   disabled={loading}
                   className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                >
                   {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Activar Alerta de Precio</>}
                </Button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
