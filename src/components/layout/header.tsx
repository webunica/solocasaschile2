"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Building2, Home, Library, MapPin, Menu } from "lucide-react";
import { motion } from "framer-motion";
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

const NAV_LINKS = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/catalogo", label: "Catalogo", icon: Library },
  { href: "/constructoras", label: "Constructoras", icon: Building2 },
  { href: "/casas-prefabricadas", label: "Guias", icon: BookOpen },
  { href: "/nosotros", label: "Nosotros", icon: MapPin },
] as const;

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="fixed left-1/2 top-3 z-[100] w-[min(96%,1240px)] -translate-x-1/2 rounded-[2rem] border border-white/20 bg-background/88 shadow-[0_24px_48px_-24px_rgba(15,23,42,0.45)] backdrop-blur-2xl"
    >
      <div className="mx-auto flex h-20 items-center gap-4 px-4 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/images/logo-mobile.png"
            alt="TopCasas"
            width={164}
            height={72}
            className="h-11 w-auto object-contain lg:hidden"
            priority
          />
          <Image
            src="/images/logo-vertical.png"
            alt="TopCasas"
            width={184}
            height={92}
            className="hidden h-14 w-auto object-contain lg:block"
            priority
          />
        </Link>

        <nav className="ml-6 hidden flex-1 items-center justify-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-black uppercase tracking-[0.14em] text-brand-indigo transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Link
            href="/catalogo"
            className={cn(buttonVariants({ variant: "secondary", size: "default" }), "rounded-2xl px-6")}
          >
            Explorar
          </Link>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Abrir menu principal"
              className="ml-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 text-primary lg:hidden"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[320px] border-r border-border/40 bg-background/95 p-0 backdrop-blur-xl">
            <SheetHeader className="border-b border-border/30 p-6 text-left">
              <div className="flex items-center justify-between gap-4">
                <SheetTitle className="font-heading text-2xl font-black tracking-tight text-brand-indigo">
                  TopCasas
                </SheetTitle>
                <ThemeToggle />
              </div>
              <SheetDescription className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
                Fase 1 publica
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-2 p-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-4 py-4 text-sm font-black uppercase tracking-[0.12em] text-brand-indigo transition-colors hover:bg-primary/5 hover:text-primary"
                >
                  <link.icon className="h-4 w-4" aria-hidden="true" />
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="absolute bottom-6 left-0 w-full px-6">
              <Link
                href="/catalogo"
                onClick={() => setIsOpen(false)}
                className={cn(buttonVariants({ variant: "secondary" }), "h-14 w-full rounded-2xl")}
              >
                Ver Catalogo
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  );
}
