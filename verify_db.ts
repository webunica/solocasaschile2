import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function verify() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)!;

  const supabase = createClient(url, key);

  console.log("\n=== TODAS LAS CONSTRUCTORAS ===");
  const { data: cons } = await supabase.from("constructoras").select("id, nombre, email");
  console.log(JSON.stringify(cons, null, 2));

  console.log("\n=== TODOS LOS MODELOS (sin filtro) ===");
  const { data: mods, error } = await supabase.from("modelos").select("id, nombre, constructora_id");
  if (error) console.error("Error:", error.message);
  else console.log(JSON.stringify(mods, null, 2));
}

verify();
