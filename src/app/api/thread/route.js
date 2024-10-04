import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(request) {
  try {
    // Create a thread
    const thread = await openai.beta.threads.create();

    // Return the thread ID
    return new Response(JSON.stringify({ threadId: thread.id }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error creating thread:', error);

    return new Response(JSON.stringify({ error: 'Failed to create thread' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

