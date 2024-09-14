'use client'

import React, { useEffect, useState } from 'react'
import web3 from '../services/web3'
import supplyChain from "../services/supplyChain"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import DrawerBoxService from "./DrawerBoxService"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from './ui/input'
import { useRouter } from 'next/navigation'
import { Package, AlertTriangle, Truck, CheckCircle, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

const DeliveryCard = ({ index }) => {
  const router = useRouter()
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
  const [transferKey, setTransferKey] = useState('')

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
      console.error('Error fetching parcel details:', error)
    }
  }

  useEffect(() => {
    checkParcelStatus()
  }, [])

  const handletransferParcel = async () => {
    try {
      const accounts = await web3.eth.getAccounts()
      await supplyChain.methods.transferParcel(
        index,
        parcel.latestCheckpoint + 1
      ).send({ from: accounts[0] })
      window.location.reload()
    } catch (error) {
      console.error('Error transferring parcel:', error)
    }
  }

  const parcelLost = async () => {
    try {
      const accounts = await web3.eth.getAccounts()
      await supplyChain.methods.reportParcelLost(index).send({ from: accounts[0] })
      await checkParcelStatus()
    } catch (error) {
      console.error('Error reporting parcel as lost:', error)
    }
  }

  const getStatusBadge = () => {
    if (parcel.isLost) {
      return <Badge variant="destructive">Lost</Badge>
    } else if (parcel.latestCheckpoint === parcel.checkPoints) {
      return <Badge variant="success">Delivered</Badge>
    } else if (parcel.latestCheckpoint + 1 === parcel.checkPoints) {
      return <Badge variant="warning">Pending Delivery</Badge>
    } else {
      return <Badge variant="secondary">In Transit</Badge>
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full border-gray-700 bg-gray-800 text-gray-100">
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
              <Truck className="mr-2 h-4 w-4 text-blue-400" />
              <span className="text-sm">Service: {parcel.service}</span>
            </div>
            <div className="flex items-center">
              <Package className="mr-2 h-4 w-4 text-blue-400" />
              <span className="text-sm">Checkpoints: {parcel.latestCheckpoint} / {parcel.checkPoints}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch space-y-2">
          <div className="flex gap-2">
            {parcel.isLost ? (
              <Button className="w-full bg-red-600 hover:bg-red-700" disabled>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Parcel Marked as Lost
              </Button>
            ) : parcel.latestCheckpoint + 1 === parcel.checkPoints ? (
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700" disabled>
                <Truck className="mr-2 h-4 w-4" />
                Delivery Pending
              </Button>
            ) : parcel.latestCheckpoint === parcel.checkPoints ? (
              <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                <CheckCircle className="mr-2 h-4 w-4" />
                Delivery Completed
              </Button>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Truck className="mr-2 h-4 w-4" />
                    Transfer Parcel
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 text-gray-100">
                  <DialogHeader>
                    <DialogTitle>Enter Transfer Key</DialogTitle>
                    <DialogDescription>
                      Please enter the transfer key to proceed with the parcel transfer.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex gap-4">
                    <Input
                      value={transferKey}
                      onChange={(e) => setTransferKey(e.target.value)}
                      className="border-gray-600 bg-gray-700 text-gray-100"
                      placeholder="Enter transfer key"
                    />
                    <Button onClick={handletransferParcel} className="bg-blue-600 hover:bg-blue-700">
                      Transfer
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            <DrawerBoxService parcel={parcel} checkParcelStatus={checkParcelStatus} />
          </div>
          {!parcel.isLost && parcel.latestCheckpoint !== parcel.checkPoints && (
            <Button
              onClick={parcelLost}
              variant="outline"
              className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Mark Parcel as Lost
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default DeliveryCard