import { createBrowserClient } from '@supabase/ssr'
import { mockSupabaseClient } from './mock-client'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

  if (!url || !key) {
    console.warn("Supabase credentials missing on Client. Check .env or Vercel Settings.");
    return mockSupabaseClient as any;
  }

  return createBrowserClient(url, key)
}
