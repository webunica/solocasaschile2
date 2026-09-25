'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from "zod";
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPlanLimits } from '../constants/plans'
import { resend } from '@/lib/resend'
import { recalcularSellosAutomaticos } from '@/lib/services/sellos'
import { getNextLeadStage, normalizeLeadStage, type LeadFunnelStage } from '@/lib/communications/funnel'
import { evaluateAntiSpam } from '@/lib/security/anti-spam'

type GenericRecord = Record<string, unknown>;
type EmailRow = { email: string | null };
type ConstructoraTargetRow = { id: string; nombre: string; email: string | null };
type ModelPayload = GenericRecord & {
  nombre: string;
  imagenes_urls?: string[];
  slug?: string;
};
type PotentialLeadRow = {
  id: string;
  empresa_nombre: string;
  contacto_nombre: string | null;
  email: string;
  telefono: string | null;
  region: string | null;
  etapa: string;
  estado: string;
};

async function resolveAdminAccess() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, isAdmin: false as const };

  const { data: profile } = await supabase
    .from('constructoras')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  const isSuperAdmin = user.app_metadata?.is_superadmin === true || profile?.role === 'superadmin';
  const isAdmin = isSuperAdmin || profile?.role === 'admin' || user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin';

  return { supabase, user, isAdmin };
}

function getErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function generateTempPassword(): string {
  return `Lead!${Math.random().toString(36).slice(2, 10)}#${Date.now().toString().slice(-4)}`;
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const credentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data, error } = await supabase.auth.signInWithPassword(credentials)

  if (error) {
    return { error: error.message }
  }

  // Auto-crear o sincronizar perfil de constructora
  if (data.user) {
    const { data: existing } = await supabase
      .from('constructoras')
      .select('id, plan')
      .eq('id', data.user.id)
      .maybeSingle()

    const metaPlan = (data.user.user_metadata?.plan as string) || 'starter'

    if (!existing) {
      const email = data.user.email || ''
      const nombre = data.user.user_metadata?.nombre || email.split('@')[0] || 'Mi Constructora'
      const slug = `${nombre.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')}-${data.user.id.slice(0, 8)}`

      await supabase.from('constructoras').insert([{
        id: data.user.id,
        nombre,
        slug,
        email,
        plan: metaPlan,
        verificada: false,
        score_confianza: 50,
      }])
    } else if (metaPlan === 'starter' && existing.plan === 'gratis') {
      await supabase.from('constructoras').update({ plan: 'starter' }).eq('id', data.user.id)
    }
  }

  revalidatePath('/', 'layout')

  redirect('/dashboard')
}

export async function register(formData: FormData) {
  try {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const plan = (formData.get('plan') as string) || 'gratis'
    
    // Default values if not provided in registration form
    const companyName = (formData.get('companyName') as string) || email.split('@')[0]
    const rut = (formData.get('rut') as string) || ''
    const repName = (formData.get('repName') as string) || ''
    const phone = (formData.get('phone') as string) || ''

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://solocasaschile.com'

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
        data: {
          nombre: companyName,
          representante: repName,
          plan, // stored in user_metadata â€” read by the callback to redirect to /bienvenida?plan=X
        }
      }
    })

    if (signUpError) {
      return { error: signUpError.message }
    }

    if (!authData.user) {
      return { error: 'No se pudo crear la cuenta. Intenta de nuevo.' }
    }

    const baseSlug = companyName
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
    
    // Ensure unique slug if based on email placeholder
    const slug = `${baseSlug}-${authData.user.id.slice(0, 5)}`

    const constructoraPayload: GenericRecord = {
      id: authData.user.id,
      nombre: companyName,
      slug,
      email,
      telefono: phone,
      rut: rut,
      plan,
      plan_status: plan === 'gratis' || plan === 'prueba' || plan === 'starter' ? 'active' : 'pending',
      verificada: false,
      score_confianza: 50,
    }

    // El plan prueba dura 30 dias. Starter es permanente para 1 modelo.
    if (plan === 'prueba' || plan === 'gratis') {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      constructoraPayload.next_billing_date = expirationDate.toISOString();
    }

    // Si necesita confirmar email (sesiÃ³n es null)
    if (!authData.session) {
      // Intentar crear constructora (puede fallar si ya existe, lo ignoramos)
      await supabase.from('constructoras').upsert([constructoraPayload], { onConflict: 'id', ignoreDuplicates: true })
      return { needsConfirmation: true }
    }

    // Insertar/actualizar perfil de constructora
    await supabase.from('constructoras').upsert([constructoraPayload], { onConflict: 'id', ignoreDuplicates: true })

    // --- ENVIAR EMAILS DE BIENVENIDA ---
    try {
      // 1. Email al usuario
      await resend.emails.send({
        from: 'SoloCasasChile <contacto@solocasaschile.com>',
        to: [email],
        subject: 'Â¡Bienvenido a SoloCasasChile! ðŸ ',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
            <div style="background: #0b9e86; padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 24px;">Â¡Hola ${companyName}!</h1>
            </div>
            <div style="padding: 30px; color: #334155; line-height: 1.6;">
              <p>Gracias por unirte a <strong>SoloCasasChile</strong>, la plataforma lÃ­der para constructoras y modelos de casas en Chile.</p>
              <p>Tu cuenta ha sido creada exitosamente con el plan <strong>${plan.toUpperCase()}</strong>.</p>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>PrÃ³ximos pasos:</strong></p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Completa el perfil de tu constructora.</li>
                  <li>Sube tus primeros modelos de casas.</li>
                  <li>Gestiona tus modelos desde tu panel de control.</li>
                </ul>
              </div>
              <a href="${siteUrl}/dashboard" style="display: block; background: #0b9e86; color: white; text-align: center; padding: 12px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px;">Acceder a mi Panel</a>
            </div>
          </div>
        `
      });

      // 2. Email al administrador (Aviso de nueva constructora)
      const adminEmail = process.env.ADMIN_EMAIL || 'info.javiermillar@gmail.com';
      await resend.emails.send({
        from: 'SoloCasasChile <contacto@solocasaschile.com>',
        to: [adminEmail],
        subject: 'ðŸš€ Nueva Constructora Registrada',
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Nueva Constructora en la plataforma</h2>
            <p><strong>Nombre:</strong> ${companyName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>TelÃ©fono:</strong> ${phone}</p>
            <p><strong>Plan seleccionado:</strong> ${plan.toUpperCase()}</p>
          </div>
        `
      });
    } catch (e) {
      console.error('Error enviando emails de registro:', e);
    }

    revalidatePath('/', 'layout')
    revalidateTag('constructoras', 'max')
    return { redirectTo: `/bienvenida?plan=${plan}` }

  } catch (err: unknown) {
    console.error('[register] Unexpected error:', err)
    return { error: getErrorMessage(err, 'Error inesperado en el servidor. Intenta de nuevo.') }
  }
}

