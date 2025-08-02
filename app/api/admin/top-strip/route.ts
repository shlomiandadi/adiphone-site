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

    const topStrip = await prisma.topStrip.findFirst();
    
    return NextResponse.json({ topStrip });
  } catch (error) {
    console.error('Error fetching top strip:', error);
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
      text,
      backgroundColor,
      textColor,
      isActive,
      showCloseButton,
      linkUrl,
      linkText,
    } = body;

    const existingTopStrip = await prisma.topStrip.findFirst();
    
    let topStrip;
    if (existingTopStrip) {
      topStrip = await prisma.topStrip.update({
        where: { id: existingTopStrip.id },
        data: {
          text,
          backgroundColor,
          textColor,
          isActive,
          showCloseButton,
          linkUrl,
          linkText,
        },
      });
    } else {
      topStrip = await prisma.topStrip.create({
        data: {
          text,
          backgroundColor,
          textColor,
          isActive,
          showCloseButton,
          linkUrl,
          linkText,
        },
      });
    }

    return NextResponse.json({ topStrip });
  } catch (error) {
    console.error('Error saving top strip:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 