
// Mock Supabase client for development without database
export const supabase = {
  auth: {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // This is handled in the AuthContext now
      return { data: null, error: { message: 'Use AuthContext login method instead' } };
    },
    signInWithOAuth: async ({ provider, options }: { provider: string; options?: any }) => {
      // Mock OAuth - just return an error since we're using mock auth
      return { data: null, error: { message: 'OAuth not available in mock mode. Please use email/password login.' } };
    },
    signUp: async ({ email, password }: { email: string; password: string }) => {
      // This is handled in the AuthContext now
      return { data: null, error: { message: 'Use AuthContext signup method instead' } };
    },
    signOut: async () => {
      // This is handled in the AuthContext now
      return { error: null };
    },
    getUser: async () => {
      return { data: { user: null }, error: null };
    },
    getSession: async () => {
      return { data: { session: null }, error: null };
    },
    onAuthStateChange: (callback: any) => {
      // Mock auth state change listener
      return {
        data: { subscription: { unsubscribe: () => {} } }
      };
    }
  },
  functions: {
    invoke: async (functionName: string, options?: any) => {
      // Mock functions - return appropriate responses based on function name
      if (functionName === 'gemini-content') {
        return { 
          data: { 
            content: 'This is mock AI-generated content. The actual Gemini API is not available in mock mode.',
            title: 'Mock Generated Title',
            excerpt: 'Mock generated excerpt for your blog post.'
          }, 
          error: null 
        };
      }
      return { data: null, error: { message: 'Mock functions - no actual function execution' } };
    }
  },
  from: (table: string) => ({
    select: (columns?: string) => {
      const baseResponse = { data: [], error: null };
      
      return {
        ...baseResponse,
        eq: (column: string, value: any) => ({
          ...baseResponse,
          single: async () => ({ data: null, error: { message: 'Mock client - no database' } }),
          order: (column: string, options?: any) => ({
            ...baseResponse,
            limit: (count: number) => ({
              ...baseResponse,
              single: async () => ({ data: null, error: { message: 'Mock client - no database' } })
            })
          })
        }),
        order: (column: string, options?: any) => ({
          ...baseResponse,
          limit: (count: number) => ({
            ...baseResponse,
            single: async () => ({ data: null, error: { message: 'Mock client - no database' } }),
            eq: (column: string, value: any) => ({
              ...baseResponse,
              single: async () => ({ data: null, error: { message: 'Mock client - no database' } })
            })
          }),
          eq: (column: string, value: any) => ({
            ...baseResponse,
            single: async () => ({ data: null, error: { message: 'Mock client - no database' } })
          })
        }),
        limit: (count: number) => ({
          ...baseResponse,
          single: async () => ({ data: null, error: { message: 'Mock client - no database' } })
        }),
        single: async () => ({ data: null, error: { message: 'Mock client - no database' } })
      };
    },
    insert: (data: any) => ({
      select: async (columns?: string) => ({ data: null, error: { message: 'Mock client - no database' } })
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: async (columns?: string) => ({ data: null, error: { message: 'Mock client - no database' } })
      })
    }),
    delete: () => ({
      eq: async (column: string, value: any) => ({ data: null, error: { message: 'Mock client - no database' } })
    })
  })
};
