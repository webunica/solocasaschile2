'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const credentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(credentials)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function register(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const companyName = formData.get('companyName') as string
  const rut = formData.get('rut') as string
  const repName = formData.get('repName') as string
  const phone = formData.get('phone') as string

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nombre: companyName,
        representante: repName,
      }
    }
  })

  if (signUpError) {
    return { error: signUpError.message }
  }

  // Crear registro inicial en constructoras
  if (authData.user) {
    const slug = companyName
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')

    await supabase.from('constructoras').insert([{
      id: authData.user.id,
      nombre: companyName,
      slug,
      email,
      telefono: phone,
      plan: 'gratis',
      verificada: false,
      score_confianza: 50,
    }])
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function updateLeadStatus(leadId: string, status: string) {
  const supabase = await createClient()
  await supabase
    .from('leads')
    .update({ estado: status })
    .eq('id', leadId)
  revalidatePath('/dashboard/leads')
}
