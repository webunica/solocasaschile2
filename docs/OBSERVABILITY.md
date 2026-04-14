# Observabilidad operativa

Objetivo: detectar fallas de leads, pagos y cron antes de que afecten ventas o confianza.

## Eventos estructurados

Las APIs criticas emiten logs JSON con estos campos base:

1. `level`: `info`, `warn` o `error`.
2. `event`: nombre estable para filtrar alertas.
3. `route`: ruta API.
4. `requestId`: `x-vercel-id`, `x-request-id`, `cf-ray` o `local`.
5. `ms`: duracion cuando aplica.

Regla de privacidad: no registrar tokens, emails, telefonos, mensajes de leads, headers de autorizacion ni payloads completos.

## Eventos clave

Leads:

1. `leads_public_inserted`
2. `leads_public_insert_failed`
3. `leads_public_rate_limited`
4. `leads_public_honeypot_triggered`

Cron de blog:

1. `cron_generate_blog_started`
2. `cron_generate_blog_completed`
3. `cron_generate_blog_failed`
4. `cron_generate_blog_webhook_failed`

Pagos Flow:

1. `flow_checkout_created`
2. `flow_checkout_failed`
3. `flow_webhook_paid_completed`
4. `flow_webhook_payment_rejected`
5. `flow_webhook_plan_activation_failed`
6. `flow_webhook_failed`

## Alertas minimas

Configurar alertas en Vercel Runtime Logs, Sentry o el proveedor de monitoreo elegido:

1. 5xx: cualquier `level:error` sostenido por 5 minutos en rutas `/api/*`.
2. Leads: `leads_public_insert_failed` con 1 o mas eventos en 10 minutos.
3. Pagos: `flow_checkout_failed`, `flow_webhook_failed` o `flow_webhook_plan_activation_failed` con 1 o mas eventos en 10 minutos.
4. Cron: ausencia de `cron_generate_blog_completed` despues de la ventana esperada o presencia de `cron_generate_blog_failed`.
5. Configuracion: `*_config_missing` debe abrir incidente inmediato.
6. Spam: aumento abrupto de `leads_public_rate_limited` o `leads_public_honeypot_triggered`.

## Runbook breve

1. Revisar `requestId` en logs runtime para reconstruir la peticion.
2. Verificar evento y ruta afectada.
3. Confirmar si Sentry tiene error asociado en la misma ventana.
4. Si afecta pagos o leads, pausar cambios de release hasta confirmar recuperacion.
5. Registrar causa, impacto y accion correctiva en el changelog del release.

## Pendientes externos

1. Crear dashboard por eventos en el proveedor definitivo.
2. Activar notificaciones a canal operativo para errores P0/P1.
3. Definir SLO inicial: checkout y leads con error rate menor a 1% diario.
