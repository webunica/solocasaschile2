# Gobierno de datos

Este proyecto trabaja siempre desde `staging`. Las migraciones, contratos de datos y cambios de seguridad deben validarse ahi antes de promover a produccion.

## Principios

1. Las migraciones deben ser idempotentes cuando Postgres lo permita.
2. Las politicas RLS deben preferir helpers, columnas indexadas y `(select auth.uid())` en checks complejos.
3. Las rutas publicas solo deben leer datos canonicos e indexables.
4. Los inserts publicos de leads deben pasar por API server-side, no por cliente anonimo directo.
5. Todo cambio de schema debe quedar documentado con objetivo, rollback y queries afectadas.

## Contratos principales

### `modelos`

- `slug` es la URL canonica de `/modelo/[slug]`.
- `disponible = true` habilita inclusion en catalogo y sitemap.
- `seo_title`, `seo_description`, `seo_keywords`, `seo_og_image` y `canonical_url` son overrides editoriales.
- `constructora_id` debe seguir siendo la llave de ownership del dashboard.

### `constructoras`

- `slug` es la URL canonica de `/constructora/[slug]`.
- `plan`, `verificada` y `score_confianza` gobiernan ranking del directorio.
- `regiones` soporta filtros regionales, por eso debe conservar su indice GIN.

### `blog_posts`

- `is_published = true` habilita inclusion en `/blog`, `/blog/[slug]` y sitemap.
- `slug` debe ser unico para posts publicados.
- `created_at` se usa como `lastModified` del sitemap cuando no hay `updated_at`.

### `leads`

- El flujo publico debe insertar mediante `src/app/api/leads/public/route.ts`.
- La migracion `20260413_harden_leads_insert_rls.sql` debe ejecutarse antes de cerrar P0-05.

## Checklist para cada migracion

1. Nombre con timestamp y objetivo claro.
2. `CREATE INDEX IF NOT EXISTS` o bloque `DO $$` para constraints.
3. Sin `SELECT *` en vistas o funciones nuevas.
4. Comentarios para indices/policies no obvios.
5. Rollback documentado en el PR o release note.
6. Validacion: `npm run typecheck`, `npm run test`, `npm run lint:app` y, si aplica, prueba manual en Supabase SQL editor.

## Queries calientes a vigilar

1. Catalogo: `modelos` por `disponible`, `tipo`, rango UF y `constructora_id`.
2. Directorio: `constructoras` por `plan`, `verificada`, `score_confianza` y `regiones`.
3. Blog: `blog_posts` por `is_published`, `slug`, `created_at`.
4. Dashboard: `leads` por `constructora_id`, `created_at`.
5. Sitemap: `slug` de `modelos`, `constructoras` y `blog_posts`.

## Pendientes operativos

1. Ejecutar migracion RLS de leads en Supabase.
2. Verificar indices existentes con `pg_stat_user_indexes` y `EXPLAIN (ANALYZE, BUFFERS)` en rutas de mayor trafico.
3. Definir responsable humano para aprobar cambios de RLS y rollback de produccion.
