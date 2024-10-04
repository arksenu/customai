import OpenAI from "openai";

const openai = new OpenAI()'

export default async function handler(req, res) {
  if (req.method == 'POST') {
    const { msg } = req.body;
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
        { role: "system", content: "You are an assistant"},
        { role: "user", content: msg },
        ],
      });

      res.status(200).json({ text: completion.choices[0].message.content });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

