import Link from "next/link";
import { Globe, Share2, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background text-foreground pt-32 pb-16 border-t border-border/40 relative overflow-hidden">
      {/* Decorative Brand Background Text */}
      <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/4 text-[20vw] font-black text-muted/20 tracking-[-0.1em] pointer-events-none select-none uppercase -z-10">
         CASA
      </div>
      
      <div className="container max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-20 mb-32">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-12">
            <Link href="/" className="inline-block group">
              <span className="font-heading font-black text-6xl tracking-[-0.08em] block transition-transform group-hover:scale-105 duration-500">
                Solocasas<br /><span className="text-muted-foreground opacity-40">Chile</span>
              </span>
            </Link>
            
            <p className="text-lg leading-relaxed text-muted-foreground font-medium max-w-sm">
              Conectando el sueño de la vivienda con la <strong className="text-foreground">excelencia industrial</strong> chilena. Uniendo familias con constructoras certificadas.
            </p>
            
            <div className="flex items-center gap-6">
              {[Globe, Share2, Mail].map((Icon, i) => (
                <Link 
                  key={i} 
                  href="#" 
                  className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center hover:brand-gradient hover:text-white transition-all transform hover:scale-110 duration-500 border border-border/20 shadow-sm"
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation - Systems */}
          <div className="space-y-10 group">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity">Sistemas</h4>
            <ul className="space-y-6 text-[11px] font-black uppercase tracking-widest text-foreground/80">
              {["Prefabricada", "SIP", "Container", "Llave en Mano"].map((item) => (
                <li key={item} className="flex items-center gap-3 hover:gap-5 transition-all cursor-pointer hover:text-primary">
                  {item} <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation - Platform */}
          <div className="space-y-10 group">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity">Consola</h4>
            <ul className="space-y-6 text-[11px] font-black uppercase tracking-widest text-foreground/80">
              {["Catálogo", "Constructoras", "Comparar", "Planes"].map((item) => (
                <li key={item} className="flex items-center gap-3 hover:gap-5 transition-all cursor-pointer hover:text-primary">
                  {item} <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">Contacto</h4>
            <ul className="space-y-6 text-[11px] font-black leading-relaxed">
              <li className="flex items-center gap-4 group cursor-pointer hover:text-primary transition-colors">
                <div className="w-10 h-10 rounded-full bg-muted/40 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                contacto@solocasaschile.cl
              </li>
              <li className="flex items-center gap-4 group cursor-pointer hover:text-brand-teal transition-colors">
                <div className="w-10 h-10 rounded-full bg-muted/40 flex items-center justify-center group-hover:bg-brand-teal/10 transition-colors">
                  <Phone className="w-4 h-4 text-brand-teal" />
                </div>
                +56 9 6619 8752
              </li>
              <li className="flex items-start gap-4 text-muted-foreground font-medium text-xs leading-relaxed max-w-[150px]">
                 Santiago, Región Metropolitana, Chile
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-baseline gap-4">
             <span className="text-4xl font-black tracking-[-0.1em] text-foreground/20 uppercase">SCCH</span>
             <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.5em] opacity-40">
               © {currentYear} SolocasasChile · V2 Performance Platform
             </p>
          </div>
          <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
            <Link href="/privacidad" className="hover:text-primary transition-all">Privacidad</Link>
            <Link href="/terminos" className="hover:text-primary transition-all">Términos</Link>
            <Link href="/cookies" className="hover:text-primary transition-all">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
