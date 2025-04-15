
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost as BlogPostType, BlogComment } from '@/types/blog';
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { format } from 'date-fns';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchBlogPost() {
      if (!id) return;
      
      try {
        setLoading(true);
        // Fetch post
        const { data: postData, error: postError } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .eq('published', true)
          .single();

        if (postError) throw postError;
        
        // Fetch approved comments
        const { data: commentsData, error: commentsError } = await supabase
          .from('blog_comments')
          .select('*')
          .eq('post_id', id)
          .eq('approved', true)
          .order('created_at', { ascending: true });

        if (commentsError) throw commentsError;
        
        setPost(postData);
        setComments(commentsData || []);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPost();
  }, [id]);

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCommentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setIsSubmitting(true);
    
    try {
      // Save comment to Supabase
      const { error } = await supabase
        .from('blog_comments')
        .insert([
          { 
            post_id: id,
            name: commentForm.name,
            email: commentForm.email,
            content: commentForm.content,
            created_at: new Date().toISOString(),
            approved: false
          }
        ]);
        
      if (error) throw error;
      
      toast.success('Comment submitted successfully!', {
        description: 'Your comment will be visible after approval.'
      });
      
      setCommentForm({
        name: '',
        email: '',
        content: ''
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('Failed to submit comment', {
        description: 'There was an error submitting your comment. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div className="min-h-screen pt-20">
      <article className="py-16">
        <div className="container mx-auto px-4">
          <Button variant="outline" asChild className="mb-8">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Link>
          </Button>
          
          {post.cover_image && (
            <div className="w-full h-[400px] mb-8 rounded-xl overflow-hidden">
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
              <div className="flex items-center text-muted-foreground">
                <CalendarIcon className="w-5 h-5 mr-2" />
                <span>{format(new Date(post.created_at), 'MMMM d, yyyy')}</span>
              </div>
            </div>
            
            <div className="prose max-w-none prose-lg dark:prose-invert mb-16" 
                 dangerouslySetInnerHTML={{ __html: post.content }}></div>
            
            <div className="border-t pt-12 mt-12">
              <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>
              
              {comments.length === 0 ? (
                <div className="bg-muted/50 rounded-lg p-6 text-center mb-8">
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="space-y-6 mb-12">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-card p-6 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">{comment.name}</h4>
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
                <h3 className="text-xl font-bold mb-4">Leave a Comment</h3>
                <form onSubmit={handleCommentSubmit}>
                  <div className="grid grid-cols-1 gap-6">
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
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    
                    <div>
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
                    
                    <Button type="submit" disabled={isSubmitting}>
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
                </form>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
