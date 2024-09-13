"use client"
import { useRouter } from 'next/navigation'
import supplyChain from "../../services/supplyChain"
// import web3 from "../../../services/web3"
import React, { useEffect, useState } from 'react'
import BuyerCard from '@/components/BuyerCard'

import axios from 'axios'
import Logout from '@/components/Logout'

const buyer = () => {

  const {push} = useRouter();

  const [parcelCount, setParcelCount] = useState(0);




  useEffect(()=>{


    const getCount = async () => {
      const count =  await supplyChain.methods.getParcelCount().call();
       const no = parseInt(count.toString());
       setParcelCount(no);
 
     };

     getCount();

  //   const user = async()=>{
  //     try {
  //       const response = await axiosInstance.get("/api/parcels/get-user",{
  //           withCredentials:true,
  //           headers:{
  //               "Content-Type":"application/json",
  //           },
  //       })
  
  //       if(response.data.success){
  //           if(response.data.user.role=="buyer"){
  //               push("/buyer")
  //           }
  //           if(response.data.user.role=="seller"){
  //               push("/seller")
  //           }
  //           if(response.data.user.role=="delivery"){
  //               push("/service")
  //           }
  //       }
  //       else{
  //         push("/")
  //       }
      
  //  } catch (error) {
  //    console.log(error);
  //  }

  //   }

    // user();

 

  },[])


  const components = Array.from({ length: parcelCount });




  return (

    <div>
    <p className=' font-bold text-4xl pt-5  mx-auto flex justify-center'>BUYER'S DASHBOARD</p>

    <Logout />
    
    <div className='flex flex-wrap gap-10 p-14 '>


{
    
    components.map((component,index) =><BuyerCard index={index} /> )

}
      
   
  


    </div>
    </div>
  )
}

export default buyer