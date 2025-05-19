
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { Lock, AlertCircle, Info, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const { login, isAuthenticated, profile } = useAuth();
  const [email, setEmail] = useState('admin@portfolio.com');
  const [password, setPassword] = useState('adminpassword123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // If the user is already authenticated and is an admin, redirect to admin blog page
  useEffect(() => {
    if (isAuthenticated && profile?.is_admin) {
      navigate('/admin/blog');
    }
  }, [isAuthenticated, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Attempting admin login with:', { email });
      const success = await login(email, password);
      console.log('Login attempt result:', success);
      
      // Check if the user exists and get their profile
      const { data: userData, error: userError } = await supabase.auth.getUser();
      console.log('Current authenticated user:', userData?.user || 'No user');
      
      if (!success || !userData?.user) {
        setError('Invalid credentials. Please try again.');
        toast.error('Login failed', { description: 'Invalid credentials. Please try again.' });
        return;
      }
      
      // Fetch the profile to check admin status
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userData.user.id)
        .single();
      
      console.log('Profile after login:', profileData);
      
      if (profileError || !profileData) {
        console.error('Error fetching profile:', profileError);
        setError('Could not verify admin status.');
        toast.error('Login error', { description: 'Could not verify admin status.' });
        return;
      }
      
      if (!profileData.is_admin) {
        setError('Your account does not have admin privileges.');
        toast.error('Access denied', { description: 'Your account does not have admin privileges.' });
        // Log the user out if they're not an admin
        await supabase.auth.signOut();
        return;
      }
      
      toast.success('Welcome back, admin!');
      navigate('/admin/blog');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
      toast.error('Login error', { description: err.message || 'An error occurred during login' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] pt-16">
      <div className="w-full max-w-md px-4">
        <Card className="shadow-lg border-muted">
          <CardHeader className="space-y-1 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input 
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  className="focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="•••••••••"
                    required
                    className="focus:border-primary pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={toggleShowPassword}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    Login to Admin
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          
          <Separator />
          
          <CardFooter className="flex-col pt-6">
            <Alert className="mb-4 bg-muted/40 border-muted">
              <Info className="h-4 w-4" />
              <AlertTitle>Demo Credentials</AlertTitle>
              <AlertDescription className="text-xs">
                <div>Email: admin@portfolio.com</div>
                <div>Password: adminpassword123</div>
              </AlertDescription>
            </Alert>
            
            <div className="text-center w-full">
              <Link to="/auth" className="text-sm text-primary hover:underline">
                Regular user? Login here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
