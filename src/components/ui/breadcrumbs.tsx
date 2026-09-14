"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { buildBreadcrumbJsonLd, StructuredData } from "@/components/seo/structured-data";

interface BreadcrumbItem {
  name: string;
  url: string;
}

const ROUTE_LABELS: Record<string, string> = {
  catalogo: "Catálogo",
  constructoras: "Constructoras",
  modelo: "Modelos",
  tipos: "Sistemas",
  region: "Regiones",
  blog: "Blog",
  comparar: "Comparador",
  contacto: "Contacto",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // No mostrar en la home
  if (pathname === "/") return null;

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");
  
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Inicio", url: "/" },
    ...pathSegments.map((segment, index) => {
      const url = `/${pathSegments.slice(0, index + 1).join("/")}`;
      
      // Intentar obtener label amigable, si no usar el slug capitalizado
      let name = ROUTE_LABELS[segment] || segment;
      
      // Reemplazo de guiones por espacios y capitalización simple
      name = name
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
        
      return { name, url };
    }),
  ];

  const jsonLd = buildBreadcrumbJsonLd(
    breadcrumbs.map((b) => ({
      name: b.name,
      url: `https://solocasaschile.com${b.url}`,
    }))
  );

  return (
    <div className="sticky top-16 z-40 bg-background/70 backdrop-blur-sm">
      <StructuredData type="BreadcrumbList" data={jsonLd} />
      <div className="container mx-auto flex max-w-7xl items-center overflow-x-auto whitespace-nowrap px-6 py-2 md:px-12">
        <nav className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] md:text-[11px]">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <div key={crumb.url} className="flex items-center gap-2">
                {index === 0 ? (
                  <Link
                    href="/"
                    className="flex items-center text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Home className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <ChevronRight className="w-3 h-3 text-muted-foreground/30 shrink-0" />
                )}

                {isLast ? (
                  <span className="text-primary font-black truncate max-w-[120px] md:max-w-none">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.url}
                    className="text-muted-foreground hover:text-primary transition-colors truncate max-w-[100px] md:max-w-none"
                  >
                    {crumb.name}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
