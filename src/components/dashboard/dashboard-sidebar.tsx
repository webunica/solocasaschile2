"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Building2, Home, Users, BarChart3, Settings, 
  HelpCircle, LogOut, LayoutDashboard, Globe,
  MessageSquare, Award, Video, Mail, ShieldCheck, BadgeCheck, Package, HardHat, UserPlus
} from "lucide-react";
import {
  Sidebar, SidebarHeader, SidebarContent, SidebarFooter,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/supabase/actions";
import { getPlanLimits, getPlanNombre } from "@/lib/constants/plans";

type FeatureKey = "leads" | "obras" | "testimonials" | "certifications" | "analytics";

interface DashboardMenuItem {
  title: string;
  icon: any;
  href: string;
  feature?: FeatureKey;
}

const DASHBOARD_MENU: DashboardMenuItem[] = [
  { title: "Inicio", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Gestionar Modelos", icon: Home, href: "/dashboard/catalog" },
  { title: "Ver Prospectos", icon: Users, href: "/dashboard/leads", feature: "leads" },
  { title: "Seguimiento de Obra", icon: HardHat, href: "/dashboard/obras", feature: "obras" },
  { title: "Sellos de Confianza", icon: ShieldCheck, href: "/dashboard/sellos" },
  { title: "Agendar Demo", icon: Video, href: "/demo" },
  { title: "Testimonios", icon: MessageSquare, href: "/dashboard/testimonios", feature: "testimonials" },
  { title: "Certificaciones", icon: Award, href: "/dashboard/certificaciones", feature: "certifications" },
  { title: "Analíticas", icon: BarChart3, href: "/dashboard/reportes", feature: "analytics" },
];

const SUPPORT_MENU = [
  { title: "Configuración", icon: Settings, href: "/dashboard/settings" },
  { title: "Ayuda", icon: HelpCircle, href: "/dashboard/ayuda" },
];

export function DashboardSidebar({ 
  isSuperAdmin,
  isAdmin,
  isVendedor,
  plan = "starter",
  userName = "Constructor", 
  userEmail = "soporte@solocasaschile.com" 
}: { 
  isSuperAdmin?: boolean;
  isAdmin?: boolean;
  isVendedor?: boolean;
  plan?: string;
  userName?: string;
  userEmail?: string;
}) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const planLimits = getPlanLimits(plan);
  const planNombre = getPlanNombre(plan);

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);

  const visibleDashboardMenu = DASHBOARD_MENU.filter((item) => {
    if (isSuperAdmin || isAdmin || isVendedor) return true;
    if (!item.feature) return true;
    return Boolean(planLimits.features[item.feature]);
  });

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-border/40 bg-background md:bg-card/40 backdrop-blur-xl">
      <SidebarHeader className="h-20 flex items-center px-4 border-b border-border/40">
         <Link href="/" className="flex items-center gap-2 group">
            {/* Collapsed: show new icon */}
            <Image
              src="/images/logo-icon.png"
              alt="SolocasasChile"
              width={36}
              height={36}
              className="h-9 w-9 rounded-xl object-contain group-hover:scale-105 transition-transform shrink-0 group-data-[collapsible=icon]:flex hidden"
            />
            {/* Expanded: show full horizontal logo */}
            <Image
              src="/images/solocasaschile-logo.png"
              alt="SolocasasChile"
              width={434}
              height={70}
              className="h-8 w-auto object-contain group-data-[collapsible=icon]:hidden"
              priority
            />
          </Link>
      </SidebarHeader>

      <SidebarContent className="px-4 pt-6">
        {/* Enlace destacado para volver a la web principal */}
        <SidebarGroup className="pb-3 pt-0">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  tooltip="Volver al Sitio Web Principal"
                  className="h-10 px-3 md:px-4 text-emerald-800 bg-emerald-50/90 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl font-bold transition-all shadow-xs group"
                >
                  <Link href="/">
                    <Globe className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 group-hover:rotate-45 transition-transform" />
                    <span className="ml-3 text-sm font-bold">Volver al sitio web</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-3 md:px-4 text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground opacity-40 mb-3">CONSTRUCTORA</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {visibleDashboardMenu.map((item) => (
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
                        isActive={pathname === "/dashboard/admin/usuarios"}
                        tooltip="Gestión de Usuarios"
                        className="h-10 px-3 md:px-4 transition-all font-bold rounded-xl hover:bg-primary/5 text-primary"
                      >
                        <Link href="/dashboard/admin/usuarios">
                          <Users className="w-4.5 h-4.5" />
                          <span className="ml-3 text-sm">Usuarios</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

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

                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={pathname === "/dashboard/admin/invitaciones"}
                        tooltip="Invitaciones Constructoras"
                        className="h-10 px-3 md:px-4 transition-all font-bold rounded-xl hover:bg-primary/5 text-primary"
                      >
                        <Link href="/dashboard/admin/invitaciones">
                          <UserPlus className="w-4.5 h-4.5" />
                          <span className="ml-3 text-sm">Invitaciones</span>
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
                 <div className="flex items-center gap-1.5 mt-0.5">
                   <span className="inline-block px-2 py-0.5 rounded-md bg-primary/10 text-primary font-black text-[9px] uppercase tracking-wider">
                     {planNombre}
                   </span>
                 </div>
                 <span className="text-[10px] text-muted-foreground font-medium truncate opacity-60 mt-0.5">
                   {userEmail}
                 </span>
              </div>
           </div>

           <form action={logout}>
            <button 
              type="submit"
              className="flex items-center justify-center gap-2.5 w-full py-2.5 px-3 rounded-xl border border-red-200/90 bg-red-50/70 hover:bg-red-100 text-xs font-bold text-red-600 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/60 transition-all cursor-pointer group-data-[collapsible=icon]:p-2 shadow-xs active:scale-95"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
