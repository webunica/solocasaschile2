import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getObraProject } from "@/lib/supabase/obra-services";
import { StagesManager } from "@/components/obras/stages-manager";
import { ArrowLeft, Layers } from "lucide-react";
import type { ObraStage } from "@/types/obra";

export const metadata: Metadata = { title: "Gestionar Etapas | Seguimiento de Obra" };

export default async function EtapasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const project = await getObraProject(id);
  if (!project) notFound();

  const stages = ((project.stages ?? []) as ObraStage[]).sort((a, b) => a.orden - b.orden);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Link href={`/dashboard/obras/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-brand-indigo transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al Proyecto
        </Link>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-indigo/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-brand-indigo" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-black tracking-tight">Gestionar Etapas</h1>
              <p className="text-sm text-muted-foreground font-medium">{project.nombre}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-brand-indigo/5 border border-brand-indigo/10 text-sm text-brand-indigo/70 font-medium">
        💡 Haz clic en cada etapa para expandirla y actualizar su estado, fechas y porcentaje de avance. Los cambios recalculan automáticamente el avance global del proyecto.
      </div>

      <StagesManager stages={stages} projectId={id} />
    </div>
  );
}
