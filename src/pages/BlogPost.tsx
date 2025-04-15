
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from '@/types/blog';
import { toast } from 'sonner';
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";

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
        // Simplified query without join
        const { data: blogData, error: blogError } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single();

        if (blogError) throw blogError;
        setBlog(blogData as BlogPost);
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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4">Blog post not found.</h2>
          <p className="text-muted-foreground mb-6">The post you're looking for might have been removed or doesn't exist.</p>
        </div>
        <Button asChild>
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-16 px-4 md:px-0">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Button variant="outline" asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
            </Link>
          </Button>
        </div>

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{blog.title}</h1>
          <div className="flex items-center text-gray-600 dark:text-gray-400 space-x-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              <span>{format(new Date(blog.created_at), 'MMMM dd, yyyy')}</span>
            </div>
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
