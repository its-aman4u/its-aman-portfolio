
import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

function Island({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Load textures for enhanced visual appeal
  const grassTexture = useTexture('/lovable-uploads/grass.jpg');
  const treeTexture = useTexture('/lovable-uploads/bark.jpg');
  const buildingTexture = useTexture('/lovable-uploads/building.jpg');
  
  // Set up texture repeat and wrapping
  useEffect(() => {
    if (grassTexture) {
      grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
      grassTexture.repeat.set(2, 2);
    }
    if (treeTexture) {
      treeTexture.wrapS = treeTexture.wrapT = THREE.RepeatWrapping;
      treeTexture.repeat.set(1, 3);
    }
  }, [grassTexture, treeTexture]);
  
  // Enhanced animation
  useFrame((state) => {
    if (meshRef.current) {
      // More subtle, organic floating motion
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.y = Math.sin(time * 0.1) * 0.05;
      
      // Apply more natural movement when hovered
      if (hovered) {
        meshRef.current.position.y = Math.sin(time * 1.5) * 0.05;
        // Add slight tilt when hovered
        meshRef.current.rotation.z = Math.sin(time * 0.8) * 0.01;
      } else {
        // Reset position when not hovered
        meshRef.current.position.y = Math.sin(time * 0.3) * 0.02;
        meshRef.current.rotation.z = 0;
      }
    }
  });

  const treeTrunkMaterial = new THREE.MeshStandardMaterial({
    color: "#8B5A2B",
    roughness: 0.9,
    metalness: 0.1,
    map: treeTexture
  });

  const treeTopMaterial = new THREE.MeshStandardMaterial({
    color: "#53BE76",
    roughness: 0.8,
    metalness: 0.1,
  });

  const buildingMaterial = new THREE.MeshStandardMaterial({
    color: "#E8F3F7",
    roughness: 0.7,
    metalness: 0.3,
    map: buildingTexture
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        receiveShadow
        castShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Island base with enhanced geometry */}
        <cylinderGeometry args={[3, 3.5, 0.4, 8]} />
        <meshStandardMaterial 
          color={hovered ? "#64B5D9" : "#53A2BE"} 
          map={grassTexture}
          roughness={0.8}
          metalness={0.2}
          envMapIntensity={0.8}
        />
        
        {/* Enhanced trees with better materials */}
        <group position={[1, 0.4, 0]}>
          <mesh position={[0, 0.7, 0]} castShadow>
            <coneGeometry args={[0.5, 1.2, 8]} />
            <primitive object={treeTopMaterial} />
          </mesh>
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.4, 8]} />
            <primitive object={treeTrunkMaterial} />
          </mesh>
        </group>
        
        {/* Another enhanced tree */}
        <group position={[-1.2, 0.4, 1]}>
          <mesh position={[0, 0.7, 0]} castShadow>
            <coneGeometry args={[0.4, 1, 8]} />
            <primitive object={treeTopMaterial} />
          </mesh>
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.4, 8]} />
            <primitive object={treeTrunkMaterial} />
          </mesh>
        </group>
        
        {/* Enhanced building */}
        <group position={[0, 0.4, -1]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[0.8, 1, 0.8]} />
            <primitive object={buildingMaterial} />
          </mesh>
          <mesh position={[0, 1.2, 0]} castShadow>
            <coneGeometry args={[0.6, 0.6, 4]} />
            <meshStandardMaterial color="#142936" roughness={0.7} metalness={0.3} />
          </mesh>
        </group>
      </mesh>
    </group>
  );
}

export default Island;
