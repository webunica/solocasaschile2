import { Metadata } from "next";
import { SmartCotizador } from "@/components/home/smart-cotizador";
import { 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  HelpCircle 
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cotizador Inteligente de Casas Prefabricadas y Modulares | SoloCasasChile",
  description:
    "Cotiza tu casa prefabricada, casa modular o tiny house en 3 minutos. Configura metros cuadrados, personas, estilo y sistema constructivo para recibir estimaciones y propuestas de constructoras verificadas en Chile.",
  keywords: [
    "cotizar casa prefabricada",
    "cotizador de casas chile",
    "precios casas prefabricadas chile",
    "cotizar casa sip",
    "cotizar tiny house",
    "presupuesto casa prefabricada",
  ],
  alternates: {
    canonical: "https://solocasaschile.com/cotizar",
  },
  openGraph: {
    title: "Cotizador Inteligente de Casas en Chile | SoloCasasChile",
    description:
      "Calcula precios y cotiza tu casa prefabricada según tus necesidades. Constructoras verificadas en todo Chile.",
    url: "https://solocasaschile.com/cotizar",
    siteName: "SoloCasasChile",
    locale: "es_CL",
    type: "website",
  },
};

export default function CotizarPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/30">
      {/* Header / Intro Banner */}
      <section className="pt-8 pb-4 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#073E48]/15 bg-[#073E48]/5 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#073E48] dark:text-[#27D8BE] dark:border-[#27D8BE]/20 dark:bg-[#27D8BE]/10 mb-4 shadow-2xs">
          <Sparkles className="h-3.5 w-3.5 text-[#27D8BE]" />
          <span>Herramienta 100% Gratuita</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#073E48] dark:text-white leading-tight">
          Cotizador de Casas Prefabricadas y Modulares
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Encuentra el modelo ideal para tu terreno en menos de 5 minutos. Compara precios referenciales y conecta directamente con constructoras verificadas.
        </p>
      </section>

      {/* Componente Principal: Smart Cotizador */}
      <div className="pb-16">
        <SmartCotizador />
      </div>

      {/* Bloque de Garantías y Beneficios de Cotizar */}
      <section className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-[#073E48] dark:text-white">
              ¿Por qué cotizar en SoloCasasChile?
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Te entregamos transparencia y seguridad antes de tomar cualquier decisión de compra o construcción.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#073E48] text-[#27D8BE] flex items-center justify-center shadow-sm">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-[#073E48] dark:text-white">Rápido y Guiado</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                En solo 4 pasos configuras habitantes, dormitorios, sistema constructivo y tu presupuesto estimado.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-[#073E48] dark:text-white">Constructoras Verificadas</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Solo empresas con antecedentes validados, historial comprobable y sellos de confianza oficiales.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-[#073E48] dark:text-white">Sin Costo ni Compromiso</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Cotizar es 100% gratuito. Recibes la información directamente en tu correo y WhatsApp sin ataduras.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-[#073E48] dark:text-white">Cobertura Nacional</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Fabricantes con despacho e instalación desde Arica hasta Punta Arenas para parcelas o sitios urbanos.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#073E48] dark:text-[#27D8BE] hover:underline"
            >
              <span>¿Prefieres ver el catálogo completo de modelos? Ver catálogo aquí →</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
