import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateObraStage } from "@/lib/supabase/obra-services";
import type { UpdateObraStageDTO } from "@/types/obra";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; stageId: string }> }
) {
  const { id: projectId, stageId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify user has access to this project
  const { data: project } = await supabase
    .from("obra_projects")
    .select("id, constructora_id")
    .eq("id", projectId)
    .maybeSingle();

  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const dto: UpdateObraStageDTO = await req.json();
  const success = await updateObraStage(stageId, dto);

  if (!success) return NextResponse.json({ error: "Update failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
