# Observabilidad operativa

Objetivo: detectar fallas de leads, pagos y cron antes de que afecten ventas o confianza.

## Baseline

Las rutas criticas emiten logs JSON con estos campos base:

1. `level`: `info`, `warn` o `error`
2. `event`: nombre estable para filtrar alertas
3. `route`: ruta API
4. `requestId`: `x-vercel-id`, `x-request-id`, `cf-ray` o `local`
5. `ms`: duracion cuando aplica

Ademas, todas las respuestas de rutas criticas devuelven `x-request-id` para correlacion de soporte.

Regla de privacidad: no registrar tokens, emails, telefonos, mensajes de leads, headers de autorizacion ni payloads completos.

## Eventos criticos hoy

### Leads publicos

- `leads_public_inserted`
- `leads_public_insert_failed`
- `leads_public_rate_limited`
- `leads_public_honeypot_triggered`
- `leads_public_unexpected_error`
- `leads_public_config_missing`

### Checkout publico

- `checkout_start_created`
- `checkout_start_failed`
- `checkout_start_flow_config_missing`
- `checkout_start_profile_upsert_failed`

### Checkout autenticado / Flow

- `flow_checkout_created`
- `flow_checkout_failed`
- `flow_checkout_config_missing`
- `flow_webhook_started`
- `flow_webhook_paid_completed`
- `flow_webhook_payment_rejected`
- `flow_webhook_plan_activation_failed`
- `flow_webhook_failed`
- `flow_webhook_missing_constructora`

### Cron de blog

- `cron_generate_blog_started`
- `cron_generate_blog_completed`
- `cron_generate_blog_failed`
- `cron_generate_blog_webhook_failed`
- `cron_generate_blog_config_missing`

## Integracion con Sentry

Los eventos de severidad operativa alta ya se reportan tambien a Sentry con:

- `tag:event`
- `tag:route`
- `tag:request_id`
- fingerprint `[event, route]`

Eventos enviados a Sentry:

- `leads_public_config_missing`
- `leads_public_insert_failed`
- `leads_public_unexpected_error`
- `checkout_start_failed`
- `checkout_start_flow_config_missing`
- `checkout_start_profile_upsert_failed`
- `flow_checkout_config_missing`
- `flow_checkout_failed`
- `flow_webhook_failed`
- `flow_webhook_missing_constructora`
- `flow_webhook_plan_activation_failed`
- `cron_generate_blog_config_missing`
- `cron_generate_blog_failed`
- `cron_generate_blog_webhook_failed`

## Alertas minimas recomendadas

Configurar en Sentry y complementar con Vercel Runtime Logs:

1. `Config missing`
   - filtro: `event:*_config_missing`
   - umbral: 1 evento en 10 minutos
   - severidad: P0

2. `Leads rotos`
   - filtro: `event:leads_public_insert_failed OR event:leads_public_unexpected_error`
   - umbral: 1 evento en 10 minutos
   - severidad: P1

3. `Checkout roto`
   - filtro: `event:checkout_start_failed OR event:flow_checkout_failed OR event:checkout_start_profile_upsert_failed`
   - umbral: 1 evento en 10 minutos
   - severidad: P1

4. `Webhook Flow roto`
   - filtro: `event:flow_webhook_failed OR event:flow_webhook_plan_activation_failed OR event:flow_webhook_missing_constructora`
   - umbral: 1 evento en 10 minutos
   - severidad: P0

5. `Cron roto`
   - filtro: `event:cron_generate_blog_failed OR event:cron_generate_blog_webhook_failed`
   - umbral: 1 evento en 30 minutos
   - severidad: P1

6. `Cron silencioso`
   - verificar ausencia de `cron_generate_blog_completed` en la ventana esperada
   - esto se valida mejor con Vercel Cron + dashboard o monitor sintetico

## Configuracion manual sugerida

### Sentry

1. Crear alertas por issue o metric alert usando el tag `event`
2. Asignar canal operativo para P0/P1
3. Verificar que `SENTRY_DSN` y `NEXT_PUBLIC_SENTRY_DSN` existan en `staging` y `production`
4. Definir `SENTRY_ENVIRONMENT` y `SENTRY_RELEASE`

### Vercel

1. Revisar Runtime Logs por `event` y `requestId`
2. En cada release, validar una corrida del cron o su ultima ejecucion
3. Si el plan lo permite, agregar Drain o integracion hacia tu stack de monitoreo

## Runbook breve

1. Tomar `requestId` desde soporte, logs o header HTTP
2. Buscar el `event` y `route` en Runtime Logs o Sentry
3. Confirmar si hay issue agrupado por fingerprint `[event, route]`
4. Si afecta pagos o leads, congelar release hasta confirmar recuperacion
5. Registrar causa, impacto y correccion en el changelog de release

## Checklist antes de promover

1. `release:check` en verde
2. DSN de Sentry configurado en `staging` y `production`
3. Alertas P0/P1 creadas
4. Al menos una prueba manual validando que `x-request-id` aparece en rutas criticas
5. Confirmacion de cron completo o monitor sintetico equivalente
