
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

// Mock users data
const mockUsers = [
  {
    id: 'admin-1',
    email: 'admin@portfolio.com',
    password: 'adminpassword123',
    profile: {
      id: 'admin-1',
      username: 'admin',
      full_name: 'Admin User',
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
      
      const mockUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!mockUser) {
        toast.error('Login failed', { description: 'Invalid credentials. Please try again.' });
        return false;
      }
      
      setUser({ id: mockUser.id, email: mockUser.email });
      setProfile(mockUser.profile);
      setSubscription(mockUser.subscription);
      
      console.log('Login successful:', mockUser);
      toast.success('Logged in successfully');
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
