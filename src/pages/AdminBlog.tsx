
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost, BlogComment } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Edit, Trash, Eye, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pendingComments, setPendingComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    cover_image: '',
    published: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      // Fetch blog posts
      const { data: postsData, error: postsError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;
      
      // Fetch pending comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('approved', false)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;
      
      setPosts(postsData || []);
      setPendingComments(commentsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPost) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: formData.title,
            excerpt: formData.excerpt,
            content: formData.content,
            cover_image: formData.cover_image,
            published: formData.published,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingPost.id);
          
        if (error) throw error;
        toast.success('Blog post updated successfully');
      } else {
        // Create new post
        const { error } = await supabase
          .from('blog_posts')
          .insert([{
            title: formData.title,
            excerpt: formData.excerpt,
            content: formData.content,
            cover_image: formData.cover_image,
            published: formData.published,
            created_at: new Date().toISOString()
          }]);
          
        if (error) throw error;
        toast.success('Blog post created successfully');
      }
      
      // Reset form and refresh data
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast.error('Failed to save blog post');
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.cover_image || '',
      published: post.published
    });
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
    
    try {
      // First delete all comments for this post
      const { error: commentsError } = await supabase
        .from('blog_comments')
        .delete()
        .eq('post_id', postId);
        
      if (commentsError) throw commentsError;
      
      // Then delete the post
      const { error: postError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);
        
      if (postError) throw postError;
      
      toast.success('Blog post deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast.error('Failed to delete blog post');
    }
  };

  const handleApproveComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('blog_comments')
        .update({ approved: true })
        .eq('id', commentId);
        
      if (error) throw error;
      
      toast.success('Comment approved');
      fetchData();
    } catch (error) {
      console.error('Error approving comment:', error);
      toast.error('Failed to approve comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', commentId);
        
      if (error) throw error;
      
      toast.success('Comment deleted');
      fetchData();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const resetForm = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      cover_image: '',
      published: false
    });
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Blog Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">
                {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              
              <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Title
                  </label>
                  <Input 
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Post title"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
                    Excerpt
                  </label>
                  <Textarea 
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    placeholder="Short summary of your post"
                    rows={2}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-2">
                    Content (HTML)
                  </label>
                  <Textarea 
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Post content in HTML format"
                    rows={10}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="cover_image" className="block text-sm font-medium mb-2">
                    Cover Image URL
                  </label>
                  <Input 
                    id="cover_image"
                    name="cover_image"
                    value={formData.cover_image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="flex items-center">
                  <input 
                    id="published"
                    name="published"
                    type="checkbox"
                    checked={formData.published}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="published" className="ml-2 block text-sm">
                    Publish this post
                  </label>
                </div>
                
                <div className="flex gap-3">
                  <Button type="submit">
                    {editingPost ? 'Update Post' : 'Create Post'}
                  </Button>
                  {editingPost && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
          
          {/* Posts and Comments Section */}
          <div className="lg:col-span-2">
            <div className="bg-card p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-bold mb-4">Your Blog Posts</h2>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No blog posts yet. Create your first post!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {posts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>{format(new Date(post.created_at), 'MMM d, yyyy')}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              post.published ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                            }`}>
                              {post.published ? 'Published' : 'Draft'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditPost(post)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" asChild>
                                <a href={`/blog/${post.id}`} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-4 w-4" />
                                </a>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeletePost(post.id)}>
                                <Trash className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Pending Comments</h2>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
              ) : pendingComments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No pending comments to review.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingComments.map((comment) => {
                    // Find the post title for this comment
                    const post = posts.find(p => p.id === comment.post_id);
                    
                    return (
                      <div key={comment.id} className="border rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <div>
                            <span className="font-medium">{comment.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">{comment.email}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(comment.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <p className="text-sm mb-2">On post: {post?.title || 'Unknown post'}</p>
                        <p className="py-2 px-3 bg-muted/50 rounded mb-3">{comment.content}</p>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleApproveComment(comment.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteComment(comment.id)}>
                            <XCircle className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlog;
