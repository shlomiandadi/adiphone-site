import { hashIp } from './ipHash.ts';
import {
  buildChatCompletionBody,
  checkChatQuota,
  isObviousBot,
  MESSAGES,
  parseChatPayload,
  turnstileRequired,
  type ChatCompletionRequest,
  type EnvLike,
  type UsageStore,
} from './policy.ts';

export type ChatHandlerResult = {
  status: number;
  body: { answer?: string; error?: string };
};

export async function handleChatRequest(input: {
  userAgent: string | null;
  body: unknown;
  ip: string;
  env: EnvLike;
  now?: Date;
  store: UsageStore;
  complete: (apiKey: string, request: ChatCompletionRequest) => Promise<string>;
  verifyTurnstile?: (token: string, secret: string, ip: string) => Promise<boolean>;
}): Promise<ChatHandlerResult> {
  if (isObviousBot(input.userAgent)) {
    return { status: 403, body: { error: MESSAGES.bot } };
  }

  const now = input.now ?? new Date();
  const parsed = parseChatPayload(input.body, now.getTime());
  if (!parsed.ok) {
    return { status: parsed.status, body: { error: parsed.error } };
  }

  const secret = input.env.TURNSTILE_SECRET_KEY;
  if (turnstileRequired(secret)) {
    const token = parsed.payload.turnstileToken;
    if (!token || !input.verifyTurnstile) {
      return { status: 403, body: { error: MESSAGES.turnstile } };
    }
    const allowed = await input.verifyTurnstile(token, secret.trim(), input.ip).catch(() => false);
    if (!allowed) {
      return { status: 403, body: { error: MESSAGES.turnstile } };
    }
  }

  const quota = await checkChatQuota({
    ipHash: hashIp(input.ip),
    now,
    env: input.env,
    store: input.store,
  });
  if (!quota.ok) {
    return { status: quota.status, body: { error: quota.error } };
  }

  const apiKey = input.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return { status: 500, body: { error: MESSAGES.upstream } };
  }

  try {
    const answer = await input.complete(
      apiKey,
      buildChatCompletionBody(parsed.payload.message, parsed.payload.history),
    );
    const text = answer.trim();
    if (!text) {
      return { status: 200, body: { answer: MESSAGES.emptyAnswer } };
    }
    return { status: 200, body: { answer: text } };
  } catch {
    return { status: 502, body: { error: MESSAGES.upstream } };
  }
}
