'use client'

import { useEffect, useState, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Box, Sphere } from "@react-three/drei"
import RegisterParcel from "../../components/RegisterParcel"
import supplyChain from "../../services/supplyChain"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Logout from "../../components/Logout"

const ParcelVisualizer = ({ count }) => {
  const groupRef = useRef()
  
  useFrame((state) => {
    groupRef.current.rotation.y += 0.005
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: count }).map((_, index) => (
        <Sphere
          key={index}
          args={[0.1, 16, 16]}
          position={[
            Math.sin(index * 0.5) * 1.5,
            Math.cos(index * 0.5) * 1.5,
            Math.sin(index * 0.3) * Math.cos(index * 0.5) * 1.5
          ]}
        >
          <meshStandardMaterial color={`hsl(${index * 30}, 70%, 50%)`} />
        </Sphere>
      ))}
      <Box args={[3.5, 3.5, 3.5]} wireframe>
        <meshBasicMaterial color="white" opacity={0.2} transparent />
      </Box>
      <Text
        position={[0, 0, 1.8]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {count} Parcels
      </Text>
    </group>
  )
}

const AnimatedCounter = ({ value }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref)

  useEffect(() => {
    if (inView) {
      controls.start({ scale: [0.5, 1.2, 1], transition: { duration: 0 } })
    }
  }, [controls, inView, value])

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.5 }}
      animate={controls}
      className="text-6xl font-bold text-blue-400 mb-6"
    >
      {value}
    </motion.div>
  )
}

const GlowingButton = ({ children, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
    whileTap={{ scale: 0.95 }}
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
    onClick={onClick}
  >
    {children}
  </motion.button>
)

export default function Home() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="flex justify-between items-center mb-12">
          <motion.h1
            className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          >
            SELLER'S DASHBOARD
          </motion.h1>
          <Logout />
        </div>
        <div className="flex flex-col  gap-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-800 bg-opacity-50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm flex-1"
          >
            <h2 className="text-3xl font-bold mb-6 text-blue-300">Parcel Overview</h2>
            {/* <div className="h-80 w-full mb-8">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <ParcelVisualizer count={parcelCount} />
                <OrbitControls enableZoom={false} autoRotate />
              </Canvas>
            </div> */}
            <AnimatedCounter value={parcelCount} />
            <GlowingButton onClick={() => push("/seller/allParcels")}>
              View Your Parcels
            </GlowingButton>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gray-800 bg-opacity-50 p-8 rounded-2xl shadow-2xl backdrop-blur-sm flex-1"
          >
            <h2 className="text-3xl font-bold mb-6 text-green-300">Register New Parcel</h2>
            <RegisterParcel />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}