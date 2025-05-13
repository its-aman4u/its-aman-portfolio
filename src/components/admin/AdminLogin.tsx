
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { Lock, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminLogin = () => {
  const { login, isAuthenticated, profile } = useAuth();
  const [email, setEmail] = useState('admin@portfolio.com');
  const [password, setPassword] = useState('adminpassword123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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
      console.log('Attempting admin login with:', { email, password });
      const success = await login(email, password);
      console.log('Login success:', success, 'Profile:', profile);
      
      if (!success) {
        setError('Invalid credentials. Please try again.');
        toast.error('Login failed', { description: 'Invalid credentials. Please try again.' });
      } else if (!profile?.is_admin) {
        setError('Your account does not have admin privileges.');
        toast.error('Access denied', { description: 'Your account does not have admin privileges.' });
      } else {
        toast.success('Welcome back, admin!');
        navigate('/admin/blog');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
      toast.error('Login error', { description: err.message || 'An error occurred during login' });
    } finally {
      setIsLoading(false);
    }
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
                <Input 
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••••"
                  required
                  className="focus:border-primary"
                />
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
                  'Login to Admin'
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
