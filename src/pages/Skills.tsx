import { useState } from 'react';
import { 
  BarChart3, Database, LineChart, Cog, Globe, Users, Brain, 
  Code, Search, Layout, Sparkles, Gauge, ShieldAlert
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'All Skills' },
    { id: 'technical', name: 'Systems & Engineering' },
    { id: 'business', name: 'Operations & Product' },
    { id: 'soft', name: 'Leadership' }
  ];
  
  const skills = [
    {
      title: "AI Integration & Prompt Guarding",
      description: "Integrating Gemini and local LLM configurations (Ollama/Deepseek) with custom system prompts, context routing, and dynamic data engines.",
      icon: Brain,
      category: "technical"
    },
    {
      title: "Secure DB Tunneling",
      description: "Configuring secure SSH database tunnels, RBAC access schemas, AES-256 Fernet data encryption, and read-only query safety gates.",
      icon: Database,
      category: "technical"
    },
    {
      title: "Data Pipelines & ETL",
      description: "Building Python-based automation pipelines with Pandas, DuckDB, SQLite, and Streamlit, transforming raw logs into gold analytics data.",
      icon: BarChart3,
      category: "technical"
    },
    {
      title: "Process Automation",
      description: "Designing high-leverage scripts (Google Apps Script, REST APIs, SFTP transfers) automating file uploads, saving 151.5 hours of manual work/month.",
      icon: Cog,
      category: "technical"
    },
    {
      title: "Modern Web Engineering",
      description: "Developing premium full-stack interfaces in React, TypeScript, Tailwind CSS, Vite, and Node, utilizing three.js / WebGL space UI.",
      icon: Code,
      category: "technical"
    },
    {
      title: "Zero-Trust Security",
      description: "Designing container sandboxing (Docker) and Model Context Protocol (MCP) prompt guarding systems to protect autonomous AI developer environments.",
      icon: ShieldAlert,
      category: "technical"
    },
    {
      title: "Supply Chain Operations",
      description: "Deep knowledge of warehouse management systems (WMS), fulfillment centers (FC) operating plans, P&L variance audits, and Last-Mile cost structures.",
      icon: Gauge,
      category: "business"
    },
    {
      title: "Product Strategy & Specs",
      description: "Authoring comprehensive product requirement documents (PRD/BRD), user stories, API definitions, and sprint planning schedules in JIRA.",
      icon: Layout,
      category: "business"
    },
    {
      title: "Executive Leadership",
      description: "Managing PAN India operations, safety compliance, and coordinating cross-functional team collaborations to drive bottomline savings.",
      icon: Users,
      category: "soft"
    },
    {
      title: "Critical Problem Solving",
      description: "Root cause analysis (RCA) on operational floor failures and translating operational business logics into scalable code structures.",
      icon: Sparkles,
      category: "soft"
    }
  ];
  
  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory);

  return (
    <div className="relative min-h-screen pt-24 pb-12 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cycle-light to-muted dark:from-cycle-dark dark:to-background -z-10"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl -z-10 animate-pulse delay-500"></div>

      <section className="py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Skills & Expertise</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              An overview of my technical toolkit, supply chain systems background, and high-impact capabilities.
            </p>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className={`mb-2 transition-all duration-300 ${activeCategory === category.id ? '' : 'glass-button border-white/20'}`}
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
                className="glass-card p-6 flex flex-col items-center text-center animate-fade-in" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 bg-primary/15 rounded-full flex items-center justify-center border border-white/20">
                    <skill.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{skill.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
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
