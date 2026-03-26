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
    signInWithPassword: async ({ email }: any) => {
      console.log("Mock Login Attempt for:", email);
      return { 
        data: { 
          user: { id: '00000000-0000-0000-0000-000000000000', email }, 
          session: { access_token: 'mock-token', user: { id: '00000000-0000-0000-0000-000000000000' } } 
        }, 
        error: null 
      };
    },
    signUp: async ({ email }: any) => ({ 
      data: { user: { id: '00000000-0000-0000-0000-000000000000', email }, session: null }, 
      error: null 
    }),
    signOut: async () => ({ error: null })
  }
};
