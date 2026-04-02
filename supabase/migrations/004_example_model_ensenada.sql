-- Script para insertar el modelo de ejemplo "Ensenada Rio Blanco"
-- y asegurar que exista un Super Administrador asignado.

DO $$
DECLARE
    admin_id UUID;
BEGIN
    -- 1. Buscar el primer administrador existente o usar un ID específico
    SELECT id INTO admin_id FROM public.constructoras WHERE plan = 'premium' LIMIT 1;
    
    -- Si no hay ninguno, creamos uno de sistema (en una DB real esto vendría de auth.users)
    IF admin_id IS NULL THEN
        admin_id := '00000000-0000-0000-0000-000000000000'; -- ID de reserva para el Admin
        
        INSERT INTO public.constructoras (id, nombre, slug, email, plan, verificada, score_confianza, regiones)
        VALUES (
            admin_id,
            'Administración SolocasasChile',
            'admin-solocasaschile',
            'admin@solocasaschile.com',
            'premium',
            true,
            100,
            ARRAY['Metropolitana', 'Valparaíso', 'Biobío', 'Los Lagos', 'Aysén', 'Magallanes']
        )
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- 2. Insertar el modelo "Ensenada Rio Blanco"
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
        'Ensenada Rio Blanco',
        'ensenada-rio-blanco-full',
        'hormigon',
        'vivienda',
        250,
        4,
        3,
        2,
        4850,
        '180 días',
        10,
        true,
        'El modelo Ensenada Rio Blanco representa el pináculo de la arquitectura contemporánea integrada al paisaje. Con 250m² de construcción sólida en hormigón armado y detalles en madera nativa, esta vivienda ofrece un refugio de lujo con eficiencia térmica superior y espacios diseñados para el máximo confort familiar.',
        ARRAY['/images/modelos/ejemplos/ensenada-facade.png', '/images/modelos/ejemplos/ensenada-interior.png'],
        'ERB-250-F',
        ARRAY['Living-Comedor Integado', 'Cocina con Isla', 'Dormitorio Principal en Suite', 'Walk-in Closet', '3 Dormitorios Adicionales', 'Sala de Estar', 'Home Office', '3 Baños Completos', 'Baño de Visitas', 'Terraza Techada con Quincho', 'Logia Independiente'],
        JSONB_BUILD_OBJECT(
            'sistema_constructivo', 'Hormigón Armado con Encofrado de Madera',
            'estructura', 'Muros de carga de hormigón H30 y vigas de acero',
            'muros_exteriores', 'Hormigón visto con revestimiento GRC',
            'techumbre', 'Cubierta plana con membrana asfáltica y sistema de drenaje oculto'
        ),
        JSONB_BUILD_OBJECT(
            'termica', 'Poliuretano Proyectado de alta densidad 50mm',
            'acustica', 'Lana de roca mineral en tabiques divisorios',
            'calificacion_energetica', 'A',
            'zona_climatica', 'Todas las zonas (Optimizado para Sur de Chile)'
        ),
        JSONB_BUILD_OBJECT(
            'ventanas', 'PVC Termopanel Veka con Cristales Low-E',
            'puertas_exteriores', 'Madera noble de Coigüe sólida',
            'pisos', 'Porcelanato MK 80x80 y Madera de Ingenieria',
            'cocina', 'Cubiertas de Cuarzo, muebles Blum, encimera inducción'
        ),
        JSONB_BUILD_OBJECT(
            'electrica', 'Sistema domótico integrado Lutron',
            'climatizacion', 'Bomba de calor Aerotermia con fancoils',
            'internet_tv', 'Cableado Categoría 6 en todos los recintos'
        ),
        JSONB_BUILD_OBJECT(
            'que_incluye', 'Proyecto completo llave en mano, permisos de edificación, recepción final y paisajismo básico.',
            'transporte', 'Incluido en radio de 100km desde centro logístico',
            'plazo_fabricacion', '150 días',
            'plazo_montaje', '30 días'
        ),
        JSONB_BUILD_OBJECT(
            'garantia_estructura', '10 Años',
            'garantia_instalaciones', '2 Años',
            'normativa', 'Cumple con OGUC y normas sísmicas chilenas vigentes',
            'certificaciones', 'CES (Certificación Edificio Sustentable)'
        ),
        'Vivienda Modular Ensenada Rio Blanco | 250m² de Lujo y Eficiencia',
        'Descubre el modelo Ensenada Rio Blanco: 250m² de diseño Full en Hormigón. 4D/3B, eficiencia energética clase A y acabados premium. Entrega llave en mano.',
        ARRAY['casa de lujo', 'hormigon armado', 'arquitectura sustentable', '250m2', 'ensenada rio blanco']
    )
    ON CONFLICT (slug) DO NOTHING;

END $$;
