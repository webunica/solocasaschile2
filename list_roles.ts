import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function verify() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(url, key);

  console.log("=== LISTADO DE ROLES EN BD ===");
  const { data: cons, error: e1 } = await supabase
    .from("constructoras")
    .select("id, nombre, email, role");
  
  if (e1) { 
    console.error("Error:", e1.message); 
    // Fallback if role is missing
    const { data: fallback } = await supabase.from("constructoras").select("id, nombre, email");
    fallback?.forEach((c: any) => {
       console.log(`- ${c.nombre} (${c.email || c.id}) - ROL: (COLUMNA NO EXISTE)`);
    });
    return;
  }

  if (!cons?.length) {
    console.log("No hay usuarios en la tabla 'constructoras'.");
    return;
  }

  cons.forEach((c: any) => {
    console.log(`- ${c.nombre} (${c.email || c.id}) - ROL: ${c.role || 'SIN ROL'}`);
  });
}

verify();