export async function registerFromInvitation(formData: FormData) {
  try {
    const token = (formData.get('token') as string)?.trim()
    if (!token) {
      return { error: 'Token de invitación no proporcionado.' }
    }

    const { getInvitationByToken, markInvitationUsed } = await import('@/lib/invitations/generate')
    const invitation = await getInvitationByToken(token)

    if (!invitation) {
      return { error: 'Esta invitación no existe o es inválida.' }
    }

    if (invitation.status === 'accepted') {
      return { error: 'Esta invitación ya fue utilizada anteriormente.' }
    }

    if (invitation.status === 'expired' || new Date(invitation.expires_at) < new Date()) {
      return { error: 'Esta invitación ha expirado. Contacta a soporte para renovarla.' }
    }

    const supabase = await createClient()
    const email = ((formData.get('email') as string) || invitation.email).toLowerCase().trim()
    const password = formData.get('password') as string
    const companyName = ((formData.get('companyName') as string) || invitation.empresa_nombre).trim()
    const rut = (formData.get('rut') as string) || ''
    const repName = ((formData.get('repName') as string) || invitation.contacto_nombre || '').trim()
    const phone = (formData.get('phone') as string) || ''
    const region = (formData.get('region') as string) || invitation.region || ''

    if (!password || password.length < 6) {
      return { error: 'La contraseña debe tener al menos 6 caracteres.' }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://solocasaschile.com'

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
        data: {
          nombre: companyName,
          representante: repName,
          plan: 'starter',
        }
      }
    })

    if (signUpError) {
      return { error: signUpError.message }
    }

    if (!authData.user) {
      return { error: 'No se pudo crear la cuenta de usuario.' }
    }

    const baseSlug = companyName
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')

    const fallbackSlug = `${baseSlug}-${authData.user.id.slice(0, 5)}`

    // Vinculación inteligente: verificar si la constructora ya existía en el directorio
    const admin = createAdminClient()
    const { data: existingConstructora } = await admin
      .from('constructoras')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    const constructoraPayload: GenericRecord = {
      id: authData.user.id,
      nombre: companyName,
      slug: existingConstructora?.slug || fallbackSlug,
      email,
      telefono: phone || existingConstructora?.telefono || '',
      rut: rut || existingConstructora?.rut || '',
      region: region || (existingConstructora?.regiones?.[0] ?? ''),
      regiones: region ? [region] : (existingConstructora?.regiones ?? []),
      direccion: existingConstructora?.direccion || null,
      descripcion: existingConstructora?.descripcion || null,
      sitio_web: existingConstructora?.sitio_web || null,
      lat: existingConstructora?.lat || null,
      lng: existingConstructora?.lng || null,
      logo_url: existingConstructora?.logo_url || null,
      image_url: existingConstructora?.image_url || null,
      plan: 'starter',
      plan_status: 'active',
      verificada: existingConstructora?.verificada || false,
      score_confianza: existingConstructora?.score_confianza || 50,
    }

    if (existingConstructora && existingConstructora.id !== authData.user.id) {
      // Reasignar modelos existentes al nuevo usuario autenticado
      await admin
        .from('modelos')
        .update({ constructora_id: authData.user.id })
        .eq('constructora_id', existingConstructora.id)

      // Eliminar el registro previo para evitar duplicación
      await admin
        .from('constructoras')
        .delete()
        .eq('id', existingConstructora.id)
    }

    // Insertar/actualizar en tabla constructoras con el ID del nuevo usuario
    await admin.from('constructoras').upsert([constructoraPayload], { onConflict: 'id' })

    // Marcar la invitación como aceptada
    await markInvitationUsed(token)

    try {
      await resend.emails.send({
        from: 'SoloCasasChile <contacto@solocasaschile.com>',
        to: [email],
        subject: '¡Bienvenido a SoloCasasChile! 🎉 Tu Plan Starter está activo',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background: #0b9e86; padding: 24px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 22px;">¡Bienvenido ${companyName}!</h1>
            </div>
            <div style="padding: 24px; color: #334155; line-height: 1.6;">
              <p>Tu <strong>Plan Starter (1 modelo de casa gratis permanente)</strong> ya se encuentra activo en SoloCasasChile.</p>
              <p>Accede a tu panel para publicar tu modelo ahora mismo:</p>
              <div style="text-align: center; margin: 24px 0;">
                <a href="${siteUrl}/dashboard/catalog/new" style="background: #0b9e86; color: white; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: bold; display: inline-block;">
                  Subir mi primer modelo gratis →
                </a>
              </div>
            </div>
          </div>
        `
      })
    } catch (mailErr) {
      console.error('[registerFromInvitation] Error enviando bienvenida:', mailErr)
    }

    revalidatePath('/', 'layout')
    revalidateTag('constructoras', 'max')

    if (!authData.session) {
      return { needsConfirmation: true, email }
    }

    return { redirectTo: '/bienvenida?plan=starter' }
  } catch (err: unknown) {
    console.error('[registerFromInvitation] Unexpected error:', err)
    return { error: getErrorMessage(err, 'Error al activar tu invitación.') }
  }
}

export async function resendConfirmation(email: string) {
  try {
    const supabase = await createClient()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://solocasaschile.com'
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${siteUrl}/auth/callback` },
    })
    if (error) return { error: error.message }
    return { success: true }
  } catch (err: unknown) {
    return { error: getErrorMessage(err, 'Error al reenviar el correo.') }
  }
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

export async function updateSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { getOrCreateSynchronizedConstructora } = await import('@/lib/supabase/constructora-sync');
  const currentConst = await getOrCreateSynchronizedConstructora(user);
  const initialPlan = currentConst?.plan || (user.user_metadata?.plan as string) || 'starter';

  const isPaidPlan = initialPlan === 'avanza' || initialPlan === 'pro' || initialPlan === 'premium';

  const rawNombre = ((formData.get('nombre') as string) || currentConst?.nombre || 'Mi Constructora').trim();
  const fallbackSlug = currentConst?.slug || `${rawNombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}-${user.id.slice(0, 6)}`;

    const rawEspecialidad = (formData.get('especialidad_principal') as string)?.trim() || null;
    const rawTipos = (formData.get('tipos_construccion') as string)?.split(',').map(t => t.trim()).filter(Boolean) || [];

    const data: GenericRecord = {
      id: user.id,
      nombre: rawNombre,
      razon_social: (formData.get('razon_social') as string)?.trim() || null,
      email: ((formData.get('email') as string) || user.email || '')?.toLowerCase()?.trim(),
      descripcion: (formData.get('descripcion') as string)?.trim() || null,
      telefono: (formData.get('telefono') as string)?.trim() || null,
      rut: (formData.get('rut') as string)?.trim() || null,
      sitio_web: (formData.get('sitio_web') as string)?.trim() || null,
      direccion: (formData.get('direccion') as string)?.trim() || null,
      regiones: (formData.get('regiones') as string)?.split(',').map(r => r.trim()).filter(Boolean) || [],
      tipos_construccion: rawTipos.length > 0 ? rawTipos : (rawEspecialidad ? [rawEspecialidad] : []),
      especialidad_principal: rawEspecialidad ? rawEspecialidad.slice(0, 100) : (rawTipos[0] || null),
      logo_url: (formData.get('logo_url') as string) || currentConst?.logo_url || null,
      image_url: (formData.get('image_url') as string) || currentConst?.image_url || null,
      video_url: (formData.get('video_url') as string)?.trim() || null,
      anio_inicio: formData.get('anio_inicio') ? parseInt(formData.get('anio_inicio') as string, 10) : null,
      testimonios: formData.get('testimonios') ? JSON.parse(formData.get('testimonios') as string) : [],
      plan: initialPlan,
      plan_status: currentConst?.plan_status || 'active',
      slug: fallbackSlug,
    };

  // SEO fields only if paid plan
  if (isPaidPlan) {
    data.seo_title = (formData.get('seo_title') as string)?.trim() || null;
    data.seo_description = (formData.get('seo_description') as string)?.trim() || null;
    const keywordsRaw = formData.get('seo_keywords') as string;
    if (keywordsRaw) {
      try { data.seo_keywords = JSON.parse(keywordsRaw); } catch { data.seo_keywords = []; }
    }
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('constructoras')
    .upsert([data], { onConflict: 'id' });

  if (error) {
    console.error('[updateSettings] Error guardando constructora:', error);
    return { error: `Error al guardar los datos: ${error.message}` };
  }

  // Recalculo automÃ¡tico de sellos
  await recalcularSellosAutomaticos(user.id);

  revalidatePath('/dashboard/settings')
  revalidatePath(`/constructora/${formData.get('slug')}`)
  revalidateTag('constructoras', 'max')
  revalidateTag('modelos', 'max')
  return { success: true }
}

export async function createModel(data: ModelPayload) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  // 1. Obtener plan y lÃ­mites
  const { data: constructora } = await supabase
    .from('constructoras')
    .select('plan')
    .eq('id', user.id)
    .single()
  
  let effectivePlan = constructora?.plan || (user.user_metadata?.plan as string) || 'starter'
  if (effectivePlan === 'gratis' && user.user_metadata?.plan === 'starter') {
    effectivePlan = 'starter'
  }
  const limits = getPlanLimits(effectivePlan)

  // 2. Verificar límite de modelos si es creación (actualmente solo tenemos createModel)
  const { count } = await supabase
    .from('modelos')
    .select('*', { count: 'exact', head: true })
    .eq('constructora_id', user.id)

  if ((count || 0) >= limits.maxModels) {
    return { error: `Has alcanzado el límite de ${limits.maxModels} ${limits.maxModels === 1 ? 'modelo' : 'modelos'} para tu plan ${effectivePlan.toUpperCase()}. Mejora tu suscripción para publicar más modelos.` }
  }

  // 3. Verificar lÃ­mite de fotos
  if (data.imagenes_urls && data.imagenes_urls.length > limits.maxPhotos) {
    return { error: `Tu plan permite un mÃ¡ximo de ${limits.maxPhotos} fotos por modelo.` }
  }

  // Generate slug
  const slug = `${data.nombre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}-${Date.now()}`

  const { error } = await supabase
    .from('modelos')
    .insert([{
      ...data,
      constructora_id: user.id,
      slug,
      disponible: true
    }])

  if (error) return { error: error.message }

  // Recalculo automÃ¡tico de sellos
  await recalcularSellosAutomaticos(user.id);

  revalidatePath('/dashboard/catalog')
  revalidatePath('/catalogo')
  revalidatePath('/dashboard/settings')
  revalidateTag('modelos', 'max')
  return { success: true }
}

