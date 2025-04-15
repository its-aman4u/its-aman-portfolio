
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BlogPost, mockBlogPosts } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ArrowRight, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using mock data until Supabase tables are set up
    async function fetchBlogPosts() {
      try {
        setLoading(true);
        // Simulate API delay for realism
        await new Promise(resolve => setTimeout(resolve, 800));
        setPosts(mockBlogPosts.filter(post => post.published));
      } catch (error) {
        console.error('Error fetching blog posts:', error);
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
            <Button variant="outline" asChild>
              <Link to="/admin/blog">
                Admin Dashboard
              </Link>
            </Button>
          </div>

          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">My Blog</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Thoughts, insights, and updates on my latest work and technologies I'm exploring.
            </p>
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
                <div key={post.id} className="bg-card rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">
                  {post.cover_image && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.cover_image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      <span>{format(new Date(post.created_at), 'MMMM d, yyyy')}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-muted-foreground mb-4 flex-grow">{post.excerpt}</p>
                    <Button variant="outline" asChild className="mt-auto self-start group">
                      <Link to={`/blog/${post.id}`}>
                        Read More <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
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
