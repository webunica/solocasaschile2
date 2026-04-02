"use client";

import { useState, useEffect } from "react";
import { Bell, Search, User, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface Props {
  userName?: string;
  isSuperAdmin?: boolean;
}

export function DashboardHeader({ userName: initialUserName, isSuperAdmin }: Props) {
  const [user, setUser] = useState<any>(null);

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

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Button variant="ghost" size="icon" className="relative group w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-muted/30 hover:bg-muted/50 border border-border/40 transition-all shadow-sm">
             <Bell className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all" />
             <span className="absolute top-3 sm:top-3.5 right-3 sm:right-3.5 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-brand-teal rounded-full border-2 border-background shadow-lg group-hover:scale-110 transition-transform" />
          </Button>
        </div>
        
        <div className="h-8 w-px bg-border/40 mx-1 sm:mx-2 hidden xs:block" />
        
        <Button variant="ghost" className="gap-2 sm:gap-4 px-2 sm:px-3 hover:bg-muted/50 rounded-xl sm:rounded-2xl group transition-all duration-300 border border-transparent hover:border-border/40">
           <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-brand-indigo flex items-center justify-center text-white font-black uppercase text-[10px] sm:text-xs shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform"> 
            {initials} 
           </div>
            <div className="hidden sm:flex flex-col items-start gap-1">
              <span className="text-sm font-black tracking-tight leading-none truncate max-w-[120px] text-foreground">{userName}</span>
              <div className={cn(
                "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest leading-none whitespace-nowrap",
                isSuperAdmin ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted text-muted-foreground opacity-60"
              )}>
                {isSuperAdmin ? "Admin" : "Constructora"}
              </div>
            </div>
           <ChevronDown className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity hidden sm:block" />
        </Button>
      </div>
    </header>
  );
}

