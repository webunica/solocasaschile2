import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload.record;

    if (!record) {
      return new Response("No record found", { status: 400 });
    }

    // Fetch constructora email from database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Get constructora info
    const constructoraRes = await fetch(
      `${supabaseUrl}/rest/v1/constructoras?id=eq.${record.constructora_id}&select=nombre,email`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
    );
    const [constructora] = await constructoraRes.json();

    // Get modelo info
    const modeloRes = await fetch(
      `${supabaseUrl}/rest/v1/modelos?id=eq.${record.modelo_id}&select=nombre`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
    );
    const [modelo] = await modeloRes.json();

    if (!constructora?.email) {
      console.log("No email found for constructora:", record.constructora_id);
      return new Response("No constructora email", { status: 200 });
    }

    // Send email via Resend
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "SolocasasChile <notificaciones@solocasaschile.cl>",
        to: [constructora.email],
        subject: `📩 Nuevo Prospecto — ${modelo?.nombre || "tu modelo"}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
            <div style="background: linear-gradient(135deg, #1b0088, #4fd3c5); padding: 32px; border-radius: 16px; text-align: center; margin-bottom: 32px;">
              <h1 style="color: white; font-size: 28px; margin: 0; font-weight: 900;">¡Nuevo Prospecto!</h1>
              <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">SolocasasChile — Panel de Constructoras</p>
            </div>

            <p style="font-size: 16px; color: #374151;">Hola <strong>${constructora.nombre}</strong>,</p>
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              Tienes un nuevo interesado en <strong>${modelo?.nombre || "uno de tus modelos"}</strong>. 
              Aquí están sus datos de contacto:
            </p>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 24px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 10px 0; font-weight: 700; font-size: 12px; text-transform: uppercase; color: #6b7280; width: 120px;">Nombre</td>
                  <td style="padding: 10px 0; font-size: 15px; font-weight: 600; color: #111827;">${record.nombre_cliente}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 10px 0; font-weight: 700; font-size: 12px; text-transform: uppercase; color: #6b7280;">Email</td>
                  <td style="padding: 10px 0; font-size: 15px; color: #1b0088;"><a href="mailto:${record.email_cliente}">${record.email_cliente}</a></td>
                </tr>
                ${record.telefono_cliente ? `<tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 10px 0; font-weight: 700; font-size: 12px; text-transform: uppercase; color: #6b7280;">Teléfono</td>
                  <td style="padding: 10px 0; font-size: 15px; color: #111827;">${record.telefono_cliente}</td>
                </tr>` : ""}
                ${record.region_cliente ? `<tr style="border-bottom: 1px solid #e2e8f0;">
                  <td style="padding: 10px 0; font-weight: 700; font-size: 12px; text-transform: uppercase; color: #6b7280;">Región</td>
                  <td style="padding: 10px 0; font-size: 15px; color: #111827;">${record.region_cliente}</td>
                </tr>` : ""}
                ${record.mensaje ? `<tr>
                  <td style="padding: 10px 0; font-weight: 700; font-size: 12px; text-transform: uppercase; color: #6b7280; vertical-align: top;">Mensaje</td>
                  <td style="padding: 10px 0; font-size: 14px; color: #374151; font-style: italic;">"${record.mensaje}"</td>
                </tr>` : ""}
              </table>
            </div>

            <div style="text-align: center; margin: 32px 0;">
              <a href="https://app.solocasaschile.cl/leads" 
                 style="display: inline-block; background: linear-gradient(135deg, #1b0088, #4fd3c5); color: white; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; padding: 16px 32px; border-radius: 12px; text-decoration: none;">
                Ver en el Panel CRM →
              </a>
            </div>

            <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
              © 2026 SolocasasChile — Plataforma líder de casas prefabricadas en Chile
            </p>
          </div>
        `,
      }),
    });

    const emailResult = await emailRes.json();
    console.log("Email sent:", emailResult);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
