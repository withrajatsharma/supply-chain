import PARCEL from "@/models/parcel.model";
import { connectToDB } from "@/utils/database";


export const POST = async (req) => {

    try {
        await connectToDB();

        const {  name,
            description,
             location,
             service,
             numCheckpoints,
             locations } = await req.json();

             const parcel = await PARCEL.create({
                name,
                description,
                 location,
                 service,
                 numCheckpoints,
                 locations
             })

             
           return new Response(JSON.stringify({
                success: true,
                message:" parcel registered successfully",
                parcel: parcel      
             }));
             
            } catch (error) {
        return new Response(JSON.stringify({
            success: false,
            message:" error occured while registering parcel",
            error:error.message  
          }));
        
    }

    
};  