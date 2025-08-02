import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAdminUser } from '@/lib/adminAuth';

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; linkId: string } }
) {
  try {
    const user = await getAdminUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { linkId } = params;

    await prisma.footerLink.delete({
      where: { id: linkId },
    });

    return NextResponse.json({ message: 'Footer link deleted successfully' });
  } catch (error) {
    console.error('Error deleting footer link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 