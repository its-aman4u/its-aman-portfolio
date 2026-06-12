import { Button } from "@/components/ui/button";
import { Code } from 'lucide-react';
import ProjectCard, { Project } from './ProjectCard';

interface ProjectListProps {
  projects: Project[];
}

const ProjectList = ({ projects }: ProjectListProps) => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Projects</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work, ongoing initiatives, and technical capabilities.
          </p>
        </div>
        
        {/* Featured Project */}
        {projects.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">Featured Project</h2>
              <div className="h-1 w-20 bg-primary mx-auto mt-2 rounded"></div>
            </div>
            <ProjectCard key="featured" project={projects[0]} index={0} />
          </div>
        )}
        
        {/* Other Projects */}
        <div className="space-y-16">
          {projects.slice(1).map((project, index) => (
            <ProjectCard 
              key={index} 
              project={project} 
              index={index + 1} 
            />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            More projects coming soon. Check my GitHub for the latest updates.
          </p>
          <Button asChild>
            <a href="https://github.com/its-aman4u" target="_blank" rel="noopener noreferrer">
              <Code className="mr-2 h-4 w-4" /> View All Repositories
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectList;
