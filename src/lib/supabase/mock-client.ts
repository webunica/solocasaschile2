type MockSupabaseResult = {
  data: null;
  error: { message: string; code: string } | null;
  count: number;
};

type MockResolver = (result: MockSupabaseResult) => unknown;

type MockSupabaseChain = {
  select: () => MockSupabaseChain;
  eq: () => MockSupabaseChain;
  order: () => MockSupabaseChain;
  limit: () => MockSupabaseChain;
  single: () => MockSupabaseChain;
  maybeSingle: () => MockSupabaseChain;
  not: () => MockSupabaseChain;
  contains: () => MockSupabaseChain;
  gte: () => MockSupabaseChain;
  lte: () => MockSupabaseChain;
  insert: () => MockSupabaseChain;
  update: () => MockSupabaseChain;
  delete: () => MockSupabaseChain;
  in: () => MockSupabaseChain;
  then: (resolve: MockResolver) => unknown;
};

type AuthPayload = { email: string };

export const mockSupabaseChain: MockSupabaseChain = {
  select: () => mockSupabaseChain,
  eq: () => mockSupabaseChain,
  order: () => mockSupabaseChain,
  limit: () => mockSupabaseChain,
  single: () => mockSupabaseChain,
  maybeSingle: () => mockSupabaseChain,
  not: () => mockSupabaseChain,
  contains: () => mockSupabaseChain,
  gte: () => mockSupabaseChain,
  lte: () => mockSupabaseChain,
  insert: () => mockSupabaseChain,
  update: () => mockSupabaseChain,
  delete: () => mockSupabaseChain,
  in: () => mockSupabaseChain,
  then: (resolve: MockResolver) =>
    resolve({
      data: null,
      error: null,
      count: 0,
    }),
};

export const mockStorageChain = {
  upload: async () => ({ data: { path: "mock-path" }, error: null }),
  getPublicUrl: () => ({
    data: {
      publicUrl:
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1000",
    },
  }),
};

export const mockSupabaseClient = {
  from: () => mockSupabaseChain,
  storage: {
    from: () => mockStorageChain,
  },
  auth: {
    getUser: async () => ({
      data: {
        user: {
          id: "00000000-0000-0000-0000-000000000000",
          email: "demo@solocasaschile.com",
          user_metadata: { nombre: "Demo Admin" },
        },
      },
      error: null,
    }),
    signInWithPassword: async ({ email }: AuthPayload) => ({
      data: {
        user: { id: "00000000-0000-0000-0000-000000000000", email },
        session: { access_token: "mock-token" },
      },
      error: null,
    }),
    signUp: async ({ email }: AuthPayload) => ({
      data: {
        user: { id: "00000000-0000-0000-0000-000000000000", email },
        session: null,
      },
      error: null,
    }),
    signOut: async () => ({ error: null }),
  },
};
