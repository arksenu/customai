import OpenAI from 'openai';
const openai = new OpenAI();

export async function POST(request) {
  try {
    const { threadId, message } = await request.json(); // Parse the JSON body from the request

    const response = await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });

    // Return the response with messageId
    return new Response(JSON.stringify({ messageId: response.id }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error:', error);

    // Return an error response
    return new Response(JSON.stringify({ error: 'Failed to add message' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

