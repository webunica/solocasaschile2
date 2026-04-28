export type SeoIntentPage = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  eyebrow: string;
  primaryKeyword: string;
  keywords: string[];
  type?: string;
  catalogHref: string;
  secondaryHref: string;
  secondaryLabel: string;
  sections: {
    title: string;
    body: string;
  }[];
  checklist?: string[];
  processSteps?: {
    title: string;
    detail: string;
  }[];
  costItems?: {
    label: string;
    detail: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
};

export const SEO_INTENT_PAGES: SeoIntentPage[] = [
  {
    slug: "construccion-casas-prefabricadas",
    title: "Construccion de Casas Prefabricadas en Chile | Guia y Constructoras",
    h1: "Construccion de casas prefabricadas en Chile",
    description:
      "Guia para planificar la construccion de casas prefabricadas en Chile: sistemas, permisos, plazos, costos y constructoras verificadas.",
    eyebrow: "Guia de construccion",
    primaryKeyword: "construccion de casas prefabricadas",
    keywords: [
      "construccion de casas prefabricadas",
      "construccion casas prefabricadas chile",
      "constructoras casas prefabricadas",
      "casas prefabricadas chile",
    ],
    type: "prefabricada",
    catalogHref: "/catalogo?tipo=prefabricada",
    secondaryHref: "/constructoras",
    secondaryLabel: "Ver constructoras",
    sections: [
      {
        title: "Que revisar antes de construir",
        body:
          "Antes de construir una casa prefabricada conviene definir terreno, presupuesto total, sistema constructivo, fundaciones, conexiones sanitarias, permisos municipales y nivel de terminaciones. Comparar solo el precio base puede dejar fuera costos importantes.",
      },
      {
        title: "Por que comparar constructoras",
        body:
          "Cada empresa trabaja con estandares, plazos y alcances distintos. En SolocasasChile puedes revisar modelos, regiones de cobertura y datos de cada constructora antes de avanzar a cotizacion.",
      },
    ],
    faqs: [
      {
        question: "Cuanto demora la construccion de una casa prefabricada?",
        answer:
          "El montaje puede tomar desde algunas semanas, pero el proyecto completo depende de permisos, fundaciones, instalaciones y terminaciones. Un rango realista suele ir de 2 a 6 meses segun alcance y municipio.",
      },
      {
        question: "La casa prefabricada necesita permiso municipal?",
        answer:
          "Si. Una vivienda permanente requiere permiso de edificacion y recepcion final igual que una construccion tradicional.",
      },
      {
        question: "Que incluye una cotizacion de construccion?",
        answer:
          "Debe indicar superficie, sistema constructivo, fundaciones, instalaciones, terminaciones, transporte, montaje, permisos incluidos y exclusiones relevantes.",
      },
    ],
  },
  {
    slug: "construir-casa-prefabricada",
    title: "Construir Casa Prefabricada en Chile | Pasos, Costos y Modelos",
    h1: "Construir casa prefabricada en Chile",
    description:
      "Conoce los pasos para construir una casa prefabricada en Chile, compara modelos disponibles y cotiza con constructoras verificadas.",
    eyebrow: "Intencion de proyecto",
    primaryKeyword: "construir casa prefabricada",
    keywords: [
      "construir casa prefabricada",
      "construir casa prefabricada chile",
      "como construir casa prefabricada",
      "casas prefabricadas llave en mano",
    ],
    type: "prefabricada",
    catalogHref: "/catalogo?tipo=prefabricada",
    secondaryHref: "/casas-prefabricadas",
    secondaryLabel: "Guia casas prefabricadas",
    sections: [
      {
        title: "Ruta recomendada para empezar",
        body:
          "Parte por elegir un rango de metros cuadrados, dormitorios y presupuesto UF. Luego compara sistemas constructivos, revisa si la constructora opera en tu region y solicita cotizacion con el mismo alcance para comparar de forma justa.",
      },
      {
        title: "Costos que no debes olvidar",
        body:
          "Ademas del modelo, considera fundaciones, traslado, empalmes electricos, agua, alcantarillado o fosa, permisos DOM, estudio de suelo y eventuales obras exteriores.",
      },
    ],
    checklist: [
      "Certificado de informaciones previas del terreno.",
      "Factibilidad de agua, electricidad y solucion sanitaria.",
      "Alcance de fundaciones, traslado, montaje y terminaciones.",
      "Carpeta tecnica para permiso de edificacion y recepcion final.",
      "Garantias, mantenciones exigidas y tiempos de respuesta postventa.",
    ],
    processSteps: [
      {
        title: "1. Validar terreno y normativa",
        detail:
          "Confirma uso de suelo, constructibilidad, accesos y factibilidad de servicios antes de elegir modelo. Esta etapa evita cotizar una vivienda que luego no pueda aprobarse.",
      },
      {
        title: "2. Elegir sistema y alcance",
        detail:
          "Define si buscas kit, obra gruesa, terminaciones parciales o llave en mano. Dos cotizaciones pueden parecer similares, pero cambiar mucho por lo que incluyen.",
      },
      {
        title: "3. Comparar cotizaciones equivalentes",
        detail:
          "Pide que todas las empresas coticen el mismo metraje, fundacion, ventanas, aislacion, instalaciones y transporte para comparar UF reales y no solo precios base.",
      },
      {
        title: "4. Tramitar permisos y ejecutar obra",
        detail:
          "La constructora o profesional patrocinante debe coordinar permiso DOM, especialidades, montaje, inspecciones y recepcion final segun el municipio.",
      },
    ],
    costItems: [
      {
        label: "Construccion base",
        detail:
          "Estructura, paneles o modulos, cubierta, revestimientos principales y mano de obra segun el sistema elegido.",
      },
      {
        label: "Costos de terreno",
        detail:
          "Fundaciones, nivelacion, accesos, estudio de suelo, empalmes y obras exteriores pueden cambiar mucho el presupuesto final.",
      },
      {
        label: "Permisos y profesionales",
        detail:
          "Arquitectura, calculo, especialidades, derechos municipales y tramitacion DOM deben considerarse desde el inicio.",
      },
    ],
    faqs: [
      {
        question: "Puedo construir una casa prefabricada en cualquier terreno?",
        answer:
          "No siempre. El terreno debe permitir uso habitacional y cumplir condiciones urbanisticas, acceso, factibilidad sanitaria y electrica.",
      },
      {
        question: "Conviene construir prefabricada o tradicional?",
        answer:
          "La prefabricada suele ser mas rapida y predecible, especialmente cuando el modelo esta estandarizado. La tradicional puede ser mas flexible en proyectos muy personalizados.",
      },
      {
        question: "Donde comparar modelos para construir?",
        answer:
          "Puedes revisar el catalogo de SolocasasChile y filtrar por tipo, precio, superficie y region antes de pedir cotizaciones.",
      },
    ],
  },
  {
    slug: "comprar-casa-prefabricada",
    title: "Comprar Casa Prefabricada en Chile | Modelos y Constructoras",
    h1: "Comprar casa prefabricada en Chile",
    description:
      "Compara modelos para comprar casa prefabricada en Chile. Revisa precios referenciales, superficies y constructoras antes de cotizar.",
    eyebrow: "Busqueda comercial",
    primaryKeyword: "comprar casa prefabricada",
    keywords: [
      "comprar casa prefabricada",
      "comprar casa prefabricada chile",
      "venta casas prefabricadas",
      "casas prefabricadas precios chile",
    ],
    type: "prefabricada",
    catalogHref: "/catalogo?tipo=prefabricada&sort=price_asc",
    secondaryHref: "/modelos-casas-prefabricadas",
    secondaryLabel: "Ver modelos",
    sections: [
      {
        title: "Como comprar con menos incertidumbre",
        body:
          "Compara modelos por precio desde UF, metros cuadrados, dormitorios, tiempo de entrega y reputacion de la constructora. Pide que cada cotizacion detalle inclusiones y exclusiones.",
      },
      {
        title: "Que significa precio desde",
        body:
          "El precio desde sirve para comparar alternativas, pero el valor final puede cambiar por region, transporte, fundaciones, terminaciones, permisos y obras complementarias.",
      },
    ],
    checklist: [
      "Comparar precio desde UF y precio llave en mano por separado.",
      "Revisar superficie util, dormitorios, banos y posibilidades de ampliacion.",
      "Confirmar si incluye transporte, montaje, fundaciones e instalaciones.",
      "Pedir especificaciones de aislacion, ventanas, cubierta y revestimientos.",
      "Solicitar contrato, garantia, plazos, forma de pago y exclusiones.",
    ],
    processSteps: [
      {
        title: "1. Filtrar modelos que calzan con tu presupuesto",
        detail:
          "Usa el precio desde como primera referencia, pero deja margen para terreno, permisos, fundaciones y terminaciones.",
      },
      {
        title: "2. Revisar ficha tecnica y alcance",
        detail:
          "La ficha debe aclarar sistema constructivo, m2, recintos, materiales, plazo estimado, garantia y si el modelo es modificable.",
      },
      {
        title: "3. Cotizar con datos del terreno",
        detail:
          "Una cotizacion seria necesita region, comuna, accesos, pendiente, factibilidad de servicios y expectativas de terminacion.",
      },
      {
        title: "4. Comparar condiciones comerciales",
        detail:
          "Evalua pagos por hito, multas por atraso, garantia, postventa y respaldo de la constructora antes de reservar.",
      },
    ],
    costItems: [
      {
        label: "Precio del modelo",
        detail:
          "Valor referencial de la vivienda segun metraje, sistema constructivo y terminaciones base informadas por la empresa.",
      },
      {
        label: "Entrega en terreno",
        detail:
          "Transporte, grua, montaje, viaticos y dificultad de acceso pueden variar por region y comuna.",
      },
      {
        label: "Habilitacion final",
        detail:
          "Conexiones, fundaciones, permisos, artefactos, cierres y obras exteriores suelen explicar la diferencia entre precio desde y costo final.",
      },
    ],
    faqs: [
      {
        question: "Se compra la casa lista o se contrata la construccion?",
        answer:
          "Depende de la empresa. Algunos modelos se venden como kit, otros incluyen montaje y otros se ofrecen llave en mano.",
      },
      {
        question: "Puedo cotizar con varias empresas?",
        answer:
          "Si. Comparar varias cotizaciones ayuda a detectar diferencias de alcance y condiciones comerciales.",
      },
      {
        question: "Que documentos pedir antes de comprar?",
        answer:
          "Solicita especificaciones tecnicas, contrato, garantia, plazos, forma de pago, exclusiones y antecedentes de proyectos ejecutados.",
      },
    ],
  },
  {
    slug: "construir-casa-sip",
    title: "Construir Casa SIP en Chile | Panel SIP, Costos y Ventajas",
    h1: "Construir casa SIP en Chile",
    description:
      "Guia para construir casa SIP en Chile: ventajas termicas, plazos, permisos y modelos de panel SIP para cotizar.",
    eyebrow: "Sistema SIP",
    primaryKeyword: "construir casa SIP",
    keywords: [
      "construir casa sip",
      "construir casa sip chile",
      "casas sip",
      "panel sip chile",
    ],
    type: "sip",
    catalogHref: "/catalogo?tipo=sip",
    secondaryHref: "/casas-paneles-sip",
    secondaryLabel: "Guia Casas SIP",
    sections: [
      {
        title: "Por que elegir SIP para construir",
        body:
          "El panel SIP combina estructura y aislacion en un sistema liviano, rapido de montar y eficiente termicamente. Es una alternativa atractiva para zonas con alta demanda de calefaccion o cambios de temperatura.",
      },
      {
        title: "Puntos tecnicos a confirmar",
        body:
          "Revisa espesor de panel, tipo de OSB, densidad del nucleo, tratamiento de uniones, control de humedad, cubierta, ventilacion y cumplimiento normativo.",
      },
    ],
    checklist: [
      "Espesor del panel SIP y densidad del nucleo aislante.",
      "Tipo de OSB, tratamiento de cantos y proteccion frente a humedad.",
      "Detalle de uniones, sellos, barreras de vapor y ventilacion.",
      "Especificacion de ventanas, cubierta y aislacion complementaria.",
      "Carpeta tecnica para permiso DOM y calculo estructural.",
    ],
    processSteps: [
      {
        title: "1. Definir exigencia termica por region",
        detail:
          "Una casa SIP en el sur, cordillera o zonas con alta oscilacion termica debe priorizar continuidad de aislacion, control de humedad y ventilacion.",
      },
      {
        title: "2. Comparar especificaciones del panel",
        detail:
          "No todos los paneles SIP son iguales. Pide espesor, materialidad, densidad del nucleo, certificaciones y recomendaciones de mantencion.",
      },
      {
        title: "3. Revisar detalles constructivos",
        detail:
          "Los puntos criticos suelen estar en encuentros, vanos, cubierta, sobrecimientos y sellos. Un buen detalle evita filtraciones y puentes termicos.",
      },
      {
        title: "4. Cotizar con alcance completo",
        detail:
          "Solicita que la cotizacion separe estructura SIP, terminaciones, ventanas, fundaciones, transporte, montaje e instalaciones.",
      },
    ],
    costItems: [
      {
        label: "Paneles y estructura",
        detail:
          "Incluye panel SIP, tabiqueria, conectores, cortes, montaje estructural y elementos de arriostramiento segun calculo.",
      },
      {
        label: "Envolvente eficiente",
        detail:
          "Ventanas, sellos, barreras, cubierta y aislaciones complementarias influyen directamente en confort y consumo energetico.",
      },
      {
        label: "Terminaciones y permisos",
        detail:
          "Revestimientos, instalaciones, artefactos, tramitacion municipal y recepcion final deben quedar definidos antes de firmar.",
      },
    ],
    faqs: [
      {
        question: "Una casa SIP es apta para vivir todo el ano?",
        answer:
          "Si, siempre que el proyecto resuelva bien aislacion, ventilacion, humedad, instalaciones y terminaciones.",
      },
      {
        question: "Cuanto cuesta construir una casa SIP?",
        answer:
          "El rango depende de m2, terminaciones y region. Muchas referencias parten entre 15 y 25 UF/m2 para construccion, sin incluir todos los costos externos.",
      },
      {
        question: "Las casas SIP requieren permiso?",
        answer:
          "Si, si son vivienda permanente deben tramitar permiso de edificacion y recepcion final.",
      },
    ],
  },
  {
    slug: "comprar-casa-sip",
    title: "Comprar Casa SIP en Chile | Modelos, Precios y Constructoras",
    h1: "Comprar casa SIP en Chile",
    description:
      "Compara modelos de casas SIP en Chile, revisa precios referenciales y cotiza con constructoras que trabajan panel SIP.",
    eyebrow: "Compra informada",
    primaryKeyword: "comprar casa SIP",
    keywords: [
      "comprar casa sip",
      "comprar casa sip chile",
      "modelos casas sip",
      "casas sip precio chile",
    ],
    type: "sip",
    catalogHref: "/catalogo?tipo=sip&sort=price_asc",
    secondaryHref: "/tipos/sip",
    secondaryLabel: "Ver sistema SIP",
    sections: [
      {
        title: "Que comparar antes de comprar",
        body:
          "No compares solo metros cuadrados. Mira espesor y calidad del panel, fundaciones, ventanas, climatizacion, terminaciones, garantia, traslado y experiencia de la constructora.",
      },
      {
        title: "Cuando SIP tiene mas sentido",
        body:
          "SIP suele destacar en climas frios o con alta oscilacion termica, y en proyectos donde el ahorro energetico y la rapidez de montaje son prioridad.",
      },
    ],
    checklist: [
      "Confirmar que el modelo sea realmente SIP y no solo panelizado tradicional.",
      "Revisar espesor de paneles, ventanas y especificacion de cubierta.",
      "Separar precio del modelo, fundaciones, traslado y montaje.",
      "Pedir garantia estructural y recomendaciones de mantencion.",
      "Comparar consumo estimado y confort termico segun region.",
    ],
    processSteps: [
      {
        title: "1. Elegir modelos SIP por uso real",
        detail:
          "No es lo mismo una segunda vivienda que una casa permanente. Dormitorios, calefaccion, orientacion y aislacion cambian la decision.",
      },
      {
        title: "2. Revisar constructora y experiencia",
        detail:
          "Prioriza empresas que muestren proyectos SIP ejecutados, fotos de obra, especificaciones tecnicas y claridad de postventa.",
      },
      {
        title: "3. Pedir cotizacion comparable",
        detail:
          "Solicita que todas las alternativas detallen panel, montaje, ventanas, cubierta, terminaciones y exclusiones para evaluar costo real.",
      },
      {
        title: "4. Validar permisos y recepcion",
        detail:
          "Una compra informada debe incluir ruta de permiso municipal, profesionales responsables y documentos para recepcion final.",
      },
    ],
    costItems: [
      {
        label: "Modelo SIP",
        detail:
          "Precio referencial asociado a superficie, distribucion, paneles, cubierta y terminaciones base del proveedor.",
      },
      {
        label: "Desempeno termico",
        detail:
          "Ventanas, sellos y control de humedad pueden aumentar el presupuesto, pero son claves para que SIP cumpla su promesa.",
      },
      {
        label: "Instalacion en terreno",
        detail:
          "Fundaciones, transporte, montaje, conexiones y accesos del terreno pueden modificar el costo total de compra.",
      },
    ],
    faqs: [
      {
        question: "Las casas SIP son mas caras que otras prefabricadas?",
        answer:
          "Pueden tener un costo inicial mayor que soluciones basicas, pero suelen ofrecer mejor desempeno termico y confort.",
      },
      {
        question: "Puedo ver modelos SIP antes de cotizar?",
        answer:
          "Si. En el catalogo puedes filtrar modelos SIP y revisar superficies, dormitorios y precios referenciales.",
      },
      {
        question: "Que garantia deberia pedir?",
        answer:
          "Pide garantia estructural, garantia de terminaciones y claridad sobre mantenciones requeridas para conservar cobertura.",
      },
    ],
  },
  {
    slug: "modelos-casas-sip",
    title: "Modelos de Casas SIP en Chile | Catalogo Panel SIP",
    h1: "Modelos de casas SIP en Chile",
    description:
      "Explora modelos de casas SIP en Chile y compara superficie, dormitorios, precio desde UF y constructoras con sistema panel SIP.",
    eyebrow: "Catalogo SIP",
    primaryKeyword: "modelo casa SIP",
    keywords: [
      "modelo casa sip",
      "modelos casas sip",
      "modelos de casas sip",
      "casas panel sip modelos",
    ],
    type: "sip",
    catalogHref: "/catalogo?tipo=sip",
    secondaryHref: "/casas-paneles-sip",
    secondaryLabel: "Guia SIP",
    sections: [
      {
        title: "Como elegir un modelo SIP",
        body:
          "Ordena por superficie y programa familiar. Un buen modelo SIP debe equilibrar eficiencia termica, distribucion interior, orientacion solar y presupuesto total.",
      },
      {
        title: "Modelos para distintas regiones",
        body:
          "En el sur conviene priorizar aislacion y control de humedad. En zonas calidas, ventilacion, sombreamiento y orientacion son claves para confort interior.",
      },
    ],
    faqs: [
      {
        question: "Hay modelos SIP de un piso y dos pisos?",
        answer:
          "Si. La oferta puede incluir modelos compactos, familiares y de dos pisos, dependiendo de la constructora.",
      },
      {
        question: "Un modelo SIP se puede modificar?",
        answer:
          "Muchas constructoras permiten ajustes, pero cambios estructurales pueden modificar precio, plazo y permisos.",
      },
      {
        question: "Como cotizar un modelo SIP?",
        answer:
          "Revisa la ficha del modelo y solicita cotizacion con datos de region, terreno, superficie objetivo y nivel de terminaciones.",
      },
    ],
  },
  {
    slug: "construir-tiny-house",
    title: "Construir Tiny House en Chile | Costos, Permisos y Modelos",
    h1: "Construir Tiny House en Chile",
    description:
      "Guia para construir Tiny House en Chile: costos, permisos, modelos, movilidad, terreno y constructoras para cotizar.",
    eyebrow: "Tiny House",
    primaryKeyword: "construir Tiny House",
    keywords: [
      "construir tiny house",
      "construir tiny house chile",
      "tiny house chile precio",
      "mini casas prefabricadas",
    ],
    type: "tiny-house",
    catalogHref: "/catalogo?tipo=tiny-house",
    secondaryHref: "/tipos/tiny-house",
    secondaryLabel: "Ver Tiny Houses",
    sections: [
      {
        title: "Que define una Tiny House",
        body:
          "Una Tiny House suele tener entre 15 y 45 m2, con distribucion optimizada, bajo consumo energetico y foco en vida simple. Puede ser fija o sobre ruedas, lo que cambia su regulacion.",
      },
      {
        title: "Permisos y factibilidad",
        body:
          "Si se instala como vivienda permanente sobre terreno, normalmente requiere permiso municipal. Si es movil, debes revisar normativa local, empalmes y condiciones de uso del lugar.",
      },
    ],
    checklist: [
      "Definir si sera fija, transportable o sobre ruedas.",
      "Confirmar normativa municipal, acceso a servicios y solucion sanitaria.",
      "Revisar aislacion, ventilacion y control de condensacion.",
      "Medir necesidades reales de almacenamiento y equipamiento.",
      "Aclarar transporte, instalacion, nivelacion y conexion a redes.",
    ],
    processSteps: [
      {
        title: "1. Definir modo de uso",
        detail:
          "Una Tiny House para arriendo turistico, segunda vivienda o residencia permanente requiere decisiones distintas de equipamiento y permisos.",
      },
      {
        title: "2. Resolver movilidad y terreno",
        detail:
          "Si va sobre ruedas, revisa restricciones de traslado y estacionamiento. Si sera fija, tratala como una vivienda ante permisos.",
      },
      {
        title: "3. Priorizar confort interior",
        detail:
          "En pocos metros, ventilacion, aislacion, bano, cocina, calefaccion y almacenamiento determinan si la casa funciona en el dia a dia.",
      },
      {
        title: "4. Cotizar instalacion completa",
        detail:
          "Pide precio separado para fabricacion, traslado, grua o nivelacion, conexiones y equipamiento interior.",
      },
    ],
    costItems: [
      {
        label: "Fabricacion compacta",
        detail:
          "Incluye estructura, aislacion, revestimientos, bano, cocina y muebles integrados segun el nivel de equipamiento.",
      },
      {
        label: "Movilidad o fundacion",
        detail:
          "Trailer, ruedas, enganche, transporte o fundacion fija cambian mucho el costo y la regulacion aplicable.",
      },
      {
        label: "Autonomia y conexiones",
        detail:
          "Paneles solares, estanques, calefaccion, agua caliente y solucion sanitaria pueden ser decisivos en terrenos rurales.",
      },
    ],
    faqs: [
      {
        question: "Cuanto cuesta construir una Tiny House?",
        answer:
          "El precio puede partir cerca de 450 UF en modelos basicos y subir segun equipamiento, aislacion, mobiliario y tipo de trailer o fundacion.",
      },
      {
        question: "Se puede vivir en una Tiny House todo el ano?",
        answer:
          "Si, cuando tiene buena aislacion, ventilacion, calefaccion, agua, electricidad y solucion sanitaria adecuada.",
      },
      {
        question: "Tiny House fija o sobre ruedas?",
        answer:
          "La fija se parece mas a una vivienda tradicional ante permisos. La movil da flexibilidad, pero requiere revisar restricciones de estacionamiento y servicios.",
      },
    ],
  },
  {
    slug: "comprar-casa-tiny-house",
    title: "Comprar Casa Tiny House en Chile | Modelos y Precios",
    h1: "Comprar casa Tiny House en Chile",
    description:
      "Compara alternativas para comprar una Tiny House en Chile: modelos compactos, precios referenciales, equipamiento y constructoras.",
    eyebrow: "Compra compacta",
    primaryKeyword: "comprar casa Tiny House",
    keywords: [
      "comprar casa tiny house",
      "comprar tiny house chile",
      "tiny house llave en mano",
      "tiny house chile precio",
    ],
    type: "tiny-house",
    catalogHref: "/catalogo?tipo=tiny-house&sort=price_asc",
    secondaryHref: "/constructoras",
    secondaryLabel: "Ver constructoras",
    sections: [
      {
        title: "Que revisar antes de comprar",
        body:
          "Compara aislacion, equipamiento, muebles integrados, soluciones sanitarias, capacidad electrica, transporte, instalacion y garantia. En espacios pequenos, cada detalle pesa.",
      },
      {
        title: "Tiny House llave en mano",
        body:
          "Una compra llave en mano deberia indicar si incluye mobiliario, cocina, bano, calefaccion, conexiones, traslado e instalacion en terreno.",
      },
    ],
    checklist: [
      "Verificar superficie util real y altura interior.",
      "Revisar que incluya bano, cocina, calefaccion y muebles prometidos.",
      "Confirmar si el precio incluye traslado e instalacion.",
      "Pedir garantia de estructura, instalaciones y artefactos.",
      "Validar restricciones de acceso al terreno antes de comprar.",
    ],
    processSteps: [
      {
        title: "1. Comparar modelos por habitabilidad",
        detail:
          "En Tiny House importan circulaciones, almacenamiento, cama, bano, cocina y luz natural mas que el metraje nominal.",
      },
      {
        title: "2. Revisar equipamiento incluido",
        detail:
          "Una oferta puede parecer conveniente, pero subir de precio al agregar muebles, artefactos, calefaccion o solucion sanitaria.",
      },
      {
        title: "3. Validar transporte y descarga",
        detail:
          "Antes de reservar, confirma ancho de caminos, pendientes, permisos de traslado y si se necesita camion especial o grua.",
      },
      {
        title: "4. Firmar con alcance detallado",
        detail:
          "El contrato debe incluir planos, materialidad, equipamiento, fecha de entrega, forma de pago, garantia y exclusiones.",
      },
    ],
    costItems: [
      {
        label: "Modelo equipado",
        detail:
          "El precio depende de muebles integrados, artefactos, bano, cocina, aislacion y nivel de terminaciones.",
      },
      {
        label: "Traslado",
        detail:
          "Distancia, dimensiones, caminos y necesidad de escolta o grua pueden hacer variar el precio final.",
      },
      {
        label: "Instalacion y autonomia",
        detail:
          "Conexiones, nivelacion, estanques, energia solar o fosa deben definirse segun terreno y uso proyectado.",
      },
    ],
    faqs: [
      {
        question: "Comprar Tiny House incluye transporte?",
        answer:
          "No siempre. El traslado puede cobrarse aparte y depende de distancia, accesos y dimensiones del modelo.",
      },
      {
        question: "Puedo financiar una Tiny House?",
        answer:
          "Depende del formato, uso y proveedor. Algunas empresas ofrecen pago por etapas o convenios, pero no siempre calza con credito hipotecario tradicional.",
      },
      {
        question: "Que tamano conviene comprar?",
        answer:
          "Para uso ocasional pueden bastar 15 a 25 m2. Para vivir de forma permanente conviene evaluar 30 a 45 m2 y buen almacenamiento.",
      },
    ],
  },
];

export const SEO_INTENT_PAGE_BY_SLUG = new Map(
  SEO_INTENT_PAGES.map((page) => [page.slug, page])
);
