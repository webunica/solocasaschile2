-- ============================================================
-- SCORING CRON: Recalcular scores semanalmente
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- (Solo en proyectos Supabase Cloud Pro o Enterprise)
-- ============================================================

-- Primero habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Programar tarea: Todos los domingos a las 00:00 (UTC)
SELECT cron.schedule(
  'weekly-scoring-update', -- nombre
  '0 0 * * 0',            -- cron (domingo 00:00)
  $$
  SELECT net.http_post(
    url := (SELECT current_setting('app.supabase_url')) || '/functions/v1/calculate-scores',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT current_setting('app.anon_key'))
    ),
    body := '{}'::jsonb
  );
  $$
);

-- ============================================================
-- Ver estado de crons:
-- SELECT * FROM cron.job;
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC;
-- ============================================================
