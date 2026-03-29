const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// MOCK DATA HARDCODED TO AVOID IMPORT ISSUES
const MODELOS = [
  {
    id: "m0",
    nombre: "Austral SIP 140 - Luxury Edition",
    slug: "austral-sip-140-luxury",
    tipo: "sip",
    superficieM2: 140,
    dormitorios: 4,
    banos: 3,
    precioDesdeUF: 1850,
    imagenes: ["/images/modelos/austral/frente.jpg", "/images/modelos/austral/interior.jpg"],
    tiempoEntrega: "120 dÃ­as",
    descripcion: "Modelo insignia de construcciÃ³n SIP de 140mÂ².",
    especificaciones: { "Estructura": "Panel SIP 162mm" },
    garantiaAnos: 10,
    postventa: true,
  },
  {
    id: "m1",
    nombre: "Casa Nogal SIP 120",
    slug: "casa-nogal-sip-120",
    tipo: "sip",
    superficieM2: 120,
    dormitorios: 3,
    banos: 2,
    precioDesdeUF: 1200,
    imagenes: ["/hero.png"],
    tiempoEntrega: "90 dÃ­as",
    descripcion: "Casa de panel SIP de 120mÂ² primium.",
    especificaciones: { "Estructura": "Panel SIP 162mm" },
    garantiaAnos: 5,
    postventa: true,
  },
  {
    id: "m3",
    nombre: "Imperio SIP 150",
    slug: "imperio-sip-150",
    tipo: "sip",
    superficieM2: 150,
    dormitorios: 4,
    banos: 2,
    precioDesdeUF: 1650,
    imagenes: ["/hero2.png"],
    tiempoEntrega: "100 dÃ­as",
    descripcion: "La soluciÃ³n mÃ¡s completa para familias grandes.",
    especificaciones: { "Estructura": "Panel SIP 200mm" },
    garantiaAnos: 7,
    postventa: true,
  }
];

async function seed() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(url, key);

  console.log("\n=== SIEMBRA R├üPIDA DE MODELOS ===");

  const { data: existingCons } = await supabase.from("constructoras").select("id, nombre").limit(1);
  if (!existingCons?.length) {
    console.error("Error: No constructoras found to associate models.");
    return;
  }

  const defaultConsId = existingCons[0].id;
  console.log(`Asociando modelos a: ${existingCons[0].nombre}`);

  for (const mock of MODELOS) {
    const dbModel = {
      constructora_id: defaultConsId,
      nombre: mock.nombre,
      slug: `${mock.slug}-${Math.floor(Math.random()*1000)}`,
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
    if (error) console.error(`Error ${mock.nombre}:`, error.message);
    else console.log(`✅ ${mock.nombre} OK`);
  }
}

seed();
