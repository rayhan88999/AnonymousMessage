import {z} from "zod"

export const messageSchema= z.object({
    content: z.string().min(10,{message:"message must be atleast 10 character"}).max(300,{message:"content must be no longer that 300 character"})
})