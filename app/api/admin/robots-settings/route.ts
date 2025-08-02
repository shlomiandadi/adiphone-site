import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const settings = await prisma.robotsSettings.findFirst();
    
    if (!settings) {
      // יצירת הגדרות ברירת מחדל אם לא קיימות
      const defaultSettings = await prisma.robotsSettings.create({
        data: {
          userAgent: '*',
          allowPaths: ['/', '/services', '/about', '/portfolio', '/blog', '/contact'],
          disallowPaths: ['/admin', '/api', '/_next', '/private'],
          crawlDelay: 1,
          sitemapUrl: 'https://adi-phone.co.il/sitemap.xml',
          isActive: true
        }
      });
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('שגיאה בטעינת הגדרות robots.txt:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הגדרות robots.txt' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const settings = await prisma.robotsSettings.findFirst();
    
    if (settings) {
      const updatedSettings = await prisma.robotsSettings.update({
        where: { id: settings.id },
        data: {
          userAgent: body.userAgent,
          allowPaths: body.allowPaths,
          disallowPaths: body.disallowPaths,
          crawlDelay: body.crawlDelay,
          sitemapUrl: body.sitemapUrl,
          isActive: body.isActive
        }
      });
      return NextResponse.json(updatedSettings);
    } else {
      const newSettings = await prisma.robotsSettings.create({
        data: {
          userAgent: body.userAgent,
          allowPaths: body.allowPaths,
          disallowPaths: body.disallowPaths,
          crawlDelay: body.crawlDelay,
          sitemapUrl: body.sitemapUrl,
          isActive: body.isActive
        }
      });
      return NextResponse.json(newSettings);
    }
  } catch (error) {
    console.error('שגיאה בעדכון הגדרות robots.txt:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון הגדרות robots.txt' },
      { status: 500 }
    );
  }
} 