
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from 'lucide-react';

export interface Project {
  title: string;
  description: string;
  status: string;
  image: string;
  tech: string[];
  link: string;
  github: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  return (
    <div 
      key={index} 
      className="project-card-detailed bg-white dark:bg-card rounded-xl shadow-md overflow-hidden animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="h-64 md:h-full overflow-hidden">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
        </div>
        
        <div className="p-8">
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm inline-block mb-4">
            {project.status}
          </div>
          
          <h2 className="text-2xl font-bold mb-3">{project.title}</h2>
          
          <p className="text-muted-foreground mb-6">
            {project.description}
          </p>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, i) => (
                <span 
                  key={i} 
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" size="sm" asChild>
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" /> Repository
              </a>
            </Button>
            <Button size="sm" asChild>
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> View Project
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
