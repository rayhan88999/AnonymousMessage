import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import {usernameValidation} from "@/schemas/signUpSchema"

const usernameQuerySchema= z.object({
    username:usernameValidation
})

export async function GET(request:Request){
   await dbConnect()

   try {
   const {searchParams}= new URL(request.url)
   const queryParam={
    username:searchParams.get("username")
   }
   //validation with zod
  const result= usernameQuerySchema.safeParse(queryParam)

  if (!result.success) {
    const usernameError=result.error.format().username?._errors || []
    return Response.json(
        {
            success:false,
            message:"invalid query parameter"
        },
        {status:400}
    )
  }

     const {username}=result.data

     const existingVarifiedUser= await UserModel.findOne({username,isVarified:true})

     if (existingVarifiedUser) {
        return Response.json(
            {
                success:false,
                message:"username is already taken"
            },{status:400}
        )
     }

      return Response.json(
            {
                success:true,
                message:"username is unique"
            },{status:200}
        )
   } catch (error) {
    console.error("error while checking username",error)
    return Response.json(
        {
            success:false,
            message:"error while checking username"
        },
        {status:500}
    )
   }
}