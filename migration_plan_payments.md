# Plan de Implementación: Sistema de Pago (Flow)

Este plan detalla los pasos necesarios para finalizar e integrar completamente el sistema de pagos con Flow en SoloCasasChile.

## 1. Actualización de Base de Datos (Supabase)
Es necesario ampliar la tabla `constructoras` para soportar el ciclo de facturación y el estado de la suscripción.
- [x] **Crear script SQL coincidente con el webhook**:
    - `plan_cycle` (text: 'monthly', 'yearly')
    - `plan_status` (text: 'active', 'expired', 'canceled', 'past_due')
    - `next_billing_date` (timestamptz)
- [x] Ejecutar el script en el editor SQL de Supabase. (Script disponible en `supabase/update_subscription_columns.sql`)

## 2. Refinamiento del Flujo de Pago
- [x] **Crear página de éxito/error**:
    - Ya existe `/dashboard/success`.
    - `/dashboard/failure` creado y configurado.
- [x] Asegurar que `FlowService` en `src/lib/payments/flow.ts` use las variables de entorno correctamente y maneje redirecciones de error.
- [x] El webhook en `src/app/api/payments/flow/confirm/route.ts` ya tiene lógica para actualizar la DB.

## 3. Experiencia de Usuario en el Dashboard
- [x] Mostrar el plan actual y fecha de próximo cobro en el Dashboard principal.
- [x] Implementar avisos visuales según el estado de la suscripción (Alertas para `past_due` y `canceled`).
- [x] Activar automáticamente el badge de "Verificada" tras el primer pago de plan Pro/Premium.

## 4. Notificaciones y Correos (Resend)
- [x] El correo de éxito ya está implementado en el webhook.
- [x] Mejora estética del correo mediante plantillas HTML ricas (con logo y colores de marca).

## 5. Pruebas Finales
- [ ] Simulación de Webhook (local mock).
- [x] Validación de cálculo de UF con fallback automático.
