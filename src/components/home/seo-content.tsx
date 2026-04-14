import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export function SeoContent() {
  return (
    <section className="relative overflow-hidden border-t border-border/40 bg-background py-32">
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-brand-indigo/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/2 translate-y-1/2 rounded-full bg-brand-teal/5 blur-[100px]" />

      <div className="container relative z-10 mx-auto max-w-5xl px-6">
        <div className="space-y-20">
          <div className="max-w-3xl space-y-6">
            <Badge
              variant="outline"
              className="rounded-2xl border-primary/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-primary"
            >
              Guia Experta 2026
            </Badge>
            <h2 className="font-heading text-4xl font-black leading-none tracking-tighter md:text-6xl">
              Casas Prefabricadas SIP: <br />
              <span className="gradient-text">Innovacion y Eficiencia en Chile</span>
            </h2>
            <div className="prose prose-lg max-w-none font-medium leading-relaxed text-muted-foreground dark:prose-invert">
              <p>
                La busqueda de un hogar ideal puede ser desafiante, especialmente cuando buscas innovacion y calidad.
                Las <strong>casas prefabricadas SIP en Chile</strong> combinan eficiencia energetica, diseno moderno y
                una construccion mas rapida para tomar mejores decisiones desde el primer contacto.
              </p>
            </div>
          </div>

          <div className="grid items-start gap-16 border-t border-border/40 pt-20 md:grid-cols-2">
            <div className="space-y-10">
              <h2 className="font-heading text-3xl font-black uppercase tracking-tighter">Ventajas Clave</h2>
              <div className="space-y-8">
                <div className="group">
                  <h3 className="mb-3 flex items-center gap-3 text-xl font-bold">
                    <CheckCircle2 className="h-5 w-5 text-brand-teal" aria-hidden="true" />
                    Eficiencia Energetica
                  </h3>
                  <p className="border-l-2 border-border/40 pl-6 font-medium leading-relaxed text-muted-foreground transition-colors group-hover:border-brand-teal">
                    Los paneles SIP aportan alto aislamiento termico, reduciendo el consumo de energia para calefaccion
                    y refrigeracion durante todo el ano.
                  </p>
                </div>
                <div className="group">
                  <h3 className="mb-3 flex items-center gap-3 text-xl font-bold">
                    <CheckCircle2 className="h-5 w-5 text-brand-teal" aria-hidden="true" />
                    Rapidez en la Construccion
                  </h3>
                  <p className="border-l-2 border-border/40 pl-6 font-medium leading-relaxed text-muted-foreground transition-colors group-hover:border-brand-teal">
                    El diseno modular permite reducir tiempos de obra sin sacrificar calidad, terminaciones ni control
                    tecnico del proyecto.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070"
                alt="Casa prefabricada SIP moderna en Chile"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
