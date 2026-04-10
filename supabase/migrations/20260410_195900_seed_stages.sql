-- Insertar plantilla estándar de construcción
INSERT INTO obra_stage_templates (nombre, descripcion, is_default, etapas)
VALUES (
  'Construcción Estándar Chile',
  'Etapas base para un proyecto de construcción habitacional en Chile.',
  true,
  '[
    {"orden": 1, "nombre": "Instalación de Faenas y Trazado", "dias_estimados": 5, "descripcion": "Cierre perimetral, bodega y demarcación del terreno."},
    {"orden": 2, "nombre": "Excavaciones y Cimientos", "dias_estimados": 7, "descripcion": "Movimiento de tierra y preparación de base."},
    {"orden": 3, "nombre": "Fundaciones y Radier", "dias_estimados": 10, "descripcion": "Hormigón de base y losa de piso."},
    {"orden": 4, "nombre": "Estructura de Muros y Tabiquería", "dias_estimados": 15, "descripcion": "Levantamiento de muros perimetrales e internos."},
    {"orden": 5, "nombre": "Estructura de Techumbre", "dias_estimados": 10, "descripcion": "Viguería, cerchas y cubierta de techo."},
    {"orden": 6, "nombre": "Instalaciones Eléctricas y Sanitarias", "dias_estimados": 12, "descripcion": "Cableado y tuberías base."},
    {"orden": 7, "nombre": "Aislación y Revestimientos", "dias_estimados": 12, "descripcion": "Lana mineral/SIP y forro de muros."},
    {"orden": 8, "nombre": "Terminaciones Interiores", "dias_estimados": 15, "descripcion": "Pintura, pisos y guardapolvos."},
    {"orden": 9, "nombre": "Muebles y Artefactos", "dias_estimados": 7, "descripcion": "Cocina, baños e iluminación final."},
    {"orden": 10, "nombre": "Entrega y Aseo Final", "dias_estimados": 3, "descripcion": "Detalles finales y limpieza de obra."}
  ]'::jsonb
) ON CONFLICT DO NOTHING;
