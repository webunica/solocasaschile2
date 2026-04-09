import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const url = request.nextUrl.clone();
  
  const isAppSubdomain = hostname.startsWith("app.");
  const isConstruSubdomain = hostname.startsWith("constru.");
  const isSubdomain = isAppSubdomain || isConstruSubdomain;

  // --- 1. AUTH CHECK (solo para subdominios, antes del rewrite) ---
  if (isSubdomain) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    if (supabaseUrl && supabaseKey) {
      let supabaseResponse = NextResponse.next({ request });
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

      // Si no está autenticado → redirigir al login del dominio PRINCIPAL
      if (!user) {
        return NextResponse.redirect('https://solocasaschile.com/login');
      }
    }
  }

  // --- 2. SUBDOMAIN ROUTING (solo si está autenticado) ---

  // app.solocasaschile.com → /dashboard
  if (isAppSubdomain) {
    if (url.pathname.startsWith('/dashboard')) {
      const cleanPath = url.pathname.replace('/dashboard', '') || '/';
      return NextResponse.redirect(new URL(cleanPath, request.url));
    }
    return NextResponse.rewrite(new URL(`/dashboard${url.pathname}`, request.url));
  }

  // constru.solocasaschile.com → /constru
  if (isConstruSubdomain) {
    if (url.pathname.startsWith('/constru')) {
      const cleanPath = url.pathname.replace('/constru', '') || '/';
      return NextResponse.redirect(new URL(cleanPath, request.url));
    }
    return NextResponse.rewrite(new URL(`/constru${url.pathname}`, request.url));
  }

  // --- 3. MAIN DOMAIN AUTH LOGIC ---
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

  // Proteger /dashboard en dominio principal
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // Evitar acceder a login/register si ya está autenticado
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
