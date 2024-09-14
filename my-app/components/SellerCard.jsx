'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import { Package, AlertTriangle, CheckCircle } from 'lucide-react'
import web3 from '../services/web3'
import supplyChain from "../services/supplyChain"
import DrawerBox from "./DrawerBox"

export default function BuyerCard({ index }) {
  const [parcel, setParcel] = useState({
    name: "",
    description: "",
    location: "",
    service: "",
    checkPoints: 0,
    allLocations: [""],
    latestCheckpoint: 0,
    isLost: false,
  })

  const checkParcelStatus = async () => {
    try {
      const accounts = await web3.eth.getAccounts()
      const details = await supplyChain.methods.getParcelDetails(index).call({ from: accounts[0] })

      setParcel({
        name: details.name,
        description: details.description,
        location: details.location,
        service: details.service,
        checkPoints: parseInt(details.checkpointCount.toString()),
        allLocations: details.allLocations,
        latestCheckpoint: parseInt(details.latestCheckpoint),
        isLost: details.isLost
      })
    } catch (error) {
      console.error("Error fetching parcel status:", error)
    }
  }

  useEffect(() => {
    checkParcelStatus()
  }, [])

  const getStatusBadge = () => {
    if (parcel.latestCheckpoint === parcel.checkPoints) {
      return <Badge className="bg-green-500">Delivered</Badge>
    } else if (parcel.isLost) {
      return <Badge className="bg-red-500">Lost</Badge>
    } else {
      return <Badge className="bg-blue-500">In Transit</Badge>
    }
  }

  return (
    <Card className="w-full max-w-sm border-gray-700 bg-gray-800 text-gray-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{parcel.name}</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription className="text-gray-400">{parcel.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            <span className="text-sm">Service: {parcel.service}</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-4 w-4" />
            <span className="text-sm">Checkpoints: {parcel.latestCheckpoint} / {parcel.checkPoints}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch space-y-2">
        <DrawerBox parcel={parcel} checkParcelStatus={checkParcelStatus} buttonText="Check Status" />
        {parcel.latestCheckpoint === parcel.checkPoints ? (
          <Button className="w-full bg-green-600 hover:bg-green-700">Delivery Completed</Button>
        ) : parcel.isLost && (
          <Button className="w-full bg-red-600 hover:bg-red-700">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Parcel Marked as Lost
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}