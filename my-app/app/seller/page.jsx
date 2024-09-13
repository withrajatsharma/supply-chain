"use client";
import RegisterParcel from "../../components/RegisterParcel";
import { useEffect, useState } from "react";
import supplyChain from "../../services/supplyChain";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Logout from "../../components/Logout";

export default function Home() {

  

    const {push} = useRouter();

  const [parcelCount, setParcelCount] = useState(0);

  // const [parcel,setParcel] = useState({
  //   name:"",
  //   description:"",
  //   location:"",
  //   service:"",
  //   checkPoints :0,
  //   allLocations : [""],
  //   latestCheckpoint:0,
  //   isLost:false,
  // });


  useEffect(() => {
    const getCount = async () => {
     const count =  await supplyChain.methods.getParcelCount().call();
      const no = parseInt(count.toString());
      setParcelCount(no);

    };
    
    getCount();
  }, []);

 
  

  return (
    <div>

    <p className=' font-bold text-4xl pt-5  mx-auto flex justify-center'>SELLER'S DASHBOARD</p>

 <Logout />
    <main className="flex min-h-screen  flex-col items-center justify-between p-24">

      <div>
        <h1 className="text-xl font-bold mb-10">
          Total Parcels: {parcelCount}{" "}
        </h1>

        <RegisterParcel />

        <div className="flex gap-2 mt-10 items-center justify-center">


        <Button onClick={()=>{ push("/seller/allParcels")}} >
            your parcles
        </Button>


      

        </div>

  
      </div>
    </main>
    </div>
  );
}
