"use client";
import React, { useEffect, useState } from 'react'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Button } from '@/components/ui/button'
  // @ts-ignore
import web3 from '../services/web3';
import supplyChain from "../services/supplyChain";
import DrawerBox from "@/components/DrawerBox"

//   @ts-ignore
const BuyerCard = ({index}) => {

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


    const compDel = async () =>{


        try {
            
            // @ts-ignore
   const accounts = await web3.eth.getAccounts();
           await supplyChain.methods.transferParcel(
             index,
             parcel.latestCheckpoint+1
         ).send({ from: accounts[0] });


           
           // console.log('response:', response);
       } catch (error) {
           console.error('Error fetching parcel details:', error);
       }





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
      <CardTitle>{parcel.name}</CardTitle>
      <CardDescription>{parcel.description}</CardDescription>
    </CardHeader>
   
    <CardFooter className='mt-4 flex flex-col gap-5 items-start'>
    <DrawerBox parcel={parcel} checkParcelStatus={checkParcelStatus} buttonText={"check status"} />
   

    {
        parcel.latestCheckpoint===parcel.checkPoints?<Button className='bg-blue-500 hover:bg-blue-500'>Delivery Completed</Button>:parcel.isLost?<Button className='bg-orange-500 hover:bg-orange-500'>Parcel marked for lost</Button>:
        parcel.latestCheckpoint+1===parcel.checkPoints&&<div className='flex gap-4'>
        <Button
            onClick={compDel}
        className='bg-green-600 hover:bg-green-500'>complete delivery</Button>
        <Button
            onClick={parcelLost}
        variant={'destructive'}>mark parcel for lost</Button>
    
        </div>
    }

   
    </CardFooter>
  </Card> 
  )
}

export default BuyerCard