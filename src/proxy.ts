import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(req: NextRequest) {
  const url = req.nextUrl
  const hostname = req.headers.get("host") || "";

  // Identificar si estamos en el subdominio 'app'
  const isAppSubdomain = hostname.startsWith("app.");

  // Si estamos en el subdominio 'app', reescribimos las rutas para que 
  // app.dominio.cl/catalog apunte a la carpeta real /dashboard/catalog
  if (isAppSubdomain) {
    // Si la ruta ya incluye /dashboard, redirigir a su versión limpia
    if (url.pathname.startsWith('/dashboard')) {
      const cleanPath = url.pathname.replace('/dashboard', '') || '/';
      return NextResponse.redirect(new URL(cleanPath, req.url));
    }
    
    // Reescribimos invisiblemente hacia la ruta interna /dashboard
    return NextResponse.rewrite(new URL(`/dashboard${url.pathname}`, req.url))
  }

  // Prevenir acceso al dashboard desde el dominio principal (opcional/comentado por dev local)
  /*
  if (!isAppSubdomain && url.pathname.startsWith('/dashboard')) {
    const domain = hostname.replace('www.', '');
    return NextResponse.redirect(new URL(`http://app.${domain}${url.pathname.replace('/dashboard', '')}`, req.url));
  }
  */

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
