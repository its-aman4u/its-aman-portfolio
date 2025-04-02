
import { ArrowRight, Mail, Download, Bike } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cycle-light to-muted dark:from-cycle-dark dark:to-background -z-10"></div>
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="order-2 md:order-1 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Aman Singh
              </h1>
              <h2 className="text-xl md:text-2xl text-primary font-medium mb-6">
                Data Scientist & Process Optimization Specialist
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Strategic thinker with 3+ years of experience in HR analytics, process optimization, and safety compliance. 
                Passionate about leveraging data-driven insights to solve complex business challenges.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link to="/contact">
                    Contact Me <Mail className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://drive.google.com/file/d/1XiczZvGjJeaSTUxlIz_M_J9DgtsclVMa/view?usp=sharing" target="_blank" rel="noopener noreferrer">
                    Download CV <Download className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="order-1 md:order-2 flex justify-center animate-fade-in delay-100">
              <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 overflow-hidden rounded-full border-4 border-primary">
                <img 
                  src="/lovable-uploads/247886eb-a665-4597-bfee-6d4be11a09e8.png" 
                  alt="Aman Singh" 
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brief Journey Preview */}
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
                <div className="cycle-milestone">
                  <div className="cycle-dot">
                    <Bike className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-muted shadow-md rounded-lg p-6 md:max-w-md w-full">
                    <h3 className="text-lg font-bold mb-2">Started the Journey</h3>
                    <p className="text-sm text-muted-foreground mb-2">2016 - 2018</p>
                    <p className="text-sm">
                      Opted for commerce after 12th, joined ITM for B.Com after a gap year, and became a first-year topper.
                    </p>
                  </div>
                </div>
                
                {/* Second Milestone */}
                <div className="cycle-milestone">
                  <div className="cycle-dot">
                    <Bike className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-muted shadow-md rounded-lg p-6 md:max-w-md w-full">
                    <h3 className="text-lg font-bold mb-2">Professional Growth</h3>
                    <p className="text-sm text-muted-foreground mb-2">2020 - 2022</p>
                    <p className="text-sm">
                      Completed MBA in Supply Chain Management & Marketing and joined Holisol as Warehouse Executive.
                    </p>
                  </div>
                </div>
                
                {/* Third Milestone */}
                <div className="cycle-milestone">
                  <div className="cycle-dot">
                    <Bike className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-muted shadow-md rounded-lg p-6 md:max-w-md w-full">
                    <h3 className="text-lg font-bold mb-2">Data Science Journey</h3>
                    <p className="text-sm text-muted-foreground mb-2">2024 - Present</p>
                    <p className="text-sm">
                      Certified in Data Analysis and working on automation with AppScript and ML models.
                    </p>
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

      {/* Skills Preview */}
      <section className="py-16 bg-muted/50 dark:bg-background/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Core Skills</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A selection of my professional capabilities and expertise areas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Skill 1 */}
            <div className="skill-card">
              <h3 className="text-xl font-bold mb-3">Data Analysis</h3>
              <p className="text-muted-foreground">
                Transforming complex datasets into actionable insights through statistical analysis and data visualization.
              </p>
            </div>
            
            {/* Skill 2 */}
            <div className="skill-card">
              <h3 className="text-xl font-bold mb-3">Process Optimization</h3>
              <p className="text-muted-foreground">
                Redesigning workflows and systems to improve efficiency, reduce costs, and enhance productivity.
              </p>
            </div>
            
            {/* Skill 3 */}
            <div className="skill-card">
              <h3 className="text-xl font-bold mb-3">Automation</h3>
              <p className="text-muted-foreground">
                Creating scripts and tools to automate routine tasks and streamline operations.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/skills">
                Explore All Skills <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Projects Preview */}
      <section className="py-16 bg-white dark:bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A showcase of my recent work and ongoing initiatives.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project 1 */}
            <div className="project-card">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">O3 Automation</h3>
                <p className="text-muted-foreground mb-4">
                  Automated system for optimizing operational workflows and enhancing efficiency.
                </p>
                <p className="text-sm text-primary">Ongoing</p>
              </div>
            </div>
            
            {/* Project 2 */}
            <div className="project-card">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">AI Portfolios</h3>
                <p className="text-muted-foreground mb-4">
                  Leveraging AI to create dynamic and personalized portfolio presentations.
                </p>
                <p className="text-sm text-primary">Ongoing</p>
              </div>
            </div>
            
            {/* Project 3 */}
            <div className="project-card">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Masterclass Scheduler</h3>
                <p className="text-muted-foreground mb-4">
                  Intelligent scheduling system for optimizing training and development programs.
                </p>
                <p className="text-sm text-primary">Ongoing</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/projects">
                View All Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
