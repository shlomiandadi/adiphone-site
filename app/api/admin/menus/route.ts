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

    const menus = await prisma.menu.findMany({
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
      orderBy: {
        name: 'asc',
      },
    });
    
    return NextResponse.json({ menus });
  } catch (error) {
    console.error('Error fetching menus:', error);
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
    
    const { name, location, isActive } = body;

    const menu = await prisma.menu.create({
      data: {
        name,
        location,
        isActive,
      },
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

    return NextResponse.json({ menu });
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 