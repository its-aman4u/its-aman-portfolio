
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

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

export default ProfilePicture;
