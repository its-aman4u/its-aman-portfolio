import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogComment, BlogPostForm } from '@/types/blog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Trash2, Edit, CheckCircle, XCircle, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import GeminiContentGenerator from '@/components/admin/GeminiContentGenerator';

const AdminBlog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAiGenerator, setShowAiGenerator] = useState(false);
  const [formData, setFormData] = useState<BlogPostForm>({
    title: '',
    excerpt: '',
    content: '',
    cover_image: '',
    published: false,
    premium: false,
    price: 0,
    author_id: '',
  });
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        author_id: user.id
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const { data: blogsData, error: blogsError } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false });

        if (blogsError) throw blogsError;
        setBlogs(blogsData || []);

        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('*')
          .order('created_at', { ascending: false });

        if (commentsError) throw commentsError;
        setComments(commentsData || []);
      } catch (error) {
        toast.error('Failed to fetch data', {
          description: error instanceof Error ? error.message : 'Unknown error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleContentGenerated = (generatedContent: { title: string; excerpt: string; content: string }) => {
    setFormData(prev => ({
      ...prev,
      title: generatedContent.title,
      excerpt: generatedContent.excerpt,
      content: generatedContent.content
    }));
    setShowAiGenerator(false);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to create a blog post.');
      return;
    }

    try {
      setLoading(true);

      const newBlog: BlogPostForm = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        cover_image: formData.cover_image,
        published: formData.published || false,
        premium: false,
        price: 0,
        author_id: user?.id || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase.from('blogs').insert([newBlog]).select();

      if (error) throw error;

      setBlogs(prev => [data?.[0] as BlogPost, ...prev]);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        cover_image: '',
        published: false,
        premium: false,
        price: 0,
        author_id: user?.id || '',
      });
      setShowForm(false);
      toast.success('Blog post created successfully!');
    } catch (error) {
      toast.error('Failed to create blog post', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    setEditingBlogId(id);
    const blogToEdit = blogs.find(blog => blog.id === id);
    if (blogToEdit) {
      setFormData({
        title: blogToEdit.title,
        excerpt: blogToEdit.excerpt,
        content: blogToEdit.content,
        cover_image: blogToEdit.cover_image || '',
        published: blogToEdit.published || false,
        premium: blogToEdit.premium || false,
        price: blogToEdit.price || 0,
        author_id: blogToEdit.author_id,
      });
      setShowForm(true);
      setShowAiGenerator(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingBlogId) {
      toast.error('No blog post selected for editing.');
      return;
    }

    try {
      setLoading(true);

      const updatedBlog: BlogPostForm = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        cover_image: formData.cover_image,
        published: formData.published || false,
        premium: false,
        price: 0,
        author_id: formData.author_id,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('blogs')
        .update(updatedBlog)
        .eq('id', editingBlogId)
        .select();

      if (error) throw error;

      setBlogs(prev =>
        prev.map(blog => (blog.id === editingBlogId ? (data?.[0] as BlogPost) : blog))
      );
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        cover_image: '',
        published: false,
        premium: false,
        price: 0,
        author_id: user?.id || '',
      });
      setShowForm(false);
      setEditingBlogId(null);
      toast.success('Blog post updated successfully!');
    } catch (error) {
      toast.error('Failed to update blog post', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error) throw error;

      setBlogs(prev => prev.filter(blog => blog.id !== id));
      toast.success('Blog post deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete blog post', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveComment = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('comments')
        .update({ approved: true })
        .eq('id', id);

      if (error) throw error;

      setComments(prev =>
        prev.map(comment => (comment.id === id ? { ...comment, approved: true } : comment))
      );
      toast.success('Comment approved successfully!');
    } catch (error) {
      toast.error('Failed to approve comment', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectComment = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('comments')
        .update({ approved: false })
        .eq('id', id);

      if (error) throw error;

      setComments(prev =>
        prev.map(comment => (comment.id === id ? { ...comment, approved: false } : comment))
      );
      toast.success('Comment rejected successfully!');
    } catch (error) {
      toast.error('Failed to reject comment', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.from('comments').delete().eq('id', id);

      if (error) throw error;

      setComments(prev => prev.filter(comment => comment.id !== id));
      toast.success('Comment deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete comment', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-12">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">Login Required</h2>
          <p className="text-muted-foreground mb-6">You need to be logged in to access the admin area.</p>
          <Link to="/auth">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Blog</h1>

      {loading && !showForm && !showAiGenerator ? (
        <div className="flex justify-center items-center h-32">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : (
        <>
          <div className="mb-8 flex space-x-4">
            <Button 
              variant={showForm ? "secondary" : "default"} 
              onClick={() => {
                setShowForm(!showForm);
                if (!showForm) setShowAiGenerator(false);
              }}
            >
              {showForm ? 'Hide Form' : 'Create New Post Manually'}
            </Button>
            
            <Button 
              variant={showAiGenerator ? "secondary" : "default"}
              onClick={() => {
                setShowAiGenerator(!showAiGenerator);
                if (!showAiGenerator) setShowForm(false);
              }}
              className="flex items-center"
            >
              {showAiGenerator ? 'Hide AI Generator' : 'Generate with AI'}
            </Button>
            
            <Link to="/blog" className="ml-auto">
              <Button variant="outline">View Blog</Button>
            </Link>
          </div>

          {showAiGenerator && (
            <div className="mb-8">
              <GeminiContentGenerator onContentGenerated={handleContentGenerated} />
            </div>
          )}

          {showForm && (
            <form onSubmit={editingBlogId ? handleUpdateSubmit : handleSubmit} className="mb-8">
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="excerpt" className="block text-gray-700 text-sm font-bold mb-2">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={10}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="cover_image" className="block text-gray-700 text-sm font-bold mb-2">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  id="cover_image"
                  name="cover_image"
                  value={formData.cover_image || ''}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="published" className="inline-flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    name="published"
                    checked={formData.published || false}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-5 w-5 text-primary"
                  />
                  <span className="ml-2 text-gray-700">Published</span>
                </label>
              </div>
              <Button type="submit">
                {editingBlogId ? 'Update Post' : 'Create Post'}
              </Button>
              {editingBlogId && (
                <Button variant="ghost" className="ml-2" onClick={() => { setShowForm(false); setEditingBlogId(null); }}>
                  Cancel
                </Button>
              )}
            </form>
          )}

          {blogs.length === 0 && !showForm && !showAiGenerator ? (
            <div className="text-center py-12 bg-muted/20 rounded-lg">
              <h2 className="text-xl font-semibold mb-3">No Blog Posts Yet</h2>
              <p className="text-muted-foreground mb-6">Create your first blog post to get started.</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create First Post
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Published</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map(blog => (
                    <tr key={blog.id}>
                      <td>{blog.title}</td>
                      <td>{blog.published ? 'Yes' : 'No'}</td>
                      <td>{format(new Date(blog.created_at), 'PPP')}</td>
                      <td>
                        <Button size="sm" variant="outline" className="mr-2" onClick={() => handleUpdate(blog.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(blog.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {comments.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mt-12 mb-4">Comments</h2>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Comment</th>
                      <th>Approved</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comments.map(comment => (
                      <tr key={comment.id}>
                        <td>{comment.name}</td>
                        <td>{comment.content}</td>
                        <td>{comment.approved ? 'Yes' : 'No'}</td>
                        <td>{format(new Date(comment.created_at), 'PPP')}</td>
                        <td>
                          {!comment.approved ? (
                            <Button size="sm" variant="outline" className="mr-2" onClick={() => handleApproveComment(comment.id)}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="mr-2" onClick={() => handleRejectComment(comment.id)}>
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteComment(comment.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdminBlog;
