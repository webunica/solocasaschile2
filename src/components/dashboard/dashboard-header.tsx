"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Bell, Search, Globe, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

import { signOutClientAndServer } from "@/lib/supabase/client-logout";

interface Props {
  userName?: string;
  isSuperAdmin?: boolean;
}

export function DashboardHeader({ userName: initialUserName, isSuperAdmin }: Props) {
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    await signOutClientAndServer();
  };

  const userName = initialUserName || user?.user_metadata?.nombre || user?.email?.split('@')[0] || "Administrador";
  const initials = userName.slice(0, 2).toUpperCase();

  return (
    <header className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-8 border-b border-border/40 bg-background/60 backdrop-blur-md sticky top-0 z-[70] transition-all duration-300">
      <div className="flex items-center gap-4 sm:gap-6">
        <SidebarTrigger className="lg:hidden h-10 w-10 text-muted-foreground hover:text-foreground transition-colors shrink-0" />
        <div className="hidden lg:flex items-center gap-2 relative group max-w-sm w-full">
           <Search className="w-5 h-5 absolute left-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
           <Input 
             placeholder="Buscar proyectos..." 
             className="pl-12 h-12 w-full bg-muted/20 border-border/40 hover:border-primary/20 focus:border-primary/40 focus:bg-background transition-all rounded-2xl font-medium shadow-sm" 
           />
           <div className="absolute right-4 px-2 py-0.5 rounded-md border border-border/40 bg-muted/30 text-[9px] font-black text-muted-foreground opacity-40 pointer-events-none group-focus-within:opacity-0 transition-opacity uppercase tracking-widest leading-none">
              CTRL + K
           </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Opción destacada para volver al sitio web público */}
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-emerald-200/90 bg-emerald-50/80 hover:bg-emerald-100 text-xs sm:text-sm font-bold text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:text-emerald-300 dark:hover:bg-emerald-950/60 transition-all shadow-xs group"
          title="Volver al sitio web principal SoloCasasChile"
        >
          <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:rotate-45 transition-transform shrink-0" />
          <span className="hidden sm:inline">Volver al sitio</span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="relative group w-10 h-10 rounded-xl bg-muted/30 hover:bg-muted/50 border border-border/40 transition-all shadow-sm">
             <Bell className="w-4.5 h-4.5 text-muted-foreground group-hover:text-primary transition-all" />
             <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-teal rounded-full border-2 border-background shadow-lg" />
          </Button>
        </div>
        
        <div className="h-7 w-px bg-border/40 mx-0.5 hidden xs:block" />
        
        {/* Pastilla informativa de usuario */}
        <div className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-muted/30 border border-border/40">
           <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#073E48] flex items-center justify-center text-[#27D8BE] font-black uppercase text-xs shadow-xs shrink-0"> 
            {initials} 
           </div>
           <div className="hidden md:flex flex-col items-start min-w-0">
             <span className="text-xs font-bold tracking-tight leading-tight truncate max-w-[130px] text-foreground">{userName}</span>
             <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
               {isSuperAdmin ? "Admin" : "Constructora"}
             </span>
           </div>
        </div>

        {/* Botón Salir / Cerrar sesión */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200/90 bg-red-50/80 hover:bg-red-100 text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/60 text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          title="Cerrar sesión y salir"
          aria-label="Cerrar sesión"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
}

