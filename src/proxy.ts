import { NextResponse, type NextRequest } from 'next/server'

const DASHBOARD_PREFIX = '/dashboard';
const AUTH_ENTRY_ROUTES = new Set(['/login', '/register']);

function hasSupabaseSessionCookie(request: NextRequest) {
  return request.cookies.getAll().some((cookie) =>
    cookie.name.startsWith('sb-') && cookie.name.includes('auth-token')
  );
}

export async function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  const isAppSubdomain = hostname.startsWith("app.");
  const isConstruSubdomain = hostname.startsWith("constru.");

  // El auth fuerte vive en layouts y APIs. Aqui solo hacemos rewrites y checks optimistas.
  if (isAppSubdomain) {
    if (pathname.startsWith(DASHBOARD_PREFIX)) {
      const cleanPath = pathname.replace(DASHBOARD_PREFIX, '') || '/';
      return NextResponse.redirect(new URL(cleanPath, request.url));
    }
    return NextResponse.rewrite(new URL(`${DASHBOARD_PREFIX}${pathname}`, request.url));
  }

  if (isConstruSubdomain) {
    if (pathname.startsWith('/constru')) {
      const cleanPath = pathname.replace('/constru', '') || '/';
      return NextResponse.redirect(new URL(cleanPath, request.url));
    }
    return NextResponse.rewrite(new URL(`/constru${pathname}`, request.url));
  }

  const hasSession = hasSupabaseSessionCookie(request);

  if (!hasSession && pathname.startsWith(DASHBOARD_PREFIX)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && AUTH_ENTRY_ROUTES.has(pathname)) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = DASHBOARD_PREFIX;
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)',
  ],
}
