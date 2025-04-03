
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

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

export default Island;
