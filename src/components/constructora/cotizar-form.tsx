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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <label className="form-label">Datos de Contacto</label>
        
        <div className="relative group/input">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-indigo group-focus-within/input:scale-110 transition-all" />
          <Input 
            name="name" 
            placeholder="Nombre completo" 
            required 
            className="form-input-premium pl-12" 
          />
        </div>

        <div className="relative group/input">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-indigo group-focus-within/input:scale-110 transition-all" />
          <Input 
            name="email" 
            type="email" 
            placeholder="Correo electrónico" 
            required 
            className="form-input-premium pl-12" 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative group/input">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-indigo group-focus-within/input:scale-110 transition-all" />
            <Input 
              name="phone" 
              placeholder="Teléfono" 
              required
              className="form-input-premium pl-12" 
            />
          </div>
          <div className="relative group/input">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-indigo group-focus-within/input:scale-110 transition-all" />
            <select 
              name="region" 
              required
              className="form-input-premium pl-12 pr-4 appearance-none cursor-pointer" 
            >
              <option value="" disabled selected>Región</option>
              {REGIONES_CHILE.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative group/input">
            <select 
              name="terreno" 
              required
              className="form-input-premium pl-4 pr-4 appearance-none cursor-pointer" 
              defaultValue=""
            >
              <option value="" disabled>¿Tienes terreno?</option>
              <option value="Sí, tengo terreno">Sí, tengo terreno</option>
              <option value="No, estoy buscando">No, estoy buscando</option>
              <option value="En proceso de compra">En proceso de compra</option>
            </select>
          </div>
          <div className="relative group/input">
            <select 
              name="interes" 
              required
              className="form-input-premium pl-4 pr-4 appearance-none cursor-pointer" 
              defaultValue=""
            >
              <option value="" disabled>¿Qué necesitas?</option>
              <option value="Cotización aproximada">Cotización aproximada</option>
              <option value="Presupuesto oficial">Presupuesto oficial</option>
              <option value="Agendar visite/videollamada">Agendar visita/videollamada</option>
              <option value="Solo información">Solo información</option>
            </select>
          </div>
        </div>
        <div className="relative group/input">
          <select 
            name="superficie" 
            required
            className="form-input-premium pl-4 pr-4 appearance-none cursor-pointer" 
            defaultValue="Este modelo"
          >
            <option value="Este modelo">Quiero este modelo exacto</option>
            <option value="Versión más pequeña">Versión más pequeña (ej: 72 m²)</option>
            <option value="Versión más grande">Versión más grande (ej: 110 m²)</option>
            <option value="Modelo personalizado">Modelo personalizado / Otra medida</option>
          </select>
        </div>
        <div className="relative group/input">
          <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-brand-indigo group-focus-within/input:scale-110 transition-all opacity-70" />
          <Textarea 
            name="message" 
            defaultValue={`Hola, me interesa cotizar el modelo ${modeloNombre}. Me gustaría recibir más información sobre el precio final puesto en obra y tiempos de entrega.`}
            className="form-input-premium pl-12 min-h-[100px] resize-y py-4 leading-relaxed" 
          />
        </div>
      </div>

      {error && (
        <p className="text-base font-bold text-destructive flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
           {error}
        </p>
      )}

      <Button 
        type="submit" 
        size="lg" 
        disabled={loading}
        className="w-full h-auto min-h-[64px] py-3 px-4 rounded-2xl bg-brand-indigo font-black text-xs sm:text-sm md:text-base shadow-xl shadow-brand-indigo/20 hover:scale-[1.02] active:scale-95 transition-all group overflow-hidden relative"
      >
        {/* Shine effect */}
        <div className="absolute inset-0 -translate-x-[150%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
        
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin relative z-10" />
        ) : (
          <span className="flex items-center justify-center gap-2 md:gap-3 relative z-10 whitespace-normal text-center leading-tight">
            SOLICITAR PRESUPUESTO FORMAL
            <Send className="w-4 h-4 md:w-5 md:h-5 shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </span>
        )}
      </Button>

      <div className="flex flex-col items-center gap-2.5 pt-2">
         <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 opacity-60" /> Tus datos están 100% seguros
         </p>
         <div className="flex items-center gap-2 bg-brand-teal/10 px-4 py-1.5 rounded-full">
            <Zap className="w-3.5 h-3.5 text-brand-teal fill-brand-teal/20" />
            <p className="text-[10px] text-center text-brand-teal font-black uppercase tracking-[0.15em]">
               Respuesta garantizada por la plataforma
            </p>
         </div>
      </div>
    </form>
  );
}
