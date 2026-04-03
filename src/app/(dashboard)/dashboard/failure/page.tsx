"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { XCircle, AlertCircle, RefreshCcw, Home, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

export default function PaymentFailurePage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'No se pudo completar la transacción.';
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full text-center space-y-10"
      >
        {/* Icon */}
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-[2.5rem] bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mx-auto shadow-2xl shadow-red-500/10">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full -z-10"
          />
        </div>

        {/* Text */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter leading-tight">
            Algo no salió <br />
            <span className="text-red-500 underline decoration-red-500/20 underline-offset-8 italic">Como Esperábamos</span>
          </h1>
          <p className="text-muted-foreground font-medium text-lg max-w-md mx-auto">
            {error} <br />
            No te preocupes, no se ha realizado ningún cobro en tu tarjeta. Puedes intentarlo de nuevo o contactarnos si el problema persiste.
          </p>
        </div>

        {/* Error Detail Card */}
        <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-[3rem] p-8 flex items-center gap-6 text-left shadow-2xl shadow-red-500/5">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-lg">
             <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1">
             <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Motivo del Fallo</p>
             <p className="font-bold text-base text-foreground leading-none">Transacción Rechazada o Cancelada</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/planes" className="flex-1 sm:flex-initial">
             <Button className="w-full h-14 px-10 rounded-2xl bg-brand-indigo text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-primary/20 hover:scale-105 transition-all gap-3">
               <RefreshCcw className="w-4 h-4" /> Reintentar Pago
             </Button>
          </Link>
          <Link href="https://wa.me/something" target="_blank" className="flex-1 sm:flex-initial">
             <Button variant="outline" className="w-full h-14 px-10 rounded-2xl border-border/40 font-black uppercase tracking-widest text-[10px] hover:bg-muted transition-all gap-3">
               Soporte WhatsApp <MessageSquare className="w-4 h-4" />
             </Button>
          </Link>
        </div>

        <Link href="/dashboard" className="block text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors">
          O volver al Dashboard temporalmente
        </Link>
      </motion.div>
    </div>
  );
}
