
import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Stars, Float } from '@react-three/drei';
import { Suspense } from 'react';

// Simple Island component
function Island(props: any) {
  const meshRef = useRef<any>();
  const [hovered, setHover] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05;
    }
  });

  return (
    <group {...props}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          scale={hovered ? 1.05 : 1}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        >
          <cylinderGeometry args={[3, 3.5, 0.4, 6]} />
          <meshStandardMaterial color={hovered ? "#1A6A8F" : "#53A2BE"} />
          
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
            <mesh position={[0, 1.2, 0]} rotation={[0, 0.5, 0]}>
              <coneGeometry args={[0.6, 0.6, 4]} />
              <meshStandardMaterial color="#142936" />
            </mesh>
          </group>
        </mesh>
      </Float>
    </group>
  );
}

// Simple bicycle model representing your cycling-themed portfolio
function Bicycle(props: any) {
  const meshRef = useRef<any>();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group ref={meshRef} {...props}>
      {/* Frame */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.3, 0.03, 8, 24]} />
        <meshStandardMaterial color="#1A6A8F" />
      </mesh>
      
      {/* Wheels */}
      <mesh position={[0.3, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.2, 0.02, 8, 24]} />
        <meshStandardMaterial color="#53A2BE" />
      </mesh>
      <mesh position={[-0.3, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.2, 0.02, 8, 24]} />
        <meshStandardMaterial color="#53A2BE" />
      </mesh>
    </group>
  );
}

// 3D Scene containing all elements
export function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Island position={[0, -2, -2]} />
      <Bicycle position={[0, 0, 0]} />
      <Stars radius={100} depth={50} count={1000} factor={4} />
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        minDistance={3}
        maxDistance={8}
      />
      <Environment preset="sunset" />
    </>
  );
}

// Main component that renders the Canvas
const ThreeScene = () => {
  return (
    <div className="three-scene-container h-[500px] md:h-[600px] w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-5 left-0 right-0 text-center text-white text-shadow-lg pointer-events-none">
        <p className="text-sm opacity-70">Scroll to zoom, click and drag to rotate</p>
      </div>
    </div>
  );
};

export default ThreeScene;
