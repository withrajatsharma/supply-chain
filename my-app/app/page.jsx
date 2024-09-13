'use client'

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, PerspectiveCamera } from '@react-three/drei'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import * as THREE from 'three'

const TesseractBlock = ({ position, index }) => {
  const group = useRef()
  const innerCube = useRef()
  const outerCube = useRef()
  const light = useRef()

  useFrame((state, delta) => {
    group.current.rotation.x += delta * 0.2
    group.current.rotation.y += delta * 0.3
    innerCube.current.rotation.x -= delta * 0.3
    innerCube.current.rotation.y -= delta * 0.2
    outerCube.current.rotation.x += delta * 0.1
    outerCube.current.rotation.y += delta * 0.15

    if (light.current) {
      const t = state.clock.getElapsedTime()
      light.current.position.z = Math.sin(t * 2 + index) * 1.5
    }
  })

  const chainMaterial = new THREE.LineBasicMaterial({ color: '#00FFFF' })

  return (
    <group ref={group} position={position}>
      <mesh ref={innerCube}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshPhongMaterial color="#00FFFF" opacity={0.6} transparent />
      </mesh>
      <lineSegments ref={outerCube}>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(1, 1, 1)]} />
        <lineBasicMaterial attach="material" color="#00FFFF" linewidth={2} />
      </lineSegments>
      <group ref={light}>
        <pointLight color="#00FFFF" intensity={1} distance={5} decay={2} />
      </group>
    </group>
  )
}

const BlockChain = () => {
  const blocks = useMemo(() => {
    return Array(5).fill().map((_, index) => ({
      position: [index * 1.5 - 3, Math.sin(index * 0.5) * 0.5, 0],
    }))
  }, [])

  return (
    <>
      {blocks.map((block, index) => (
        <TesseractBlock key={index} position={block.position} index={index} />
      ))}
      {blocks.slice(1).map((block, index) => (
        <mesh key={index}>
          <lineSegments>
            <geometry
              attach="geometry"
              vertices={[
                new THREE.Vector3(...blocks[index].position),
                new THREE.Vector3(...block.position),
              ]}
            />
            <lineBasicMaterial attach="material" color="#00FFFF" linewidth={2} />
          </lineSegments>
        </mesh>
      ))}
    </>
  )
}

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <BlockChain />
      <Text
        position={[0, 2, 0]}
        fontSize={0.5}
        color="#00FFFF"
        anchorX="center"
        anchorY="middle"
      >
        SupplyGuard
      </Text>
      <Text
        position={[0, -2, 0]}
        fontSize={0.3}
        color="#00FFFF"
        anchorX="center"
        anchorY="middle"
      >
        Secure Blockchain Supply Chain
      </Text>
    </>
  )
}

export default function Component() {
  return (
    <main className="min-h-screen bg-gray-900 text-blue-100">
      <nav className="absolute top-0 left-0 right-0 z-10 pt-8 px-8">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
          <span className="self-center text-4xl font-semibold text-blue-100 whitespace-nowrap">
            SupplyGuard
          </span>
          <div className="flex space-x-4">
            <Link href="/signup">
              <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900">
                Sign Up
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-blue-500 text-gray-900 hover:bg-blue-400">Login</Button>
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

      <section className="py-20 px-8 bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-blue-300">Revolutionizing Supply Chains</h2>
          <p className="mb-6">
            SupplyGuard is a revolutionary blockchain-based platform designed to empower micro and nano entrepreneurs with a secure and transparent way to manage their supply chains. We leverage the immutable power of blockchain to create a permanent, tamper-proof record of each product's journey, building trust with conscious consumers and safeguarding against fraud.
          </p>
          <p className="mb-6">
            Our system meticulously tracks and verifies sustainable practices, mitigating product loss and eliminating the potential for fraudulent returns. Consumers can access real-time information about product origins, journey details, and sustainable practices, enabling informed purchasing decisions and supporting businesses with ethical values.
          </p>
        </div>
      </section>

      <section className="py-20 px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-blue-300">Key Features</h2>
          <ul className="list-disc list-inside space-y-4 text-blue-100">
            <li>Unmatched security through robust cryptographic measures</li>
            <li>Real-time tracking powered by integrated IoT devices</li>
            <li>Showcase sustainability certifications and environmental impact data</li>
            <li>Scalable and customizable plans for businesses of all sizes</li>
            <li>Comprehensive suite of solutions beyond mere visibility</li>
            <li>Live insights into product status, location, temperature, and other critical metrics</li>
          </ul>
        </div>
      </section>

      <section className="py-20 px-8 bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-blue-300">Market Opportunity</h2>
          <p className="mb-6">
            The global demand for secure and transparent supply chain solutions is booming, with the blockchain supply chain market projected to reach $9.6 billion by 2028. SupplyGuard is well-positioned to capture a significant share of this rapidly expanding market, with a target audience of 45,000 potential clients across various sectors.
          </p>
          <p className="mb-6">
            With $25 billion lost each year due to fraudulent returns, driven by counterfeiting, phantom shipments, and intentional damage, SupplyGuard addresses a pressing need in the industry. Our solution is particularly valuable for smaller businesses, as traditional supply chain solutions often cost upwards of $50,000 annually, leaving many without access to crucial tools for efficient management.
          </p>
        </div>
      </section>

      <section className="py-20 px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-blue-300">How It Works</h2>
          <ol className="list-decimal list-inside space-y-4 text-blue-100">
            <li>Businesses register their products on the blockchain, providing detailed information such as origin, certifications, and production dates.</li>
            <li>Real-time tracking, powered by GPS and other technologies, provides continuous updates on product location and status.</li>
            <li>We rigorously verify sustainability claims and ensure product authenticity, meeting industry standards.</li>
            <li>Consumers are provided with a unique transaction ID, granting them the power to track their purchase journey and verify its legitimacy.</li>
          </ol>
        </div>
      </section>

      <section className="py-20 px-8 bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-blue-300">Technology Stack</h2>
          <ul className="list-disc list-inside space-y-4 text-blue-100">
            <li>Blockchain: Ensures data integrity and tamper-proof records</li>
            <li>Cloud Computing: Facilitates secure and efficient data management</li>
            <li>IoT Devices: Collect real-time tracking data</li>
            <li>AI: Analyzes supply chain data, enabling proactive risk management and predictive insights</li>
          </ul>
        </div>
      </section>

      <footer className="bg-gray-900 text-blue-100 py-8 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-4">Join us in building a more sustainable, secure, and transparent future for global commerce.</p>
          <p>SupplyGuard: Empowering conscious consumers and ethical businesses through blockchain technology.</p>
        </div>
      </footer>
    </main>
  )
}