/**
 * Script de Ingestión: google-maps-scraper -> SolocasasChile Supabase
 *
 * Lee el archivo JSON generado por la herramienta CLI https://github.com/gosom/google-maps-scraper
 * e importa/actualiza las constructoras y fabricantes en la tabla 'constructoras' de Supabase.
 *
 * Uso:
 *   npx tsx scripts/import-google-maps-places.ts path/to/results.json
 */

import fs from "fs";
import path from "path";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Cargar variables de entorno locales
config({ path: ".env.local" });
config({ path: ".env" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Faltan variables de entorno NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface ScrapedPlace {
  title: string;
  category?: string;
  address?: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  reviews?: number;
  description?: string;
  city?: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function inferRegionFromAddress(address?: string): string[] {
  if (!address) return ["Metropolitana"];
  const addr = address.toLowerCase();

  if (addr.includes("valparaíso") || addr.includes("valparaiso") || addr.includes("viña")) return ["Valparaíso"];
  if (addr.includes("biobío") || addr.includes("biobio") || addr.includes("concepción") || addr.includes("concepcion")) return ["Biobío"];
  if (addr.includes("araucanía") || addr.includes("araucania") || addr.includes("temuco")) return ["La Araucanía"];
  if (addr.includes("los lagos") || addr.includes("puerto montt") || addr.includes("osorno") || addr.includes("chiloé")) return ["Los Lagos"];
  if (addr.includes("coquimbo") || addr.includes("la serena")) return ["Coquimbo"];
  if (addr.includes("maule") || addr.includes("talca") || addr.includes("curicó")) return ["Maule"];
  if (addr.includes("o'higgins") || addr.includes("rancagua")) return ["O'Higgins"];
  if (addr.includes("ñuble") || addr.includes("chillán") || addr.includes("chillan")) return ["Ñuble"];
  if (addr.includes("antofagasta")) return ["Antofagasta"];
  if (addr.includes("atacama") || addr.includes("copiapó")) return ["Atacama"];
  if (addr.includes("los ríos") || addr.includes("los rios") || addr.includes("valdivia")) return ["Los Ríos"];
  if (addr.includes("tarapacá") || addr.includes("tarapaca") || addr.includes("iquique")) return ["Tarapacá"];
  if (addr.includes("arica")) return ["Arica y Parinacota"];
  if (addr.includes("aysén") || addr.includes("aysen") || addr.includes("coyhaique")) return ["Aysén"];
  if (addr.includes("magallanes") || addr.includes("punta arenas")) return ["Magallanes"];

  return ["Metropolitana"];
}

async function main() {
  const args = process.argv.slice(2);
  const jsonPath = args[0] || "scraped-places.json";

  const resolvedPath = path.resolve(process.cwd(), jsonPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`❌ No se encontró el archivo de datos: ${resolvedPath}`);
    console.log("\n💡 Para usar este script:");
    console.log("   1. Ejecuta google-maps-scraper de gosom:");
    console.log('      google-maps-scraper -depth 1 -input "casas prefabricadas Santiago Chile" -results ./casas.json');
    console.log("   2. Ejecuta la ingestión:");
    console.log("      npx tsx scripts/import-google-maps-places.ts ./casas.json\n");
    process.exit(1);
  }

  const rawData = fs.readFileSync(resolvedPath, "utf-8");
  let places: ScrapedPlace[] = [];

  try {
    places = JSON.parse(rawData);
    if (!Array.isArray(places)) {
      throw new Error("El archivo JSON debe contener un arreglo de lugares.");
    }
  } catch (err) {
    console.error("❌ Error al parsear JSON:", err);
    process.exit(1);
  }

  console.log(`📦 Procesando ${places.length} registros extraídos de Google Maps...`);

  let countSuccess = 0;
  let countError = 0;

  for (const place of places) {
    if (!place.title || !place.title.trim()) continue;

    const slug = slugify(place.title);
    const regiones = inferRegionFromAddress(place.address);

    const payload = {
      nombre: place.title.trim(),
      slug: slug,
      descripcion: place.description || `Fabricante y constructora de casas en Chile. Dirección: ${place.address || "A consultar"}.`,
      direccion: place.address || null,
      telefono: place.phone || null,
      sitio_web: place.website || null,
      lat: place.latitude || null,
      lng: place.longitude || null,
      plan: "informativo", // Ingestado como directorio informativo inicial
      verificada: false,
      score_confianza: place.rating ? Math.round(place.rating * 16) : 60,
      regiones: regiones,
    };

    const { error } = await supabase
      .from("constructoras")
      .upsert(payload, { onConflict: "slug" });

    if (error) {
      console.warn(`⚠️ Error al importar '${place.title}':`, error.message);
      countError++;
    } else {
      countSuccess++;
    }
  }

  console.log(`\n✅ Proceso completado:`);
  console.log(`   - Importadas/Actualizadas: ${countSuccess}`);
  console.log(`   - Errores / Omitidas: ${countError}`);
}

main().catch(console.error);
