
import { useRef } from 'react';
import ProjectsScene from '@/components/projects/ProjectsScene';
import ProjectList from '@/components/projects/ProjectList';
import { projectsData } from '@/data/projects';
import { useToast } from "@/hooks/use-toast";

const Projects = () => {
  const { toast } = useToast();
  
  // Function to scroll to project section with improved UX
  const scrollToProject = (index: number) => {
    // Show toast notification
    toast({
      title: `Navigating to ${projectsData[index].title}`,
      description: "Scrolling to project details...",
    });
    
    // Find and scroll to the selected project
    const projectElements = document.querySelectorAll('.project-card-detailed');
    if (projectElements[index]) {
      projectElements[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Add highlight effect
      setTimeout(() => {
        projectElements[index].classList.add('ring-4', 'ring-primary', 'ring-opacity-50');
        
        // Remove highlight after a delay
        setTimeout(() => {
          projectElements[index].classList.remove('ring-4', 'ring-primary', 'ring-opacity-50');
        }, 2000);
      }, 500);
    }
  };
  
  return (
    <div className="min-h-screen pt-20">
      {/* 3D Projects Scene */}
      <ProjectsScene scrollToProject={scrollToProject} />
      
      {/* Project List */}
      <ProjectList projects={projectsData} />
    </div>
  );
};

export default Projects;
