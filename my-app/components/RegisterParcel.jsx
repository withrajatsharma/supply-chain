'use client'

import React, { useState, useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { Button } from "./ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Canvas, extend, useFrame } from "@react-three/fiber"
import { Box, Line as DreiLine } from "@react-three/drei"
import * as THREE from 'three'
import web3 from "../services/web3"
import supplyChain from "../services/supplyChain"

// Extend DreiLine to be used within the Canvas
const Line = (props) => {
  return <DreiLine {...props} />
}

const ProgressLine = ({ progress }) => (
  <Line
    points={[[-1, 0, 0], [1, 0, 0]]}
    color="blue"
    lineWidth={5}
    position={[0, 0, 0]}
  >
    <meshBasicMaterial attach="material" color="blue" />
  </Line>
)

const RegisterParcel = () => {
  const { push } = useRouter()
  const controls = useAnimation()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [service, setService] = useState("")
  const [numCheckpoints, setNumCheckpoints] = useState("")
  const [locations, setLocations] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [errors, setErrors] = useState({})
  const [formProgress, setFormProgress] = useState(0)

  useEffect(() => {
    const filledFields = [name, description, location, service, numCheckpoints].filter(Boolean).length
    const progress = (filledFields / 5) + (locations.length > 0 ? 0.2 : 0)
    setFormProgress(Math.min(progress, 1))
    controls.start({ scaleX: formProgress })
  }, [name, description, location, service, numCheckpoints, locations, controls])

  const handleKeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addNewLocation()
    }
  }

  const addNewLocation = () => {
    if (inputValue.trim() !== "") {
      setLocations([...locations, inputValue.trim()])
      setInputValue("")
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!name) newErrors.name = "Name is required"
    if (!description) newErrors.description = "Description is required"
    if (!location) newErrors.location = "Location is required"
    if (!service) newErrors.service = "Service is required"
    if (!numCheckpoints) newErrors.numCheckpoints = "Number of checkpoints is required"
    if (locations.length === 0) newErrors.locations = "At least one location is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        const accounts = await web3.eth.getAccounts()
        await supplyChain.methods
          .registerParcel(name, description, location, service, numCheckpoints, locations)
          .send({ from: accounts[0] })
        push('/seller/allParcels')
      } catch (error) {
        console.error("Error registering parcel:", error)
        setErrors({ submit: "Failed to register parcel. Please try again." })
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gray-900 p-4"
    >
      <Card className="w-full max-w-4xl bg-gray-800 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ scaleX: 0 }}
            animate={controls}
            transition={{ duration: 0.5 }}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl">Register Parcel</CardTitle>
            <CardDescription className="text-gray-400">
              Register your new parcel in one-click.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Name of your parcel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="desc" className="text-white">Description</Label>
                  <Input
                    type="text"
                    id="desc"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="loc" className="text-white">Location</Label>
                  <Input
                    type="text"
                    id="loc"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </motion.div>
              </div>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="service" className="text-white">Service</Label>
                  <Input
                    type="text"
                    id="service"
                    placeholder="Service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                  {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor="cp" className="text-white">Checkpoints</Label>
                  <Input
                    type="number"
                    id="cp"
                    placeholder="Checkpoints"
                    value={numCheckpoints}
                    onChange={(e) => setNumCheckpoints(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                  {errors.numCheckpoints && <p className="text-red-500 text-sm mt-1">{errors.numCheckpoints}</p>}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Label htmlFor="locations" className="text-white">All Locations</Label>
                  <Input
                    type="text"
                    id="locations"
                    placeholder="Add location and press Enter"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeydown}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                  {errors.locations && <p className="text-red-500 text-sm mt-1">{errors.locations}</p>}
                  {locations.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="flex flex-wrap gap-2 mt-2"
                    >
                      {locations.map((loc, index) => (
                        <span
                          key={index}
                          className="text-sm bg-blue-600 text-white px-2 py-1 rounded"
                        >
                          {loc}
                        </span>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="bg-gray-700 text-white hover:bg-gray-600">
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-500">
              Register
            </Button>
          </CardFooter>
        </form>
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4 bg-red-500 text-white p-2 rounded"
          >
            {errors.submit}
          </motion.div>
        )}
      </Card>
      <div className="absolute bottom-4 left-4 w-64 h-16">
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Box args={[2, 0.1, 0.1]} position={[0, 0, 0]}>
            <meshStandardMaterial color="gray" />
          </Box>
          <ProgressLine progress={formProgress} />
        </Canvas>
      </div>
    </motion.div>
  )
}

export default RegisterParcel