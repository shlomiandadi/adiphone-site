import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAdminUser } from '@/lib/adminAuth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const user = await getAdminUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await prisma.siteSettings.findFirst();
    
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAdminUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const {
      siteName,
      siteDescription,
      siteKeywords,
      siteUrl,
      siteLogo,
      siteFavicon,
      googleAnalyticsId,
      googleTagManagerId,
      facebookPixelId,
      twitterHandle,
      facebookPage,
      instagramHandle,
      linkedinPage,
    } = body;

    const existingSettings = await prisma.siteSettings.findFirst();
    
    let settings;
    if (existingSettings) {
      settings = await prisma.siteSettings.update({
        where: { id: existingSettings.id },
        data: {
          siteName,
          siteDescription,
          siteKeywords,
          siteUrl,
          siteLogo,
          siteFavicon,
          googleAnalyticsId,
          googleTagManagerId,
          facebookPixelId,
          twitterHandle,
          facebookPage,
          instagramHandle,
          linkedinPage,
        },
      });
    } else {
      settings = await prisma.siteSettings.create({
        data: {
          siteName,
          siteDescription,
          siteKeywords,
          siteUrl,
          siteLogo,
          siteFavicon,
          googleAnalyticsId,
          googleTagManagerId,
          facebookPixelId,
          twitterHandle,
          facebookPage,
          instagramHandle,
          linkedinPage,
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error saving site settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 