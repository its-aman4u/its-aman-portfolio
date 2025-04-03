
import { OrbitControls, Environment, Stars } from '@react-three/drei';
import Island from './Island';
import Bicycle from './Bicycle';
import ProfilePicture from './ProfilePicture';

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

export default Scene;
