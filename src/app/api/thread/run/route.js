import OpenAI from 'openai';
const openai = new OpenAI();

export async function POST(request) {
  try {
    // Extract the JSON body from the request
    const { threadId, assistantId } = await request.json();

    // Create and poll the run with the Assistant API
    let run = await openai.beta.threads.runs.createAndPoll(threadId, {
      assistant_id: assistantId,
      instructions: "Please address the user as Jane Doe.",
    });

    if (run.status === 'completed') {
      // Retrieve all messages from the thread
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      
      for (const message of messages.data.reverse()) {
        console.log(`${message.role} > ${message.content[0].text.value}`);
      }
      // Return the assistant's messages in reverse order
      return new Response(JSON.stringify(messages.data.reverse()[0].content[0].text.value), {

        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    } else {
      // Return the current status if the run hasn't completed yet
      return new Response(JSON.stringify({ status: run.status }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }
  } catch (error) {
    console.error('Error running assistant:', error);

    // Return an error response
    return new Response(JSON.stringify({ error: 'Failed to run assistant' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}


