
import HeroSection from '@/components/home/HeroSection';
import JourneyPreview from '@/components/home/JourneyPreview';
import SkillsPreview from '@/components/home/SkillsPreview';
import ProjectsPreview from '@/components/home/ProjectsPreview';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <JourneyPreview />
      <SkillsPreview />
      <ProjectsPreview />
    </div>
  );
};

export default Home;
