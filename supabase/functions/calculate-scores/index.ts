import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  try {
    console.log("Starting automated scoring calculation...");

    // Fetch all constructoras
    const constructoraRes = await fetch(
      `${supabaseUrl}/rest/v1/constructoras?select=id,plan,proyectos_completados`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
    );
    const constructoras = await constructoraRes.json();

    // Fetch lead counts per constructora
    const leadsRes = await fetch(
      `${supabaseUrl}/rest/v1/leads?select=constructora_id`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
    );
    const leads = await leadsRes.json();

    const leadCounts = leads.reduce((acc: any, lead: any) => {
      acc[lead.constructora_id] = (acc[lead.constructora_id] || 0) + 1;
      return acc;
    }, {});

    // Calculate scores and update
    for (const c of constructoras) {
      const leadPoints = (leadCounts[c.id] || 0) * 2; // 2 points per lead
      const projectPoints = (c.proyectos_completados || 0) * 0.5; // 0.5 points per project
      const planPoints = c.plan === "premium" ? 30 : c.plan === "pro" ? 15 : 0;
      
      const rawScore = 40 + leadPoints + projectPoints + planPoints; // Baseline 40
      const finalScore = Math.min(100, Math.round(rawScore));

      console.log(`Updating ${c.id}: ${finalScore}/100`);

      await fetch(`${supabaseUrl}/rest/v1/constructoras?id=eq.${c.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "return=minimal"
        },
        body: JSON.stringify({ score_confianza: finalScore })
      });
    }

    return new Response(JSON.stringify({ success: true, updated: constructoras.length }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("Scoring error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
