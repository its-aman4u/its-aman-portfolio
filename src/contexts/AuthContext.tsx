
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

type UserProfile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  is_admin: boolean;
};

type Subscription = {
  tier: 'free' | 'premium';
  is_active: boolean;
  current_period_end: string | null;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  profile: UserProfile | null;
  subscription: Subscription | null;
  isLoading: boolean;
  isPremium: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, fullName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Compute premium status
  const isPremium = subscription?.tier === 'premium' && subscription?.is_active === true;

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user ID:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      console.log('Profile fetched:', data);
      return data as UserProfile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  // Fetch user subscription from database
  const fetchSubscription = async (userId: string) => {
    try {
      console.log('Fetching subscription for user ID:', userId);
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching subscription:', error);
        return {
          tier: 'free' as const,
          is_active: true,
          current_period_end: null
        };
      }

      console.log('Subscription fetched:', data);
      return {
        tier: data.tier as 'free' | 'premium',
        is_active: data.is_active,
        current_period_end: data.current_period_end
      };
    } catch (error) {
      console.error('Error in fetchSubscription:', error);
      return {
        tier: 'free' as const,
        is_active: true,
        current_period_end: null
      };
    }
  };

  // Function to refresh profile data
  const refreshProfile = async () => {
    if (!user) return;
    
    const profileData = await fetchProfile(user.id);
    if (profileData) {
      setProfile(profileData);
    }
  };

  // Function to refresh subscription data
  const refreshSubscription = async () => {
    if (!user) return;
    
    const subscriptionData = await fetchSubscription(user.id);
    if (subscriptionData) {
      setSubscription(subscriptionData);
    }
  };

  // Initialize auth state
  useEffect(() => {
    setIsLoading(true);
    console.log('Setting up auth state listener');

    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          // Don't call Supabase inside the callback directly
          // Use setTimeout to defer these calls
          setTimeout(async () => {
            const [profileData, subscriptionData] = await Promise.all([
              fetchProfile(currentSession.user.id),
              fetchSubscription(currentSession.user.id)
            ]);
            
            setProfile(profileData);
            setSubscription(subscriptionData);
            setIsLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setSubscription(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Existing session check:', currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        Promise.all([
          fetchProfile(currentSession.user.id),
          fetchSubscription(currentSession.user.id)
        ]).then(([profileData, subscriptionData]) => {
          setProfile(profileData);
          setSubscription(subscriptionData);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Login attempt for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Login error:', error);
        toast.error('Login failed', { description: error.message });
        return false;
      }
      
      console.log('Login successful:', data);
      toast.success('Logged in successfully');
      
      // Immediately fetch profile to check if admin
      if (data.user) {
        const profileData = await fetchProfile(data.user.id);
        setProfile(profileData);
      }
      
      return true;
    } catch (error: any) {
      console.error('Login error (caught):', error);
      toast.error('Login failed', { description: error.message });
      return false;
    }
  };

  const signup = async (email: string, password: string, fullName: string): Promise<boolean> => {
    try {
      console.log('Signup attempt for:', email);
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        toast.error('Sign up failed', { description: error.message });
        return false;
      }
      
      console.log('Signup successful:', data);
      toast.success('Account created successfully', { 
        description: 'Please check your email to confirm your account.' 
      });
      return true;
    } catch (error: any) {
      console.error('Signup error (caught):', error);
      toast.error('Sign up failed', { description: error.message });
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Logout failed', { description: error.message });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated: !!user, 
        user, 
        profile, 
        subscription, 
        isLoading, 
        isPremium,
        login, 
        signup, 
        logout, 
        refreshProfile,
        refreshSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
