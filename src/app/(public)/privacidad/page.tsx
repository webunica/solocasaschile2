import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Eye, FileText, UserCheck, Bell } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacidad de Datos | SolocasasChile",
  description: "Conoce cómo protegemos y gestionamos tus datos personales en SolocasasChile.",
};

export default function PrivacidadPage() {
  const sections = [
    {
      title: "1. Recolección de Información",
      icon: UserCheck,
      content: "Recopilamos información que usted nos proporciona directamente al registrarse, solicitar cotizaciones o contactar a una constructora. Esto incluye nombre, correo electrónico, número de teléfono y detalles sobre su proyecto de vivienda."
    },
    {
      title: "2. Uso de los Datos",
      icon: Eye,
      content: "Utilizamos sus datos para facilitar la comunicación entre usted y las constructoras de su interés, mejorar nuestra plataforma, enviar alertas de nuevos modelos (si lo autoriza) y garantizar la seguridad de su cuenta."
    },
    {
      title: "3. Intercambio con Terceros",
      icon: Lock,
      content: "Sus datos de contacto solo se comparten con las constructoras a las que usted solicita información explícitamente a través de nuestros formularios de cotización. No vendemos ni alquilamos su información personal a terceros no relacionados."
    },
    {
      title: "4. Protección de la Información",
      icon: ShieldCheck,
      content: "Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos contra el acceso no autorizado, la alteración o la destrucción. Utilizamos cifrado SSL en todas nuestras comunicaciones."
    },
    {
      title: "5. Sus Derechos",
      icon: FileText,
      content: "Usted tiene derecho a acceder, rectificar o eliminar sus datos personales en cualquier momento. Puede ejercer estos derechos enviando un correo electrónico a privacidad@solocasaschile.com."
    },
    {
      title: "6. Cambios en la Política",
      icon: Bell,
      content: "Nos reservamos el derecho de modificar esta política de privacidad. Cualquier cambio sustancial será notificado a través de nuestra plataforma o por correo electrónico antes de que entre en vigencia."
    }
  ];

  return (
    <main className="min-h-screen pt-44 pb-20 bg-background">
      <div className="container max-w-4xl mx-auto px-6">
        
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </Link>
        
        <div className="space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" /> Transparencia Total
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-black tracking-tighter text-brand-indigo italic">
            Privacidad de <span className="text-brand-teal">Datos</span>
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
            En SolocasasChile, valoramos la confianza que depositas en nosotros. Esta política explica de manera clara cómo manejamos tu información.
          </p>
        </div>

        <div className="grid gap-8">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-card/30 border border-border/40 rounded-[2.5rem] p-8 md:p-10 space-y-6 hover:border-brand-teal/30 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-indigo/5 flex items-center justify-center text-brand-indigo group-hover:bg-brand-teal group-hover:text-white transition-all">
                  <section.icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black font-heading tracking-tight text-brand-indigo italic">
                  {section.title}
                </h2>
              </div>
              <p className="text-muted-foreground font-medium leading-relaxed md:text-lg pl-2 border-l-2 border-brand-teal/20 group-hover:border-brand-teal transition-all">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-10 rounded-[3rem] bg-brand-indigo text-white space-y-6 text-center shadow-2xl shadow-brand-indigo/20">
          <h3 className="text-2xl font-black font-heading">¿Tienes dudas adicionales?</h3>
          <p className="text-white/70 font-medium">Nuestro equipo de cumplimiento está listo para ayudarte con cualquier consulta sobre tus datos.</p>
          <div className="pt-4">
            <a 
              href="mailto:privacidad@solocasaschile.com" 
              className="inline-flex h-14 px-10 items-center justify-center bg-brand-teal text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white hover:text-brand-indigo transition-all shadow-lg shadow-brand-teal/20"
            >
              Contactar a Privacidad
            </a>
          </div>
        </div>

        <p className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40 italic">
          Última actualización: 10 de Abril, 2024 · SolocasasChile S.A.
        </p>

      </div>
    </main>
  );
}
