import { createOpenAI } from "@ai-sdk/openai";
import { generateText, streamText } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";
export const maxDuration = 30;


export async function POST() {
  try {
    // Check if API key exists
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set");
      return NextResponse.json(
        { error: "API key is not configured" },
        { status: 500 }
      );
    }

    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example: "What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?". Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

    console.log("Making request to Groq API...");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      return NextResponse.json(
        { error: `API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const completion = data.choices[0]?.message?.content || "";

    console.log("Generated completion:", completion);

    // Return in the format expected by frontend
    return NextResponse.json({ completion });

  } catch (error: any) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}