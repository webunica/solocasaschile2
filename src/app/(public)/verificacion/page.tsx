import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  CheckCircle2,
  FileCheck,
  MapPin,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Como verificamos constructoras | SolocasasChile",
  description:
    "Conoce el proceso de auditoria y los criterios de confianza para constructoras en Chile.",
};

const criteria = [
  {
    title: "Identidad legal",
    icon: FileCheck,
    desc: "Validacion de RUT de empresa, constitucion de sociedad y vigencia ante el SII.",
  },
  {
    title: "Anos de operacion",
    icon: Users,
    desc: "Evaluamos trayectoria y experiencia demostrable en el mercado de la construccion.",
  },
  {
    title: "Contacto verificable",
    icon: CheckCircle2,
    desc: "Comprobamos oficinas, telefonos activos y correos corporativos.",
  },
  {
    title: "Cobertura regional",
    icon: MapPin,
    desc: "Confirmamos la capacidad logistica en las regiones donde la empresa declara operar.",
  },
  {
    title: "Certificaciones",
    icon: Award,
    desc: "Revisamos sellos de calidad, membresias gremiales y certificaciones tecnicas.",
  },
  {
    title: "Historial documental",
    icon: Search,
    desc: "Analisis de antecedentes comerciales y comportamiento de cumplimiento en proyectos previos.",
  },
];

const statuses = [
  {
    label: "Verificada documentalmente",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
    desc: "Nivel maximo: documentacion auditada y excelente historial comercial.",
  },
  {
    label: "Informacion basica validada",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    desc: "Nivel estandar: datos de contacto y RUT verificados, con antecedentes adicionales en revision.",
  },
  {
    label: "Perfil en revision",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    desc: "Nivel inicial: empresa nueva en la plataforma con proceso de auditoria en curso.",
  },
  {
    label: "No verificada",
    color: "bg-slate-500/10 text-slate-500 border-slate-500/30",
    desc: "Empresa con informacion publica que aun no inicia el proceso formal de validacion.",
  },
];

export default function VerificacionPage() {
  return (
    <main className="min-h-screen bg-background pb-20 pt-44">
      <div className="container mx-auto max-w-5xl px-6">
        <Link
          href="/constructoras"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Directorio de constructoras
        </Link>

        <div className="mb-20 space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-indigo/10 bg-brand-indigo/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-brand-indigo">
            <ShieldCheck className="h-4 w-4" />
            Auditoria tecnica independiente
          </div>
          <h1 className="font-heading text-4xl font-black italic leading-none tracking-tighter text-brand-indigo md:text-7xl">
            Como <span className="text-brand-teal">verificamos</span> a las constructoras
          </h1>
          <p className="max-w-3xl text-xl font-medium leading-relaxed text-muted-foreground">
            SolocasasChile no es una constructora. Somos una entidad independiente que audita a las empresas para que puedas elegir con seguridad.
          </p>
        </div>

        <section className="mb-24">
          <div className="relative overflow-hidden rounded-[3.5rem] border border-border/40 bg-white p-12 text-center shadow-sm md:p-20">
            <div className="absolute left-0 top-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-teal/5 blur-3xl" />
            <div className="mx-auto max-w-3xl space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-indigo/5 text-brand-indigo">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h2 className="font-heading text-2xl font-black tracking-tight text-brand-indigo md:text-3xl">
                Transparencia en <span className="text-brand-teal">evolucion</span>
              </h2>
              <p className="text-lg font-medium leading-relaxed text-muted-foreground md:text-xl">
                Estamos trabajando con las constructoras para hacer este proceso mas transparente y con mas opciones de verificacion. Muy pronto podras ver un desglose detallado de cada criterio directamente en los perfiles.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-24">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {criteria.map((item) => (
              <div
                key={item.title}
                className="group space-y-4 rounded-[2.5rem] border border-border/40 bg-white p-8 shadow-sm transition-all hover:border-brand-teal/30 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-teal/10 text-brand-teal transition-all group-hover:bg-brand-teal group-hover:text-white">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-black text-brand-indigo">{item.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-muted-foreground opacity-70">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[3.5rem] border border-border/40 bg-white p-10 shadow-2xl shadow-brand-indigo/5 md:p-20">
          <div className="absolute right-0 top-0 h-[400px] w-[400px] -translate-y-1/2 translate-x-1/2 rounded-full bg-brand-teal/5 blur-[120px]" />
          <div className="relative z-10 space-y-12">
            <div className="space-y-4 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-teal">
                Sustento de auditoria
              </p>
              <h2 className="font-heading text-3xl font-black tracking-tighter text-brand-indigo md:text-5xl">
                Estados de <span className="text-brand-teal italic">Confianza</span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg font-medium text-muted-foreground">
                Identifica el nivel de auditoria de cada perfil mediante nuestros sellos visibles.
              </p>
            </div>

            <div className="grid gap-6">
              {statuses.map((status) => (
                <div
                  key={status.label}
                  className="group flex flex-col gap-6 rounded-[2rem] border border-slate-200/60 bg-slate-50/50 p-8 transition-all hover:border-brand-teal/30 hover:bg-white hover:shadow-xl hover:shadow-brand-teal/5 md:flex-row md:items-center"
                >
                  <div
                    className={cn(
                      "min-w-[240px] shrink-0 rounded-full border px-6 py-3 text-center text-[11px] font-black uppercase tracking-widest",
                      status.color,
                    )}
                  >
                    {status.label}
                  </div>
                  <p className="font-medium leading-relaxed text-brand-indigo/80">
                    {status.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-24 space-y-10">
          <div className="flex items-start gap-6 rounded-[2.5rem] border border-amber-500/20 bg-amber-500/5 p-8">
            <AlertCircle className="h-10 w-10 shrink-0 text-amber-500" />
            <div className="space-y-2">
              <h4 className="font-heading text-xl font-black text-brand-indigo">
                Nota sobre independencia
              </h4>
              <p className="font-medium leading-relaxed text-muted-foreground">
                <strong>SolocasasChile es un comparador independiente.</strong> No somos una constructora ni vendemos directamente viviendas. Nuestra mision es transparentar el mercado, permitiendo a los usuarios comparar modelos y contactar directamente a las empresas validadas.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-20 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40 italic">
          Metodologia de verificacion | SolocasasChile
        </p>
      </div>
    </main>
  );
}
