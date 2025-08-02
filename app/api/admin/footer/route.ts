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

    const footer = await prisma.footer.findFirst({
      include: {
        columns: {
          include: {
            links: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
    
    return NextResponse.json({ footer });
  } catch (error) {
    console.error('Error fetching footer:', error);
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
      description,
      backgroundColor,
      textColor,
      linkColor,
      linkHoverColor,
      showNewsletter,
      newsletterTitle,
      newsletterDescription,
      newsletterPlaceholder,
      newsletterButtonText,
      showSocialLinks,
      copyrightText,
    } = body;

    const existingFooter = await prisma.footer.findFirst();
    
    let footer;
    if (existingFooter) {
      footer = await prisma.footer.update({
        where: { id: existingFooter.id },
        data: {
          logo,
          logoAlt,
          logoWidth,
          logoHeight,
          description,
          backgroundColor,
          textColor,
          linkColor,
          linkHoverColor,
          showNewsletter,
          newsletterTitle,
          newsletterDescription,
          newsletterPlaceholder,
          newsletterButtonText,
          showSocialLinks,
          copyrightText,
        },
        include: {
          columns: {
            include: {
              links: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
    } else {
      footer = await prisma.footer.create({
        data: {
          logo,
          logoAlt,
          logoWidth,
          logoHeight,
          description,
          backgroundColor,
          textColor,
          linkColor,
          linkHoverColor,
          showNewsletter,
          newsletterTitle,
          newsletterDescription,
          newsletterPlaceholder,
          newsletterButtonText,
          showSocialLinks,
          copyrightText,
        },
        include: {
          columns: {
            include: {
              links: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
    }

    return NextResponse.json({ footer });
  } catch (error) {
    console.error('Error saving footer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 