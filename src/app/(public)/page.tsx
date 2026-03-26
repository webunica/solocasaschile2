import { HeroSection } from "@/components/home/hero-section";
import { TypesSection } from "@/components/home/types-section";
import { FeaturedConstructorsSection } from "@/components/home/featured-section";

export const dynamic = "force-dynamic";


export default function Home() {
  return (
    <>
      <HeroSection />
      <TypesSection />
      <FeaturedConstructorsSection />
    </>
  );
}
