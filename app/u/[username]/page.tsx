"use client"
import { messageSchema } from '@/schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { toast } from "sonner"
import { useCompletion } from "@ai-sdk/react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


const page = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuggestLoading, setIsSuggestLoading] = useState(false)
    const [questions, setQuestions] = useState<string[]>([])


const params = useParams<{username: string}>()
const username = params.username

    const form=useForm<z.infer<typeof messageSchema>>({
     resolver: zodResolver(messageSchema)
    })
 

    const handleSuggest = async () => {
  setIsSuggestLoading(true)
  try {
    const response = await axios.post("/api/suggest-messages")
    const completion = response.data.completion
    const questionArray = completion.split("||").map((q: string) => q.trim())
    setQuestions(questionArray)
    toast.success("Messages generated!")
  } catch (error: any) {
    console.error("Failed to generate messages:", error);
    toast.error(error.response?.data?.error || "Failed to generate messages")
  } finally {
    setIsSuggestLoading(false)
  }
}
  




    const onSubmit=async(data: z.infer<typeof messageSchema>)=>{
      setIsLoading(true)
      try {
       const response= await axios.post("/api/send-message",{
            ...data,
            username
            
        })
            console.log("Response status:", response.status) // Add this
    console.log("Response data:", response.data) // Add this
        if (response.status == 200) {
                  toast.success("message sent successfully")
        form.reset({...form.getValues(),content:""})
        }
 
      } catch (error) {
        console.log("failed to send message",error)
        toast.error("failed to send message")
      }finally{
        setIsLoading(false)
      }
    }
  return (
    <div>
        <h1 className='text-4xl text-center pt-4 font-bold'>Public profile link</h1>
<div className='box1 w-[70%] mx-auto px-2 sm:px-0'>
  <h1>Send Anonymous Message to {username}</h1>

  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel></FormLabel>
            <FormControl>
              <Input
                className='h-20 w-full'
                placeholder="Write your message here..."
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" className='mx-auto block w-full sm:w-auto'>
        Send It
      </Button>
    </form>
  </Form>
</div>


<div className='box2 w-[70%] mx-auto mt-8 px-2 sm:px-0'>
  <Button 
    onClick={handleSuggest} 
    disabled={isSuggestLoading} 
    className='mb-3 w-full sm:w-auto'
  >
    {isSuggestLoading ? "Generating..." : "Generate Messages"}
  </Button>

  <div 
    onClick={() => questions[0] && form.setValue("content", questions[0])} 
    className='border border-gray-200 h-14 flex justify-center items-center cursor-pointer hover:bg-gray-50 p-2 w-full'
  >
    {questions[0] || "Click 'Generate Messages' to get suggestions"}
  </div>
  <div 
    onClick={() => questions[1] && form.setValue("content", questions[1])} 
    className='border border-gray-200 h-14 flex justify-center items-center cursor-pointer hover:bg-gray-50 p-2 w-full mt-2'
  >
    {questions[1] || "Question 2 will appear here"}
  </div>
  <div 
    onClick={() => questions[2] && form.setValue("content", questions[2])} 
    className='border border-gray-200 h-14 flex justify-center items-center cursor-pointer hover:bg-gray-50 p-2 w-full mt-2'
  >
    {questions[2] || "Question 3 will appear here"}
  </div>
</div>

    </div>
  )
}

export default page