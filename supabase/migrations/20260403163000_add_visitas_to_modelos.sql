-- Agregar columna visitas para contar vistas de usuario reales en la ficha
ALTER TABLE modelos ADD COLUMN IF NOT EXISTS visitas INTEGER DEFAULT 0;

-- Crear RPC para incrementar la cantidad de vistas (para no sobreescribir updates concurrentes)
CREATE OR REPLACE FUNCTION increment_visitas(modelo_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE modelos
  SET visitas = visitas + 1
  WHERE id = modelo_id;
END;
$$;
