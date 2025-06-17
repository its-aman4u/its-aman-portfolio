
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle } from 'lucide-react';

const AdminComments = () => {
  const [loading, setLoading] = useState(true);
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
      navigate('/blog');
      return;
    }

    // Mock loading
    setTimeout(() => setLoading(false), 1000);
  }, [isAuthenticated, profile, navigate]);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Comment Moderation</h1>
        <Button variant="outline" asChild>
          <Link to="/admin/blog">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog Admin
          </Link>
        </Button>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <Alert className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Mock Mode</AlertTitle>
            <AlertDescription>
              Comment moderation is not available in mock mode. In a real application, this would show pending and approved comments from your blog posts.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default AdminComments;
