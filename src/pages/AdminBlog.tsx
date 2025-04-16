import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from '@/types/blog';
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

const AdminBlog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [blogInput, setBlogInput] = useState({
    title: '',
    excerpt: '',
    content: '',
    cover_image: '',
    published: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getUser();
      if (data && data.user) {
        setCurrentUser(data.user.id);
      } else {
        navigate('/admin/login');
      }
    };
    
    getUserId();
  }, [navigate]);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoadingBlogs(true);
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setBlogs(data as BlogPost[]);
      } catch (error: any) {
        toast.error('Failed to fetch blogs', { description: error.message });
      } finally {
        setIsLoadingBlogs(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    if (selectedBlog) {
      setBlogInput({
        title: selectedBlog.title,
        excerpt: selectedBlog.excerpt,
        content: selectedBlog.content,
        cover_image: selectedBlog.cover_image || '',
        published: selectedBlog.published || false,
      });
    } else {
      setBlogInput({
        title: '',
        excerpt: '',
        content: '',
        cover_image: '',
        published: false,
      });
    }
  }, [selectedBlog]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBlogInput(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setBlogInput(prev => ({ ...prev, published: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (selectedBlog) {
        const { error } = await supabase
          .from('blogs')
          .update({
            ...blogInput,
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedBlog.id);

        if (error) throw error;
        toast.success('Blog post updated successfully!');
      } else {
        if (!currentUser) {
          throw new Error('No user authenticated. Please log in.');
        }
        
        const { error } = await supabase
          .from('blogs')
          .insert({
            ...blogInput,
            author_id: currentUser,
            created_at: new Date().toISOString(),
          });

        if (error) throw error;
        toast.success('Blog post created successfully!');
      }

      const { data } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      setBlogs(data as BlogPost[]);
      setSelectedBlog(null);
    } catch (error: any) {
      toast.error('Failed to save blog post', { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBlog) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', selectedBlog.id);

      if (error) throw error;
      toast.success('Blog post deleted successfully!');

      const { data } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
      setBlogs(data as BlogPost[]);
      setSelectedBlog(null);
    } catch (error: any) {
      toast.error('Failed to delete blog post', { description: error.message });
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
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={blogInput.content}
                  onChange={handleInputChange}
                  rows={8}
                  required
                />
              </div>
              <div>
                <Label htmlFor="published">Published</Label>
                <Switch
                  id="published"
                  checked={blogInput.published}
                  onCheckedChange={handleCheckboxChange}
                />
              </div>
              
              <div className="flex justify-between mt-8">
                <div>
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
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedBlog(null)}
                    disabled={isLoading || !selectedBlog}
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
                Use Gemini AI to generate content for your blog posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
                <h3 className="font-medium mb-2">How to use AI content generation:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Type a prompt describing what content you want</li>
                  <li>Click "Generate Content" and wait for the AI response</li>
                  <li>Use the entire response or click "Insert at Cursor" to add it at the cursor position</li>
                  <li>Edit and refine the generated content as needed</li>
                </ol>
              </div>
              <GeminiContentGenerator 
                onContentGenerated={(content) => {
                  setBlogInput({
                    title: content.title,
                    excerpt: content.excerpt,
                    content: content.content,
                    cover_image: blogInput.cover_image,
                    published: blogInput.published
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
                      <div className={`h-2 w-2 rounded-full mt-2 ${blog.published ? "bg-green-500" : "bg-yellow-500"}`}></div>
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
        </div>
      </div>
    </div>
  );
};

export default AdminBlog;
