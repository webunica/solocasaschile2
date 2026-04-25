import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { openai } from "@/lib/openai";
import {
  getRequestId,
  logError,
  logInfo,
  logWarn,
  withRequestIdHeaders,
} from "@/lib/observability-logger";

export const dynamic = "force-dynamic";

const BLOG_TOPICS = [
  "Casas prefabricadas economicas: como elegir por menos de 30 millones?",
  "Modelos mediterraneos vs tradicionales: cual se adapta a tu estilo de vida?",
  "Construccion en 2 ambientes: optimizando espacios pequenos con estilo.",
  "Materiales premium: casas de Metalcom vs madera, comparativa real.",
  "Sistemas constructivos eficientes para climas frios en el sur de Chile.",
  "Como planificar la compra de tu casa prefabricada: guia paso a paso.",
  "Dormitorios y confort: disenos pensados para familias en crecimiento.",
  "Casas modulares: la rapidez de la industrializacion en tu terreno.",
];

export async function GET(req: Request) {
  const route = "/api/cron/generate-blog";
  const requestId = getRequestId(req);
  const start = Date.now();
  const authHeader = req.headers.get('authorization');

  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    logError("cron_generate_blog_config_missing", route, requestId, new Error("missing_cron_secret"));
    return NextResponse.json(
      { success: false, error: "CRON_SECRET no esta configurado" },
      withRequestIdHeaders({ status: 500 }, requestId)
    );
  }

  const isAuthorized = authHeader === `Bearer ${cronSecret}`;
  if (!isAuthorized) {
    logWarn("cron_generate_blog_unauthorized", route, requestId, {
      ms: Date.now() - start,
    });
    return new NextResponse("Unauthorized", withRequestIdHeaders({ status: 401 }, requestId));
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const topic = BLOG_TOPICS[Math.floor(Math.random() * BLOG_TOPICS.length)];
    logInfo("cron_generate_blog_started", route, requestId, {
      topicIndex: BLOG_TOPICS.indexOf(topic),
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Eres un experto amistoso y confiable en casas prefabricadas en Chile.
Tu objetivo es ayudar a compradores a entender modelos, precios y materiales.
Debes responder en formato JSON puro con esta estructura:
{
  "title": "titulo SEO atractivo",
  "slug": "slug-url-amigable",
  "category": "Categoria (ej: Construccion, Diseno, Legal, Financiero)",
  "excerpt": "resumen corto para redes sociales",
  "social_hook": "Resumen estilo post de Instagram con emojis y tono de experto",
  "hashtags": "#casaprefabricada #chile #construccion #solocasas",
  "content_md": "contenido extenso en markdown con subtitulos, tablas y listas",
  "target_audience": "publico objetivo",
  "seo_keywords": ["keyword1", "keyword2"]
}`,
        },
        {
          role: "user",
          content: `Genera un post de blog sobre el tema: ${topic}.
Enfocate en consejos practicos para Chile, menciona UF y estandares locales.
El campo 'social_hook' debe ser un parrafo breve, con emojis, disenado para captar la atencion en redes sociales.
El campo 'hashtags' debe incluir entre 5 y 10 etiquetas relevantes.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const postData = JSON.parse(completion.choices[0].message.content || "{}");

    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt:
        "Ilustracion realista y elegante de una casa prefabricada moderna en un paisaje chileno, estilo arquitectonico mediterraneo, iluminacion de atardecer y alta resolucion cinematografica. Sin texto en la imagen.",
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    const imageUrl = imageResponse.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error("failed_to_generate_image_url");
    }

    const fetchImage = await fetch(imageUrl);
    const imageBlob = await fetchImage.blob();
    const fileName = `blog-${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage.from("blog_images").upload(fileName, imageBlob, {
      contentType: "image/png",
      cacheControl: "3600",
    });

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("blog_images").getPublicUrl(fileName);

    const { error: dbError } = await supabase.from("blog_posts").insert([
      {
        ...postData,
        cover_image_url: publicUrl,
        is_published: true,
      },
    ]);

    if (dbError) {
      throw dbError;
    }

    let webhookStatus = "not_fired";
    if (process.env.MAKE_WEBHOOK_URL) {
      try {
        const webhookResponse = await fetch(process.env.MAKE_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: postData.title,
            excerpt: postData.excerpt,
            socialHook: postData.social_hook,
            hashtags: postData.hashtags,
            imageUrl: publicUrl,
            link: `https://solocasaschile.com/blog/${postData.slug}`,
          }),
        });
        webhookStatus = webhookResponse.ok ? "success" : `failed_${webhookResponse.status}`;

        if (webhookResponse.ok) {
          await supabase.from("blog_posts").update({ social_hook_fired: true }).eq("slug", postData.slug);
        }
      } catch (error: unknown) {
        logError("cron_generate_blog_webhook_failed", route, requestId, error, {
          slug: typeof postData.slug === "string" ? postData.slug : "unknown",
          ms: Date.now() - start,
        });
        webhookStatus = "error";
      }
    }

    logInfo("cron_generate_blog_completed", route, requestId, {
      slug: typeof postData.slug === "string" ? postData.slug : "unknown",
      webhookStatus,
      ms: Date.now() - start,
    });

    return NextResponse.json(
      {
        success: true,
        slug: postData.slug,
        webhook_status: webhookStatus,
      },
      withRequestIdHeaders({}, requestId)
    );
  } catch (error: unknown) {
    logError("cron_generate_blog_failed", route, requestId, error, {
      ms: Date.now() - start,
    });
    return NextResponse.json(
      { success: false, error: "No se pudo generar el contenido en este momento." },
      withRequestIdHeaders({ status: 500 }, requestId)
    );
  }
}
