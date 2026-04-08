import { Suspense } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedModelsSection } from "@/components/home/featured-models";
import { PriceDropBanner } from "@/components/home/price-drop-banner";
import { SeoContent } from "@/components/home/seo-content";
import dynamic from "next/dynamic";
import { buildWebSiteJsonLd, buildOrganizationJsonLd } from "@/components/seo/structured-data";

// Lazy loading below-the-fold components
const TypesSection = dynamic(() => import("@/components/home/types-section").then(m => m.TypesSection), { ssr: true });
const HowItWorks = dynamic(() => import("@/components/home/how-it-works").then(m => m.HowItWorks), { ssr: true });
const FeaturedConstructorsSection = dynamic(() => import("@/components/home/featured-section").then(m => m.FeaturedConstructorsSection), { ssr: true });
const TrustSection = dynamic(() => import("@/components/home/trust-section").then(m => m.TrustSection), { ssr: true });
const FinalCTA = dynamic(() => import("@/components/home/final-cta").then(m => m.FinalCTA), { ssr: true });
const LatestPosts = dynamic(() => import("@/components/home/latest-posts").then(m => m.LatestPosts), { ssr: true });

// ISR with a baseline revalidation of 1 hour (3600 seconds)
export const revalidate = 3600;

export default function Home() {
  const websiteJsonLd = buildWebSiteJsonLd();
  const orgJsonLd = buildOrganizationJsonLd();

  return (
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      {/* A: Attention (Hero) */}
      <HeroSection />

      {/* Trust & Authority (Early Social Proof) */}
      <TrustSection />

      {/* Concept Identification (Categorization) */}
      <TypesSection />

      {/* Retention (Price Drop Alert) */}
      <PriceDropBanner />

      {/* Model Selection (The Product) */}
      <Suspense fallback={<div className="h-[600px] flex items-center justify-center text-muted-foreground">Cargando modelos destacados...</div>}>
         <FeaturedModelsSection />
      </Suspense>

      {/* Flow & Education (How It Works) */}
      <HowItWorks />

      {/* Builder Directory (Options) */}
      <Suspense fallback={<div className="h-[600px] flex items-center justify-center text-muted-foreground">Cargando directorio de empresas...</div>}>
         <FeaturedConstructorsSection />
      </Suspense>

      {/* SEO Authority & FAQ (Semantic Weight) */}
      <SeoContent />

      {/* G: Growth & Engagement (Blog) */}
      <LatestPosts />

      {/* A: Action (Final CTA) */}
      <FinalCTA />
    </main>
  );
}
