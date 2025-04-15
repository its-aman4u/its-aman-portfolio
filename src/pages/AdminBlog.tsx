import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogComment, BlogPostForm } from '@/types/blog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminBlog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<BlogPostForm>({
    title: '',
    excerpt: '',
    content: '',
    cover_image: '',
    published: false,
    premium: false,
    price: 0,
  });
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const { user } = useAuth();

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

      const { data, error } = await supabase.from('blogs').insert([newBlog]);

      if (error) throw error;

      setBlogs(prev => [...prev, ...(data as BlogPost[])]);
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        cover_image: '',
        published: false,
        premium: false,
        price: 0,
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
      });
      setShowForm(true);
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
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('blogs')
        .update(updatedBlog)
        .eq('id', editingBlogId);

      if (error) throw error;

      setBlogs(prev =>
        prev.map(blog => (blog.id === editingBlogId ? { ...blog, ...updatedBlog } : blog))
      );
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        cover_image: '',
        published: false,
        premium: false,
        price: 0,
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

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Blog</h1>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Hide Form' : 'Create New Post'}
            </button>
          </div>

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
              <button type="submit" className="btn btn-primary">
                {editingBlogId ? 'Update Post' : 'Create Post'}
              </button>
              {editingBlogId && (
                <button type="button" className="btn btn-ghost ml-2" onClick={() => { setShowForm(false); setEditingBlogId(null); }}>
                  Cancel
                </button>
              )}
            </form>
          )}

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
                      <button className="btn btn-sm btn-info mr-2" onClick={() => handleUpdate(blog.id)}>
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="btn btn-sm btn-error" onClick={() => handleDelete(blog.id)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
                        <button className="btn btn-sm btn-success mr-2" onClick={() => handleApproveComment(comment.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-warning mr-2" onClick={() => handleRejectComment(comment.id)}>
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button className="btn btn-sm btn-error" onClick={() => handleDeleteComment(comment.id)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminBlog;
