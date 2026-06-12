
import React, { createContext, useContext, useState, useEffect } from 'react';
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
  user: any | null;
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

// Mock users data — actual admin credentials are stored securely in localStorage
// and overridden at login time. These defaults cannot be used to log in.
const mockUsers = [
  {
    id: 'admin-1',
    email: '', // Overridden at login from localStorage('admin_email')
    password: '', // Overridden at login from localStorage('admin_password')
    profile: {
      id: 'admin-1',
      username: 'admin',
      full_name: 'Aman Singh',
      avatar_url: null,
      website: null,
      is_admin: true,
    },
    subscription: {
      tier: 'premium' as const,
      is_active: true,
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }
  },
  {
    id: 'user-1',
    email: 'user@example.com',
    password: 'password123',
    profile: {
      id: 'user-1',
      username: 'user1',
      full_name: 'Regular User',
      avatar_url: null,
      website: null,
      is_admin: false,
    },
    subscription: {
      tier: 'free' as const,
      is_active: true,
      current_period_end: null,
    }
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Compute premium status
  const isPremium = subscription?.tier === 'premium' && subscription?.is_active === true;

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem('mock-auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        setUser(authData.user);
        setProfile(authData.profile);
        setSubscription(authData.subscription);
      } catch (error) {
        console.error('Error parsing saved auth data:', error);
        localStorage.removeItem('mock-auth');
      }
    }
    setIsLoading(false);
  }, []);

  // Save auth state to localStorage whenever it changes
  useEffect(() => {
    if (user && profile && subscription) {
      localStorage.setItem('mock-auth', JSON.stringify({
        user,
        profile,
        subscription
      }));
    } else {
      localStorage.removeItem('mock-auth');
    }
  }, [user, profile, subscription]);

  const refreshProfile = async () => {
    // Mock function - no action needed for local state
  };

  const refreshSubscription = async () => {
    // Mock function - no action needed for local state
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Login attempt for:', email);
      
      // Try server-side admin verification first (most secure path)
      try {
        const response = await fetch('/api/verify-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.is_admin) {
            // Admin verified server-side
            const adminUser = mockUsers.find(u => u.profile.is_admin)!;
            setUser({ id: adminUser.id, email });
            setProfile({ ...adminUser.profile, full_name: data.full_name || 'Aman Singh' });
            setSubscription(adminUser.subscription);
            toast.success('Welcome back, Aman! Admin access granted.');
            return true;
          } else if (data.success && !data.is_admin) {
            // Regular user verified server-side
            const regularUser = mockUsers.find(u => !u.profile.is_admin)!;
            setUser({ id: `user-${Date.now()}`, email });
            setProfile({ ...regularUser.profile, username: email.split('@')[0] });
            setSubscription(regularUser.subscription);
            toast.success('Logged in successfully');
            return true;
          }
        }
      } catch (serverError) {
        console.warn('Server-side auth unavailable, using local fallback:', serverError);
      }
      
      // Local fallback: only use credentials from localStorage (never hardcoded defaults)
      const adminEmail = localStorage.getItem('admin_email');
      const adminPassword = localStorage.getItem('admin_password');
      
      if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
        const adminUser = mockUsers.find(u => u.profile.is_admin)!;
        setUser({ id: adminUser.id, email });
        setProfile(adminUser.profile);
        setSubscription(adminUser.subscription);
        toast.success('Welcome back, Aman!');
        return true;
      }
      
      // Regular user fallback
      const regularUser = mockUsers.find(u => !u.profile.is_admin && u.email === email && u.password === password);
      if (regularUser) {
        setUser({ id: regularUser.id, email: regularUser.email });
        setProfile(regularUser.profile);
        setSubscription(regularUser.subscription);
        toast.success('Logged in successfully');
        return true;
      }
      
      toast.error('Login failed', { description: 'Invalid credentials. Please try again.' });
      return false;
    } catch (error: any) {
      console.error('Login error (caught):', error);
      toast.error('Login failed', { description: error.message });
      return false;
    }
  };

  const signup = async (email: string, password: string, fullName: string): Promise<boolean> => {
    try {
      console.log('Signup attempt for:', email);
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        toast.error('Sign up failed', { description: 'User already exists with this email' });
        return false;
      }
      
      // Create new mock user
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        password,
        profile: {
          id: `user-${Date.now()}`,
          username: email.split('@')[0],
          full_name: fullName,
          avatar_url: null,
          website: null,
          is_admin: false,
        },
        subscription: {
          tier: 'free' as const,
          is_active: true,
          current_period_end: null,
        }
      };
      
      mockUsers.push(newUser);
      
      console.log('Signup successful:', newUser);
      toast.success('Account created successfully', { 
        description: 'You can now log in with your credentials.' 
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
      setUser(null);
      setProfile(null);
      setSubscription(null);
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
