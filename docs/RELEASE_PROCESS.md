# Release desde staging

El objetivo es promover cambios desde `staging` a produccion con validacion repetible y rollback claro.

## Regla base

Nunca se trabaja directo sobre `main`. Todo cambio entra a `staging`, se valida ahi y luego se promueve mediante release controlada.

## Checklist pre-release

1. Confirmar rama:
   ```bash
   git branch --show-current
   ```
2. Confirmar arbol limpio:
   ```bash
   git status --short
   ```
3. Ejecutar controles:
   ```bash
   npm run secrets:scan
   npm run lint:app
   npm run typecheck
   npm run test
   npm run build
   ```
4. Revisar migraciones pendientes:
   ```bash
   ls supabase/migrations
   ```
5. Confirmar variables requeridas en ambiente staging/production:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `FLOW_API_KEY`
   - `FLOW_SECRET_KEY`
   - `CRON_SECRET`
   - `RESEND_API_KEY`
   - `SENTRY_DSN`
   - `NEXT_PUBLIC_SENTRY_DSN`
   - `SENTRY_ENVIRONMENT`
   - `NEXT_PUBLIC_GA_ID`
6. Confirmar observabilidad operativa:
   - revisar [docs/OBSERVABILITY.md](C:/Users/studioo/Desktop/000000000000000_SOLOCASASCHILE-V2/docs/OBSERVABILITY.md)
   - alertas P0/P1 activas para `leads`, `checkout`, `flow_webhook` y `cron`
   - confirmar que respuestas criticas devuelven `x-request-id`

## Smoke tests post-deploy

1. Home carga sin errores.
2. `/catalogo` lista modelos y filtros basicos.
3. `/constructoras` lista empresas.
4. `/modelo/[slug]` carga metadata, imagenes y CTA.
5. `/blog` y `/blog/[slug]` cargan posts publicados.
6. `/sitemap.xml` devuelve URLs canonicas.
7. `/robots.txt` referencia el sitemap y bloquea areas privadas.
8. Lead publico crea registro solo via endpoint server-side.
9. Dashboard redirige usuarios sin sesion a `/login`.
10. Cron blog rechaza requests sin `Authorization: Bearer`.
11. Rutas criticas devuelven `x-request-id` en la respuesta.

## Rollback

1. Si falla solo frontend, revertir el deployment desde Vercel al ultimo release verde.
2. Si falla una migracion, ejecutar rollback SQL documentado para esa migracion.
3. Si hay exposicion de secretos, pausar promotion, rotar credenciales y ejecutar `npm run secrets:scan`.
4. Si fallan pagos, congelar promotion y validar Flow checkout/confirm antes de reintentar.

## Criterio de release listo

Un release esta listo cuando:

1. `lint:app`, `typecheck`, `test`, `build` estan verdes.
2. Secret scan no reporta hallazgos.
3. Migraciones aplicables estan ejecutadas o explicitamente postergadas con riesgo aceptado.
4. Smoke tests post-deploy estan completos.
5. Hay rollback identificado antes de promover a produccion.

## Registro de releases

### 2026-04-14 - staging a main

1. Rama de release: `codex/release-staging-to-main`.
2. Pull request: `#3` (`Release: merge staging into main`).
3. Commit promovido a `main`: `ca4a49e`.
4. Validacion local previa: `npm run release:check` OK.
5. Resultado: `origin/main` quedo alineado con `origin/staging`.
6. Nota: la lectura automatica de checks remotos desde el conector GitHub devolvio `403`; confirmar visualmente en GitHub/Vercel si se requiere evidencia externa.
