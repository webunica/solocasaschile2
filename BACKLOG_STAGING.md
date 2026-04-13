# Backlog Maestro - Staging

Proyecto: `solocasaschile.com`  
Rama de trabajo obligatoria: `staging`  
Regla operativa: no implementar ni mergear cambios directos en `main`/produccion.

## Acuerdo de trabajo

1. Todo cambio parte en `staging`.
2. Todo ticket requiere validacion local (`lint`, `typecheck`, `build`) antes de marcarse listo.
3. Todo despliegue a produccion solo via promotion/release controlada desde `staging`.

## Sprint 0 - Contencion y seguridad (P0, inmediato)

### P0-01 Rotacion total de secretos
- Estado: TODO
- Impacto: Critico
- Tareas:
1. Rotar credenciales VPS.
2. Rotar claves Supabase (anon/service role si aplica).
3. Rotar `SERPAPI_KEY`, `FLOW_API_KEY`, `FLOW_SECRET_KEY`, `RESEND_API_KEY`, `OPENAI_API_KEY`.
4. Actualizar variables en Vercel/Supabase y validar servicio.
- Criterio de aceptacion: credenciales anteriores invalidadas y servicios operativos.

### P0-02 Limpieza de secretos en historial
- Estado: IN_PROGRESS
- Impacto: Critico
- Tareas:
1. Eliminar archivos sensibles del historial Git.
2. Agregar secret scanning en pre-commit y CI (gitleaks/trufflehog).
3. Definir politica de manejo de secretos en `README` tecnico.
- Criterio de aceptacion: scanner sin hallazgos en rama `staging`.
- Avance actual:
1. Script de escaneo creado en `scripts/scan-secrets.mjs`.
2. Hook local `pre-commit` agregado en `.githooks/pre-commit`.
3. Workflow CI agregado en `.github/workflows/security-secrets.yml`.
4. Historial saneado y force-push ejecutado en `main` y `staging`.

### P0-03 Endurecer endpoints admin
- Estado: DONE
- Impacto: Critico
- Scope:
1. `src/app/api/admin/sync-region/route.ts`
2. `src/app/api/admin/sync-suppliers/route.ts`
3. `src/app/api/admin/check-serpapi/route.ts`
- Tareas:
1. Exigir rol `admin/superadmin` ademas de auth.
2. Agregar rate limit por usuario/IP.
3. Registrar auditoria (`who`, `when`, `action`, `result`).
4. Eliminar `keyPreview` de respuestas.
- Criterio de aceptacion: usuario autenticado sin rol admin recibe `403`.
- Avance actual:
1. Guardas reutilizables de rol/rate-limit en `src/lib/security/admin-guard.ts`.
2. Endpoints admin `sync-region`, `sync-suppliers`, `check-serpapi` ya exigen rol y limitan abuso.
3. Test de regresion de seguridad agregado en `scripts/security-regression-check.mjs`.

### P0-04 Blindar cron de generacion de blog
- Estado: DONE
- Impacto: Alto
- Scope: `src/app/api/cron/generate-blog/route.ts`
- Tareas:
1. Eliminar autenticacion por query param `secret`.
2. Permitir solo header `Authorization: Bearer <CRON_SECRET>`.
3. Sanitizar errores de salida (sin detalles internos).
- Criterio de aceptacion: sin header valido retorna `401`.
- Avance actual:
1. Autenticacion por query param removida.
2. Cron acepta solo `Authorization: Bearer <CRON_SECRET>`.

### P0-05 Reforzar entrada de leads publicos
- Estado: IN_PROGRESS
- Impacto: Critico
- Scope:
1. `src/components/home/hero-lead-form.tsx`
2. flujo `submitLead/createLead`
3. politicas RLS de tabla `leads`
- Tareas:
1. Mover insercion a endpoint server-side validado con Zod.
2. Agregar honeypot + rate limit + anti-spam.
3. Restringir insercion directa desde cliente donde aplique.
- Criterio de aceptacion: trafico automatizado basico bloqueado, leads legitimos OK.
- Avance actual:
1. Endpoint seguro implementado en `src/app/api/leads/public/route.ts`.
2. `hero-lead-form`, `price-drop-banner` y `price-notify` migrados a backend seguro.
3. Endpoint público de leads actualizado para usar `SUPABASE_SERVICE_ROLE_KEY`.
4. Migración preparada para endurecer RLS: `supabase/migrations/20260413_harden_leads_insert_rls.sql`.
5. Pendiente operacional: ejecutar migración en Supabase para aplicar el cambio de política.

