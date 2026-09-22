"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Building2, Compass, Home, Menu, Newspaper } from "lucide-react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { trackCatalogoClick, trackConstructorasAccessClick } from "@/lib/analytics";

const NAV_LINKS = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/constructoras", label: "Constructoras", icon: Building2 },
  { href: "/casas-prefabricadas", label: "Guías", icon: BookOpen },
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/nosotros", label: "Nosotros", icon: Compass },
] as const;

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="fixed left-1/2 top-0 z-[100] w-full -translate-x-1/2"
    >
      <div
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          isScrolled
            ? "bg-white/96 shadow-[0_10px_32px_-28px_rgba(0,38,43,0.2)] backdrop-blur-xl"
            : "bg-[linear-gradient(90deg,rgba(235,244,248,0.88),rgba(244,250,244,0.82),rgba(235,244,248,0.88))] shadow-none backdrop-blur-sm"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center group py-1"
            aria-label="SolocasasChile Inicio"
          >
            {/* Versión Mobile: Icono actual */}
            <Image
              src="/images/logo-icon.png"
              alt="SolocasasChile"
              width={40}
              height={40}
              className="h-10 w-auto rounded-xl object-contain transition-transform duration-200 group-hover:scale-105 sm:hidden"
              priority
            />
            {/* Versión Desktop / Tablet: Logo horizontal 434x70px */}
            <Image
              src="/images/solocasaschile-logo.png"
              alt="SolocasasChile"
              width={434}
              height={70}
              className="hidden h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] sm:block lg:h-10"
              priority
            />
          </Link>

          <nav className="ml-8 hidden flex-1 items-center justify-center gap-3 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3 py-2 text-[16px] font-semibold tracking-[-0.01em] transition-all",
                    isActive
                      ? "bg-brand-indigo text-white shadow-[0_10px_28px_-16px_rgba(0,38,43,0.7)]"
                      : "text-brand-indigo/78 hover:text-brand-indigo"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto hidden items-center gap-3 lg:flex">
            <Link
              href="/para-constructoras"
              onClick={() => trackConstructorasAccessClick("header")}
              className="text-xs font-bold text-brand-indigo/70 hover:text-brand-indigo px-3 py-1.5 rounded-full border border-brand-indigo/15 hover:border-brand-indigo/30 transition-all flex items-center gap-1.5"
            >
              <Building2 className="h-3.5 w-3.5 text-brand-indigo/70" />
              Soy constructora
            </Link>
            <ThemeToggle />
            <Link
              href="/catalogo"
              onClick={() => trackCatalogoClick("header")}
              className={cn(
                "cta-pill cta-vibrate min-h-0 px-6 py-2.5 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] shadow-md shadow-brand-indigo/20 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
              )}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8fffe0] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8fffe0]"></span>
              </span>
              Ver modelos
            </Link>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Abrir menu principal"
                className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-primary lg:hidden"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] border-r border-border/40 bg-background/95 p-0 backdrop-blur-xl">
              <SheetHeader className="border-b border-border/30 p-6 text-left">
                <div className="flex items-center justify-between gap-4">
                  <SheetTitle className="font-heading text-2xl font-black tracking-tight text-brand-indigo flex items-center gap-2">
                    <Image
                      src="/images/logo-icon.png"
                      alt="SolocasasChile Logo"
                      width={36}
                      height={30}
                      className="h-8 w-auto object-contain drop-shadow-sm"
                    />
                    <span>SolocasasChile</span>
                  </SheetTitle>
                  <ThemeToggle />
                </div>
                <SheetDescription className="text-xs font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
                  Catálogo y Constructoras en Chile
                </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-2 p-6">
                {NAV_LINKS.map((link) => {
                  const isActive = link.href === "/"
                    ? pathname === "/"
                    : pathname === link.href || pathname.startsWith(`${link.href}/`);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => {
                        setIsOpen(false);
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-[1.4rem] px-4 py-4 text-[16px] font-semibold tracking-[-0.01em] transition-colors",
                        isActive
                          ? "bg-brand-indigo text-white"
                          : "text-brand-indigo hover:bg-primary/5 hover:text-primary"
                      )}
                    >
                      <link.icon className="h-4 w-4" aria-hidden="true" />
                      {link.label}
                    </Link>
                  );
                })}

                <div className="my-2 border-t border-border/30 pt-2">
                  <Link
                    href="/para-constructoras"
                    onClick={() => {
                      setIsOpen(false);
                      trackConstructorasAccessClick("header");
                    }}
                    className="flex items-center gap-3 rounded-[1.4rem] px-4 py-3.5 text-[15px] font-semibold text-brand-indigo/80 hover:bg-primary/5 hover:text-brand-indigo"
                  >
                    <Building2 className="h-4 w-4 text-brand-indigo" aria-hidden="true" />
                    ¿Eres constructora? Publica aquí
                  </Link>
                </div>
              </div>

              <div className="absolute bottom-6 left-0 w-full px-6">
                <Link
                  href="/catalogo"
                  onClick={() => {
                    setIsOpen(false);
                    trackCatalogoClick("header");
                  }}
                  className={cn(
                    "cta-pill cta-vibrate min-h-0 h-13 w-full flex items-center justify-center rounded-full font-extrabold uppercase tracking-[0.16em] shadow-md shadow-brand-indigo/20 gap-2"
                  )}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8fffe0] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8fffe0]"></span>
                  </span>
                  Ver modelos
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
