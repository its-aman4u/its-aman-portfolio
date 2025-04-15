
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CalendarIcon, ArrowLeft, MessageSquare, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  cover_image: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  premium: boolean;
  price: number;
  author: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  name: string;
  email: string;
  content: string;
  created_at: string;
  approved: boolean;
}

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user, isPremium } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    async function fetchBlogPost() {
      try {
        setLoading(true);
        
        // Fetch the blog post with author details
        const { data: postData, error: postError } = await supabase
          .from('blogs')
          .select(`
            *,
            author:profiles(id, username, full_name, avatar_url)
          `)
          .eq('id', id)
          .single();

        if (postError) {
          console.error('Error fetching blog post:', postError);
          setLoading(false);
          return;
        }

        // Check if the user has access to premium content
        if (postData.premium && !isPremium) {
          setAccessDenied(true);
          setPost(postData);
          setLoading(false);
          return;
        }

        setPost(postData);
        
        // Fetch approved comments for this post
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .eq('post_id', id)
          .eq('approved', true)
          .order('created_at', { ascending: false });

        if (commentsError) {
          console.error('Error fetching comments:', commentsError);
        } else {
          setComments(commentsData || []);
        }
      } catch (error) {
        console.error('Error in fetchBlogPost:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPost();
  }, [id, isPremium]);

  useEffect(() => {
    // Pre-fill comment form with user details if authenticated
    if (isAuthenticated && user) {
      setCommentForm(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        email: user.email || ''
      }));
    }
  }, [isAuthenticated, user]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCommentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !isAuthenticated || !user) {
      toast.error('You must be logged in to comment');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: id,
          user_id: user.id,
          name: commentForm.name,
          email: commentForm.email,
          content: commentForm.content,
          approved: false
        });

      if (error) {
        throw error;
      }
      
      toast.success('Comment submitted successfully!', {
        description: 'Your comment will be visible after approval.'
      });
      
      setCommentForm(prev => ({
        ...prev,
        content: ''
      }));
    } catch (error: any) {
      console.error('Error submitting comment:', error);
      toast.error('Failed to submit comment', {
        description: error.message || 'There was an error submitting your comment. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubscription = () => {
    navigate('/subscription');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex justify-center items-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <p className="mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <Button variant="outline" asChild className="mb-8">
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Link>
            </Button>
            
            {post.cover_image && (
              <div className="w-full h-[300px] mb-8 rounded-xl overflow-hidden blur-sm relative">
                <img 
                  src={post.cover_image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Lock className="h-16 w-16 text-amber-400" />
                </div>
              </div>
            )}
            
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
              <Lock className="mr-2 h-6 w-6 text-amber-500" />
              {post.title}
            </h1>
            
            <div className="my-8 p-8 border-2 border-amber-500 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Premium Content</h2>
              <p className="mb-6">This is premium content only available to subscribers.</p>
              
              {isAuthenticated ? (
                <Button onClick={handleSubscription} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
                  Upgrade to Premium
                </Button>
              ) : (
                <div className="space-y-4">
                  <p>Please sign in to access premium content.</p>
                  <Button asChild>
                    <Link to="/auth">Sign In</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <article className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <Button variant="outline" asChild>
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Link>
            </Button>
            
            <div className="flex space-x-2">
              <Button variant="outline" asChild>
                <Link to="/">Home</Link>
              </Button>
              {!isAuthenticated ? (
                <Button asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
              ) : (
                <Button variant="outline" asChild>
                  <Link to="/admin/blog">Admin</Link>
                </Button>
              )}
            </div>
          </div>
          
          {post.premium && (
            <div className="w-full max-w-4xl mx-auto mb-8 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-amber-500 mr-2" />
                <span className="font-medium">Premium Content</span>
              </div>
              {isPremium && (
                <span className="text-sm bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-1 rounded">
                  Premium Subscriber
                </span>
              )}
            </div>
          )}
          
          {post.cover_image && (
            <div className="w-full h-[400px] mb-8 rounded-xl overflow-hidden shadow-md">
              <img 
                src={post.cover_image} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              <div className="flex items-center justify-between text-muted-foreground">
                <div className="flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  <span>{format(new Date(post.created_at), 'MMMM d, yyyy')}</span>
                </div>
                {post.author?.full_name && (
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    <span>{post.author.full_name}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="prose max-w-none prose-lg dark:prose-invert mb-16 bg-card p-8 rounded-lg shadow-sm" 
                 dangerouslySetInnerHTML={{ __html: post.content }}></div>
            
            <div className="border-t pt-12 mt-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" /> 
                Comments ({comments.length})
              </h2>
              
              {comments.length === 0 ? (
                <div className="bg-muted/50 rounded-lg p-6 text-center mb-8">
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="space-y-6 mb-12">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-card p-6 rounded-lg shadow-sm transition-shadow hover:shadow-md">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" /> 
                          {comment.name}
                        </h4>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(comment.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="bg-card p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" /> 
                  Leave a Comment
                </h3>
                
                {!isAuthenticated ? (
                  <div className="text-center py-6">
                    <p className="mb-4">Please sign in to leave a comment</p>
                    <Button asChild>
                      <Link to="/auth">Sign In</Link>
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleCommentSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Your Name
                        </label>
                        <Input 
                          id="name"
                          name="name"
                          value={commentForm.name}
                          onChange={handleCommentChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email Address
                        </label>
                        <Input 
                          id="email"
                          name="email"
                          type="email"
                          value={commentForm.email}
                          onChange={handleCommentChange}
                          readOnly
                          className="bg-muted/50"
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="content" className="block text-sm font-medium mb-2">
                          Comment
                        </label>
                        <Textarea 
                          id="content"
                          name="content"
                          value={commentForm.content}
                          onChange={handleCommentChange}
                          placeholder="Share your thoughts..."
                          rows={4}
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                          {isSubmitting ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                              Submitting...
                            </>
                          ) : (
                            'Submit Comment'
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
