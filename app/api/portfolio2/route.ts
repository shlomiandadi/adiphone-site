import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { EDITOR_ROLES, requireAdminApiAuth } from '../../../lib/adminAuth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  try {
    if (slug) {
      const project = await prisma.portfolioProject2.findUnique({
        where: { slug },
      });
      if (!project) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      if (!project.published) {
        const unauthorized = await requireAdminApiAuth({ role: [...EDITOR_ROLES] });
        if (unauthorized) return unauthorized;
      }
      return NextResponse.json(project);
    } else {
      const projects = await prisma.portfolioProject2.findMany({
        where: { published: true }, // רק פרויקטים מפורסמים
        orderBy: { date: 'desc' },
      });
      return NextResponse.json(projects);
    }
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : error }, { status: 500 });
  }
} 