export async function updateModel(id: string, data: ModelPayload) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: profile } = await supabase.from('constructoras').select('role, plan').eq('id', user.id).single();
  const isSuperAdmin = profile?.role === 'superadmin' || user.app_metadata?.is_superadmin === true;

  const { data: currentModel } = await supabase.from('modelos').select('constructora_id, slug').eq('id', id).single();
  
  if (currentModel?.constructora_id !== user.id && !isSuperAdmin) {
    return { error: 'No autorizado' }
  }

  // 1. Check plan limits for photos
  const limits = getPlanLimits(isSuperAdmin ? 'premium' : (profile?.plan || 'gratis'));
  if (data.imagenes_urls && data.imagenes_urls.length > limits.maxPhotos) {
    return { error: `Tu plan permite un mÃ¡ximo de ${limits.maxPhotos} fotos.` };
  }

  const { error } = await supabase
    .from('modelos')
    .update(data)
    .eq('id', id);

  if (error) return { error: error.message }

  // Recalculo automÃ¡tico de sellos
  await recalcularSellosAutomaticos(currentModel.constructora_id);

  revalidatePath('/dashboard/catalog')
  revalidatePath('/catalogo')
  revalidatePath(`/modelo/${currentModel.slug}`)
  revalidatePath(`/modelo/${data.slug || currentModel.slug}`)
  revalidateTag('modelos', 'max')
  return { success: true }
}

// ============================================================
// ACCIONES DE SUPERADMINISTRACIÃ“N
// ============================================================

export async function toggleVerification(constructoraId: string, status: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.app_metadata?.is_superadmin !== true) throw new Error("Acceso denegado")

  const { error } = await supabase
    .from('constructoras')
    .update({ verificada: status })
    .eq('id', constructoraId)

  if (error) throw error
  revalidatePath('/dashboard/admin/constructoras')
  revalidateTag('constructoras', 'max')
  revalidateTag('modelos', 'max')
  return { success: true }
}

export async function updateConstructoraPlan(constructoraId: string, plan: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.app_metadata?.is_superadmin !== true) throw new Error("Acceso denegado")

  const { error } = await supabase
    .from('constructoras')
    .update({ plan })
    .eq('id', constructoraId)

  if (error) throw error
  revalidatePath('/dashboard/admin/constructoras')
  revalidateTag('constructoras', 'max')
  revalidateTag('modelos', 'max')
  return { success: true }
}

export async function updateConstructoraScore(constructoraId: string, score: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.app_metadata?.is_superadmin !== true) throw new Error("Acceso denegado")

  const { error } = await supabase
    .from('constructoras')
    .update({ score_confianza: score })
    .eq('id', constructoraId)

  if (error) throw error
  revalidatePath('/dashboard/admin/constructoras')
  revalidateTag('constructoras', 'max')
  revalidateTag('modelos', 'max')
  return { success: true }
}

export async function updateConstructoraEmail(constructoraId: string, email: string) {
  const { user, isAdmin, supabase } = await resolveAdminAccess()
  if (!user || !isAdmin) throw new Error("Acceso denegado: se requieren permisos de administrador.")

  const cleanEmail = email.toLowerCase().trim()
  if (!cleanEmail || !cleanEmail.includes("@")) {
    throw new Error("El formato del correo electrónico no es válido.")
  }

  const { error } = await supabase
    .from('constructoras')
    .update({ email: cleanEmail })
    .eq('id', constructoraId)

  if (error) throw error
  revalidatePath('/dashboard/admin/invitaciones')
  revalidatePath('/dashboard/admin/constructoras')
  revalidateTag('constructoras', 'max')
  return { success: true, email: cleanEmail }
}

export async function deleteConstructoraByAdmin(constructoraId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.app_metadata?.is_superadmin !== true) throw new Error("Acceso denegado")

  const admin = createAdminClient()

  // 1. Eliminar modelos, obras y pagos huérfanos si existen
  try { await admin.from('modelos').delete().eq('constructora_id', constructoraId) } catch {}
  try { await admin.from('obras').delete().eq('constructora_id', constructoraId) } catch {}
  try { await admin.from('pagos').delete().eq('constructora_id', constructoraId) } catch {}

  // 2. Eliminar de constructoras
  const { error } = await admin
    .from('constructoras')
    .delete()
    .eq('id', constructoraId)

  if (error) throw error

  // 3. Eliminar usuario de auth si existe
  try {
    await admin.auth.admin.deleteUser(constructoraId)
  } catch {
    // Si no es un usuario de auth o falla, continuar
  }

  revalidatePath('/dashboard/admin/constructoras')
  revalidateTag('constructoras', 'max')
  revalidateTag('modelos', 'max')
  return { success: true }
}

export async function adminUpdateConstructora(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user?.app_metadata?.is_superadmin !== true) {
    return { error: "Acceso denegado. Solo SuperAdmins pueden editar perfiles de terceros." }
  }

  const id = formData.get('id') as string
  if (!id) return { error: "ID de constructora no proporcionado." }

  const data: GenericRecord = {
    nombre: formData.get('nombre') as string,
    razon_social: formData.get('razon_social') as string,
    descripcion: formData.get('descripcion') as string,
    email: (formData.get('email') as string)?.trim().toLowerCase() || null,
    telefono: formData.get('telefono') as string,
    rut: formData.get('rut') as string,
    sitio_web: formData.get('sitio_web') as string,
    direccion: formData.get('direccion') as string,
    regiones: (formData.get('regiones') as string)?.split(',').map(r => r.trim()).filter(Boolean),
    logo_url: formData.get('logo_url') as string,
    image_url: formData.get('image_url') as string,
    video_url: formData.get('video_url') as string,
    seo_title: formData.get('seo_title') as string || null,
    seo_description: formData.get('seo_description') as string || null,
  }

  const keywordsRaw = formData.get('seo_keywords') as string;
  if (keywordsRaw) {
    try { data.seo_keywords = JSON.parse(keywordsRaw); } catch { data.seo_keywords = []; }
  }

  const { error } = await supabase
    .from('constructoras')
    .update(data)
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/admin/constructoras')
  revalidatePath(`/dashboard/admin/constructoras/${id}/edit`)
  revalidatePath(`/constructora/${formData.get('slug')}`)
  revalidateTag('constructoras', 'max')
  revalidateTag('modelos', 'max')
  return { success: true }
}

export async function deleteModelo(id: string, _formData?: FormData) {
  void _formData
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  
  const { data: profile } = await supabase.from('constructoras').select('role').eq('id', user.id).maybeSingle();
  const isSuperAdmin = profile?.role === 'superadmin' || user.app_metadata?.is_superadmin === true;

  const query = supabase.from('modelos').delete().eq('id', id)
  
  if (!isSuperAdmin) {
    query.eq('constructora_id', user.id)
  }

  const { error } = await query.select('*');
  
  if (error) throw error
  
  // Revalidate all affected routes
  revalidatePath('/comparar')
  revalidatePath('/modelo/[slug]', 'page')
  revalidateTag('modelos', 'max')
}

export async function toggleFeaturedModelo(id: string, featured: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  
  const { data: profile } = await supabase.from('constructoras').select('role').eq('id', user.id).maybeSingle();
  const isSuperAdmin = profile?.role === 'superadmin' || user.app_metadata?.is_superadmin === true;

  if (!isSuperAdmin) throw new Error('No autorizado. Solo SuperAdmins pueden destacar modelos.');

  const { error } = await supabase
    .from('modelos')
    .update({ is_featured: featured })
    .eq('id', id)

  if (error) throw error
  
  revalidatePath('/dashboard/catalog')
  revalidatePath('/catalogo')
  revalidatePath('/')
  revalidateTag('modelos', 'max')
  revalidateTag('featured', 'max')
}

