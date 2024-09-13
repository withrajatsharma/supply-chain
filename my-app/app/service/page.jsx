
"use client"
import React, { useEffect, useState } from 'react'

// @ts-ignore
// import web3 from '../../../services/web3';
import supplyChain from "../../services/supplyChain";
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import DrawerBoxService from "@/components/DrawerBoxService"
import DeliveryCard from "../../components/DeliveryCard"
import Logout from '../../components/Logout';

const page = () => {

    const [parcelCount, setParcelCount] = useState(0);


  //   const handletransferParcel = async() => {
  //     try {
          
  //          // @ts-ignore
  // const accounts = await web3.eth.getAccounts();
  // const details = await supplyChain.methods.getParcelDetails(
  //   parcelId
  // ).call({from: accounts[0]});
  // if(!(parseInt(details.latestCheckpoint)+1 === parseInt(details.checkpointCount))){
  //   // @ts-ignore
  //               // const accounts = await web3.eth.getAccounts();
  //               await supplyChain.methods.transferParcel(
  //                 parcelId,
  //                 parseInt(details.latestCheckpoint)+1
    
  //             ).send({ from: accounts[0] });
  //   }else{
  //     setDetail(true);
  //   }
            
  //           // console.log('response:', response);
  //         } catch (error) {
  //           console.error('Error fetching parcel details:', error);
  //       }

  //   }


    
    
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
    <p className=' font-bold text-4xl pt-5  mx-auto flex justify-center'>DELIVERY PORTAL</p>

    <Logout />

<div className='flex flex-wrap gap-10 p-14 '>



{
    
    // components.map((component,index) =><p>sdf</p>)
    components.map((component,index) =><DeliveryCard index={index} /> )

}
      
      </div>
      </div>

    
  )
}

export default page