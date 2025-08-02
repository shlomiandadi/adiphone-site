import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAdminUser } from '@/lib/adminAuth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const user = await getAdminUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    const { title, order, isActive } = body;

    // מציאת הפוטר הקיים
    const footer = await prisma.footer.findFirst();
    if (!footer) {
      return NextResponse.json({ error: 'Footer not found' }, { status: 404 });
    }

    const column = await prisma.footerColumn.create({
      data: {
        title,
        order,
        isActive,
        footerId: footer.id,
      },
      include: {
        links: true,
      },
    });

    return NextResponse.json({ column });
  } catch (error) {
    console.error('Error creating footer column:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 