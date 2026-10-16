export const CHATBOT_MODEL = 'gpt-4o-mini';
export const CHATBOT_MAX_TOKENS = 300;
export const CHATBOT_MAX_MESSAGE_CHARS = 500;
export const CHATBOT_HISTORY_LIMIT = 6;
export const CHATBOT_MIN_PAGE_AGE_MS = 3000;
export const DEFAULT_IP_HOURLY_LIMIT = 10;
export const DEFAULT_IP_DAILY_LIMIT = 30;
export const DEFAULT_GLOBAL_DAILY_LIMIT = 300;

export const SYSTEM_PROMPT =
  'אתה עוזר חכם, מקצועי, מסביר בעברית פשוטה על בניית אתרים, קידום אתרים, אוטומציות, AI, ושיווק דיגיטלי.';

export const MESSAGES = {
  badRequest: 'לא הצלחנו לקרוא את ההודעה. נסו שוב.',
  missing: 'נא לכתוב הודעה.',
  tooLong: 'ההודעה ארוכה מדי. אפשר לשלוח עד 500 תווים.',
  tooFast: 'ההודעה נשלחה מהר מדי. המתינו רגע ונסו שוב.',
  bot: 'לא ניתן לעבד את הבקשה. אפשר לפנות בוואטסאפ או בטלפון 050-9159951.',
  turnstile: 'אימות האבטחה נכשל. רעננו את העמוד ונסו שוב, או פנו בוואטסאפ או בטלפון 050-9159951.',
  ipHour:
    'הגעתם למכסה של ההודעות לשעה. נסו שוב מאוחר יותר, או דברו איתנו בוואטסאפ או בטלפון 050-9159951.',
  ipDay: 'הגעתם למכסה היומית של ההודעות. נשמח לעזור בוואטסאפ או בטלפון 050-9159951.',
  global: 'הצ\'אט הגיע למכסה היומית. נשמח לעזור בוואטסאפ או בטלפון 050-9159951.',
  store: 'הצ\'אט אינו זמין כרגע. אפשר לדבר איתנו בוואטסאפ או בטלפון 050-9159951.',
  upstream: 'לא הצלחנו לקבל תשובה כרגע. נסו שוב, או דברו איתנו בוואטסאפ או בטלפון 050-9159951.',
  emptyAnswer: 'לא התקבלה תשובה מהבוט.',
} as const;

export type ChatRole = 'user' | 'assistant';

export type ChatHistoryMessage = {
  role: ChatRole;
  content: string;
};

export type ChatCompletionRequest = {
  model: typeof CHATBOT_MODEL;
  temperature: number;
  max_tokens: number;
  messages: { role: 'system' | ChatRole; content: string }[];
};

export type ChatLimits = {
  ipHourly: number;
  ipDaily: number;
  globalDaily: number;
};

export type UsageStore = {
  incrementPair: (hourKey: string, dayKey: string) => Promise<{ hour: number; day: number }>;
  increment: (key: string) => Promise<number>;
};

export type EnvLike = {
  OPENAI_API_KEY?: string;
  CHATBOT_DAILY_LIMIT?: string;
  CHATBOT_IP_HOURLY_LIMIT?: string;
  CHATBOT_IP_DAILY_LIMIT?: string;
  TURNSTILE_SECRET_KEY?: string;
  [key: string]: string | undefined;
};

const OBVIOUS_BOT_UA =
  /(?:^|[^a-z])(?!cubot(?:[^a-z]|$))[a-z]*bot(?:[^a-z]|$)|curl\/|wget\/|python-requests|python-urllib|go-http-client|okhttp|scrapy|phantomjs|headless|selenium|puppeteer|playwright|postmanruntime|insomnia|httpie|axios\/|node-fetch|undici|libwww|httpclient|java\/|spider|crawler|crawl\//i;

