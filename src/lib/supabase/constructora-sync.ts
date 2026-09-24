import { createAdminClient } from './admin';

export interface SynchronizedConstructora {
  id: string;
  nombre: string;
  slug: string;
  email: string | null;
  telefono: string | null;
  rut: string | null;
  razon_social?: string | null;
  direccion?: string | null;
  sitio_web?: string | null;
  descripcion?: string | null;
  logo_url?: string | null;
  image_url?: string | null;
  video_url?: string | null;
  especialidad_principal?: string | null;
  anio_inicio?: number | null;
  regiones?: string[] | null;
  plan?: string | null;
  plan_status?: string | null;
  role?: string | null;
  verificada?: boolean;
  score_confianza?: number;
  testimonios?: any[];
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string[] | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Obtiene o consolida unívocamente el registro centralizado de la constructora asociada al usuario.
 * Garantiza que:
 * 1. Cada usuario autenticado tenga exactamente 1 registro en public.constructoras con id = user.id.
 * 2. Si existía un registro previo huérfano con el mismo email (por invitación o carga previa),
 *    sus modelos, leads y obras se reasignen a user.id y se eliminen duplicados.
 * 3. Si no existía ficha, se crea con los datos de registro / invitación / metadata.
 */
export async function getOrCreateSynchronizedConstructora(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, any> | null;
}): Promise<SynchronizedConstructora | null> {
  const admin = createAdminClient();
  const email = user.email?.toLowerCase().trim();

  // 1. Buscar primero por user.id
  let { data: byId } = await admin
    .from('constructoras')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  // 2. Si no se encontró por ID, buscar si existe un registro huérfano con el mismo correo
  if (!byId && email) {
    const { data: byEmail } = await admin
      .from('constructoras')
      .select('*')
      .ilike('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (byEmail) {
      console.log(`[ConstructoraSync] Migrando y consolidando constructora ${byEmail.id} a user ${user.id} (${email})`);

      // Reasignar referencias foráneas a user.id
      await Promise.allSettled([
        admin.from('modelos').update({ constructora_id: user.id }).eq('constructora_id', byEmail.id),
        admin.from('leads').update({ constructora_id: user.id }).eq('constructora_id', byEmail.id),
        admin.from('obras').update({ constructora_id: user.id }).eq('constructora_id', byEmail.id),
        admin.from('obra_stage_templates').update({ constructora_id: user.id }).eq('constructora_id', byEmail.id),
        admin.from('constructoras_comms').update({ constructora_id: user.id }).eq('constructora_id', byEmail.id),
        admin.from('constructora_sellos').update({ constructora_id: user.id }).eq('constructora_id', byEmail.id),
      ]);

      // Eliminar el registro huérfano previo para evitar colisión de unique slug/email
      if (byEmail.id !== user.id) {
        await admin.from('constructoras').delete().eq('id', byEmail.id);
      }

      const metaPlan = (user.user_metadata?.plan as string) || (byEmail.plan === 'gratis' ? 'starter' : byEmail.plan) || 'starter';
      const metaName = (user.user_metadata?.nombre as string) || byEmail.nombre || email.split('@')[0];

      const { data: consolidated, error: consErr } = await admin
        .from('constructoras')
        .upsert([{
          ...byEmail,
          id: user.id,
          nombre: metaName,
          email,
          plan: metaPlan,
          plan_status: byEmail.plan_status || 'active',
          updated_at: new Date().toISOString(),
        }], { onConflict: 'id' })
        .select()
        .single();

      if (!consErr && consolidated) {
        byId = consolidated as SynchronizedConstructora;
      }
    }
  }

  // 3. Si aún no existe, revisar invitaciones y crear la ficha inicial oficial
  if (!byId && email) {
    const { data: inv } = await admin
      .from('constructora_invitations')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    const companyName = (user.user_metadata?.nombre as string) || inv?.empresa_nombre || email.split('@')[0] || 'Mi Constructora';
    const baseSlug = companyName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    const slug = `${baseSlug}-${user.id.slice(0, 6)}`;
    const plan = (user.user_metadata?.plan as string) || 'starter';

    const newRecord = {
      id: user.id,
      nombre: companyName,
      slug,
      email,
      telefono: inv?.contacto_nombre || null,
      region: inv?.region || null,
      regiones: inv?.region ? [inv.region] : [],
      plan,
      plan_status: 'active',
      verificada: false,
      score_confianza: 50,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: created, error: crtErr } = await admin
      .from('constructoras')
      .upsert([newRecord], { onConflict: 'id' })
      .select()
      .single();

    if (!crtErr && created) {
      byId = created as SynchronizedConstructora;
    }
  }

  // 4. Si el registro tiene plan 'gratis' pero el usuario tiene metadata 'starter', corregirlo
  if (byId && user.user_metadata?.plan === 'starter' && byId.plan === 'gratis') {
    await admin.from('constructoras').update({ plan: 'starter' }).eq('id', user.id);
    byId.plan = 'starter';
  }

  // 5. Limpiar cualquier duplicado adicional que haya quedado con el mismo email
  if (byId && email) {
    const { data: dupes } = await admin
      .from('constructoras')
      .select('id')
      .ilike('email', email)
      .neq('id', user.id);

    if (dupes && dupes.length > 0) {
      for (const d of dupes) {
        await Promise.allSettled([
          admin.from('modelos').update({ constructora_id: user.id }).eq('constructora_id', d.id),
          admin.from('leads').update({ constructora_id: user.id }).eq('constructora_id', d.id),
          admin.from('obras').update({ constructora_id: user.id }).eq('constructora_id', d.id),
        ]);
        await admin.from('constructoras').delete().eq('id', d.id);
      }
    }
  }

  return byId as SynchronizedConstructora | null;
}
