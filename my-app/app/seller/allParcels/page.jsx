'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import supplyChain from "../../../services/supplyChain"
import SellerCard from "../../../components/SellerCard"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Logout from "../../../components/Logout"
import { Package, BarChart3 } from 'lucide-react'

function Parcel(props) {
  const mesh = useRef()
  useFrame((state, delta) => {
    mesh.current.rotation.x += delta * 0.5
    mesh.current.rotation.y += delta * 0.5
  })

  return (
    <mesh {...props} ref={mesh}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#4299e1" />
    </mesh>
  )
}

export default function SellerDashboard() {
  const { push } = useRouter()
  const [parcelCount, setParcelCount] = useState(0)

  useEffect(() => {
    const getCount = async () => {
      const count = await supplyChain.methods.getParcelCount().call()
      const no = parseInt(count.toString())
      setParcelCount(no)
    }

    getCount()
  }, [])

  const components = Array.from({ length: parcelCount })

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="p-4 border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-400">Seller's Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Logout />
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Package className="mr-2" /> Parcel Overview
            </h2>
            <p className="text-4xl font-bold text-blue-400">{parcelCount}</p>
            <p className="text-gray-400">Total Parcels Registered</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <BarChart3 className="mr-2" /> Quick Stats
            </h2>
            <p className="text-gray-400">More stats coming soon...</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={() => push("/seller")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Register New Parcel
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {components.map((_, index) => (
            <SellerCard key={index} index={index} />
          ))}
        </div>

        {parcelCount === 0 && (
          <p className="text-center text-gray-400 mt-8">
            No parcels registered yet. Click 'Register New Parcel' to add one.
          </p>
        )}
      </main>

      <div className="fixed bottom-0 right-0 w-64 h-64">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <Parcel position={[0, 0, 0]} />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>
    </div>
  )
}