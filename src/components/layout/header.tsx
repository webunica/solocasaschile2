"use client";

import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { motion, useScroll, useTransform } from "framer-motion";

export function Header() {
  const { scrollY } = useScroll();
  
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
      <div className="container flex h-16 items-center px-8 md:px-12 max-w-7xl mx-auto">
        <Link href="/" className="mr-10 flex items-center group">
          <Image 
            src="/images/logo.png" 
            alt="SolocasasChile" 
            width={180} 
            height={40} 
            className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105 duration-500 dark:invert-[0.1]"
            priority
          />
        </Link>
        
        <div className="flex flex-1 items-center justify-between">
          <nav className="hidden lg:flex items-center space-x-10 text-[10px] font-black uppercase tracking-[0.2em]">
            <Link href="/catalogo" className="text-muted-foreground hover:text-primary transition-all hover:tracking-[0.3em]">
              Catálogo
            </Link>
            <Link href="/comparar" className="text-muted-foreground hover:text-primary transition-all hover:tracking-[0.3em]">
              Comparador
            </Link>
            <Link href="/constructoras" className="text-muted-foreground hover:text-primary transition-all hover:tracking-[0.3em]">
              Constructoras
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 border-r border-border/40 pr-4 mr-2">
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
                 "brand-gradient text-white border-none rounded-full px-8 font-black text-[9px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all h-10"
               )}
             >
               Publicar Casa
             </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
