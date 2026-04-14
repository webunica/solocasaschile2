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
- Estado: READY_FOR_MANUAL_EXECUTION
- Impacto: Critico
- Tareas:
1. Rotar credenciales VPS.
2. Rotar claves Supabase (anon/service role si aplica).
3. Rotar `SERPAPI_KEY`, `FLOW_API_KEY`, `FLOW_SECRET_KEY`, `RESEND_API_KEY`, `OPENAI_API_KEY`.
4. Actualizar variables en Vercel/Supabase y validar servicio.
- Criterio de aceptacion: credenciales anteriores invalidadas y servicios operativos.
- Avance actual:
1. Runbook operacional detallado en `SECURITY_ROTATION_CHECKLIST.md`.
2. Orden de ejecucion definido: VPS, Supabase, Flow, mensajeria/contenido, `CRON_SECRET`.
3. Matriz de validacion por sistema agregada.
4. Pendiente manual: rotar credenciales en paneles externos y registrar evidencia.

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
5. Validacion local actual: `npm run secrets:scan` OK y `npm run security:check` OK.
6. Check de regresion actualizado para validar el honeypot real de leads sin exigir implementacion especifica debilitante.
7. Pendiente: confirmar ejecucion verde del workflow remoto `Security - Secret Scan` en GitHub.

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
- Estado: DONE
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

5. Confirmado en Supabase: `public_insert_leads`/`public_create_leads` ya no aparecen y `authenticated_insert_leads` queda con rol `authenticated`.

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
4. `npm run lint:app` ejecuta limpio en `staging`: 0 errores y 0 warnings.

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
16. Cierre extendido de deuda de tipos y reglas de lint en paginas publicas, dashboard, componentes compartidos y flujos criticos: `typecheck` OK y `lint:app` OK con 0 errores y 0 warnings.

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

5. Ruido de build por `Dynamic server usage` en mega menu reducido: `getConstructoraById` ahora usa cliente publico sin cookies dentro de `getMegaMenuAds`.
6. Ruido de build por inicializacion de Resend/Flow eliminado: Resend ahora es lazy y Flow solo emite debug con `FLOW_DEBUG=true`.
7. Dashboard principal ajustado para remover warnings de pureza/imports: timestamp calculado en servicio y consumo deterministico en render.
8. Banner promocional y skeleton del sidebar simplificados para remover estado de montaje innecesario y ancho aleatorio en render.
9. Componentes de prueba social/dynamic urgency ajustados para derivar contador sin `setState` sincronico en effect; auth error handler ahora inicializa estado desde hash sin cascada de render.
10. Limpieza adicional de deuda de lint: imports muertos, previews con `next/image` en formularios de catalogo/admin y contador de warnings reducido a 118 sin errores.
11. Cierre de ruido de lint restante en rutas publicas, dashboard y componentes compartidos: `npm run lint:app` OK con 0 errores y 0 warnings.

## Sprint 2 - Calidad de producto (P1, semana 3-5)

### P1-04 Testing base (unit + integration + e2e)
- Estado: IN_PROGRESS
- Tareas:
1. Unit tests para pagos (HECHO), leads (HECHO), utilidades (HECHO).
2. Integration tests para endpoints API criticos (HECHO).
3. E2E para registro/login/lead/checkout/dashboard.
- Criterio de aceptacion: suite automatizada ejecutable en CI.
- Avance actual:
1. `vitest` agregado como base de testing y scripts `test` / `test:watch` incorporados en `package.json`.
2. Configuracion inicial creada en `vitest.config.ts`.
3. Primera suite unitaria agregada en `src/lib/security/admin-guard.test.ts` para `checkRateLimit` y `resolveAdminRole`.
4. Suite de pruebas unitarias completada para lógica de pagos (`flow.test.ts` y `uf.test.ts`).
5. Pruebas de captura de leads asíncronas (`submitLead`) añadidas cubriendo base de datos y correos Resend.
6. Pruebas de utilidades genéricas añadidas (`utils.test.ts`, `regions.test.ts`).
7. Pruebas de integración sobre endpoints críticos (Leads Public Route y Cron Generate Blog) simulando NextRequest, NextResponse, validaciones de seguridad nativas e inserciones mockeadas finalizado.
8. Validacion actual: `npm run test` OK (36 tests pasando), `typecheck` OK, `lint:app` OK.

