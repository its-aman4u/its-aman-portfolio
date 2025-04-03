
import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';

interface SceneContainerProps {
  className?: string;
}

const SceneContainer = ({ className = '' }: SceneContainerProps) => {
  return (
    <div className={`three-scene-container h-full w-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-5 left-0 right-0 text-center text-white text-shadow-sm pointer-events-none bg-black/20 py-2 backdrop-blur-sm">
        <p className="text-sm">Click on the bicycle to speed it up! Scroll to zoom, click and drag to rotate</p>
      </div>
    </div>
  );
};

export default SceneContainer;
