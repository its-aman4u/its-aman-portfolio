
import { 
  OrbitControls, 
  Environment, 
  Stars, 
  ContactShadows,
  SpotLight
} from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import Island from './Island';
import Bicycle from './Bicycle';
import ProfilePicture from './ProfilePicture';

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
      <SpotLight 
        position={[5, 5, 5]} 
        angle={0.3} 
        penumbra={0.8} 
        intensity={0.8} 
        distance={20} 
        castShadow 
        attenuation={5}
        anglePower={5} // Sharper spotlight edge
        color="#ffffff"
      />
      
      {/* Main 3D elements */}
      <Island position={[0, -2, -2]} />
      <Bicycle position={[0, 0, 0]} />
      <ProfilePicture position={[2, 0, 0]} />
      
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
      
      {/* Add subtle shadow below elements */}
      <ContactShadows 
        position={[0, -2, 0]} 
        opacity={0.4} 
        width={15} 
        height={15} 
        blur={2.5} 
        far={4} 
        color="#000000"
        rotation={[Math.PI / 2, 0, 0]}
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
      
      {/* Enhanced environment */}
      <Environment preset="sunset" background={false} />
    </>
  );
}

export default Scene;
