import { Mail, Download, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import ThreeScene from '@/components/ThreeScene';
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

const HeroSection = () => {
  return (
    <section className="relative pt-24 pb-12 md:pt-28 md:pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cycle-light to-muted dark:from-cycle-dark dark:to-background -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="order-2 md:order-1 animate-fade-in">
            <div className="flex items-center gap-6 mb-6">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-primary overflow-hidden shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 cursor-pointer">
                    <img 
                      src="/lovable-uploads/247886eb-a665-4597-bfee-6d4be11a09e8.png" 
                      alt="Aman Singh" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://api.dicebear.com/7.x/initials/svg?seed=Aman%20Singh&backgroundColor=145050&textColor=ffffff";
                      }}
                    />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 glass-panel border border-white/25">
                  <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">Aman Singh</h4>
                      <p className="text-sm">
                        AI-Native Systems Architect & Automation Specialist with 3+ years of experience.
                      </p>
                      <div className="flex items-center pt-2">
                        <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full dark:bg-green-950 dark:text-green-200 border border-green-300/30">
                          Active & Open to Roles
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
                <h2 className="text-xl md:text-2xl text-primary font-semibold flex items-center gap-2 mt-1">
                  AI-Native Systems Architect
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                </h2>
              </div>
            </div>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Sleek architect of high-leverage enterprise integrations, secure database connectors, and process automations. 
              Powered by 3+ years of operational floor logic, custom pipelines, and intelligent AI configurations.
            </p>

            {/* Quantified Impact Badges */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="glass-panel p-4 rounded-xl border border-white/20">
                <div className="text-2xl md:text-3xl font-extrabold text-primary">₹1.3 Crore+</div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Bottomline Savings</div>
              </div>
              <div className="glass-panel p-4 rounded-xl border border-white/20">
                <div className="text-2xl md:text-3xl font-extrabold text-primary">151.5 Hours</div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Saved / Month</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start flex-wrap">
              <Button className="bg-primary text-white hover:bg-primary/95 border border-white/25 shadow-lg shadow-primary/20" asChild>
                <Link to="/chatbot">
                  Chat with Genesis AI <Sparkles className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="glass-button border-white/20" asChild>
                <a href="/ai_automation_architect_master.pdf" download="Aman_Singh_AI_Systems_Architect.pdf">
                  Architect CV <Download className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="glass-button border-white/20" asChild>
                <a href="/premium_fullstack_uiux.pdf" download="Aman_Singh_Fullstack_Engineer.pdf">
                  Full-Stack CV <Download className="ml-1.5 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center animate-fade-in">
            <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-2xl glass-panel border border-white/10">
              <ThreeScene />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
