import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl.clone();
  
  const isAppSubdomain = hostname.startsWith("app.");
  const isConstruSubdomain = hostname.startsWith("constru.");

  // --- 1. SUBDOMAIN ROUTING ---
  // El auth lo maneja cada page/layout individualmente.
  // Evitamos el proxy-level auth para no romper el flujo de cookies entre subdominios.

  // app.solocasaschile.com → /dashboard/*
  if (isAppSubdomain) {
    // Prevenir loop: si la URL ya tiene /dashboard, limpiar
    if (url.pathname.startsWith('/dashboard')) {
      const cleanPath = url.pathname.replace('/dashboard', '') || '/';
      return NextResponse.redirect(new URL(cleanPath, request.url));
    }
    return NextResponse.rewrite(new URL(`/dashboard${url.pathname}`, request.url));
  }

  // constru.solocasaschile.com → /constru/*
  if (isConstruSubdomain) {
    if (url.pathname.startsWith('/constru')) {
      const cleanPath = url.pathname.replace('/constru', '') || '/';
      return NextResponse.redirect(new URL(cleanPath, request.url));
    }
    return NextResponse.rewrite(new URL(`/constru${url.pathname}`, request.url));
  }

  // --- 2. MAIN DOMAIN AUTH LOGIC ---
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || !supabaseKey) return supabaseResponse;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  // Proteger /dashboard en el dominio principal
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // Evitar login/register si ya está autenticado
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
