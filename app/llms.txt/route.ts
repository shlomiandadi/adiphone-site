import { NextResponse } from 'next/server';
import { buildLlmsTxt } from '../../seo-agent-apply';
import { LLMS_CACHE_TAG, PUBLIC_CACHE_CONTROL, contentCache } from '../../lib/contentCache';

export const revalidate = 3600;

const getLlmsTxtCached = contentCache('llms-txt', [LLMS_CACHE_TAG], () => buildLlmsTxt());

export async function GET() {
  const body = await getLlmsTxtCached();
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': PUBLIC_CACHE_CONTROL,
    },
  });
}
