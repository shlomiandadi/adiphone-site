import { NextRequest, NextResponse } from 'next/server';
import { EDITOR_ROLES, requireAdminApiAuth } from '../../../lib/adminAuth';
import { PRIVATE_NO_STORE, PUBLIC_CACHE_CONTROL } from '../../../lib/contentCache';
import { getPublishedPortfolioBySlug, getPublishedPortfolioList } from '../../../lib/portfolioPublic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  try {
    if (slug) {
      const project = await getPublishedPortfolioBySlug(slug);
      if (!project) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      if (!project.published) {
        const unauthorized = await requireAdminApiAuth({ role: [...EDITOR_ROLES] });
        if (unauthorized) return unauthorized;
        return NextResponse.json(project, {
          headers: { 'Cache-Control': PRIVATE_NO_STORE },
        });
      }
      return NextResponse.json(project, {
        headers: { 'Cache-Control': PUBLIC_CACHE_CONTROL },
      });
    }

    const projects = await getPublishedPortfolioList();
    return NextResponse.json(projects, {
      headers: { 'Cache-Control': PUBLIC_CACHE_CONTROL },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : error }, { status: 500 });
  }
}
