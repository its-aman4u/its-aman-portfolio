
import { useState } from 'react';
import { 
  BarChart3, Database, LineChart, Cog, Globe, Users, Brain, 
  Code, Search, Layout, Sparkles, Gauge
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Skills' },
    { id: 'technical', name: 'Technical' },
    { id: 'business', name: 'Business' },
    { id: 'soft', name: 'Soft Skills' }
  ];
  
  const skills = [
    {
      title: "Data Analysis",
      description: "Expert in cleaning, analyzing, and visualizing data to drive business decisions.",
      icon: BarChart3,
      category: "technical"
    },
    {
      title: "Process Optimization",
      description: "Redesigning workflows to improve efficiency, reduce costs, and enhance productivity.",
      icon: Cog,
      category: "business"
    },
    {
      title: "Supply Chain Management",
      description: "Expertise in logistics, procurement, vendor negotiation, and SCM trainings.",
      icon: Gauge,
      category: "business"
    },
    {
      title: "Automation",
      description: "Creating scripts and tools to automate routine tasks with Google AppScript, APIs, etc.",
      icon: Sparkles,
      category: "technical"
    },
    {
      title: "Microsoft 365",
      description: "Advanced skills in the full suite of Microsoft productivity and collaboration tools.",
      icon: Database,
      category: "technical"
    },
    {
      title: "Marketing Campaigns",
      description: "Experience in campaign design, brand visibility, sales optimization, and SEO.",
      icon: Globe,
      category: "business"
    },
    {
      title: "Customer Service",
      description: "Expertise in issue resolution, customer satisfaction, and relationship management.",
      icon: Users,
      category: "business"
    },
    {
      title: "AI & Prompt Engineering",
      description: "Skilled in utilizing and fine-tuning AI models for business applications.",
      icon: Brain,
      category: "technical"
    },
    {
      title: "Web Development",
      description: "Knowledge of web technologies and design principles for creating effective digital experiences.",
      icon: Code,
      category: "technical"
    },
    {
      title: "Data Visualization",
      description: "Creating clear, insightful visualizations with tools like Power BI and other platforms.",
      icon: LineChart,
      category: "technical"
    },
    {
      title: "SEO Optimization",
      description: "Implementing strategies to improve online visibility and search engine rankings.",
      icon: Search,
      category: "technical"
    },
    {
      title: "UI/UX Design",
      description: "Designing user-centered interfaces that enhance user experience and engagement.",
      icon: Layout,
      category: "technical"
    },
    {
      title: "Leadership",
      description: "Leading teams and initiatives with clear vision and effective communication.",
      icon: Users,
      category: "soft"
    },
    {
      title: "Critical Thinking",
      description: "Analyzing complex problems and developing innovative solutions.",
      icon: Brain,
      category: "soft"
    },
    {
      title: "Communication",
      description: "Effectively conveying ideas and information to diverse audiences.",
      icon: Users,
      category: "soft"
    }
  ];
  
  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory);

  return (
    <div className="min-h-screen pt-20">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Skills & Expertise</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              An overview of my professional capabilities and areas of specialization.
            </p>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className="mb-2"
              >
                {category.name}
              </Button>
            ))}
          </div>
          
          {/* Skills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill, index) => (
              <div 
                key={index} 
                className="skill-card animate-fade-in" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <skill.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">{skill.title}</h3>
                <p className="text-muted-foreground text-center">
                  {skill.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Skills;
