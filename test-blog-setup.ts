import { openai } from "./src/lib/openai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function verifySetup() {
  console.log("\n🔍 Iniciando verificación de configuración del Blog IA...\n");

  // 1. Verificar OpenAI
  console.log("1. Probando conexión con OpenAI...");
  try {
    if (!process.env.OPENAI_API_KEY) throw new Error("Falta OPENAI_API_KEY en .env.local");
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: "Di 'Hola, SoloCasasChile'" }],
      max_tokens: 10
    });
    console.log("✅ OpenAI: " + response.choices[0].message.content);
  } catch (error: any) {
    console.error("❌ Error en OpenAI: " + error.message);
  }

  // 2. Verificar Supabase Service Role
  console.log("\n2. Probando conexión con Supabase (Service Role)...");
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) throw new Error("Faltan credenciales de Supabase en .env.local");

    const supabase = createClient(url, key);

    // Intentar listar buckets para verificar acceso de administración
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
    
    if (storageError) throw storageError;
    
    console.log("✅ Supabase Auth: Conectado con éxito.");
    const blogBucket = buckets?.find(b => b.name === 'blog_images');
    
    if (blogBucket) {
      console.log("✅ Supabase Storage: Bucket 'blog_images' encontrado.");
    } else {
      console.log("⚠️ Supabase Storage: No encontré el bucket 'blog_images'. Recuerda crearlo en el dashboard.");
    }

    // Intentar leer la tabla de blog
    const { error: tableError } = await supabase.from('blog_posts').select('id').limit(1);
    if (tableError) {
      if (tableError.code === '42P01') {
        console.log("⚠️ Supabase DB: La tabla 'blog_posts' no existe aún. Ejecuta el script SQL.");
      } else {
        throw tableError;
      }
    } else {
      console.log("✅ Supabase DB: Tabla 'blog_posts' lista.");
    }

  } catch (error: any) {
    console.error("❌ Error en Supabase: " + error.message);
  }

  console.log("\n--- Verificación finalizada ---\n");
}

verifySetup();
