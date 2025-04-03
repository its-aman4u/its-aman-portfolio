
import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';
import { Loader } from '@react-three/drei';

interface SceneContainerProps {
  className?: string;
}

const SceneContainer = ({ className = '' }: SceneContainerProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for demonstration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`three-scene-container h-full w-full relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]} // Responsive performance adjustment
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      {/* Custom loader overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Instruction overlay */}
      <div className="absolute bottom-5 left-0 right-0 text-center text-white text-shadow-sm pointer-events-none bg-black/30 py-2 backdrop-blur-sm">
        <p className="text-sm">Click on the bicycle to speed it up! Scroll to zoom, click and drag to rotate</p>
      </div>
      
      {/* External loader for Three.js assets */}
      <Loader 
        containerStyles={{ background: 'transparent' }} 
        innerStyles={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}
        barStyles={{ background: 'hsl(var(--primary))' }}
      />
    </div>
  );
};

export default SceneContainer;
