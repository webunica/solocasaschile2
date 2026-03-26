-- ============================================================
-- SOLOCASASCHILE V2 — FULL DATABASE SETUP
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_net"; -- Para llamar a Edge Functions

-- 2. TABLA: constructoras
CREATE TABLE IF NOT EXISTS public.constructoras (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    descripcion TEXT,
    logo_url TEXT,
    image_url TEXT,
    plan TEXT DEFAULT 'gratis' CHECK (plan IN ('gratis', 'pro', 'premium')),
    score_confianza INTEGER DEFAULT 50,
    verificada BOOLEAN DEFAULT false,
    proyectos_completados INTEGER DEFAULT 0,
    regiones TEXT[] DEFAULT '{}',
    tipos_construccion TEXT[] DEFAULT '{}',
    anio_fundacion INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLA: modelos
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
    imagenes_urls TEXT[] DEFAULT '{}',
    tiempo_entrega TEXT,
    descripcion TEXT,
    especificaciones JSONB DEFAULT '{}',
    disponible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA: leads (Cotizaciones)
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
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.constructoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modelos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- PolÍticas Constructoras
CREATE POLICY "public_read_constructoras" ON public.constructoras FOR SELECT USING (true);
CREATE POLICY "owner_update_constructoras" ON public.constructoras FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "owner_insert_constructoras" ON public.constructoras FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas Modelos
CREATE POLICY "public_read_modelos" ON public.modelos FOR SELECT USING (disponible = true);
CREATE POLICY "owner_read_all_modelos" ON public.modelos FOR SELECT USING (auth.uid() = constructora_id);
CREATE POLICY "owner_insert_modelos" ON public.modelos FOR INSERT WITH CHECK (auth.uid() = constructora_id);
CREATE POLICY "owner_update_modelos" ON public.modelos FOR UPDATE USING (auth.uid() = constructora_id);
CREATE POLICY "owner_delete_modelos" ON public.modelos FOR DELETE USING (auth.uid() = constructora_id);

-- Políticas Leads
CREATE POLICY "public_insert_leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "owner_read_leads" ON public.leads FOR SELECT USING (auth.uid() = constructora_id);
CREATE POLICY "owner_update_leads" ON public.leads FOR UPDATE USING (auth.uid() = constructora_id);

-- ============================================================
-- 6. TRIGGERS (Notificaciones por Email)
-- ============================================================

CREATE OR REPLACE FUNCTION public.notify_on_new_lead()
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

CREATE TRIGGER tr_notify_on_new_lead
AFTER INSERT ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.notify_on_new_lead();

-- ============================================================
-- 7. STORAGE POLICIES (Bucket: model_images)
-- ============================================================
-- Nota: Debes crear el bucket "model_images" manualmente en el panel.

CREATE POLICY "public_read_images" ON storage.objects FOR SELECT USING (bucket_id = 'model_images');
CREATE POLICY "owner_upload_images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'model_images' AND (storage.foldername(name))[1] = auth.uid()::text
);
CREATE POLICY "owner_delete_images" ON storage.objects FOR DELETE USING (
  bucket_id = 'model_images' AND (storage.foldername(name))[1] = auth.uid()::text
);
