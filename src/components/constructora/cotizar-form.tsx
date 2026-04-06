"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Loader2, Send, 
  User, Mail, Phone, MapPin, MessageSquare,
  Lock, Clock, Zap
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

const REGIONES_CHILE = [
  "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo", 
  "Valparaíso", "Metropolitana de Santiago", "O'Higgins", "Maule", 
  "Ñuble", "Biobío", "La Araucanía", "Los Ríos", "Los Lagos", 
  "Aysén", "Magallanes"
];

export function CotizarForm({ modeloId, modeloNombre, constructoraId, constructoraNombre }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    // Validación de seguridad para evitar errores de UUID con IDs de prueba (como "c2")
    const isMockId = !/^[0-9a-fA-F-]{36}$/.test(constructoraId);
    
    if (isMockId) {
      // Si es un ID de prueba (mock), simulamos el éxito localmente para no romper la experiencia
      console.warn("[Modo Demo] La solicitud no se guardó porque estás en un perfil de prueba.");
      setSuccess(true);
      setLoading(false);
      return;
    }

    const leadData = {
      constructora_id: constructoraId,
      modelo_id: /^[0-9a-fA-F-]{36}$/.test(modeloId) ? modeloId : null,
      nombre_cliente: (formData.get("name") as string) || "Cliente Anónimo",
      email_cliente: (formData.get("email") as string) || "",
      telefono_cliente: (formData.get("phone") as string) || "No especificado",
      mensaje: `[Región: ${formData.get("region") || "No especificada"}]\n[Terreno: ${formData.get("terreno") || "No especificado"}]\n[Interés: ${formData.get("interes") || "No especificado"}]\n[Superficie: ${formData.get("superficie") || "No especificado"}]\n\n${(formData.get("message") as string) || ""}`,
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
      setError(err.message || "No se pudo enviar la cotización. Revisa tu conexión e intenta de nuevo.");
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
             className="w-full rounded-2xl font-black text-sm uppercase tracking-widest border-border hover:bg-emerald-500/5 transition-colors"
             onClick={() => setSuccess(false)}
           >
             Cotizar otro proyecto
           </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-500/20 text-white relative overflow-hidden group/form">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10 space-y-8">
        <div className="text-center space-y-3">
          <h3 className="text-xl md:text-2xl font-black font-heading tracking-tight leading-loose">¿Listo para cotizar tu casa?</h3>
          <p className="text-white/70 text-[10px] md:text-xs font-bold uppercase tracking-[0.1em]">
            Recibe una propuesta personalizada en menos de 24 horas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Región y Terreno Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 px-1">Región</label>
                <select 
                  name="region" 
                  defaultValue=""
                  required
                  className="w-full h-14 rounded-2xl bg-white/10 border border-white/20 text-white px-4 font-bold text-sm focus:bg-white focus:text-indigo-900 transition-all cursor-pointer outline-none"
                >
                  <option value="" disabled className="text-indigo-900">Selecciona tu región</option>
                  {REGIONES_CHILE.map(r => (
                    <option key={r} value={r} className="text-indigo-900 font-medium">{r}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 px-1">¿Tienes terreno?</label>
                <div className="flex bg-white/10 rounded-2xl p-1 h-12">
                   <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer rounded-xl hover:bg-white/5 transition-all text-xs font-black has-[:checked]:bg-white has-[:checked]:text-indigo-700">
                      <input type="radio" name="terreno" value="Sí" className="hidden" defaultChecked />
                      <span>SÍ</span>
                   </label>
                   <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer rounded-xl hover:bg-white/5 transition-all text-xs font-black has-[:checked]:bg-white has-[:checked]:text-indigo-700">
                      <input type="radio" name="terreno" value="No" className="hidden" />
                      <span>NO</span>
                   </label>
                </div>
              </div>
            </div>

            {/* Inputs Principales */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input 
                name="name" 
                placeholder="Nombre" 
                required 
                className="h-14 rounded-2xl bg-white border-transparent text-indigo-900 px-5 font-bold text-sm placeholder:text-indigo-400 focus:ring-4 focus:ring-brand-indigo/30 transition-all"
              />
              <input 
                name="phone" 
                placeholder="Teléfono" 
                required
                className="h-14 rounded-2xl bg-white border-transparent text-indigo-900 px-5 font-bold text-sm placeholder:text-indigo-400 focus:ring-4 focus:ring-brand-indigo/30 transition-all"
              />
              <input 
                name="email" 
                type="email" 
                placeholder="Email" 
                required 
                className="h-14 rounded-2xl bg-white border-transparent text-indigo-900 px-5 font-bold text-sm placeholder:text-indigo-400 focus:ring-4 focus:ring-brand-indigo/30 transition-all"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-16 rounded-2xl bg-[#00F5A0] hover:bg-[#00D98F] text-[#003B27] font-black uppercase tracking-widest text-sm shadow-xl shadow-black/10 hover:scale-[1.02] active:scale-95 transition-all"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Solicitar cotización gratuita"}
          </Button>

          <p className="text-[10px] text-center text-white/40 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5" /> Tus datos están 100% protegidos. Respuesta garantizada.
          </p>
        </form>

        <div className="grid grid-cols-3 gap-1 pt-6 border-t border-white/10">
          <div className="text-center space-y-1">
             <Clock className="w-5 h-5 mx-auto text-white/50" />
             <p className="text-[8px] font-black opacity-60">Respuesta en 24h</p>
          </div>
          <div className="text-center space-y-1">
             <MessageSquare className="w-5 h-5 mx-auto text-white/50" />
             <p className="text-[8px] font-black opacity-60">Asesoría sin compromiso</p>
          </div>
          <div className="text-center space-y-1">
             <CheckCircle2 className="w-5 h-5 mx-auto text-white/50" />
             <p className="text-[8px] font-black opacity-60">Información verificada</p>
          </div>
        </div>
      </div>
    </div>
  );
}
