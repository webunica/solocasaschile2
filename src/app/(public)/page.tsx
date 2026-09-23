import { Suspense } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedModelsSection } from "@/components/home/featured-models";
import { PriceDropBanner } from "@/components/home/price-drop-banner";
import { SeoContent, HOME_FAQS } from "@/components/home/seo-content";
import { ModelSearchWidget } from "@/components/modelos/model-search-widget";
import dynamic from "next/dynamic";
import { buildWebSiteJsonLd, buildOrganizationJsonLd, buildFAQJsonLd } from "@/components/seo/structured-data";
import type { Metadata } from "next";

// Lazy loading below-the-fold components
const TypesSection = dynamic(() => import("@/components/home/types-section").then(m => m.TypesSection), { ssr: true });
const HowItWorks = dynamic(() => import("@/components/home/how-it-works").then(m => m.HowItWorks), { ssr: true });
const FeaturedConstructorsSection = dynamic(() => import("@/components/home/featured-section").then(m => m.FeaturedConstructorsSection), { ssr: true });
const TrustSection = dynamic(() => import("@/components/home/trust-section").then(m => m.TrustSection), { ssr: true });
const FinalCTA = dynamic(() => import("@/components/home/final-cta").then(m => m.FinalCTA), { ssr: true });

// ISR with a baseline revalidation of 1 hour (3600 seconds)
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Casas Prefabricadas, Casas SIP y Tiny Houses en Chile",
  description:
    "Compara casas prefabricadas, casas SIP y Tiny Houses en Chile. Revisa modelos, precios referenciales y constructoras verificadas para construir o comprar mejor.",
  keywords: [
    "casas prefabricadas",
    "casas sip",
    "construccion de casas prefabricadas",
    "construir casa prefabricada",
    "comprar casa prefabricada",
    "construir casa sip",
    "comprar casa sip",
    "modelo casa prefabricada",
    "modelo casa sip",
    "construir tiny house",
    "comprar casa tiny house",
  ],
  alternates: {
    canonical: "https://solocasaschile.com",
  },
  openGraph: {
    title: "Casas Prefabricadas, Casas SIP y Tiny Houses en Chile",
    description:
      "Compara modelos y constructoras para construir o comprar casas prefabricadas, SIP y Tiny Houses en Chile.",
    url: "https://solocasaschile.com",
    siteName: "SolocasasChile",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "https://solocasaschile.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SolocasasChile comparador de casas prefabricadas en Chile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Casas Prefabricadas, Casas SIP y Tiny Houses en Chile",
    description:
      "Modelos, precios referenciales y constructoras verificadas para cotizar casas prefabricadas en Chile.",
    images: ["https://solocasaschile.com/twitter-image.jpg"],
  },
};

export default function Home() {
  const websiteJsonLd = buildWebSiteJsonLd();
  const orgJsonLd = buildOrganizationJsonLd();
  const faqJsonLd = buildFAQJsonLd(HOME_FAQS);

  return (
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />

      {/* A: Attention (Hero) */}
      <HeroSection />

      {/* Buscador de Modelos — widget justo debajo del hero */}
      <section className="container max-w-5xl mx-auto px-6 md:px-12 -mt-8 pb-8 relative z-10">
        <ModelSearchWidget
          title="Encuentra tu casa ideal"
          subtitle="Selecciona dormitorios, baños y superficie para ver modelos que se ajusten a ti"
          targetPath="/buscador"
        />
      </section>

      {/* Model Selection (Desire) */}
      <Suspense fallback={<div className="h-[600px] flex items-center justify-center text-muted-foreground">Cargando modelos destacados...</div>}>
         <FeaturedModelsSection />
      </Suspense>

      {/* Retention (Price Drop Alert) */}
      <PriceDropBanner />

      {/* Concept Identification (Categorization) */}
      <TypesSection />

      {/* Flow & Education (How It Works) */}
      <HowItWorks />

      {/* Builder Directory (Options) */}
      <Suspense fallback={<div className="h-[600px] flex items-center justify-center text-muted-foreground">Cargando directorio de empresas...</div>}>
         <FeaturedConstructorsSection />
      </Suspense>

      {/* Trust & Authority (Social Proof) - kept from staging */}
      <TrustSection />

      {/* SEO Authority & FAQ (Semantic Weight) */}
      <SeoContent />

      {/* A: Action (Final CTA) */}
      <FinalCTA />
    </main>
  );
}