export async function updateSiteSettings(key: string, value: unknown) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("No autenticado")

  const isSuperAdmin = user.app_metadata?.is_superadmin === true || user.user_metadata?.role === 'superadmin' || user.app_metadata?.role === 'superadmin';
  const isAdmin = isSuperAdmin || user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin';

  // Opcional: chequear base de datos si es necesario, pero como ya sabemos
  // asumimos que user_metadata o app_metadata lo tienen.
  // Pero para seguridad total, obtenemos de la DB:
  const { data: profile } = await supabase.from('constructoras').select('role').eq('id', user.id).maybeSingle();
  const dbIsAdmin = profile?.role === 'admin' || profile?.role === 'superadmin';

  if (!isAdmin && !dbIsAdmin) {
    throw new Error("No tienes permisos de administrador")
  }

  const { error } = await supabase
    .from('site_settings')
    .upsert({ 
      key, 
      value,
      updated_at: new Date().toISOString()
    }, { onConflict: 'key' })

  if (error) throw error
  
  revalidatePath('/', 'layout')
  revalidateTag('modelos', 'max')
  revalidateTag('featured', 'max')
  return { success: true }
}

export async function sendBulkEmail(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "No autenticado." }
  }

  const { data: profile } = await supabase
    .from('constructoras')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  const isSuperAdmin = user.app_metadata?.is_superadmin === true || profile?.role === 'superadmin'
  const isAdmin = isSuperAdmin || profile?.role === 'admin' || user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin'

  if (!isAdmin) {
    return { error: "Acceso denegado. Solo admins pueden enviar correos masivos." }
  }

  const asunto = formData.get('asunto') as string
  const mensaje = formData.get('mensaje') as string
  const contentModeRaw = formData.get('content_mode') as string | null
  const contentMode = contentModeRaw === 'html' ? 'html' : 'text'
  const audiencia = formData.get('audiencia') as string // 'todos', 'gratis', 'pro', 'premium'

  if (!asunto?.trim() || !mensaje?.trim() || !audiencia) {
    return { error: "Todos los campos son obligatorios." }
  }

  try {
    // 1. Obtener destinatarios basÃ¡ndose en la audiencia
    let emails: string[] = []

    if (audiencia === 'seleccion_manual') {
      const selectedIds = JSON.parse(formData.get('selected_ids') as string || '[]')
      const { data: dests, error: fetchError } = await supabase
        .from('constructoras')
        .select('email')
        .in('id', selectedIds)
        .not('email', 'is', null)
      
      if (fetchError) throw fetchError
      emails = ((dests as EmailRow[] | null) || []).map(d => d.email).filter(Boolean) as string[]
    } else {
      let query = supabase.from('constructoras').select('email').not('email', 'is', null)
      if (audiencia !== 'todos') {
        query = query.eq('plan', audiencia)
      }
      const { data: dests, error: fetchError } = await query
      if (fetchError) throw fetchError
      emails = ((dests as EmailRow[] | null) || []).map(d => d.email).filter(Boolean) as string[]
    }
    
    if (emails.length === 0) {
      return { error: "No hay destinatarios vÃ¡lidos seleccionados." }
    }

    const cleanMensaje = mensaje.trim()
    const escapeHtml = (input: string) =>
      input
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;')

    const bodyContent =
      contentMode === 'html'
        ? cleanMensaje
        : `<p>${escapeHtml(cleanMensaje).replace(/\n/g, '<br />')}</p>`

    const fullHtmlDocPattern = /<!doctype html|<html[\s>]/i
    const htmlPayload = fullHtmlDocPattern.test(cleanMensaje)
      ? cleanMensaje
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
          <div style="background: #ffffff; padding: 24px 30px; text-align: center; border-bottom: 3px solid #0b9e86;">
            <img src="https://solocasaschile.com/images/logo.png" alt="SolocasasChile" style="height: 40px; width: auto; max-width: 100%;" />
          </div>
          <div style="padding: 40px 30px; line-height: 1.6; color: #334155; font-size: 15px;">
            ${bodyContent}
          </div>
          <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
            Mensaje oficial enviado por la administraciÃ³n de <a href="https://solocasaschile.com" style="color: #0b9e86; text-decoration: none; font-weight: bold;">SolocasasChile.com</a>
          </div>
        </div>
      `

    // 2. Enviar correos via Resend (BCC para privacidad)
    // Nota: Resend permite hasta 100 destinatarios por lote en BCC habitualmente.
    // Para simplificar esta v1, los enviamos todos juntos.
    const { error: sendError } = await resend.emails.send({
      from: 'SolocasasChile <envios@solocasaschile.com>',
      to: 'envios@solocasaschile.com', // Remitente como "To" para evitar fallos
      bcc: emails,
      subject: asunto,
      html: htmlPayload,
    })

    if (sendError) throw sendError

    // 3. Registrar en el historial
    await supabase.from('comunicaciones_historial').insert([{
      asunto,
      mensaje,
      audiencia_plan: audiencia,
      total_destinatarios: emails.length,
      enviado_por: user.id
    }])

    return { success: true, count: emails.length }

  } catch (err: unknown) {
    console.error('[sendBulkEmail] Error:', err)
    return { error: getErrorMessage(err, "Error al enviar los correos masivos.") }
  }
}

const ConstructoraCommsCreateSchema = z.object({
  empresa_nombre: z.string().trim().min(2).max(180),
  contacto_nombre: z.string().trim().max(180).optional().nullable(),
  email: z.string().trim().email().max(180),
  telefono: z.string().trim().max(80).optional().nullable(),
  region: z.string().trim().max(120).optional().nullable(),
  notes: z.string().trim().max(4000).optional().nullable(),
});

const ConstructoraCommsSendSchema = z.object({
  selected_ids: z.array(z.string().uuid()).min(1),
  subject: z.string().trim().min(3).max(180),
  message: z.string().trim().min(3).max(30000),
  content_mode: z.enum(['text', 'html']).default('text'),
  campaign_step: z.string().trim().min(3).max(50),
});

const ConstructoraCommsSegmentSchema = z.object({
  selected_ids: z.array(z.string().uuid()).min(1),
  segment: z.enum(['frio', 'interesado', 'embudo', 'cliente']),
});

export async function createConstructoraCommsLead(formData: FormData) {
  const { user, isAdmin } = await resolveAdminAccess();
  if (!user || !isAdmin) {
    return { error: 'Acceso denegado. Solo admins pueden agregar leads.' };
  }

  const parsed = ConstructoraCommsCreateSchema.safeParse({
    empresa_nombre: formData.get('empresa_nombre'),
    contacto_nombre: formData.get('contacto_nombre'),
    email: formData.get('email'),
    telefono: formData.get('telefono'),
    region: formData.get('region'),
    notes: formData.get('notes'),
  });
  if (!parsed.success) {
    return { error: 'Datos invalidos para crear lead.' };
  }

  const payload = parsed.data;
  const admin = createAdminClient();

  try {
    const existing = await admin
      .from('constructoras')
      .select('id')
      .eq('email', payload.email.toLowerCase())
      .maybeSingle();

    let targetId = existing.data?.id as string | undefined;

    if (!targetId) {
      const createdUser = await admin.auth.admin.createUser({
        email: payload.email.toLowerCase(),
        password: generateTempPassword(),
        email_confirm: true,
        user_metadata: {
          nombre: payload.empresa_nombre,
        },
      });

      if (createdUser.error || !createdUser.data.user) {
        return { error: `No se pudo crear usuario base para la constructora: ${createdUser.error?.message || 'unknown_error'}` };
      }
      targetId = createdUser.data.user.id;
    }

    const slugBase = slugify(payload.empresa_nombre) || 'constructora';
    const slug = `${slugBase}-${targetId.slice(0, 5)}`;

    const { error: upsertError } = await admin
      .from('constructoras')
      .upsert([{
        id: targetId,
        nombre: payload.empresa_nombre,
        slug,
        email: payload.email.toLowerCase(),
        telefono: payload.telefono || null,
        regiones: payload.region ? [payload.region] : [],
        plan: 'gratis',
        verificada: false,
        score_confianza: 50,
        comms_segmento: 'frio',
        comms_step: 'cold_0',
        comms_notes: payload.notes || null,
        owner_admin_id: user.id,
      }], { onConflict: 'id' });

    if (upsertError) {
      throw upsertError;
    }

    await admin.from('constructora_comms_events').insert([{
      constructora_id: targetId,
      event_type: 'manual_add',
      message: payload.notes || 'Lead agregado manualmente',
      sent_by: user.id,
    }]);

    revalidatePath('/dashboard/admin/comunicaciones');
    return { success: true };
  } catch (err: unknown) {
    console.error('[createConstructoraCommsLead] Error:', err);
    return { error: getErrorMessage(err, 'No se pudo crear el lead de constructora.') };
  }
}

export async function sendConstructoraCampaign(formData: FormData) {
  const { supabase, user, isAdmin } = await resolveAdminAccess();
  if (!user || !isAdmin) {
    return { error: 'Acceso denegado. Solo admins pueden enviar campañas.' };
  }

  const selectedRaw = formData.get('selected_ids');
  let selectedIds: string[] = [];
  try {
    selectedIds = JSON.parse((selectedRaw as string) || '[]');
  } catch {
    return { error: 'Lista de seleccion invalida.' };
  }

  const parsed = ConstructoraCommsSendSchema.safeParse({
    selected_ids: selectedIds,
    subject: formData.get('subject'),
    message: formData.get('message'),
    content_mode: formData.get('content_mode'),
    campaign_step: formData.get('campaign_step'),
  });
  if (!parsed.success) {
    return { error: 'Datos invalidos para envio masivo.' };
  }

  const payload = parsed.data;

  try {
    const { data: targets, error: targetsError } = await supabase
      .from('constructoras')
      .select('id, nombre, email')
      .in('id', payload.selected_ids)
      .not('email', 'is', null);

    if (targetsError) throw targetsError;
    const emails = ((targets as ConstructoraTargetRow[] | null) || [])
      .map((target: ConstructoraTargetRow) => target.email)
      .filter(Boolean) as string[];

    if (emails.length === 0) {
      return { error: 'No hay correos validos en la seleccion.' };
    }

    const cleanMessage = payload.message.trim();
    const escapeHtml = (input: string) =>
      input
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    const bodyContent =
      payload.content_mode === 'html'
        ? cleanMessage
        : `<p>${escapeHtml(cleanMessage).replace(/\n/g, '<br />')}</p>`;

    const htmlPayload = `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
        <div style="padding: 24px 28px; border-bottom: 3px solid #0b9e86; text-align:center;">
          <img src="https://solocasaschile.com/images/logo.png" alt="SoloCasasChile" style="height: 38px; width: auto; max-width: 100%;" />
        </div>
        <div style="padding: 30px 28px; color: #334155; line-height: 1.65; font-size: 15px;">
          ${bodyContent}
        </div>
        <div style="padding: 16px 20px; background:#f8fafc; color:#64748b; font-size: 12px; border-top: 1px solid #e2e8f0;">
          Mensaje enviado por <a href="https://solocasaschile.com" style="color:#0b9e86; text-decoration:none; font-weight:700;">SoloCasasChile.com</a>
        </div>
      </div>
    `;

    const { error: sendError } = await resend.emails.send({
      from: 'SoloCasasChile <envios@solocasaschile.com>',
      to: 'envios@solocasaschile.com',
      bcc: emails,
      subject: payload.subject,
      html: htmlPayload,
    });
    if (sendError) throw sendError;

    const nowIso = new Date().toISOString();
    const nextContact = new Date();
    nextContact.setDate(nextContact.getDate() + 3);

    const segment = payload.campaign_step.startsWith('cold_') ? 'frio' : null;
    const updatePayload: Record<string, unknown> = {
      last_contact_at: nowIso,
      comms_step: payload.campaign_step,
      owner_admin_id: user.id,
      next_contact_at: nextContact.toISOString(),
    };
    if (segment) updatePayload.comms_segmento = segment;

    await supabase
      .from('constructoras')
      .update(updatePayload)
      .in('id', payload.selected_ids);

    await supabase.from('constructora_comms_events').insert(
      payload.selected_ids.map((id) => ({
        constructora_id: id,
        event_type: 'email',
        campaign_step: payload.campaign_step,
        subject: payload.subject,
        message: cleanMessage,
        content_mode: payload.content_mode,
        sent_by: user.id,
      }))
    );

    revalidatePath('/dashboard/admin/comunicaciones');
    return { success: true, count: emails.length };
  } catch (err: unknown) {
    console.error('[sendConstructoraCampaign] Error:', err);
    return { error: getErrorMessage(err, 'No se pudo enviar la campaña.') };
  }
}

export async function updateConstructoraCommsSegment(formData: FormData) {
  const { supabase, user, isAdmin } = await resolveAdminAccess();
  if (!user || !isAdmin) {
    return { error: 'Acceso denegado. Solo admins pueden cambiar segmento.' };
  }

  let selectedIds: string[] = [];
  try {
    selectedIds = JSON.parse((formData.get('selected_ids') as string) || '[]');
  } catch {
    return { error: 'Seleccion invalida.' };
  }

  const parsed = ConstructoraCommsSegmentSchema.safeParse({
    selected_ids: selectedIds,
    segment: formData.get('segment'),
  });
  if (!parsed.success) {
    return { error: 'Datos invalidos para cambiar segmento.' };
  }

  const payload = parsed.data;
  try {
    await supabase
      .from('constructoras')
      .update({
        comms_segmento: payload.segment,
        owner_admin_id: user.id,
      })
      .in('id', payload.selected_ids);

    await supabase.from('constructora_comms_events').insert(
      payload.selected_ids.map((id) => ({
        constructora_id: id,
        event_type: 'segment_change',
        message: `Segmento actualizado a ${payload.segment}`,
        sent_by: user.id,
      }))
    );

    revalidatePath('/dashboard/admin/comunicaciones');
    return { success: true };
  } catch (err: unknown) {
    console.error('[updateConstructoraCommsSegment] Error:', err);
    return { error: getErrorMessage(err, 'No se pudo actualizar segmento.') };
  }
}

const PotentialLeadCreateSchema = z.object({
  empresa_nombre: z.string().trim().min(2).max(180),
  contacto_nombre: z.string().trim().max(180).optional().nullable(),
  email: z.string().trim().email().max(180),
  telefono: z.string().trim().max(60).optional().nullable(),
  region: z.string().trim().max(120).optional().nullable(),
  notas: z.string().trim().max(5000).optional().nullable(),
});

const PotentialLeadEmailSchema = z.object({
  leadId: z.string().uuid(),
  subject: z.string().trim().min(3).max(180),
  message: z.string().trim().min(3).max(30000),
  contentMode: z.enum(['text', 'html']).default('text'),
});

export async function createPotentialConstructoraLead(formData: FormData) {
  const { supabase, user, isAdmin } = await resolveAdminAccess();
  if (!user || !isAdmin) {
    return { error: 'Acceso denegado. Solo admins pueden crear prospectos.' };
  }

  const parsed = PotentialLeadCreateSchema.safeParse({
    empresa_nombre: formData.get('empresa_nombre'),
    contacto_nombre: formData.get('contacto_nombre'),
    email: formData.get('email'),
    telefono: formData.get('telefono'),
    region: formData.get('region'),
    notas: formData.get('notas'),
  });

  if (!parsed.success) {
    return { error: 'Datos invalidos. Revisa nombre de empresa y correo.' };
  }

  try {
    const payload = parsed.data;
    const { data, error } = await supabase
      .from('potential_constructora_leads')
      .insert([{
        empresa_nombre: payload.empresa_nombre,
        contacto_nombre: payload.contacto_nombre || null,
        email: payload.email.toLowerCase(),
        telefono: payload.telefono || null,
        region: payload.region || null,
        notas: payload.notas || null,
        created_by: user.id,
        updated_by: user.id,
      }])
      .select('id')
      .single();

    if (error) throw error;

    await supabase.from('potential_constructora_lead_touches').insert([{
      lead_id: data.id,
      tipo: 'estado',
      etapa: 'nuevo',
      resultado: 'Lead potencial creado',
      created_by: user.id,
    }]);

    revalidatePath('/dashboard/admin/comunicaciones');
    return { success: true };
  } catch (err: unknown) {
    console.error('[createPotentialConstructoraLead] Error:', err);
    return { error: getErrorMessage(err, 'No se pudo crear el prospecto.') };
  }
}

export async function advancePotentialConstructoraLeadStage(leadId: string) {
  const { supabase, user, isAdmin } = await resolveAdminAccess();
  if (!user || !isAdmin) {
    return { error: 'Acceso denegado. Solo admins pueden avanzar etapas.' };
  }

  try {
    const { data: lead, error: fetchError } = await supabase
      .from('potential_constructora_leads')
      .select('id, etapa')
      .eq('id', leadId)
      .single();
    if (fetchError) throw fetchError;

    const nextStage = getNextLeadStage(lead.etapa);
    const nextStatus = nextStage === 'cerrado_ganado'
      ? 'ganado'
      : nextStage === 'cerrado_perdido'
        ? 'perdido'
        : 'activo';

    const { error: updateError } = await supabase
      .from('potential_constructora_leads')
      .update({
        etapa: nextStage,
        estado: nextStatus,
        ultimo_contacto_at: new Date().toISOString(),
        updated_by: user.id,
      })
      .eq('id', leadId);
    if (updateError) throw updateError;

    await supabase.from('potential_constructora_lead_touches').insert([{
      lead_id: leadId,
      tipo: 'estado',
      etapa: nextStage,
      resultado: `Cambio de etapa a ${nextStage}`,
      created_by: user.id,
    }]);

    revalidatePath('/dashboard/admin/comunicaciones');
    return { success: true, etapa: nextStage };
  } catch (err: unknown) {
    console.error('[advancePotentialConstructoraLeadStage] Error:', err);
    return { error: getErrorMessage(err, 'No se pudo avanzar la etapa.') };
  }
}

export async function markPotentialConstructoraLeadLost(leadId: string) {
  const { supabase, user, isAdmin } = await resolveAdminAccess();
  if (!user || !isAdmin) {
    return { error: 'Acceso denegado. Solo admins pueden actualizar prospectos.' };
  }

  try {
    const targetStage: LeadFunnelStage = 'cerrado_perdido';
    const { error: updateError } = await supabase
      .from('potential_constructora_leads')
      .update({
        etapa: targetStage,
        estado: 'perdido',
        ultimo_contacto_at: new Date().toISOString(),
        updated_by: user.id,
      })
      .eq('id', leadId);
    if (updateError) throw updateError;

    await supabase.from('potential_constructora_lead_touches').insert([{
      lead_id: leadId,
      tipo: 'estado',
      etapa: targetStage,
      resultado: 'Lead marcado como perdido',
      created_by: user.id,
    }]);

    revalidatePath('/dashboard/admin/comunicaciones');
    return { success: true };
  } catch (err: unknown) {
    console.error('[markPotentialConstructoraLeadLost] Error:', err);
    return { error: getErrorMessage(err, 'No se pudo marcar como perdido.') };
  }
}

export async function sendPotentialConstructoraLeadEmail(formData: FormData) {
  const { supabase, user, isAdmin } = await resolveAdminAccess();
  if (!user || !isAdmin) {
    return { error: 'Acceso denegado. Solo admins pueden enviar correos.' };
  }

  const parsed = PotentialLeadEmailSchema.safeParse({
    leadId: formData.get('leadId'),
    subject: formData.get('subject'),
    message: formData.get('message'),
    contentMode: formData.get('contentMode'),
  });

  if (!parsed.success) {
    return { error: 'Datos invalidos para enviar correo.' };
  }

  try {
    const { leadId, subject, message, contentMode } = parsed.data;

    const { data: lead, error: leadError } = await supabase
      .from('potential_constructora_leads')
      .select('id, empresa_nombre, contacto_nombre, email, etapa, estado')
      .eq('id', leadId)
      .single();
    if (leadError) throw leadError;

    const leadRow = lead as PotentialLeadRow;
    const safeMessage = message.trim();
    const escapeHtml = (input: string) =>
      input
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

    const bodyContent = contentMode === 'html'
      ? safeMessage
      : `<p>${escapeHtml(safeMessage).replace(/\n/g, '<br />')}</p>`;

    const htmlPayload = `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff;">
        <div style="padding: 24px 28px; border-bottom: 3px solid #0b9e86; text-align:center;">
          <img src="https://solocasaschile.com/images/logo.png" alt="SoloCasasChile" style="height: 38px; width: auto; max-width: 100%;" />
        </div>
        <div style="padding: 30px 28px; color: #334155; line-height: 1.65; font-size: 15px;">
          <p style="margin-top: 0;">Hola ${leadRow.contacto_nombre || leadRow.empresa_nombre},</p>
          ${bodyContent}
        </div>
        <div style="padding: 16px 20px; background:#f8fafc; color:#64748b; font-size: 12px; border-top: 1px solid #e2e8f0;">
          Mensaje enviado por el equipo comercial de <a href="https://solocasaschile.com" style="color:#0b9e86; text-decoration:none; font-weight:700;">SoloCasasChile.com</a>
        </div>
      </div>
    `;

    const { error: sendError } = await resend.emails.send({
      from: 'SoloCasasChile <envios@solocasaschile.com>',
      to: [leadRow.email],
      subject,
      html: htmlPayload,
    });
    if (sendError) throw sendError;

    const nowIso = new Date().toISOString();
    await supabase.from('potential_constructora_lead_touches').insert([{
      lead_id: leadId,
      tipo: 'email',
      asunto: subject,
      mensaje: safeMessage,
      etapa: normalizeLeadStage(leadRow.etapa),
      resultado: 'Correo enviado',
      created_by: user.id,
    }]);

    await supabase
      .from('potential_constructora_leads')
      .update({
        ultimo_contacto_at: nowIso,
        last_email_subject: subject,
        last_email_sent_at: nowIso,
        updated_by: user.id,
      })
      .eq('id', leadId);

    revalidatePath('/dashboard/admin/comunicaciones');
    return { success: true };
  } catch (err: unknown) {
    console.error('[sendPotentialConstructoraLeadEmail] Error:', err);
    return { error: getErrorMessage(err, 'No se pudo enviar el correo al prospecto.') };
  }
}
export async function submitLead(data: {
  nombre_cliente: string;
  email_cliente: string;
  telefono_cliente: string;
  mensaje: string;
  modelo_id: string;
  constructora_id: string;
  modelo_nombre: string;
  constructora_nombre: string;
  b_website?: string;
  website?: string;
  _form_time?: number | string;
}) {
  // Capa de evaluación de seguridad anti-spam
  const spamResult = evaluateAntiSpam({
    name: data.nombre_cliente,
    email: data.email_cliente,
    phone: data.telefono_cliente,
    message: data.mensaje,
    honeypot: data.website,
    honeypotAlt: data.b_website,
    formTime: data._form_time,
    skipVelocityCheck: data._form_time === undefined,
  });

  if (spamResult.isSpam) {
    console.warn('[submitLead] Spam detectado y descartado silenciosamente:', {
      layer: spamResult.layer,
      reason: spamResult.reason,
      details: spamResult.details,
    });
    // Silent drop: retorna éxito simulado para neutralizar bots
    return { success: true };
  }

  const supabase = await createClient();

  // 1. Obtener email de la constructora o del modelo
  const { data: leadConfig } = await supabase
    .from('modelos')
    .select(`
      contacto_email,
      constructora:constructoras (email, nombre)
    `)
    .eq('id', data.modelo_id)
    .single();

  const destinatarioEmail = leadConfig?.contacto_email || leadConfig?.constructora?.email;
  const constructoraNombreReal = leadConfig?.constructora?.nombre || data.constructora_nombre;

  // 2. Insertar en la base de datos
  const { error: insertError } = await supabase
    .from('leads')
    .insert([{
      nombre_cliente: data.nombre_cliente,
      email_cliente: data.email_cliente,
      telefono_cliente: data.telefono_cliente,
      mensaje: data.mensaje,
      modelo_id: data.modelo_id,
      constructora_id: data.constructora_id,
      estado: 'nuevo'
    }]);

  if (insertError) {
    console.error('Error al insertar lead:', insertError);
    return { error: 'Error al procesar tu solicitud.' };
  }

  // 3. Enviar correos via Resend
  try {
    // A. Email de confirmaciÃ³n al USUARIO
    await resend.emails.send({
      from: 'SoloCasasChile <contacto@solocasaschile.com>',
      to: [data.email_cliente],
      subject: `Hemos recibido tu solicitud de cotizaciÃ³n - ${data.modelo_nombre} ðŸ `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
          <div style="background: #0b9e86; padding: 24px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Â¡Hola ${data.nombre_cliente}!</h1>
          </div>
          <div style="padding: 40px 30px; line-height: 1.6; color: #334155; font-size: 15px;">
            <p>Gracias por tu interÃ©s en el modelo <strong>${data.modelo_nombre}</strong> de <strong>${data.constructora_nombre}</strong>.</p>
            <p>Hemos recibido tu mensaje correctamente. Un ejecutivo de la constructora se pondrÃ¡ en contacto contigo a la brevedad para brindarte toda la informaciÃ³n tÃ©cnica y comercial que necesites.</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #0b9e86;">Resumen de tu solicitud:</p>
              <p style="margin: 5px 0;"><strong>Modelo:</strong> ${data.modelo_nombre}</p>
              <p style="margin: 5px 0;"><strong>Constructora:</strong> ${constructoraNombreReal}</p>
            </div>

            <p>Si tienes cualquier otra duda, puedes responder a este correo.</p>
            <p style="margin-top: 30px;">Atentamente,<br>El equipo de <strong>SolocasasChile.com</strong></p>
          </div>
        </div>
      `
    });

    // B. Email de notificaciÃ³n a la CONSTRUCTORA
    if (destinatarioEmail) {
      await resend.emails.send({
        from: 'SoloCasasChile <leads@solocasaschile.com>',
        to: [destinatarioEmail],
        replyTo: data.email_cliente,
        subject: `Nueva CotizaciÃ³n: ${data.modelo_nombre} - ${data.nombre_cliente}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
            <div style="background: #1e293b; padding: 24px 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 20px;">ðŸš€ Tienes un nuevo interesado</h1>
            </div>
            <div style="padding: 30px; line-height: 1.6; color: #334155; font-size: 14px;">
              <p>Has recibido una nueva solicitud de cotizaciÃ³n a travÃ©s de SolocasasChile.</p>
              
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
                <p style="margin: 0 0 15px 0; font-weight: bold; color: #1e293b; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Datos del Cliente:</p>
                <p style="margin: 5px 0;"><strong>Nombre:</strong> ${data.nombre_cliente}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${data.email_cliente}">${data.email_cliente}</a></p>
                <p style="margin: 5px 0;"><strong>TelÃ©fono:</strong> <a href="tel:${data.telefono_cliente}">${data.telefono_cliente}</a></p>
                <p style="margin: 15px 0 5px 0;"><strong>Mensaje:</strong></p>
                <p style="background: white; padding: 10px; border-radius: 4px; border: 1px solid #eee; margin: 0;">${data.mensaje.replace(/\n/g, '<br>')}</p>
              </div>

              <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #dcfce7;">
                <p style="margin: 0;"><strong>Modelo consultado:</strong> ${data.modelo_nombre}</p>
              </div>
              
              <p style="margin-top: 25px; font-size: 12px; color: #64748b;">* Te recomendamos contactar al cliente dentro de las primeras 24 horas para aumentar las posibilidades de cierre.</p>
            </div>
          </div>
        `
      });
    }

    // C. Email de notificaciÃ³n a la PLATAFORMA (bcc/log)
    await resend.emails.send({
      from: 'Sistema SolocasasChile <leads@solocasaschile.com>',
      to: ['contacto@solocasaschile.com'],
      replyTo: data.email_cliente,
      subject: `[Log] Nuevo Lead: ${data.modelo_nombre} - ${data.nombre_cliente}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #0b9e86;">ðŸš€ Nuevo interesado en SolocasasChile</h2>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p><strong>Cliente:</strong> ${data.nombre_cliente}</p>
          <p><strong>Email:</strong> ${data.email_cliente}</p>
          <p><strong>TelÃ©fono:</strong> ${data.telefono_cliente}</p>
          <p><strong>Modelo interesado:</strong> ${data.modelo_nombre}</p>
          <p><strong>Constructora:</strong> ${data.constructora_nombre}</p>
          <p><strong>Enviado a Constructora:</strong> ${destinatarioEmail || 'No definido'}</p>
          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p><strong>Mensaje/Detalles:</strong></p>
            <p>${data.mensaje.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `
    });

  } catch (emailError) {
    console.error('Error al enviar correos de lead:', emailError);
    // No cortamos el flujo para el usuario si falla el email, ya se insertÃ³ en la DB.
  }

  return { success: true };
}


