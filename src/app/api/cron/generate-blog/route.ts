import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { createClient } from "@supabase/supabase-js";
import { BlogPost } from "@/types/blog";

// Cron configuration (Vercel)
export const dynamic = "force-dynamic";

const BLOG_TOPICS = [
  "Casas prefabricadas económicas: ¿Cómo elegir por menos de 30 millones?",
  "Modelos mediterráneos vs tradicionales: ¿Cuál se adapta a tu estilo de vida?",
  "Construcción en 2 ambientes: Optimizando espacios pequeños con estilo.",
  "Materiales premium: Casas de Metalcom vs Madera, comparativa real.",
  "Sistemas constructivos eficientes para climas fríos en el sur de Chile.",
  "Cómo planificar la compra de tu casa prefabricada: Guía paso a paso.",
  "Dormitorios y confort: Diseños pensados para familias en crecimiento.",
  "Casas modulares: La rapidez de la industrialización en tu terreno."
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secretParam = searchParams.get('secret');
  const authHeader = req.headers.get('authorization');
  
  // Check for auth (Vercel Cron Secret or Manual Secret Param)
  const cronSecret = process.env.CRON_SECRET;
  const isAuthorized = 
    process.env.NODE_ENV === 'development' || 
    authHeader === `Bearer ${cronSecret}` || 
    (cronSecret && secretParam === cronSecret);

  if (!isAuthorized) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for backend operations
    );

    // 1. Pick a topic
    const topic = BLOG_TOPICS[Math.floor(Math.random() * BLOG_TOPICS.length)];
    
    // 2. Generate Content with OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Eres un experto amistoso y confiable en casas prefabricadas en Chile. 
          Tu objetivo es ayudar a compradores a entender modelos, precios y materiales.
          Debes responder en formato JSON puro con la siguiente estructura:
          {
            "title": "título SEO atractivo",
            "slug": "slug-url-amigable",
            "category": "Categoría (ej: Construcción, Diseño, Legal, Financiero)",
            "excerpt": "resumen corto para redes sociales",
            "social_hook": "Resumen estilo post de Instagram con emojis y tono de experto",
            "hashtags": "#casaprefabricada #chile #construccion #solocasas",
            "content_md": "contenido extenso en markdown con subtítulos, tablas y listas",
            "target_audience": "público objetivo",
            "seo_keywords": ["keyword1", "keyword2"]
          }`
        },
        {
          role: "user",
          content: `Genera un post de blog sobre el tema: ${topic}. 
          Enfócate en consejos prácticos para Chile, menciona UF y estándares locales.
          El campo 'social_hook' debe ser un párrafo breve, con emojis, diseñado para captar la atención en redes sociales.
          El campo 'hashtags' debe incluir entre 5 y 10 etiquetas relevantes.`
        }
      ],
      response_format: { type: "json_object" }
    });

    const postData = JSON.parse(completion.choices[0].message.content || "{}");

    // 3. Generate Image with DALL-E
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Ilustración realista y elegante de una casa prefabricada moderna en un paisaje chileno (puede ser campo o playa), estilo arquitectónico mediterráneo, iluminación de atardecer, alta resolución cinematográfica. Sin texto en la imagen.`,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    const imageUrl = imageResponse.data?.[0]?.url;
    if (!imageUrl) throw new Error("Failed to generate image URL");

    // 4. Download and upload image to Supabase Storage
    const fetchImage = await fetch(imageUrl);
    const imageBlob = await fetchImage.blob();
    const fileName = `blog-${Date.now()}.png`;

    const { error: uploadError } = await supabase.storage
      .from('blog_images')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        cacheControl: '3600'
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('blog_images')
      .getPublicUrl(fileName);

    // 5. Save to Database
    const { error: dbError } = await supabase
      .from('blog_posts')
      .insert([{
        ...postData,
        cover_image_url: publicUrl,
        is_published: true
      }]);

    if (dbError) throw dbError;

    let webhookStatus = "not_fired";
    if (process.env.MAKE_WEBHOOK_URL) {
      try {
        const webhookResponse = await fetch(process.env.MAKE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: postData.title,
            excerpt: postData.excerpt,
            socialHook: postData.social_hook,
            hashtags: postData.hashtags,
            imageUrl: publicUrl,
            link: `https://solocasaschile.cl/blog/${postData.slug}`
          })
        });
        webhookStatus = webhookResponse.ok ? "success" : `failed_${webhookResponse.status}`;
        
        // Update status in DB
        if (webhookResponse.ok) {
          await supabase
            .from('blog_posts')
            .update({ social_hook_fired: true })
            .eq('slug', postData.slug);
        }
      } catch (err: any) {
        webhookStatus = `error_${err.message}`;
      }
    }

    return NextResponse.json({ 
      success: true, 
      slug: postData.slug,
      webhook_status: webhookStatus,
      env_check: process.env.MAKE_WEBHOOK_URL ? "defined" : "undefined"
    });

  } catch (error: any) {
    console.error("Cron Generation Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
