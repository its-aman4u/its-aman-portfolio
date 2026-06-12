
import ProjectList from '@/components/projects/ProjectList';
import { projectsData } from '@/data/projects';

const Projects = () => {
  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Project List */}
      <ProjectList projects={projectsData} />
    </div>
  );
};

export default Projects;
