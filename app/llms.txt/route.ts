import { NextResponse } from 'next/server';
import { buildLlmsTxt } from '../../seo-agent-apply';

export const dynamic = 'force-dynamic';

export async function GET() {
  const body = await buildLlmsTxt();
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
