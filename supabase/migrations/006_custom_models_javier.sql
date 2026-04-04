    -- Script para insertar modelos personalizados para Javier (Super Admin)
-- Constructora Master: cb85b919-4008-46bc-bbb8-b3211152280c

DO $$
DECLARE
    admin_id UUID := 'cb85b919-4008-46bc-bbb8-b3211152280c';
BEGIN
    -- 0. Corregir datos de la Constructora
    UPDATE public.constructoras
    SET nombre = 'Constructora Master',
        slug = 'constructora-master'
    WHERE id = admin_id;

    -- 1. Insertar el modelo "Puerto Octay"
    INSERT INTO public.modelos (
        id,
        constructora_id,
        nombre,
        slug,
        tipo,
        uso,
        superficie_m2,
        dormitorios,
        banos,
        pisos,
        precio_desde_uf,
        tiempo_entrega,
        garantia_anos,
        postventa,
        descripcion,
        imagenes_urls,
        codigo_modelo,
        recintos,
        construccion,
        aislacion,
        terminaciones,
        instalaciones,
        logistica,
        soporte,
        seo_title,
        seo_description,
        seo_keywords
    ) VALUES (
        gen_random_uuid(),
        admin_id,
        'Puerto Octay',
        'puerto-octay-120',
        'steel-framing',
        'vivienda',
        120,
        3,
        2,
        1,
        3150,
        '90 días',
        10,
        true,
        'El modelo Puerto Octay es una vivienda modular de arquitectura sofisticada, diseñada para terrenos amplios del sur de Chile. Construida con tecnología Steel Framing, ofrece una eficiencia térmica superior y gran rapidez de montaje, con ventanales de piso a cielo que integran el paisaje.',
        ARRAY['/images/modelos/ejemplos/puerto-octay-exterior.png', '/images/modelos/ejemplos/puerto-octay-interior.png'],
        'PO-120-SF',
        to_jsonb(ARRAY['Living-Comedor Concepto Abierto', 'Cocina con Isla Desayunadora', 'Dormitorio Principal en Suite', '2 Dormitorios Juveniles', '2 Baños Completos', 'Terraza Panorámica']),
        JSONB_BUILD_OBJECT(
            'sistema_constructivo', 'Modular Steel Framing Galv.',
            'estructura', 'Perfiles de acero galvanizado liviano de alta resistencia',
            'muros_exteriores', 'Revestimiento SmartPanel con aislación multicapa',
            'techumbre', 'Zinc ondulado prepintado negro con aislación R-value 25'
        ),
        JSONB_BUILD_OBJECT(
            'termica', 'Lana de vidrio 100mm + Membrana hidrófuga Tyvek',
            'acustica', 'Plancha acústica Knauf en dormitorios',
            'calificacion_energetica', 'A+',
            'zona_climatica', 'Zona Sur / Lluviosa'
        ),
        JSONB_BUILD_OBJECT(
            'ventanas', 'PVC Negro Termopanel (Veka) doble vidrio',
            'pisos', 'Piso flotante SPC alto tráfico 8mm imitación madera',
            'puertas', 'Madera maciza enchapada 80cm',
            'cocina', 'Muebles base y aéreos melamina gris grafito con granito'
        ),
        JSONB_BUILD_OBJECT(
            'electrica', 'Tablero Schneider 20 circuitos con protección diferencial',
            'climatizacion', 'Preparada para split inverter en living y suite',
            'iluminacion', 'Focos LED empotrados warm light controlables'
        ),
        JSONB_BUILD_OBJECT(
            'que_incluye', 'Kit completo, montaje en terreno, instalaciones sanitarias interiores y flete regional.',
            'plazo_fabricacion', '75 días',
            'plazo_montaje', '15 días'
        ),
        JSONB_BUILD_OBJECT(
            'garantia_estructura', '10 Años (Leyes Chilenas)',
            'certificaciones', 'ISO 9001 - Estándares Passivhaus adaptados'
        ),
        'Modelo Puerto Octay | Vivienda Modular 120m² Steel Framing',
        'Descubre la libertad del modelo Puerto Octay: 120m² de diseño moderno, 3 dormitorios y alta eficiencia térmica en Steel Framing.',
        to_jsonb(ARRAY['puerto octay', 'vivienda modular', 'steel framing', 'casa moderna', '120m2'])
    )
    ON CONFLICT (slug) DO UPDATE SET
        precio_desde_uf = EXCLUDED.precio_desde_uf,
        recintos = EXCLUDED.recintos,
        seo_keywords = EXCLUDED.seo_keywords;


    -- 2. Insertar el modelo "Volcán Puntiagudo"
    INSERT INTO public.modelos (
        id,
        constructora_id,
        nombre,
        slug,
        tipo,
        uso,
        superficie_m2,
        dormitorios,
        banos,
        pisos,
        precio_desde_uf,
        tiempo_entrega,
        garantia_anos,
        postventa,
        descripcion,
        imagenes_urls,
        codigo_modelo,
        recintos,
        construccion,
        aislacion,
        terminaciones,
        instalaciones,
        logistica,
        soporte,
        seo_title,
        seo_description,
        seo_keywords
    ) VALUES (
        gen_random_uuid(),
        admin_id,
        'Volcán Puntiagudo',
        'volcan-puntiagudo-100',
        'modular',
        'cabana',
        100,
        3,
        2,
        1,
        2650,
        '80 días',
        10,
        true,
        'Perfecta para parcelas de descanso, la "Volcán Puntiagudo" destaca por su diseño acogedor que mezcla madera y metal. Se trata de un modelo modular de 100m² optimizado para climas húmedos y fríos del sur de Chile, ofreciendo un refugio térmicamente imbatible y funcional.',
        ARRAY['/images/modelos/ejemplos/volcan-puntiagudo-exterior.png', '/images/modelos/ejemplos/volcan-puntiagudo-interior.png'],
        'VP-100-MOD',
        to_jsonb(ARRAY['Acceso Techado', 'Living-Comedor con Hogar a leña', 'Cocina integrada con barra', 'Dormitorio Superior en Mezannine', '2 Dormitorios planta baja', '1 Baño Principal', '1 Medio Baño']),
        JSONB_BUILD_OBJECT(
            'sistema_constructivo', 'Módulos Tridimensionales Autoportantes',
            'estructura', 'Chasis de acero estructural con tratamiento anticorrosivo',
            'muros_exteriores', 'Pino termotratado y metal desplegado',
            'techumbre', 'Teja metálica con pendiente pronunciada (45%)'
        ),
        JSONB_BUILD_OBJECT(
            'termica', 'Poliuretano Inyectado + Barrera vapor',
            'acustica', 'Cámara de aire estanca con lana mineral',
            'calificacion_energetica', 'B',
            'zona_climatica', 'Zonas de Cordillera y Lagos'
        ),
        JSONB_BUILD_OBJECT(
            'ventanas', 'PVC Deceunick Termopanel imitación nogal',
            'pisos', 'Entablado de madera nativa protegida',
            'puertas', 'Puertas de seguridad tipo HDF reforzado',
            'cocina', 'Acero inoxidable y madera rústica protegida'
        ),
        JSONB_BUILD_OBJECT(
            'electrica', 'Canalización oculta libre de halógenos',
            'climatizacion', 'Dispositivo para chimenea de combustión lenta inserto',
            'gas', 'Puntos para cocina y calefón instalados'
        ),
        JSONB_BUILD_OBJECT(
            'que_incluye', 'Flete de módulos (hasta 50km), grúa para montaje sobre fundaciones y conexión a empalmes.',
            'plazo_fabricacion', '60 días',
            'plazo_montaje', '10 días'
        ),
        JSONB_BUILD_OBJECT(
            'garantia_estructura', '10 Años Estructural / 2 Años terminaciones',
            'normativa', 'Cumple Norma Chilena NCh 433 de Diseño Sísmico'
        ),
        'Ficha Técnica Volcán Puntiagudo | 100m² Modular Bosque & Lago',
        'Explora la Volcán Puntiagudo: 100m² de calidez y tecnología modular para tu terreno soñado en el sur de Chile.',
        to_jsonb(ARRAY['volcan puntiagudo', 'casa cabaña', 'casa modular', 'chile sur', '100m2'])
    )
    ON CONFLICT (slug) DO UPDATE SET
        precio_desde_uf = EXCLUDED.precio_desde_uf,
        recintos = EXCLUDED.recintos,
        seo_keywords = EXCLUDED.seo_keywords;

END $$;
