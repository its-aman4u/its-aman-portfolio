
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from '@/types/blog';
import { toast } from 'sonner';
import { CalendarIcon, User2Icon } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

// Import the plugins
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const { data: blogData, error: blogError } = await supabase
          .from('blogs')
          .select(`
            *,
            profiles(id, username, full_name, avatar_url)
          `)
          .eq('id', id)
          .single();

        if (blogError) throw blogError;

        const profileData = blogData.profiles as any;
        const formattedBlog = {
          ...blogData,
          author: profileData ? {
            id: profileData.id,
            username: profileData.username,
            full_name: profileData.full_name,
            avatar_url: profileData.avatar_url
          } : undefined
        } as BlogPost;

        setBlog(formattedBlog);
      } catch (error) {
        toast.error('Failed to fetch blog post', {
          description: error instanceof Error ? error.message : 'Unknown error'
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlogPost();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!blog) {
    return <div className="min-h-screen flex items-center justify-center">Blog post not found.</div>;
  }

  return (
    <div className="container mx-auto mt-16 px-4 md:px-0">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{blog.title}</h1>
          <div className="flex items-center text-gray-600 dark:text-gray-400 space-x-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              <span>{format(new Date(blog.created_at), 'MMMM dd, yyyy')}</span>
            </div>
            {blog.author && (
              <div className="flex items-center gap-2">
                <User2Icon className="h-5 w-5" />
                <span>{blog.author.full_name || blog.author.username || 'Unknown Author'}</span>
              </div>
            )}
          </div>
        </header>

        {blog.cover_image && (
          <img
            src={blog.cover_image}
            alt={blog.title}
            className="w-full rounded-lg shadow-md mb-8"
          />
        )}

        <article className="prose prose-lg dark:prose-invert">
          <ReactMarkdown
            // Fix: Use type casting to resolve TypeScript errors with plugins
            remarkPlugins={[remarkGfm as any]}
            rehypePlugins={[rehypeRaw as any]}
            components={{
              img: ({ node, ...props }) => (
                <img {...props} style={{ maxWidth: '100%', height: 'auto' }} alt={props.alt || ''} />
              ),
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer">
                  {props.children}
                </a>
              ),
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
};

export default BlogPostPage;
