"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Menu, Home, Library, ArrowLeftRight, Building2, LayoutGrid, CreditCard, User, ChevronDown, MapPin, Star, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { MegaMenu } from "./mega-menu";
import type { MegaMenuAds } from "./mega-menu";
import { BlogMegaMenu } from "./blog-mega-menu";
import { BlogPost } from "@/types/blog";

const NAV_LINKS = [
  { href: "/catalogo", label: "Catálogo", icon: Library },
  { href: "/comparar", label: "Comparador", icon: ArrowLeftRight },
  { href: "/constructoras", label: "Constructoras", icon: Building2 },
  { href: "/blog", label: "Recursos", icon: LayoutGrid, hasMegaMenu: true },
  { href: "/planes", label: "Precios", icon: CreditCard },
];

const MOBILE_CATALOG_SECTIONS = [
  {
    label: "Regiones",
    icon: MapPin,
    links: [
      { label: "Ver catalogo completo", href: "/catalogo" },
      { label: "Region Metropolitana", href: "/catalogo?region=metropolitana" },
      { label: "Valparaiso", href: "/catalogo?region=valparaiso" },
      { label: "Biobio", href: "/catalogo?region=biobio" },
      { label: "Araucania", href: "/catalogo?region=araucania" },
      { label: "Los Lagos", href: "/catalogo?region=los-lagos" },
    ],
  },
  {
    label: "Materiales",
    icon: Building2,
    links: [
      { label: "Casas SIP", href: "/catalogo?tipo=sip" },
      { label: "Casas de madera", href: "/catalogo?tipo=madera" },
      { label: "Casas de hormigon", href: "/catalogo?tipo=hormigon" },
      { label: "Steel framing", href: "/catalogo?tipo=steel-framing" },
      { label: "Casas metalcom", href: "/catalogo?tipo=metalcom" },
    ],
  },
  {
    label: "Especiales",
    icon: Star,
    links: [
      { label: "Llave en mano", href: "/catalogo?categoria=llave-en-mano" },
      { label: "Viviendas sociales", href: "/catalogo?tipo=sociales" },
      { label: "Modelos economicos", href: "/catalogo?filtro=economicos" },
      { label: "Casas de lujo", href: "/catalogo?filtro=lujo" },
      { label: "Entrega inmediata", href: "/catalogo?filtro=entrega-inmediata" },
    ],
  },
] as const;

const MOBILE_RESOURCE_LINKS = [
  { label: "Ir al blog", href: "/blog", icon: Library },
  { label: "Sobre Nosotros", href: "/nosotros", icon: User },
  { label: "Seguimiento de Obra", href: "/seguimiento-de-obras", icon: Zap },
  { label: "Portal Proveedores", href: "/portal-proveedores", icon: Building2 },
  { label: "Como verificamos", href: "/verificacion", icon: ShieldCheck },
  { label: "Analisis de Mercado", href: "/premium-access", icon: Sparkles },
] as const;

type HeaderProps = {
  megaMenuAds?: MegaMenuAds;
  latestBlogPosts?: BlogPost[];
};

