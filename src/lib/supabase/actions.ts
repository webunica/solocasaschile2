'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPlanLimits } from '../constants/plans'
import { resend } from '@/lib/resend'

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

  // Auto-crear perfil de constructora si no existe aún (para usuarios creados manualmente)
  if (data.user) {
    const { data: existing } = await supabase
      .from('constructoras')
      .select('id')
      .eq('id', data.user.id)
      .maybeSingle()

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
        plan: 'gratis',
        verificada: false,
        score_confianza: 50,
      }])
    }
  }

  revalidatePath('/', 'layout')

  // Redirigir según estado de plan
  const { data: profile } = await supabase.from('constructoras').select('plan_status').eq('id', data.user.id).maybeSingle();
  if (profile?.plan_status === 'pending') {
    redirect('/planes?status=pending');
  }

  redirect('/dashboard')
}

export async function register(formData: FormData) {
  try {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const companyName = formData.get('companyName') as string
    const rut = formData.get('rut') as string
    const repName = formData.get('repName') as string
    const phone = formData.get('phone') as string
    const plan = (formData.get('plan') as string) || 'gratis'

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://solocasaschile.com'

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
        data: {
          nombre: companyName,
          representante: repName,
          plan, // stored in user_metadata — read by the callback to redirect to /bienvenida?plan=X
        }
      }
    })

    if (signUpError) {
      return { error: signUpError.message }
    }

    if (!authData.user) {
      return { error: 'No se pudo crear la cuenta. Intenta de nuevo.' }
    }

    const slug = companyName
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')

    const constructoraPayload = {
      id: authData.user.id,
      nombre: companyName,
      slug,
      email,
      telefono: phone,
      plan,
      plan_status: plan === 'gratis' ? 'active' : 'pending',
      verificada: false,
      score_confianza: 50,
    }

    // Si necesita confirmar email (sesión es null)
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
        subject: '¡Bienvenido a SoloCasasChile! 🏠',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
            <div style="background: #0b9e86; padding: 30px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 24px;">¡Hola ${companyName}!</h1>
            </div>
            <div style="padding: 30px; color: #334155; line-height: 1.6;">
              <p>Gracias por unirte a <strong>SoloCasasChile</strong>, la plataforma líder para constructoras y modelos de casas en Chile.</p>
              <p>Tu cuenta ha sido creada exitosamente con el plan <strong>${plan.toUpperCase()}</strong>.</p>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Próximos pasos:</strong></p>
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
      await resend.emails.send({
        from: 'SoloCasasChile <contacto@solocasaschile.com>',
        to: ['info.javiermillar@gmail.com'],
        subject: '🚀 Nueva Constructora Registrada',
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Nueva Constructora en la plataforma</h2>
            <p><strong>Nombre:</strong> ${companyName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${phone}</p>
            <p><strong>Plan seleccionado:</strong> ${plan.toUpperCase()}</p>
          </div>
        `
      });
    } catch (e) {
      console.error('Error enviando emails de registro:', e);
    }

    revalidatePath('/', 'layout')
    return { redirectTo: `/bienvenida?plan=${plan}` }

  } catch (err: any) {
    console.error('[register] Unexpected error:', err)
    return { error: err?.message || 'Error inesperado en el servidor. Intenta de nuevo.' }
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
  } catch (err: any) {
    return { error: err?.message || 'Error al reenviar el correo.' }
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

  // Check plan for SEO restriction
  const { data: currentConst } = await supabase.from('constructoras').select('plan').eq('id', user.id).single();
  const initialPlan = currentConst?.plan || 'gratis';

  const isPaidPlan = initialPlan === 'pro' || initialPlan === 'premium';

  const data: any = {
    nombre: formData.get('nombre') as string,
    descripcion: formData.get('descripcion') as string,
    telefono: formData.get('telefono') as string,
    sitio_web: formData.get('sitio_web') as string,
    direccion: formData.get('direccion') as string,
    regiones: (formData.get('regiones') as string)?.split(',').map(r => r.trim()).filter(Boolean),
    logo_url: formData.get('logo_url') as string,
    image_url: formData.get('image_url') as string,
    video_url: formData.get('video_url') as string,
  }

  // SEO fields only if paid plan
  if (isPaidPlan) {
    data.seo_title = formData.get('seo_title') as string || null;
    data.seo_description = formData.get('seo_description') as string || null;
    const keywordsRaw = formData.get('seo_keywords') as string;
    if (keywordsRaw) {
      try { data.seo_keywords = JSON.parse(keywordsRaw); } catch { data.seo_keywords = []; }
    }
  }

  const { error } = await supabase
    .from('constructoras')
    .update(data)
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard/settings')
  revalidatePath(`/constructora/${formData.get('slug')}`)
  return { success: true }
}

export async function createModel(data: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  // 1. Obtener plan y límites
  const { data: constructora } = await supabase
    .from('constructoras')
    .select('plan')
    .eq('id', user.id)
    .single()
  
  const limits = getPlanLimits(constructora?.plan || 'gratis')

  // 2. Verificar límite de modelos si es creación (actualmente solo tenemos createModel)
  const { count } = await supabase
    .from('modelos')
    .select('*', { count: 'exact', head: true })
    .eq('constructora_id', user.id)

  if ((count || 0) >= limits.maxModels) {
    return { error: `Has alcanzado el límite de ${limits.maxModels} modelos para tu plan ${constructora?.plan?.toUpperCase()}. Mejora tu suscripción para publicar más modelos.` }
  }

  // 3. Verificar límite de fotos
  if (data.imagenes_urls && data.imagenes_urls.length > limits.maxPhotos) {
    return { error: `Tu plan permite un máximo de ${limits.maxPhotos} fotos por modelo.` }
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

  revalidatePath('/dashboard/catalog')
  revalidatePath('/catalogo')
  revalidatePath('/dashboard/settings')
  return { success: true }
}

export async function updateModel(id: string, data: any) {
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
    return { error: `Tu plan permite un máximo de ${limits.maxPhotos} fotos.` };
  }

  const { error } = await supabase
    .from('modelos')
    .update(data)
    .eq('id', id);

  if (error) return { error: error.message }

  revalidatePath('/dashboard/catalog')
  revalidatePath('/catalogo')
  revalidatePath(`/modelo/${currentModel.slug}`)
  revalidatePath(`/modelo/${data.slug || currentModel.slug}`)
  return { success: true }
}

// ============================================================
// ACCIONES DE SUPERADMINISTRACIÓN
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

  const data: any = {
    nombre: formData.get('nombre') as string,
    descripcion: formData.get('descripcion') as string,
    telefono: formData.get('telefono') as string,
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
  return { success: true }
}

export async function deleteModelo(id: string, _formData?: FormData) {
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
  revalidatePath('/dashboard/catalog')
  revalidatePath('/catalogo')
  revalidatePath('/')
  revalidatePath('/comparar')
  revalidatePath('/modelo/[slug]', 'page')
}

export async function updateSiteSettings(key: string, value: any) {
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
  return { success: true }
}

export async function sendBulkEmail(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user?.app_metadata?.is_superadmin !== true) {
    return { error: "Acceso denegado. Solo SuperAdmins pueden enviar correos masivos." }
  }

  const asunto = formData.get('asunto') as string
  const mensaje = formData.get('mensaje') as string
  const audiencia = formData.get('audiencia') as string // 'todos', 'gratis', 'pro', 'premium'

  if (!asunto || !mensaje || !audiencia) {
    return { error: "Todos los campos son obligatorios." }
  }

  try {
    // 1. Obtener destinatarios basándose en la audiencia
    let emails: string[] = []

    if (audiencia === 'seleccion_manual') {
      const selectedIds = JSON.parse(formData.get('selected_ids') as string || '[]')
      const { data: dests, error: fetchError } = await supabase
        .from('constructoras')
        .select('email')
        .in('id', selectedIds)
        .not('email', 'is', null)
      
      if (fetchError) throw fetchError
      emails = (dests as any[] || []).map(d => d.email).filter(Boolean)
    } else {
      let query = supabase.from('constructoras').select('email').not('email', 'is', null)
      if (audiencia !== 'todos') {
        query = query.eq('plan', audiencia)
      }
      const { data: dests, error: fetchError } = await query
      if (fetchError) throw fetchError
      emails = (dests as any[] || []).map(d => d.email).filter(Boolean)
    }
    
    if (emails.length === 0) {
      return { error: "No hay destinatarios válidos seleccionados." }
    }

    // 2. Enviar correos via Resend (BCC para privacidad)
    // Nota: Resend permite hasta 100 destinatarios por lote en BCC habitualmente.
    // Para simplificar esta v1, los enviamos todos juntos.
    const { error: sendError } = await resend.emails.send({
      from: 'SolocasasChile <envios@solocasaschile.com>',
      to: 'envios@solocasaschile.com', // Remitente como "To" para evitar fallos
      bcc: emails,
      subject: asunto,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
          <div style="background: #ffffff; padding: 24px 30px; text-align: center; border-bottom: 3px solid #0b9e86;">
            <img src="https://solocasaschile.com/images/logo.png" alt="SolocasasChile" style="height: 40px; width: auto; max-width: 100%;" />
          </div>
          <div style="padding: 40px 30px; line-height: 1.6; color: #334155; font-size: 15px;">
            ${mensaje.replace(/\n/g, '<br>')}
          </div>
          <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
            Mensaje oficial enviado por la administración de <a href="https://solocasaschile.com" style="color: #0b9e86; text-decoration: none; font-weight: bold;">SolocasasChile.com</a>
          </div>
        </div>
      `,
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

  } catch (err: any) {
    console.error('[sendBulkEmail] Error:', err)
    return { error: err.message || "Error al enviar los correos masivos." }
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
}) {
  const supabase = await createClient();

  // 1. Insertar en la base de datos
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

  // 2. Enviar correos via Resend
  try {
    // A. Email de confirmación al USUARIO
    await resend.emails.send({
      from: 'SoloCasasChile <contacto@solocasaschile.com>',
      to: [data.email_cliente],
      subject: `Hemos recibido tu solicitud de cotización - ${data.modelo_nombre} 🏠`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
          <div style="background: #0b9e86; padding: 24px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">¡Hola ${data.nombre_cliente}!</h1>
          </div>
          <div style="padding: 40px 30px; line-height: 1.6; color: #334155; font-size: 15px;">
            <p>Gracias por tu interés en el modelo <strong>${data.modelo_nombre}</strong> de <strong>${data.constructora_nombre}</strong>.</p>
            <p>Hemos recibido tu mensaje correctamente. Un ejecutivo de la constructora se pondrá en contacto contigo a la brevedad para brindarte toda la información técnica y comercial que necesites.</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; font-weight: bold; color: #0b9e86;">Resumen de tu solicitud:</p>
              <p style="margin: 5px 0;"><strong>Modelo:</strong> ${data.modelo_nombre}</p>
              <p style="margin: 5px 0;"><strong>Constructora:</strong> ${data.constructora_nombre}</p>
            </div>

            <p>Si tienes cualquier otra duda, puedes responder a este correo.</p>
            <p style="margin-top: 30px;">Atentamente,<br>El equipo de <strong>SolocasasChile.com</strong></p>
          </div>
        </div>
      `
    });

    // B. Email de notificación a la PLATAFORMA (contacto@solocasaschile.com)
    await resend.emails.send({
      from: 'Sistema SolocasasChile <leads@solocasaschile.com>',
      to: ['contacto@solocasaschile.com'],
      replyTo: data.email_cliente,
      subject: `Nuevo Lead: ${data.modelo_nombre} - ${data.nombre_cliente}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #0b9e86;">🚀 Nuevo interesado en SolocasasChile</h2>
          <hr style="border: 0; border-top: 1px solid #eee;" />
          <p><strong>Cliente:</strong> ${data.nombre_cliente}</p>
          <p><strong>Email:</strong> ${data.email_cliente}</p>
          <p><strong>Teléfono:</strong> ${data.telefono_cliente}</p>
          <p><strong>Modelo interesado:</strong> ${data.modelo_nombre}</p>
          <p><strong>Constructora:</strong> ${data.constructora_nombre}</p>
          <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p><strong>Mensaje/Detalles:</strong></p>
            <p>${data.mensaje.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `
    });

  } catch (emailError) {
    console.error('Error al enviar correos de lead:', emailError);
    // No cortamos el flujo para el usuario si falla el email, ya se insertó en la DB.
  }

  return { success: true };
}


export async function incrementModelView(modeloId: string) {
  try {
    const supabase = await createClient();
    // Llama al RPC que creamos en la migración (seguro a nivel de fila y atómico)
    await supabase.rpc('increment_visitas', { modelo_id: modeloId });
  } catch (err) {
    console.error("Error incrementing views:", err);
  }
}
