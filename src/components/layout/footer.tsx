import Link from "next/link";
import { Building2, Globe, Share2, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-white/5">
      <div className="container max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2 text-white">
              <span className="font-heading font-bold text-2xl tracking-tighter text-primary">SolocasasChile</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              La plataforma líder en Chile para comparar modelos de casas prefabricadas, SIP y modulares. Empoderamos a las personas para que construyan su sueño con información real y empresas certificadas.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="p-2 bg-white/5 rounded-lg hover:bg-primary/20 hover:text-primary transition-all">
                <Globe className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 bg-white/5 rounded-lg hover:bg-primary/20 hover:text-primary transition-all">
                <Share2 className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 bg-white/5 rounded-lg hover:bg-primary/20 hover:text-primary transition-all">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Navigation - Tipos */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Sistemas Constructivos</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/tipos/prefabricada" className="hover:text-primary transition-colors">Casas Prefabricadas</Link></li>
              <li><Link href="/tipos/sip" className="hover:text-primary transition-colors">Construcción SIP</Link></li>
              <li><Link href="/tipos/container" className="hover:text-primary transition-colors">Casas Container</Link></li>
              <li><Link href="/tipos/llave-en-mano" className="hover:text-primary transition-colors">Llave en Mano</Link></li>
            </ul>
          </div>

          {/* Navigation - Platform */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Módulos Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/catalogo" className="hover:text-primary transition-colors">Catálogo Completo</Link></li>
              <li><Link href="/constructoras" className="hover:text-primary transition-colors">Ranking de Constructoras</Link></li>
              <li><Link href="/comparar" className="hover:text-primary transition-colors">Comparador Side-by-Side</Link></li>
              <li><Link href="/planes" className="hover:text-primary transition-colors">Planes para Empresas</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Contacto y Soporte</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>contacto@solocasaschile.cl</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+56 9 1234 5678</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>Santiago, Región Metropolitana, Chile</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {currentYear} SolocasasChile. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
            <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
            <Link href="/terminos" className="hover:text-white transition-colors">Términos</Link>
            <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