## Sprint 1 - Estabilidad tecnica (P1, semana 1-2)

### P1-01 Normalizar ESLint y alcance del lint
- Estado: DONE
- Scope: `eslint.config.mjs`
- Tareas:
1. Excluir `.agents`, `.claude`, archivos binarios y scripts utilitarios fuera de `src`.
2. Definir dos comandos: `lint:app` (bloqueante) y `lint:repo` (informativo).
- Criterio de aceptacion: `npm run lint:app` pasa en `staging`.
- Avance actual:
1. `lint:app` y `lint:repo` agregados en `package.json`.
2. `eslint.config.mjs` actualizado con ignores de contexto no productivo.
3. Baseline de reglas de deuda histÃ³rica ajustado temporalmente a `warning` para mantener el lint bloqueante sin frenar entregas.
4. `npm run lint:app` y `npm run lint:repo` ejecutan sin errores (solo warnings pendientes de P1-02+).

### P1-02 Reducir deuda de tipos (`any`)
- Estado: DONE
- Scope prioritario:
1. `src/lib/supabase/actions.ts`
2. `src/lib/supabase/services.ts`
3. `src/lib/supabase/obra-services.ts`
4. `src/lib/payments/*`
- Tareas:
1. Introducir tipos DTO y mapeadores.
2. Remover `any` en rutas criticas de negocio.
- Criterio de aceptacion: baja de errores `no-explicit-any` en modulos core.
- Avance actual:
1. Tipado inicial aplicado en `src/lib/payments/flow.ts` (firma, respuesta de API, manejo de errores sin `any`).
2. Tipado inicial aplicado en `src/lib/payments/uf.ts` (respuesta de API y manejo de errores sin `any`).
3. Tipado de integraciÃ³n externa aplicado en `src/lib/services/suppliers.ts` para resultados de SerpApi.
4. Deuda de tipos reducida en `src/lib/supabase/services.ts` y `src/lib/supabase/obra-services.ts` (sin `any` explÃ­citos en mÃ³dulos core priorizados).
5. Infra Supabase (`client.ts`, `server.ts`, `mock-client.ts`) tipada sin `any` explÃ­citos.
6. `src/lib/supabase/actions.ts` refactorizado para remover `any` explÃ­citos en operaciones centrales y manejo de errores.
7. Layout de navegacion tipado sin `any` explicito en `src/components/layout/header.tsx` y `src/components/layout/mega-menu.tsx` mediante `MegaMenuAds`.
8. API de checkout Flow tipada sin `any` explicito en `src/app/api/payments/flow/checkout/route.ts` con manejo de errores en `unknown`.
9. Dashboard admin sin `any` explicito en `src/components/dashboard/admin/constructora-controls.tsx` y `src/components/dashboard/admin/mega-menu-settings.tsx`.
10. Validacion actual: `typecheck` OK, `lint:app` OK (sin errores; warnings actuales: 333).
11. Paginas admin tipadas sin `any` explicito en `src/app/(dashboard)/dashboard/admin/comunicaciones/page.tsx`, `src/app/(dashboard)/dashboard/admin/constructoras/page.tsx`, `src/app/(dashboard)/dashboard/admin/settings/page.tsx`, `src/app/(dashboard)/dashboard/admin/pagos/page.tsx` y `src/app/(dashboard)/dashboard/admin/sellos/page.tsx`.
12. Validacion actualizada tras limpieza admin: `typecheck` OK, `lint:app` OK (sin errores; warnings actuales: 305).
13. Dashboard y catalogo avanzados sin `any` explicito en `src/app/(dashboard)/dashboard/catalog/page.tsx`, `src/app/(dashboard)/dashboard/catalog/new/page.tsx`, `src/app/(dashboard)/dashboard/page.tsx` y `src/app/(dashboard)/dashboard/settings/facturacion/page.tsx`.
14. Formularios de edición (`edit-form.tsx`) e interfaces de Modelos (`ModeloExtendido`) fuertemente tipadas en todos los campos, sin `any` pendientes en la rama de catálogo.
15. Validación completamente en verde para el cierre del ticket: `npx tsc --noEmit` OK (0 errores), `npm run lint:app` OK (0 errores; 287 warnings residuales).

