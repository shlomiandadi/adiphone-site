import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const page = await prisma.page.findUnique({
      where: { id: params.id },
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
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: 'שגיאה בטעינת הדף' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, slug, content, templateId, published, templateSections } = body;

    // בדיקה שהדף קיים
    const existingPage = await prisma.page.findUnique({
      where: { id: params.id }
    });

    if (!existingPage) {
      return NextResponse.json({ error: 'הדף לא נמצא' }, { status: 404 });
    }

    // בדיקה שהדף לא קיים כבר עם ה-slug החדש (אם השתנה)
    if (slug && slug !== existingPage.slug) {
      const duplicatePage = await prisma.page.findUnique({
        where: { slug }
      });

      if (duplicatePage) {
        return NextResponse.json({ error: 'דף עם URL זה כבר קיים' }, { status: 400 });
      }
    }

    // אם יש סקשנים מעודכנים, צור תבנית חדשה או עדכן את הקיימת
    let finalTemplateId = templateId;
    if (templateSections && templateSections.length > 0) {
      // בדוק אם יש תבנית קיימת לדף הזה
      if (existingPage.templateId) {
        // עדכן את התבנית הקיימת
        await prisma.section.deleteMany({
          where: { templateId: existingPage.templateId }
        });
        
        await prisma.template.update({
          where: { id: existingPage.templateId },
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
        finalTemplateId = existingPage.templateId;
      } else {
        // צור תבנית חדשה
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
    }

    // עדכון הדף
    const updatedPage = await prisma.page.update({
      where: { id: params.id },
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

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json({ error: 'שגיאה בעדכון הדף' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // בדיקה שהדף קיים
    const existingPage = await prisma.page.findUnique({
      where: { id: params.id }
    });

    if (!existingPage) {
      return NextResponse.json({ error: 'הדף לא נמצא' }, { status: 404 });
    }

    // מחיקת הדף
    await prisma.page.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'הדף נמחק בהצלחה' });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json({ error: 'שגיאה במחיקת הדף' }, { status: 500 });
  }
} 