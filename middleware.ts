import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { applySeoAgentRedirects } from './seo-agent-apply/middleware';

export async function middleware(request: NextRequest) {
  const seoRedirect = await applySeoAgentRedirects(request);
  if (seoRedirect) return seoRedirect;

  const response = NextResponse.next();

  if (request.nextUrl.pathname.startsWith('/api')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set(
      'Access-Control-Allow-Headers',
      'X-Requested-With, Content-Type, Authorization, X-SEO-Agent-Signature'
    );

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: response.headers,
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
