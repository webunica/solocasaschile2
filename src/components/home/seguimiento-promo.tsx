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
               className="relative z-10 rounded-[2.5rem] border border-border/40 bg-white shadow-2xl shadow-brand-indigo/10 overflow-hidden aspect-[1.3/1] group cursor-pointer"
             >
                <Image 
                  src="/images/sistema-avances-01.jpg"
                  alt="Sistema de Seguimiento de Obras"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/20 via-transparent to-brand-teal/20 opacity-40 group-hover:opacity-20 transition-opacity duration-700" />
             </motion.div>

             {/* Floating Mobile Portal Preview — Imagen 2 */}
             <motion.div 
               initial={{ opacity: 0, y: 50, rotate: 10 }}
               whileInView={{ opacity: 1, y: 0, rotate: -5 }}
               transition={{ duration: 0.8, delay: 0.3 }}
               viewport={{ once: true }}
               className="absolute -right-8 -bottom-12 z-20 w-48 md:w-56 overflow-hidden rounded-[2.5rem] border-[6px] border-brand-indigo bg-slate-100 shadow-2xl aspect-[9/19]"
             >
                <Image 
                  src="/images/sistema-avances-02.jpg"
                  alt="App de Seguimiento"
                  fill
                  className="object-cover"
                />
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
