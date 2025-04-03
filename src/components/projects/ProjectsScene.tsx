
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, Text } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// 3D Project Card component with enhanced interactivity
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
  const [clicked, setClicked] = useState(false);
  
  // Use React Three Fiber's useFrame hook for animations
  useFrame((state) => {
    if (meshRef.current) {
      // Add floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * (hovered ? 1.5 : 0.8)) * 0.1;
      
      // Add subtle rotation
      if (hovered) {
        meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
      }
    }
  });
  
  return (
    <mesh 
      position={position}
      ref={meshRef} 
      onClick={() => {
        onClick();
        setClicked(true);
        setTimeout(() => setClicked(false), 300);
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
        setHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
        setHovered(false);
      }}
      scale={clicked ? [0.9, 0.9, 0.9] : hovered ? [1.1, 1.1, 1.1] : [1, 1, 1]}
    >
      <boxGeometry args={[1.8, 0.6, 1.8]} />
      <meshStandardMaterial 
        color={hovered ? new THREE.Color(color).offsetHSL(0, 0.1, 0.2).getHex() : color} 
        metalness={0.4}
        roughness={0.2}
      />
    </mesh>
  );
}

// Floating title component
function ProjectTitle({ 
  position, 
  title, 
  color 
}: { 
  position: [number, number, number], 
  title: string, 
  color: string 
}) {
  const textRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (textRef.current) {
      // Make text always face the camera
      textRef.current.lookAt(state.camera.position);
      
      // Add subtle floating movement
      textRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.8) * 0.1;
    }
  });
  
  return (
    <group ref={textRef} position={position}>
      <Text
        color={color}
        fontSize={0.2}
        maxWidth={2}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>
    </group>
  );
}

// Enhanced 3D Visualization Component
function Scene({ scrollToProject }: { scrollToProject: (index: number) => void }) {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Add gentle rotation to the entire scene
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <group ref={groupRef}>
        <ProjectCard 
          position={[-2.5, 0, 0]} 
          color="#1A6A8F" 
          title="O3 Automation" 
          onClick={() => {
            setActiveProject(0);
            scrollToProject(0);
          }}
        />
        
        <ProjectTitle 
          position={[-2.5, -0.6, 0]} 
          title="O3 Automation" 
          color="#ffffff" 
        />
        
        <ProjectCard 
          position={[0, 0, 0]} 
          color="#53A2BE" 
          title="AI Portfolios" 
          onClick={() => {
            setActiveProject(1);
            scrollToProject(1);
          }}
        />
        
        <ProjectTitle 
          position={[0, -0.6, 0]} 
          title="AI Portfolios" 
          color="#ffffff" 
        />
        
        <ProjectCard 
          position={[2.5, 0, 0]} 
          color="#53BE76" 
          title="Masterclass Scheduler" 
          onClick={() => {
            setActiveProject(2);
            scrollToProject(2);
          }}
        />
        
        <ProjectTitle 
          position={[2.5, -0.6, 0]} 
          title="Masterclass Scheduler" 
          color="#ffffff" 
        />
      </group>
      
      <Stars 
        radius={100} 
        depth={50} 
        count={1000} 
        factor={4} 
        saturation={0.5}
        fade
        speed={0.5}
      />
      
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minDistance={4}
        maxDistance={10}
        enableDamping={true}
        dampingFactor={0.05}
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
      
      <div className="absolute bottom-5 left-0 right-0 text-center text-primary text-shadow-lg pointer-events-none">
        <p className="text-sm">Click on a project to learn more or interact with the 3D scene</p>
      </div>
    </section>
  );
};

export default ProjectsScene;
