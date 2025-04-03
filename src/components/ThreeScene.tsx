
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Stars, useTexture } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';

// Simple Island component
function Island({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05;
      if (hovered) {
        meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
      }
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[3, 3.5, 0.4, 6]} />
        <meshStandardMaterial color={hovered ? "#64B5D9" : "#53A2BE"} />
        
        {/* Simple trees */}
        <group position={[1, 0.4, 0]}>
          <mesh position={[0, 0.7, 0]}>
            <coneGeometry args={[0.5, 1.2, 6]} />
            <meshStandardMaterial color="#53BE76" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.4, 6]} />
            <meshStandardMaterial color="#8B5A2B" />
          </mesh>
        </group>
        
        {/* Another tree */}
        <group position={[-1.2, 0.4, 1]}>
          <mesh position={[0, 0.7, 0]}>
            <coneGeometry args={[0.4, 1, 6]} />
            <meshStandardMaterial color="#53BE76" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.4, 6]} />
            <meshStandardMaterial color="#8B5A2B" />
          </mesh>
        </group>
        
        {/* Simple building representing career */}
        <group position={[0, 0.4, -1]}>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.8, 1, 0.8]} />
            <meshStandardMaterial color="#E8F3F7" />
          </mesh>
          <mesh position={[0, 1.2, 0]}>
            <coneGeometry args={[0.6, 0.6, 4]} />
            <meshStandardMaterial color="#142936" />
          </mesh>
        </group>
      </mesh>
    </group>
  );
}

// Interactive bicycle model
function Bicycle({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const [speed, setSpeed] = useState(0.3);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * speed;
      if (hovered) {
        groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
      }
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={position}
      onPointerOver={() => {
        setHovered(true);
        setSpeed(0.6);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        setSpeed(0.3);
        document.body.style.cursor = 'default';
      }}
      onClick={() => setSpeed(prev => prev > 0.5 ? 0.3 : 0.9)}
    >
      {/* Frame */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.3, 0.03, 8, 24]} />
        <meshStandardMaterial color={hovered ? "#2A8AB5" : "#1A6A8F"} metalness={0.6} roughness={0.2} />
      </mesh>
      
      {/* Wheels */}
      <mesh position={[0.3, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.2, 0.02, 8, 24]} />
        <meshStandardMaterial color={hovered ? "#64B5D9" : "#53A2BE"} metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[-0.3, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.2, 0.02, 8, 24]} />
        <meshStandardMaterial color={hovered ? "#64B5D9" : "#53A2BE"} metalness={0.6} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Profile picture component with texture
function ProfilePicture({ position }: { position: [number, number, number] }) {
  const textureUrl = "/lovable-uploads/247886eb-a665-4597-bfee-6d4be11a09e8.png";
  const texture = useTexture(textureUrl);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Add a frame behind the profile picture
  const frameSize = 1.6;
  
  useFrame((state) => {
    if (meshRef.current) {
      // More subtle floating movement
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
      
      if (hovered) {
        meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      } else {
        meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05;
      }
    }
  });

  return (
    <group position={position}>
      {/* Frame behind the picture */}
      <mesh position={[0, 0, -0.01]} scale={[1.05, 1.05, 1]}>
        <planeGeometry args={[frameSize, frameSize]} />
        <meshStandardMaterial color="#1A6A8F" />
      </mesh>
      
      {/* Main profile picture */}
      <mesh 
        ref={meshRef} 
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
        scale={hovered ? [1.02, 1.02, 1.02] : [1, 1, 1]}
      >
        <planeGeometry args={[frameSize - 0.1, frameSize - 0.1]} />
        <meshStandardMaterial 
          map={texture} 
          transparent={true}
          emissive={"#ffffff"}
          emissiveIntensity={hovered ? 0.1 : 0}
        />
      </mesh>
    </group>
  );
}

// 3D Scene containing all elements
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Island position={[0, -2, -2]} />
      <Bicycle position={[0, 0, 0]} />
      <ProfilePicture position={[2, 0, 0]} />
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0.5} fade speed={1.5} />
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        minDistance={3}
        maxDistance={8}
        autoRotate={false}
        autoRotateSpeed={0.5}
        enableDamping={true}
        dampingFactor={0.05}
      />
      <Environment preset="sunset" />
    </>
  );
}

// Main component that renders the Canvas
const ThreeScene = () => {
  return (
    <div className="three-scene-container h-full w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-5 left-0 right-0 text-center text-white text-shadow-sm pointer-events-none bg-black/20 py-2 backdrop-blur-sm">
        <p className="text-sm">Click on the bicycle to speed it up! Scroll to zoom, click and drag to rotate</p>
      </div>
    </div>
  );
};

export default ThreeScene;
