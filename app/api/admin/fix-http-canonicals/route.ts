import { createHmac, timingSafeEqual } from 'crypto';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { getSiteUrl } from '../../../../lib/seo';

export const dynamic = 'force-dynamic';

function verifySecret(request: NextRequest): boolean {
  const secret = process.env.SEO_AGENT_WEBHOOK_SECRET;
  if (!secret) return false;

  const header = request.headers.get('x-seo-agent-secret') || request.headers.get('x-seo-agent-signature') || '';
  const normalized = header.replace(/^sha256=/i, '').trim();
  if (!normalized) return false;

  try {
    return timingSafeEqual(Buffer.from(normalized), Buffer.from(secret));
  } catch {
    return normalized === secret;
  }
}

/** POST — rewrite http:// canonicalUrl values in DB to https:// (one-time maintenance). */
export async function POST(request: NextRequest) {
  if (!verifySecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const prisma = new PrismaClient();
  const siteUrl = getSiteUrl();

  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [{ canonicalUrl: { startsWith: 'http://' } }, { canonicalUrl: null }],
      },
      select: { id: true, slug: true, canonicalUrl: true },
    });

    const updated: string[] = [];
    for (const post of posts) {
      const httpsCanonical = `${siteUrl}/blog/${post.slug}`;
      if (post.canonicalUrl === httpsCanonical) continue;
      await prisma.post.update({
        where: { id: post.id },
        data: { canonicalUrl: httpsCanonical },
      });
      updated.push(post.slug);
    }

    return NextResponse.json({
      success: true,
      updatedCount: updated.length,
      updatedSlugs: updated,
    });
  } catch (error) {
    console.error('fix-http-canonicals API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
