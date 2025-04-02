import { 
  Github, ExternalLink, Code 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Stars, Float, Html } from '@react-three/drei';
import { Suspense, useRef } from 'react';

// Project Card component for 3D scene
function ProjectCard({ position, color, title, onClick }: any) {
  const ref = useRef<any>();
  
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh 
        position={position} 
        ref={ref} 
        onClick={onClick}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
          if (ref.current) ref.current.scale.set(1.1, 1.1, 1.1);
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
          if (ref.current) ref.current.scale.set(1, 1, 1);
        }}
      >
        <boxGeometry args={[1.5, 0.5, 1.5]} />
        <meshStandardMaterial color={color} />
        <Html position={[0, 0, 0.76]}>
          <div style={{ 
            color: '#ffffff', 
            fontSize: '15px',
            fontWeight: 'bold',
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}>
            {title}
          </div>
        </Html>
      </mesh>
    </Float>
  );
}

// 3D Scene for Projects
function ProjectsScene({ scrollToProject }: { scrollToProject: (index: number) => void }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <ProjectCard 
        position={[-2, 0, 0]} 
        color="#1A6A8F" 
        title="O3 Automation" 
        onClick={() => scrollToProject(0)}
      />
      
      <ProjectCard 
        position={[0, 0, 0]} 
        color="#53A2BE" 
        title="AI Portfolios" 
        onClick={() => scrollToProject(1)}
      />
      
      <ProjectCard 
        position={[2, 0, 0]} 
        color="#53BE76" 
        title="Masterclass Scheduler" 
        onClick={() => scrollToProject(2)}
      />
      
      <Stars radius={100} depth={50} count={1000} factor={4} />
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minDistance={4}
        maxDistance={10}
      />
      <Environment preset="sunset" />
    </>
  );
}

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
      <section className="h-[500px] w-full mb-16">
        <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
          <Suspense fallback={null}>
            <ProjectsScene scrollToProject={scrollToProject} />
          </Suspense>
        </Canvas>
        <div className="absolute bottom-5 left-0 right-0 text-center text-primary text-shadow-lg pointer-events-none">
          <p className="text-sm">Click on a project to learn more</p>
        </div>
      </section>
      
      {/* Rest of the projects section */}
      <section className="py-8">
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
