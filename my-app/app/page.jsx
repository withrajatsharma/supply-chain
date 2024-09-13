'use client'

import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { OrbitControls, Text, PerspectiveCamera } from '@react-three/drei'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import * as THREE from 'three'

extend({ EdgesGeometry: THREE.EdgesGeometry, LineBasicMaterial: THREE.LineBasicMaterial })

const createGlowTexture = (color) => {
  const size = 500;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');

  context.beginPath();
  context.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
  context.closePath();

  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, `${color}FF`);
  gradient.addColorStop(1, `${color}00`);

  context.fillStyle = gradient;
  context.fill();

  return new THREE.CanvasTexture(canvas);
}

const NeonCube = ({ position, color }) => {
  const group = useRef()
  const innerCube = useRef()
  const outerCube = useRef()

  const glowTexture = useMemo(() => createGlowTexture(color), [color]);
  const glowMaterial = useMemo(() => new THREE.SpriteMaterial({
    map: glowTexture,
    color: color,
    transparent: true,
    blending: THREE.AdditiveBlending
  }), [glowTexture, color])

  useFrame((state, delta) => {
    group.current.rotation.x += delta * 0.2
    group.current.rotation.y += delta * 0.3
    innerCube.current.rotation.x -= delta * 0.3
    innerCube.current.rotation.y -= delta * 0.2
    outerCube.current.rotation.x += delta * 0.1
    outerCube.current.rotation.y += delta * 0.15
  })

  return (
    <group ref={group} position={position}>
      <mesh ref={innerCube}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshPhongMaterial color={color} emissive={color} emissiveIntensity={0.5} opacity={0.8} transparent />
      </mesh>
      <lineSegments ref={outerCube}>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial attach="material" color={color} linewidth={2} />
      </lineSegments>
      <sprite scale={[2, 2, 2]} material={glowMaterial} />
    </group>
  )
}

const Particles = () => {
  const particlesRef = useRef()
  const count = 300
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      colors[i * 3] = Math.random()
      colors[i * 3 + 1] = Math.random()
      colors[i * 3 + 2] = 1
    }
    return [positions, colors]
  }, [count])

  useFrame((state, delta) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.geometry.attributes.position.array[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.01
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors />
    </points>
  )
}

const BlockChain = () => {
  const colors = ['#00FFFF', '#4169E1', '#1E90FF', '#4169E1', '#00FFFF']
  const blocks = useMemo(() => 
    Array(5).fill().map((_, index) => ({
      position: [index * 2 - 4, Math.sin(index * 0.5) * 0.5, 0],
      color: colors[index]
    }))
  , [])

  return (
    <>
      {blocks.map((block, index) => (
        <NeonCube key={index} position={block.position} color={block.color} />
      ))}
    </>
  )
}

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 5]} intensity={2} color="#00FFFF" />
      <BlockChain />
      <Particles />
      <Text position={[0, 2.5, 0]} fontSize={0.5} color="#E0FFFF" anchorX="center" anchorY="middle">
        SupplyGuard
      </Text>
      <Text position={[0, -2.5, 0]} fontSize={0.3} color="#7FFFD4" anchorX="center" anchorY="middle">
        Secure Blockchain Supply Chain
      </Text>
    </>
  )
}

const FeatureCard = ({ title, description, icon }) => (
  <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-cyan-400/50 flex flex-col items-center text-center">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-cyan-300">{title}</h3>
    <p className="text-cyan-100">{description}</p>
  </div>
)

