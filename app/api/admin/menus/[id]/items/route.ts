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

    const { id: menuId } = params;
    const body = await request.json();
    
    const {
      title,
      url,
      pageId,
      order,
      isActive,
      openInNewTab,
      icon,
      cssClass,
      parentId,
    } = body;

    const menuItem = await prisma.menuItem.create({
      data: {
        title,
        url,
        pageId: pageId || null,
        order,
        isActive,
        openInNewTab,
        icon: icon || null,
        cssClass: cssClass || null,
        menuId,
        parentId: parentId || null,
      },
      include: {
        children: true,
      },
    });

    return NextResponse.json({ menuItem });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 