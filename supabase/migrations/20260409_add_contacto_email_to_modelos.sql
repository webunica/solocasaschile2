-- Agregar campo de email de contacto a los modelos
ALTER TABLE modelos ADD COLUMN IF NOT EXISTS contacto_email TEXT;

-- Comentario para documentación
COMMENT ON COLUMN modelos.contacto_email IS 'Email específico para recibir cotizaciones de este modelo. Si es NULL, se usa el de la constructora.';
