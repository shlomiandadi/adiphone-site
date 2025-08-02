import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAdminUser } from '@/lib/adminAuth';

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAdminUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // מחיקת פריטי התפריט תחילה (בגלל ה-cascade)
    await prisma.menuItem.deleteMany({
      where: { menuId: id },
    });

    // מחיקת התפריט
    await prisma.menu.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Menu deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAdminUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const menu = await prisma.menu.findUnique({
      where: { id },
      include: {
        menuItems: {
          include: {
            children: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!menu) {
      return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
    }

    return NextResponse.json({ menu });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 