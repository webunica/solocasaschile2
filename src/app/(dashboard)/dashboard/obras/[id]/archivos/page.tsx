import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getObraProject, getObraFiles } from "@/lib/supabase/obra-services";
import { FileUploadZone } from "@/components/obras/file-upload-zone";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, FolderOpen } from "lucide-react";
import type { ObraStage } from "@/types/obra";

export const metadata: Metadata = { title: "Evidencias | Seguimiento de Obra" };

export default async function ArchivosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const project = await getObraProject(id);
  if (!project) notFound();

  const stages = ((project.stages ?? []) as ObraStage[]).sort((a, b) => a.orden - b.orden);
  const files = await getObraFiles(id);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Link href={`/dashboard/obras/${id}`} className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-brand-indigo transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al Proyecto
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-indigo/10 flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-brand-indigo" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-black tracking-tight">Evidencias y Documentos</h1>
            <p className="text-sm text-muted-foreground font-medium">{project.nombre}</p>
          </div>
        </div>
      </div>

      <FileUploadZone
        projectId={id}
        stages={stages}
        existingFiles={files}
        onUploaded={() => {}}
      />
    </div>
  );
}
