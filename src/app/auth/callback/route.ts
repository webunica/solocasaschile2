import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Allow explicit ?next= override, default to bienvenida
  const next = searchParams.get('next') ?? null

  if (code) {
    const cookieStore = await cookies()
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)!

    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    })

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // If caller passed explicit ?next=, honour it (e.g. password reset)
      if (next) {
        return NextResponse.redirect(`${origin}${next}`)
      }

      // Otherwise redirect to plan-aware welcome page
      const plan = data.user.user_metadata?.plan || 'gratis'
      return NextResponse.redirect(`${origin}/bienvenida?plan=${plan}`)
    }
  }

  // On error, redirect to login with error param
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
