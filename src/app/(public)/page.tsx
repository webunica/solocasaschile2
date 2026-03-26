import { HeroSection } from "@/components/home/hero-section";
import { TypesSection } from "@/components/home/types-section";
import { FeaturedConstructorsSection } from "@/components/home/featured-section";
import { TrustSection } from "@/components/home/trust-section";
import { FinalCTA } from "@/components/home/final-cta";
import { StatsSection } from "@/components/home/stats-section";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="flex flex-col">
      {/* A: Attention (Hero) */}
      <HeroSection />

      {/* Authority Bias (Logo Cloud) - Reinforcing trust immediately after hero */}
      <TrustSection />

      {/* I: Interest (Stats & Systems) */}
      <StatsSection />
      <TypesSection />

      {/* D: Desire (Social Proof & Options) */}
      <FeaturedConstructorsSection />

      {/* A: Action (Final CTA) */}
      <FinalCTA />
    </main>
  );
}
