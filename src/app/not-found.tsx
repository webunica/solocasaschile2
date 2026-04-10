import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getMegaMenuAds, getLatestBlogPosts, getFeaturedModelsByRegion } from "@/lib/supabase/services";
import { FeaturedSlider } from "@/components/catalogo/featured-slider";
import { Compass, ArrowRight, Sparkles, Zap } from "lucide-react";

export default async function NotFound() {
  const [megaMenuAds, latestBlogPosts, featuredModels] = await Promise.all([
    getMegaMenuAds(),
    getLatestBlogPosts(2),
    getFeaturedModelsByRegion()
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header megaMenuAds={megaMenuAds} latestBlogPosts={latestBlogPosts} />
      
      <main className="flex-1 pt-44 pb-20">
        <div className="container px-6 md:px-12 max-w-7xl mx-auto space-y-20">
          
          {/* Hero Section */}
          <div className="text-center space-y-8 max-w-3xl mx-auto py-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-black uppercase tracking-widest animate-pulse">
              <Zap className="w-4 h-4" />
              Próximamente
            </div>
            
            <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-heading font-black leading-[0.95] tracking-tighter text-brand-indigo italic">
              Estamos <span className="text-brand-teal">Construyendo</span> Algo Grande
            </h1>
            
            <p className="text-xl text-muted-foreground font-medium leading-relaxed opacity-80 backdrop-blur-sm">
              Esta sección se encuentra en fase de desarrollo. Estamos preparando el mejor contenido especializado para ayudarte en el camino hacia tu nuevo hogar.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link 
                href="/catalogo"
                className="px-8 py-4 bg-brand-indigo text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-brand-teal hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
              >
                Volver al Catálogo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Featured Models Section */}
          <section className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tight text-brand-indigo italic">
                  Mientras tanto, mira estos <span className="text-brand-teal">Modelos Destacados</span>
                </h2>
                <p className="text-muted-foreground font-medium">Los diseños más buscados de esta semana en Chile.</p>
              </div>
            </div>
            
            <FeaturedSlider models={featuredModels} />
          </section>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[2.5rem] bg-white border border-border/40 shadow-sm space-y-4 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-brand-teal/10 flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black font-heading text-brand-indigo">Guías Técnicas</h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed opacity-70">
                Aprende sobre materiales, aislación y normativas legales para construir sin errores.
              </p>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-white border border-border/40 shadow-sm space-y-4 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-brand-indigo/10 flex items-center justify-center text-brand-indigo group-hover:bg-brand-indigo group-hover:text-white transition-all">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black font-heading text-brand-indigo">Calculadora de Presupuesto</h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed opacity-70">
                Próximamente: Estima el valor total de tu proyecto incluyendo terreno y empalmes.
              </p>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-white border border-border/40 shadow-sm space-y-4 hover:shadow-xl transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black font-heading text-brand-indigo">Alertas de Ofertas</h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed opacity-70">
                Sé el primero en saber cuando una constructora libere descuentos en stock de modelos.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
