import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions:NextAuthOptions={
    providers: [
        CredentialsProvider({
            id:"credentials",
            name:"Credentials",
            credentials:{
                email:{label:"Email",type:"text",},
                password:{label:"Password",type:"password"}
            },
            async authorize(credentials:any):Promise<any>{

               await dbConnect() 
               try {
               const user=  await UserModel.findOne({
                    $or:[
                        {email:credentials.identifier},
                        {username:credentials.identifier}
                    ]
                 })
                 if (!user) {
                    throw new Error("no user found with this emai or password")
                 }

                 if (!user.isVarified) {
                     throw new Error("please verify your account first")
                 }

              const isPasswordCorrect= await bcrypt.compare(credentials.password,user.password)
              if (isPasswordCorrect) {
                return user
              }else{
                throw new Error("your password is incorrect")
              }
               } catch (error:any) {
                throw new Error(error)
               }     
                
            }
        })
    ],
    callbacks:{
          async session({ session, token }) {
           if (token) {
            session.user._id=token._id
            session.user.isVarified=token.isVarified
            session.user.isAcceptingMessage=token.isAcceptingMessage
            session.user.username=token.username
           }

      return session
    },
    async jwt({ token, user }) {
       if (user && user._id) {
        token._id=user._id.toString()
        token.isVarified=user.isVarified
        token.isAcceptingMessage=user.isAcceptingMessage
        token.username=user.username
       }


      return token
    }
    },
    pages:{
        signIn:"/sign-in"
    },
    session:{
        strategy:"jwt"
    },
    secret:process.env.NEXTAUTH_SECRET

    
}