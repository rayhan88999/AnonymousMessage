'use client'
 import { toast } from "sonner"
import React from 'react'
import {
  Card,
   CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Message } from '@/model/User'
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Trash, Trash2 } from "lucide-react"
import { Button } from "./ui/button"

type MessageCardProps={
    message:Message
    onMessageDelete:(messageId:string)=>void
}

const MessageCard = ({message,onMessageDelete}:MessageCardProps) => {
    const handleDeleteConfirm= async()=>{
        await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast.success("message deleted successfully")
        onMessageDelete(message._id as string)
    }
  return (
<Card className="w-full max-w-2xl hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with timestamp and delete */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <time className="text-sm text-slate-500 font-medium">
              {new Date(message.createdAt).toLocaleString()}
            </time>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button 
                  className="p-2 rounded-md hover:bg-slate-100 transition-colors"
                  aria-label="Delete message"
                >
                  <Trash2 className="h-4 w-4 text-slate-500 hover:text-slate-700" />
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete this message.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Message content */}
          <div className="pt-2">
            <p className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap break-words font-bold">
              {message.content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
 )
}

export default MessageCard