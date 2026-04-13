import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify access to this project
  const { data: project } = await supabase
    .from("obra_projects")
    .select("id")
    .eq("id", projectId)
    .maybeSingle();
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const formData = await req.formData();
  const file     = formData.get("file") as File | null;
  const stageId  = formData.get("stageId") as string | null;
  const tipo     = (formData.get("tipo") as string) || "foto";
  const visible  = formData.get("visibleCliente") !== "false";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  if (stageId) {
    const { data: stage } = await supabase
      .from("obra_stages")
      .select("id")
      .eq("id", stageId)
      .eq("project_id", projectId)
      .maybeSingle();

    if (!stage) {
      return NextResponse.json({ error: "Stage not found for this project" }, { status: 404 });
    }
  }

  // Upload to Supabase Storage
  const path = `${projectId}/${stageId || "general"}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("obra-files")
    .upload(path, file);

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // Save metadata to DB
  const { data, error } = await supabase
    .from("obra_stage_files")
    .insert({
      project_id:     projectId,
      stage_id:       stageId || null,
      nombre:         file.name,
      tipo,
      storage_path:   path,
      visible_cliente: visible,
      subido_por:     user.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("obra_stage_files")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