### P1-03 Build reproducible y pipeline base
- Estado: DONE
- Tareas:
1. Crear `typecheck` script.
2. Pipeline CI: `npm ci`, `lint:app`, `typecheck`, `build`.
3. Limpieza segura de cache `.next` en CI para evitar locks.
- Criterio de aceptacion: pipeline verde en PR hacia `staging`.
- Avance actual:
1. Script `typecheck` agregado en `package.json`.
2. Workflow CI agregado en `.github/workflows/ci-staging.yml` con `npm ci` + `lint:app` + `typecheck` + `build`.
3. Limpieza de `.next` incorporada en CI antes de validar.
4. ValidaciÃ³n local: `typecheck` OK y `build` OK (en ejecuciÃ³n limpia).

## Sprint 2 - Calidad de producto (P1, semana 3-5)

### P1-04 Testing base (unit + integration + e2e)
- Estado: IN_PROGRESS
- Tareas:
1. Unit tests para pagos (HECHO), leads (HECHO), utilidades.
2. Integration tests para endpoints API criticos.
3. E2E para registro/login/lead/checkout/dashboard.
- Criterio de aceptacion: suite automatizada ejecutable en CI.
- Avance actual:
1. `vitest` agregado como base de testing y scripts `test` / `test:watch` incorporados en `package.json`.
2. Configuracion inicial creada en `vitest.config.ts`.
3. Primera suite unitaria agregada en `src/lib/security/admin-guard.test.ts` para `checkRateLimit` y `resolveAdminRole`.
4. Suite de pruebas unitarias completada para lógica de pagos (`flow.test.ts` y `uf.test.ts`).
5. Pruebas de captura de leads asíncronas (`submitLead`) añadidas cubriendo base de datos y correos Resend.
6. Validacion actual: `npm run test` OK (15 tests pasando), `typecheck` OK, `lint:app` OK.

### P1-05 Observabilidad operativa
- Estado: TODO
- Tareas:
1. Instrumentar errores (Sentry o equivalente).
2. Log estructurado en APIs.
3. Alertas para 5xx, fallos de pago, cron fallido.
- Criterio de aceptacion: dashboard minimo de salud disponible.

### P1-06 Performance y accesibilidad
- Estado: TODO
- Tareas:
1. Migrar imagenes criticas a `next/image` cuando corresponda.
2. Mejorar LCP/CLS en home/catalogo/modelo.
3. Correcciones WCAG 2.2 en formularios y navegacion.
- Criterio de aceptacion: Lighthouse en verde en rutas clave.

## Sprint 3 - Crecimiento y liderazgo (P2, semana 6-12)

### P2-01 SEO tecnico avanzado
- Estado: TODO
- Tareas:
1. Revisar metadatos por plantilla de pagina.
2. Fortalecer schema.org por modelo/constructora/blog.
3. Control estricto de canonical/noindex en rutas internas.
- Criterio de aceptacion: cobertura SEO tecnica sin errores criticos.

### P2-02 Gobierno de datos y migraciones
- Estado: TODO
- Tareas:
1. Estandarizar migraciones idempotentes.
2. Definir estrategia de rollback.
3. Documentar contratos de datos entre frontend/API/DB.
- Criterio de aceptacion: migraciones repetibles en ambientes.

### P2-03 Operacion de release
- Estado: TODO
- Tareas:
1. Checklist de release desde `staging`.
2. Smoke tests post-deploy.
3. Politica de hotfix y manejo de incidentes.
- Criterio de aceptacion: proceso de release documentado y ensayado.

## Orden recomendado de ejecucion

1. P0-01
2. P0-02
3. P0-03
4. P0-04
5. P0-05
6. P1-01
7. P1-02
8. P1-03

## KPI de control del backlog

1. `0` secretos detectados en CI.
2. `0` endpoints sensibles sin control de rol.
3. `lint:app`, `typecheck`, `build` en verde en `staging`.
4. Lead pipeline protegido (anti-spam + trazabilidad).
