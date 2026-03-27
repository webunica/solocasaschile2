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
    <header className="h-16 flex items-center justify-between px-6 border-b bg-background sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden" />
        <div className="hidden md:flex items-center gap-2 relative">
           <Search className="w-4 h-4 absolute left-3 text-muted-foreground" />
           <Input placeholder="Buscar modelos o prospectos..." className="pl-10 h-10 w-80 bg-muted/30 border-none rounded-xl" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="relative group p-0 w-10 h-10 flex items-center justify-center">
           <Bell className="w-5 h-5 group-hover:text-primary transition-colors" />
           <span className="absolute top-2 right-2 w-2 h-2 bg-brand-teal rounded-full border-2 border-background" />
        </Button>
        <div className="h-8 w-px bg-border mx-2" />
        <Button variant="ghost" className="gap-3 px-2 hover:bg-muted/50 rounded-xl group">
           <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black uppercase text-[10px] group-hover:scale-110 transition-transform"> 
            {initials} 
           </div>
            <div className="hidden sm:flex flex-col items-start gap-0.5">
              <span className="text-xs font-black tracking-tight leading-none truncate max-w-[120px]">{userName}</span>
              <span className={cn(
                "text-[9px] leading-none font-bold uppercase tracking-widest italic opacity-60",
                isSuperAdmin ? "text-primary opacity-100" : "text-muted-foreground"
              )}>
                {isSuperAdmin ? "Master Admin" : "Admin Constructora"}
              </span>
            </div>
           <ChevronDown className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
        </Button>
      </div>
    </header>
  );
}
