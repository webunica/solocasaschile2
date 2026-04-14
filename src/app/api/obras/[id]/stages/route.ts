import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { applyStageTemplate, getObraStages } from "@/lib/supabase/obra-services";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: project } = await supabase
    .from("obra_projects")
    .select("id")
    .eq("id", projectId)
    .maybeSingle();

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const stages = await getObraStages(projectId);
  return NextResponse.json({ stages });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { templateId } = await req.json();

    const { data: projects } = await supabase
      .from("obra_projects")
      .select("id, fecha_inicio_estimada")
      .eq("id", projectId)
      .limit(1);

    const project = projects?.[0];
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    let finalTemplateId = templateId;
    if (!templateId || templateId === "default") {
      const { data: defaultTemplates, error: templateError } = await supabase
        .from("obra_stage_templates")
        .select("id")
        .eq("is_default", true)
        .limit(1);

      const defaultTemplate = defaultTemplates?.[0];

      if (templateError) {
        return NextResponse.json(
          { error: "Error loading stage template" },
          { status: 500 }
        );
      }

      if (!defaultTemplate) {
        return NextResponse.json(
          { error: "No default template found. Run SQL seed." },
          { status: 404 }
        );
      }

      finalTemplateId = defaultTemplate.id;
    }

    try {
      await applyStageTemplate(projectId, finalTemplateId, project.fecha_inicio_estimada || undefined);
    } catch (applyError: unknown) {
      const message = applyError instanceof Error ? applyError.message : "Error applying template";
      return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Template applied successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
