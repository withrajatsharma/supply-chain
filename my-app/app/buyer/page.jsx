'use client'

import { useRouter } from 'next/navigation'
import supplyChain from "../../services/supplyChain"
import React, { useEffect, useState } from 'react'
import BuyerCard from '@/components/BuyerCard'
import Logout from '@/components/Logout'
import { Package, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BuyerDashboard() {
  const { push } = useRouter()
  const [parcelCount, setParcelCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const getCount = async () => {
    try {
      setIsLoading(true)
      const count = await supplyChain.methods.getParcelCount().call()
      const no = parseInt(count.toString())
      setParcelCount(no)
    } catch (error) {
      console.error("Error fetching parcel count:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getCount()
  }, [])

  const components = Array.from({ length: parcelCount })

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-400">Buyer's Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={getCount}
              disabled={isLoading}
              aria-label="Refresh parcel count"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Logout />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Package className="mr-2" /> Parcel Overview
          </h2>
          <p className="text-4xl font-bold text-blue-400">{parcelCount}</p>
          <p className="text-gray-400">Total Parcels</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {components.map((_, index) => (
              <BuyerCard key={index} index={index} />
            ))}
          </div>
        )}

        {!isLoading && parcelCount === 0 && (
          <p className="text-center text-gray-400 mt-8">
            No parcels found. Your purchases will appear here.
          </p>
        )}
      </main>
    </div>
  )
}