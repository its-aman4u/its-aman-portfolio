
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Github, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  // Determine if this is the D-Talk project
  const isDTalkProject = project.title.includes("D-Talk");
  
  return (
    <div 
      key={index} 
      className="project-card-detailed bg-white dark:bg-card rounded-xl shadow-md overflow-hidden animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="h-64 md:h-full overflow-hidden relative">
          <img 
            src={project.image} 
            alt={project.title} 
            className={`w-full h-full object-cover transition-transform duration-700 ${hovered ? 'scale-110' : 'scale-100'}`}
          />
          {/* Overlay with status */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-4 w-full">
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                project.status === "Production" 
                  ? "bg-green-500/80 text-white" 
                  : "bg-primary/80 text-white"
              }`}>
                {project.status}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-8">
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
          
          {/* D-Talk additional details */}
          {isDTalkProject && (
            <div className="mb-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setExpanded(!expanded)}
                className="mb-2 w-full justify-between"
              >
                Project Details
                {expanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              
              {expanded && (
                <Card className="mt-3 animate-fade-in">
                  <CardContent className="pt-6">
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-semibold mb-1">Key Features:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Automated email workflows with customized HTML templates</li>
                          <li>Status tracking with "Completed" and "Pending" functionality</li>
                          <li>Real-time updates via web app integration</li>
                          <li>Daily reminders and weekly reporting</li>
                          <li>MIS dashboard with actionable insights</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Implementation Steps:</h4>
                        <ol className="list-decimal pl-5 space-y-1">
                          <li>Set up Google Apps Script environment</li>
                          <li>Configure spreadsheet with Master_Data & tracking sheets</li>
                          <li>Build email templates with interactive buttons</li>
                          <li>Implement doGet endpoint for status updates</li>
                          <li>Create management reporting system</li>
                        </ol>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Technologies Used:</h4>
                        <p>Google Apps Script, HTML/CSS for email templates, REST API with doGet/doPost methods, Google Sheets as database, and time-based triggers.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          
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
