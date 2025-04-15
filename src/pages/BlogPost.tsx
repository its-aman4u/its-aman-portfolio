
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogPost as BlogPostType, BlogComment, mockBlogPosts, mockComments } from '@/types/blog';
import { CalendarIcon, ArrowLeft, MessageSquare, User } from 'lucide-react';
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
        // Simulate API delay for realism
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use mock data until Supabase tables are set up
        const foundPost = mockBlogPosts.find(post => post.id === id);
        const postComments = mockComments.filter(comment => comment.post_id === id && comment.approved);
        
        if (foundPost) {
          setPost(foundPost);
          setComments(postComments);
        }
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
      // Simulate API call for submitting comment
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create a new mock comment (normally this would be saved to the database)
      const newComment: BlogComment = {
        id: `mock-${Date.now()}`,
        post_id: id,
        name: commentForm.name,
        email: commentForm.email,
        content: commentForm.content,
        created_at: new Date().toISOString(),
        approved: false
      };
      
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
              <Button variant="outline" asChild>
                <Link to="/admin/blog">Admin</Link>
              </Button>
            </div>
          </div>
          
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
              <div className="flex items-center text-muted-foreground">
                <CalendarIcon className="w-5 h-5 mr-2" />
                <span>{format(new Date(post.created_at), 'MMMM d, yyyy')}</span>
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
                        placeholder="john@example.com"
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
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
