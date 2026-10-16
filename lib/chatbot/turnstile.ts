type SiteverifyResponse = {
  success?: boolean;
};

export async function verifyTurnstileToken(
  token: string,
  secret: string,
  ip: string,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  const body = new URLSearchParams();
  body.set('secret', secret);
  body.set('response', token);
  if (ip && ip !== 'unknown') body.set('remoteip', ip);

  const response = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!response.ok) return false;
  const data = (await response.json()) as SiteverifyResponse;
  return data.success === true;
}
