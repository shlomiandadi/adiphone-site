import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const pages = await prisma.page.findMany({
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
    return NextResponse.json({ error: 'שגיאה בטעינת הדפים' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, content, templateId, published = false, templateSections } = body;

    // בדיקה שהדף לא קיים כבר
    const existingPage = await prisma.page.findUnique({
      where: { slug }
    });

    if (existingPage) {
      return NextResponse.json({ error: 'דף עם URL זה כבר קיים' }, { status: 400 });
    }

    // אם יש סקשנים מעודכנים, צור תבנית חדשה עבור הדף הזה
    let finalTemplateId = templateId;
    if (templateSections && templateSections.length > 0) {
      const customTemplate = await prisma.template.create({
        data: {
          name: `${title} - תבנית מותאמת`,
          description: `תבנית מותאמת אישית עבור ${title}`,
          sections: {
            create: templateSections.map((section: any, index: number) => ({
              type: section.type,
              title: section.title,
              content: section.content,
              order: index
            }))
          }
        }
      });
      finalTemplateId = customTemplate.id;
    }

    // יצירת הדף
    const page = await prisma.page.create({
      data: {
        title,
        slug,
        content,
        templateId: finalTemplateId,
        published,
        metaTitle: title,
        metaDesc: content ? content.substring(0, 160) : '',
        excerpt: content ? content.substring(0, 200) : ''
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

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: 'שגיאה ביצירת הדף' }, { status: 500 });
  }
} 