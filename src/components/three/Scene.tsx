
import { 
  OrbitControls, 
  Environment, 
  Stars, 
  ContactShadows,
} from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import Island from './Island';
import Bicycle from './Bicycle';

function Scene() {
  const { gl } = useThree();
  
  // Enhance renderer quality
  useEffect(() => {
    gl.setClearColor(0x000000, 0);
    gl.toneMapping = 3; // ACESFilmicToneMapping
    gl.toneMappingExposure = 1.5;
  }, [gl]);

  return (
    <>
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      
      {/* Replace problematic SpotLight with standard pointLight */}
      <pointLight 
        position={[5, 5, 5]}
        intensity={0.8}
        castShadow
      />
      
      {/* Main 3D elements */}
      <Island position={[0, -2, -2]} />
      <Bicycle position={[0, 0, 0]} />
      
      {/* Enhanced star field */}
      <Stars 
        radius={100} 
        depth={50} 
        count={2000} 
        factor={5} 
        saturation={0.6} 
        fade
        speed={1}
      />
      
      {/* ContactShadows with proper props */}
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.4}
        scale={15}
        blur={2.5}
        far={4}
        color="#000000"
        resolution={512}
      />
      
      {/* Enhanced camera controls */}
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        minDistance={3}
        maxDistance={8}
        autoRotate={false}
        autoRotateSpeed={0.5}
        enableDamping={true}
        dampingFactor={0.05}
        rotateSpeed={0.8}
      />
      
      {/* Changed from preset to a simple ambient light environment to prevent HDR loading error */}
      <Environment background={false}>
        <ambientLight intensity={1} />
      </Environment>
    </>
  );
}

export default Scene;
