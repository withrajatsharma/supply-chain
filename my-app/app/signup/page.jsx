'use client'

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function SignUp() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const mountRef = useRef(null)
  const sceneRef = useRef(null)

  const handleSignUp = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/signup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      })

      const data = await response.json()

      if (data.existUser) {
        alert("User already exists, login instead")
      }

      if (data.success) {
        if (data.user.role === "buyer") {
          router.push("/buyer")
        }
        if (data.user.role === "seller") {
          router.push("/seller")
        }
        if (data.user.role === "delivery") {
          router.push("/service")
        }
      }
    } catch (error) {
      console.error("Signup error:", error)
      alert("An error occurred during signup. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let width = window.innerWidth
    let height = window.innerHeight
    let frameId

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.enableZoom = false

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshNormalMaterial()

    const cubes = []
    for (let i = 0; i < 100; i++) {
      const cube = new THREE.Mesh(geometry, material)
      cube.position.set(
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 10
      )
      cube.rotation.set(
        Math.random() * 2 * Math.PI,
        Math.random() * 2 * Math.PI,
        Math.random() * 2 * Math.PI
      )
      cubes.push(cube)
      scene.add(cube)
    }

    camera.position.z = 5

    renderer.setSize(width, height)
    mountRef.current.appendChild(renderer.domElement)

    sceneRef.current = { scene, camera, renderer, controls, cubes }

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    const animate = () => {
      frameId = requestAnimationFrame(animate)

      cubes.forEach((cube) => {
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
      })

      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      if (sceneRef.current) {
        sceneRef.current.controls.dispose()
        sceneRef.current.renderer.dispose()
      }
    }
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 relative overflow-hidden">
      <div ref={mountRef} className="absolute inset-0" />
      <div className="md:w-96 w-[90vw] md:max-w-96 max-w-80 rounded bg-gray-800 bg-opacity-80 px-7 py-10 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] relative z-10">
        <form onSubmit={handleSignUp}>
          <h4 className="text-2xl mb-7 text-white">Sign Up</h4>

          <div className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Name"
              className="bg-gray-700 text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              aria-label="Name"
            />
            <Input
              type="email"
              placeholder="Email"
              className="bg-gray-700 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email"
            />
            <Input
              type="password"
              placeholder="Password"
              className="bg-gray-700 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Password"
            />
            <Select onValueChange={setRole}>
              <SelectTrigger className="bg-gray-700 text-white">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">Buyer</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
          <p className="text-sm text-center mt-4 text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}