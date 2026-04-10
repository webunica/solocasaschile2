"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Building2, Home, Users, BarChart3, Settings, 
  HelpCircle, LogOut, LayoutDashboard, 
  MessageSquare, Award, Video, Mail, ShieldCheck, BadgeCheck, Package
} from "lucide-react";
import {
  Sidebar, SidebarHeader, SidebarContent, SidebarFooter,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/supabase/actions";

const DASHBOARD_MENU = [
  { title: "Inicio", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Gestionar Modelos", icon: Home, href: "/dashboard/catalog" },
  { title: "Ver Prospectos", icon: Users, href: "/dashboard/leads" },
  { title: "Sellos de Confianza", icon: ShieldCheck, href: "/dashboard/sellos" },
  { title: "Agendar Demo", icon: Video, href: "/demo" },
  { title: "Testimonios", icon: MessageSquare, href: "/dashboard/testimonios" },
  { title: "Certificaciones", icon: Award, href: "/dashboard/certificaciones" },
  { title: "Analíticas", icon: BarChart3, href: "/dashboard/reportes" },
];

const SUPPORT_MENU = [
  { title: "Configuración", icon: Settings, href: "/dashboard/settings" },
  { title: "Ayuda", icon: HelpCircle, href: "/dashboard/ayuda" },
];

export function DashboardSidebar({ 
  isSuperAdmin,
  isAdmin, 
  userName = "Constructor", 
  userEmail = "soporte@solocasaschile.com" 
}: { 
  isSuperAdmin?: boolean;
  isAdmin?: boolean;
  userName?: string;
  userEmail?: string;
}) {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-border/40 bg-background md:bg-card/40 backdrop-blur-xl">
      <SidebarHeader className="h-20 flex items-center px-4 border-b border-border/40">
         <Link href="/" className="flex items-center gap-2 group">
            {/* Collapsed: show S icon */}
            <div className="w-9 h-9 rounded-xl bg-brand-indigo flex items-center justify-center text-white font-black text-sm group-hover:scale-110 transition-transform shadow-lg shadow-primary/20 shrink-0 group-data-[collapsible=icon]:flex hidden">S</div>
            {/* Expanded: show full vertical logo */}
            <Image
              src="/images/logo-vertical.png"
              alt="SolocasasChile"
              width={120}
              height={90}
              className="h-12 w-auto object-contain group-data-[collapsible=icon]:hidden"
              style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.15))" }}
              priority
            />
         </Link>
      </SidebarHeader>

      <SidebarContent className="px-4 pt-8">
        {/* Profile Card Early Preview (Optional placeholder if needed in future) */}
        
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 md:px-4 text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground opacity-40 mb-3">CONSTRUCTORA</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {DASHBOARD_MENU.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    className="h-10 px-3 md:px-4 data-[active=true]:bg-brand-indigo data-[active=true]:text-white data-[active=true]:font-black data-[active=true]:shadow-primary/10 transition-all font-semibold rounded-xl group"
                  >
                      <Link href={item.href}>
                        <item.icon className={cn("w-4.5 h-4.5 transition-transform group-hover:scale-110", pathname === item.href ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
                        <span className={cn("ml-3 text-sm", pathname === item.href ? "font-black" : "font-semibold")}>{item.title}</span>
                      </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {(isAdmin || isSuperAdmin) && (
          <SidebarGroup className="mt-8">
            <SidebarGroupLabel className="px-3 md:px-4 text-[9px] font-black uppercase tracking-[0.25em] text-primary/60 mb-3">SYSTEM ADMIN</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {isSuperAdmin && (
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === "/dashboard/admin/constructoras"}
                        tooltip="Gestionar Constructoras"
                        className="h-10 px-3 md:px-4 transition-all font-bold rounded-xl hover:bg-primary/5 text-primary"
                      >
                        <Link href="/dashboard/admin/constructoras">
                          <Building2 className="w-4.5 h-4.5" />
                          <span className="ml-3 text-sm">Constructoras</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === "/dashboard/admin/comunicaciones"}
                        tooltip="Comunicación Global"
                        className="h-10 px-3 md:px-4 transition-all font-bold rounded-xl hover:bg-primary/5 text-primary"
                      >
                        <Link href="/dashboard/admin/comunicaciones">
                          <Mail className="w-4.5 h-4.5" />
                          <span className="ml-3 text-sm">Comunicaciones</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                )}
                
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === "/dashboard/admin/pagos"}
                        tooltip="Historial de Pagos"
                        className="h-10 px-3 md:px-4 transition-all font-bold rounded-xl hover:bg-primary/5 text-primary"
                      >
                        <Link href="/dashboard/admin/pagos">
                          <BarChart3 className="w-4.5 h-4.5" />
                          <span className="ml-3 text-sm">Pagos Globales</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === "/dashboard/admin/sellos"}
                        tooltip="Validar Sellos"
                        className="h-10 px-3 md:px-4 transition-all font-bold rounded-xl hover:bg-primary/5 text-primary"
                      >
                        <Link href="/dashboard/admin/sellos">
                          <BadgeCheck className="w-4.5 h-4.5" />
                          <span className="ml-3 text-sm">Validar Sellos</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === "/dashboard/admin/constru"}
                        tooltip="Gestión Constru"
                        className="h-10 px-3 md:px-4 transition-all font-bold rounded-xl hover:bg-orange-500/5 text-[#fa8823]"
                      >
                        <Link href="/dashboard/admin/constru">
                          <Package className="w-4.5 h-4.5" />
                          <span className="ml-3 text-sm">Gestión Constru</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === "/dashboard/admin/settings"}
                        tooltip="Configuración del Sitio"
                        className="h-10 px-3 md:px-4 transition-all font-bold rounded-xl hover:bg-primary/5 text-primary"
                      >
                        <Link href="/dashboard/admin/settings">
                          <Settings className="w-4.5 h-4.5" />
                          <span className="ml-3 text-sm">Configuración Sitio</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup className="mt-auto pt-8">
          <SidebarGroupLabel className="px-3 md:px-4 text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground opacity-40 mb-3">SISTEMA</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === "/dashboard/settings/facturacion"}
                  tooltip="Plan y Facturación"
                  className="h-10 px-3 md:px-4 transition-all font-semibold rounded-xl hover:bg-muted/50 text-muted-foreground"
                >
                  <Link href="/dashboard/settings/facturacion">
                    <Building2 className="w-4.5 h-4.5 opacity-80" />
                    <span className="ml-3 text-sm font-semibold">Plan y Facturación</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {SUPPORT_MENU.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    tooltip={item.title}
                    className="h-10 px-3 md:px-4 transition-all font-semibold rounded-xl hover:bg-muted/50 text-muted-foreground"
                  >
                    <Link href={item.href}>
                      <item.icon className="w-4.5 h-4.5 opacity-80" />
                      <span className="ml-3 text-sm font-semibold">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/40">
        <div className="flex flex-col gap-4">
           {/* User Profile MiniSection */}
           <div className="flex items-center gap-3 p-2 rounded-2xl bg-muted/20 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:bg-transparent">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                 <span className="text-primary font-black text-xs">{userName.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
                 <span className="text-xs font-black truncate text-foreground leading-tight">{userName}</span>
                 <span className="text-[10px] text-muted-foreground font-medium truncate opacity-60">
                   {userEmail} <br/> (admin={String(isAdmin)}, super={String(isSuperAdmin)})
                 </span>
              </div>
           </div>

           <form action={logout}>
            <button 
              type="submit"
              className="flex items-center gap-3 w-full px-2 py-1.5 text-[10px] font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-all group"
            >
              <LogOut className="w-4 h-4" />
              <span className="group-data-[collapsible=icon]:hidden">Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
