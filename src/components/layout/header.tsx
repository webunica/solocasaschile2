"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Library, ArrowLeftRight, Building2, LayoutGrid, CreditCard } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/catalogo", label: "Catálogo", icon: Library },
  { href: "/comparar", label: "Comparador", icon: ArrowLeftRight },
  { href: "/constructoras", label: "Constructoras", icon: Building2 },
];

export function Header() {
  const { scrollY } = useScroll();
  const [isOpen, setIsOpen] = useState(false);
  
  // Adaptive height and style based on scroll
  const headerY = useTransform(scrollY, [0, 50], [20, 10]);
  const headerWidth = useTransform(scrollY, [0, 50], ["98%", "94%"]);
  const headerRadius = useTransform(scrollY, [0, 50], ["1.5rem", "4rem"]);
  const headerOpacity = useTransform(scrollY, [0, 50], [0.95, 1]);

  return (
    <motion.header 
      style={{ 
        top: headerY,
        width: headerWidth,
        borderRadius: headerRadius,
        opacity: headerOpacity,
        marginTop: 'var(--announcement-height, 0px)'
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-[100] border border-white/20",
        "bg-background/80 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)]",
        "transition-all duration-500"
      )}
    >
      <div className="container flex h-20 items-center px-4 sm:px-10 md:px-16 max-w-7xl mx-auto overflow-hidden">
        <Link href="/" className="mr-6 lg:mr-16 flex items-center group shrink-0 relative transition-transform hover:scale-[1.02]">
          <div className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Image 
            src="/images/logo.png" 
            alt="SolocasasChile" 
            width={240} 
            height={60} 
            className="h-10 md:h-16 w-auto object-contain relative z-10"
            priority
          />
        </Link>
        
        <div className="flex flex-1 items-center justify-end lg:justify-between gap-6">
          <nav className="hidden lg:flex items-center space-x-12 text-[11px] font-black uppercase tracking-[0.25em]">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-muted-foreground hover:text-primary transition-all relative group py-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3 border-r border-border/40 pr-8">
                <ThemeToggle />
                <Link 
                  href="/login" 
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }), 
                    "text-[10px] font-black uppercase tracking-widest hover:text-primary hover:bg-transparent transition-all"
                  )}
                >
                  Acceder
                </Link>
            </div>
             
            <Link 
              href="/planes" 
              className={cn(
                buttonVariants({ size: "default" }),
                "brand-gradient text-white border-none rounded-2xl px-10 font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(var(--primary-rgb),0.3)] hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all h-12 hidden lg:inline-flex"
              )}
            >
              Publicar Propiedad
            </Link>

            {/* Hamburger Menu (Mobile/Tablet Only) */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-primary/5 border border-primary/10 text-primary active:scale-90 transition-all">
                   <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] border-r border-border/40 bg-background/95 backdrop-blur-xl p-0">
                <SheetHeader className="p-8 border-b border-border/40">
                   <div className="flex items-center justify-between">
                     <SheetTitle className="text-left font-heading font-black tracking-tighter text-2xl">Menu</SheetTitle>
                     <ThemeToggle />
                   </div>
                   <SheetDescription className="text-left text-xs uppercase tracking-widest font-bold opacity-60">SolocasasChile v2</SheetDescription>
                </SheetHeader>
                
                <div className="flex flex-col p-6 space-y-4">
                   <Link 
                     href="/" 
                     onClick={() => setIsOpen(false)}
                     className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 text-foreground font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all group"
                   >
                     <Home className="w-5 h-5 opacity-40 group-hover:opacity-100" /> Inicio
                   </Link>
                   
                   <div className="h-px bg-border/40 my-2" />

                   {NAV_LINKS.map((link) => (
                     <Link 
                       key={link.href}
                       href={link.href}
                       onClick={() => setIsOpen(false)}
                       className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 text-muted-foreground hover:text-foreground font-black text-[10px] uppercase tracking-widest transition-all group"
                     >
                       <link.icon className="w-5 h-5 opacity-40 group-hover:opacity-100" /> {link.label}
                     </Link>
                   ))}

                   <div className="h-px bg-border/40 my-2" />

                   <Link 
                     href="/login" 
                     onClick={() => setIsOpen(false)}
                     className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 text-muted-foreground hover:text-foreground font-black text-[10px] uppercase tracking-widest transition-all"
                   >
                     <CreditCard className="w-5 h-5 opacity-40" /> Mi Cuenta
                   </Link>
                </div>

                <div className="absolute bottom-8 left-0 w-full px-8">
                   <Link 
                      href="/planes" 
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center gap-3 brand-gradient text-white h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/20"
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

