"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { trackConstructorasAccessClick } from "@/lib/analytics";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Modelos" },
  { href: "/constructoras", label: "Constructoras" },
  { href: "/tipos/prefabricada", label: "Sistemas" },
  { href: "/casas-prefabricadas", label: "Guías" },
] as const;

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white transition-shadow duration-300">
      <div
        className={cn(
          "w-full border-b border-slate-100 transition-all duration-200",
          isScrolled ? "shadow-[0_4px_20px_-8px_rgba(7,62,72,0.08)]" : "shadow-none"
        )}
      >
        <div className="mx-auto flex h-[72px] lg:h-[88px] max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-12">
          {/* Logo actual de SoloCasasChile */}
          <Link
            href="/"
            className="flex shrink-0 items-center group py-2"
            aria-label="SoloCasasChile Inicio"
          >
            {/* Mobile: Logo horizontal compacto */}
            <Image
              src="/hero/logo-mobile.png"
              alt="SoloCasasChile"
              width={300}
              height={48}
              className="h-8 w-auto max-w-[190px] object-contain transition-transform duration-200 group-hover:scale-105 sm:hidden"
              priority
            />
            {/* Desktop / Tablet: Logo horizontal oficial */}
            <Image
              src="/images/solocasaschile-logo.png"
              alt="SoloCasasChile"
              width={434}
              height={70}
              className="hidden h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] sm:block lg:h-10"
              priority
            />
          </Link>

          {/* Navegación Desktop (desde 1024px en adelante) */}
          <nav
            aria-label="Navegación principal"
            className="hidden lg:flex items-center gap-7 lg:gap-9"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative py-1 text-sm lg:text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27D8BE] focus-visible:ring-offset-2 rounded-md",
                    isActive
                      ? "text-[#073E48] font-bold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#27D8BE] after:rounded-full"
                      : "text-[#073E48]/80 hover:text-[#073E48]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA Desktop: Botón secundario delineado "Publica tu constructora" */}
          <div className="hidden lg:flex items-center">
            <Link
              href="/para-constructoras"
              onClick={() => trackConstructorasAccessClick("header")}
              className="rounded-full border border-[#073E48] px-5 py-2.5 text-xs lg:text-sm font-semibold tracking-wide text-[#073E48] transition-all duration-200 hover:bg-[#073E48] hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27D8BE] focus-visible:ring-offset-2"
            >
              Publica tu constructora
            </Link>
          </div>

          {/* Menú Hamburguesa Mobile (circular, oculto desde 1024px) */}
          <div className="flex items-center lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Abrir menú de navegación"
                  className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[#073E48] hover:bg-slate-50 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27D8BE]"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[360px] bg-white p-0 border-l border-slate-100 shadow-2xl"
              >
                <SheetHeader className="border-b border-slate-100 p-6 text-left">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="flex items-center">
                      <Image
                        src="/hero/logo-mobile.png"
                        alt="SoloCasasChile"
                        width={200}
                        height={32}
                        className="h-7 w-auto object-contain"
                      />
                    </SheetTitle>
                  </div>
                  <SheetDescription className="sr-only">
                    Navegación principal de SoloCasasChile
                  </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-1 p-6">
                  {NAV_LINKS.map((link) => {
                    const isActive =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname === link.href || pathname.startsWith(`${link.href}/`);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "rounded-xl px-4 py-3 text-base font-semibold transition-colors",
                          isActive
                            ? "bg-[#073E48] text-white"
                            : "text-[#073E48] hover:bg-slate-50"
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}

                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <Link
                      href="/para-constructoras"
                      onClick={() => {
                        setIsOpen(false);
                        trackConstructorasAccessClick("header");
                      }}
                      className="flex items-center justify-center rounded-full border border-[#073E48] px-5 py-3 text-sm font-bold text-[#073E48] transition-all hover:bg-[#073E48] hover:text-white text-center active:scale-95"
                    >
                      Publica tu constructora
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
