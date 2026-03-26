import { HeroSection } from "@/components/home/hero-section";
import { TypesSection } from "@/components/home/types-section";
import { FeaturedConstructorsSection } from "@/components/home/featured-section";
import { TrustSection } from "@/components/home/trust-section";
import { FinalCTA } from "@/components/home/final-cta";
import { StatsSection } from "@/components/home/stats-section";
import { SeoContent } from "@/components/home/seo-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Casas Prefabricadas SIP en Chile: Innovación y Calidad",
  description: "Descubre las mejores casas prefabricadas SIP en Chile. Calidad, diseño y eficiencia. ¡Construye tu hogar ideal hoy!",
  openGraph: {
    title: "Casas Prefabricadas SIP en Chile: Innovación y Calidad",
    description: "Explora las casas prefabricadas SIP en Chile y construye el hogar de tus sueños con eficiencia y estilo.",
    images: ["/images/og-image.jpg"]
  }
};

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
      <SeoContent />
      <FinalCTA />
    </main>
  );
}
