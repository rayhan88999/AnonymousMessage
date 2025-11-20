import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(request:Request, {params}:{params:{messageid:string}}){
    const messageId= params.messageid
    await dbConnect()
const session=  await getServerSession(authOptions)
const user:User= session?.user as User

if (!session || !session.user) {
    return Response.json(
        {
            success:false,
            message:"not authenticated"
        },
        {status:401}
    )
}
 try {
    const updateResult= await UserModel.updateOne(
        {_id:user._id},
        {$pull:{messages:{_id:messageId}}}
    )
    if (updateResult.modifiedCount==0) {
          return Response.json(
        {
            success:false,
            message:"message not found or could not be deleted"
        },
        {status:404}
    )
    }

      return Response.json(
        {
            success:true,
            message:"message deleted successfully"
        },
        {status:200}
    )
 } catch (error) {
    console.log("error while deleting message:",error)
      return Response.json(
        {
            success:false,
            message:"error while deleting message"
        },
        {status:500}
    )
 }
 
}