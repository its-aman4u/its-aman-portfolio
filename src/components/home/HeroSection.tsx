
import { Mail, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import ThreeScene from '@/components/ThreeScene';
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

const HeroSection = () => {
  return (
    <section className="relative pt-20 pb-0 md:pt-20 md:pb-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cycle-light to-muted dark:from-cycle-dark dark:to-background -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="order-2 md:order-1 animate-fade-in">
            <div className="flex items-center gap-6 mb-4">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-primary overflow-hidden shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105">
                    <img 
                      src="/lovable-uploads/247886eb-a665-4597-bfee-6d4be11a09e8.png" 
                      alt="Aman Singh" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">Aman Singh</h4>
                      <p className="text-sm">
                        Data Scientist & Process Optimization Specialist with 3+ years of experience
                      </p>
                      <div className="flex items-center pt-2">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-100">
                          Available for hire
                        </span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
              
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                  Aman Singh
                </h1>
                <h2 className="text-xl md:text-2xl text-primary font-medium">
                  Data Scientist & Process Optimization Specialist
                </h2>
              </div>
            </div>
            
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
          
          <div className="order-1 md:order-2 flex justify-center animate-fade-in">
            <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-lg">
              <ThreeScene />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