export function positiveInt(value: string | undefined, fallback: number): number {
  if (typeof value !== 'string') return fallback;
  const parsed = Number.parseInt(value.trim(), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

export function readLimits(env: EnvLike): ChatLimits {
  return {
    ipHourly: positiveInt(env.CHATBOT_IP_HOURLY_LIMIT, DEFAULT_IP_HOURLY_LIMIT),
    ipDaily: positiveInt(env.CHATBOT_IP_DAILY_LIMIT, DEFAULT_IP_DAILY_LIMIT),
    globalDaily: positiveInt(env.CHATBOT_DAILY_LIMIT, DEFAULT_GLOBAL_DAILY_LIMIT),
  };
}

export function isObviousBot(userAgent: string | null | undefined): boolean {
  if (typeof userAgent !== 'string') return true;
  const ua = userAgent.trim();
  if (!ua) return true;
  return OBVIOUS_BOT_UA.test(ua);
}

export function honeypotTripped(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value !== 'string') return true;
  return value.trim().length > 0;
}

export function isTooFast(openedAt: unknown, now = Date.now()): boolean {
  if (typeof openedAt !== 'number' || !Number.isFinite(openedAt)) return true;
  if (openedAt < 1_000_000_000_000) return true;
  return now - openedAt < CHATBOT_MIN_PAGE_AGE_MS;
}

export function turnstileRequired(secret: string | undefined | null): secret is string {
  return typeof secret === 'string' && secret.trim().length > 0;
}

export function normalizeMessage(
  raw: unknown,
): { ok: true; message: string } | { ok: false; error: string } {
  if (typeof raw !== 'string') return { ok: false, error: MESSAGES.missing };
  const message = raw.trim();
  if (!message) return { ok: false, error: MESSAGES.missing };
  if (message.length > CHATBOT_MAX_MESSAGE_CHARS) return { ok: false, error: MESSAGES.tooLong };
  return { ok: true, message };
}

export function sanitizeHistory(raw: unknown, currentMessage?: string): ChatHistoryMessage[] {
  if (!Array.isArray(raw)) return [];
  const cleaned: ChatHistoryMessage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const record = item as { role?: unknown; content?: unknown };
    if (typeof record.content !== 'string') continue;
    const content = record.content.trim().slice(0, CHATBOT_MAX_MESSAGE_CHARS);
    if (!content) continue;
    const role =
      record.role === 'assistant' || record.role === 'bot'
        ? 'assistant'
        : record.role === 'user'
          ? 'user'
          : null;
    if (!role) continue;
    cleaned.push({ role, content });
  }

  const trimmedCurrent = currentMessage?.trim();
  if (trimmedCurrent && cleaned.length > 0) {
    const last = cleaned[cleaned.length - 1];
    if (last.role === 'user' && last.content === trimmedCurrent) cleaned.pop();
  }

  return cleaned.slice(-CHATBOT_HISTORY_LIMIT);
}

export type ParsedChatPayload = {
  message: string;
  history: ChatHistoryMessage[];
  openedAt: number;
  turnstileToken: string | null;
};

export function parseChatPayload(
  body: unknown,
  now = Date.now(),
): { ok: true; payload: ParsedChatPayload } | { ok: false; status: 400; error: string } {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, status: 400, error: MESSAGES.badRequest };
  }
  const record = body as Record<string, unknown>;
  if (honeypotTripped(record.company)) {
    return { ok: false, status: 400, error: MESSAGES.bot };
  }
  if (isTooFast(record.openedAt, now)) {
    return { ok: false, status: 400, error: MESSAGES.tooFast };
  }
  const messageResult = normalizeMessage(record.message);
  if (!messageResult.ok) {
    return { ok: false, status: 400, error: messageResult.error };
  }
  const turnstileToken =
    typeof record.turnstileToken === 'string' && record.turnstileToken.trim()
      ? record.turnstileToken.trim()
      : null;
  return {
    ok: true,
    payload: {
      message: messageResult.message,
      history: sanitizeHistory(record.history, messageResult.message),
      openedAt: record.openedAt as number,
      turnstileToken,
    },
  };
}

