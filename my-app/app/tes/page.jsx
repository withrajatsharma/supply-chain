import React, { useRef } from "react";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { OrbitControls, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

const GlowLineMaterial = shaderMaterial(
  {
    color: new THREE.Color(0.0, 0.0, 0.0),
    thickness: 0.1,
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform vec3 color;
    uniform float thickness;
    varying vec2 vUv;
    void main() {
      float distance = 1.0 - length(vUv - vec2(0.5));
      float alpha = smoothstep(0.0, thickness, distance);
      gl_FragColor = vec4(color, alpha);
    }
  `
);

extend({ GlowLineMaterial });

const NeonCube = () => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  const createCube = (size, color, offset) => (
    <lineSegments key={size}>
      <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
      <glowLineMaterial color={new THREE.Color(color)} thickness={0.15} transparent />
      <group position={[offset, offset, offset]} />
    </lineSegments>
  );

  return (
    <group ref={groupRef}>
      {createCube(2, "#ff00ff", 0)}
      {createCube(1.5, "#00ffff", 0.25)}
      {createCube(1, "#ffff00", 0.5)}
      {createCube(0.5, "#ff00ff", 0.75)}
    </group>
  );
};

const Scene = () => {
  return (
    <Canvas>
      <perspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls enableZoom={false} />
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <NeonCube />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
    </Canvas>
  );
};

export default function Component() {
  return (
    <div className="w-full h-screen bg-black">
      <Scene />
    </div>
  );
}