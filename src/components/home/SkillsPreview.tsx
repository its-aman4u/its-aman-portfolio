
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const SkillsPreview = () => {
  return (
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
  );
};

export default SkillsPreview;
