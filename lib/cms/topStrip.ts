import prisma from '../prisma';
import { cmsRead, isCmsEnabled } from './enabled';

export async function getActiveTopStrip() {
  return cmsRead(async () => {
    const row = await prisma.topStrip.findFirst({
      where: { isActive: true },
    });
    if (!row || !isCmsEnabled(row)) return null;
    return row;
  });
}
