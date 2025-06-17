
// Mock Supabase client for development without database
export const supabase = {
  auth: {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // This is handled in the AuthContext now
      return { data: null, error: { message: 'Use AuthContext login method instead' } };
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
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: { message: 'Mock client - no database' } })
      }),
      order: () => ({
        limit: () => ({
          single: async () => ({ data: null, error: { message: 'Mock client - no database' } })
        })
      })
    }),
    insert: () => ({
      select: async () => ({ data: null, error: { message: 'Mock client - no database' } })
    }),
    update: () => ({
      eq: () => ({
        select: async () => ({ data: null, error: { message: 'Mock client - no database' } })
      })
    }),
    delete: () => ({
      eq: async () => ({ data: null, error: { message: 'Mock client - no database' } })
    })
  })
};
