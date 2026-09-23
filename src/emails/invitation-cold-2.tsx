export interface InvitationCold2Props {
  empresaNombre: string;
  contactoNombre?: string;
  invitationUrl: string;
}

/**
 * Generador HTML para Email Cold #2: Seguimiento (+3 días).
 * Genera HTML estático puro compatible con todos los clientes de correo y Next.js Turbopack.
 */
export function renderInvitationCold2({
  empresaNombre,
  contactoNombre,
  invitationUrl,
}: InvitationCold2Props): string {
  const saludo = contactoNombre ? `Hola ${contactoNombre}` : "Hola";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Familias en tu región buscan casas como las de ${empresaNombre}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 36px 0;">
    <tbody>
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); max-width: 600px; width: 100%;">
            <tbody>
              <!-- Header -->
              <tr>
                <td style="background-color: #0b9e86; padding: 20px 40px; text-align: center;">
                  <img src="https://solocasaschile.com/images/solocasaschile-logo.png" alt="SoloCasasChile" width="180" style="display: block; margin: 0 auto; max-width: 180px; height: auto;">
                </td>
              </tr>

              <!-- Hero -->
              <tr>
                <td style="background: linear-gradient(135deg, #0b9e86 0%, #064e3b 100%); padding: 36px 40px 40px; text-align: center;">
                  <p style="margin: 0 0 10px; font-size: 11px; font-weight: 800; letter-spacing: 0.2em; color: rgba(255,255,255,0.75); text-transform: uppercase;">
                    SEGUIMIENTO DE INVITACIÓN
                  </p>
                  <h1 style="margin: 0 0 14px; font-size: 24px; font-weight: 900; color: #ffffff; line-height: 1.3;">
                    ¿Aún no publicas en SoloCasasChile, ${empresaNombre}?
                  </h1>
                  <p style="margin: 0; font-size: 15px; color: rgba(255,255,255,0.88); line-height: 1.5;">
                    Te toma menos de 3 minutos activar tu perfil y subir tu primer modelo sin costo.
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 36px 40px 28px;">
                  <p style="margin: 0 0 14px; font-size: 16px; font-weight: 700; color: #111827;">${saludo},</p>
                  <p style="margin: 0 0 14px; font-size: 14px; color: #374151; line-height: 1.6;">
                    Hace unos días te escribimos para invitarte a sumarte a <strong>SoloCasasChile</strong> con un <strong>Plan Starter sin costo</strong>.
                  </p>
                  <p style="margin: 0 0 14px; font-size: 14px; color: #374151; line-height: 1.6;">
                    Cada semana recibimos cientos de cotizaciones de personas buscando casas prefabricadas y proyectos llave en mano en todo Chile. Al publicar al menos 1 modelo:
                  </p>

                  <div style="background-color: #f8fafc; border-left: 4px solid #0b9e86; padding: 14px 18px; border-radius: 8px; margin: 18px 0;">
                    <p style="margin: 6px 0; font-size: 13px; color: "#334155"; line-height: 1.5;">
                      🎯 <strong>Compradores con intención real:</strong> recibes contactos directos en tu WhatsApp y correo sin intermediarios ni comisiones de venta.
                    </p>
                    <p style="margin: 6px 0; font-size: 13px; color: "#334155"; line-height: 1.5;">
                      ⚡ <strong>Activación instantánea:</strong> subes fotos, plano, precio aproximado y queda publicado inmediatamente.
                    </p>
                  </div>

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td align="center" style="padding-top: 24px; padding-bottom: 20px;">
                          <a href="${invitationUrl}" style="display: inline-block; background-color: #0b9e86; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 800; padding: 15px 36px; border-radius: 50px;">
                            Activar mi modelo gratis ahora →
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 8px 0 0;">
                    Tu cupo reservado sigue disponible a través de este enlace directo.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; border-top: 1px solid #e5e7eb; padding: 20px 40px; text-align: center;">
                  <p style="margin: 0 0 6px; font-size: 11px; color: #9ca3af; line-height: 1.5;">
                    SoloCasasChile.com · Plataforma líder en viviendas y constructoras en Chile
                  </p>
                  <p style="margin: 0; font-size: 11px; color: #9ca3af; line-height: 1.5;">
                    Si prefieres no recibir más invitaciones, <a href="https://solocasaschile.com/unsubscribe" style="color: #0b9e86; text-decoration: none;">cancela la suscripción aquí</a>.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>`;
}
