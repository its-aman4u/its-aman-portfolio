
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost, mockBlogPosts } from '@/types/blog';
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const BlogPreview = () => {
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatestPosts() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (error) {
          console.error('Error fetching latest blog posts:', error);
          // Fallback to mock data if there's an error
          setLatestPosts(mockBlogPosts.slice(0, 3));
          return;
        }
        
        if (data.length === 0) {
          // Use mock data if no posts are found
          setLatestPosts(mockBlogPosts.slice(0, 3));
          return;
        }
        
        setLatestPosts(data as BlogPost[]);
      } catch (error) {
        console.error('Error fetching latest blog posts:', error);
        // Fallback to mock data
        setLatestPosts(mockBlogPosts.slice(0, 3));
      } finally {
        setLoading(false);
      }
    }

    fetchLatestPosts();
  }, []);

  return (
    <section className="py-20 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Latest from the Blog</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Thoughts, insights, and updates on my latest work and technologies I'm exploring.
          </p>
          <Separator className="max-w-md mx-auto mt-6" />
        </div>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : latestPosts.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-lg max-w-2xl mx-auto">
            <p className="text-muted-foreground">No blog posts yet. Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestPosts.map((post, index) => (
              <Card 
                key={post.id} 
                className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="h-48 bg-muted/20">
                  {post.cover_image ? (
                    <img 
                      src={post.cover_image} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary/10 to-primary/30 flex items-center justify-center">
                      <p className="text-primary font-medium">Blog Post</p>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <time dateTime={post.created_at}>
                      {format(new Date(post.created_at), 'MMMM d, yyyy')}
                    </time>
                  </div>
                  <CardTitle className="line-clamp-1">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="line-clamp-3 text-muted-foreground text-sm">
                    {post.content.substring(0, 120)}...
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full group">
                    <Link to={`/blog/${post.id}`}>
                      Read Article <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="group">
            <Link to="/blog">
              View All Posts <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
