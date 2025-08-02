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

    // מחיקת הקישורים תחילה (בגלל ה-cascade)
    await prisma.footerLink.deleteMany({
      where: { columnId: id },
    });

    // מחיקת העמודה
    await prisma.footerColumn.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Footer column deleted successfully' });
  } catch (error) {
    console.error('Error deleting footer column:', error);
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

    const column = await prisma.footerColumn.findUnique({
      where: { id },
      include: {
        links: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!column) {
      return NextResponse.json({ error: 'Footer column not found' }, { status: 404 });
    }

    return NextResponse.json({ column });
  } catch (error) {
    console.error('Error fetching footer column:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 