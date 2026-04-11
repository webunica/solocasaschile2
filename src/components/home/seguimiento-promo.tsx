"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, MapPin, CheckCircle2, Search, Smartphone } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function SeguimientoPromo() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-brand-indigo/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <div className="container px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Visual Presentation (Mock of the dashboard images) */}
          <div className="w-full lg:w-1/2 relative space-y-4">
             {/* Main Dashboard Preview */}
             <motion.div 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               viewport={{ once: true }}
               className="relative z-10 rounded-[2.5rem] border border-border/40 bg-white shadow-2xl shadow-brand-indigo/10 p-4 md:p-6 overflow-hidden aspect-[1.3/1] group cursor-pointer"
             >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/5 via-transparent to-brand-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Visual Representation of Dashboard Elements */}
                <div className="h-full flex flex-col gap-6 relative z-10">
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                         <div className="w-32 h-3 bg-slate-100 rounded-full" />
                         <div className="w-48 h-5 bg-brand-indigo/10 rounded-full" />
                      </div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100" />
                        <div className="w-20 h-8 rounded-lg bg-brand-indigo text-white px-3 flex items-center justify-center text-[8px] font-black uppercase">Ficha</div>
                      </div>
                   </div>

                   <div className="flex-1 flex gap-4">
                      {/* Left Side: Stats/Timeline summary */}
                      <div className="w-2/3 space-y-4">
                         <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                            <div className="flex justify-between">
                               <div className="w-16 h-2 bg-slate-200 rounded-full" />
                               <div className="w-8 h-2 bg-brand-teal/40 rounded-full" />
                            </div>
                            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
                               <div className="w-[100%] h-full bg-brand-teal" />
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-2">
                               <div className="h-4 bg-slate-100 rounded" />
                               <div className="h-4 bg-slate-100 rounded" />
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-2">
                               <div className="w-full h-24 bg-slate-50 rounded-xl flex items-center justify-center">
                                  <Search className="w-8 h-8 opacity-10" />
                               </div>
                               <div className="w-12 h-2 bg-slate-200 rounded-full" />
                            </div>
                            <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-2">
                               <div className="w-full h-24 bg-slate-50 rounded-xl flex items-center justify-center">
                                  <Clock className="w-8 h-8 opacity-10" />
                               </div>
                               <div className="w-12 h-2 bg-slate-200 rounded-full" />
                            </div>
                         </div>
                      </div>
                      {/* Right Side: Step Progress */}
                      <div className="w-1/3 p-4 rounded-2xl bg-brand-indigo text-white/90 space-y-4 flex flex-col justify-center overflow-hidden">
                         {[1,2,3,4,5].map(i => (
                           <div key={i} className="flex items-center gap-2">
                              <div className={cn("w-3 h-3 rounded-full border-2 border-brand-teal", i <= 3 && "bg-brand-teal")} />
                              <div className={cn("h-2 rounded-full", i === 1 ? "w-full bg-white/40" : "w-1/2 bg-white/10")} />
                           </div>
                         ))}
                         <div className="pt-4 mt-auto border-t border-white/10">
                            <div className="w-16 h-2 bg-brand-teal rounded-full" />
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>

             {/* Floating Mobile Portal Preview */}
             <motion.div 
               initial={{ opacity: 0, y: 50, rotate: 10 }}
               whileInView={{ opacity: 1, y: 0, rotate: -5 }}
               transition={{ duration: 0.8, delay: 0.3 }}
               viewport={{ once: true }}
               className="absolute -right-8 -bottom-12 z-20 w-48 md:w-56 overflow-hidden rounded-[2.5rem] border-[6px] border-brand-indigo bg-white shadow-2xl p-6 space-y-4"
             >
                <div className="flex items-center justify-between">
                  <Smartphone className="w-6 h-6 text-brand-indigo" />
                  <div className="w-8 h-1 bg-slate-100 rounded-full" />
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] font-black uppercase text-brand-teal">Portal Cliente</p>
                   <h4 className="font-heading font-black text-brand-indigo text-base">Estatus: Obra Terminada</h4>
                </div>
                <div className="aspect-square rounded-2xl bg-slate-100 flex items-center justify-center">
                   <CheckCircle2 className="w-8 h-8 text-brand-teal" />
                </div>
                <div className="space-y-1">
                   <div className="flex justify-between text-[8px] font-black uppercase">
                      <span>Avance</span>
                      <span>100%</span>
                   </div>
                   <div className="w-full h-1 bg-brand-teal rounded-full" />
                </div>
             </motion.div>
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-1/2 space-y-8 text-left">
            <div className="space-y-4">
              <Badge className="bg-brand-indigo/10 text-brand-indigo border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] relative overflow-hidden">
                Nueva Funcionalidad
                <span className="absolute inset-y-0 left-0 w-1 bg-brand-teal" />
              </Badge>
              <h2 className="text-[clamp(1.5rem,5vw,3.5rem)] font-heading font-black leading-[1.1] tracking-tighter text-brand-indigo">
                Construye con <span className="text-brand-teal italic">Transparencia</span> <br /> Digital 2026.
              </h2>
            </div>
            
            <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-xl opacity-80">
              Usa nuestro nuevo sistema de <strong>Seguimiento de Obra</strong> para ver el avance real, fotos de bitácora y cumplimiento de hitos desde cualquier lugar.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
              {[
                "Evidencias fotográficas reales",
                "Línea de tiempo interactiva",
                "Certificaciones digitales",
                "Control de plazos críticos",
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-brand-indigo">
                  <div className="w-6 h-6 rounded-full bg-brand-teal/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-brand-teal" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
              <Link href="/seguimiento-de-obras" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-brand-indigo text-white font-black rounded-2xl h-14 px-8 shadow-xl shadow-brand-indigo/20 hover:scale-105 transition-transform group">
                  EXPLORAR SISTEMA DE SEGUIMIENTO
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
