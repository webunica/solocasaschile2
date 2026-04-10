import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { applyStageTemplate } from "@/lib/supabase/obra-services";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { templateId } = await req.json();

    // 1. Validar que el proyecto existe
    const { data: project } = await supabase
      .from('obra_projects')
      .select('id, fecha_inicio_estimada')
      .eq('id', projectId)
      .maybeSingle();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // 2. Buscar el ID de la plantilla por defecto si no se envió una
    let finalTemplateId = templateId;
    if (!templateId || templateId === 'default') {
      const { data: defaultT } = await supabase
        .from('obra_stage_templates')
        .select('id')
        .eq('is_default', true)
        .maybeSingle();
      
      if (!defaultT) {
        return NextResponse.json({ error: "No default template found" }, { status: 404 });
      }
      finalTemplateId = defaultT.id;
    }

    // 3. Aplicar la plantilla
    await applyStageTemplate(projectId, finalTemplateId, project.fecha_inicio_estimada || undefined);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("[api/obras/stages] POST Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
