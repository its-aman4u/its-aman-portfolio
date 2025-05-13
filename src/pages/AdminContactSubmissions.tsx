
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Inbox, ArrowLeft, Loader2, Mail, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read';
  created_at: string;
};

const AdminContactSubmissions = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
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

    fetchSubmissions();
  }, [isAuthenticated, profile, navigate]);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setSubmissions(data as ContactSubmission[]);
    } catch (error: any) {
      console.error('Error fetching contact submissions:', error);
      toast.error('Failed to load contact submissions', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: 'read' })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setSubmissions(prev => 
        prev.map(submission => 
          submission.id === id 
            ? { ...submission, status: 'read' } 
            : submission
        )
      );
      
      toast.success('Marked as read');
    } catch (error: any) {
      console.error('Error updating submission status:', error);
      toast.error('Failed to update status', {
        description: error.message
      });
    }
  };

  // Filter submissions by status
  const unreadSubmissions = submissions.filter(s => s.status === 'unread');
  const readSubmissions = submissions.filter(s => s.status === 'read');

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
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : submissions.length === 0 ? (
        <Alert className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No submissions yet</AlertTitle>
          <AlertDescription>
            When visitors send messages through the contact form, they will appear here.
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="unread" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="unread" className="relative">
              Unread
              {unreadSubmissions.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadSubmissions.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="read">Read</TabsTrigger>
          </TabsList>
          
          <TabsContent value="unread">
            {unreadSubmissions.length === 0 ? (
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertTitle>No unread messages</AlertTitle>
                <AlertDescription>
                  You've read all your messages. Check the "Read" tab to see previous messages.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-6">
                {unreadSubmissions.map((submission) => (
                  <Card key={submission.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/30">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Inbox className="h-5 w-5 text-primary" />
                            {submission.subject}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            From: {submission.name} ({submission.email})
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Received on {format(new Date(submission.created_at), 'MMM d, yyyy • h:mm a')}
                          </p>
                        </div>
                        <Badge variant={submission.status === 'unread' ? 'default' : 'outline'}>
                          {submission.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="whitespace-pre-wrap">{submission.message}</p>
                      <div className="mt-6 flex justify-between items-center">
                        <Button 
                          variant="outline" 
                          onClick={() => window.open(`mailto:${submission.email}?subject=Re: ${submission.subject}`)}
                        >
                          Reply via Email
                        </Button>
                        <Button 
                          variant="secondary"
                          onClick={() => markAsRead(submission.id)}
                        >
                          Mark as Read
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="read">
            {readSubmissions.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No read messages</AlertTitle>
                <AlertDescription>
                  You haven't marked any messages as read yet.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-6">
                {readSubmissions.map((submission) => (
                  <Card key={submission.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/30">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            {submission.subject}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            From: {submission.name} ({submission.email})
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Received on {format(new Date(submission.created_at), 'MMM d, yyyy • h:mm a')}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {submission.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="whitespace-pre-wrap">{submission.message}</p>
                      <div className="mt-6">
                        <Button 
                          variant="outline" 
                          onClick={() => window.open(`mailto:${submission.email}?subject=Re: ${submission.subject}`)}
                        >
                          Reply via Email
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AdminContactSubmissions;
