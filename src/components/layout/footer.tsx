import Link from "next/link";
import Image from "next/image";
import { Building2, Mail, MapPin, Phone, Sparkles, Trees } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const EXPLORE_LINKS = [
  { name: "Inicio", path: "/" },
  { name: "Catálogo", path: "/catalogo" },
  { name: "Constructoras", path: "/constructoras" },
  { name: "Guías", path: "/casas-prefabricadas" },
  { name: "Blog", path: "/blog" },
] as const;

const RESOURCE_LINKS = [
  { name: "Modelos", path: "/modelos-casas-prefabricadas" },
  { name: "Sistemas", path: "/tipos/prefabricada" },
  { name: "Para Constructoras", path: "/para-constructoras" },
  { name: "Planes para Empresas", path: "/planes" },
  { name: "Plan Starter (Por Invitación)", path: "/planes/starter" },
  { name: "Nosotros", path: "/nosotros" },
  { name: "Verificación de Constructoras", path: "/verificacion-de-empresas-constructoras" },
  { name: "Ejercer Derechos (Ley 21.719)", path: "/ejercer-derechos" },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-brand-evergreen-dark pb-10 pt-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(224,244,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(171,255,174,0.12),transparent_30%)]" />
      <div className="absolute inset-0 architect-grid opacity-[0.08]" />

      <div className="container relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-16 grid gap-10 rounded-[2rem] border border-white/10 bg-white/6 p-8 backdrop-blur-xl md:grid-cols-[1.25fr_0.8fr_0.8fr_1fr] md:p-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-white/90">
              <Sparkles className="h-3.5 w-3.5" />
              Comparador independiente
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl overflow-hidden shrink-0 shadow-lg">
                  <Image
                    src="/images/logo-icon.png"
                    alt="SolocasasChile"
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-heading text-3xl font-semibold tracking-tight text-white">SolocasasChile</p>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-white/80">
                    Modelos, especificaciones y constructoras
                  </p>
                </div>
              </div>
              <p className="max-w-md text-sm font-medium leading-relaxed text-white/90">
                Ayudamos a comparar modelos de casas prefabricadas, paneles SIP y modulares con precios referenciales y especificaciones técnicas para tomar una mejor decisión en Chile.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.18em] text-white">
              <Trees className="h-4 w-4 text-accent" />
              Explorar
            </p>
            <ul className="space-y-3 text-sm font-medium text-white/90">
              {EXPLORE_LINKS.map((item) => (
                <li key={item.path}>
                  <Link href={item.path} className="transition-colors hover:text-accent">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-white">Recursos y Empresas</p>
            <ul className="space-y-3 text-sm font-medium text-white/90">
              {RESOURCE_LINKS.map((item) => (
                <li key={item.path}>
                  <Link href={item.path} className="transition-colors hover:text-accent">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-white">Contacto</p>
            <div className="space-y-4 text-sm font-medium text-white/90">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-accent" aria-hidden="true" />
                <span>contacto@solocasaschile.com</span>
              </div>
              <a
                href="https://wa.me/56964130601"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 transition-colors hover:text-accent"
              >
                <FaWhatsapp className="mt-0.5 h-4 w-4 text-accent" aria-hidden="true" />
                <span>+56 9 6413 0601 (Comercial)</span>
              </a>
              <a
                href="tel:+56966198752"
                className="flex items-start gap-3 transition-colors hover:text-accent"
              >
                <Phone className="mt-0.5 h-4 w-4 text-accent" aria-hidden="true" />
                <span>Soporte técnico: +56 9 6619 8752</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-accent" aria-hidden="true" />
                <span>Santiago, Chile</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-xs font-medium text-white/75 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} solocasaschile.com. Todos los derechos reservados.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/terminos" className="transition-colors hover:text-white">
              Términos
            </Link>
            <Link href="/privacidad" className="transition-colors hover:text-white">
              Política de Privacidad
            </Link>
            <Link href="/ejercer-derechos" className="transition-colors hover:text-white">
              Ejercer Derechos (Ley 21.719)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
