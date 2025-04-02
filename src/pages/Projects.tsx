
import { 
  Github, ExternalLink, Code 
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const Projects = () => {
  const projects = [
    {
      title: "O3 Automation",
      description: "A comprehensive system designed to automate operational workflows and enhance efficiency across multiple departments. This project leverages Google AppScript and API integrations to streamline routine tasks and improve data accuracy.",
      status: "Ongoing",
      image: "https://images.unsplash.com/photo-1664575198263-269a022d6e14?q=80&w=1740&auto=format&fit=crop",
      tech: ["Google AppScript", "APIs", "Automation", "Data Processing"],
      link: "#",
      github: "https://github.com/its-aman4u"
    },
    {
      title: "AI Portfolios",
      description: "An innovative platform utilizing AI to create dynamic and personalized portfolio presentations for professionals. This project combines machine learning with design principles to generate customized portfolio websites based on user data and preferences.",
      status: "Ongoing",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1740&auto=format&fit=crop",
      tech: ["AI", "Web Development", "UI/UX Design", "Data Visualization"],
      link: "#",
      github: "https://github.com/its-aman4u"
    },
    {
      title: "Masterclass Scheduler",
      description: "An intelligent scheduling system for optimizing training and development programs. This tool automates the scheduling process, analyzes participant availability, and recommends optimal time slots for maximum attendance and engagement.",
      status: "Ongoing",
      image: "https://images.unsplash.com/photo-1522252234503-e356532cafd5?q=80&w=1625&auto=format&fit=crop",
      tech: ["Scheduling Algorithms", "Data Analysis", "User Interface", "Calendar Integration"],
      link: "#",
      github: "https://github.com/its-aman4u"
    }
  ];
  
  return (
    <div className="min-h-screen pt-20">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Projects</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A showcase of my recent work, ongoing initiatives, and technical capabilities.
            </p>
          </div>
          
          <div className="space-y-16">
            {projects.map((project, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-card rounded-xl shadow-md overflow-hidden animate-fade-in"
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
    </div>
  );
};

export default Projects;
