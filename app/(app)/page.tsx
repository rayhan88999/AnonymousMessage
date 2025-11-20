"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from "@/messages.json"
import Autoplay from 'embla-carousel-autoplay'  
import { Mail } from 'lucide-react'
 const page = () => {
   return (
      <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
      <section className='text-center mb-8 md:mb-12'>
        <h1 className='text-3xl md:text-5xl font-bold'>Dive into the world of Anonymous Conversation</h1>
        <p className='mt-4 text-xl md:text-xl'>Connect with people around the globe without revealing your identity</p>
      </section>
      <Carousel
      plugins={[Autoplay({delay:2000})]}
       className="w-full max-w-lg md:max-w-xl">
      <CarouselContent>
       {
        messages.map((message, index)=>(
        <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {message.title}
                  </CardTitle>
                 </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
<Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))
       }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
      </main>
    )
 }
 
 export default page