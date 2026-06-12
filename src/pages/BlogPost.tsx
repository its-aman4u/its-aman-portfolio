import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogComment, mockBlogPosts } from '@/types/blog';
import { toast } from 'sonner';
import { CalendarIcon, ArrowLeft, Clock, User, Lock, MessageSquare, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

// Import the plugins
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
// Import types from unified
import type { PluggableList } from 'unified';

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFreeBlog, setIsFreeBlog] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { isPremium, profile, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        // Get the current blog post
        const { data: blogData, error: blogError } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single();

        if (blogError) {
          console.warn("Database fetch error, trying local mockBlogPosts:", blogError);
          const mockPost = mockBlogPosts.find(b => b.id === id);
          if (mockPost) {
            setBlog(mockPost);
            setIsFreeBlog(!mockPost.premium);
          } else {
            throw new Error("Post not found in database or local mock database");
          }
        } else {
          setBlog(blogData as BlogPost);
          
          // First two blog posts are always free, rest require premium subscription unless marked free
          const { data: allBlogs, error: allBlogsError } = await supabase
            .from('blogs')
            .select('id, premium')
            .eq('published', true)
            .order('created_at', { ascending: false });
            
          if (!allBlogsError && allBlogs.length > 0) {
            // First two posts are always free
            if (allBlogs[0].id === id || allBlogs[1]?.id === id) {
              setIsFreeBlog(true);
            } else {
              // Check if this is a premium post
              const currentBlog = allBlogs.find(b => b.id === id);
              if (currentBlog && !currentBlog.premium) {
                setIsFreeBlog(true);
              }
            }
          }
        }

        // Fetch comments for this post
        fetchComments();
      } catch (error) {
        toast.error('Failed to fetch blog post', {
          description: error instanceof Error ? error.message : 'Unknown error'
        });
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlogPost();
  }, [id]);

  // Set user information if authenticated
  useEffect(() => {
    if (isAuthenticated && profile) {
      setCommentName(profile.full_name || '');
      setCommentEmail(user?.email || '');
    }
  }, [isAuthenticated, profile, user]);

  const fetchComments = async () => {
    if (!id) return;
    
    try {
      setCommentsLoading(true);
      // Use mock comments since we're in mock mode
      setComments([]);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!id || !commentContent) return;

    // Validation
    if (!isAuthenticated) {
      if (!commentName.trim() || !commentEmail.trim()) {
        toast.error('Please provide your name and email');
        return;
      }
    }

    try {
      setSubmitting(true);
      // Mock comment submission
      toast.success('Comment submission is not available in mock mode');
      setCommentContent('');
    } catch (error) {
      toast.error('Failed to submit comment', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      // Mock comment deletion
      toast.success('Comment deletion is not available in mock mode');
    } catch (error) {
      toast.error('Failed to delete comment', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Blog post not found.</h2>
          <p className="text-muted-foreground mb-6">The post you're looking for might have been removed or doesn't exist.</p>
        </div>
        <Button asChild>
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
          </Link>
        </Button>
      </div>
    );
  }

  const needsSubscription = !isFreeBlog && !isPremium && !profile?.is_admin && blog.premium;

  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = blog.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="container mx-auto mt-12 px-4 md:px-0">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="outline" asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
            </Link>
          </Button>
        </div>

        <article className="bg-card shadow-sm rounded-xl overflow-hidden">
          {blog.cover_image && (
            <div className="w-full h-[300px] md:h-[400px] overflow-hidden">
              <img
                src={blog.cover_image}
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80";
                }}
              />
            </div>
          )}
          
          <div className="p-6 md:p-10">
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="h-4 w-4" />
                  <time dateTime={blog.created_at}>
                    {format(new Date(blog.created_at), 'MMMM dd, yyyy')}
                  </time>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{blog.title}</h1>
              {blog.excerpt && (
                <p className="text-lg text-muted-foreground">{blog.excerpt}</p>
              )}
            </header>

            <Separator className="my-8" />
            
            {needsSubscription ? (
              <div className="py-8">
                <Card className="p-8 text-center bg-primary/5 border-primary/30">
                  <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h2 className="text-2xl font-bold mb-2">Premium Content</h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    This article is available exclusively for premium subscribers.
                    Upgrade your account to continue reading.
                  </p>
                  <div className="flex flex-col gap-4 items-center">
                    <Button asChild size="lg">
                      <Link to="/subscription">Subscribe Now</Link>
                    </Button>
                    {!isAuthenticated && (
                      <Button asChild variant="outline">
                        <Link to="/auth">Already a member? Sign in</Link>
                      </Button>
                    )}
                  </div>
                </Card>
              </div>
            ) : (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm as any]}
                  rehypePlugins={[rehypeRaw as any]}
                >
                  {blog.content}
                </ReactMarkdown>
              </div>
            )}

            {/* Comments section - Only show for free content or premium users */}
            {(!needsSubscription) && (
              <div className="mt-12">
                <Separator className="my-8" />
                <h3 className="text-2xl font-bold flex items-center gap-2 mb-6">
                  <MessageSquare className="h-5 w-5" />
                  Comments {comments.length > 0 && `(${comments.length})`}
                </h3>
                
                {/* Comment form */}
                <div className="mb-8 bg-muted/20 p-6 rounded-lg">
                  <h4 className="font-medium mb-4">Leave a comment</h4>
                  
                  {/* Guest comment fields */}
                  {!isAuthenticated && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Name *</label>
                        <Input
                          id="name"
                          value={commentName}
                          onChange={(e) => setCommentName(e.target.value)}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
                        <Input
                          id="email"
                          type="email"
                          value={commentEmail}
                          onChange={(e) => setCommentEmail(e.target.value)}
                          placeholder="Your email"
                          required
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium mb-1">Comment *</label>
                    <Textarea
                      id="comment"
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="Write your comment here..."
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSubmitComment}
                      disabled={!commentContent.trim() || submitting}
                    >
                      {submitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Submitting...
                        </>
                      ) : isAuthenticated ? "Post Comment" : "Submit Comment"}
                    </Button>
                  </div>
                  
                  {!isAuthenticated && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Comments from guests require approval before appearing.{' '}
                      <Link to="/auth" className="text-primary underline hover:no-underline">
                        Log in
                      </Link> to post immediately.
                    </p>
                  )}
                </div>
                
                {/* Comments list */}
                <div className="space-y-6">
                  {commentsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="text-center py-8 bg-muted/10 rounded-lg">
                      <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="bg-muted/10 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="font-medium">{comment.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(comment.created_at), 'MMM d, yyyy • h:mm a')}
                              </p>
                            </div>
                          </div>
                          
                          {(profile?.is_admin || (isAuthenticated && user?.id === comment.user_id)) && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="mt-2 pl-10">
                          <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPostPage;
