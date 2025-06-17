import { GraduationCap, Briefcase, Award, BookOpen, BarChart, Code, Rocket } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// 3D Background for Journey Page
const JourneyBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.1}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

// Icon component for timeline milestones
const MilestoneIcon = ({ icon: Icon, milestone }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="milestone-icon">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">{milestone.title}</h4>
          <p className="text-sm text-muted-foreground">{milestone.year}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

// Visual element for empty side of timeline
const TimelineVisual = ({ index }) => {
  // Different visuals based on index to add variety
  return (
    <div className="timeline-visual">
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          <CarouselItem>
            <div className="bg-gradient-to-br from-primary/50 to-primary/10 backdrop-blur-md rounded-xl p-4 h-40 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-primary">{index + 1}</div>
                <div className="text-sm text-primary/80">Milestone</div>
              </div>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="bg-gradient-to-br from-secondary/50 to-secondary/10 backdrop-blur-md rounded-xl p-4 h-40 flex items-center justify-center">
              <div className="space-y-2 text-center">
                {getIconForIndex(index, "w-12 h-12 mx-auto text-secondary")}
                <div className="text-sm text-secondary/80">Achievement</div>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="left-1" />
        <CarouselNext className="right-1" />
      </Carousel>
    </div>
  );
};

// Helper function to get an appropriate icon based on index
const getIconForIndex = (index, className = "w-6 h-6") => {
  const icons = [
    <GraduationCap key="grad" className={className} />,
    <Briefcase key="brief" className={className} />,
    <Award key="award" className={className} />,
    <BookOpen key="book" className={className} />,
    <BarChart key="chart" className={className} />,
    <Code key="code" className={className} />,
    <Rocket key="rocket" className={className} />
  ];
  
  return icons[index % icons.length];
};

const Journey = () => {
  const milestones = [
    {
      year: "2016",
      title: "Academic Pivot",
      description: "Made a strategic career decision to pursue commerce after 12th standard, establishing a solid foundation for my future business studies despite initial academic challenges.",
      icon: GraduationCap
    },
    {
      year: "2017",
      title: "Higher Education",
      description: "Despite facing significant family challenges that resulted in a gap year, I demonstrated resilience by enrolling at ITM to pursue a Bachelor of Commerce degree, determined to excel academically.",
      icon: BookOpen
    },
    {
      year: "2018",
      title: "Academic Excellence",
      description: "Through dedication and disciplined study habits, I achieved first-year topper status, showcasing my commitment to academic excellence and establishing a strong foundation for future professional growth.",
      icon: Award
    },
    {
      year: "2020",
      title: "MBA Specialization",
      description: "Enhanced my expertise by pursuing an MBA with dual specialization in Supply Chain Management & Marketing, developing comprehensive knowledge in business operations and strategic market dynamics.",
      icon: GraduationCap
    },
    {
      year: "2021",
      title: "Professional Debut",
      description: "Secured a position as Warehouse Executive at Holisol, where I gained valuable hands-on experience in logistics operations and developed practical skills in supply chain management and process optimization.",
      icon: Briefcase
    },
    {
      year: "2022",
      title: "Graduation & Career Growth",
      description: "Successfully completed my MBA and advanced professionally by joining Holisol Corporate, transitioning from operational roles to strategic positions with broader organizational responsibilities.",
      icon: Briefcase
    },
    {
      year: "2024 (June)",
      title: "Data Science Exploration",
      description: "Recognized the transformative potential of AI in business operations and proactively embraced data science learning through LinkedIn and Coursera, adapting to evolving technological landscapes.",
      icon: Code
    },
    {
      year: "2024 (August)",
      title: "Data Analysis Certification",
      description: "Formalized my expertise in data analysis through professional certification, validating my technical skills in extracting actionable business insights from complex datasets.",
      icon: BarChart
    },
    {
      year: "2024 (October)",
      title: "Leadership Advancement",
      description: "Rejoined Holisol in a leadership capacity, spearheading comprehensive safety initiatives across PAN India operations and successfully managing cross-functional responsibilities.",
      icon: Briefcase
    },
    {
      year: "2025 (March)",
      title: "Technology Integration",
      description: "Leveraged my combined business acumen and technical skills to develop innovative automation solutions with AppScript and implement machine learning models, significantly driving operational efficiency and cost reduction.",
      icon: Rocket
    }
  ];

  return (
    <div className="min-h-screen pt-20 relative">
      <JourneyBackground />
      
      <style>
        {`
        @keyframes slideIn {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        
        .timeline-item {
          animation: slideIn 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .timeline-content {
          animation: fadeIn 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }
        
        .milestone-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(45deg, hsl(var(--primary)), hsl(var(--secondary)));
          background-size: 200% 200%;
          animation: pulse 2s infinite ease-in-out, gradientShift 6s infinite linear;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }
        
        .milestone-icon:hover {
          transform: scale(1.15);
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
        }
        
        .timeline-visual {
          opacity: 0;
          animation: fadeIn 0.8s ease-out 0.5s forwards;
          transition: transform 0.3s ease;
        }
        
        .timeline-visual:hover {
          transform: translateY(-5px);
        }
        
        .timeline-path {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 2px;
          background: linear-gradient(to bottom, 
            transparent, 
            hsl(var(--primary)), 
            hsl(var(--secondary)), 
            hsl(var(--primary)), 
            transparent);
          transform: translateX(-50%);
          z-index: -1;
        }
        `}
      </style>
      
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 text-white">My Professional Journey</h1>
            <p className="text-primary/80 max-w-2xl mx-auto backdrop-blur-sm bg-background/20 p-4 rounded-lg">
              A visual timeline of my career development and key milestones that have shaped my professional path.
            </p>
          </div>
          
          <div className="relative py-8 md:py-16">
            {/* Journey path line */}
            <div className="timeline-path"></div>
            
            <div className="space-y-24">
              {milestones.map((milestone, index) => (
                <div 
                  className="timeline-item" 
                  key={index}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {/* Milestone icon */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <MilestoneIcon icon={milestone.icon} milestone={milestone} />
                  </div>
                  
                  {/* Content cards - alternating sides with visuals */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left side */}
                    <div className={`${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                      {index % 2 === 0 ? (
                        <div 
                          className="timeline-content bg-white/90 dark:bg-card/90 backdrop-blur-lg shadow-xl rounded-xl p-6 border border-primary/20"
                          style={{ animationDelay: `${index * 0.15 + 0.3}s` }}
                        >
                          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm inline-block mb-3">
                            {milestone.year}
                          </div>
                          <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                          <p className="text-muted-foreground">
                            {milestone.description}
                          </p>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center opacity-100 md:opacity-100">
                          <TimelineVisual index={index} />
                        </div>
                      )}
                    </div>
                    
                    {/* Right side */}
                    <div className={`${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                      {index % 2 === 1 ? (
                        <div 
                          className="timeline-content bg-white/90 dark:bg-card/90 backdrop-blur-lg shadow-xl rounded-xl p-6 border border-primary/20"
                          style={{ animationDelay: `${index * 0.15 + 0.3}s` }}
                        >
                          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm inline-block mb-3">
                            {milestone.year}
                          </div>
                          <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                          <p className="text-muted-foreground">
                            {milestone.description}
                          </p>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center opacity-100 md:opacity-100">
                          <TimelineVisual index={index} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Journey;
