import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createObraProject } from "@/lib/supabase/obra-services";
import type { CreateObraProjectDTO } from "@/types/obra";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("obra_projects")
    .select("*, constructora:constructoras(nombre, logo_url)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: CreateObraProjectDTO = await req.json();
  if (!body.nombre) return NextResponse.json({ error: "nombre required" }, { status: 400 });

  const project = await createObraProject(body);
  if (!project) return NextResponse.json({ error: "Failed to create project" }, { status: 500 });

  return NextResponse.json(project, { status: 201 });
}
