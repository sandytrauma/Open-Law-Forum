import axios from 'axios';
import { NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;  // Put your OpenAI API key here

// Define the structure of the request body
interface RequestBody {
  query: string;
}

// Define the structure of the response data
interface ResponseData {
  answer?: string;
  error?: string;
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
    const prompt = `Provide a detailed legal answer understood to non-legal person and also it should be of use as a study material by law students, related to Indian law for the following query:\n\n${query}\n\nPlease ensure the answer is strictly based on Indian legal matters based on CRPC, NIA, CPC, HMA, IDA, IEA, IPC, MVA and other Central Acts. if the user say HI then reply with proper salutation adn ask how you may help the user only and if user asks you name then strictly reply your name is LegalTai, created with pleasure to answer your legal queries by SandyTrauma only and if query is not based on any of the above or legal matter or INDIAN Law then return with the answer that you are not trained to answer this query and give the following link to the user directing the user to visit this site for queries other than any legal matter and provide the following text : <button onclick="window.location.href='https://ai-chat4u.netlify.app/'">Visit AI Chat 4U</button>`;

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

    // Return the answer in the response with ResponseData type
    const responseData: ResponseData = { answer };
    return NextResponse.json(responseData);
  } catch (error) {
    console.error(error);
    const errorResponse: ResponseData = { error: 'Failed to get response from OpenAI' };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
