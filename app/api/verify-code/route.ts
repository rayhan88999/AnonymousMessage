import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request:Request){
   await dbConnect()

   try {
    const {username,code}= await request.json()
    const decodedUsername=decodeURIComponent(username)
    const user=await UserModel.findOne({username:decodedUsername})
    if (!user) {
        return Response.json(
        {
            success:false,
            message:"user not found"
        },
        {status:500}
    )
    }
    const isCodeValid=user.verifyCode===code
    const isCodeNotExpired=new Date(user.verifyCodeExpiry) > new Date()

    if (isCodeValid && isCodeNotExpired) {
        user.isVarified=true
        await user.save()
        return Response.json(
        {
            success:true,
            message:"account varified successfully"
        },
        {status:200}
    )
    }else if(!isCodeNotExpired){
         return Response.json(
        {
            success:false,
            message:"verification code has expired,plase sign up again to get a new code"
        },
        {status:400}
    )
    }else{
       return Response.json(
        {
            success:false,
            message:"incorrect verification code"
        },
        {status:400}
    ) 
    }
   } catch (error) {
    console.error("error while verifing code",error)
    return Response.json(
        {
            success:false,
            message:"error while verifing code"
        },
        {status:500}
    )
   }
}