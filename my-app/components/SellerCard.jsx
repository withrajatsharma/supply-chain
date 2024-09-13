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
  
import web3 from '../services/web3';
import supplyChain from "../services/supplyChain";
import DrawerBox from "./DrawerBox"

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




  



  return (
    <Card className='w-[30%] border-black'>
    <CardHeader>
      <CardTitle>{parcel.name}</CardTitle>
      <CardDescription>{parcel.description}</CardDescription>
    </CardHeader>
   
    <CardFooter className='mt-4 flex gap-5 items-start'>
    <DrawerBox parcel={parcel} checkParcelStatus={checkParcelStatus} buttonText={"check status"} />
   

    {
        parcel.latestCheckpoint===parcel.checkPoints?<Button className='bg-blue-500 hover:bg-blue-500'>Delivery Completed</Button>:parcel.isLost&&<Button className='bg-orange-500 hover:bg-orange-500'>Parcel marked for lost</Button>
    }

   
    </CardFooter>
  </Card> 
  )
}

export default BuyerCard