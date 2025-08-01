import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAdminUser } from '../../../../../lib/adminAuth';

const prisma = new PrismaClient();

// GET - קבלת דף ספציפי
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAdminUser();
    if (!user) {
      return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
    }

    const page = await prisma.page.findUnique({
      where: { id: params.id },
      include: {
        parent: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        children: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    });

    if (!page) {
      return NextResponse.json({ error: 'דף לא נמצא' }, { status: 404 });
    }

    return NextResponse.json(page);

  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הדף' },
      { status: 500 }
    );
  }
}

// PUT - עדכון דף
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAdminUser();
    if (!user) {
      return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      slug,
      content,
      excerpt,
      template,
      published,
      order,
      metaTitle,
      metaDesc,
      metaKeywords,
      featuredImage,
      // שדות מותאמים לתבניות
      heroTitle,
      heroSubtitle,
      heroImage,
      heroButtonText,
      heroButtonLink,
      // שדות לשירותים
      serviceFeatures,
      serviceBenefits,
      servicePricing,
      // שדות לאודות
      aboutImage,
      aboutStats,
      teamMembers,
      // שדות לצור קשר
      contactInfo,
      contactForm,
      // שדות לדף נחיתה
      landingSections,
      testimonials,
      // שדות לבלוג
      blogAuthor,
      blogCategory,
      blogTags
    } = body;

    // בדיקה אם הדף קיים
    const existingPage = await prisma.page.findUnique({
      where: { id: params.id }
    });

    if (!existingPage) {
      return NextResponse.json({ error: 'דף לא נמצא' }, { status: 404 });
    }

    // יצירת slug - אם לא סופק slug מותאם, יצור אוטומטי מהכותרת
    let finalSlug = slug;
    if (!finalSlug || finalSlug.trim() === '') {
      finalSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\u0590-\u05FF]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    } else {
      // ניקוי ה-slug המותאם
      finalSlug = finalSlug
        .toLowerCase()
        .replace(/[^a-z0-9\u0590-\u05FF]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    // בדיקה אם ה-slug החדש כבר קיים (אם השתנה)
    if (finalSlug !== existingPage.slug) {
      const slugExists = await prisma.page.findFirst({
        where: {
          slug: finalSlug,
          id: { not: params.id }
        }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'דף עם URL זה כבר קיים' },
          { status: 400 }
        );
      }
    }

    // עדכון הדף
    const updatedPage = await prisma.page.update({
      where: { id: params.id },
      data: {
        title,
        slug: finalSlug,
        content,
        excerpt,
        template,
        published,
        order,
        metaTitle: metaTitle || title,
        metaDesc: metaDesc || excerpt || '',
        metaKeywords,
        featuredImage,
        // שדות מותאמים לתבניות
        heroTitle,
        heroSubtitle,
        heroImage,
        heroButtonText,
        heroButtonLink,
        // שדות לשירותים
        serviceFeatures,
        serviceBenefits,
        servicePricing,
        // שדות לאודות
        aboutImage,
        aboutStats,
        teamMembers,
        // שדות לצור קשר
        contactInfo,
        contactForm,
        // שדות לדף נחיתה
        landingSections,
        testimonials,
        // שדות לבלוג
        blogAuthor,
        blogCategory,
        blogTags
      }
    });

    return NextResponse.json({
      message: 'דף עודכן בהצלחה',
      page: updatedPage
    });

  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון הדף' },
      { status: 500 }
    );
  }
}

// DELETE - מחיקת דף
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAdminUser();
    if (!user) {
      return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
    }

    // בדיקה אם הדף קיים
    const existingPage = await prisma.page.findUnique({
      where: { id: params.id },
      include: {
        children: true
      }
    });

    if (!existingPage) {
      return NextResponse.json({ error: 'דף לא נמצא' }, { status: 404 });
    }

    // בדיקה אם יש דפי ילדים
    if (existingPage.children.length > 0) {
      return NextResponse.json(
        { error: 'לא ניתן למחוק דף שיש לו דפי ילדים' },
        { status: 400 }
      );
    }

    // מחיקת הדף
    await prisma.page.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      message: 'דף נמחק בהצלחה'
    });

  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת הדף' },
      { status: 500 }
    );
  }
} 