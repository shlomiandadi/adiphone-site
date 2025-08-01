import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      // פענוח URL encoding
      const decodedSlug = decodeURIComponent(slug);
      
      const page = await prisma.page.findUnique({
        where: { 
          slug: decodedSlug,
          published: true 
        },
        include: {
          templateRelation: {
            include: {
              sections: {
                orderBy: {
                  order: 'asc'
                }
              }
            }
          }
        }
      });

      if (!page) {
        return NextResponse.json({ error: 'הדף לא נמצא' }, { status: 404 });
      }

      return NextResponse.json(page);
    }

    // אם לא הועבר slug, החזר את כל הדפים
    const pages = await prisma.page.findMany({
      where: { published: true },
      include: {
        templateRelation: {
          include: {
            sections: {
              orderBy: {
                order: 'asc'
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 });
  }
} 