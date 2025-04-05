
import { ArrowRight, Bike } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import './cycle-path.css';

const JourneyPreview = () => {
  return (
    <section className="py-16 bg-white dark:bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">My Career Journey</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore my professional path, visualized as a cycling journey through significant career milestones.
          </p>
        </div>
        
        <div className="relative py-8 lg:px-12">
          <div className="cycle-path">
            {/* Preview Timeline with 3 items */}
            <div className="space-y-12 md:space-y-24">
              {/* First Milestone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:order-1">
                  <div className="cycle-milestone">
                    <div className="cycle-dot">
                      <Bike className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white dark:bg-muted shadow-md rounded-lg p-6 md:max-w-md w-full">
                      <h3 className="text-lg font-bold mb-2">Academic Foundation</h3>
                      <p className="text-sm text-muted-foreground mb-2">2016 - 2018</p>
                      <p className="text-sm">
                        After completing 12th standard, I strategically chose commerce to build my business foundation. Following a gap year due to family circumstances, I enrolled at ITM for Bachelor of Commerce studies where I achieved first-year topper status through dedicated academic focus.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="md:order-2 hidden md:flex justify-center items-center">
                  <div className="p-4 bg-primary/10 rounded-full shadow-lg animate-pulse">
                    <Bike className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </div>
              
              {/* Second Milestone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:order-2">
                  <div className="cycle-milestone">
                    <div className="cycle-dot">
                      <Bike className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white dark:bg-muted shadow-md rounded-lg p-6 md:max-w-md w-full">
                      <h3 className="text-lg font-bold mb-2">Professional Growth</h3>
                      <p className="text-sm text-muted-foreground mb-2">2020 - 2022</p>
                      <p className="text-sm">
                        Expanded my expertise with an MBA specializing in Supply Chain Management & Marketing. Successfully transitioned into the professional sphere by joining Holisol as a Warehouse Executive, gaining valuable hands-on experience in logistics operations.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="md:order-1 hidden md:flex justify-center items-center">
                  <div className="p-4 bg-primary/10 rounded-full shadow-lg animate-pulse">
                    <Bike className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </div>
              
              {/* Third Milestone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:order-1">
                  <div className="cycle-milestone">
                    <div className="cycle-dot">
                      <Bike className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white dark:bg-muted shadow-md rounded-lg p-6 md:max-w-md w-full">
                      <h3 className="text-lg font-bold mb-2">Data Science Journey</h3>
                      <p className="text-sm text-muted-foreground mb-2">2024 - Present</p>
                      <p className="text-sm">
                        Recognized the transformative potential of AI in business operations and obtained professional certification in Data Analysis. Currently implementing automation solutions with AppScript and developing machine learning models to drive operational efficiency across the organization.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="md:order-2 hidden md:flex justify-center items-center">
                  <div className="p-4 bg-primary/10 rounded-full shadow-lg animate-pulse">
                    <Bike className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link to="/journey">
              View Full Journey <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default JourneyPreview;
