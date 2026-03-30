import { HeroSection } from "@/components/home/hero-section";
import { FeaturedModelsSection } from "@/components/home/featured-models";
import { PriceDropBanner } from "@/components/home/price-drop-banner";
import { SeoContent } from "@/components/home/seo-content";
import dynamic from "next/dynamic";
import { StructuredData } from "@/components/seo/structured-data";

// Lazy loading below-the-fold components
const TypesSection = dynamic(() => import("@/components/home/types-section").then(m => m.TypesSection), { ssr: true });
const HowItWorks = dynamic(() => import("@/components/home/how-it-works").then(m => m.HowItWorks), { ssr: true });
const FeaturedConstructorsSection = dynamic(() => import("@/components/home/featured-section").then(m => m.FeaturedConstructorsSection), { ssr: true });
const TrustSection = dynamic(() => import("@/components/home/trust-section").then(m => m.TrustSection), { ssr: true });
const FinalCTA = dynamic(() => import("@/components/home/final-cta").then(m => m.FinalCTA), { ssr: true });

// ISR with a baseline revalidation of 1 hour (3600 seconds)
export const revalidate = 3600;

export default function Home() {
  return (
    <main className="flex flex-col">
      <StructuredData 
        type="WebSite" 
        data={{
          name: "SolocasasChile",
          url: "https://solocasaschile.com",
          description: "El comparador inteligente de casas prefabricadas en Chile."
        }} 
      />
      {/* A: Attention (Hero) */}
      <HeroSection />

      {/* Model Selection (Desire) */}
      <FeaturedModelsSection />

      {/* Retention (Price Drop Alert) */}
      <PriceDropBanner />

      {/* Concept Identification */}
      <TypesSection />

      {/* Flow & Education (How It Works) */}
      <HowItWorks />

      {/* Builder Directory (Social Proof & Options) */}
      <FeaturedConstructorsSection />

      {/* A: Action (Final CTA) */}
      <SeoContent />
      <FinalCTA />
    </main>
  );
}