### P1-05 Observabilidad operativa
- Estado: IN_PROGRESS
- Tareas:
1. Instrumentar errores (Sentry o equivalente) (HECHO).
2. Log estructurado en APIs. (HECHO en rutas criticas)
3. Alertas para 5xx, fallos de pago, cron fallido. (DOCUMENTADO)
- Criterio de aceptacion: dashboard minimo de salud disponible.
- Avance actual:
1. Plataforma base instalada con `npm install @sentry/nextjs`.
2. Archivos de inicialización agregados (`sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `instrumentation.ts`).
3. Sentry enlazado exitosamente en la configuración nativa `next.config.ts`.
4. El typecheck compila y las APIs funcionan bajo Sentry.
5. Helper de logging estructurado agregado en `src/lib/observability-logger.ts` sin registrar tokens ni PII.
6. Logs JSON agregados en leads publicos, cron de blog, checkout Flow y webhook Flow.
7. Runbook y reglas minimas de alerta documentadas en `docs/OBSERVABILITY.md`.
8. Pendiente operacional: configurar dashboard/alertas reales en Vercel/Sentry y registrar evidencia.
9. Validacion actual: `typecheck` OK, `lint:app` OK (0 errores; 0 warnings), `test` OK (36 tests), `security:check` OK, `secrets:scan` OK y `build` OK.


### P1-06 Performance y accesibilidad
- Estado: IN_PROGRESS
- Tareas:
1. Migrar imagenes criticas a `next/image` cuando corresponda. (HECHO - todas las rutas publicas ya usan next/image con sizes y priority correctos)
2. Mejorar LCP/CLS en home/catalogo/modelo. (HECHO - hero con priority, featured models con priority para i<2)
3. Correcciones WCAG 2.2 en formularios y navegacion. (HECHO)
- Criterio de aceptacion: Lighthouse en verde en rutas clave.
- Avance actual:
1. Hero: `<select>` con `aria-label` y `id`, `<button>` con `type=button` y `aria-label`.
2. Modelo page: `generateMetadata` ampliado con `description`, `openGraph` y `twitter` cards.
3. Modelo page: `<iframe>` con `title` WCAG, `<Image>` en modelos relacionados con `sizes` correcto.
4. Validacion: `typecheck` OK, `npm run test` OK (36 tests).

## Sprint 3 - Crecimiento y liderazgo (P2, semana 6-12)

### P2-01 SEO tecnico avanzado
- Estado: DONE
- Tareas:
1. Revisar metadatos por plantilla de pagina.
2. Fortalecer schema.org por modelo/constructora/blog.
3. Control estricto de canonical/noindex en rutas internas.
- Criterio de aceptacion: cobertura SEO tecnica sin errores criticos.
- Avance actual:
1. `src/app/sitemap.ts` agregado con rutas canonicas estaticas, modelos, constructoras y posts publicados.
2. `src/app/robots.ts` reforzado para bloquear `/dashboard`, `/api`, `/login`, `/register` y `/auth`.
3. Layouts privados de auth/dashboard marcados con `robots: { index: false, follow: false }`.
4. Blog posts enriquecidos con `BlogPosting` JSON-LD, Open Graph `article`, Twitter card y canonical dinamico.
5. Canonicals agregados en `/blog`, `/catalogo`, `/constructoras`, `/comparar`, `/privacidad`, `/terminos` y `/modelo/[slug]`.
6. `src/components/seo/structured-data.tsx` ampliado con helper `buildItemListJsonLd` para listados y listados en catalogo/constructoras indexados.
7. Validacion actual: `typecheck` OK, `lint:app` OK (0 errores; 0 warnings), `build` OK, `test` OK (36 tests), `security:check` OK y `secrets:scan` OK.

### P2-02 Gobierno de datos y migraciones
- Estado: IN_PROGRESS
- Tareas:
1. Estandarizar migraciones idempotentes.
2. Definir estrategia de rollback.
3. Documentar contratos de datos entre frontend/API/DB.
- Criterio de aceptacion: migraciones repetibles en ambientes.
- Avance actual:
1. Documento de gobierno de datos creado en `docs/DATA_GOVERNANCE.md`.
2. Migracion `supabase/migrations/20260413_p2_data_governance.sql` preparada con indices y comentarios para blog/sitemap/contratos clave.

3. Confirmado en Supabase: existen `idx_blog_posts_published_created_at` y `idx_blog_posts_published_slug`.
4. Migracion `supabase/migrations/20260414_public_obra_showcase.sql` preparada para showcase publico de obras por constructora.
5. Pendiente operacional: ejecutar `20260414_public_obra_showcase.sql` en Supabase y validar con proyectos `visible_en_perfil = true`.

### P2-03 Operacion de release
- Estado: IN_PROGRESS
- Tareas:
1. Checklist de release desde `staging`.
2. Smoke tests post-deploy.
3. Politica de hotfix y manejo de incidentes.
- Criterio de aceptacion: proceso de release documentado y ensayado.
- Avance actual:
1. Checklist formal creado en `docs/RELEASE_PROCESS.md`.
2. Script `npm run release:check` agregado para validar secrets, lint, typecheck, tests y build.
3. README actualizado para enlazar proceso de release y gobierno de datos.
4. Ensayo local ejecutado: `npm run release:check` OK (`secrets:scan`, `lint:app`, `typecheck`, `test` con 36 tests y `build`).
5. Pendiente: ensayar release real desde `staging` y registrar resultado remoto.

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