export async function incrementModelView(modeloId: string) {
  try {
    const supabase = await createClient();
    // Llama al RPC que creamos en la migraciÃ³n (seguro a nivel de fila y atÃ³mico)
    await supabase.rpc('increment_visitas', { modelo_id: modeloId });
  } catch (err) {
    console.error("Error incrementing views:", err);
  }
}

// â”€â”€â”€ ADMINISTRACIÃ“N DE SELLOS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export async function aprobarSello(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autenticado')

    const { data: profile } = await supabase.from('constructoras').select('role').eq('id', user.id).single()
    const isSuperAdmin = profile?.role === 'superadmin' || user.app_metadata?.is_superadmin === true
    if (!isSuperAdmin) throw new Error('No autorizado')

    const id = formData.get('sellosId') as string
    if (!id) throw new Error('ID de sello no proporcionado')
    
    console.log(`[Admin] Aprobando sello ID: ${id}`);

    const { data, error: errorUpdate } = await supabase
      .from('constructora_sellos')
      .update({ 
        estado: 'aprobado',
        otorgado_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (errorUpdate) {
      console.error("[Admin] Error al aprobar:", errorUpdate);
      throw new Error(errorUpdate.message);
    }

    if (!data || data.length === 0) {
      throw new Error("Permisos insuficientes en base de datos (RLS) o sello no existe.");
    }

    revalidatePath('/dashboard/admin/sellos')
    revalidatePath('/dashboard/sellos')
    revalidatePath('/constructoras') // For catalog
    console.log("[Admin] Sello aprobado exitosamente");
    return { success: true };

  } catch (err: unknown) {
    console.error("[Admin] ExcepciÃ³n en aprobarSello:", err);
    return { success: false, error: getErrorMessage(err, "Error desconocido") };
  }
}

