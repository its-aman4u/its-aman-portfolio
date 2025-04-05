
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSpring, a } from '@react-spring/three';

function Bicycle({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const [speed, setSpeed] = useState(0.3);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  // Create smoother animations with react-spring
  const springs = useSpring({
    scale: clicked ? 1.1 : hovered ? 1.05 : 1,
    hover: hovered ? 1 : 0,
    config: { mass: 2, tension: 300, friction: 30 }
  });
  
  // Animate rotation continuously
  useFrame((state) => {
    if (groupRef.current) {
      // Update the rotation directly
      groupRef.current.rotation.y = state.clock.getElapsedTime() * speed;
      
      // Add subtle bobbing motion when hovered
      if (hovered) {
        groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 3) * 0.05;
        groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
      } else {
        groupRef.current.position.y = position[1];
        groupRef.current.rotation.x = 0;
      }
    }
  });
  
  // Handle click event with animation
  const handleClick = () => {
    // Toggle speed between slow and fast
    setSpeed(prev => prev > 0.5 ? 0.3 : 0.9);
    setClicked(true);
    
    // Reset clicked state after animation completes
    setTimeout(() => setClicked(false), 300);
  };

  return (
    <a.group 
      ref={groupRef} 
      position={position}
      scale={springs.scale}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      onClick={handleClick}
    >
      {/* Frame with enhanced materials */}
      <mesh position={[0, 0, 0]} castShadow>
        <torusGeometry args={[0.3, 0.03, 16, 32]} />
        <meshStandardMaterial 
          color={hovered ? "#2A8AB5" : "#1A6A8F"} 
          metalness={0.8} 
          roughness={0.2}
          emissive={hovered ? "#2A8AB5" : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
      
      {/* Front wheel with spinning animation */}
      <mesh position={[0.3, 0, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <torusGeometry args={[0.2, 0.02, 16, 32]} />
        <meshStandardMaterial 
          color={hovered ? "#64B5D9" : "#53A2BE"} 
          metalness={0.8} 
          roughness={0.2}
          envMapIntensity={1.2}
        />
      </mesh>
      
      {/* Rear wheel with spinning animation */}
      <mesh position={[-0.3, 0, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <torusGeometry args={[0.2, 0.02, 16, 32]} />
        <meshStandardMaterial 
          color={hovered ? "#64B5D9" : "#53A2BE"} 
          metalness={0.8} 
          roughness={0.2}
          envMapIntensity={1.2}
        />
      </mesh>
      
      {/* Add spokes to wheels for more detail */}
      <mesh position={[0.3, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.3, 0, 0]} rotation={[Math.PI/2, Math.PI/2, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-0.3, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-0.3, 0, 0]} rotation={[Math.PI/2, Math.PI/2, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 8]} />
        <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
      </mesh>
    </a.group>
  );
}

export default Bicycle;
