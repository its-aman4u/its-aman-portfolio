
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Crown, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Subscription = () => {
  const { isAuthenticated, isPremium, subscription } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (tier: string) => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    setIsLoading(true);
    try {
      // This is where we would call our Stripe checkout edge function
      // const { data, error } = await supabase.functions.invoke('create-checkout', {
      //   body: { tier }
      // });
      
      // if (error) throw error;
      // window.location.href = data.url;

      // For now, just show a toast that this would redirect to Stripe
      toast.info('This would redirect to Stripe', {
        description: 'In a real app, this would redirect to Stripe Checkout to complete your subscription.'
      });
      
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } catch (error: any) {
      console.error('Error starting checkout:', error);
      toast.error('Could not start checkout process', {
        description: error.message || 'Please try again later.'
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <Button variant="outline" asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Link>
          </Button>
          
          {!isAuthenticated && (
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Subscription Plans</h1>
            <p className="text-xl text-muted-foreground">
              Choose the plan that's right for you and get access to premium content
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Free Plan */}
            <Card className={`border ${subscription?.tier === 'free' ? 'border-primary shadow-md' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl">Free</CardTitle>
                  {subscription?.tier === 'free' && (
                    <span className="bg-primary/10 text-primary text-sm font-medium py-1 px-3 rounded-full">
                      Current Plan
                    </span>
                  )}
                </div>
                <CardDescription>Access to basic content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-6">$0<span className="text-muted-foreground text-sm font-normal">/month</span></p>
                
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Access to first two blog posts</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Comment on blog posts</span>
                  </li>
                  <li className="flex items-start text-muted-foreground">
                    <Zap className="h-5 w-5 mr-2 shrink-0" />
                    <span>No access to premium content</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" disabled>
                  Free Plan
                </Button>
              </CardFooter>
            </Card>
            
            {/* Premium Plan */}
            <Card className={`border ${subscription?.tier === 'premium' && subscription?.is_active ? 'border-primary shadow-md' : isPremium ? '' : 'border-amber-500'}`}>
              <CardHeader className="relative">
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold py-1 px-3 rounded-full uppercase">
                    Recommended
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <CardTitle className="text-2xl flex items-center">
                    Premium <Crown className="h-5 w-5 ml-2 text-amber-500" />
                  </CardTitle>
                  {subscription?.tier === 'premium' && subscription?.is_active && (
                    <span className="bg-primary/10 text-primary text-sm font-medium py-1 px-3 rounded-full">
                      Current Plan
                    </span>
                  )}
                </div>
                <CardDescription>Unlock all premium content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-6">$7.99<span className="text-muted-foreground text-sm font-normal">/month</span></p>
                
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Access to all blog posts</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Comment on all blog posts</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Access to all premium content</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>Early access to new content</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                {subscription?.tier === 'premium' && subscription?.is_active ? (
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/manage-subscription">Manage Subscription</Link>
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700" 
                    onClick={() => handleSubscribe('premium')}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      'Subscribe Now'
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
          
          <div className="bg-muted/40 rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Premium Benefits</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to Premium and get unlimited access to all blog content, including exclusive premium articles and case studies.
            </p>
            <Button asChild variant="outline">
              <Link to="/blog">Browse Blog Articles</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
