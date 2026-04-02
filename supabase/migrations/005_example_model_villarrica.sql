-- Script para insertar el modelo de ejemplo "Villarrica Lago Castor" (SIP 180m²)
-- Asignado al Super Administrador.

DO $$
DECLARE
    admin_id UUID;
BEGIN
    -- 1. Buscar el administrador existente
    SELECT id INTO admin_id FROM public.constructoras WHERE plan = 'premium' LIMIT 1;
    
    -- Fallback por seguridad
    IF admin_id IS NULL THEN
        admin_id := '00000000-0000-0000-0000-000000000000';
    END IF;

    -- 2. Insertar el modelo "Villarrica Lago Castor"
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
        'Villarrica Lago Castor',
        'villarrica-lago-castor-sip',
        'sip',
        'vivienda',
        180,
        3,
        3,
        1,
        2950,
        '110 días',
        5,
        true,
        'El modelo Villarrica Lago Castor es la perfecta armonía entre rapidez constructiva y confort térmico absoluto. Con 180m² en una sola planta, su diseño longitudinal permite una conexión fluida con el entorno. Estructurada íntegramente en paneles SIP de alto rendimiento, es la elección ideal para quienes buscan eficiencia energética en climas variables sin sacrificar elegancia y amplitud.',
        ARRAY['/images/modelos/ejemplos/villarrica-facade.png'],
        'VLC-180-SIP',
        ARRAY['Gran Living con Chimenea central', 'Comedor con Techo a la vista', 'Cocina Abierta con Mesón de Roble', 'Dormitorio Principal en Suite con terraza privada', '2 Dormitorios con Baño Compartido', '3 Baños Totales', 'Lavandería Integrada', 'Corredor Exterior Tradicional'],
        JSONB_BUILD_OBJECT(
            'sistema_constructivo', 'Paneles SIP (Structural Insulated Panels) 1 obecnie 62mm',
            'estructura', 'Entramado de madera impregnada y cerchas metálicas',
            'muros_exteriores', 'Siding de Fibrocemento imitación madera y piedra pizarra',
            'techumbre', 'Teja asfáltica color grafito sobre fieltro asfáltico'
        ),
        JSONB_BUILD_OBJECT(
            'termica', 'EPS de alta densidad incorporado en paneles (Cero puentes térmicos)',
            'acustica', 'Aislamiento de lana mineral 50mm en tabiques internos',
            'calificacion_energetica', 'B+',
            'zona_climatica', 'Centro y Sur de Chile'
        ),
        JSONB_BUILD_OBJECT(
            'ventanas', 'PVC Termopanel Nogal oscuro',
            'puertas_exteriores', 'Puerta de Lenga sólida con cerradura digital',
            'pisos', 'Piso flotante hidrófugo 8mm y Porcelanato en zonas húmedas',
            'cocina', 'Mobiliario melamínico alta densidad con rieles cierre suave'
        ),
        JSONB_BUILD_OBJECT(
            'electrica', 'Tablero general con circuitos diferenciados y luces LED',
            'climatizacion', 'Preparado para estufa a pellet y aire acondicionado split',
            'sanitaria', 'Tuberías PPR fusión para agua fría/caliente'
        ),
        JSONB_BUILD_OBJECT(
            'que_incluye', 'Kit de paneles SIP, techumbre, ventanas y asesoría en el montaje.',
            'transporte', 'Envío a regiones mediante camión rampla (Tarifa por KM)',
            'plazo_fabricacion', '45 días',
            'plazo_montaje', '25 días'
        ),
        JSONB_BUILD_OBJECT(
            'garantia_estructura', '5 Años',
            'normativa', 'Certificación estructural por ingenieros civiles',
            'adicionales', 'Manual de montaje detallado paso a paso'
        ),
        'Modelo Villarrica Lago Castor | 180m² SIP de Alta Eficiencia',
        'Vivienda en panel SIP de 180m². 3 Habitaciones, 3 Baños y diseño de planta libre. Eficiencia térmica garantizada para el sur de Chile.',
        ARRAY['casas sip', 'villarrica', 'eficiencia termica', 'vivienda 180m2', 'construccion rapida']
    )
    ON CONFLICT (slug) DO NOTHING;

END $$;
