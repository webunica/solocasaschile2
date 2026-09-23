export interface InvitationCold3Props {
  empresaNombre: string;
  contactoNombre?: string;
  invitationUrl: string;
}

/**
 * Generador HTML para Email Cold #3: Último aviso (día +7).
 * Genera HTML estático puro compatible con todos los clientes de correo y Next.js Turbopack.
 */
export function renderInvitationCold3({
  empresaNombre,
  contactoNombre,
  invitationUrl,
}: InvitationCold3Props): string {
  const saludo = contactoNombre ? `Hola ${contactoNombre}` : "Hola";

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Último aviso: Invitación para ${empresaNombre} en SoloCasasChile</title>
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
                <td style="background-color: #1e293b; padding: 20px 40px; text-align: center;">
                  <img src="https://solocasaschile.com/images/solocasaschile-logo.png" alt="SoloCasasChile" width="180" style="display: block; margin: 0 auto; max-width: 180px; height: auto;">
                </td>
              </tr>

              <!-- Hero -->
              <tr>
                <td style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 36px 40px 40px; text-align: center;">
                  <p style="margin: 0 0 10px; font-size: 11px; font-weight: 800; letter-spacing: 0.2em; color: #f59e0b; text-transform: uppercase;">
                    ÚLTIMO RECORDATORIO
                  </p>
                  <h1 style="margin: 0 0 14px; font-size: 24px; font-weight: 900; color: #ffffff; line-height: 1.3;">
                    Tu cupo gratuito de publicación para ${empresaNombre} está por expirar
                  </h1>
                  <p style="margin: 0; font-size: 15px; color: #cbd5e1; line-height: 1.5;">
                    Queremos asegurarnos de que no pierdas la oportunidad de mostrar tu modelo a clientes interesados.
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 36px 40px 28px;">
                  <p style="margin: 0 0 14px; font-size: 16px; font-weight: 700; color: #111827;">${saludo},</p>
                  <p style="margin: 0 0 14px; font-size: 14px; color: #374151; line-height: 1.6;">
                    Este es nuestro último recordatorio respecto a tu invitación para el <strong>Plan Starter gratuito</strong> en SoloCasasChile.
                  </p>
                  <p style="margin: 0 0 14px; font-size: 14px; color: #374151; line-height: 1.6;">
                    No queremos ser invasivos; sólo asegurarnos de que si <strong>${empresaNombre}</strong> busca captar más clientes en su región, no dejes pasar esta ventaja de publicación sin costo.
                  </p>

                  <div style="background-color: #fef3c7; border: 1px solid #fde68a; padding: 16px 20px; border-radius: 12px; margin: 18px 0;">
                    <p style="margin: 0; font-weight: 700; color: #92400e;">
                      ⏰ ¿Qué necesitas para comenzar?
                    </p>
                    <p style="margin: 6px 0 0; font-size: 13px; color: #78350f;">
                      Solo haz clic en el enlace, completa los datos básicos de tu empresa y sube las fotos de tu casa modelo. No te pediremos tarjeta ni cobros sorpresa.
                    </p>
                  </div>

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tbody>
                      <tr>
                        <td align="center" style="padding-top: 24px; padding-bottom: 20px;">
                          <a href="${invitationUrl}" style="display: inline-block; background-color: #f59e0b; color: #0f172a; text-decoration: none; font-size: 15px; font-weight: 900; padding: 15px 36px; border-radius: 50px;">
                            Aprovechar mi invitación ahora →
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 8px 0 0;">
                    Si decides no utilizarla, liberaremos el cupo de invitación para otra empresa de la zona.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; border-top: 1px solid #e5e7eb; padding: 20px 40px; text-align: center;">
                  <p style="margin: 0 0 6px; font-size: 11px; color: #9ca3af; line-height: 1.5;">
                    SoloCasasChile.com · Conectando constructoras con futuros propietarios
                  </p>
                  <p style="margin: 0; font-size: 11px; color: #9ca3af; line-height: 1.5;">
                    Para no recibir más emails, <a href="https://solocasaschile.com/unsubscribe" style="color: #0b9e86; text-decoration: none;">haz clic aquí</a>.
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
