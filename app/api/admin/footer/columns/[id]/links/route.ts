import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAdminUser } from '@/lib/adminAuth';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAdminUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: columnId } = params;
    const body = await request.json();
    
    const {
      title,
      url,
      pageId,
      order,
      isActive,
      openInNewTab,
      icon,
    } = body;

    const link = await prisma.footerLink.create({
      data: {
        title,
        url,
        pageId: pageId || null,
        order,
        isActive,
        openInNewTab,
        icon: icon || null,
        columnId,
      },
    });

    return NextResponse.json({ link });
  } catch (error) {
    console.error('Error creating footer link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 