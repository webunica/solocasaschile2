import Link from "next/link";
import { Building2, Mail, MapPin, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const EXPLORE_LINKS = [
  { name: "Inicio", path: "/" },
  { name: "Catalogo", path: "/catalogo" },
  { name: "Constructoras", path: "/constructoras" },
  { name: "Casas Prefabricadas", path: "/casas-prefabricadas" },
] as const;

const RESOURCE_LINKS = [
  { name: "Modelos", path: "/modelos-casas-prefabricadas" },
  { name: "Sistemas", path: "/tipos/prefabricada" },
  { name: "Nosotros", path: "/nosotros" },
  { name: "Verificacion", path: "/verificacion" },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[color:var(--color-brand-evergreen-dark)] pb-10 pt-20 text-white">
      <div className="container relative z-10 mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[1.4fr_1fr_1fr_1.1fr] md:px-12">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-teal/20 text-brand-teal">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-heading text-2xl font-black tracking-tight text-white">TopCasas</p>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-brand-teal">
                Catalogo y constructoras
              </p>
            </div>
          </div>
          <p className="max-w-md text-sm font-medium leading-relaxed text-white/72">
            Plataforma para explorar modelos de casas industrializadas, comparar constructoras y cotizar con mejor contexto.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-white">Explorar</p>
          <ul className="space-y-3 text-sm font-medium text-white/75">
            {EXPLORE_LINKS.map((item) => (
              <li key={item.path}>
                <Link href={item.path} className="transition-colors hover:text-brand-teal">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-white">Recursos</p>
          <ul className="space-y-3 text-sm font-medium text-white/75">
            {RESOURCE_LINKS.map((item) => (
              <li key={item.path}>
                <Link href={item.path} className="transition-colors hover:text-brand-teal">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-5">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-white">Contacto</p>
          <div className="space-y-4 text-sm font-medium text-white/78">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-brand-teal" aria-hidden="true" />
              <span>contacto@topcasas.cl</span>
            </div>
            <a
              href="https://wa.me/56964130601"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 transition-colors hover:text-brand-teal"
            >
              <FaWhatsapp className="mt-0.5 h-4 w-4 text-brand-teal" aria-hidden="true" />
              <span>+56 9 6413 0601</span>
            </a>
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-brand-teal" aria-hidden="true" />
              <span>Atencion comercial Chile</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-brand-teal" aria-hidden="true" />
              <span>Santiago, Chile</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-12 flex max-w-7xl flex-col gap-4 border-t border-white/10 px-6 pt-6 text-xs font-medium text-white/55 md:flex-row md:items-center md:justify-between md:px-12">
        <p>© {currentYear} topcasas.cl. Todos los derechos reservados.</p>
        <div className="flex items-center gap-6">
          <Link href="/terminos" className="transition-colors hover:text-white">
            Terminos
          </Link>
          <Link href="/privacidad" className="transition-colors hover:text-white">
            Privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
}
