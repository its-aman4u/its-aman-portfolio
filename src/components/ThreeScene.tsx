
import { Suspense } from 'react';
import SceneContainer from './three/SceneContainer';

interface ThreeSceneProps {
  className?: string;
}

const ThreeScene = ({ className }: ThreeSceneProps) => {
  return (
    <Suspense fallback={
      <div className="w-full h-full flex items-center justify-center bg-muted/20">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SceneContainer className={className} />
    </Suspense>
  );
};

export default ThreeScene;
