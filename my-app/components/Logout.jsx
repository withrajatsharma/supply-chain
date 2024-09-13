"use client";
import axios from "axios";
import { useRouter } from 'next/navigation';
import  { useEffect } from 'react'
import {Button} from "../components/ui/button";

const Logout = () => {

    const {push} = useRouter();


        const logout = async()=>{
            try {
              const res = await axios.get("/api/logout")

              if(res.data.sucess){

                push("/");
              }else{
                alert("error while logging out the user");
              }
                
            
         } catch (error) {
           console.log(error);
         }
      
          }
      

    return (
      
        <Button onClick={logout} className="absolute right-8 top-5" >Log out</Button>
    );

}

export default Logout;