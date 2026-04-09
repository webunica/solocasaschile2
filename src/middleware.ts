import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl.clone();
  
  // --- 1. LÓGICA DE PROXY (SUBDOMINIOS) ---
  const isAppSubdomain = hostname.startsWith("app.");
  const isConstruSubdomain = hostname.startsWith("constru.");

  // Configuración para app.solocasaschile.com -> va a /dashboard
  if (isAppSubdomain) {
    if (url.pathname.startsWith('/dashboard')) {
      const cleanPath = url.pathname.replace('/dashboard', '') || '/';
      return NextResponse.redirect(new URL(cleanPath, request.url));
    }
    return NextResponse.rewrite(new URL(`/dashboard${url.pathname}`, request.url))
  }

  // Configuración para constru.solocasaschile.com -> va a /constru
  if (isConstruSubdomain) {
    if (url.pathname.startsWith('/constru')) {
      const cleanPath = url.pathname.replace('/constru', '') || '/';
      return NextResponse.redirect(new URL(cleanPath, request.url));
    }
    return NextResponse.rewrite(new URL(`/constru${url.pathname}`, request.url))
  }

  // --- 2. LÓGICA DE SUPABASE AUTH ---
  let supabaseResponse = NextResponse.next({
    request,
  })

  // ... (Supabase initialization noise) ...
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  // Proteger rutas bajo /dashboard o /constru (rutas privadas de subdominios)
  if (!user && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/constru'))) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  // Evitar login/register si ya está autenticado
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = isConstruSubdomain ? '/' : '/dashboard'
    return NextResponse.redirect(dashboardUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/vids suffixes
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
