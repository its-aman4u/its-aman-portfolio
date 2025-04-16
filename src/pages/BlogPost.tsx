
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from '@/types/blog';
import { toast } from 'sonner';
import { CalendarIcon, ArrowLeft, Clock, User, Lock } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Import the plugins
import type { Pluggable } from 'unified';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFreeBlog, setIsFreeBlog] = useState(false);
  const { isPremium } = useAuth();
  
  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        // Get the current blog post
        const { data: blogData, error: blogError } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single();

        if (blogError) throw blogError;
        setBlog(blogData as BlogPost);
        
        // Check if this is the first (free) blog post
        const { data: allBlogs, error: allBlogsError } = await supabase
          .from('blogs')
          .select('id')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (!allBlogsError && allBlogs.length > 0 && allBlogs[0].id === id) {
          setIsFreeBlog(true);
        }
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
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8 max-w-md">
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

  const needsSubscription = !isFreeBlog && !isPremium;

  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = blog.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="container mx-auto mt-12 px-4 md:px-0">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="outline" asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
            </Link>
          </Button>
        </div>

        <article className="bg-card shadow-sm rounded-xl overflow-hidden">
          {blog.cover_image && (
            <div className="w-full h-[300px] md:h-[400px] overflow-hidden">
              <img
                src={blog.cover_image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-6 md:p-10">
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="h-4 w-4" />
                  <time dateTime={blog.created_at}>
                    {format(new Date(blog.created_at), 'MMMM dd, yyyy')}
                  </time>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{blog.title}</h1>
              {blog.excerpt && (
                <p className="text-lg text-muted-foreground">{blog.excerpt}</p>
              )}
            </header>

            <Separator className="my-8" />
            
            {needsSubscription ? (
              <div className="py-8">
                <Card className="p-8 text-center bg-primary/5 border-primary/30">
                  <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h2 className="text-2xl font-bold mb-2">Premium Content</h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    This article is available exclusively for premium subscribers.
                    Upgrade your account to continue reading.
                  </p>
                  <Button asChild size="lg">
                    <Link to="/subscription">Subscribe Now</Link>
                  </Button>
                </Card>
              </div>
            ) : (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm as Pluggable]}
                  rehypePlugins={[rehypeRaw as Pluggable]}
                  components={{
                    img: ({ node, ...props }) => (
                      <img {...props} className="rounded-md max-w-full my-8 mx-auto" alt={props.alt || ''} />
                    ),
                    a: ({ node, ...props }) => (
                      <a {...props} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                        {props.children}
                      </a>
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 {...props} className="text-2xl font-bold mt-8 mb-4" />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 {...props} className="text-xl font-bold mt-6 mb-3" />
                    ),
                    p: ({ node, ...props }) => (
                      <p {...props} className="my-4 leading-relaxed" />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul {...props} className="my-4 list-disc pl-6" />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol {...props} className="my-4 list-decimal pl-6" />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote {...props} className="border-l-4 border-primary/30 pl-4 italic my-6" />
                    ),
                  }}
                >
                  {blog.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPostPage;
