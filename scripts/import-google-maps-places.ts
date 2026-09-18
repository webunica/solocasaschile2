/**
 * Script de Ingestión: google-maps-scraper -> SolocasasChile
 *
 * Lee el archivo JSON o JSONL generado por la herramienta CLI https://github.com/gosom/google-maps-scraper
 * e importa/actualiza las constructoras y fabricantes:
 * 1. Genera o actualiza el archivo local `src/data/constructoras-geo.json` (coordenadas GPS exactas y datos de contacto).
 * 2. Genera un script SQL `supabase/migrations/scraped_insert_constructoras.sql` listo para ejecutar en Supabase SQL Editor.
 * 3. Si `SUPABASE_SERVICE_ROLE_KEY` está configurado en `.env.local`, realiza el upsert directo a Supabase.
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
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseKey = serviceRoleKey || anonKey;

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

  if (addr.includes("valparaíso") || addr.includes("valparaiso") || addr.includes("viña") || addr.includes("quilpué") || addr.includes("quilpue")) return ["Valparaíso"];
  if (addr.includes("biobío") || addr.includes("biobio") || addr.includes("concepción") || addr.includes("concepcion") || addr.includes("los ángeles") || addr.includes("los angeles") || addr.includes("coronel") || addr.includes("talcahuano")) return ["Biobío"];
  if (addr.includes("araucanía") || addr.includes("araucania") || addr.includes("temuco") || addr.includes("villarrica") || addr.includes("pucón") || addr.includes("pucon") || addr.includes("angol")) return ["La Araucanía"];
  if (addr.includes("los lagos") || addr.includes("puerto montt") || addr.includes("osorno") || addr.includes("chiloé") || addr.includes("chiloe") || addr.includes("puerto varas") || addr.includes("castro")) return ["Los Lagos"];
  if (addr.includes("coquimbo") || addr.includes("la serena") || addr.includes("ovalle")) return ["Coquimbo"];
  if (addr.includes("maule") || addr.includes("talca") || addr.includes("curicó") || addr.includes("curico") || addr.includes("linares")) return ["Maule"];
  if (addr.includes("o'higgins") || addr.includes("ohiggins") || addr.includes("rancagua") || addr.includes("san fernando") || addr.includes("machalí")) return ["O'Higgins"];
  if (addr.includes("ñuble") || addr.includes("nuble") || addr.includes("chillán") || addr.includes("chillan") || addr.includes("san carlos")) return ["Ñuble"];
  if (addr.includes("antofagasta") || addr.includes("calama")) return ["Antofagasta"];
  if (addr.includes("atacama") || addr.includes("copiapó") || addr.includes("copiapo") || addr.includes("vallenar")) return ["Atacama"];
  if (addr.includes("los ríos") || addr.includes("los rios") || addr.includes("valdivia") || addr.includes("la unión") || addr.includes("la union")) return ["Los Ríos"];
  if (addr.includes("tarapacá") || addr.includes("tarapaca") || addr.includes("iquique") || addr.includes("alto hospicio")) return ["Tarapacá"];
  if (addr.includes("arica") || addr.includes("parinacota")) return ["Arica y Parinacota"];
  if (addr.includes("aysén") || addr.includes("aysen") || addr.includes("coyhaique")) return ["Aysén"];
  if (addr.includes("magallanes") || addr.includes("punta arenas") || addr.includes("puerto natales")) return ["Magallanes"];

  return ["Metropolitana"];
}

function isValidChileCoord(lat?: number | null, lng?: number | null): boolean {
  if (typeof lat !== "number" || typeof lng !== "number") return false;
  return lat >= -56.0 && lat <= -17.0 && lng >= -76.0 && lng <= -66.0;
}

function escapeSql(text?: string | null): string {
  if (text === null || text === undefined) return "NULL";
  return `'${text.replace(/'/g, "''")}'`;
}

async function main() {
  const args = process.argv.slice(2);
  const jsonPath = args[0] || "constructoras_test.json";

  const resolvedPath = path.resolve(process.cwd(), jsonPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`❌ No se encontró el archivo de datos: ${resolvedPath}`);
    console.log("\n💡 Para usar este script:");
    console.log("   1. Ejecuta el scraper:");
    console.log("      .\\google_maps_scraper.exe -input test-queries.txt -results ./constructoras_test.json -depth 1");
    console.log("   2. Ejecuta la ingestión:");
    console.log("      npx tsx scripts/import-google-maps-places.ts ./constructoras_test.json\n");
    process.exit(1);
  }

  const rawData = fs.readFileSync(resolvedPath, "utf-8").trim();
  let places: any[] = [];

  // ── CSV detection: gosom scraper can output CSV instead of JSON ──
  const firstLine = rawData.split("\n")[0] ?? "";
  const looksLikeCsv =
    !rawData.startsWith("[") &&
    !rawData.startsWith("{") &&
    (firstLine.includes(",") || firstLine.includes("\t"));

  if (looksLikeCsv) {
    // CSV from gosom: columns (no header guaranteed, detect by presence of lat/lng column)
    // Column layout from gosom CSV output:
    // input_id, google_maps_url, title, category, address, opening_hours, ...
    // phone, plus_code, review_count, rating, reviews_per_rating, latitude, longitude, ...
    // website, ...
    const lines = rawData.split("\n").filter(l => l.trim().length > 0);
    for (const line of lines) {
      // Simple CSV split (gosom fields can contain quoted commas, use a basic split)
      // gosom CSV fields are comma-separated, text fields quoted with ""
      const cols: string[] = [];
      let cur = "";
      let inQ = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
          else inQ = !inQ;
        } else if (ch === "," && !inQ) {
          cols.push(cur); cur = "";
        } else {
          cur += ch;
        }
      }
      cols.push(cur);

      const title = cols[2]?.trim();
      const address = cols[4]?.trim();
      const phone = cols[8]?.trim();
      const reviewCount = parseInt(cols[10] ?? "0", 10);
      const rating = parseFloat(cols[11] ?? "0");
      const lat = parseFloat(cols[13] ?? "");
      const lng = parseFloat(cols[14] ?? "");
      const website = cols[15]?.trim();

      if (!title || title === "title") continue; // skip header if present

      places.push({
        title,
        address,
        phone,
        review_count: isNaN(reviewCount) ? 0 : reviewCount,
        average_rating: isNaN(rating) ? null : rating,
        latitude: isNaN(lat) ? null : lat,
        longitude: isNaN(lng) ? null : lng,
        site: website || null,
      });
    }
  } else {
    try {
      if (rawData.startsWith("[")) {
        places = JSON.parse(rawData);
      } else {
        // Formato JSON Lines
        places = rawData
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .map((line) => {
            try {
              return JSON.parse(line);
            } catch {
              return null;
            }
          })
          .filter((item) => item !== null);
      }
    } catch (err) {
      console.error("❌ Error al parsear JSON:", err);
      process.exit(1);
    }
  }

  console.log(`📦 Procesando ${places.length} registros extraídos de Google Maps...`);

  // Asegurar directorio src/data
  const dataDir = path.resolve(process.cwd(), "src", "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const geoFilePath = path.resolve(dataDir, "constructoras-geo.json");
  let geoMap: Record<
    string,
    {
      nombre: string;
      slug: string;
      lat?: number | null;
      lng?: number | null;
      direccion?: string | null;
      telefono?: string | null;
      sitio_web?: string | null;
      rating?: number | null;
      reviews?: number | null;
      regiones?: string[];
    }
  > = {};

  if (fs.existsSync(geoFilePath)) {
    try {
      geoMap = JSON.parse(fs.readFileSync(geoFilePath, "utf-8"));
    } catch {
      geoMap = {};
    }
  }

  const sqlStatements: string[] = [];
  const processedSlugs = new Set<string>();

  for (const place of places) {
    const rawTitle = place.title || place.name;
    if (!rawTitle || !rawTitle.trim()) continue;

    const cleanTitle = rawTitle.trim();
    const slug = slugify(cleanTitle);

    if (processedSlugs.has(slug)) continue;
    processedSlugs.add(slug);

    const address = place.address || (place.complete_address ? `${place.complete_address.street || ""}, ${place.complete_address.city || ""}` : null);
    const cleanAddress = address && address.trim() !== "," ? address.trim() : null;
    const regiones = inferRegionFromAddress(cleanAddress || "");
    const website = place.web_site || place.website || null;
    const phone = place.phone ? String(place.phone).trim() : null;
    const rawLat = place.latitude || place.lat;
    const rawLng = place.longitude || place.longtitude || place.lng;
    const hasValidCoords = isValidChileCoord(rawLat, rawLng);
    const lat = hasValidCoords ? rawLat : null;
    const lng = hasValidCoords ? rawLng : null;
    const rating = place.review_rating || place.rating || null;
    const reviews = place.review_count || place.reviews || 0;

    // Guardar en geoMap
    geoMap[slug] = {
      nombre: cleanTitle,
      slug,
      lat,
      lng,
      direccion: cleanAddress,
      telefono: phone,
      sitio_web: website,
      rating,
      reviews,
      regiones,
    };

    // Generar fila SQL
    const score = rating ? Math.min(100, Math.round(rating * 18)) : 65;
    const desc = place.description || `Fabricante y constructora de casas en Chile. Ubicación: ${cleanAddress || regiones[0]}.`;
    const regionesArraySql = `ARRAY[${regiones.map((r) => `'${r}'`).join(",")}]::text[]`;

    sqlStatements.push(
      `  (${escapeSql(cleanTitle)}, ${escapeSql(slug)}, ${escapeSql(desc)}, ${escapeSql(cleanAddress)}, ${escapeSql(phone)}, ${escapeSql(website)}, ${lat !== null ? lat : "NULL"}, ${lng !== null ? lng : "NULL"}, 'informativo', false, ${score}, ${regionesArraySql})`
    );
  }

  // 1. Guardar geoMap
  fs.writeFileSync(geoFilePath, JSON.stringify(geoMap, null, 2), "utf-8");
  console.log(`✅ [1/3] Archivo local actualizado: src/data/constructoras-geo.json con ${Object.keys(geoMap).length} constructoras.`);

  // 2. Generar SQL de inserción
  const sqlOutputDir = path.resolve(process.cwd(), "supabase", "migrations");
  if (!fs.existsSync(sqlOutputDir)) {
    fs.mkdirSync(sqlOutputDir, { recursive: true });
  }
  const sqlFilePath = path.resolve(sqlOutputDir, "scraped_insert_constructoras.sql");

  if (sqlStatements.length === 0) {
    console.warn("⚠️ No se encontraron registros válidos para generar SQL.");
    return;
  }

  const fullSql = `-- Script de carga automática para constructoras scrapeadas de Google Maps
-- Ejecutar en Supabase Dashboard: SQL Editor -> New query -> Run

-- 1. Asegurar columnas de coordenadas
ALTER TABLE public.constructoras ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION;
ALTER TABLE public.constructoras ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;

-- 2. Asegurar índice único en slug para permitir ON CONFLICT (slug)
CREATE UNIQUE INDEX IF NOT EXISTS constructoras_slug_key ON public.constructoras (slug);

-- 3. Insertar / Actualizar constructoras
INSERT INTO public.constructoras (
  nombre,
  slug,
  descripcion,
  direccion,
  telefono,
  sitio_web,
  lat,
  lng,
  plan,
  verificada,
  score_confianza,
  regiones
) VALUES
${sqlStatements.join(",\n")}
ON CONFLICT (slug) DO UPDATE SET
  direccion = COALESCE(EXCLUDED.direccion, constructoras.direccion),
  telefono = COALESCE(EXCLUDED.telefono, constructoras.telefono),
  sitio_web = COALESCE(EXCLUDED.sitio_web, constructoras.sitio_web),
  lat = COALESCE(EXCLUDED.lat, constructoras.lat),
  lng = COALESCE(EXCLUDED.lng, constructoras.lng),
  score_confianza = GREATEST(EXCLUDED.score_confianza, constructoras.score_confianza);
`;

  fs.writeFileSync(sqlFilePath, fullSql, "utf-8");
  console.log(`✅ [2/3] Script SQL generado: supabase/migrations/scraped_insert_constructoras.sql`);

  // 3. Si hay SUPABASE_SERVICE_ROLE_KEY, sincronizar directamente con Supabase
  if (serviceRoleKey && supabaseUrl) {
    console.log(`🚀 [3/3] Sincronizando directamente con Supabase usando SERVICE_ROLE_KEY...`);
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    let countSuccess = 0;
    let countErr = 0;

    for (const [slug, item] of Object.entries(geoMap)) {
      const payload: any = {
        nombre: item.nombre,
        slug,
        direccion: item.direccion,
        telefono: item.telefono,
        sitio_web: item.sitio_web,
        plan: "informativo",
        verificada: false,
        score_confianza: item.rating ? Math.min(100, Math.round(item.rating * 18)) : 65,
        regiones: item.regiones || ["Metropolitana"],
      };
      if (item.lat && item.lng) {
        payload.lat = item.lat;
        payload.lng = item.lng;
      }

      const { error } = await supabaseAdmin.from("constructoras").upsert(payload, { onConflict: "slug" });
      if (error) {
        countErr++;
      } else {
        countSuccess++;
      }
    }
    console.log(`   - Directamente sincronizadas en Supabase: ${countSuccess} (Errores: ${countErr})`);
  } else {
    console.log(`ℹ️ [3/3] Para insertar directamente en la base de datos Supabase:`);
    console.log(`   a) Puedes ejecutar el archivo 'supabase/migrations/scraped_insert_constructoras.sql' en el SQL Editor de Supabase.`);
    console.log(`   b) O agregar 'SUPABASE_SERVICE_ROLE_KEY=...' a tu archivo '.env.local'.`);
    console.log(`   💡 ¡La web y el mapa interactivo YA muestran todas estas constructoras usando el archivo geo local!`);
  }
}

main().catch(console.error);