export async function rechazarSello(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autenticado')

    const { data: profile } = await supabase.from('constructoras').select('role').eq('id', user.id).single()
    const isSuperAdmin = profile?.role === 'superadmin' || user.app_metadata?.is_superadmin === true
    if (!isSuperAdmin) throw new Error('No autorizado')

    const id = formData.get('sellosId') as string
    const comentario = formData.get('comentario') as string
    if (!id) throw new Error('ID de sello no proporcionado')
    
    console.log(`[Admin] Rechazando sello ID: ${id}`);

    const { data, error: errorUpdate } = await supabase
      .from('constructora_sellos')
      .update({ 
        estado: 'rechazado',
        comentario_admin: comentario,
        otorgado_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (errorUpdate) {
      console.error("[Admin] Error al rechazar:", errorUpdate);
      throw new Error(errorUpdate.message);
    }

    if (!data || data.length === 0) {
      throw new Error("Permisos insuficientes en base de datos (RLS) o sello no existe.");
    }

    revalidatePath('/dashboard/admin/sellos')
    revalidatePath('/dashboard/sellos')
    console.log("[Admin] Sello rechazado exitosamente");
    return { success: true };

  } catch (err: unknown) {
    console.error("[Admin] ExcepciÃ³n en rechazarSello:", err);
    return { success: false, error: getErrorMessage(err, "Error desconocido") };
  }
}

export async function solicitarSello(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  const selloId = formData.get('selloId') as string
  const evidenciaUrl = formData.get('evidenciaUrl') as string || null

  const { error } = await supabase
    .from('constructora_sellos')
    .insert([{
      constructora_id: user.id,
      sello_id: selloId,
      estado: 'pendiente',
      evidencia_url: evidenciaUrl
    }])

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/sellos')
  revalidatePath('/dashboard/admin/sellos')
}

const TestimonioSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(100),
  texto: z.string().min(1, "El testimonio no puede estar vacÃ­o").max(2000),
  cargo: z.string().max(100).optional().nullable(),
  estrellas: z.number().min(1).max(5),
  modelo_id: z.string().optional().nullable()
});

