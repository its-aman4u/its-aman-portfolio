
import { useRef } from 'react';
import ProjectsScene from '@/components/projects/ProjectsScene';
import ProjectList from '@/components/projects/ProjectList';
import { projectsData } from '@/data/projects';

const Projects = () => {
  // Function to scroll to project section
  const scrollToProject = (index: number) => {
    const projectElements = document.querySelectorAll('.project-card-detailed');
    if (projectElements[index]) {
      projectElements[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
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
