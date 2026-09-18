-- Script para eliminar las constructoras de prueba solicitadas
-- Ejecutar en Supabase Dashboard: SQL Editor -> New query -> Run

-- 1. Eliminar de tablas relacionadas por si no tienen CASCADE
DELETE FROM public.modelos
WHERE constructora_id IN (
  SELECT id FROM public.constructoras
  WHERE LOWER(email) IN (
    'mtmasters111@yahoo.com',
    'cvallecentral@gmail.com',
    'testplan@webunica.cl',
    'pmunozj2@gmail.com'
  )
  OR slug IN ('mtmasters111', 'cvallecentral', 'constructora-heros-2', 'pmunozj2')
);

DELETE FROM public.obras
WHERE constructora_id IN (
  SELECT id FROM public.constructoras
  WHERE LOWER(email) IN (
    'mtmasters111@yahoo.com',
    'cvallecentral@gmail.com',
    'testplan@webunica.cl',
    'pmunozj2@gmail.com'
  )
  OR slug IN ('mtmasters111', 'cvallecentral', 'constructora-heros-2', 'pmunozj2')
);

DELETE FROM public.pagos
WHERE constructora_id IN (
  SELECT id FROM public.constructoras
  WHERE LOWER(email) IN (
    'mtmasters111@yahoo.com',
    'cvallecentral@gmail.com',
    'testplan@webunica.cl',
    'pmunozj2@gmail.com'
  )
  OR slug IN ('mtmasters111', 'cvallecentral', 'constructora-heros-2', 'pmunozj2')
);

-- 2. Eliminar de la tabla public.constructoras
DELETE FROM public.constructoras
WHERE LOWER(email) IN (
  'mtmasters111@yahoo.com',
  'cvallecentral@gmail.com',
  'testplan@webunica.cl',
  'pmunozj2@gmail.com'
)
OR slug IN ('mtmasters111', 'cvallecentral', 'constructora-heros-2', 'pmunozj2');

-- 3. Eliminar los usuarios de auth.users (para liberar los emails y permitir nuevo registro si se desea)
DELETE FROM auth.users
WHERE LOWER(email) IN (
  'mtmasters111@yahoo.com',
  'cvallecentral@gmail.com',
  'testplan@webunica.cl',
  'pmunozj2@gmail.com'
);
