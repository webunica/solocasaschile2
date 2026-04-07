"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User, Mail, Phone, Home, Building2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end">
      <AnimatePresence>
        {showHint && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-4 mr-2 bg-white px-4 py-2 rounded-2xl shadow-xl border border-border/50 text-[11px] font-black uppercase tracking-widest text-brand-indigo flex items-center gap-2 relative"
          >
            <div className="w-2 h-2 bg-brand-teal rounded-full animate-pulse" />
            ¿Necesitas ayuda? Chatea aquí
            <div className="absolute top-full right-6 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
          </motion.div>
        )}

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[calc(100vw-3rem)] max-w-[340px] overflow-hidden rounded-[2rem] bg-background/95 backdrop-blur-3xl border border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)]"
          >
            {/* Header */}
            <div className="bg-brand-indigo p-6 text-white relative">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                   <MessageCircle className="w-5 h-5 fill-white" />
                </div>
                <div>
                   <h3 className="font-heading font-black text-lg tracking-tighter text-brand-teal">¡Hola! 👋</h3>
                   <p className="text-white/70 text-[9px] font-black uppercase tracking-widest leading-none">Soporte SolocasasChile</p>
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
                     onClick={() => handleStart("casa")}
                     className="group flex items-center gap-3 p-4 rounded-xl border border-primary/5 bg-primary/5 hover:border-primary/20 transition-all text-left"
                   >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                         <Home className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                         <p className="text-[11px] font-black uppercase tracking-widest text-foreground">Busco una casa</p>
                         <p className="text-[9px] font-bold text-muted-foreground opacity-60 italic">Modelos y precios</p>
                      </div>
                      <ChevronRight className="w-3 h-3 opacity-20 group-hover:opacity-100 transition-opacity" />
                   </button>

                   <button 
                     onClick={() => handleStart("constructora")}
                     className="group flex items-center gap-3 p-4 rounded-xl border border-primary/5 bg-primary/5 hover:border-primary/20 transition-all text-left"
                   >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                         <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                         <p className="text-[11px] font-black uppercase tracking-widest text-foreground">Soy Constructora</p>
                         <p className="text-[9px] font-bold text-muted-foreground opacity-60 italic">Gestionar catálogo</p>
                      </div>
                      <ChevronRight className="w-3 h-3 opacity-20 group-hover:opacity-100 transition-opacity" />
                   </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                   <div className="space-y-3">
                      <div className="relative group">
                         <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground group-focus-within:text-primary transition-colors" />
                         <Input 
                           placeholder="Nombre completo" 
                           value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                           className="h-10 pl-10 rounded-lg bg-muted text-xs font-bold" 
                           required 
                         />
                      </div>
                      <div className="relative group">
                         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground group-focus-within:text-primary transition-colors" />
                         <Input 
                           type="email"
                           placeholder="Tu Email" 
                           value={formData.email}
                           onChange={(e) => setFormData({...formData, email: e.target.value})}
                           className="h-10 pl-10 rounded-lg bg-muted text-xs font-bold" 
                           required 
                         />
                      </div>
                      <div className="relative group">
                         <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground group-focus-within:text-primary transition-colors" />
                         <Input 
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
                     INICIAR CHAT <Send className="ml-2 w-3 h-3" />
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

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(!isOpen);
          setShowHint(false);
          if (!hasAutoOpened) setHasAutoOpened(true);
        }}
        className={cn(
          "relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl",
          isOpen ? "bg-background text-foreground rotate-90" : "bg-brand-indigo text-white shadow-primary/20"
        )}
      >
        <AnimatePresence mode="wait">
           {isOpen ? (
             <motion.div key="close" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <X className="w-6 h-6" />
             </motion.div>
           ) : (
             <motion.div key="open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <MessageCircle className="w-7 h-7 fill-white" />
             </motion.div>
           )}
        </AnimatePresence>
        
        {!isOpen && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-[2rem] bg-current opacity-20 pointer-events-none"
          />
        )}
      </motion.button>
    </div>
  );
}
