import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing OpenAI API key' }, { status: 500 });
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'אתה עוזר חכם, מקצועי, מסביר בעברית פשוטה על בניית אתרים, קידום אתרים, אוטומציות, AI, ושיווק דיגיטלי.' },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json({ error }, { status: 500 });
  }

  const data = await response.json();
  return NextResponse.json({ answer: data.choices?.[0]?.message?.content || 'לא התקבלה תשובה מהבוט.' });
} 