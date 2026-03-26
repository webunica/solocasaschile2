export const mockSupabaseChain: any = {
  select: () => mockSupabaseChain,
  eq: () => mockSupabaseChain,
  order: () => mockSupabaseChain,
  limit: () => mockSupabaseChain,
  single: () => mockSupabaseChain,
  contains: () => mockSupabaseChain,
  gte: () => mockSupabaseChain,
  lte: () => mockSupabaseChain,
  insert: () => mockSupabaseChain,
  in: () => mockSupabaseChain,
  then: (resolve: any) => resolve({ data: [], error: null, count: 0 })
};

export const mockSupabaseClient = {
  from: () => mockSupabaseChain
};
