import { NextRequest, NextResponse } from 'next/server';
import { handleChatRequest } from '@/lib/chatbot/handle';
import { clientIpFromHeaders, MESSAGES, type ChatCompletionRequest } from '@/lib/chatbot/policy';
import { neonUsageStore } from '@/lib/chatbot/store';
import { verifyTurnstileToken } from '@/lib/chatbot/turnstile';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function completeWithOpenAI(apiKey: string, request: ChatCompletionRequest): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('openai request failed');
  }

  const data = await response.json();
  const answer = data?.choices?.[0]?.message?.content;
  if (typeof answer !== 'string') {
    return MESSAGES.emptyAnswer;
  }
  return answer;
}

export async function POST(req: NextRequest) {
  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const result = await handleChatRequest({
    userAgent: req.headers.get('user-agent'),
    body,
    ip: clientIpFromHeaders((name) => req.headers.get(name)),
    env: process.env,
    store: neonUsageStore,
    verifyTurnstile: verifyTurnstileToken,
    complete: completeWithOpenAI,
  });

  return NextResponse.json(result.body, { status: result.status });
}
