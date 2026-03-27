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
  update: () => mockSupabaseChain,
  delete: () => mockSupabaseChain,
  in: () => mockSupabaseChain,
  then: (resolve: any) => resolve({ 
    data: null, 
    error: { message: "[Modo Demo] Los datos no se persistirán hasta que conectes Supabase correctamente.", code: "demo" }, 
    count: 0 
  })
};

export const mockStorageChain: any = {
  upload: async () => ({ data: { path: 'mock-path' }, error: null }),
  getPublicUrl: () => ({ data: { publicUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000' } }),
};

export const mockSupabaseClient = {
  from: () => mockSupabaseChain,
  storage: {
    from: () => mockStorageChain
  },
  auth: {
    getUser: async () => ({ 
      data: { 
        user: { 
          id: '00000000-0000-0000-0000-000000000000', 
          email: 'demo@solocasaschile.cl',
          user_metadata: { nombre: 'Demo Admin' }
        } 
      }, 
      error: null 
    }),
    signInWithPassword: async ({ email }: any) => ({ 
        data: { 
          user: { id: '00000000-0000-0000-0000-000000000000', email }, 
          session: { access_token: 'mock-token' } 
        }, 
        error: null 
    }),
    signUp: async ({ email }: any) => ({ 
      data: { user: { id: '00000000-0000-0000-0000-000000000000', email }, session: null }, 
      error: null 
    }),
    signOut: async () => ({ error: null })
  }
};
