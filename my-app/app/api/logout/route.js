import { cookies } from "next/headers";


export const GET = async(req)=>{

    try {

        cookies().set("token","",{
            expires: new Date(Date.now())
        })

        return new Response(JSON.stringify({
            sucess: true,
            message: "user logged out successfully"
        }))
        
    } catch (error) {
        return new Response(JSON.stringify({
            sucess:false,
            message:"erro occurred while logging out the user",
            error:error
        }))
    }

};