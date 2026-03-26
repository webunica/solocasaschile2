-- ============================================================
-- ROW LEVEL SECURITY (RLS) — SolocasasChile
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- =============================================

-- 1. Activar RLS en todas las tablas
ALTER TABLE constructoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE modelos ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- =============================================
-- TABLA: constructoras
-- =============================================

-- Cualquiera puede leer el directorio público
CREATE POLICY "public_read_constructoras"
ON constructoras FOR SELECT
USING (true);

-- Una constructora solo puede actualizar su propio perfil
CREATE POLICY "owner_update_constructora"
ON constructoras FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Solo el sistema puede insertar constructoras
CREATE POLICY "auth_insert_constructora"
ON constructoras FOR INSERT
WITH CHECK (auth.uid() = id);

-- =============================================
-- TABLA: modelos
-- =============================================

-- Cualquiera puede leer modelos disponibles
CREATE POLICY "public_read_modelos"
ON modelos FOR SELECT
USING (disponible = true);

-- La constructora propietaria puede ver todos sus modelos
CREATE POLICY "owner_read_own_modelos"
ON modelos FOR SELECT
USING (auth.uid() = constructora_id);

-- La constructora solo puede insertar modelos a su propia cuenta
CREATE POLICY "owner_insert_modelos"
ON modelos FOR INSERT
WITH CHECK (auth.uid() = constructora_id);

-- La constructora solo puede editar sus propios modelos
CREATE POLICY "owner_update_modelos"
ON modelos FOR UPDATE
USING (auth.uid() = constructora_id)
WITH CHECK (auth.uid() = constructora_id);

-- La constructora solo puede eliminar sus propios modelos
CREATE POLICY "owner_delete_modelos"
ON modelos FOR DELETE
USING (auth.uid() = constructora_id);

-- =============================================
-- TABLA: leads
-- =============================================

-- Cualquier usuario puede insertar leads
CREATE POLICY "public_insert_leads"
ON leads FOR INSERT
WITH CHECK (true);

-- La constructora solo puede ver los leads de sus modelos
CREATE POLICY "owner_read_own_leads"
ON leads FOR SELECT
USING (auth.uid() = constructora_id);

-- La constructora puede actualizar el estado de sus leads
CREATE POLICY "owner_update_lead_status"
ON leads FOR UPDATE
USING (auth.uid() = constructora_id)
WITH CHECK (auth.uid() = constructora_id);

-- =============================================
-- STORAGE: Bucket model_images
-- =============================================

-- Cualquiera puede leer imágenes públicas
CREATE POLICY "public_read_model_images"
ON storage.objects FOR SELECT
USING (bucket_id = 'model_images');

-- Solo el propietario puede subir imágenes a su carpeta
CREATE POLICY "owner_upload_model_images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'model_images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Solo el propietario puede eliminar sus imágenes
CREATE POLICY "owner_delete_model_images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'model_images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
