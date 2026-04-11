import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getObraProjectForClient } from "@/lib/supabase/obra-services";
import { ProjectTimeline } from "@/components/obras/project-timeline";
import { ProjectHealthBadge } from "@/components/obras/health-badge";
import { ProjectSpecsClient } from "@/components/obras/project-specs-client";
import { cn } from "@/lib/utils";
import {
  Calendar, MapPin, CheckCircle2, Clock, FileText,
  Image as ImageIcon, ChevronRight, HardHat, ArrowLeft,
  Download, Share2, Info, User
} from "lucide-react";
import type { ObraStage, ObraStageFile } from "@/types/obra";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const project = await getObraProjectForClient(id);
  return {
    title: project ? `${project.nombre} | Portal de Seguimiento` : "Portal de Seguimiento",
    description: "Sigue el avance de tu proyecto de construcción en tiempo real.",
  };
}

export default async function ClientPortalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const project = await getObraProjectForClient(id);
  if (!project) notFound();

  const stages = (project.stages ?? []) as ObraStage[];
  
  // Consolidar todos los archivos y generar URLs públicas reales
  const allFiles = stages.flatMap(s => (s.files ?? []) as ObraStageFile[]).map(file => {
    const { data: { publicUrl } } = supabase.storage.from('obra-files').getPublicUrl(file.storage_path);
    return { ...file, publicUrl };
  });

  const recentPhotos = allFiles.filter(f => f.tipo === 'foto').reverse().slice(0, 8);
  const docs = allFiles.filter(f => f.tipo !== 'foto');

  const nextStage = stages.find(s => s.estado !== 'completada' && s.estado !== 'cancelada');
  const completedCount = stages.filter(s => s.estado === 'completada').length;

  const diasRestantes = project.fecha_termino_estimada
    ? Math.ceil((new Date(project.fecha_termino_estimada).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header del portal Premium */}
      <div className="bg-[#1a1a1a] text-white relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-indigo/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 py-10 relative z-10 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center">
                <HardHat className="w-6 h-6 text-brand-teal" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Portal de Seguimiento</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white/90">
                    {project.constructora?.nombre ?? "SolocasasChile"}
                  </p>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-teal">Verificada</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                <Share2 className="w-3 h-3" /> Compartir
              </button>
              <Link href="/" className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-end">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-heading font-black tracking-tight leading-tight text-white">
                  {project.nombre}
                </h1>
                <ProjectHealthBadge salud={project.salud} />
              </div>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/50 font-medium">
                {project.region && (
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-teal/70" />
                    {project.region}{project.comuna ? `, ${project.comuna}` : ''}
                  </span>
                )}
                {project.fecha_termino_estimada && (
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-teal/70" />
                    Entrega est.: {new Date(project.fecha_termino_estimada).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>

            {/* Barra de avance circular / lineal */}
            <div className="space-y-4 bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-[2rem]">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Avance del Proyecto</p>
                  <span className="text-4xl font-black text-white">{project.porcentaje_avance}%</span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-brand-teal">{completedCount}/{stages.length}</p>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-tighter">Etapas Completadas</p>
                </div>
              </div>
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-indigo transition-all duration-1000 ease-out"
                  style={{ width: `${project.porcentaje_avance}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">

        {/* Info y Próximo Hito */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-6 p-8 rounded-[2.5rem] bg-white border border-border/40 shadow-sm shadow-brand-indigo/5">
             <div className="w-16 h-16 rounded-3xl bg-brand-teal/10 flex items-center justify-center shrink-0">
               <Clock className="w-8 h-8 text-brand-teal" />
             </div>
             <div className="flex-1 text-center sm:text-left">
               <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Estado Actual: {nextStage?.nombre || 'Finalizado'}</p>
               <h2 className="text-xl font-heading font-black text-brand-indigo mt-1">
                 {nextStage ? `Trabajando en: ${nextStage.nombre}` : '¡Obra Terminada! ✅'}
               </h2>
               <p className="text-sm text-muted-foreground font-medium mt-1">
                 {nextStage?.descripcion || 'Hemos completado satisfactoriamente todas las etapas del proyecto.'}
               </p>
             </div>
             {diasRestantes !== null && diasRestantes > 0 && (
               <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                 <p className="text-2xl font-black text-brand-indigo">{diasRestantes}</p>
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">días para entrega</p>
               </div>
             )}
          </div>

          <div className="p-8 rounded-[2.5rem] bg-brand-indigo text-white flex items-center justify-between group cursor-pointer hover:bg-brand-indigo/90 transition-colors">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50 underline transition-all group-hover:text-white">Presupuesto y Pagos</p>
              <p className="font-bold text-lg">Estado Financiero</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Timeline vs Specs */}
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Timeline principal */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="font-heading font-black text-2xl tracking-tight">Cronograma de Obra</h2>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completada
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-brand-indigo">
                  <Clock className="w-3.5 h-3.5" /> En curso
                </span>
              </div>
            </div>
            
            <div className="p-10 rounded-[2.5rem] bg-white border border-border/40 shadow-sm relative overflow-hidden">
              {/* Marca de agua decorativa */}
              <HardHat className="absolute -bottom-10 -right-10 w-48 h-48 text-slate-50 -rotate-12 pointer-events-none" />
              
              <div className="relative z-10">
                {stages.length > 0 ? (
                  <ProjectTimeline stages={stages} />
                ) : (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto">
                      <Clock className="w-8 h-8 text-slate-200" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">Cargando línea de tiempo del proyecto...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Especificaciones */}
          <div className="lg:col-span-5">
            <ProjectSpecsClient specs={project.specs || []} />
          </div>
        </div>

        {/* Galería de Fotos - Evidencia Real */}
        <div>
          <div className="flex items-center justify-between mb-8 px-2">
            <div>
              <h2 className="font-heading font-black text-2xl tracking-tight">Evidencia Fotográfica</h2>
              <p className="text-sm text-muted-foreground font-medium">Registro visual del avance directo en terreno.</p>
            </div>
            <button className="text-xs font-black uppercase tracking-widest text-brand-indigo hover:underline">Ver todas</button>
          </div>

          {recentPhotos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recentPhotos.map((f, i) => (
                <div 
                  key={f.id} 
                  className={cn(
                    "aspect-square rounded-[2rem] bg-slate-100 overflow-hidden border border-border/20 group relative cursor-zoom-in",
                    i === 0 && "md:col-span-2 md:row-span-2 aspect-auto"
                  )}
                >
                  <Image 
                    src={f.publicUrl || ""}
                    alt={f.nombre || "Foto de obra"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">{f.nombre}</p>
                    <p className="text-xs text-white font-bold">{new Date(f.created_at || '').toLocaleDateString('es-CL')}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 rounded-[2.5rem] bg-white border border-dashed border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto">
                <ImageIcon className="w-8 h-8 text-slate-200" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">Todavía no hay fotos publicadas</p>
                <p className="text-xs text-slate-400 font-medium">Tu constructora subirá fotos del avance pronto.</p>
              </div>
            </div>
          )}
        </div>

        {/* Documentos y Soporte */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-10 rounded-[2.5rem] bg-white border border-border/40 shadow-sm space-y-6">
            <h2 className="font-heading font-black text-xl tracking-tight flex items-center gap-3">
              <FileText className="w-6 h-6 text-brand-indigo" /> Documentación
            </h2>
             {docs.length > 0 ? (
               <div className="divide-y divide-border/10">
                 {docs.map(f => (
                   <div key={f.id} className="py-4 flex items-center gap-4 group cursor-pointer">
                     <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-brand-indigo/5 transition-colors">
                       <FileText className="w-5 h-5 text-slate-400 group-hover:text-brand-indigo" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold text-foreground truncate">{f.nombre}</p>
                       <p className="text-[10px] text-muted-foreground font-medium">{new Date(f.created_at || '').toLocaleDateString()}</p>
                     </div>
                     <Download className="w-4 h-4 text-muted-foreground/30 group-hover:text-brand-indigo transition-colors" />
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-sm text-muted-foreground italic font-medium">No se han compartido documentos técnicos todavía.</p>
             )}
          </div>

          <div className="p-10 rounded-[2.5rem] bg-brand-teal/5 border border-brand-teal/20 space-y-6">
            <h2 className="font-heading font-black text-xl tracking-tight flex items-center gap-3 text-brand-teal-dark">
              <Info className="w-6 h-6" /> Ayuda y Soporte
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-brand-teal-dark/70 font-medium leading-relaxed">
                ¿Tienes dudas sobre los tiempos o materiales de tu proyecto? Contacta directamente al encargado de obra asignado por tu constructora.
              </p>
              <div className="bg-white p-5 rounded-3xl border border-brand-teal/10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black">{project.ejecutivo_responsable || 'Encargado de Obra'}</p>
                    <p className="text-[10px] font-black uppercase text-brand-teal tracking-widest">Responsable Asignado</p>
                  </div>
                </div>
                <button className="w-full py-3 bg-brand-teal text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-brand-teal/20 hover:scale-[1.02] transition-transform">
                  Contactar por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Branding Footer */}
        <div className="text-center py-12 border-t border-border/10 space-y-4">
          <div className="flex items-center justify-center gap-2 opacity-30 grayscale">
            <HardHat className="w-5 h-5" />
            <p className="text-xs font-black uppercase tracking-[0.3em] font-heading">SolocasasChile</p>
          </div>
          <p className="text-[10px] text-muted-foreground/40 font-medium max-w-xl mx-auto leading-relaxed">
            Este portal es una herramienta diagnóstica de transparencia proporcionada por SolocasasChile para mejorar la confianza entre constructoras y clientes finales. La información aquí presentada es responsabilidad directa de la constructora ejecutante.
          </p>
        </div>
      </div>
    </div>
  );
}
