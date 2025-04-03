
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';

// 3D Project Card component
function ProjectCard({ 
  position, 
  color, 
  title, 
  onClick 
}: { 
  position: [number, number, number], 
  color: string, 
  title: string, 
  onClick: () => void 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  return (
    <mesh 
      position={position}
      ref={meshRef} 
      onClick={onClick}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
        setHovered(true);
        if (meshRef.current) meshRef.current.scale.set(1.1, 1.1, 1.1);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
        setHovered(false);
        if (meshRef.current) meshRef.current.scale.set(1, 1, 1);
      }}
      scale={hovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
    >
      <boxGeometry args={[1.5, 0.5, 1.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// 3D Visualization Component
function Scene({ scrollToProject }: { scrollToProject: (index: number) => void }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <ProjectCard 
        position={[-2, 0, 0]} 
        color="#1A6A8F" 
        title="O3 Automation" 
        onClick={() => scrollToProject(0)}
      />
      
      <ProjectCard 
        position={[0, 0, 0]} 
        color="#53A2BE" 
        title="AI Portfolios" 
        onClick={() => scrollToProject(1)}
      />
      
      <ProjectCard 
        position={[2, 0, 0]} 
        color="#53BE76" 
        title="Masterclass Scheduler" 
        onClick={() => scrollToProject(2)}
      />
      
      <Stars radius={100} depth={50} count={1000} factor={4} />
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minDistance={4}
        maxDistance={10}
      />
      <Environment preset="sunset" />
    </>
  );
}

const ProjectsScene = ({ scrollToProject }: { scrollToProject: (index: number) => void }) => {
  return (
    <section className="h-[500px] w-full mb-16 relative">
      <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
        <Suspense fallback={null}>
          <Scene scrollToProject={scrollToProject} />
        </Suspense>
      </Canvas>
      
      {/* Project labels using HTML overlay */}
      <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
        <div className="flex justify-center items-center h-full">
          <div className="flex gap-16 sm:gap-24 md:gap-32">
            <div className="text-white font-bold transform translate-x-[-32px]">O3 Automation</div>
            <div className="text-white font-bold">AI Portfolios</div>
            <div className="text-white font-bold transform translate-x-[32px]">Masterclass Scheduler</div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-5 left-0 right-0 text-center text-primary text-shadow-lg pointer-events-none">
        <p className="text-sm">Click on a project to learn more</p>
      </div>
    </section>
  );
};

export default ProjectsScene;
