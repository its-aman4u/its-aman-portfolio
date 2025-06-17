import React, { useState, useEffect } from 'react';
import { BlogPost, mockBlogPosts } from '@/types/blog';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GeminiContentGenerator from '@/components/admin/GeminiContentGenerator';
import { useAuth } from '@/contexts/AuthContext';

const AdminBlog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [blogInput, setBlogInput] = useState({
    title: '',
    excerpt: '',
    content: '',
    cover_image: '',
    published: false,
    premium: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
  const { user, profile, isAuthenticated } = useAuth();
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
  }, [isAuthenticated, profile, navigate]);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoadingBlogs(true);
      try {
        // Use mock data since we're in mock mode
        console.log('Using mock blog data for admin');
        setBlogs(mockBlogPosts);
      } catch (error: any) {
        toast.error('Failed to fetch blogs', { description: error.message });
        console.error('Error fetching blogs:', error);
      } finally {
        setIsLoadingBlogs(false);
      }
    };

    if (isAuthenticated && profile?.is_admin) {
      fetchBlogs();
    }
  }, [isAuthenticated, profile]);

  useEffect(() => {
    if (selectedBlog) {
      setBlogInput({
        title: selectedBlog.title,
        excerpt: selectedBlog.excerpt,
        content: selectedBlog.content,
        cover_image: selectedBlog.cover_image || '',
        published: selectedBlog.published || false,
        premium: selectedBlog.premium || false,
      });
    } else {
      setBlogInput({
        title: '',
        excerpt: '',
        content: '',
        cover_image: '',
        published: false,
        premium: false,
      });
    }
  }, [selectedBlog]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBlogInput(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setBlogInput(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!user) {
        throw new Error('You must be logged in to create/edit blog posts');
      }

      if (selectedBlog) {
        // Mock update - just update local state
        const updatedBlogs = blogs.map(blog => 
          blog.id === selectedBlog.id 
            ? { ...blog, ...blogInput, updated_at: new Date().toISOString() }
            : blog
        );
        setBlogs(updatedBlogs);
        toast.success('Blog post updated successfully! (Mock mode)');
      } else {
        // Mock create - add to local state
        const newBlog: BlogPost = {
          id: `mock-${Date.now()}`,
          ...blogInput,
          author_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setBlogs([newBlog, ...blogs]);
        toast.success('Blog post created successfully! (Mock mode)');
      }

      setSelectedBlog(null);
      resetForm();
    } catch (error: any) {
      toast.error('Failed to save blog post', { description: error.message });
      console.error('Error saving blog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setBlogInput({
      title: '',
      excerpt: '',
      content: '',
      cover_image: '',
      published: false,
      premium: false,
    });
  };

  const handleDelete = async () => {
    if (!selectedBlog) return;

    setIsLoading(true);
    try {
      // Mock delete - remove from local state
      const updatedBlogs = blogs.filter(blog => blog.id !== selectedBlog.id);
      setBlogs(updatedBlogs);
      toast.success('Blog post deleted successfully! (Mock mode)');

      setSelectedBlog(null);
      resetForm();
    } catch (error: any) {
      toast.error('Failed to delete blog post', { description: error.message });
      console.error('Error deleting blog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBlog = (blog: BlogPost) => {
    setSelectedBlog(blog);
  };

  const handleInsertContent = (content: string) => {
    setBlogInput(prev => ({
      ...prev,
      content: prev.content + '\n\n' + content
    }));
  };

  const handlePreviewBlog = () => {
    if (selectedBlog) {
      window.open(`/blog/${selectedBlog.id}`, '_blank');
    } else {
      toast.info('Save the blog post first to preview it');
    }
  };

  // Default cover images
  const defaultCoverImages = [
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <div className="flex gap-2">
          <Button onClick={() => setSelectedBlog(null)} disabled={isLoading}>
            New Blog Post
          </Button>
          <Button asChild variant="outline">
            <Link to="/blog">View Blog</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-card rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">
              {selectedBlog ? "Edit Blog Post" : "Create New Blog Post"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={blogInput.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Input
                  type="text"
                  id="excerpt"
                  name="excerpt"
                  value={blogInput.excerpt}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="cover_image">Cover Image URL</Label>
                <Input
                  type="text"
                  id="cover_image"
                  name="cover_image"
                  value={blogInput.cover_image}
                  onChange={handleInputChange}
                  placeholder="Enter image URL or choose from default images below"
                />
                
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {defaultCoverImages.map((url, index) => (
                    <div 
                      key={index} 
                      className={`h-20 cursor-pointer rounded-md overflow-hidden border-2 ${blogInput.cover_image === url ? 'border-primary' : 'border-transparent'}`}
                      onClick={() => setBlogInput(prev => ({...prev, cover_image: url}))}
                    >
                      <img src={url} alt={`Default ${index+1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="content">Content (Markdown supported)</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={blogInput.content}
                  onChange={handleInputChange}
                  rows={12}
                  required
                  className="font-mono"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={blogInput.published}
                    onCheckedChange={(checked) => handleSwitchChange('published', checked)}
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="premium"
                    checked={blogInput.premium}
                    onCheckedChange={(checked) => handleSwitchChange('premium', checked)}
                  />
                  <Label htmlFor="premium">Premium Content</Label>
                </div>
              </div>
              
              <div className="flex justify-between mt-8 flex-wrap gap-2">
                <div className="flex gap-2">
                  {selectedBlog && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isLoading}
                    >
                      {isLoading ? "Deleting..." : "Delete"}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreviewBlog}
                    disabled={!selectedBlog}
                  >
                    Preview
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSelectedBlog(null);
                      resetForm();
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading
                      ? "Saving..."
                      : selectedBlog
                      ? "Update"
                      : "Create"}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>AI Content Generator</CardTitle>
              <CardDescription>
                Mock AI content generation (Gemini API not available in mock mode)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                <h3 className="font-medium mb-2">Mock Mode Notice:</h3>
                <p className="text-sm text-muted-foreground">
                  AI content generation will return mock responses since the actual Gemini API is not available in mock mode.
                </p>
              </div>
              <GeminiContentGenerator 
                onContentGenerated={(content) => {
                  setBlogInput({
                    title: content.title || blogInput.title,
                    excerpt: content.excerpt || blogInput.excerpt,
                    content: content.content || blogInput.content,
                    cover_image: blogInput.cover_image,
                    published: blogInput.published,
                    premium: blogInput.premium
                  });
                }}
                onInsertContent={handleInsertContent}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <div className="bg-card rounded-lg shadow-sm p-6 h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Your Blog Posts</h2>
              <span className="text-sm text-muted-foreground">
                {blogs.length} posts
              </span>
            </div>
            {isLoadingBlogs ? (
              <div className="flex justify-center">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : blogs.length > 0 ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedBlog?.id === blog.id
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => handleSelectBlog(blog)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium line-clamp-1">{blog.title}</h3>
                      <div className="flex gap-1">
                        {blog.premium && (
                          <div className="h-2 w-2 rounded-full mt-2 bg-amber-500" title="Premium"></div>
                        )}
                        <div className={`h-2 w-2 rounded-full mt-2 ${blog.published ? "bg-green-500" : "bg-yellow-500"}`}></div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground my-2 line-clamp-2">
                      {blog.excerpt || blog.content.substring(0, 100)}...
                    </p>
                    <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                      <span>
                        {format(new Date(blog.created_at), "MMM d, yyyy")}
                      </span>
                      <span>
                        {blog.published ? "Published" : "Draft"}
                        {blog.premium ? ", Premium" : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No blog posts yet. Create your first post!
                </p>
                <Button onClick={() => setSelectedBlog(null)}>
                  Create Blog Post
                </Button>
              </div>
            )}
          </div>

          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle>Admin Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Manage Comments</h3>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/admin/comments">
                    Moderate Comments
                  </Link>
                </Button>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Contact Submissions</h3>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/admin/contact">
                    View Messages
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminBlog;
