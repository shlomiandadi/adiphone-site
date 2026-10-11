import { createHmac, timingSafeEqual } from 'crypto';

export function verifySeoAgentSignature(
  rawBody: string,
  signature: string | null | undefined,
  secret: string | null | undefined
): boolean {
  if (!signature || !secret) return false;

  const normalizedSignature = signature.replace(/^sha256=/i, '').trim();
  const expected = createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');

  try {
    const left = Buffer.from(normalizedSignature, 'hex');
    const right = Buffer.from(expected, 'hex');
    if (left.length !== right.length) return false;
    return timingSafeEqual(left, right);
  } catch {
    return false;
  }
}
