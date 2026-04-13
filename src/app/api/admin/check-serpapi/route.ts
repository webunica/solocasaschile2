import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, resolveAdminRole } from "@/lib/security/admin-guard";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const role = await resolveAdminRole(supabase, user);
  if (!role.isAdmin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = checkRateLimit({
    key: `admin-check-serpapi:${user.id}:${ip}`,
    limit: 20,
    windowMs: 60_000,
  });

  if (!limit.ok) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta nuevamente en unos segundos." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const serpApiKey = process.env.SERPAPI_KEY;
  const serpApiKeyAlt = process.env.SERPAPI_API_KEY;
  const keyInUse = serpApiKey || serpApiKeyAlt || null;

  if (!keyInUse) {
    return NextResponse.json(
      {
        status: "error",
        message: "No se encontró configuración de SerpApi",
      },
      { status: 500 }
    );
  }

  try {
    const testQuery = "Ferretería en Santiago, Chile";
    const url = `https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(testQuery)}&type=search&api_key=${keyInUse}&hl=es&gl=cl`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return NextResponse.json(
        {
          status: "api_error",
          serpApiError: data.error,
        },
        { status: 400 }
      );
    }

    const resultCount = data.local_results?.length || 0;
    return NextResponse.json({
      status: "ok",
      configured: true,
      testQuery,
      resultsFound: resultCount,
      sampleResult: data.local_results?.[0]?.title || "N/A",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error al validar SerpApi";
    return NextResponse.json(
      {
        status: "fetch_error",
        error: message,
      },
      { status: 500 }
    );
  }
}
