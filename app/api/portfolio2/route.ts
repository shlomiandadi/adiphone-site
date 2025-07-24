import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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
      return NextResponse.json(project);
    } else {
      const projects = await prisma.portfolioProject2.findMany({
        orderBy: { date: 'desc' },
      });
      return NextResponse.json(projects);
    }
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : error }, { status: 500 });
  }
} 