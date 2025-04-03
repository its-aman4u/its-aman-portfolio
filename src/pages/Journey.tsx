
import { Bike } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars, Environment, OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';

// 3D Background for Journey Page
const JourneyBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.1}
          />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
};

const Journey = () => {
  const milestones = [
    {
      year: "2016",
      title: "Academic Pivot",
      description: "Made a strategic career decision to pursue commerce after 12th standard, establishing a solid foundation for my future business studies despite initial academic challenges."
    },
    {
      year: "2017",
      title: "Higher Education",
      description: "Despite facing significant family challenges that resulted in a gap year, I demonstrated resilience by enrolling at ITM to pursue a Bachelor of Commerce degree, determined to excel academically."
    },
    {
      year: "2018",
      title: "Academic Excellence",
      description: "Through dedication and disciplined study habits, I achieved first-year topper status, showcasing my commitment to academic excellence and establishing a strong foundation for future professional growth."
    },
    {
      year: "2020",
      title: "MBA Specialization",
      description: "Enhanced my expertise by pursuing an MBA with dual specialization in Supply Chain Management & Marketing, developing comprehensive knowledge in business operations and strategic market dynamics."
    },
    {
      year: "2021",
      title: "Professional Debut",
      description: "Secured a position as Warehouse Executive at Holisol, where I gained valuable hands-on experience in logistics operations and developed practical skills in supply chain management and process optimization."
    },
    {
      year: "2022",
      title: "Graduation & Career Growth",
      description: "Successfully completed my MBA and advanced professionally by joining Holisol Corporate, transitioning from operational roles to strategic positions with broader organizational responsibilities."
    },
    {
      year: "2024 (June)",
      title: "Data Science Exploration",
      description: "Recognized the transformative potential of AI in business operations and proactively embraced data science learning through LinkedIn and Coursera, adapting to evolving technological landscapes."
    },
    {
      year: "2024 (August)",
      title: "Data Analysis Certification",
      description: "Formalized my expertise in data analysis through professional certification, validating my technical skills in extracting actionable business insights from complex datasets."
    },
    {
      year: "2024 (October)",
      title: "Leadership Advancement",
      description: "Rejoined Holisol in a leadership capacity, spearheading comprehensive safety initiatives across PAN India operations and successfully managing cross-functional responsibilities."
    },
    {
      year: "2025 (March)",
      title: "Technology Integration",
      description: "Leveraged my combined business acumen and technical skills to develop innovative automation solutions with AppScript and implement machine learning models, significantly driving operational efficiency and cost reduction."
    }
  ];

  return (
    <div className="min-h-screen pt-20 relative">
      <JourneyBackground />
      
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 text-white">My Career Journey</h1>
            <p className="text-primary/80 max-w-2xl mx-auto backdrop-blur-sm bg-background/20 p-4 rounded-lg">
              Follow my professional path, visualized as a cycling journey through significant milestones and achievements.
            </p>
          </div>
          
          <div className="relative py-8 md:py-16 lg:px-12">
            {/* Journey path line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 rounded-full"></div>
            
            <div className="space-y-16 md:space-y-28">
              {milestones.map((milestone, index) => (
                <div className="relative" key={index}>
                  {/* Cycling dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="bg-primary text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                      <Bike className="w-4 h-4" />
                    </div>
                  </div>
                  
                  {/* Content card - alternating sides */}
                  <div className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    <div className="bg-white/90 dark:bg-card/90 backdrop-blur-sm shadow-md rounded-lg p-6 md:max-w-md w-full animate-fade-in hover:transform hover:scale-105 transition-all duration-300">
                      <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm inline-block mb-3">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                      <p className="text-muted-foreground">
                        {milestone.description}
                      </p>
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