export default function Component() {
  const [hoveredSection, setHoveredSection] = useState(null)

  return (
    <main className="min-h-screen bg-black text-cyan-100">
      <nav className="absolute top-0 left-0 right-0 z-10 pt-8 px-8 bg-gradient-to-b from-black to-transparent">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
          <span className="self-center text-4xl font-bold text-cyan-300 whitespace-nowrap">
            SupplyGuard
          </span>
          <div className="flex space-x-4">
            <Link href="/signup">
              <Button variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-300">
                Sign Up
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-cyan-500 text-black hover:bg-cyan-400 transition-all duration-300">Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative h-screen">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 7]} />
          <OrbitControls enableZoom={false} />
          <Scene />
        </Canvas>
      </div>

      <section className="py-20 px-8 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-8 text-cyan-300 text-center">Revolutionizing Supply Chains</h2>
          <p className="mb-6 text-xl leading-relaxed">
            Welcome to SupplyGuard, where we're not just tracking products; we're crafting digital narratives of trust and transparency. Imagine a world where every product tells its own story - from origin to destination. That's the power of SupplyGuard.
          </p>
          <p className="mb-6 text-xl leading-relaxed">
            We're turning supply chains into secure, transparent highways of information, where every transaction is a testament to authenticity and every product carries its own digital passport. Join us in redefining supply chain management for the digital age.
          </p>
        </div>
      </section>

      <section className="py-20 px-8 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold mb-12 text-cyan-300 text-center">Quantum Leap Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              title="Cryptographic Fort Knox" 
              description="Unbreakable security that would make even quantum computers sweat"
              icon="🔐"
            />
            <FeatureCard 
              title="IoT Synergy" 
              description="Real-time tracking so precise, you'll know if your shipment sneezed"
              icon="📡"
            />
            <FeatureCard 
              title="Green Beacon" 
              description="Sustainability metrics that Mother Nature would proudly display on her fridge"
              icon="🌿"
            />
            <FeatureCard 
              title="Scalable Singularity" 
              description="From nano-business to galactic empire, we've got you covered"
              icon="🚀"
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-8 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-8 text-cyan-300 text-center">Market Disruption</h2>
          <p className="mb-6 text-xl leading-relaxed">
            Buckle up, because the supply chain market is about to go supersonic. With projections hitting $9.6 billion by 2028, SupplyGuard isn't just riding the wave - we're creating a tsunami of innovation.
          </p>
          <p className="mb-6 text-xl leading-relaxed">
            Every year, $25 billion vanishes into the black hole of fraudulent returns. But fear not! SupplyGuard is here with a tractor beam of truth, pulling those lost profits back into your orbit. We're not just a solution; we're your supply chain's superhero cape.
          </p>
        </div>
      </section>

      <section className="py-20 px-8 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-12 text-cyan-300 text-center">The SupplyGuard Saga</h2>
          <div className="space-y-8">
            {[
              { title: "Product Genesis", description: "Your item gets its blockchain birth certificate, complete with origin story and superpowers (aka certifications)." },
              { title: "Quantum Tracking", description: "We keep tabs on your product with precision that would make Heisenberg jealous." },
              { title: "Truth Serum", description: "We verify sustainability claims faster than you can say 'eco-friendly'." },
              { title: "Consumer Enlightenment", description: "Buyers get a golden ticket (aka transaction ID) to trace their purchase's epic journey." }
            ].map((step, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-4 bg-black bg-opacity-70 p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-cyan-400/50"
                onMouseEnter={() => setHoveredSection(index)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-2xl font-bold ${hoveredSection === index ? 'animate-pulse' : ''}`}>
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2 text-cyan-300">{step.title}</h3>
                  <p className="text-cyan-100">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-8 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold mb-12 text-cyan-300 text-center">Our Cosmic Tech Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard 
              title="Blockchain" 
              description="The Fort Knox of data, where information checks in but never checks out"
              icon="🔗"
            />
            <FeatureCard 
              title="Cloud Computing" 
              description="Because sometimes, keeping your head in the clouds is exactly what you need"
              icon="☁️"
            />
            <FeatureCard 
              title="IoT Devices" 
              description="Our army of tiny robots, always watching (your products, not you, we promise)"
              icon="🤖"
            />
            <FeatureCard 
              title="AI" 
              description="The crystal ball of supply chains, predicting hiccups before they happen"
              icon="🧠"
            />
          </div>
        </div>
      </section>

      <footer className="bg-black text-cyan-100 py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-6 text-2xl font-bold">Ready to guard your supply chain with the power of a thousand blockchains?</p>
          <p className="text-3xl font-bold mb-10">Join SupplyGuard today and let's make history... or should we say, let's chain it!</p>
          <Button className="bg-cyan-500 text-black hover:bg-cyan-400 transition-all duration-300 text-xl px-10 py-4 rounded-full shadow-lg hover:shadow-cyan-400/50 transform hover:scale-105">
            Get Started
          </Button>
        </div>
      </footer>
    </main>
  )
}