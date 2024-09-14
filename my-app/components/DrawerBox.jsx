'use client'

import React from "react"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer"
import { Button } from "./ui/button"
import { Package, MapPin, Truck, AlertTriangle } from "lucide-react"

const ParcelDrawer = ({ parcel, checkParcelStatus, buttonText }) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          onClick={checkParcelStatus}
          variant="outline"
          className="w-full"
        >
          {buttonText}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-gray-900 text-gray-100">
        <DrawerHeader className="border-b border-gray-800 pb-4">
          <DrawerTitle className="text-3xl font-bold text-blue-400">
            {parcel.name}
          </DrawerTitle>
          <DrawerDescription className="text-xl text-gray-400">
            {parcel.description}
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 flex flex-col md:flex-row gap-8">
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
            {parcel.isLost && (
              <div className="flex items-center text-red-500">
                <AlertTriangle className="mr-2 h-5 w-5" />
                <p className="text-lg font-bold">Parcel marked as lost</p>
              </div>
            )}
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            {parcel?.allLocations?.map((loc, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg ${
                  parseInt(parcel?.latestCheckpoint) === idx
                    ? "border-2 border-blue-500 bg-gray-800"
                    : parseInt(parcel?.latestCheckpoint) > idx
                    ? "bg-gray-700"
                    : "bg-gray-800"
                }`}
              >
                <p className="text-center">{loc}</p>
              </div>
            ))}
          </div>
        </div>
        <DrawerFooter className="border-t border-gray-800 pt-4">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default ParcelDrawer