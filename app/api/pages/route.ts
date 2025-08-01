import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const template = searchParams.get('template');

  try {
    if (slug) {
      // קבלת דף ספציפי
      const page = await prisma.page.findUnique({
        where: { 
          slug,
          published: true 
        }
      });

      if (!page) {
        return NextResponse.json({ error: 'דף לא נמצא' }, { status: 404 });
      }

      return NextResponse.json(page);
    } else {
      // קבלת רשימת דפים
      const where: any = { published: true };
      
      if (template) {
        where.template = template;
      }

      const pages = await prisma.page.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          template: true,
          featuredImage: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: [
          { order: 'asc' },
          { createdAt: 'desc' }
        ]
      });

      return NextResponse.json(pages);
    }
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הדפים' },
      { status: 500 }
    );
  }
} 