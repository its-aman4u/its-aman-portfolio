import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, Author } from '@/types/blog';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data: blogsData, error: blogsError } = await supabase
          .from('blogs')
          .select(`
            *,
            profiles(id, username, full_name, avatar_url)
          `)
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (blogsError) throw blogsError;

        const formattedBlogs = blogsData.map(blog => ({
          ...blog,
          author: blog.profiles ? {
            id: blog.profiles.id,
            username: blog.profiles.username,
            full_name: blog.profiles.full_name,
            avatar_url: blog.profiles.avatar_url
          } : undefined
        }));

        setBlogs(formattedBlogs);
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
      <h1 className="text-3xl font-bold mb-8 text-center">Latest Blog Posts</h1>
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
                {blog.author?.avatar_url ? (
                  <img
                    src={blog.author.avatar_url}
                    alt={blog.author.full_name || blog.author.username || 'Author'}
                    className="rounded-full w-8 h-8 mr-2"
                  />
                ) : (
                  <div className="rounded-full w-8 h-8 mr-2 bg-gray-400"></div>
                )}
                <div className="text-sm">
                  <p className="font-semibold">{blog.author?.full_name || blog.author?.username || 'Unknown Author'}</p>
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
    </div>
  );
};

export default Blog;