export function Header({ megaMenuAds, latestBlogPosts }: HeaderProps) {
  const { scrollY } = useScroll();
  const [isOpen, setIsOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showBlogMenu, setShowBlogMenu] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<"catalogo" | "recursos" | null>(null);
  
  // Adaptive height and style based on scroll
  const headerY = useTransform(scrollY, [0, 50], [20, 10]);
  const headerWidth = useTransform(scrollY, [0, 50], ["98%", "94%"]);
  const headerRadius = useTransform(scrollY, [0, 50], ["1.5rem", "4rem"]);

  return (
    <motion.header 
      style={{ 
        top: headerY,
        width: headerWidth,
        borderRadius: headerRadius,
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
        <motion.div
           style={{ 
             opacity: useTransform(scrollY, [0, 30], [1, 0]),
             scale: useTransform(scrollY, [0, 30], [1, 0.92]),
             x: useTransform(scrollY, [0, 30], [0, -10]),
             filter: useTransform(scrollY, [0, 30], ["blur(0px)", "blur(4px)"])
           }}
           className="lg:hidden shrink-0"
        >
          <Link href="/" className="mr-6 flex items-center group shrink-0 relative transition-transform">
            <Image 
              src="/images/logo-mobile.png" 
              alt="SolocasasChile" 
              width={160} 
              height={120} 
              className="w-[40vw] h-auto object-contain"
              priority
            />
          </Link>
        </motion.div>

        {/* Desktop Logo (Always Visible) */}
        <Link href="/" className="hidden lg:flex mr-16 items-center group shrink-0 relative transition-transform hover:scale-[1.02]">
          <div className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Image 
            src="/images/logo-vertical.png" 
            alt="SolocasasChile" 
            width={200} 
            height={150} 
            className="h-16 w-auto object-contain relative z-10"
            style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.12))" }}
            priority
          />
        </Link>
        
        <div className="flex flex-1 items-center justify-end lg:justify-between gap-6">
          <nav className="hidden lg:flex items-center space-x-12 text-[15px] font-bold tracking-tight">
            {NAV_LINKS.map((link) => {
              const isActiveMegaMenu = (link.label === "Catálogo" && showMegaMenu) || (link.label === "Recursos" && showBlogMenu);
              
              return (
                <div 
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => {
                    if (link.label === "Catálogo") {
                      setShowMegaMenu(true);
                      setShowBlogMenu(false);
                    } else if (link.label === "Recursos") {
                      setShowBlogMenu(true);
                      setShowMegaMenu(false);
                    } else {
                      setShowMegaMenu(false);
                      setShowBlogMenu(false);
                    }
                  }}
                >
                  <Link 
                    href={link.href} 
                    className={cn(
                      "text-[#1b0088] hover:opacity-80 transition-all relative group py-8 flex items-center gap-1",
                      isActiveMegaMenu && "opacity-100"
                    )}
                  >
                    {link.label}
                    {(link.label === "Catálogo" || link.label === "Recursos") && (
                      <ChevronDown aria-hidden="true" className={cn(
                        "w-4 h-4 transition-transform duration-300",
                        isActiveMegaMenu && "rotate-180"
                      )} />
                    )}
                    <span className={cn(
                      "absolute bottom-4 left-0 h-0.5 bg-[#1b0088] transition-all duration-300",
                      isActiveMegaMenu ? "w-full" : "w-0 group-hover:w-full"
                    )} />
                  </Link>
                </div>
              );
            })}
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
                  <User className="w-4 h-4" aria-hidden="true" />
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
            <Sheet
              open={isOpen}
              onOpenChange={(open) => {
                setIsOpen(open);
                if (!open) {
                  setMobileSubmenu(null);
                }
              }}
            >
              <SheetTrigger asChild>
                <button type="button" aria-label="Abrir menú de navegación" className="lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-primary/5 border border-primary/10 text-primary active:scale-90 transition-all">
                   <Menu className="w-6 h-6" aria-hidden="true" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] border-r border-border/40 bg-background/95 backdrop-blur-xl p-0">
                <SheetHeader className="p-8 border-b border-border/40">
                   <div className="flex items-center justify-between">
                     <SheetTitle className="text-left font-heading font-black tracking-tighter text-2xl">Menu</SheetTitle>
                     <ThemeToggle />
                   </div>
                   <SheetDescription className="text-left text-xs uppercase tracking-widest font-bold opacity-60">SolocasasChile v2</SheetDescription>
                </SheetHeader>
                
                <div className="flex max-h-[calc(100vh-7rem)] flex-col space-y-4 overflow-y-auto p-6 pb-32">
                   <Link 
                     href="/" 
                     onClick={() => setIsOpen(false)}
                     className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 text-foreground font-bold text-[15px] tracking-tight hover:bg-primary hover:text-white transition-all group"
                   >
                     <Home className="w-5 h-5 opacity-60 group-hover:opacity-100" aria-hidden="true" /> Inicio
                   </Link>
                   
                   <div className="h-px bg-border/40 my-2" />

                   {NAV_LINKS.map((link) => {
                     const isCatalog = link.label === "CatÃ¡logo";
                     const isResources = link.label === "Recursos";
                     const submenuKey = isCatalog ? "catalogo" : isResources ? "recursos" : null;
                     const isExpanded = submenuKey === mobileSubmenu;

                     if (!submenuKey) {
                       return (
                         <Link 
                           key={link.href}
                           href={link.href}
                           onClick={() => setIsOpen(false)}
                           className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 text-[#1b0088] font-bold text-[15px] tracking-tight transition-all group"
                         >
                           <link.icon className="w-5 h-5 opacity-60 group-hover:opacity-100" aria-hidden="true" /> {link.label}
                         </Link>
                       );
                     }

                     return (
                       <div key={link.href} className="space-y-2">
                         <button
                           type="button"
                           aria-expanded={isExpanded}
                           onClick={() => setMobileSubmenu(isExpanded ? null : submenuKey)}
                           className={cn(
                             "flex w-full items-center justify-between gap-4 rounded-2xl p-4 text-left text-[15px] font-bold tracking-tight text-[#1b0088] transition-all",
                             isExpanded ? "bg-primary/5" : "hover:bg-muted/50",
                           )}
                         >
                           <span className="flex items-center gap-4">
                             <link.icon className="w-5 h-5 opacity-60" aria-hidden="true" />
                             {link.label}
                           </span>
                           <ChevronDown
                             className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")}
                             aria-hidden="true"
                           />
                         </button>

                         <AnimatePresence initial={false}>
                           {isExpanded && submenuKey === "catalogo" && (
                             <motion.div
                               initial={{ height: 0, opacity: 0 }}
                               animate={{ height: "auto", opacity: 1 }}
                               exit={{ height: 0, opacity: 0 }}
                               transition={{ duration: 0.22, ease: "easeOut" }}
                               className="overflow-hidden"
                             >
                               <div className="space-y-5 rounded-2xl border border-primary/10 bg-white/70 p-4">
                                 {MOBILE_CATALOG_SECTIONS.map((section) => (
                                   <div key={section.label} className="space-y-2">
                                     <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-indigo/60">
                                       <section.icon className="h-3.5 w-3.5 text-brand-teal" aria-hidden="true" />
                                       {section.label}
                                     </p>
                                     <div className="grid gap-1">
                                       {section.links.map((item) => (
                                         <Link
                                           key={item.href}
                                           href={item.href}
                                           onClick={() => setIsOpen(false)}
                                           className="rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-brand-teal/10 hover:text-brand-indigo"
                                         >
                                           {item.label}
                                         </Link>
                                       ))}
                                     </div>
                                   </div>
                                 ))}
                               </div>
                             </motion.div>
                           )}

                           {isExpanded && submenuKey === "recursos" && (
                             <motion.div
                               initial={{ height: 0, opacity: 0 }}
                               animate={{ height: "auto", opacity: 1 }}
                               exit={{ height: 0, opacity: 0 }}
                               transition={{ duration: 0.22, ease: "easeOut" }}
                               className="overflow-hidden"
                             >
                               <div className="grid gap-1 rounded-2xl border border-primary/10 bg-white/70 p-4">
                                 {MOBILE_RESOURCE_LINKS.map((item) => (
                                   <Link
                                     key={item.href}
                                     href={item.href}
                                     onClick={() => setIsOpen(false)}
                                     className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-brand-teal/10 hover:text-brand-indigo"
                                   >
                                     <item.icon className="h-4 w-4 text-brand-teal" aria-hidden="true" />
                                     {item.label}
                                   </Link>
                                 ))}
                               </div>
                             </motion.div>
                           )}
                         </AnimatePresence>
                       </div>
                     );
                   })}

                   <div className="h-px bg-border/40 my-2" />

                   <Link 
                     href="/login" 
                     onClick={() => setIsOpen(false)}
                     className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 text-muted-foreground hover:text-foreground font-bold text-[15px] tracking-tight transition-all"
                   >
                     <CreditCard className="w-5 h-5 opacity-60" aria-hidden="true" /> Mi Cuenta
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

        <div 
          className="absolute top-full left-0 w-full pt-2 pointer-events-none z-50"
          onMouseLeave={() => {
            setShowMegaMenu(false);
            setShowBlogMenu(false);
          }}
        >
          <div className="container max-w-7xl mx-auto px-4 pointer-events-auto">
            <AnimatePresence>
              {showMegaMenu && (
                <MegaMenu ads={megaMenuAds} onClose={() => setShowMegaMenu(false)} />
              )}
              {showBlogMenu && (
                <BlogMegaMenu posts={latestBlogPosts || []} onClose={() => setShowBlogMenu(false)} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
