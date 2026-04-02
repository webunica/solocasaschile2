import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Info, ArrowRight } from "lucide-react";

export function SeoContent() {
  return (
    <section className="py-32 bg-background border-t border-border/40 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-indigo/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-teal/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container max-w-5xl mx-auto px-6 relative z-10">
        <div className="space-y-24">
          
          {/* Main Content Block */}
          <div className="space-y-12">
            <div className="space-y-6 max-w-3xl">
              <Badge variant="outline" className="border-primary/20 text-primary uppercase tracking-[0.3em] text-[10px] font-black px-4 py-1.5 rounded-2xl">
                 Guía Experta 2026
              </Badge>
              <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter leading-none">
                Casas Prefabricadas SIP: <br />
                <span className="gradient-text">Innovación y Eficiencia en Chile</span>
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground font-medium leading-relaxed">
                <p>
                  La búsqueda de un hogar ideal puede ser desafiante, especialmente cuando buscas innovación y calidad. 
                  Las <strong>casas prefabricadas SIP en Chile</strong> ofrecen una solución perfecta, combinando eficiencia energética y diseño moderno. 
                  Con opciones que van desde casas modulares hasta modelos llave en mano, el mercado chileno de viviendas prefabricadas ha evolucionado para satisfacer las necesidades de personas mayores de 50 años que buscan comodidad y sostenibilidad. 
                  Las casas prefabricadas SIP no solo son una inversión inteligente, sino también una elección de vida que prioriza el bienestar y la calidad.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-start border-t border-border/40 pt-20">
              <div className="space-y-10">
                <h2 className="text-3xl font-heading font-black tracking-tighter uppercase">Ventajas Clave</h2>
                <div className="space-y-8">
                  <div className="group">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-teal" /> Eficiencia Energética
                    </h3>
                    <p className="text-muted-foreground font-medium leading-relaxed border-l-2 border-border/40 pl-6 group-hover:border-brand-teal transition-colors">
                      Las casas prefabricadas SIP están diseñadas para maximizar la eficiencia energética. Los paneles SIP proporcionan un excelente aislamiento térmico, lo que reduce significativamente el consumo de energía para calefacción y refrigeración.
                    </p>
                  </div>
                  <div className="group">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-teal" /> Rapidez en la Construcción
                    </h3>
                    <p className="text-muted-foreground font-medium leading-relaxed border-l-2 border-border/40 pl-6 group-hover:border-brand-teal transition-colors">
                      Gracias a su diseño modular, los tiempos de construcción se reducen drásticamente. Puedes mudarte a tu nuevo hogar en cuestión de semanas, sin comprometer la calidad o el diseño.
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative aspect-video rounded-3xl overflow-hidden glass shadow-2xl">
                 <Image 
                   src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070" 
                   alt="Casas prefabricadas SIP en Chile con diseño moderno" 
                   fill 
                   className="object-cover transition-transform duration-1000 grayscale group-hover:grayscale-0"
                 />
              </div>
            </div>
          </div>

          {/* Types Grid - SEO Optimized */}
          <div className="space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-heading font-black tracking-tighter uppercase">Modelos de Casas Prefabricadas</h2>
              <p className="text-muted-foreground font-medium max-w-2xl mx-auto">
                Compara precios y diseños de las tipologías líderes en el mercado habitacional chileno.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-8">
              {[
                { t: "Casas Modulares", d: "Sistemas versátiles con ensamblaje de precisión y personalización arquitectónica completa." },
                { t: "Casas Contenedores", d: "Solución económica y sostenible con diseño industrial de vanguardia y rápido montaje." },
                { t: "Casas Llave en Mano", d: "Proyectos terminados: desde fundaciones hasta el último acabado, listos para habitar." },
              ].map((item, i) => (
                <div key={i} className="glass p-10 rounded-[2.5rem] space-y-6 hover:shadow-xl transition-all hover:-translate-y-1 border-border/40">
                  <h3 className="text-xl font-black tracking-tighter uppercase leading-none">{item.t}</h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed opacity-70 border-t border-border/40 pt-4">{item.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Process Section */}
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-20 items-center bg-muted/20 rounded-[4rem] p-12 md:p-20 border border-border/40">
            <div className="space-y-12">
               <h2 className="text-4xl font-heading font-black tracking-tighter leading-none">Proceso de Compra <br /><span className="text-brand-indigo">Simplificado</span></h2>
               <div className="space-y-8">
                  {[
                    { s: "01", t: "Selección del Modelo", d: "Explora nuestro catálogo con cientos de diseños técnicos." },
                    { s: "02", t: "Financiamiento", d: "Te asistimos en la gestión crediticia y planes de pago." },
                    { s: "03", t: "Instalación Real", d: "Coordinamos logística y montaje en terreno certificado." },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-6 items-start group">
                      <span className="text-3xl font-black text-brand-indigo/20 group-hover:text-brand-indigo transition-colors">{step.s}</span>
                      <div className="space-y-1">
                        <p className="font-bold text-lg">{step.t}</p>
                        <p className="text-sm text-muted-foreground font-medium">{step.d}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                <Image 
                  src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2000" 
                  alt="Proceso de compra de casas prefabricadas en Chile" 
                  fill 
                  className="object-cover transition-transform duration-1000 md:group-hover:scale-110"
                />
               <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>
          </div>

          {/* Over 50 Section */}
          <div className="flex flex-col md:flex-row gap-16 items-center border-y border-border/40 py-20">
             <div className="flex-1 space-y-10">
                <Badge className="bg-brand-indigo text-white border-none py-1.5 px-6 rounded-full font-black text-[9px] uppercase tracking-widest">Life Design +50</Badge>
                <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tighter leading-tight uppercase">Beneficios para una Vida Plena</h2>
                <div className="grid gap-8">
                   <div className="p-8 rounded-3xl bg-background border border-border/60 hover:border-brand-teal transition-all">
                      <h3 className="font-bold mb-2">Adaptabilidad y Accesibilidad</h3>
                      <p className="text-sm text-muted-foreground font-medium">Espacios personalizables con rampas, baños ergonómicos y cocinas sin barreras.</p>
                   </div>
                   <div className="p-8 rounded-3xl bg-background border border-border/60 hover:border-brand-indigo transition-all">
                      <h3 className="font-bold mb-2">Bajo Mantenimiento</h3>
                      <p className="text-sm text-muted-foreground font-medium">Materiales de alta durabilidad que permiten más tiempo libre y menos reparaciones.</p>
                   </div>
                </div>
             </div>
             <div className="w-full md:w-1/3 flex flex-col gap-6">
                <div className="glass p-8 rounded-[3rem] text-center border-border/40">
                   <h3 className="text-sm font-black uppercase tracking-widest opacity-60 mb-6">Preguntas Frecuentes</h3>
                   <div className="space-y-4 text-left">
                      {[
                        "¿Qué son los paneles SIP?",
                        "¿Cuánto demora el montaje?",
                        "¿Se puede personalizar?"
                      ].map((q, i) => (
                        <div key={i} className="text-xs font-bold p-4 bg-muted/40 rounded-xl hover:bg-muted transition-colors flex justify-between items-center cursor-pointer">
                           {q} <ArrowRight className="w-3 h-3 opacity-40" />
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-12">
             <h2 className="text-3xl font-heading font-black tracking-tighter text-center uppercase">Experiencias Reales</h2>
             <div className="grid md:grid-cols-2 gap-10">
                <div className="glass p-10 rounded-[3rem] border-border/40 relative">
                   <Info className="absolute top-10 right-10 w-5 h-5 opacity-20" />
                   <p className="text-lg font-medium italic mb-8 leading-relaxed">"Elegimos una casa SIP para nuestro retiro. La eficiencia energética en Santiago es impresionante, mantiene la temperatura todo el año."</p>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-muted" />
                      <div>
                         <p className="font-bold">María y Juan</p>
                         <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Santiago, Región Metropolitana</p>
                      </div>
                   </div>
                </div>
                <div className="glass p-10 rounded-[3rem] border-border/40 relative">
                   <Info className="absolute top-10 right-10 w-5 h-5 opacity-20" />
                   <p className="text-lg font-medium italic mb-8 leading-relaxed">"Me sorprendió la adaptabilidad del espacio y el costo. Fue mucho más asequible de lo esperado para un diseño tan moderno."</p>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-muted" />
                      <div>
                         <p className="font-bold">Carlos</p>
                         <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Cliente Verificado</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* FAQ SEO Section */}
          <div className="space-y-16 border-t border-border/40 pt-20">
             <div className="text-center space-y-4">
                <h2 className="text-4xl font-heading font-black tracking-tighter uppercase">Preguntas Frecuentes</h2>
                <p className="text-muted-foreground font-medium max-w-2xl mx-auto">Todo lo que necesitas saber antes de comprar tu casa prefabricada en Chile.</p>
             </div>
             <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                {[
                  { q: "¿Cuánto cuesta una casa prefabricada en Chile?", a: "Los precios varían según el metraje y materialidad. En promedio, una casa prefabricada básica parte desde los $15.000.000, mientras que modelos llave en mano de alto estándar pueden superar los $60.000.000." },
                  { q: "¿Qué es mejor: casa SIP o panel tradicional?", a: "Las casas SIP ofrecen una eficiencia térmica superior y mayor rapidez de montaje, ideal para climas extremos en Chile. Las casas tradicionales suelen ser más económicas pero requieren mayor mantenimiento." },
                  { q: "¿Qué incluye una casa llave en mano?", a: "Suele incluir fundaciones, estructura (SIP o madera), techumbre, instalaciones eléctricas, sanitarias y terminaciones completas (pisos, pintura, ventanas), lista para habitar." },
                  { q: "¿Cómo elegir una constructora certificada?", a: "En SolocasasChile auditamos a las constructoras para asegurar que cumplan con los estándares técnicos y legales. Siempre recomendamos revisar nuestro catálogo de constructoras verificadas." },
                  { q: "¿Se puede financiar con crédito hipotecario?", a: "Sí, muchas constructoras trabajan con bancos para financiamiento mediante estados de avance. Es fundamental contar con el terreno a tu nombre para calificar." },
                  { q: "¿Son seguras ante sismos?", a: "Totalmente. Todas las constructoras en nuestra plataforma deben cumplir con la norma chilena NCh433 de diseño sísmico, garantizando seguridad estructural." },
                  { q: "¿Cuánto demora la instalación total?", a: "Desde la firma del contrato, una casa modular o SIP suele demorar entre 60 a 90 días en promedio, dependiendo de la complejidad del terreno y el modelo elegido." },
                  { q: "¿Puedo personalizar el diseño de mi casa?", a: "La mayoría de nuestros modelos permiten personalización interna y ampliaciones futuras. Contamos con arquitectos que pueden ajustar el diseño a tus necesidades específicas." },
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                     <h3 className="text-lg font-bold text-brand-indigo">{item.q}</h3>
                     <p className="text-sm text-muted-foreground leading-relaxed font-medium">{item.a}</p>
                  </div>
                ))}
             </div>
          </div>

          {/* Structured Data Script */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "¿Cuánto cuesta una casa prefabricada en Chile?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Los precios varían según el metraje y materialidad. En promedio, una casa prefabricada básica parte desde los $15.000.000, mientras que modelos llave en mano de alto estándar pueden superar los $60.000.000."
                    }
                  }
                ]
              })
            }}
          />
        </div>
      </div>
    </section>
  );
}
