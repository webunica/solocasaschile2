
import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight, Hash } from "lucide-react";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

const EXPLORE_LINKS = [
  { name: "Inicio", path: "/" },
  { name: "Catalogo", path: "/catalogo" },
  { name: "Constructoras", path: "/constructoras" },
  { name: "Comparador", path: "/comparar" },
  { name: "Planes y Precios", path: "/planes" },
];

const RESOURCE_LINKS = [
  { name: "Blog", path: "/blog" },
  { name: "Sobre Nosotros", path: "/nosotros" },
  { name: "Seguimiento de Obra", path: "/seguimiento-de-obras" },
  { name: "Portal Proveedores", path: "/portal-proveedores" },
  { name: "Como verificamos", path: "/verificacion" },
  { name: "Analisis de Mercado", path: "/premium-access" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2B09BD] text-white pt-20 pb-10 relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Col */}
          <div className="space-y-6 lg:pr-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-11 h-11 bg-[#00FFD1] rounded-[10px] flex items-center justify-center text-[#2B09BD] shadow-[0_0_20px_rgba(0,255,209,0.3)] shrink-0">
                <Hash className="w-6 h-6 stroke-[3]" aria-hidden="true" />
              </div>
              <div className="flex flex-col -gap-1">
                <span className="font-heading font-black text-[22px] leading-none tracking-tight text-white mb-0.5">
                  solocasas
                </span>
                <span className="font-heading font-black text-[18px] leading-none tracking-tight text-[#00FFD1]">
                  chile.com
                </span>
              </div>
            </Link>
            
            <p className="text-[14px] leading-relaxed text-white/80 font-normal">
              La plataforma líder en comparación de modelos de casas y proyectos inmobiliarios en Chile. Encuentra tu hogar ideal con transparencia y datos reales.
            </p>
            
            <div className="flex items-center gap-3 pt-2">
              <Link href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-[#421FD8] flex items-center justify-center hover:bg-[#00FFD1] hover:text-[#2B09BD] transition-colors group">
                <FaInstagram className="w-4 h-4 text-white group-hover:text-[#2B09BD] transition-colors" aria-hidden="true" />
              </Link>
              <Link href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-[#421FD8] flex items-center justify-center hover:bg-[#00FFD1] hover:text-[#2B09BD] transition-colors group">
                <FaFacebookF className="w-4 h-4 text-white group-hover:text-[#2B09BD] transition-colors" aria-hidden="true" />
              </Link>
              <Link href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-[#421FD8] flex items-center justify-center hover:bg-[#00FFD1] hover:text-[#2B09BD] transition-colors group">
                <FaLinkedinIn className="w-4 h-4 text-white group-hover:text-[#2B09BD] transition-colors" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Explorar Col */}
          <div className="space-y-6 lg:pl-8">
            <div className="flex items-center gap-4">
              <p className="text-[16px] font-bold tracking-wide text-white">Explorar</p>
              <div className="h-[2px] w-8 bg-[#00FFD1]"></div>
            </div>
            <ul className="space-y-4 text-[14px] text-white/80 font-medium">
              {EXPLORE_LINKS.map((item) => (
                <li key={item.name}>
                  <Link href={item.path} className="hover:text-[#00FFD1] transition-colors">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos Col */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <p className="text-[16px] font-bold tracking-wide text-white">Recursos</p>
              <div className="h-[2px] w-8 bg-[#00FFD1]"></div>
            </div>
            <ul className="space-y-4 text-[14px] text-white/80 font-medium">
              {RESOURCE_LINKS.map((item) => (
                <li key={item.name}>
                  <Link href={item.path} className="hover:text-[#00FFD1] transition-colors">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto Col */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <p className="text-[16px] font-bold tracking-wide text-white">Contacto</p>
              <div className="h-[2px] w-8 bg-[#00FFD1]"></div>
            </div>
            <ul className="space-y-5">
              <li className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-[#421FD8] shrink-0 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[#00FFD1]" aria-hidden="true" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.1em] mb-0.5">Email</p>
                  <p className="text-[13px] text-white/90 font-medium tracking-wide">contacto@solocasaschile.com</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <a href="https://wa.me/56964130601" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-9 h-9 rounded-lg bg-[#421FD8] group-hover:bg-[#00FFD1] shrink-0 flex items-center justify-center transition-colors">
                    <FaWhatsapp className="w-4 h-4 text-[#00FFD1] group-hover:text-[#2B09BD] transition-colors" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#00FFD1] uppercase tracking-[0.1em] mb-0.5">WhatsApp Ventas</p>
                    <p className="text-[13px] text-white/90 font-medium tracking-wide group-hover:text-[#00FFD1] transition-colors">+56 9 6413 0601</p>
                  </div>
                </a>
              </li>
              <li className="flex items-center gap-4 opacity-70">
                <div className="w-9 h-9 rounded-lg bg-[#421FD8] shrink-0 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-[#00FFD1]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.1em] mb-0.5">Soporte</p>
                  <p className="text-[13px] text-white/90 font-medium tracking-wide">+56 9 6619 8752</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-[#421FD8] shrink-0 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#00FFD1]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.1em] mb-0.5">Ubicación</p>
                  <p className="text-[13px] text-white/90 font-medium tracking-wide">Santiago, Chile</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Suscríbete Col */}
          <div className="space-y-6 lg:pl-4">
            <div className="flex items-center gap-4">
              <p className="text-[16px] font-bold tracking-wide text-white">Suscríbete</p>
              <div className="h-[2px] w-8 bg-[#00FFD1]"></div>
            </div>
            <p className="text-[13px] text-white/80 leading-relaxed font-medium">
              Recibe las mejores ofertas y nuevos modelos directamente en tu correo.
            </p>
            <div className="relative mt-2">
              <input 
                aria-label="Correo para recibir novedades"
                type="email" 
                placeholder="tu@email.com..." 
                className="w-full h-11 bg-[#421FD8] border-none rounded-lg pl-4 pr-12 text-[13px] outline-none placeholder:text-white/40 focus:ring-1 focus:ring-[#00FFD1] transition-all font-medium text-white"
              />
              <button type="button" aria-label="Suscribirse al boletín de noticias" className="absolute right-1 top-1 bottom-1 w-9 bg-[#00FFD1] rounded-[6px] flex items-center justify-center text-[#2B09BD] hover:bg-white transition-colors">
                <ArrowRight className="w-4 h-4 font-bold" aria-hidden="true" />
              </button>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[12px] text-white/70 font-medium tracking-wide">
            © {currentYear} solocasaschile.cl. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6 text-[12px] text-white/70 font-medium tracking-wide">
            <Link href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link>
            <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
