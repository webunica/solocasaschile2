import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function verify() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)!;
  const supabase = createClient(url, key);

  console.log("\n=== CONSTRUCTORAS EN LA BD ===");
  const { data: cons, error: e1 } = await supabase
    .from("constructoras")
    .select("id, nombre, slug, email, plan, verificada, score_confianza, created_at, regiones");
  
  if (e1) { console.error("Error:", e1.message); return; }

  if (!cons?.length) {
    console.log("⚠️  No hay constructoras. El registro no está creando el perfil correctamente.");
    return;
  }

  cons.forEach((c: any) => {
    console.log(`\n📋 ${c.nombre}`);
    console.log(`   ID:          ${c.id}`);
    console.log(`   Slug:        ${c.slug}`);
    console.log(`   Email:       ${c.email || "⚠️ NO TIENE (campo vacío)"}`);
    console.log(`   Plan:        ${c.plan}`);
    console.log(`   Regiones:    ${c.regiones?.join(", ") || "N/A"}`);
    console.log(`   Verificada:  ${c.verificada}`);
    console.log(`   Score:       ${c.score_confianza}`);
    console.log(`   Creada:      ${c.created_at}`);
  });

  console.log("\n=== MODELOS POR CONSTRUCTORA ===");
  for (const c of cons) {
    const { data: mods } = await supabase
      .from("modelos")
      .select("id, nombre, tipo, precio_desde_uf, disponible, imagenes_urls")
      .eq("constructora_id", c.id);
    
    console.log(`\n🏠 ${c.nombre} → ${mods?.length || 0} modelos`);
    mods?.forEach((m: any) => {
      console.log(`   - ${m.nombre} (${m.tipo}) ${m.precio_desde_uf} UF [disponible: ${m.disponible}]`);
      console.log(`     Imágenes: ${JSON.stringify(m.imagenes_urls)}`);
    });
  }
}

verify();
