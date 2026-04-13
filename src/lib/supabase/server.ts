import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { mockSupabaseClient } from './mock-client'

type ServerSupabaseClient = ReturnType<typeof createServerClient>;
type CookieSetPayload = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

export async function createClient() {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

  if (!url || !key) {
    console.warn("Supabase credentials missing on Server. Check .env or Vercel Settings.");
    return mockSupabaseClient as unknown as ServerSupabaseClient;
  }

  // Dominio compartido para que la sesión funcione en app. y constru.
  const isProduction = process.env.VERCEL_ENV === 'production' || (!process.env.VERCEL_ENV && process.env.NODE_ENV === 'production');
  const cookieDomain = isProduction ? '.solocasaschile.com' : undefined;

  return createServerClient(url, key, {
    cookieOptions: cookieDomain ? {
      domain: cookieDomain,
      secure: true,
      sameSite: 'lax' as const,
    } : undefined,
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: CookieSetPayload[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, {
              ...options,
              ...(cookieDomain ? { domain: cookieDomain } : {}),
            })
          )
        } catch {
          // The `setAll` method was called from a Server Component.
        }
      },
    },
  })
}

/**
 * Cliente de Supabase para fetching público que NO usa cookies,
 * permitiendo a Next.js generar estas páginas de forma estática durante el build.
 */
export async function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

  if (!url || !key) {
    console.warn("Supabase credentials missing for Public client.");
    return mockSupabaseClient as unknown as ServerSupabaseClient;
  }

  // Usamos createServerClient pero pasando un storage vacío para evitar el uso de cookies
  return createServerClient(url, key, {
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
  })
}
