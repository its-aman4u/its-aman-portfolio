
import { Mail, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import ThreeScene from '@/components/ThreeScene';

const HeroSection = () => {
  return (
    <section className="relative pt-20 pb-0 md:pt-20 md:pb-0 overflow-hidden">
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
