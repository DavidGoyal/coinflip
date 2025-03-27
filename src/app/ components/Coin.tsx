import { Preload, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

interface CoinProps {
  selected: "heads" | "tails";
  loading: boolean;
}

function CoinModel() {
  const { scene } = useGLTF("/Home/coin.glb"); // Ensure correct path

  return (
    <group rotation={[0, 0, 0]} position={[0, -5.25, 0]}>
      <primitive object={scene} scale={5} />
    </group>
  );
}

export default function Coin() {
  return (
    <Canvas
      frameloop="demand"
      shadows
      camera={{ position: [0, 1, 10], fov: 50 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={null}>
        {/* Lighting Setup */}
        <hemisphereLight intensity={0.3} groundColor="black" />
        <pointLight intensity={1} />
        <spotLight
          position={[-10, 20, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
          shadow-mapSize={1024}
        />

        {/* Coin Model */}
        <CoinModel />
      </Suspense>
      <Preload all />
    </Canvas>
  );
}
