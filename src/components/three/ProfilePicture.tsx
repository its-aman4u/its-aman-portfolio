
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, a } from '@react-spring/three';

function ProfilePicture({ position }: { position: [number, number, number] }) {
  const textureUrl = "/lovable-uploads/247886eb-a665-4597-bfee-6d4be11a09e8.png";
  const texture = useTexture(textureUrl);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Add a slight glow effect when hovered
  const springs = useSpring({
    scale: hovered ? 1.05 : 1,
    glow: hovered ? 0.2 : 0,
    config: { mass: 1, tension: 280, friction: 60 }
  });

  // Frame size with better proportions
  const frameSize = 1.5;
  
  // Enhance texture when loaded
  useEffect(() => {
    if (texture) {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 16; // Increase texture quality
    }
  }, [texture]);
  
  useFrame((state) => {
    if (meshRef.current) {
      // More subtle floating movement
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
      
      // Gentle rotation animation
      if (hovered) {
        meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      } else {
        meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05;
      }
    }
  });

  return (
    <group position={position}>
      {/* Enhanced frame with better materials */}
      <mesh position={[0, 0, -0.02]} scale={[1.05, 1.05, 1]} castShadow>
        <planeGeometry args={[frameSize, frameSize]} />
        <meshStandardMaterial 
          color="#1A6A8F" 
          metalness={0.5} 
          roughness={0.4}
          envMapIntensity={1.2}
        />
      </mesh>
      
      {/* Add decorative frame border */}
      <mesh position={[0, 0, -0.01]} scale={[1.02, 1.02, 1]}>
        <ringGeometry args={[frameSize/2 - 0.05, frameSize/2, 32]} />
        <meshStandardMaterial 
          color="#2A8AB5" 
          metalness={0.7} 
          roughness={0.2}
        />
      </mesh>
      
      {/* Main profile picture with enhanced material - use 'a.mesh' instead of 'animated.mesh' */}
      <a.mesh 
        ref={meshRef} 
        scale={springs.scale}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <planeGeometry args={[frameSize - 0.1, frameSize - 0.1]} />
        <meshStandardMaterial 
          map={texture} 
          transparent={true}
          emissive={"#ffffff"}
          emissiveIntensity={springs.glow}
          emissiveMap={texture}
        />
      </a.mesh>

      {/* Optional HTML overlay for caption */}
      {hovered && (
        <Html position={[0, -0.9, 0]} center style={{ width: '200px', textAlign: 'center' }}>
          <div className="bg-black/40 text-white p-2 rounded backdrop-blur-sm">
            <p className="text-sm font-medium">Aman Singh</p>
          </div>
        </Html>
      )}
    </group>
  );
}

export default ProfilePicture;
