-- ============================================================
-- TRIGGER: Notificar constructora cuando llega un lead
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- Primero habilitar pg_net extension (si no está habilitada)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Crear la función trigger
CREATE OR REPLACE FUNCTION notify_constructora_on_lead()
RETURNS trigger AS $$
DECLARE
  edge_function_url text;
BEGIN
  edge_function_url := current_setting('app.supabase_url') || '/functions/v1/on-new-lead';

  PERFORM net.http_post(
    url := edge_function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.anon_key')
    ),
    body := jsonb_build_object('record', row_to_json(NEW))
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear el trigger en la tabla leads
DROP TRIGGER IF EXISTS on_lead_created ON leads;
CREATE TRIGGER on_lead_created
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION notify_constructora_on_lead();

-- ============================================================
-- CONFIGURAR VARIABLES DE ENTORNO EN SUPABASE
-- Dashboard → Edge Functions → on-new-lead → Environment Variables
-- Agregar: RESEND_API_KEY = tu_api_key_de_resend
-- ============================================================
