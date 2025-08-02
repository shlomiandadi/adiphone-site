import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAdminUser } from '@/lib/adminAuth';

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const user = await getAdminUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId } = params;

    // מחיקת פריטי תפריט ילדים תחילה (בגלל ה-cascade)
    await prisma.menuItem.deleteMany({
      where: { parentId: itemId },
    });

    // מחיקת פריט התפריט
    await prisma.menuItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 