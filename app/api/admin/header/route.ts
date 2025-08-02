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

    const header = await prisma.header.findFirst();
    
    return NextResponse.json({ header });
  } catch (error) {
    console.error('Error fetching header:', error);
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
      logo,
      logoAlt,
      logoWidth,
      logoHeight,
      showSearch,
      searchPlaceholder,
      showContactButton,
      contactButtonText,
      contactButtonLink,
      backgroundColor,
      textColor,
      stickyHeader,
      showLanguageSwitcher,
      languages,
    } = body;

    const existingHeader = await prisma.header.findFirst();
    
    let header;
    if (existingHeader) {
      header = await prisma.header.update({
        where: { id: existingHeader.id },
        data: {
          logo,
          logoAlt,
          logoWidth,
          logoHeight,
          showSearch,
          searchPlaceholder,
          showContactButton,
          contactButtonText,
          contactButtonLink,
          backgroundColor,
          textColor,
          stickyHeader,
          showLanguageSwitcher,
          languages,
        },
      });
    } else {
      header = await prisma.header.create({
        data: {
          logo,
          logoAlt,
          logoWidth,
          logoHeight,
          showSearch,
          searchPlaceholder,
          showContactButton,
          contactButtonText,
          contactButtonLink,
          backgroundColor,
          textColor,
          stickyHeader,
          showLanguageSwitcher,
          languages,
        },
      });
    }

    return NextResponse.json({ header });
  } catch (error) {
    console.error('Error saving header:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 