import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAdminUser } from '../../../../lib/adminAuth';

const prisma = new PrismaClient();

// GET - קבלת כל הדפים
export async function GET(req: NextRequest) {
  try {
    const user = await getAdminUser();
    if (!user) {
      return NextResponse.json({ error: 'לא מורשה' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const template = searchParams.get('template') || '';
    const published = searchParams.get('published');

    const skip = (page - 1) * limit;

    // בניית תנאי החיפוש
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (template) {
      where.template = template;
    }

    if (published !== null && published !== undefined) {
      where.published = published === 'true';
    }

    // קבלת הדפים
    const pages = await prisma.page.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ],
      skip,
      take: limit
    });

    // ספירת הדפים הכוללת
    const total = await prisma.page.count({ where });

    return NextResponse.json({
      pages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הדפים' },
      { status: 500 }
    );
  }
}

// POST - יצירת דף חדש
export async function POST(req: NextRequest) {
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
      template = 'GENERAL',
      published = true,
      order = 0,
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

    // בדיקה אם ה-slug כבר קיים
    const existingPage = await prisma.page.findUnique({
      where: { slug: finalSlug }
    });

    if (existingPage) {
      return NextResponse.json(
        { error: 'דף עם URL זה כבר קיים' },
        { status: 400 }
      );
    }

    // יצירת הדף
    const newPage = await prisma.page.create({
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
      message: 'דף נוצר בהצלחה',
      page: newPage
    });

  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת הדף' },
      { status: 500 }
    );
  }
} 