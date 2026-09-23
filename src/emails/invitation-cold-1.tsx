export interface InvitationCold1Props {
  empresaNombre: string;
  contactoNombre?: string;
  invitationUrl: string;
}

/**
 * Generador HTML para Email Cold #1: Presentación y Plan Starter gratuito.
 * Genera HTML estático puro compatible con todos los clientes de correo y Next.js Turbopack.
 */
export function renderInvitationCold1({
  empresaNombre,
  contactoNombre,
  invitationUrl,
}: InvitationCold1Props): string {
  const saludo = contactoNombre ? `Hola ${contactoNombre}` : "Hola";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${empresaNombre}: tu primer modelo gratis en SoloCasasChile</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 0;">
    <tbody>
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); max-width: 600px; width: 100%;">
            <tbody>
              <!-- Header -->
              <tr>
                <td style="background-color: #0b9e86; padding: 24px 40px; text-align: center;">
                  <img src="https://solocasaschile.com/images/solocasaschile-logo.png" alt="SoloCasasChile" width="180" style="display: block; margin: 0 auto; max-width: 180px; height: auto;">
                </td>
              </tr>

              <!-- Hero -->
              <tr>
                <td style="background: linear-gradient(135deg, #0b9e86 0%, #0a7a68 100%); padding: 40px 40px 48px; text-align: center;">
                  <p style="margin: 0 0 12px; font-size: 11px; font-weight: 800; letter-spacing: 0.2em; color: rgba(255,255,255,0.7); text-transform: uppercase;">
                    INVITACIÓN EXCLUSIVA
                  </p>
                  <h1 style="margin: 0 0 16px; font-size: 26px; font-weight: 900; color: #ffffff; line-height: 1.25;">
                    ${empresaNombre}: tu primer modelo de casa en el catálogo más grande de Chile
                  </h1>
                  <p style="margin: 0; font-size: 16px; color: rgba(255,255,255,0.85); line-height: 1.6;">
                    Miles de familias buscan su casa en SoloCasasChile cada mes. Ahora puedes aparecer frente a ellos — gratis.
                  </p>
                </td>
              </tr>

              <!-- Body Content -->
              <tr>
                <td style="padding: 40px 40px 32px;">
                  <p style="margin: 0 0 16px; font-size: 17px; font-weight: 700; color: #111827;">${saludo},</p>
                  <p style="margin: 0 0 16px; font-size: 15px; color: #374151; line-height: 1.7;">
                    Te enviamos esta invitación personal porque creemos que <strong>${empresaNombre}</strong> puede beneficiarse de tener presencia digital en el lugar donde los compradores de casas en Chile buscan constructoras.
                  </p>
                  <p style="margin: 0 0 16px; font-size: 15px; color: #374151; line-height: 1.7;">
                    Con tu invitación puedes activar el <strong>Plan Starter gratuito</strong>, que te permite publicar <strong>1 modelo de casa</strong> en nuestro catálogo sin costo alguno, sin tarjeta de crédito.
                  </p>

                  <!-- Caja de Beneficios -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0fdf9; border: 1px solid #a7f3d0; border-radius: 12px; margin-bottom: 24px;">
                    <tbody>
                      <tr>
                        <td style="padding: 16px 20px 8px; font-size: 13px; font-weight: 800; color: #065f46; text-transform: uppercase; letter-spacing: 0.08em;">
                          ¿Qué incluye el Plan Starter?
                        </td>
                      </tr>
                      <tr><td style="padding: 6px 20px; font-size: 14px; color: #064e3b; line-height: 1.5;">✓  1 modelo de casa publicado en el catálogo nacional</td></tr>
                      <tr><td style="padding: 6px 20px; font-size: 14px; color: #064e3b; line-height: 1.5;">✓  Perfil de constructora con tus datos de contacto</td></tr>
                      <tr><td style="padding: 6px 20px; font-size: 14px; color: #064e3b; line-height: 1.5;">✓  Visible en búsquedas por región</td></tr>
                      <tr><td style="padding: 6px 20px; font-size: 14px; color: #064e3b; line-height: 1.5;">✓  Botón de cotización directo a tu WhatsApp o correo</td></tr>
                      <tr><td style="padding: 6px 20px 16px; font-size: 14px; color: #064e3b; line-height: 1.5;">✓  Sin costo · Sin tarjeta de crédito · Sin permanencia</td></tr>
                    </tbody>
                  </table>

                  <!-- CTA Button -->
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td align="center" style="padding-top: 16px; padding-bottom: 28px;">
                          <a href="${invitationUrl}" style="display: inline-block; background-color: #0b9e86; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 800; padding: 16px 40px; border-radius: 50px; letter-spacing: 0.03em;">
                            Publicar mi primer modelo gratis →
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0; line-height: 1.5;">
                    Este enlace es personal y exclusivo para ${empresaNombre}. Tiene validez de 30 días.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; border-top: 1px solid #e5e7eb; padding: 24px 40px; text-align: center;">
                  <p style="margin: 0 0 8px; font-size: 12px; color: #9ca3af; line-height: 1.6;">
                    Enviado por <a href="https://solocasaschile.com" style="color: #0b9e86; text-decoration: none;">SoloCasasChile.com</a> · El catálogo de casas prefabricadas y construcción en Chile
                  </p>
                  <p style="margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.6;">
                    Si no deseas recibir este tipo de comunicaciones, <a href="https://solocasaschile.com/unsubscribe" style="color: #0b9e86; text-decoration: none;">haz clic aquí</a>.
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
