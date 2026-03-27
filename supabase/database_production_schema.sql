-- ============================================================
-- SOLOCASASCHILE V2 — SCHEMA MAESTRO DE PRODUCCIÓN
-- Fecha: 26 de Marzo, 2026
-- Instrucciones: Ejecutar este script completo en el SQL Editor de Supabase.
-- ============================================================

-- 1. EXTENSIONES Y SEGURIDAD BASE
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_net"; -- Requerido para Edge Functions (Webhooks)

-- 2. TABLA: constructoras (Perfiles Industriales)
CREATE TABLE IF NOT EXISTS public.constructoras (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    email TEXT,
    descripcion TEXT,
    logo_url TEXT,
    image_url TEXT,
    telefono TEXT,
    sitio_web TEXT,
    direccion TEXT,
    plan TEXT DEFAULT 'gratis' CHECK (plan IN ('gratis', 'pro', 'premium')),
    score_confianza INTEGER DEFAULT 50,
    verificada BOOLEAN DEFAULT false,
    proyectos_completados INTEGER DEFAULT 0,
    regiones TEXT[] DEFAULT '{}',
    tipos_construccion TEXT[] DEFAULT '{}',
    anio_fundacion INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLA: modelos (Catálogo de Viviendas)
CREATE TABLE IF NOT EXISTS public.modelos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    constructora_id UUID NOT NULL REFERENCES public.constructoras(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tipo TEXT NOT NULL, -- prefabricada, sip, container, llave-en-mano
    superficie_m2 NUMERIC NOT NULL,
    dormitorios INTEGER NOT NULL,
    banos INTEGER NOT NULL,
    precio_desde_uf NUMERIC NOT NULL,
    garantia_anos INTEGER DEFAULT 1,
    postventa BOOLEAN DEFAULT false,
    imagenes_urls TEXT[] DEFAULT '{}',
    tiempo_entrega TEXT,
    descripcion TEXT,
    especificaciones JSONB DEFAULT '{}',
    disponible BOOLEAN DEFAULT true,
    total_views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA: leads (Gestión de Prospectos)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    constructora_id UUID NOT NULL REFERENCES public.constructoras(id) ON DELETE CASCADE,
    modelo_id UUID REFERENCES public.modelos(id) ON DELETE SET NULL,
    nombre_cliente TEXT NOT NULL,
    email_cliente TEXT NOT NULL,
    telefono_cliente TEXT NOT NULL,
    mensaje TEXT,
    estado TEXT DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'contactado', 'convertido')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================
-- 5. OPTIMIZACIÓN Y RENDIMIENTO (Índices)
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_modelos_constructora_id ON public.modelos(constructora_id);
CREATE INDEX IF NOT EXISTS idx_modelos_precio_uf ON public.modelos(precio_desde_uf);
CREATE INDEX IF NOT EXISTS idx_modelos_slug ON public.modelos(slug);
CREATE INDEX IF NOT EXISTS idx_constructoras_slug ON public.constructoras(slug);
CREATE INDEX IF NOT EXISTS idx_leads_constructora_id ON public.leads(constructora_id);

-- ============================================================
-- 6. SEGURIDAD (Row Level Security - RLS)
-- ============================================================

ALTER TABLE public.constructoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modelos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Constructoras
DROP POLICY IF EXISTS "public_read_constructoras" ON public.constructoras;
CREATE POLICY "public_read_constructoras" ON public.constructoras FOR SELECT USING (true);
DROP POLICY IF EXISTS "owner_modify_constructoras" ON public.constructoras;
CREATE POLICY "owner_modify_constructoras" ON public.constructoras FOR ALL USING (auth.uid() = id);

-- Modelos
DROP POLICY IF EXISTS "public_read_modelos" ON public.modelos;
CREATE POLICY "public_read_modelos" ON public.modelos FOR SELECT USING (disponible = true);
DROP POLICY IF EXISTS "owner_full_access_modelos" ON public.modelos;
CREATE POLICY "owner_full_access_modelos" ON public.modelos FOR ALL USING (auth.uid() = constructora_id);

-- Leads
DROP POLICY IF EXISTS "public_create_leads" ON public.leads;
CREATE POLICY "public_create_leads" ON public.leads FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "owner_access_leads" ON public.leads;
CREATE POLICY "owner_access_leads" ON public.leads FOR ALL USING (auth.uid() = constructora_id);

-- ============================================================
-- 7. AUTOMATIZACIÓN (Notificaciones)
-- ============================================================

CREATE OR REPLACE FUNCTION public.on_new_lead_notification()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM
    net.http_post(
      url := (SELECT current_setting('app.supabase_url')) || '/functions/v1/on-new-lead',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (SELECT current_setting('app.anon_key'))
      ),
      body := jsonb_build_object('record', row_to_json(NEW))
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_notify_on_new_lead ON public.leads;
CREATE TRIGGER tr_notify_on_new_lead
AFTER INSERT ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.on_new_lead_notification();

-- ============================================================
-- 8. ALMACENAMIENTO (Storage)
-- Nota: Crear bucket 'model_images' como PUBLIC en el panel.
-- ============================================================

-- Nota: Las políticas de storage se ejecutan sobre storage.objects
-- Reemplazar 'model_images' por el nombre del bucket si es diferente.
