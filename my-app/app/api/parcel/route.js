import { connectToDB } from "@/utils/database";
import PARCEL from "@/models/parcel.model";


export const GET = async (req)=>{

    try {
        await connectToDB();

        const count = await PARCEL.countDocuments({});

        return new Response(JSON.stringify({
            success: true,
            message:" parcel count got successfully ",
            count: count
        }))

       
        
    } catch (error) {
            return new Response(JSON.stringify({
                
                    success: false,
                    message:" error in getting parcel count",
                    error:error.message
            
            }))
    }

};