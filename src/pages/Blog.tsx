
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, mockBlogPosts } from '@/types/blog';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, Lock, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isPremium, profile } = useAuth();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data: blogsData, error: blogsError } = await supabase
          .from('blogs')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (blogsError) {
          console.warn('Database fetch error, falling back to local case studies:', blogsError);
          setBlogs(mockBlogPosts);
        } else if (!blogsData || blogsData.length === 0) {
          setBlogs(mockBlogPosts);
        } else {
          setBlogs(blogsData as BlogPost[]);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs(mockBlogPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Latest Blog Posts</h1>
            <p className="text-muted-foreground mt-2">Thoughts, insights and updates on my work</p>
          </div>
          <div className="flex gap-2">
            {isAuthenticated && profile?.is_admin && (
              <Link to="/admin/blog">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </Button>
              </Link>
            )}
            {!isAuthenticated && (
              <Link to="/auth">
                <Button variant="outline">Login</Button>
              </Link>
            )}
            {isAuthenticated && !profile?.is_admin && (
              <Link to="/subscription">
                <Button variant="outline">Subscription</Button>
              </Link>
            )}
          </div>
        </div>
        
        {blogs.length === 0 ? (
          <div className="text-center py-16 bg-muted/20 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">No blog posts yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">Check back later or create your own post if you have admin access.</p>
            {isAuthenticated && profile?.is_admin && (
              <Link to="/admin/blog">
                <Button>Create Your First Post</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured posts - first two posts are always free */}
            {blogs.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Featured Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {blogs.slice(0, 2).map((blog, index) => (
                    <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="h-56 overflow-hidden">
                        {blog.cover_image ? (
                          <img 
                            src={blog.cover_image} 
                            alt={blog.title} 
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-primary/10 to-primary/30 flex items-center justify-center">
                            <p className="text-primary font-medium">Free Article</p>
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          <time dateTime={blog.created_at}>
                            {format(new Date(blog.created_at), 'MMMM d, yyyy')}
                          </time>
                          <span className="ml-auto bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-0.5 rounded text-xs font-medium">
                            Free Access
                          </span>
                        </div>
                        <CardTitle className="line-clamp-1">{blog.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{blog.excerpt}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="line-clamp-3 text-muted-foreground text-sm">
                          {blog.content.substring(0, 150)}...
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                          <Link to={`/blog/${blog.id}`}>
                            Read Article <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Premium blog posts (the rest of posts) */}
            {blogs.length > 2 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Premium Articles</h2>
                  {!isPremium && !profile?.is_admin && (
                    <Link to="/subscription">
                      <Button variant="outline" size="sm">Unlock Premium Content</Button>
                    </Link>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {blogs.slice(2).map(blog => (
                    <Card key={blog.id} className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative">
                        {blog.cover_image ? (
                          <img 
                            src={blog.cover_image} 
                            alt={blog.title} 
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80";
                            }}
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-r from-primary/10 to-primary/30 flex items-center justify-center">
                            <p className="text-primary font-medium">Premium Article</p>
                          </div>
                        )}
                        
                        {!isPremium && !profile?.is_admin && blog.premium && (
                          <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex flex-col items-center justify-center">
                            <Lock className="h-8 w-8 text-primary mb-2" />
                            <p className="font-medium text-center px-4">Premium Content</p>
                            <Link to="/subscription" className="mt-2">
                              <Button variant="outline" size="sm">Subscribe to Access</Button>
                            </Link>
                          </div>
                        )}
                      </div>
                      
                      <CardHeader>
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <time dateTime={blog.created_at}>
                            {format(new Date(blog.created_at), 'MMMM d, yyyy')}
                          </time>
                        </div>
                        <CardTitle className="line-clamp-1">{blog.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{blog.excerpt}</CardDescription>
                      </CardHeader>
                      
                      <CardContent className="flex-grow">
                        <p className="line-clamp-3 text-muted-foreground text-sm">
                          {blog.content.substring(0, 150)}...
                        </p>
                      </CardContent>
                      
                      <CardFooter>
                        {isPremium || profile?.is_admin || !blog.premium ? (
                          <Button asChild variant="outline" className="w-full">
                            <Link to={`/blog/${blog.id}`}>
                              Read Article
                            </Link>
                          </Button>
                        ) : (
                          <Button asChild variant="outline" className="w-full">
                            <Link to="/subscription">
                              Unlock Article
                            </Link>
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
