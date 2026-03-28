"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Library, Compass, Building2, LayoutGrid, CreditCard } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/catalogo", label: "Catálogo", icon: Library },
  { href: "/comparar", label: "Comparador", icon: Compass },
  { href: "/constructoras", label: "Constructoras", icon: Building2 },
];

export function Header() {
  const { scrollY } = useScroll();
  const [isOpen, setIsOpen] = useState(false);
  
  // Adaptive height and style based on scroll
  const headerY = useTransform(scrollY, [0, 50], [20, 10]);
  const headerWidth = useTransform(scrollY, [0, 50], ["98%", "94%"]);
  const headerRadius = useTransform(scrollY, [0, 50], ["1.5rem", "4rem"]);
  const headerOpacity = useTransform(scrollY, [0, 50], [0.8, 0.98]);

  return (
    <motion.header 
      style={{ 
        top: headerY,
        width: headerWidth,
        borderRadius: headerRadius,
        opacity: headerOpacity
      }}
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-[100] border border-border/40",
        "bg-background/60 backdrop-blur-2xl shadow-2xl shadow-primary/5",
        "transition-colors duration-500"
      )}
    >
      <div className="container flex h-16 items-center px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
        <Link href="/" className="mr-6 lg:mr-10 flex items-center group shrink-0">
          <Image 
            src="/images/logo.png" 
            alt="SolocasasChile" 
            width={180} 
            height={40} 
            className="h-7 md:h-10 w-auto object-contain"
            priority
          />
        </Link>
        
        <div className="flex flex-1 items-center justify-end lg:justify-between gap-4">
          <nav className="hidden lg:flex items-center space-x-10 text-[10px] font-black uppercase tracking-[0.2em]">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-primary transition-all hover:tracking-[0.3em]">
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-2 sm:gap-4">
             <div className="flex items-center gap-2 border-r border-border/40 pr-2 sm:pr-4 mr-1 sm:mr-2">
                <ThemeToggle />
                <Link 
                  href="/login" 
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-[10px] font-black uppercase tracking-widest hidden sm:inline-flex opacity-60 hover:opacity-100 hover:bg-transparent")}
                >
                  Acceder
                </Link>
             </div>
             
             <Link 
               href="/planes" 
               className={cn(
                 buttonVariants({ size: "sm" }),
                 "brand-gradient text-white border-none rounded-full px-4 sm:px-8 font-black text-[9px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all h-9 sm:h-10"
               )}
             >
               <span className="hidden xs:inline">Publicar Casa</span>
               <LayoutGrid className="w-4 h-4 xs:hidden" />
             </Link>

             {/* Hamburger Menu (Mobile/Tablet) */}
             <Sheet open={isOpen} onOpenChange={setIsOpen}>
               <SheetTrigger asChild>
                 <button className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-primary/5 border border-primary/10 text-primary active:scale-90 transition-all">
                    <Menu className="w-5 h-5" />
                 </button>
               </SheetTrigger>
               <SheetContent side="right" className="w-[300px] border-l border-border/40 bg-background/95 backdrop-blur-xl p-0">
                 <SheetHeader className="p-8 border-b border-border/40">
                    <SheetTitle className="text-left font-heading font-black tracking-tighter text-2xl">Menu</SheetTitle>
                    <SheetDescription className="text-left text-xs uppercase tracking-widest font-bold opacity-60">SolocasasChile v2</SheetDescription>
                 </SheetHeader>
                 
                 <div className="flex flex-col p-6 space-y-4">
                    <Link 
                      href="/" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 text-foreground font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all group"
                    >
                      <Home className="w-5 h-5 opacity-40 group-hover:opacity-100" /> Inicio
                    </Link>
                    
                    <div className="h-px bg-border/40 my-2" />

                    {NAV_LINKS.map((link) => (
                      <Link 
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 text-muted-foreground hover:text-foreground font-black text-xs uppercase tracking-widest transition-all group"
                      >
                        <link.icon className="w-5 h-5 opacity-40 group-hover:opacity-100" /> {link.label}
                      </Link>
                    ))}

                    <div className="h-px bg-border/40 my-2" />

                    <Link 
                      href="/login" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 text-muted-foreground hover:text-foreground font-black text-xs uppercase tracking-widest transition-all"
                    >
                      <CreditCard className="w-5 h-5 opacity-40" /> Mi Cuenta
                    </Link>
                 </div>

                 <div className="absolute bottom-8 left-0 w-full px-8">
                    <Link 
                       href="/planes" 
                       onClick={() => setIsOpen(false)}
                       className="w-full flex items-center justify-center gap-3 brand-gradient text-white h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20"
                    >
                       Publicar Propiedad
                    </Link>
                 </div>
               </SheetContent>
             </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

