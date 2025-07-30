import axios from 'axios';
import { Handler } from '@netlify/functions';

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

interface RequestBody {
  query: string;
}

interface ResponseData {
  answer?: string;
  error?: string;
}

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const body: RequestBody = JSON.parse(event.body || '{}');
    const { query } = body;

    if (!query) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Query is required' }),
      };
    }

    const prompt = `Provide a detailed legal answer understood to non-legal person and also it should be of use as a study material by law students, related to Indian law for the following query:\n\n${query}\n\nPlease ensure the answer is strictly based on Indian legal matters based on CRPC, NIA, CPC, HMA, IDA, IEA, IPC, MVA and other Central Acts. if the user say HI then reply with proper salutation and ask how you may help the user only and if user asks your name then strictly reply your name is LegalTai, created with pleasure to answer your legal queries by SandyTrauma only and if query is not based on any of the above or legal matter or INDIAN Law then return with the answer that you are not trained to answer this query and give the following link to the user directing the user to visit this site for queries other than any legal matter and provide the following text : <button onclick="window.location.href='https://ai-chat4u.netlify.app/'">Visit AI Chat 4U</button>`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
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
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const answer = response.data.choices[0].message.content.trim();
    const responseData: ResponseData = { answer };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(responseData),
    };
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    const errorResponse: ResponseData = {
      error: 'Failed to get response from OpenAI',
    };
    return {
      statusCode: 500,
      body: JSON.stringify(errorResponse),
    };
  }
};

export { handler };
