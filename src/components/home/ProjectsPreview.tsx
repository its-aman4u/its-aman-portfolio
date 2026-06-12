import { ArrowRight, Github, ExternalLink, Layout, Brain, Activity, Newspaper, Target, Database, Terminal, ShieldAlert, Clock, FileText, CheckSquare, FileSpreadsheet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { projectsData } from '@/data/projects';

const ProjectsPreview = () => {
  // Show first 3 projects as featured
  const featuredProjects = projectsData.slice(0, 3);

  // Helper to resolve dynamic gradient and Lucide icon for each project category
  const getProjectDesign = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("cyber creative")) return {
      gradient: "from-blue-600/20 to-indigo-600/35",
      icon: Layout,
      color: "text-blue-400"
    };
    if (t.includes("exam prep")) return {
      gradient: "from-purple-600/20 to-pink-600/35",
      icon: Brain,
      color: "text-purple-400"
    };
    if (t.includes("recovery clinic")) return {
      gradient: "from-teal-600/20 to-emerald-600/35",
      icon: Activity,
      color: "text-teal-400"
    };
    if (t.includes("citizen news")) return {
      gradient: "from-emerald-700/20 to-teal-800/35",
      icon: Newspaper,
      color: "text-emerald-400"
    };
    if (t.includes("digital genesis")) return {
      gradient: "from-amber-500/20 to-orange-600/35",
      icon: Target,
      color: "text-amber-400"
    };
    if (t.includes("hwms insights")) return {
      gradient: "from-cyan-600/20 to-teal-600/35",
      icon: Database,
      color: "text-cyan-400"
    };
    if (t.includes("insightforge")) return {
      gradient: "from-indigo-600/20 to-blue-600/35",
      icon: Terminal,
      color: "text-indigo-400"
    };
    if (t.includes("zero-trust")) return {
      gradient: "from-rose-600/20 to-red-700/35",
      icon: ShieldAlert,
      color: "text-rose-400"
    };
    if (t.includes("omnichannel tat")) return {
      gradient: "from-amber-600/20 to-yellow-600/35",
      icon: Clock,
      color: "text-amber-400"
    };
    if (t.includes("ptw")) return {
      gradient: "from-cyan-600/20 to-sky-600/35",
      icon: FileText,
      color: "text-cyan-400"
    };
    if (t.includes("increff")) return {
      gradient: "from-emerald-600/20 to-teal-600/35",
      icon: FileSpreadsheet,
      color: "text-emerald-400"
    };
    return {
      gradient: "from-slate-600/20 to-gray-700/35",
      icon: CheckSquare,
      color: "text-slate-400"
    };
  };

  return (
    <section className="py-20 relative overflow-hidden bg-white/5 dark:bg-card/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Featured Projects</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A showcase of recent high-impact solutions, interactive portals, and automated integrations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, i) => {
            const { gradient, icon: Icon, color: iconColor } = getProjectDesign(project.title);
            return (
              <div key={i} className="glass-card flex flex-col justify-between overflow-hidden">
                <div>
                  {/* Dynamic Gradient / SVG Header */}
                  <div className={`h-48 bg-gradient-to-br ${gradient} flex items-center justify-center relative border-b border-white/10 overflow-hidden`}>
                    <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:20px_20px]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="p-4 rounded-xl bg-white/5 dark:bg-black/20 border border-white/20 dark:border-white/10 backdrop-blur-md">
                      <Icon className={`w-12 h-12 ${iconColor}`} />
                    </div>
                    <div className="absolute top-3 right-3 bg-primary/95 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border border-white/20 backdrop-blur-sm">
                      {project.status}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-foreground">{project.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                      {project.description}
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="bg-white/10 dark:bg-white/5 border border-white/10 text-muted-foreground text-[10px] px-2 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="text-[10px] text-muted-foreground pt-0.5">+{project.tech.length - 3} more</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 glass-button text-xs h-9 border-white/20" asChild>
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-1.5 h-3.5 w-3.5" /> Code
                      </a>
                    </Button>
                    {project.link && project.link !== "#" && (
                      <Button size="sm" className="flex-1 text-xs h-9 bg-primary text-white border border-white/20" asChild>
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <Button variant="outline" className="glass-button border-white/25 px-6 animate-pulse" asChild>
            <Link to="/projects">
              View All Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsPreview;
