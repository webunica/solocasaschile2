-- Script seguro para eliminar constructoras de prueba
-- Ejecutar en Supabase Dashboard: SQL Editor -> New query -> Run

DO $$
BEGIN
  -- 1. Limpieza condicional de tablas secundarias si existen
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'modelos') THEN
    DELETE FROM public.modelos
    WHERE constructora_id IN (
      SELECT id FROM public.constructoras
      WHERE LOWER(email) IN ('mtmasters111@yahoo.com', 'cvallecentral@gmail.com', 'testplan@webunica.cl', 'pmunozj2@gmail.com')
      OR slug IN ('mtmasters111', 'cvallecentral', 'constructora-heros-2', 'pmunozj2')
    );
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'obras') THEN
    DELETE FROM public.obras
    WHERE constructora_id IN (
      SELECT id FROM public.constructoras
      WHERE LOWER(email) IN ('mtmasters111@yahoo.com', 'cvallecentral@gmail.com', 'testplan@webunica.cl', 'pmunozj2@gmail.com')
      OR slug IN ('mtmasters111', 'cvallecentral', 'constructora-heros-2', 'pmunozj2')
    );
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pagos') THEN
    DELETE FROM public.pagos
    WHERE constructora_id IN (
      SELECT id FROM public.constructoras
      WHERE LOWER(email) IN ('mtmasters111@yahoo.com', 'cvallecentral@gmail.com', 'testplan@webunica.cl', 'pmunozj2@gmail.com')
      OR slug IN ('mtmasters111', 'cvallecentral', 'constructora-heros-2', 'pmunozj2')
    );
  END IF;
END $$;

-- 2. Eliminar de public.constructoras
DELETE FROM public.constructoras
WHERE LOWER(email) IN (
  'mtmasters111@yahoo.com',
  'cvallecentral@gmail.com',
  'testplan@webunica.cl',
  'pmunozj2@gmail.com'
)
OR slug IN ('mtmasters111', 'cvallecentral', 'constructora-heros-2', 'pmunozj2');

-- 3. Eliminar de auth.users (libera los emails)
DELETE FROM auth.users
WHERE LOWER(email) IN (
  'mtmasters111@yahoo.com',
  'cvallecentral@gmail.com',
  'testplan@webunica.cl',
  'pmunozj2@gmail.com'
);
