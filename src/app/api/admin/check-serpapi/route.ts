import { NextResponse } from "next/server";

export async function GET() {
  const serpApiKey = process.env.SERPAPI_KEY;
  const serpApiKeyAlt = process.env.SERPAPI_API_KEY;

  const keyInUse = serpApiKey || serpApiKeyAlt || null;
  const keyName = serpApiKey ? 'SERPAPI_KEY' : serpApiKeyAlt ? 'SERPAPI_API_KEY' : 'NINGUNA';

  if (!keyInUse) {
    return NextResponse.json({
      status: "error",
      message: "No se encontró ninguna SerpApi key",
      checked: ["SERPAPI_KEY", "SERPAPI_API_KEY"],
    }, { status: 500 });
  }

  // Test de conexión real a SerpApi
  try {
    const testQuery = "Ferretería en Santiago, Chile";
    const url = `https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(testQuery)}&type=search&api_key=${keyInUse}&hl=es&gl=cl`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return NextResponse.json({
        status: "api_error",
        keyName,
        keyPreview: `${keyInUse.slice(0, 6)}...${keyInUse.slice(-4)}`,
        serpApiError: data.error,
      }, { status: 400 });
    }

    const resultCount = data.local_results?.length || 0;

    return NextResponse.json({
      status: "ok",
      keyName,
      keyPreview: `${keyInUse.slice(0, 6)}...${keyInUse.slice(-4)}`,
      testQuery,
      resultsFound: resultCount,
      sampleResult: data.local_results?.[0]?.title || "N/A",
    });

  } catch (err: any) {
    return NextResponse.json({
      status: "fetch_error",
      keyName,
      error: err.message,
    }, { status: 500 });
  }
}
