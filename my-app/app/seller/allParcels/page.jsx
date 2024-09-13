"use client";
import React, { useEffect, useState } from 'react'
import supplyChain from "../../../services/supplyChain"
import SellerCard from "../../../components/SellerCard"
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';


const allParcels = () => {


    const {push} = useRouter();

    const [parcelCount, setParcelCount] = useState(0);


    useEffect(()=>{


        const getCount = async () => {
          const count =  await supplyChain.methods.getParcelCount().call();
           const no = parseInt(count.toString());
           setParcelCount(no);
     
         };
    
         getCount();
    
     
    
      },[])

      const components = Array.from({ length: parcelCount });





  return (
    <div>
      <p className=' font-bold text-4xl pt-5  mx-auto flex justify-center'>SELLER'S DASHBOARD</p>
    
    <div >



        <Button onClick={()=>{
            push("/seller");
        }} className=' mx-20 mt-10'>Register Parcel</Button>

<div className='flex flex-wrap gap-10 p-10 '>


    {
        
        components.map((component,index) =><SellerCard index={index} /> )
    
    }
          
          </div>
       
      
    
    
        </div>
        </div>
  )
}

export default allParcels