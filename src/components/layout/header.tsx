"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from "lucide-react";
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
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

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
  const [planesOpen, setPlanesOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const planesRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then((res: { data: { user: SupabaseUser | null } | null }) => {
      setUser(res?.data?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: unknown, session: { user: SupabaseUser | null } | null) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsOpen(false);
    window.location.href = "/";
  };

  const getUserGreetingName = (currentUser: SupabaseUser | null): string => {
    if (!currentUser) return "";
    const meta = currentUser.user_metadata || {};
    const name = meta.nombre || meta.name || meta.full_name;
    if (name && typeof name === "string") {
      return name.trim().split(" ")[0];
    }
    if (currentUser.email) {
      const prefix = currentUser.email.split("@")[0];
      return prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }
    return "Usuario";
  };

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (planesRef.current && !planesRef.current.contains(event.target as Node)) {
        setPlanesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setPlanesOpen(false);
    setIsOpen(false);
  }, [pathname]);

  const isPlanesActive = pathname === "/planes" || pathname.startsWith("/planes/");

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
            className="hidden lg:flex items-center gap-6 lg:gap-8"
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

            {/* Dropdown de Planes (De pago y Starter) */}
            <div
              ref={planesRef}
              className="relative"
              onMouseEnter={() => setPlanesOpen(true)}
              onMouseLeave={() => setPlanesOpen(false)}
            >
              <button
                type="button"
                onClick={() => setPlanesOpen((prev) => !prev)}
                aria-expanded={planesOpen}
                className={cn(
                  "relative flex items-center gap-1.5 py-1 text-sm lg:text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27D8BE] focus-visible:ring-offset-2 rounded-md",
                  isPlanesActive
                    ? "text-[#073E48] font-bold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#27D8BE] after:rounded-full"
                    : "text-[#073E48]/80 hover:text-[#073E48]"
                )}
              >
                <span>Planes</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    planesOpen && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </button>

              {/* Menú flotante de Planes */}
              <div
                className={cn(
                  "absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-72 transition-all duration-200 z-50",
                  planesOpen
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2 pointer-events-none"
                )}
              >
                <div className="rounded-2xl bg-white p-2.5 shadow-[0_16px_36px_-8px_rgba(7,62,72,0.18)] border border-slate-100 flex flex-col gap-1">
                  <Link
                    href="/planes"
                    onClick={() => setPlanesOpen(false)}
                    className={cn(
                      "flex flex-col gap-0.5 rounded-xl p-3 transition-colors text-left group",
                      pathname === "/planes"
                        ? "bg-slate-50 text-[#073E48]"
                        : "hover:bg-slate-50 text-[#073E48]"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#073E48] group-hover:text-[#0a4d59] transition-colors">
                        Planes de Pago
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-[#073E48]/8 text-[#073E48] px-2 py-0.5 rounded-full">
                        Suscripción
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium leading-tight">
                      Basic, Crece y Pro para constructoras
                    </span>
                  </Link>

                  <Link
                    href="/planes/starter"
                    onClick={() => setPlanesOpen(false)}
                    className={cn(
                      "flex flex-col gap-0.5 rounded-xl p-3 transition-colors text-left group",
                      pathname === "/planes/starter"
                        ? "bg-slate-50 text-[#073E48]"
                        : "hover:bg-slate-50 text-[#073E48]"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#073E48] group-hover:text-[#0a4d59] transition-colors">
                        Plan Starter
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        Gratis
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium leading-tight">
                      1 modelo gratuito permanente por invitación
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* CTA Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-full bg-[#073E48]/5 border border-[#073E48]/15 px-3.5 py-1.5 text-xs lg:text-sm font-bold text-[#073E48] hover:bg-[#073E48] hover:text-white transition-all shadow-sm group"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#073E48] text-[#27D8BE] group-hover:bg-white group-hover:text-[#073E48] transition-colors">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span>Hola, {getUserGreetingName(user)}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition-all cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Salir</span>
                </button>
              </div>
            ) : (
              <Link
                href="/para-constructoras"
                onClick={() => trackConstructorasAccessClick("header")}
                className="rounded-full border border-[#073E48] px-5 py-2.5 text-xs lg:text-sm font-semibold tracking-wide text-[#073E48] transition-all duration-200 hover:bg-[#073E48] hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27D8BE] focus-visible:ring-offset-2"
              >
                Publica tu constructora
              </Link>
            )}
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
                className="w-[300px] sm:w-[360px] bg-white p-0 border-l border-slate-100 shadow-2xl overflow-y-auto"
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

                {user && (
                  <div className="bg-[#073E48]/5 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#073E48] text-[#27D8BE] shadow-sm">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                        Sesión activa
                      </span>
                      <span className="text-base font-extrabold text-[#073E48] truncate">
                        Hola, {getUserGreetingName(user)} 👋
                      </span>
                    </div>
                  </div>
                )}

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

                  {/* Sección Planes en Mobile */}
                  <div className="mt-2 pt-3 border-t border-slate-100">
                    <div className="px-4 py-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Planes Constructoras
                    </div>

                    <Link
                      href="/planes"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold transition-colors mt-1",
                        pathname === "/planes"
                          ? "bg-[#073E48] text-white"
                          : "text-[#073E48] hover:bg-slate-50"
                      )}
                    >
                      <div className="flex flex-col">
                        <span>Planes de Pago</span>
                        <span
                          className={cn(
                            "text-xs font-normal",
                            pathname === "/planes" ? "text-white/80" : "text-slate-500"
                          )}
                        >
                          Basic, Crece y Pro
                        </span>
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full",
                          pathname === "/planes"
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-[#073E48]"
                        )}
                      >
                        Suscripción
                      </span>
                    </Link>

                    <Link
                      href="/planes/starter"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold transition-colors mt-1",
                        pathname === "/planes/starter"
                          ? "bg-[#073E48] text-white"
                          : "text-[#073E48] hover:bg-slate-50"
                      )}
                    >
                      <div className="flex flex-col">
                        <span>Plan Starter</span>
                        <span
                          className={cn(
                            "text-xs font-normal",
                            pathname === "/planes/starter" ? "text-white/80" : "text-slate-500"
                          )}
                        >
                          1 modelo gratis por invitación
                        </span>
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full",
                          pathname === "/planes/starter"
                            ? "bg-emerald-500 text-white"
                            : "bg-emerald-100 text-emerald-800"
                        )}
                      >
                        Gratis
                      </span>
                    </Link>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-2.5">
                    {user ? (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center gap-2 rounded-full bg-[#073E48] px-5 py-3 text-sm font-bold text-white transition-all hover:bg-[#0a4d59] text-center shadow-md active:scale-95"
                        >
                          <LayoutDashboard className="h-4 w-4 text-[#27D8BE]" />
                          <span>Ir a mi Panel de Control</span>
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50/70 px-5 py-3 text-sm font-bold text-red-600 transition-all hover:bg-red-100 text-center active:scale-95 cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Salir / Cerrar sesión</span>
                        </button>
                      </>
                    ) : (
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
                    )}
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
