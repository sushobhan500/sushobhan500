import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import { Earth } from './Earth';
import { Stars } from './Stars';

export function EarthScene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
        <ambientLight intensity={0.1} />
        <directionalLight position={[5, 3, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Stars count={8000} />
          <Earth />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
