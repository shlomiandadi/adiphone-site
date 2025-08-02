import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const settings = await prisma.sitemapSettings.findFirst();
    
    if (!settings) {
      // יצירת הגדרות ברירת מחדל אם לא קיימות
      const defaultSettings = await prisma.sitemapSettings.create({
        data: {
          isEnabled: true,
          includePages: true,
          includePosts: true,
          includeCategories: true,
          includePortfolio: true,
          excludePages: ['/admin', '/admin/*', '/api/*', '/_next/*'],
          excludePaths: ['/admin', '/api', '/_next'],
          priority: 0.8,
          changeFreq: 'weekly'
        }
      });
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('שגיאה בטעינת הגדרות מפת אתר:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הגדרות מפת אתר' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const settings = await prisma.sitemapSettings.findFirst();
    
    if (settings) {
      const updatedSettings = await prisma.sitemapSettings.update({
        where: { id: settings.id },
        data: {
          isEnabled: body.isEnabled,
          includePages: body.includePages,
          includePosts: body.includePosts,
          includeCategories: body.includeCategories,
          includePortfolio: body.includePortfolio,
          excludePages: body.excludePages,
          excludePaths: body.excludePaths,
          priority: body.priority,
          changeFreq: body.changeFreq,
          lastModified: new Date()
        }
      });
      return NextResponse.json(updatedSettings);
    } else {
      const newSettings = await prisma.sitemapSettings.create({
        data: {
          isEnabled: body.isEnabled,
          includePages: body.includePages,
          includePosts: body.includePosts,
          includeCategories: body.includeCategories,
          includePortfolio: body.includePortfolio,
          excludePages: body.excludePages,
          excludePaths: body.excludePaths,
          priority: body.priority,
          changeFreq: body.changeFreq
        }
      });
      return NextResponse.json(newSettings);
    }
  } catch (error) {
    console.error('שגיאה בעדכון הגדרות מפת אתר:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון הגדרות מפת אתר' },
      { status: 500 }
    );
  }
} 