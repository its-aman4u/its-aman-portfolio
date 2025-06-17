
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const AdminContactSubmissions = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, profile } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    if (profile && !profile.is_admin) {
      toast.error('Access denied', { 
        description: 'Only administrators can access this page' 
      });
      navigate('/');
      return;
    }

    // Mock loading
    setTimeout(() => setIsLoading(false), 1000);
  }, [isAuthenticated, profile, navigate]);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Contact Submissions</h1>
        <Button variant="outline" asChild>
          <Link to="/admin/blog">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      ) : (
        <Alert className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Mock Mode</AlertTitle>
          <AlertDescription>
            Contact form submissions are not available in mock mode. In a real application, messages from your contact form would appear here for you to review and respond to.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AdminContactSubmissions;
