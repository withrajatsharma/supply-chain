'use client'

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const mountRef = useRef(null)
  const sceneRef = useRef(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

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
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error("Login error:", error)
      alert("An error occurred during login. Please try again.")
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

    const blocks = []
    for (let i = 0; i < 50; i++) {
      const block = new THREE.Mesh(geometry, material)
      block.position.set(
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 10
      )
      block.rotation.set(
        Math.random() * 2 * Math.PI,
        Math.random() * 2 * Math.PI,
        Math.random() * 2 * Math.PI
      )
      blocks.push(block)
      scene.add(block)
    }

    camera.position.z = 5

    renderer.setSize(width, height)
    mountRef.current.appendChild(renderer.domElement)
    sceneRef.current = { scene, camera, renderer, controls, blocks }

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

      blocks.forEach((block) => {
        block.rotation.x += 0.01
        block.rotation.y += 0.01
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
        <form onSubmit={handleLogin}>
          <h4 className="text-2xl mb-7 text-white">Login</h4>

          <div className="flex flex-col gap-4">
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
          </div>

          <Button
            type="submit"
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
          <p className="text-sm text-center mt-4 text-gray-400">
            Not registered yet?{" "}
            <Link href="/signup" className="text-blue-400 font-semibold hover:underline">
              Create an Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}