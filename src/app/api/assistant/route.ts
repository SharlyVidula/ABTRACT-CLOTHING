import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid message history' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ_API_KEY is not configured' }, { status: 500 });
    }

    const systemInstruction = `
      You are the Style Assistant for ABSTRACT, a premium fashion boutique based in Sri Lanka.
      You help customers with sizing advice, outfit styling, fabric questions, and general information about our clothing collection.
      Speak in a warm, friendly, and natural tone — like a knowledgeable shop assistant, not a robot.
      Keep responses concise and helpful. If asked about measurements, direct them to the Size Guide in the product page.
      Our customers are everyday Sri Lankan people, so be approachable and clear. Avoid technical jargon or futuristic language.
    `;

    // Map roles to standard OpenAI/Groq formats
    const groqMessages = [
      { role: 'system', content: systemInstruction },
      ...messages.map((msg: any) => ({
        role: msg.role === 'model' ? 'assistant' : msg.role,
        content: msg.content,
      }))
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: groqMessages,
      model: 'llama-3.3-70b-versatile',
    });

    const responseText = chatCompletion.choices[0]?.message?.content || '';

    return NextResponse.json({ message: responseText });

  } catch (error) {
    console.error('AI Assistant error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
