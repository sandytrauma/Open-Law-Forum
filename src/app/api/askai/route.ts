import axios from 'axios';
import { NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;  // Put your OpenAI API key here

// Define the structure of the request body
interface RequestBody {
  query: string;
}

export async function POST(req: Request) {
  try {
    // Parse the incoming request body
    const { query }: RequestBody = await req.json();

    // Validate query parameter
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Define the prompt for OpenAI
    const prompt = `Provide a detailed legal answer related to Indian law for the following query:\n\n${query}\n\nPlease ensure the answer is strictly based on Indian legal matters.`;

    // Make the request to the OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions', // Correct endpoint for chat-based models
      {
        model: 'gpt-4',  // Use GPT-4 model
        messages: [
          {
            role: 'system',
            content: 'You are a legal assistant who specializes in Indian law.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    // Extract the answer from OpenAI's response
    const answer = response.data.choices[0].message.content.trim();

    // Return the answer in the response
    return NextResponse.json({ answer });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to get response from OpenAI' }, { status: 500 });
  }
}
