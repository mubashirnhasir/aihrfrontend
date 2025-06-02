import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const prompt = body.prompt;

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'No prompt provided' }), {
        status: 400,
      });
    }

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: "system",
          content: `
You are an intelligent HR assistant for a company's HRMS dashboard. 
Answer only questions about features like attendance, leave, assets, documents, or payroll. 
If a user asks anything unrelated (like math, general trivia, or casual chat), respond:
"Sorry, I’m only trained to help with our HRMS system. Please ask a work-related question."
      `
        },
        { role: "user", content: prompt }
      ],
    });

    const reply = chatCompletion.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'OpenAI API Error' }), {
      status: 500,
    });
  }
}
