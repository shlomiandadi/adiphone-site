import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const templates = await prisma.template.findMany({
      include: {
        sections: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'שגיאה בטעינת התבניות' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, sections } = body;

    // יצירת התבנית
    const template = await prisma.template.create({
      data: {
        name,
        description,
        sections: {
          create: sections.map((section: any, index: number) => ({
            type: section.type,
            title: section.title,
            content: section.content,
            order: index
          }))
        }
      },
      include: {
        sections: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json({ error: 'שגיאה ביצירת התבנית' }, { status: 500 });
  }
} 