
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from '@/types/blog';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data: blogsData, error: blogsError } = await supabase
          .from('blogs')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (blogsError) throw blogsError;

        // Since we can't join with profiles, we'll just use the blogs data
        setBlogs(blogsData as BlogPost[]);
      } catch (error) {
        toast.error('Failed to fetch blogs', {
          description: error instanceof Error ? error.message : 'Unknown error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Latest Blog Posts</h1>
        {isAuthenticated && (
          <Link to="/admin/blog">
            <Button>Manage Blogs</Button>
          </Link>
        )}
        {!isAuthenticated && (
          <Link to="/auth">
            <Button>Login</Button>
          </Link>
        )}
      </div>
      
      {blogs.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">No blog posts yet</h2>
          <p className="text-muted-foreground mb-6">Check back later or create your own post if you have access.</p>
          {isAuthenticated && (
            <Link to="/admin/blog">
              <Button>Create Your First Post</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(blog => (
            <div key={blog.id} className="card card-compact bg-base-100 shadow-xl">
              <figure>
                <img src={blog.cover_image || "https://placeimg.com/400/225/arch"} alt={blog.title} />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{blog.title}</h2>
                <p>{blog.excerpt}</p>
                <div className="flex items-center mt-4">
                  <div className="text-sm">
                    <time dateTime={blog.created_at} className="block text-gray-500">
                      {format(new Date(blog.created_at), 'PPP')}
                    </time>
                  </div>
                </div>
                <div className="card-actions justify-end">
                  <Link to={`/blog/${blog.id}`} className="btn btn-primary">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
