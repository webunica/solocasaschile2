import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function insert_db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(url, key);

  let companies = JSON.parse(fs.readFileSync('companies.json', 'utf8'));

  const insertData = companies.map(c => {
    const slug = c.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 10000);
    
    return {
      nombre: c.nombre,
      slug: slug,
      regiones: c.region ? [c.region] : [],
      email: c.email || null,
      sitio_web: c.sitio_web || null,
      telefono: c.telefono || null,
      plan: "informativo",
      verificada: false,
      score_confianza: 0
    };
  });

  console.log(`Inserting ${insertData.length} records...`);
  const chunkSize = 50;
  for (let i=0; i < insertData.length; i += chunkSize) {
    const chunk = insertData.slice(i, i + chunkSize);
    const { data, error } = await supabase.from('constructoras').insert(chunk).select();
    if (error) {
      console.error(error);
    } else {
      console.log(`Inserted chunk of ${chunk.length}`);
    }
  }
  console.log("Done inserting.");
}
insert_db();
