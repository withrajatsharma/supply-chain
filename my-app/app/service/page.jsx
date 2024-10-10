'use client'

import React, { useEffect, useState } from 'react'
import supplyChain from "../../services/supplyChain"
import DeliveryCard from "../../components/DeliveryCard"
import Logout from '../../components/Logout'
import { motion } from 'framer-motion'
import { Truck, Package, RefreshCcw, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const DeliveryPortal = () => {
  const [parcelCount, setParcelCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const getCount = async () => {
    try {
      setIsLoading(true)
      const count = await supplyChain.methods.getParcelCount().call()
      const no = parseInt(count.toString())
      setParcelCount(no)
    } catch (error) {
      console.error('Error fetching parcel count:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getCount()
  }, [])

  const components = Array.from({ length: parcelCount })

  const filteredComponents = components.filter((_, index) => 
    index.toString().includes(searchTerm)
  )

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <motion.h1 
              className="text-4xl font-bold text-blue-400"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Delivery Portal
            </motion.h1>
            <Logout />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 " >
          <Card className="bg-gray-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Parcels</CardTitle>
              <Package className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{parcelCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Parcels in Transit</CardTitle>
              <Truck className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Calculating...</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered Today</CardTitle>
              <Package className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Calculating...</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by parcel ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 text-white"
            />
          </div>
          <Button
            onClick={getCount}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredComponents.map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <DeliveryCard index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!isLoading && filteredComponents.length === 0 && (
          <p className="text-center text-gray-400 mt-8">
            No parcels found. Try adjusting your search or refreshing the page.
          </p>
        )}
      </main>
    </div>
  )
}

export default DeliveryPortal