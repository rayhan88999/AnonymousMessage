import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVarificationEmail";
import { string } from "zod";

export async function POST(request:Request){
    await dbConnect()

    try {
        const {username,email,password}= await request.json()
    const existingUserVarifiedByUsername= await  UserModel.findOne({username,isVarified:true})

    if (existingUserVarifiedByUsername) {

        return Response.json(
            {
                success:false,
                message:"usename is already taken"
            },
            {status:400}
        )
        
    }

   const existingUserByEmail= await UserModel.findOne({email})

   const verifyCode=Math.floor(100000+Math.random()*900000).toString()

   if (existingUserByEmail) {

    if (existingUserByEmail.isVarified) {

        return Response.json(
            {
                success:false,
                message:"user already exist with this email"
            },
            {status:400}
        )
        
    }else{
        const hashedPassword=await bcrypt.hash(password,10)
        existingUserByEmail.password=hashedPassword
        existingUserByEmail.verifyCode=verifyCode
        existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000)
        await existingUserByEmail.save()
    }
    
   }else{
   const hashedPassword= await bcrypt.hash(password,10)
   const expiryDate=new Date()
   expiryDate.setHours(expiryDate.getHours()+1)

  const newUser= new UserModel({
       username,
        email,
        password:hashedPassword,
        verifyCode,
        verifyCodeExpiry:expiryDate,
        isVarified:false,
        isAcceptingMessage:true,
        messages:[]
   })

   await newUser.save()
   }

   //send verification email
  const emailResponse= await sendVerificationEmail(email,username,verifyCode)
  if (!emailResponse.success) {
    return Response.json(
        {
            success:false,
            message:emailResponse.message
        },
        {status:500}
    )
    
  }

     return Response.json(
        {
            success:true,
            message:"user register successfully,plese verify your email"
        },
        {status:201}
    )

  
    } catch (error) {
        console.error("error while registering user",error)
        return Response.json(
            {
                success:false,
                message:"Error registering user"
            },
            {
                status:500
            }
        )
    }
}