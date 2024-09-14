'use client'

import React from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '@/components/ui/button'
import { Package, MapPin, Truck, CheckCircle } from 'lucide-react'

const ParcelDrawer = ({ parcel, checkParcelStatus }) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          onClick={checkParcelStatus}
          variant="outline"
          className="whitespace-nowrap"
        >
          Check Next Point
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-gray-900 text-gray-100">
        <DrawerHeader className="border-b border-gray-800">
          <DrawerTitle className="text-3xl font-bold text-blue-400">{parcel.name}</DrawerTitle>
          <DrawerDescription className="text-xl text-gray-400">{parcel.description}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col md:flex-row px-4 gap-8 mt-6">
          <div className="w-full md:w-1/2 space-y-6">
            <div className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-blue-400" />
              <p className="text-lg">Location: {parcel.location}</p>
            </div>
            <div className="flex items-center">
              <Truck className="mr-2 h-5 w-5 text-blue-400" />
              <p className="text-lg">Service: {parcel.service}</p>
            </div>
            <div className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-blue-400" />
              <p className="text-lg">Check Points: {parcel.checkPoints}</p>
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            {parcel?.allLocations?.map((loc, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg ${
                  parseInt(parcel?.latestCheckpoint) === idx
                    ? 'border-2 border-blue-500 bg-gray-800'
                    : parseInt(parcel.latestCheckpoint) > idx
                    ? 'bg-gray-700'
                    : parseInt(parcel.latestCheckpoint) + 1 === idx
                    ? 'bg-gray-800'
                    : 'bg-gray-800 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{loc}</span>
                  {parseInt(parcel?.latestCheckpoint) >= idx && (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <DrawerFooter className="border-t border-gray-800">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default ParcelDrawer