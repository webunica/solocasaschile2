"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Building2, Home, Users, BarChart3, Settings, 
  HelpCircle, LogOut, LayoutDashboard 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Sidebar, SidebarHeader, SidebarContent, SidebarFooter, 
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, 
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent 
} from "@/components/ui/sidebar";
import { logout } from "@/lib/supabase/actions";

const DASHBOARD_MENU = [
  { title: "Inicio", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Gestionar Modelos", icon: Home, href: "/dashboard/catalog" },
  { title: "Ver Prospectos", icon: Users, href: "/dashboard/leads" },
  { title: "Analíticas", icon: BarChart3, href: "/dashboard/reportes" },
];

const SUPPORT_MENU = [
  { title: "Configuración", icon: Settings, href: "/dashboard/settings" },
  { title: "Ayuda", icon: HelpCircle, href: "/dashboard/ayuda" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="h-16 flex items-center px-6 border-b">
         <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center text-white font-black text-sm group-hover:scale-110 transition-transform">S</div>
            <span className="font-heading font-black text-lg tracking-tighter opacity-100 group-data-[collapsible=icon]:opacity-0 transition-opacity">SolocasasChile</span>
         </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 pt-6">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">ADMINISTRACIÓN</SidebarGroupLabel>
          <SidebarGroupContent className="pt-2">
            <SidebarMenu>
              {DASHBOARD_MENU.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    className="h-11 px-3 data-[active=true]:bg-primary data-[active=true]:text-white data-[active=true]:shadow-lg data-[active=true]:shadow-primary/20 transition-all font-medium rounded-xl"
                  >
                    <Link href={item.href}>
                      <item.icon className="w-5 h-5" />
                      <span className="ml-3">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">SOPORTE</SidebarGroupLabel>
          <SidebarGroupContent className="pt-2">
            <SidebarMenu>
              {SUPPORT_MENU.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    className="h-11 px-3 transition-all font-medium rounded-xl hover:bg-muted"
                  >
                    <Link href={item.href}>
                      <item.icon className="w-5 h-5" />
                      <span className="ml-3">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6 border-t">
        <form action={logout}>
          <button 
            type="submit"
            className="flex items-center gap-3 w-full text-sm font-bold text-red-500 hover:text-red-600 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100">
               <LogOut className="w-4 h-4" />
            </div>
            <span className="group-data-[collapsible=icon]:hidden">Cerrar Sesión</span>
          </button>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
