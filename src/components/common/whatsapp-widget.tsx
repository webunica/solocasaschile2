"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Mail, Phone, Home, Building2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "56964130601"; // Official Sales Number

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [showHint, setShowHint] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "" as "casa" | "constructora" | "",
  });

  useEffect(() => {
    // Show tip/hint after 3 seconds instead of opening the whole widget
    const timer = setTimeout(() => {
      if (!isOpen && !hasAutoOpened) {
        setShowHint(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isOpen, hasAutoOpened]);

  const handleStart = (type: "casa" | "constructora") => {
    setFormData({ ...formData, type });
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const msg = 
      `¡Hola SolocasasChile! \u{1F44B} Me gustaría recibir información.\n\n` +
      `\u{1F464} *Nombre:* ${formData.name}\n` +
      `\u{1F4E7} *Email:* ${formData.email}\n` +
      `\u{1F4F1} *Teléfono:* ${formData.phone || "No proporcionado"}\n` +
      `\u{1F3AF} *Interés:* ${formData.type === "casa" ? "Busco una casa" : "Soy una Constructora"}\n\n` +
      `Vengo desde la web oficial. \u{2728}`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, "_blank");
    setIsOpen(false);
    setHasAutoOpened(true);
    setShowHint(false);
    // Reset after some time
    setTimeout(() => {
      setStep(1);
      setFormData({ name: "", email: "", phone: "", type: "" });
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {/* Chat Window (Appears above the button row) */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-2 w-[calc(100vw-3rem)] max-w-[340px] overflow-hidden rounded-[2rem] bg-background/95 backdrop-blur-3xl border border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] pointer-events-auto"
          >
            {/* Header */}
            <div className="bg-brand-indigo p-6 text-white relative">
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar chat de WhatsApp"
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                   <MessageCircle className="w-5 h-5 fill-white" aria-hidden="true" />
                </div>
                <div>
                   <h3 className="font-heading font-black text-lg tracking-tighter text-brand-teal">¡Hola! 👋</h3>
                   <p className="text-white/90 text-[9px] font-black uppercase tracking-widest leading-none">Soporte SolocasasChile</p>
                </div>
              </div>
              <p className="text-[13px] font-medium leading-tight opacity-90">
                {step === 1 
                  ? "¿En qué podemos ayudarte? 😊" 
                  : "Por favor, completa tus datos:"}
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              {step === 1 ? (
                <div className="grid grid-cols-1 gap-3">
                   <button 
                     type="button"
                     onClick={() => handleStart("casa")}
                     className="group flex items-center gap-3 p-4 rounded-xl border border-primary/5 bg-primary/5 hover:border-primary/20 transition-all text-left"
                   >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                         <Home className="w-4 h-4 text-primary" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                         <p className="text-[11px] font-black uppercase tracking-widest text-foreground">Busco una casa</p>
                         <p className="text-[9px] font-bold text-muted-foreground italic">Modelos y precios</p>
                      </div>
                      <ChevronRight className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                   </button>

                   <button 
                     type="button"
                     onClick={() => handleStart("constructora")}
                     className="group flex items-center gap-3 p-4 rounded-xl border border-primary/5 bg-primary/5 hover:border-primary/20 transition-all text-left"
                   >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                         <Building2 className="w-4 h-4 text-primary" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                         <p className="text-[11px] font-black uppercase tracking-widest text-foreground">Soy Constructora</p>
                         <p className="text-[9px] font-bold text-muted-foreground italic">Gestionar catálogo</p>
                      </div>
                      <ChevronRight className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                   </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                   <div className="space-y-3">
                      <div className="relative group">
                         <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground group-focus-within:text-primary transition-colors" aria-hidden="true" />
                         <Input 
                           aria-label="Nombre completo"
                           placeholder="Nombre completo" 
                           value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                           className="h-10 pl-10 rounded-lg bg-muted text-xs font-bold" 
                           required 
                         />
                      </div>
                      <div className="relative group">
                         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground group-focus-within:text-primary transition-colors" aria-hidden="true" />
                         <Input 
                           aria-label="Email"
                           type="email"
                           placeholder="Tu Email" 
                           value={formData.email}
                           onChange={(e) => setFormData({...formData, email: e.target.value})}
                           className="h-10 pl-10 rounded-lg bg-muted text-xs font-bold" 
                           required 
                         />
                      </div>
                      <div className="relative group">
                         <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground group-focus-within:text-primary transition-colors" aria-hidden="true" />
                         <Input 
                           aria-label="Telefono"
                           type="tel"
                           placeholder="Teléfono (Opcional)" 
                           value={formData.phone}
                           onChange={(e) => setFormData({...formData, phone: e.target.value})}
                           className="h-10 pl-10 rounded-lg bg-muted text-xs font-bold" 
                         />
                      </div>
                   </div>

                   <Button 
                     type="submit" 
                     className="w-full h-11 bg-brand-indigo rounded-lg font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                   >
                     INICIAR CHAT <Send className="ml-2 w-3 h-3" aria-hidden="true" />
                   </Button>

                   <button 
                     type="button" 
                     onClick={() => setStep(1)}
                     className="w-full text-[9px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest text-center"
                   >
                      Volver
                   </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Row (Hint + Toggle Button) */}
      <div className="flex items-center justify-end gap-3 w-max h-14 pointer-events-auto">
        <AnimatePresence>
          {showHint && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 15, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 15, scale: 0.9 }}
              onClick={() => {
                setIsOpen(true);
                setShowHint(false);
                if (!hasAutoOpened) setHasAutoOpened(true);
              }}
              className="group cursor-pointer bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-full shadow-[0_12px_36px_-6px_rgba(0,38,43,0.18)] border border-slate-200/80 dark:border-slate-700/80 text-[12px] font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2.5 relative whitespace-nowrap hover:scale-[1.02] active:scale-95 transition-all select-none"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="tracking-wide">
                ¿Necesitas ayuda?{" "}
                <strong className="text-brand-indigo dark:text-brand-teal font-extrabold group-hover:underline">
                  Chatea aquí
                </strong>
              </span>
              {/* Flecha conectora integrada con el mismo borde y fondo */}
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white dark:bg-slate-900 border-r border-t border-slate-200/80 dark:border-slate-700/80 rotate-45 pointer-events-none" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          aria-label={isOpen ? "Cerrar chat de WhatsApp" : "Abrir chat de WhatsApp"}
          aria-expanded={isOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsOpen(!isOpen);
            setShowHint(false);
            if (!hasAutoOpened) setHasAutoOpened(true);
          }}
          className={cn(
            "relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl shrink-0 border",
            isOpen
              ? "bg-card text-foreground rotate-90 border-border shadow-md"
              : "bg-[#00262b] text-white border-white/20 shadow-[0_10px_28px_rgba(0,38,43,0.35)] hover:shadow-[0_14px_36px_rgba(0,38,43,0.45)]"
          )}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <X className="w-6 h-6" aria-hidden="true" />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <MessageCircle className="w-6 h-6 fill-white" aria-hidden="true" />
              </motion.div>
            )}
          </AnimatePresence>

          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-brand-teal/40 animate-ping opacity-35 pointer-events-none" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
