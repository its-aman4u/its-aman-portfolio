
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
      description: "After facing challenges with my 12th standard scores, I made a strategic decision to pursue commerce, laying the foundation for my career in business studies."
    },
    {
      year: "2017",
      title: "Higher Education",
      description: "Despite family challenges that led to a gap year, I persevered and enrolled at ITM for a Bachelor of Commerce degree, determined to excel academically."
    },
    {
      year: "2018",
      title: "Academic Excellence",
      description: "Through dedication and focused study, I achieved first-year topper status, demonstrating my commitment to academic excellence and establishing a strong foundation for future success."
    },
    {
      year: "2020",
      title: "MBA Specialization",
      description: "Expanded my expertise by pursuing an MBA with dual specialization in Supply Chain Management & Marketing, developing comprehensive knowledge in business operations and market dynamics."
    },
    {
      year: "2021",
      title: "Professional Debut",
      description: "Secured a position as Warehouse Executive at Holisol, where I gained hands-on experience in logistics operations and developed practical skills in supply chain management."
    },
    {
      year: "2022",
      title: "Graduation & Career Growth",
      description: "Successfully completed my MBA and advanced my career by joining Holisol Corporate, transitioning from operational roles to strategic positions with broader responsibilities."
    },
    {
      year: "2024 (June)",
      title: "Data Science Exploration",
      description: "Recognized the transformative potential of AI in business, and proactively embraced data science learning through LinkedIn and Coursera, adapting to evolving technological landscapes."
    },
    {
      year: "2024 (August)",
      title: "Data Analysis Certification",
      description: "Formalized my expertise in data analysis through professional certification, validating my skills in extracting actionable insights from complex datasets."
    },
    {
      year: "2024 (October)",
      title: "Leadership Advancement",
      description: "Rejoined Holisol in a leadership capacity, spearheading safety initiatives across PAN India operations and successfully managing cross-functional responsibilities."
    },
    {
      year: "2025 (March)",
      title: "Technology Integration",
      description: "Leveraged my combined business acumen and technical skills to develop automation solutions with AppScript and implement machine learning models, driving operational efficiency."
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
            <div className="cycle-path">
              <div className="space-y-16 md:space-y-28">
                {milestones.map((milestone, index) => (
                  <div className="cycle-milestone" key={index}>
                    <div className="cycle-dot">
                      <Bike className="w-4 h-4 text-white" />
                    </div>
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Journey;
