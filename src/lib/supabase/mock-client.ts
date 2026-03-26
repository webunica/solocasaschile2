export const mockSupabaseChain: any = {
  select: () => mockSupabaseChain,
  eq: () => mockSupabaseChain,
  order: () => mockSupabaseChain,
  limit: () => mockSupabaseChain,
  single: () => mockSupabaseChain,
  maybeSingle: () => mockSupabaseChain,
  contains: () => mockSupabaseChain,
  gte: () => mockSupabaseChain,
  lte: () => mockSupabaseChain,
  insert: () => mockSupabaseChain,
  delete: () => mockSupabaseChain,
  in: () => mockSupabaseChain,
  then: (resolve: any) => resolve({ data: null, error: null, count: 0 })
};

export const mockSupabaseClient = {
  from: () => mockSupabaseChain,
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async () => ({ 
      data: { user: null, session: null }, 
      error: { message: "Configuración de Supabase incompleta (Credenciales faltantes)." } 
    }),
    signUp: async () => ({ 
      data: { user: null, session: null }, 
      error: { message: "Configuración de Supabase incompleta (Credenciales faltantes)." } 
    }),
    signOut: async () => ({ error: null })
  }
};
