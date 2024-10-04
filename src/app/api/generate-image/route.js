import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI();

export async function POST(request) {
  const { prompt } = await request.json(); // Extract the prompt from the request body

  try {
    // Generate an image using OpenAI's DALL·E model
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    // Extract the image URL from the response
    const imageUrl = response.data[0].url;

    // Return the image URL to the frontend
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}

