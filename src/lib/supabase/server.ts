import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { mockSupabaseClient } from './mock-client'

export async function createClient() {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

  if (!url || !key) {
    console.warn("Supabase credentials missing on Server. Check .env or Vercel Settings.");
    return mockSupabaseClient as any;
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: any[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
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
    return mockSupabaseClient as any;
  }

  // Usamos createServerClient pero pasando un storage vacío para evitar el uso de cookies
  return createServerClient(url, key, {
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
  })
}
