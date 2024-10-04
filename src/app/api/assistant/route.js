import OpenAI from 'openai';
const openai = new OpenAI();

export async function POST(request) {
  try {
    // Create the assistant
    const assistant = await openai.beta.assistants.create({
      name: "Math Tutor",
      instructions: "You are a personal math tutor. Write and run code to answer math questions.",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4o",
    });

    // Return the assistant ID as JSON
    return new Response(JSON.stringify({ assistantId: assistant.id }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error creating assistant:', error);

    // Return an error response with a 500 status
    return new Response(JSON.stringify({ error: 'Failed to create assistant' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

