"use client";
import React, { useEffect, useState } from 'react'
  // @ts-ignore
  import web3 from '../services/web3';
  import supplyChain from "../services/supplyChain";
  
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
import { Input } from './ui/input';
import { useRouter } from 'next/navigation';
import Router from 'next/router';
  

// @ts-ignore
const DeliveryCard = ({index}) => {

  const router = useRouter();

    const [parcel,setParcel] = useState({
        name:"",
        description:"",
        location:"",
        service:"",
        checkPoints :0,
        allLocations : [""],
        latestCheckpoint:0,
        isLost:false,
      });


      // @ts-ignore
      const checkParcelStatus = async () =>{
        // e.preventDefault();
    
    // @ts-ignore
    const accounts = await web3.eth.getAccounts();
        const details = await supplyChain.methods.getParcelDetails(
            index
        ).call({from: accounts[0]});
    
        // console.log(details);
        setParcel({
            name:details.name,
            description:details.description,
            location:details.location,
            service:details.service,
            checkPoints :  parseInt(details.checkpointCount.toString()),
            allLocations :details.allLocations ,
            latestCheckpoint:parseInt(details.latestCheckpoint),
            isLost:details.isLost
        })
    
    }



useEffect(()=>{


checkParcelStatus();



},[]);



   const handletransferParcel = async() => {
                   
           // @ts-ignore
  const accounts = await web3.eth.getAccounts();

                await supplyChain.methods.transferParcel(
                  index,
                  (parcel.latestCheckpoint)+1
    
              ).send({ from: accounts[0] });
    
              window.location.reload();
                }

    const parcelLost = async () =>{

        // @ts-ignore
const accounts = await web3.eth.getAccounts();
await supplyChain.methods.reportParcelLost(
index
).send({ from: accounts[0] });



}


  return (
    <Card className='w-[30%] border-black'>
    <CardHeader>
      <CardTitle className='flex items-center justify-between'><p>{parcel.name}</p>{(parcel.latestCheckpoint)+1 === (parcel.checkPoints)||parcel.latestCheckpoint===parcel.checkPoints?"":parcel.isLost||<span
        onClick={parcelLost}
      className='text-sm text-red-500 cursor-pointer'>mark parcel for lost</span>}</CardTitle>
      <CardDescription>{parcel.description}</CardDescription>
    </CardHeader>
   
    <CardFooter className='mt-4 flex flex-col gap-5 items-start'>
   

<div className='flex gap-5'>
    {
        parcel.isLost?<Button className='bg-orange-500 hover:bg-orange-500'>Parcel marked for lost</Button>:    (parcel.latestCheckpoint)+1 === (parcel.checkPoints)?<Button className='bg-zinc-300 text-slate-600 hover:bg-zinc-300'>Delivery pending</Button>:parcel.latestCheckpoint===parcel.checkPoints?<Button className='bg-blue-500 hover:bg-blue-500'>Delivery Completed</Button>:<Dialog>
        <DialogTrigger><Button>transfer parcel</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Key</DialogTitle>
         
          </DialogHeader>
          <div className='flex gap-4'>

          <Input

            
          className='border-black '></Input>
          <Button onClick={handletransferParcel}>Transfer</Button>
          </div>
        </DialogContent>
      </Dialog>
      
    }
   
    <DrawerBoxService parcel={parcel} checkParcelStatus={checkParcelStatus} />    
</div>

    {/* {

(parcel.latestCheckpoint)+1 === (parcel.checkPoints)?<Button className='bg-blue-500 hover:bg-blue-500'>No more check points</Button>:parcel.latestCheckpoint===parcel.checkPoints?<Button className='bg-blue-500 hover:bg-blue-500'>Delivery Completed</Button>



        :parcel.isLost?<Button className='bg-orange-500 hover:bg-orange-500'>Parcel marked for lost</Button>:
        parcel.latestCheckpoint+1===parcel.checkPoints&&<div className='flex gap-4'>
        <Button
            onClick={compDel}
        className='bg-green-600 hover:bg-green-500'>complete delivery</Button>
        <Button
            onClick={parcelLost}
        variant={'destructive'}>mark parcel for lost</Button>
    
        </div>
    } */}

   
    </CardFooter>
  </Card> 
  )
}

export default DeliveryCard