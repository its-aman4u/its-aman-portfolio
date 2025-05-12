
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Check, X, Trash2, User, MessageSquare } from 'lucide-react';
import type { BlogComment } from '@/types/blog';

const AdminComments = () => {
  const [pendingComments, setPendingComments] = useState<BlogComment[]>([]);
  const [approvedComments, setApprovedComments] = useState<BlogComment[]>([]);
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

    fetchComments();
  }, [isAuthenticated, profile, navigate]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      
      // Get pending comments
      const { data: pendingData, error: pendingError } = await supabase
        .from('comments')
        .select('*, blogs!inner(title)')
        .eq('approved', false)
        .order('created_at', { ascending: false });
      
      if (pendingError) throw pendingError;
      
      // Get approved comments
      const { data: approvedData, error: approvedError } = await supabase
        .from('comments')
        .select('*, blogs!inner(title)')
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (approvedError) throw approvedError;
      
      setPendingComments(pendingData as any[]);
      setApprovedComments(approvedData as any[]);
    } catch (error: any) {
      toast.error('Failed to fetch comments', { description: error.message });
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ approved: true })
        .eq('id', commentId);
      
      if (error) throw error;
      
      toast.success('Comment approved');
      fetchComments();
    } catch (error: any) {
      toast.error('Failed to approve comment', { description: error.message });
      console.error('Error approving comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);
      
      if (error) throw error;
      
      toast.success('Comment deleted');
      fetchComments();
    } catch (error: any) {
      toast.error('Failed to delete comment', { description: error.message });
      console.error('Error deleting comment:', error);
    }
  };

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
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingComments.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingComments.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" /> Pending Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  </div>
                ) : pendingComments.length === 0 ? (
                  <div className="text-center py-12 bg-muted/10 rounded-lg">
                    <p className="text-muted-foreground mb-2">No pending comments to moderate.</p>
                    <p className="text-sm text-muted-foreground">All comments have been processed.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pendingComments.map((comment) => (
                      <div key={comment.id} className="bg-muted/10 p-5 rounded-lg">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4" />
                              </div>
                              <h4 className="font-medium">{comment.name}</h4>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <p>{comment.email}</p>
                              <p>Posted {format(new Date(comment.created_at), 'MMM d, yyyy • h:mm a')}</p>
                              <p className="mt-1">
                                On post: <Link to={`/blog/${comment.post_id}`} className="text-primary hover:underline">{(comment as any).blogs.title}</Link>
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 text-green-600 hover:bg-green-600/10"
                              onClick={() => handleApproveComment(comment.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Separator className="my-3" />
                        <div className="mt-2">
                          <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" /> Approved Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  </div>
                ) : approvedComments.length === 0 ? (
                  <div className="text-center py-12 bg-muted/10 rounded-lg">
                    <p className="text-muted-foreground">No approved comments yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {approvedComments.map((comment) => (
                      <div key={comment.id} className="bg-muted/10 p-5 rounded-lg">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4" />
                              </div>
                              <h4 className="font-medium">{comment.name}</h4>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <p>{comment.email}</p>
                              <p>Posted {format(new Date(comment.created_at), 'MMM d, yyyy • h:mm a')}</p>
                              <p className="mt-1">
                                On post: <Link to={`/blog/${comment.post_id}`} className="text-primary hover:underline">{(comment as any).blogs.title}</Link>
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Separator className="my-3" />
                        <div className="mt-2">
                          <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminComments;
