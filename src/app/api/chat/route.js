import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI();

export async function POST(request) {
  const { messages } = await request.json(); // Get the prompt from the frontend

  try {
    // Call OpenAI's API with the GPT model
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Replace with "gpt-3.5-turbo" if needed
      messages: messages.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      })),
    });

    // Return the response from OpenAI
    return NextResponse.json({ text: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate a response from OpenAI' }, { status: 500 });
  }
}

