"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Mail,
  ShieldCheck,
  Building2,
  Lock,
} from "lucide-react";

function RegisterGateway() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-slate-50 dark:bg-background">
      {/* Decorative Brand accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-teal/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-brand-indigo/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-2xl space-y-8 relative z-10 mx-auto">
        {/* Header centrado */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block hover:scale-105 transition-transform">
            <Image
              src="/images/solocasaschile-logo.png"
              alt="SolocasasChile"
              width={260}
              height={42}
              className="h-10 w-auto object-contain mx-auto"
              priority
            />
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-foreground">
              Registro para Constructoras
            </h1>
            <p className="text-muted-foreground font-medium text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
              En SoloCasasChile el acceso a la plataforma opera exclusivamente mediante planes de suscripción o por invitación directa previa validación técnica.
            </p>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Opción 1: Planes de Pago */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-card rounded-3xl p-6 sm:p-7 shadow-xl border border-border/60 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-brand-indigo/40 transition-all"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-indigo/10 flex items-center justify-center text-brand-indigo">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-indigo">
                  Acceso Inmediato
                </span>
                <h2 className="text-xl font-heading font-black text-foreground">
                  Planes de Suscripción
                </h2>
              </div>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                Publica desde 3 hasta modelos ilimitados, activa recepción directa de leads por WhatsApp/Email y destaca en tu región.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-foreground/80 pt-2 border-t border-border/40">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Planes Basic, Crece, Pro y Pro+</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Recepción directa de compradores</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Panel comercial y CRM de cotizaciones</span>
                </li>
              </ul>
            </div>

            <Link
              href="/planes"
              className="flex items-center justify-center gap-2 w-full h-12 bg-brand-indigo hover:bg-brand-indigo/90 text-white font-black tracking-widest text-xs uppercase rounded-xl shadow-lg shadow-brand-indigo/20 transition-all hover:scale-[1.01] active:scale-95"
            >
              Ver Planes y Suscribirme <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </motion.div>

          {/* Opción 2: Invitación Plan Starter */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white dark:bg-card rounded-3xl p-6 sm:p-7 shadow-xl border border-border/60 flex flex-col justify-between space-y-6 relative overflow-hidden group hover:border-brand-teal/40 transition-all"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-teal">
                  Plan Starter Gratuito
                </span>
                <h2 className="text-xl font-heading font-black text-foreground">
                  Acceso por Invitación
                </h2>
              </div>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                Si tu constructora recibió un enlace o código de invitación exclusivo, actívalo para publicar 1 modelo de manera permanente.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-foreground/80 pt-2 border-t border-border/40">
                <li className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-brand-teal shrink-0" />
                  <span>Requiere token o enlace de invitación</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>1 modelo gratuito permanente</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Sin tarjeta de crédito requerida</span>
                </li>
              </ul>
            </div>

            <Link
              href="/invitacion"
              className="flex items-center justify-center gap-2 w-full h-12 bg-brand-teal hover:bg-brand-teal/90 text-white font-black tracking-widest text-xs uppercase rounded-xl shadow-lg shadow-brand-teal/20 transition-all hover:scale-[1.01] active:scale-95"
            >
              Activar con mi Invitación <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </motion.div>
        </div>

        {/* Footer Links */}
        <div className="space-y-3 text-center pt-2">
          <p className="text-xs text-muted-foreground font-medium">
            ¿Representas a una constructora y deseas solicitar una invitación gratuita?{" "}
            <Link
              href="/planes/starter#solicitar"
              className="text-brand-teal font-bold hover:underline"
            >
              Solicitar invitación aquí
            </Link>
          </p>

          <div className="pt-4 border-t border-border/40">
            <Link href="/login" className="inline-flex items-center gap-2 group text-xs font-semibold">
              <span className="text-muted-foreground">¿Ya tienes cuenta creada?</span>
              <span className="text-brand-teal font-black uppercase tracking-wider hover:underline">
                Iniciar Sesión
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-brand-teal border-t-transparent animate-spin" />
        </div>
      }
    >
      <RegisterGateway />
    </Suspense>
  );
}