export function jerusalemStamp(date: Date): { day: string; hour: string } {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  });
  const parts = Object.fromEntries(
    fmt
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  );
  let hour = parts.hour ?? '00';
  if (hour === '24') hour = '00';
  const day = `${parts.year}-${parts.month}-${parts.day}`;
  return { day, hour: `${day}T${hour}` };
}

export function usageKeys(ipHash: string, now: Date): { hourKey: string; dayKey: string; globalKey: string } {
  const stamp = jerusalemStamp(now);
  return {
    hourKey: `h:${ipHash}:${stamp.hour}`,
    dayKey: `d:${ipHash}:${stamp.day}`,
    globalKey: `g:${stamp.day}`,
  };
}

export function buildChatCompletionBody(
  message: string,
  history: ChatHistoryMessage[],
): ChatCompletionRequest {
  return {
    model: CHATBOT_MODEL,
    temperature: 0.7,
    max_tokens: CHATBOT_MAX_TOKENS,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: message },
    ],
  };
}

export async function consumeChatQuota(args: {
  ipHash: string;
  now: Date;
  limits: ChatLimits;
  store: UsageStore;
}): Promise<{ ok: true } | { ok: false; status: 429; error: string }> {
  const keys = usageKeys(args.ipHash, args.now);
  const ipUsage = await args.store.incrementPair(keys.hourKey, keys.dayKey);
  if (ipUsage.hour > args.limits.ipHourly) {
    return { ok: false, status: 429, error: MESSAGES.ipHour };
  }
  if (ipUsage.day > args.limits.ipDaily) {
    return { ok: false, status: 429, error: MESSAGES.ipDay };
  }
  const globalCount = await args.store.increment(keys.globalKey);
  if (globalCount > args.limits.globalDaily) {
    return { ok: false, status: 429, error: MESSAGES.global };
  }
  return { ok: true };
}

export async function checkChatQuota(args: {
  ipHash: string;
  now: Date;
  env: EnvLike;
  store: UsageStore;
}): Promise<{ ok: true } | { ok: false; status: 429 | 503; error: string }> {
  try {
    return await consumeChatQuota({
      ipHash: args.ipHash,
      now: args.now,
      limits: readLimits(args.env),
      store: args.store,
    });
  } catch {
    return { ok: false, status: 503, error: MESSAGES.store };
  }
}

export function clientIpFromHeaders(getHeader: (name: string) => string | null): string {
  const netlifyIp = getHeader('x-nf-client-connection-ip')?.trim();
  if (netlifyIp) return netlifyIp;
  const forwarded = getHeader('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  const realIp = getHeader('x-real-ip')?.trim();
  if (realIp) return realIp;
  return 'unknown';
}

export function chatbotRequestBody(input: {
  message: string;
  history: { role: string; content: string }[];
  openedAt: number;
  company: string;
  turnstileToken?: string | null;
}): Record<string, unknown> {
  const body: Record<string, unknown> = {
    message: input.message,
    history: input.history.slice(-CHATBOT_HISTORY_LIMIT).map((item) => ({
      role: item.role,
      content: typeof item.content === 'string' ? item.content.slice(0, CHATBOT_MAX_MESSAGE_CHARS) : '',
    })),
    openedAt: input.openedAt,
    company: input.company,
  };
  if (input.turnstileToken && input.turnstileToken.trim()) {
    body.turnstileToken = input.turnstileToken.trim();
  }
  return body;
}

export function readTurnstileToken(): string | null {
  if (typeof document === 'undefined') return null;
  const input = document.querySelector('input[name="cf-turnstile-response"]');
  if (input instanceof HTMLInputElement && input.value.trim()) return input.value.trim();
  return null;
}

export function chatbotReplyText(data: unknown): string {
  if (data && typeof data === 'object') {
    const record = data as { answer?: unknown; error?: unknown };
    if (typeof record.answer === 'string' && record.answer.trim()) return record.answer;
    if (typeof record.error === 'string' && record.error.trim()) return record.error;
  }
  return MESSAGES.upstream;
}
