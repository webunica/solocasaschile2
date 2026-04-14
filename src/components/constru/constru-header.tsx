"use client";

import { motion } from "framer-motion";
import { 
  Menu, X, Bell,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ConstruHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900 border-b border-white/10 text-white">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-[#fa8823] flex items-center justify-center text-white font-black text-xs shadow-lg shadow-[#fa8823]/20 group-hover:scale-110 transition-transform">
            C
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter leading-none italic uppercase">
              CONSTRU<span className="text-[#fa8823]">.</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              Suministros Técnicos
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {[
            { label: "Directorio", href: "/" },
            { label: "Categorías SIP", href: "/categorias" },
            { label: "Favoritos", href: "/favoritos" },
            { label: "Cotizaciones", href: "/cotizaciones" },
          ].map((item) => (
            <Link 
              key={item.label} 
              href={item.href}
              className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-[#fa8823] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
            <Bell className="w-5 h-5 text-slate-400" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#fa8823] rounded-full animate-pulse" />
          </button>
          
          <Link href="/dashboard" className="hidden sm:flex items-center gap-3 pl-4 border-l border-white/10 group">
             <div className="flex flex-col items-end">
               <span className="text-xs font-black truncate group-hover:text-[#fa8823] transition-colors">Volver al Panel</span>
               <span className="text-[10px] text-slate-500 font-bold uppercase">Dashboard Builder</span>
             </div>
             <LayoutDashboard className="w-5 h-5 text-slate-400 group-hover:scale-110 transition-transform" />
          </Link>

          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="lg:hidden bg-slate-800 border-b border-white/10"
        >
          <div className="flex flex-col p-6 gap-4">
            <Link href="/" className="text-sm font-black uppercase tracking-widest text-slate-200">Directorio</Link>
            <Link href="/categorias" className="text-sm font-black uppercase tracking-widest text-slate-200">Categorías SIP</Link>
            <Link href="/cotizaciones" className="text-sm font-black uppercase tracking-widest text-slate-200">Mis Cotizaciones</Link>
            <div className="h-px bg-white/5 my-2" />
            <Link href="/dashboard" className="flex items-center gap-3 text-[#fa8823] font-black uppercase tracking-widest text-sm">
              <LayoutDashboard className="w-5 h-5" /> Regresar al Dashboard
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
