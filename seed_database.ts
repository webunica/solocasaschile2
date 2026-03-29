import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { MODELOS, CONSTRUCTORAS } from "./src/lib/mock-data";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function seed() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(url, key);

  console.log("\n=== SIEMBRA MAESTRA DE MODELOS ===");

  // 1. Obtener una constructora existente de la BD para asociar los modelos (ya que la FK de Auth.users bloquea a las nuevas)
  const { data: existingCons } = await supabase
    .from("constructoras")
    .select("id, nombre")
    .limit(10);
    
  if (!existingCons?.length) {
    console.error("No hay constructoras en la BD para asociar los modelos.");
    return;
  }

  const defaultConsId = existingCons[0].id;
  console.log(`Usando constructora base: ${existingCons[0].nombre} (${defaultConsId})`);

  for (const mock of MODELOS) {
    console.log(`\nImportando: ${mock.nombre}...`);
    
    // Convertir de formato mock (camelCase) a DB (snake_case)
    const dbModel = {
      constructora_id: defaultConsId,
      nombre: mock.nombre,
      slug: `${mock.slug}-${Date.now()}`,
      tipo: mock.tipo,
      superficie_m2: mock.superficieM2,
      dormitorios: mock.dormitorios,
      banos: mock.banos,
      precio_desde_uf: mock.precioDesdeUF,
      imagenes_urls: mock.imagenes,
      tiempo_entrega: mock.tiempoEntrega,
      descripcion: mock.descripcion,
      especificaciones: mock.especificaciones,
      garantia_anos: mock.garantiaAnos,
      postventa: mock.postventa,
      disponible: true
    };

    const { error } = await supabase.from("modelos").insert([dbModel]);
    
    if (error) {
      console.error(`Error al insertar ${mock.nombre}:`, error.message);
    } else {
      console.log(`✅ ${mock.nombre} importado correctamente.`);
    }
  }

  console.log("\n=== SIEMBRA COMPLETADA CON ÉXITO ===");
}

seed();
