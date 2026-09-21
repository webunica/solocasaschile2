import type { ModelWithConstructora } from "@/lib/supabase/services";

export const CONSTRUCTORA_MASTER_DATA = {
  id: "cb85b919-4008-46bc-bbb8-b3211152280c",
  nombre: "Constructora Master",
  slug: "javier-cb85b919",
  descripcion: "Constructora Master SpA es una empresa de la Región de La Araucanía con trayectoria desde 2010 y más de 40 proyectos realizados. Su experiencia la posiciona como una alternativa confiable para quienes buscan desarrollar viviendas con respaldo, seriedad y compromiso con la calidad.",
  logo_url: "https://pereskyvymsyiqbihydj.supabase.co/storage/v1/object/public/model_images/logos/cb85b919-4008-46bc-bbb8-b3211152280c-1775228477059.png",
  image_url: "https://pereskyvymsyiqbihydj.supabase.co/storage/v1/object/public/model_images/banners/cb85b919-4008-46bc-bbb8-b3211152280c-1775509005054.jpg",
  plan: "premium",
  score_confianza: 100,
  verificada: true,
  telefono: "+56984410379",
  email: "javier@webunica.cl",
  sitio_web: "https://constructoramaster.com",
  regiones: [
    "La Araucanía",
    "Los Ríos",
    "Los Lagos",
    "Metropolitana",
    "Valparaíso",
    "Biobío",
    "Maule",
    "Ñuble",
    "Coquimbo"
  ],
  testimonios: [
    {
      cargo: "Dueño de Casa",
      texto: "La casa quedó muy bien instalada, se siente muy confortable y todo sellado térmicamente.",
      nombre: "Pedro Velásquez",
      estrellas: 5,
      modelo_id: "master-roble-andino"
    },
    {
      cargo: "Dueño",
      texto: "Excelente empresa, todo muy claro, trabajo rápido y la casa quedó en perfectas condiciones.",
      nombre: "Andrés Brahm",
      estrellas: 5,
      modelo_id: "master-valle-central"
    },
    {
      cargo: "Dueña",
      texto: "Quedó fabulosa la casa, es muy térmica y nos sentimos felices.",
      nombre: "Miriam Pérez",
      estrellas: 5,
      modelo_id: "master-cordillera"
    },
    {
      cargo: "Dueño de Parcela",
      texto: "Nos encantó cómo quedó la casa en nuestro terreno en el sur. Cumplieron con todos los plazos.",
      nombre: "Javier Miller",
      estrellas: 5,
      modelo_id: "master-alerce-austral"
    }
  ]
};

