import { useRef, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, "/images/earth-texture.jpg");

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[0.1, 0, 0]}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[2.05, 64, 64]} />
      <meshStandardMaterial
        color="#00d4aa"
        transparent
        opacity={0.08}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function Stars() {
  const starsRef = useRef<THREE.Points>(null);
  const count = 2000;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 50;
  }

  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.8} />
    </points>
  );
}

export default function EarthGlobe() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} />
        <pointLight position={[-5, -3, -5]} intensity={0.3} color="#00d4aa" />
        <Suspense fallback={null}>
          <Earth />
          <Atmosphere />
          <Stars />
        </Suspense>
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
