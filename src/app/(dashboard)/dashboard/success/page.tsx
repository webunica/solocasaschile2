"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldCheck, ArrowRight, Home, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { createClient } from "@/lib/supabase/client";

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState<'processing' | 'active' | 'error'>('processing');
  const [constructora, setConstructora] = useState<any>(null);
  
  useEffect(() => {
    const supabase = createClient();
    
    const checkStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('constructoras')
        .select('plan, plan_status, nombre')
        .eq('id', session.user.id)
        .single();

      if (data && data.plan !== 'gratis' && data.plan_status === 'active') {
        setStatus('active');
        setConstructora(data);
        // 🎉 Lanzar confeti solo cuando confirmamos éxito
        launchConfetti();
      } else {
        // Reintentar en 3 segundos si no está activo aún
        setTimeout(checkStatus, 3000);
      }
    };

    checkStatus();

    return () => {};
  }, []);

  const launchConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-background">
      <AnimatePresence mode="wait">
        {status === 'processing' ? (
          <motion.div 
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-6"
          >
            <div className="relative inline-block">
              <Loader2 className="w-16 h-16 text-brand-indigo animate-spin" />
              <div className="absolute inset-0 bg-brand-indigo/20 blur-2xl rounded-full -z-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">Procesando tu pago...</h2>
              <p className="text-muted-foreground font-medium max-w-xs mx-auto">
                Estamos confirmando la transacción con la red bancaria. Esto tardará solo unos segundos.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl w-full text-center space-y-10"
          >
            {/* Icon */}
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/10">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full -z-10"
              />
            </div>

            {/* Text */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter leading-tight">
                ¡Suscripción <br />
                <span className="text-emerald-500 underline decoration-emerald-500/20 underline-offset-8 italic">Activada!</span>
              </h1>
              <p className="text-muted-foreground font-medium text-lg max-w-md mx-auto">
                ¡Hola {constructora?.nombre}! Hemos recibido tu pago con éxito. Tu cuenta ha sido elevada a plan <span className="text-brand-indigo font-black uppercase">{constructora?.plan}</span>. Ya puedes publicar tus modelos sin límites.
              </p>
            </div>

            {/* Status Card */}
            <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-[3rem] p-8 flex items-center gap-6 text-left shadow-2xl shadow-primary/5">
              <div className="w-14 h-14 rounded-2xl bg-brand-indigo flex items-center justify-center text-white shrink-0 shadow-lg">
                 <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-widest text-primary">Estado de Cuenta</p>
                 <p className="font-bold text-base text-foreground leading-none">Suscripción Activa y Verificada</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="flex-1 sm:flex-initial">
                 <Button className="w-full h-14 px-10 rounded-2xl bg-brand-indigo text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 hover:scale-105 transition-all gap-3">
                   <Home className="w-4 h-4" /> Ir a mi Dashboard
                 </Button>
              </Link>
              <Link href="/dashboard/catalog/new" className="flex-1 sm:flex-initial">
                 <Button variant="outline" className="w-full h-14 px-10 rounded-2xl border-border/40 font-black uppercase tracking-widest text-[10px] hover:bg-muted transition-all gap-3">
                   Publicar Primer Modelo <ArrowRight className="w-4 h-4" />
                 </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

