"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Library, ArrowLeftRight, Building2, LayoutGrid, CreditCard, User, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { MegaMenu } from "./mega-menu";

const NAV_LINKS = [
  { href: "/catalogo", label: "Catálogo", icon: Library },
  { href: "/comparar", label: "Comparador", icon: ArrowLeftRight },
  { href: "/constructoras", label: "Constructoras", icon: Building2 },
  { href: "/blog", label: "Blog", icon: LayoutGrid },
  { href: "/planes", label: "Precios", icon: CreditCard },
];

export function Header({ megaMenuAds }: { megaMenuAds?: any }) {
  const { scrollY } = useScroll();
  const [isOpen, setIsOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  
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
        "fixed left-1/2 -translate-x-1/2 z-[100] border border-white/10 lg:border-white/20",
        "bg-transparent lg:bg-background/80 backdrop-blur-none lg:backdrop-blur-3xl shadow-none lg:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)]",
        "transition-all duration-500"
      )}
    >
      <div className="container flex h-20 md:h-24 items-center px-4 sm:px-10 md:px-16 max-w-7xl mx-auto relative">
        <Link href="/" className="mr-6 lg:mr-16 flex items-center group shrink-0 relative transition-transform hover:scale-[1.02]">
          <div className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Image 
            src="/images/logo-vertical.png" 
            alt="SolocasasChile" 
            width={200} 
            height={150} 
            className="h-10 md:h-16 w-auto object-contain relative z-10"
            style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.12))" }}
            priority
          />
        </Link>
        
        <div className="flex flex-1 items-center justify-end lg:justify-between gap-6">
          <nav className="hidden lg:flex items-center space-x-12 text-[15px] font-bold tracking-tight">
            {NAV_LINKS.map((link) => (
              <div 
                key={link.href}
                className="relative"
                onMouseEnter={() => link.label === "Catálogo" && setShowMegaMenu(true)}
                onMouseLeave={() => link.label === "Catálogo" && setShowMegaMenu(false)}
              >
                <Link 
                  href={link.href} 
                  className={cn(
                    "text-[#1b0088] hover:opacity-80 transition-all relative group py-8 flex items-center gap-1",
                    showMegaMenu && link.label === "Catálogo" && "opacity-100"
                  )}
                >
                  {link.label}
                  {link.label === "Catálogo" && (
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform duration-300",
                      showMegaMenu && "rotate-180"
                    )} />
                  )}
                  <span className={cn(
                    "absolute bottom-4 left-0 h-0.5 bg-[#1b0088] transition-all duration-300",
                    showMegaMenu && link.label === "Catálogo" ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </Link>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3 border-r border-border/40 pr-8">
                <ThemeToggle />
                <Link 
                  href="/login" 
                  className={cn(
                    "flex items-center gap-2 text-[15px] font-bold text-[#1b0088] hover:opacity-80 transition-all px-4 py-2"
                  )}
                >
                  <User className="w-4 h-4" />
                  Acceder
                </Link>
            </div>
             
            <Link 
              href="/register" 
              className={cn(
                buttonVariants({ variant: "secondary", size: "default" }),
                "rounded-2xl px-10 hover:-translate-y-0.5 active:translate-y-0 transition-all h-12 hidden lg:inline-flex"
              )}
            >
              Comienza Gratis
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
                     className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 text-foreground font-bold text-[15px] tracking-tight hover:bg-primary hover:text-white transition-all group"
                   >
                     <Home className="w-5 h-5 opacity-40 group-hover:opacity-100" /> Inicio
                   </Link>
                   
                   <div className="h-px bg-border/40 my-2" />

                   {NAV_LINKS.map((link) => (
                     <Link 
                       key={link.href}
                       href={link.href}
                       onClick={() => setIsOpen(false)}
                       className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 text-[#1b0088] font-bold text-[15px] tracking-tight transition-all group"
                     >
                       <link.icon className="w-5 h-5 opacity-40 group-hover:opacity-100" /> {link.label}
                     </Link>
                   ))}

                   <div className="h-px bg-border/40 my-2" />

                   <Link 
                     href="/login" 
                     onClick={() => setIsOpen(false)}
                     className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 text-muted-foreground hover:text-foreground font-bold text-[15px] tracking-tight transition-all"
                   >
                     <CreditCard className="w-5 h-5 opacity-40" /> Mi Cuenta
                   </Link>
                </div>

                <div className="absolute bottom-8 left-0 w-full px-8">
                       <Link 
                          href="/register" 
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            buttonVariants({ variant: "secondary" }),
                            "w-full h-14 rounded-2xl"
                          )}
                       >
                          Comienza Gratis
                       </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <AnimatePresence>
          {showMegaMenu && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              className="absolute top-full left-0 w-full pt-2 pointer-events-none z-50"
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <div className="container max-w-7xl mx-auto px-4 pointer-events-auto">
                 <MegaMenu ads={megaMenuAds} onClose={() => setShowMegaMenu(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