export const MODELOS_MASTER: ModelWithConstructora[] = [
  {
    id: "master-roble-andino",
    constructora_id: CONSTRUCTORA_MASTER_DATA.id,
    nombre: "Modelo Roble Andino",
    slug: "modelo-roble-andino-115m2",
    tipo: "sip",
    superficie_m2: 120,
    dormitorios: 2,
    banos: 1,
    precio_desde_uf: 0,
    imagenes_urls: [
      "/ejemplos/images/modelo_roble_render_raw.png",
      "/ejemplos/images/modelo_roble_plano_raw.jpeg"
    ],
    tiempo_entrega: "60 a 90 días",
    descripcion: "Vivienda contemporánea de 120 m² (115 m² útiles) diseñada con cubierta a cuatro aguas y concepto social abierto. Destaca por su amplia cocina americana con isla integrada, dormitorios luminosos y conexión fluida hacia una terraza exterior techada. Excelente desempeño térmico y estructural con paneles SIP.",
    disponible: true,
    garantia_anos: 10,
    postventa: true,
    visitas: 84,
    uso: "Vivienda Unifamiliar / Parcela",
    pisos: 1,
    codigo_modelo: "MRA-115",
    is_featured: true,
    featured_order: 1,
    recintos: [
      "Gran Living-Comedor de concepto abierto",
      "Cocina americana moderna con isla",
      "Dormitorio Principal amplio",
      "Dormitorio Secundario con closet",
      "Baño completo sectorizado",
      "Terraza exterior techada",
      "Hall de acceso protegido"
    ],
    construccion: {
      sistema_constructivo: "Panel SIP estructural de alta eficiencia",
      estructura: "Paneles SIP estructurales de 160 mm",
      techumbre: "Cubierta a 4 aguas en plancha de acero PV4 anticorrosión",
      muros_exteriores: "Revestimiento mixto madera impregnada y paneles metálicos",
      muros_interiores: "Planchas de yeso-cartón Volcanita 15 mm enlucidas",
      piso_interior: "Radier de hormigón armado con barrera aislante",
      dimensiones: "12.45 m × 11.68 m",
      plano_url: "/ejemplos/images/modelo_roble_plano_raw.jpeg",
      pdf_url: "/ejemplos/pdf/modelo-roble-andino-115m2.pdf",
      estilo: "Contemporáneo Minimalista"
    },
    aislacion: {
      termica: "Poliestireno expandido de alta densidad (EPS 15 kg/m³)",
      acustica: "Barrera acústica de alta atenuación en tabiques divisorios",
      condensacion: "Membrana respirable e hidrófuga perimetral Tyvek",
      zona_climatica: "Zona Centro-Sur (apto para todo Chile)"
    },
    terminaciones: {
      ventanas: "Termopanel PVC línea europea con doble vidriado hermético",
      puertas_exteriores: "Madera sólida tratada con cerradura multipunto de seguridad",
      puertas_interiores: "Puertas enchapadas HDF lacadas",
      cocina: "Muebles aéreos y base con cubierta de cuarzo e isla",
      bano_principal: "Sanitarios ecológicos de doble descarga y grifería de alta gama",
      pisos: "Piso vinílico SPC impermeable de alto tráfico"
    },
    logistica: {
      que_incluye: "Kit de construcción certificado con opción de armado llave en mano en terreno"
    },
    soporte: {
      garantia_estructura: "10 Años de garantía estructural"
    },
    especificaciones: {
      "Superficie Construida": "120 m²",
      "Superficie Útil": "115 m²",
      "Dormitorios": "2 amplios dormitorios",
      "Baños": "1 baño completo",
      "Dimensiones": "12.45 m × 11.68 m",
      "Sistema": "Panel SIP 160 mm",
      "Cubierta": "4 aguas metálica PV4",
      "Aislación": "EPS alta densidad certificado",
      "Garantía": "10 años estructural"
    },
    constructora: CONSTRUCTORA_MASTER_DATA
  },
  {
    id: "master-valle-central",
    constructora_id: CONSTRUCTORA_MASTER_DATA.id,
    nombre: "Modelo Valle Central",
    slug: "modelo-valle-central-112m2",
    tipo: "steel-framing",
    superficie_m2: 112,
    dormitorios: 2,
    banos: 1,
    precio_desde_uf: 0,
    imagenes_urls: [
      "/ejemplos/images/modelo_valle_render_raw.png",
      "/ejemplos/images/modelo_valle_plano_raw.jpeg"
    ],
    tiempo_entrega: "60 a 75 días",
    descripcion: "Diseño alargado de 112 m² (106 m² útiles) con estética industrial moderna, ideal para parcelas. Destaca por su fachada en acero corrugado negro mate combinada con un cálido pórtico de acceso en madera nativa y ventanales termopanel de piso a cielo para máxima ganancia solar.",
    disponible: true,
    garantia_anos: 10,
    postventa: true,
    visitas: 92,
    uso: "Vivienda Familiar / Parcela de Agrado",
    pisos: 1,
    codigo_modelo: "MVC-112",
    is_featured: true,
    featured_order: 2,
    recintos: [
      "Gran Living-Comedor longitudinal con vista panorámica",
      "Cocina americana integrada con barra desayunadora",
      "Pórtico de acceso en madera nativa",
      "Dormitorio Principal amplio con ventanal",
      "Dormitorio Secundario multifuncional",
      "Baño familiar completo con ducha amplia",
      "Logia y sector de lavandería independiente"
    ],
    construccion: {
      sistema_constructivo: "Steel Framing / Metalcom estructural galvanizado",
      estructura: "Perfiles de acero galvanizado liviano C y U de alta resistencia",
      techumbre: "Planchas de acero corrugado Zincalum prepintado negro mate",
      muros_exteriores: "Chapa de acero ondulada y enlistonado de madera tratada",
      muros_interiores: "Tabiquería doble con aislamiento acústico",
      piso_interior: "Losa radier de hormigón pulido o envigado estructural",
      dimensiones: "14.48 m × 8.28 m",
      plano_url: "/ejemplos/images/modelo_valle_plano_raw.jpeg",
      pdf_url: "/ejemplos/pdf/modelo-valle-central-112m2.pdf",
      estilo: "Industrial Moderno"
    },
    aislacion: {
      termica: "Lana de roca mineral basáltica continua de 100 mm",
      acustica: "Aislación R100 certificada en tabiques y cielos",
      condensacion: "Barrera perimetral hidrófuga y control de vapor",
      zona_climatica: "Valle Central, Costa y Zonas Interiores"
    },
    terminaciones: {
      ventanas: "Ventanales Termopanel de aluminio anodizado negro",
      puertas_exteriores: "Puerta de acero reforzado con revestimiento en madera nativa",
      puertas_interiores: "Puertas enchapadas contemporáneas",
      cocina: "Muebles modernos en melamina textil y cubiertas de granito",
      bano_principal: "Shower door en cristal templado y grifería monomando",
      pisos: "Porcelanato rectificado de fácil mantención"
    },
    logistica: {
      que_incluye: "Ingeniería de detalle, perfiles preconfeccionados y armado en obra"
    },
    soporte: {
      garantia_estructura: "10 Años de garantía estructural"
    },
    especificaciones: {
      "Superficie Construida": "112 m²",
      "Superficie Útil": "106 m²",
      "Dormitorios": "2 dormitorios",
      "Baños": "1 baño completo",
      "Dimensiones": "14.48 m × 8.28 m",
      "Sistema": "Steel Framing galvanizado",
      "Fachada": "Acero corrugado y madera",
      "Eficiencia": "Lana de roca continua R100",
      "Garantía": "10 años estructural"
    },
    constructora: CONSTRUCTORA_MASTER_DATA
  },
  {
    id: "master-cordillera",
    constructora_id: CONSTRUCTORA_MASTER_DATA.id,
    nombre: "Modelo Cordillera",
    slug: "modelo-cordillera-92m2",
    tipo: "modular",
    superficie_m2: 92,
    dormitorios: 2,
    banos: 2,
    precio_desde_uf: 0,
    imagenes_urls: [
      "/ejemplos/images/modelo_cordillera_render_raw.png",
      "/ejemplos/images/modelo_cordillera_plano_raw.jpeg"
    ],
    tiempo_entrega: "45 a 60 días",
    descripcion: "Planta modular vanguardista de 92 m² (90 m² útiles) con 2 dormitorios y 2 baños completos. Volumetría limpia de cubierta plana optimizada para montaje express y máxima eficiencia energética. Perfecta para terrenos con pendientes o de acceso restringido en zonas cordilleranas y del sur.",
    disponible: true,
    garantia_anos: 10,
    postventa: true,
    visitas: 110,
    uso: "Vivienda Modular / Casa de Montaña",
    pisos: 1,
    codigo_modelo: "MCO-92",
    is_featured: true,
    featured_order: 3,
    recintos: [
      "Estar-Comedor integrado con ventanales hacia paisaje",
      "Cocina moderna lineal con mesón auxiliar",
      "Dormitorio Principal en Suite con baño privado",
      "Segundo Dormitorio con capacidad para 2 camas",
      "Segundo Baño completo para visitas",
      "Espacio closet técnico y lavandería",
      "Deck exterior modular integrado"
    ],
    construccion: {
      sistema_constructivo: "Módulos prefabricados de precisión milimétrica",
      estructura: "Chasis de acero estructural y panelería perimetral SIP",
      techumbre: "Membrana monocapa EPDM / TPO impermeable con pendiente oculta",
      muros_exteriores: "Revestimiento arquitectónico liso hidrófugo y panel compuesto",
      muros_interiores: "Planchas de yeso-cartón con pintura esmalte lavable",
      piso_interior: "Plataforma modular con aislación inferior reforzada",
      dimensiones: "6.65 m × 14.68 m",
      plano_url: "/ejemplos/images/modelo_cordillera_plano_raw.jpeg",
      pdf_url: "/ejemplos/pdf/modelo-cordillera-92m2.pdf",
      estilo: "Modular Contemporáneo"
    },
    aislacion: {
      termica: "Panel SIP 160 mm alta densidad térmica",
      acustica: "Tabiquería doble con fonoabsorbente",
      condensacion: "Control higrotérmico inteligente y barreras certificadas",
      zona_climatica: "Cordillera, Lagos y Zonas Australes"
    },
    terminaciones: {
      ventanas: "Termopanel PVC antracita con doble vidriado hermético",
      puertas_exteriores: "Puerta termoaislada de alta seguridad",
      puertas_interiores: "Puertas acústicas interiores de diseño enrasado",
      cocina: "Muebles modulares con cierre suave y cubiertas antibacterianas",
      bano_principal: "Vanitorio suspendido con grifería monomando y porcelanato",
      pisos: "Piso vinílico SPC de alta resistencia al agua y desgaste"
    },
    logistica: {
      que_incluye: "Montaje sobre pilotes o fundaciones corridas en 45 a 60 días"
    },
    soporte: {
      garantia_estructura: "10 Años de garantía estructural"
    },
    especificaciones: {
      "Superficie Construida": "92 m²",
      "Superficie Útil": "90 m²",
      "Dormitorios": "2 dormitorios (1 suite)",
      "Baños": "2 baños completos",
      "Dimensiones": "6.65 m × 14.68 m",
      "Sistema": "Modular SIP de alta eficiencia",
      "Cubierta": "Plana oculta con membrana EPDM",
      "Entrega": "45 a 60 días montaje rápido",
      "Garantía": "10 años estructural"
    },
    constructora: CONSTRUCTORA_MASTER_DATA
  },
  {
    id: "master-alerce-austral",
    constructora_id: CONSTRUCTORA_MASTER_DATA.id,
    nombre: "Modelo Alerce Austral",
    slug: "modelo-alerce-austral-80m2",
    tipo: "prefabricada",
    superficie_m2: 80,
    dormitorios: 2,
    banos: 2,
    precio_desde_uf: 0,
    imagenes_urls: [
      "/ejemplos/images/modelo_alerce_render_raw.png",
      "/ejemplos/images/modelo_alerce_plano_raw.jpeg"
    ],
    tiempo_entrega: "45 a 60 días",
    descripcion: "Acogedora vivienda de 80 m² (78 m² útiles) de arquitectura tradicional chilena en siding blanco. Cuenta con 2 dormitorios, 2 baños completos y una luminosa doble puerta vidriada que conecta la sala de estar hacia el jardín posterior. Máximo confort térmico en climas fríos y lluviosos del sur de Chile.",
    disponible: true,
    garantia_anos: 10,
    postventa: true,
    visitas: 78,
    uso: "Vivienda Familiar / Campo / Parcela",
    pisos: 1,
    codigo_modelo: "MAA-80",
    is_featured: true,
    featured_order: 4,
    recintos: [
      "Living-Comedor con doble puerta vidriada a terraza",
      "Cocina americana funcional",
      "Dormitorio Matrimonial en Suite con baño privado",
      "Segundo Dormitorio amplio con closet",
      "Baño familiar completo",
      "Hall de entrada techado con porche colonial"
    ],
    construccion: {
      sistema_constructivo: "Madera tratada y tabiquería reforzada",
      estructura: "Pino impregnado en autoclave seco y panelería SIP",
      techumbre: "Teja asfáltica gravillada anticorrosión de alta pendiente",
      muros_exteriores: "Siding de fibrocemento blanco durable y de bajo mantenimiento",
      muros_interiores: "Revestimiento interior volcanita con pintura esmalte lavable",
      piso_interior: "Envigado de madera reforzado o radier de hormigón",
      dimensiones: "13.67 m × 7.57 m",
      plano_url: "/ejemplos/images/modelo_alerce_plano_raw.jpeg",
      pdf_url: "/ejemplos/pdf/modelo-alerce-austral-80m2.pdf",
      estilo: "Tradicional Chilena"
    },
    aislacion: {
      termica: "Lana de vidrio fisurada con barrera de vapor aluminizada",
      acustica: "Barrera fonoaislante en tabiques de dormitorios",
      condensacion: "Fieltro asfáltico y barrera de viento microporosa",
      zona_climatica: "Sur de Chile (La Araucanía, Los Ríos, Los Lagos, Aysén)"
    },
    terminaciones: {
      ventanas: "Termopanel blanco de alta hermeticidad contra viento y lluvia",
      puertas_exteriores: "Puerta de pino oregón con vidrios biselados",
      puertas_interiores: "Puertas placa con marcos de madera nativa",
      cocina: "Muebles de cocina con cubierta postformada resistente a humedad",
      bano_principal: "Baño completo con tina y cerámicos esmaltados",
      pisos: "Piso flotante 8 mm de alto tráfico y cerámico en zonas húmedas"
    },
    logistica: {
      que_incluye: "Kit completo de armado rápido con manual de montaje e inspección"
    },
    soporte: {
      garantia_estructura: "10 Años de garantía estructural"
    },
    especificaciones: {
      "Superficie Construida": "80 m²",
      "Superficie Útil": "78 m²",
      "Dormitorios": "2 dormitorios (1 en suite)",
      "Baños": "2 baños completos",
      "Dimensiones": "13.67 m × 7.57 m",
      "Sistema": "Prefabricada madera tratada y SIP",
      "Fachada": "Siding blanco tradicional",
      "Aislación": "Lana de vidrio fisurada con barrera vapor",
      "Garantía": "10 años estructural"
    },
    constructora: CONSTRUCTORA_MASTER_DATA
  },
  {
    id: "master-costa-brava",
    constructora_id: CONSTRUCTORA_MASTER_DATA.id,
    nombre: "Modelo Costa Brava",
    slug: "modelo-costa-brava-78m2",
    tipo: "prefabricada",
    superficie_m2: 78,
    dormitorios: 3,
    banos: 1,
    precio_desde_uf: 0,
    imagenes_urls: [
      "/ejemplos/images/modelo_costa_render_raw.png",
      "/ejemplos/images/modelo_costa_plano_raw.jpeg"
    ],
    tiempo_entrega: "45 a 60 días",
    descripcion: "La solución familiar definitiva en 78 m² (77 m² útiles): 3 cómodos dormitorios, baño central sectorizado, cocina abierta con mesón y amplia sala de estar con iluminación natural cruzada. Ideal tanto como primera vivienda familiar o casa de descanso de fin de semana en costa o campo.",
    disponible: true,
    garantia_anos: 10,
    postventa: true,
    visitas: 65,
    uso: "Vivienda Familiar / Casa de Playa o Campo",
    pisos: 1,
    codigo_modelo: "MCB-78",
    is_featured: true,
    featured_order: 5,
    recintos: [
      "Estar-Comedor espacioso con gran luminosidad",
      "Cocina americana con mesón desayunador",
      "Dormitorio Principal amplio con espacio para closet",
      "Segundo Dormitorio matrimonial o dos camas",
      "Tercer Dormitorio individual o home office",
      "Baño completo sectorizado de fácil acceso",
      "Porche exterior de acceso cubierto"
    ],
    construccion: {
      sistema_constructivo: "Panelizado prefabricado tradicional rápido",
      estructura: "Pino seleccionado secado en cámara 2x4 tratado",
      techumbre: "Cubierta metálica ondulada anticorrosiva Zincalum",
      muros_exteriores: "Madera tratada Smartside / Tinglado horizontal",
      muros_interiores: "Tabiquería de madera con planchas de yeso-cartón",
      piso_interior: "Plataforma de madera ventilada o radier de hormigón",
      dimensiones: "15.85 m × 6.45 m",
      plano_url: "/ejemplos/images/modelo_costa_plano_raw.jpeg",
      pdf_url: "/ejemplos/pdf/modelo-costa-brava-78m2.pdf",
      estilo: "Familiar 3 Dormitorios"
    },
    aislacion: {
      termica: "Aislapol de alta densidad en paneles perimetrales",
      acustica: "Aislamiento fonoabsorbente en tabiquería divisoria",
      condensacion: "Papel fieltro 15 lbs hidrófugo",
      zona_climatica: "Costa, Valle Central y Zonas Templadas"
    },
    terminaciones: {
      ventanas: "Ventanas de aluminio herméticas con cierre multipunto",
      puertas_exteriores: "Puerta sólida en madera nativa tratada",
      puertas_interiores: "Puertas interiores estándar barnizadas",
      cocina: "Mesón americano integrado con lavaplatos de acero inoxidable",
      bano_principal: "Revestimiento cerámico y grifería monomando",
      pisos: "Cerámica en zonas húmedas y piso vinílico en dormitorios"
    },
    logistica: {
      que_incluye: "Paneles rotulados listos para montaje en cualquier región de Chile"
    },
    soporte: {
      garantia_estructura: "10 Años de garantía estructural"
    },
    especificaciones: {
      "Superficie Construida": "78 m²",
      "Superficie Útil": "77 m²",
      "Dormitorios": "3 dormitorios",
      "Baños": "1 baño completo",
      "Dimensiones": "15.85 m × 6.45 m",
      "Sistema": "Prefabricada modular rápida",
      "Distribución": "Concepto abierto 3 dormitorios",
      "Garantía": "10 años estructural"
    },
    constructora: CONSTRUCTORA_MASTER_DATA
  },
  {
    id: "master-loft-arrayan",
    constructora_id: CONSTRUCTORA_MASTER_DATA.id,
    nombre: "Modelo Loft Arrayán",
    slug: "modelo-loft-arrayan-74m2",
    tipo: "madera",
    superficie_m2: 74,
    dormitorios: 2,
    banos: 2,
    precio_desde_uf: 0,
    imagenes_urls: [
      "/ejemplos/images/modelo_loft_render_raw.png",
      "/ejemplos/images/modelo_loft_plano_raw.jpeg"
    ],
    tiempo_entrega: "60 a 90 días",
    descripcion: "Cabaña contemporánea estilo alpino escandinavo con revestimiento en madera vertical y techo de fuerte pendiente. Cuenta con 74 m² (70 m² útiles) distribuidos con espacio en doble altura, altillo panorámico, 2 baños completos y deck exterior. Ideal para parcelas de bosque, lago o cordillera en el sur de Chile.",
    disponible: true,
    garantia_anos: 10,
    postventa: true,
    visitas: 125,
    uso: "Cabaña Alpina / Refugio de Montaña / Parcela",
    pisos: 2,
    codigo_modelo: "MLA-74",
    is_featured: true,
    featured_order: 6,
    recintos: [
      "Living con doble altura y espacio para chimenea o estufa a leña",
      "Cocina integrada con barra americana en madera",
      "Dormitorio en altillo / loft panorámico en planta alta",
      "Dormitorio secundario en planta baja",
      "2 Baños completos con grifería negra mate",
      "Deck exterior de madera integrado"
    ],
    construccion: {
      sistema_constructivo: "Arquitectura Alpina / A-Frame contemporánea en madera y SIP",
      estructura: "Vigas de madera laminada estructural y paneles SIP perimetrales",
      techumbre: "Planchas de zinc prepintado negro mate a dos aguas con fuerte caída",
      muros_exteriores: "Tinglado vertical en madera nativa tratada y pino oregón",
      muros_interiores: "Madera machihembrada a la vista combinada con volcanita",
      piso_interior: "Envigado de madera maciza reforzada con aislante",
      dimensiones: "9.75 m × 9.25 m",
      plano_url: "/ejemplos/images/modelo_loft_plano_raw.jpeg",
      pdf_url: "/ejemplos/pdf/modelo-loft-arrayan-74m2.pdf",
      estilo: "Alpino Escandinavo"
    },
    aislacion: {
      termica: "Aislación R300 en cubierta y muros exteriores",
      acustica: "Excelente confort fónico bajo lluvia intensa y viento",
      condensacion: "Membrana transpirable hidrófuga perimetral",
      zona_climatica: "Lagos, Bosques y Cordillera Austral"
    },
    terminaciones: {
      ventanas: "Termopanel antracita de gran formato de piso a cielo",
      puertas_exteriores: "Puerta rústica de madera nativa maciza",
      puertas_interiores: "Puertas correderas estilo granero rústico",
      cocina: "Muebles rústicos modernos con cubierta de madera vitrificada",
      bano_principal: "Vanitorio artesanal con cubierta de ciprés y shower door",
      pisos: "Madera vitrificada y porcelanato en zonas húmedas"
    },
    logistica: {
      que_incluye: "Estructura modular preconfeccionada para montaje en terrenos difíciles"
    },
    soporte: {
      garantia_estructura: "10 Años de garantía estructural"
    },
    especificaciones: {
      "Superficie Construida": "74 m²",
      "Superficie Útil": "70 m²",
      "Dormitorios": "2 dormitorios (1 loft altillo)",
      "Baños": "2 baños completos",
      "Dimensiones": "9.75 m × 9.25 m",
      "Sistema": "Alpina madera laminada y SIP",
      "Niveles": "2 Plantas (Doble altura)",
      "Garantía": "10 años estructural"
    },
    constructora: CONSTRUCTORA_MASTER_DATA
  },
  {
    id: "master-pradera-cottage",
    constructora_id: CONSTRUCTORA_MASTER_DATA.id,
    nombre: "Modelo Pradera Cottage",
    slug: "modelo-pradera-cottage-86m2",
    tipo: "sip",
    superficie_m2: 86,
    dormitorios: 2,
    banos: 2,
    precio_desde_uf: 0,
    imagenes_urls: [
      "/ejemplos/images/modelo_pradera_render_raw.png",
      "/ejemplos/images/modelo_pradera_plano_raw.jpeg"
    ],
    tiempo_entrega: "60 a 75 días",
    descripcion: "Estética clásica y sobria estilo cottage campestre en 86 m² (82 m² útiles). Destaca por su elegante zócalo decorativo de mampostería en piedra, ventanas coloniales y cubierta a dos aguas. Distribución de 2 dormitorios y 2 baños completos para máxima privacidad, calidez y eficiencia térmica.",
    disponible: true,
    garantia_anos: 10,
    postventa: true,
    visitas: 73,
    uso: "Vivienda Campestre / Parcela de Agrado",
    pisos: 1,
    codigo_modelo: "MPC-86",
    is_featured: true,
    featured_order: 7,
    recintos: [
      "Living acogedor con espacio para chimenea",
      "Comedor amplio conectado a cocina",
      "Cocina con despensa y mesón auxiliar",
      "Dormitorio Principal con baño privado en suite",
      "Segundo Dormitorio espacioso",
      "Segundo Baño completo para visitas",
      "Porche de acceso colonial techado"
    ],
    construccion: {
      sistema_constructivo: "Panel SIP estructural con zócalo de piedra decorativo",
      estructura: "Paneles SIP estructurales termoacústicos de 160 mm",
      techumbre: "Teja asfáltica color pizarra sobre tablero estructural",
      muros_exteriores: "Siding texturado gris cálido y zócalo inferior en piedra",
      muros_interiores: "Planchas de yeso-cartón Volcanita con pintura esmalte al agua",
      piso_interior: "Radier de hormigón aislado con barrera de vapor",
      dimensiones: "12.70 m × 8.38 m",
      plano_url: "/ejemplos/images/modelo_pradera_plano_raw.jpeg",
      pdf_url: "/ejemplos/pdf/modelo-pradera-cottage-86m2.pdf",
      estilo: "Cottage Campestre"
    },
    aislacion: {
      termica: "Panel SIP continuo libre de puentes térmicos",
      acustica: "Aislación acústica certificada en tabiques divisorios",
      condensacion: "Barrera de vapor continua y ventilación cruzada",
      zona_climatica: "Zona Centro-Sur y Campos Chilenos"
    },
    terminaciones: {
      ventanas: "Ventanas termopanel con palillaje colonial clásico",
      puertas_exteriores: "Puerta de roble macizo con herrajes forjados artesanales",
      puertas_interiores: "Puertas moldeadas blancas con molduras coloniales",
      cocina: "Cocina estilo shaker con cubierta de granito natural",
      bano_principal: "Baño completo en suite con vanitorio de doble seno",
      pisos: "Piso flotante madera rústica y cerámica artesanal en baños y cocina"
    },
    logistica: {
      que_incluye: "Kit constructivo llave en mano con fundaciones y terminaciones completas"
    },
    soporte: {
      garantia_estructura: "10 Años de garantía estructural"
    },
    especificaciones: {
      "Superficie Construida": "86 m²",
      "Superficie Útil": "82 m²",
      "Dormitorios": "2 dormitorios (1 suite)",
      "Baños": "2 baños completos",
      "Dimensiones": "12.70 m × 8.38 m",
      "Sistema": "Panel SIP y mampostería",
      "Fachada": "Siding gris y zócalo de piedra",
      "Estilo": "Cottage Campestre",
      "Garantía": "10 años estructural"
    },
    constructora: CONSTRUCTORA_MASTER_DATA
  }
];