const TestimoniosArraySchema = z.array(TestimonioSchema);

export async function updateTestimonios(testimoniosRaw: unknown[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  // Validar esquema
  const validation = TestimoniosArraySchema.safeParse(testimoniosRaw);
  if (!validation.success) {
    return { success: false, error: "Datos de testimonios invÃ¡lidos o demasiado largos." };
  }

  const testimonios = validation.data;

  const { error } = await supabase
    .from('constructoras')
    .update({ testimonios })
    .eq('id', user.id)

  if (error) return { success: false, error: error.message }

  // Buscamos el slug para revalidar la ruta pÃºblica
  const { data: constructora } = await supabase
    .from('constructoras')
    .select('slug')
    .eq('id', user.id)
    .single();

  revalidatePath('/dashboard/testimonios')
  revalidatePath('/dashboard/settings')
  revalidatePath('/modelo/[slug]', 'layout')
  revalidatePath('/constructora/[slug]', 'layout')
  revalidateTag('modelos', 'max')
  revalidateTag('constructoras', 'max')
  
  if (constructora?.slug) {
    revalidatePath(`/constructora/${constructora.slug}`)
  }
  
  return { success: true }
}

// ── Lista de espera para Plan Starter ────────────────────────────────────────

const waitlistSchema = z.object({
  empresa_nombre:  z.string().min(2, 'El nombre de la empresa es requerido').max(120),
  contacto_nombre: z.string().max(100).optional(),
  email:           z.string().email('Ingresa un correo electrónico válido'),
  telefono:        z.string().max(30).optional(),
  region:          z.string().max(80).optional(),
  mensaje:         z.string().max(500).optional(),
});

export async function requestInvitation(formData: FormData) {
  const raw = {
    empresa_nombre:  formData.get('empresa_nombre'),
    contacto_nombre: formData.get('contacto_nombre') || undefined,
    email:           formData.get('email'),
    telefono:        formData.get('telefono')        || undefined,
    region:          formData.get('region')          || undefined,
    mensaje:         formData.get('mensaje')         || undefined,
  };

  const parsed = waitlistSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { error: first.message };
  }

  const { empresa_nombre, contacto_nombre, email, telefono, region, mensaje } = parsed.data;

  // Usamos el cliente de servicio para saltar RLS en las verificaciones
  // pero la INSERT se hace con cliente anónimo (public_insert_waitlist policy).
  const supabaseAdmin = createAdminClient();

  // 1. Verificar si ya tiene invitación activa
  const { data: existingInvitation } = await supabaseAdmin
    .from('constructora_invitations')
    .select('id, status')
    .eq('email', email.toLowerCase().trim())
    .in('status', ['pending', 'accepted'])
    .maybeSingle();

  if (existingInvitation) {
    if (existingInvitation.status === 'accepted') {
      return { error: 'Este correo ya tiene una cuenta activa en SoloCasasChile. Inicia sesión en /login.' };
    }
    return { error: 'Este correo ya tiene una invitación enviada. Revisa tu bandeja de entrada (también el spam).' };
  }

  // 2. Verificar duplicado en waitlist
  const { data: existingWaitlist } = await supabaseAdmin
    .from('invitation_waitlist')
    .select('id, status')
    .eq('email', email.toLowerCase().trim())
    .in('status', ['pending', 'invited'])
    .maybeSingle();

  if (existingWaitlist) {
    if (existingWaitlist.status === 'invited') {
      return { error: 'Ya te hemos enviado una invitación a este correo. Revisa tu bandeja de entrada.' };
    }
    return { already_pending: true };
  }

  // 3. Insertar en lista de espera (usa cliente anónimo con la policy pública)
  const supabase = await createClient();
  const { error: insertError } = await supabase
    .from('invitation_waitlist')
    .insert({
      empresa_nombre,
      contacto_nombre: contacto_nombre || null,
      email:           email.toLowerCase().trim(),
      telefono:        telefono || null,
      region:          region   || null,
      mensaje:         mensaje  || null,
      status:          'pending',
    });

  if (insertError) {
    console.error('[requestInvitation] Error:', insertError);
    return { error: 'No pudimos registrar tu solicitud. Inténtalo de nuevo en unos minutos.' };
  }

  // 3.1 Sincronizar inmediatamente a constructora si ya existe una ficha con este correo
  try {
    const { data: existingConst } = await supabaseAdmin
      .from('constructoras')
      .select('id, nombre, telefono, descripcion, regiones')
      .ilike('email', email.toLowerCase().trim())
      .maybeSingle();

    if (existingConst) {
      const updates: Record<string, any> = {};
      if (!existingConst.nombre || existingConst.nombre === 'Mi Constructora' || existingConst.nombre === email.split('@')[0]) {
        updates.nombre = empresa_nombre;
      }
      if (!existingConst.telefono && telefono) {
        updates.telefono = telefono;
      }
      if (!existingConst.descripcion && mensaje) {
        updates.descripcion = mensaje;
      }
      if ((!existingConst.regiones || existingConst.regiones.length === 0) && region) {
        updates.regiones = [region];
      }
      if (Object.keys(updates).length > 0) {
        await supabaseAdmin.from('constructoras').update(updates).eq('id', existingConst.id);
      }
    }
  } catch (syncErr) {
    console.warn('[requestInvitation] Error sincronizando a constructora existente:', syncErr);
  }

  // 4. Enviar correo de cortesía / confirmación de recepción
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://solocasaschile.com';
    await resend.emails.send({
      from: 'SoloCasasChile <contacto@solocasaschile.com>',
      to: [email.toLowerCase().trim()],
      subject: `Hemos recibido tu solicitud para el Plan Starter · SoloCasasChile`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; color: #1e293b;">
          <div style="background-color: #0b9e86; padding: 28px 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">SoloCasasChile</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 6px 0 0; font-size: 13px; font-weight: 500;">Catálogo Nacional de Casas Prefabricadas</p>
          </div>
          
          <div style="padding: 32px 28px;">
            <p style="font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 0;">
              Hola${contacto_nombre ? ` ${contacto_nombre}` : ''},
            </p>
            <p style="font-size: 14px; line-height: 1.6; color: #334155;">
              Hemos recibido correctamente tu solicitud de invitación para <strong>${empresa_nombre}</strong> al <strong>Plan Starter gratuito</strong> de SoloCasasChile.
            </p>

            <div style="background-color: #f8fafc; border-left: 4px solid #0b9e86; border-radius: 8px; padding: 16px 20px; margin: 24px 0;">
              <h3 style="margin: 0 0 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #0b9e86; font-weight: 800;">¿Cuáles son los siguientes pasos?</h3>
              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #475569;">
                Nuestro equipo revisa cada postulación en un plazo de <strong>24 a 48 horas hábiles</strong> para verificar los antecedentes de tu constructora. En cuanto sea aprobada, te enviaremos a este mismo correo tu <strong>enlace exclusivo de activación</strong>.
              </p>
            </div>

            <h3 style="margin: 24px 0 12px; font-size: 14px; font-weight: 700; color: #0f172a;">
              Beneficios que tendrás con tu Plan Starter:
            </h3>
            <ul style="margin: 0 0 24px; padding-left: 20px; font-size: 13px; line-height: 1.8; color: #334155;">
              <li><strong>1 modelo de casa</strong> publicado de forma permanente y sin costo.</li>
              <li><strong>Ficha oficial de constructora</strong> con información de contacto y regiones atendidas.</li>
              <li><strong>Presencia en el catálogo nacional</strong> más visitado de Chile.</li>
              <li><strong>Sin tarjeta de crédito</strong> ni costos ocultos o comisiones por cotizaciones.</li>
            </ul>

            <p style="font-size: 13px; line-height: 1.6; color: #64748b; margin-bottom: 0;">
              Si tienes alguna consulta previa, puedes responder directamente a este correo o contactarnos a <a href="mailto:contacto@solocasaschile.com" style="color: #0b9e86; text-decoration: underline;">contacto@solocasaschile.com</a>.
            </p>
          </div>

          <div style="background-color: #f1f5f9; padding: 20px 28px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 11px; color: #94a3b8; margin: 0;">
              SoloCasasChile · Santiago, Chile · <a href="${siteUrl}" style="color: #64748b; text-decoration: none;">solocasaschile.com</a>
            </p>
          </div>
        </div>
      `
    });
  } catch (emailErr) {
    console.error('[requestInvitation] Error enviando correo de cortesía:', emailErr);
  }

  return { success: true };
}

