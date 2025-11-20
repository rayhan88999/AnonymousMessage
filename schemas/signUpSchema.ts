import {email, z} from "zod"

export const usernameValidation= z
.string()
.min(3,"username must be atleast three character")
.max(20,"username must be less that twenty character")
.regex(/^[a-zA-Z0-9_]{3,16}$/,"usename must not contain special character")

export const signUpSchema= z.object({
    username:usernameValidation,
    email: z.string().email({message:"invali email address"}),
    password: z.string().min(6,{message:"password must be atleast 6 character"})
})