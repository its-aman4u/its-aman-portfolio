
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const ProjectsPreview = () => {
  return (
    <section className="py-16 bg-white dark:bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work and ongoing initiatives.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Project 1 */}
          <div className="project-card">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">O3 Automation</h3>
              <p className="text-muted-foreground mb-4">
                Automated system for optimizing operational workflows and enhancing efficiency.
              </p>
              <p className="text-sm text-primary">Ongoing</p>
            </div>
          </div>
          
          {/* Project 2 */}
          <div className="project-card">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">AI Portfolios</h3>
              <p className="text-muted-foreground mb-4">
                Leveraging AI to create dynamic and personalized portfolio presentations.
              </p>
              <p className="text-sm text-primary">Ongoing</p>
            </div>
          </div>
          
          {/* Project 3 */}
          <div className="project-card">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">Masterclass Scheduler</h3>
              <p className="text-muted-foreground mb-4">
                Intelligent scheduling system for optimizing training and development programs.
              </p>
              <p className="text-sm text-primary">Completed</p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link to="/projects">
              View All Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsPreview;
