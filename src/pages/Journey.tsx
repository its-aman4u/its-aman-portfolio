
import { Bike } from 'lucide-react';

const Journey = () => {
  const milestones = [
    {
      year: "2016",
      title: "Academic Pivot",
      description: "Opted for commerce after scoring low marks in 12th, beginning my journey in business studies."
    },
    {
      year: "2017",
      title: "Higher Education",
      description: "Joined ITM for B.Com after a gap year due to family issues, determined to excel academically."
    },
    {
      year: "2018",
      title: "Academic Excellence",
      description: "Became a first-year topper, setting the foundation for my academic achievements."
    },
    {
      year: "2020",
      title: "MBA Pursuit",
      description: "Started MBA in Supply Chain Management & Marketing, expanding my knowledge in business operations."
    },
    {
      year: "2021",
      title: "Professional Debut",
      description: "Joined Holisol as Warehouse Executive in November, gaining hands-on experience in logistics operations."
    },
    {
      year: "2022",
      title: "Graduation & Career Growth",
      description: "Completed MBA graduation and joined Holisol Corporate in March, transitioning to a strategic role."
    },
    {
      year: "2024 (June)",
      title: "Data Science Journey",
      description: "Embraced the AI boom by starting to learn data science via LinkedIn and Coursera, adapting to technological advances."
    },
    {
      year: "2024 (August)",
      title: "Data Analysis Certification",
      description: "Earned certification in Data Analysis, formalizing my expertise in this growing field."
    },
    {
      year: "2024 (October)",
      title: "Leadership Role",
      description: "Rejoined Holisol and led safety meetings PAN India, taking on cross-functional leadership responsibilities."
    },
    {
      year: "2025 (March)",
      title: "Technology Integration",
      description: "Working on automation with AppScript and developing ML models, combining business knowledge with technical skills."
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">My Career Journey</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
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
                    <div className="bg-white dark:bg-card shadow-md rounded-lg p-6 md:max-w-md w-full animate-fade-in">
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
