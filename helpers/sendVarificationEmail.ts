import {getResend,} from "../lib/resend"
import VerificationEmail from "@/emails/VerificationEmail"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string

):Promise<ApiResponse>{
    try {
        const resend= getResend()
        await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: email,
  subject: 'Anonymous message | Verification code ',
  react: VerificationEmail({username,otp:verifyCode}),
});
        return {success:true,message:"verification email sent successfully"}
    } catch (emailError) {
        console.error("error while sending verification email",emailError)
        return {success:false,message:"failed to send verification email"}
    }
}

