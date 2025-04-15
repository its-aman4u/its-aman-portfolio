
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ArrowRight, ArrowLeft, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  author_id: string;
  created_at: string;
  published: boolean;
  premium: boolean;
  price: number;
}

interface Author {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

const Blog = () => {
  const { isAuthenticated, isPremium } = useAuth();
  const [posts, setPosts] = useState<(BlogPost & { author: Author | null })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('blogs')
          .select(`
            *,
            author:profiles(id, username, full_name, avatar_url)
          `)
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching blog posts:', error);
          return;
        }

        setPosts(data || []);
      } catch (error) {
        console.error('Error in fetchBlogPosts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  return (
    <div className="min-h-screen pt-20">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
            <div className="flex gap-3">
              {!isAuthenticated && (
                <Button asChild>
                  <Link to="/auth">
                    Sign In
                  </Link>
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link to="/admin/blog">
                  Admin Dashboard
                </Link>
              </Button>
            </div>
          </div>

          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">My Blog</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Thoughts, insights, and updates on my latest work and technologies I'm exploring.
            </p>
            {!isPremium && (
              <div className="mt-6">
                <Button asChild variant="default" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                  <Link to="/subscription">
                    Upgrade to Premium for Exclusive Content
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl mb-2">No blog posts yet</h3>
              <p className="text-muted-foreground">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div key={post.id} className={`bg-card rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 ${post.premium ? 'border-2 border-amber-500 dark:border-amber-400' : ''}`}>
                  {post.cover_image && (
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={post.cover_image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                      {post.premium && (
                        <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
                          <Lock className="w-3 h-3 mr-1" />
                          Premium
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        <span>{format(new Date(post.created_at), 'MMMM d, yyyy')}</span>
                      </div>
                      {post.author?.full_name && (
                        <span>By {post.author.full_name}</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-3 hover:text-primary transition-colors">
                      {post.title}
                      {post.premium && !isPremium && <Lock className="inline-block ml-2 w-4 h-4 text-amber-500" />}
                    </h3>
                    <p className="text-muted-foreground mb-4 flex-grow">{post.excerpt}</p>
                    
                    {post.premium && !isPremium ? (
                      <div className="mt-auto">
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/auth">
                            Unlock Premium Content <Lock className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" asChild className="mt-auto self-start group">
                        <Link to={`/blog/${post.id}`}>
                          Read More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
