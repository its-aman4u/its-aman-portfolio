
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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

export default Bicycle;
