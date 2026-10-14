import { NextRequest } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { FOOTER_IMPORT, stamp, touch, revalidateLayout } from '../../../../../lib/cms/admin';
import { cmsGet, cmsWrite } from '../../../../../lib/cms/adminHandler';

export const dynamic = 'force-dynamic';

export async function GET() {
  return cmsGet(async () => ({
    row: await prisma.footerSetting.findFirst({
      include: {
        columns: {
          orderBy: { order: 'asc' },
          include: { links: { orderBy: { order: 'asc' } } },
        },
      },
    }),
  }));
}

export async function PUT(request: NextRequest) {
  return cmsWrite(async () => {
    const body = await request.json();
    if (body.kind === 'column') {
      const payload = {
        title: String(body.title || ''),
        order: Number(body.order || 0),
        isActive: body.isActive !== false,
        footerId: String(body.footerId),
        cmsEnabled: Boolean(body.cmsEnabled),
      };
      const row = body.id
        ? await prisma.footerColumn.update({ where: { id: String(body.id) }, data: { ...payload, ...touch() } })
        : await prisma.footerColumn.create({ data: { ...payload, ...stamp() } });
      revalidateLayout();
      return { column: row };
    }
    if (body.kind === 'link') {
      const payload = {
        title: String(body.title || ''),
        url: body.url ? String(body.url) : '/',
        order: Number(body.order || 0),
        isActive: body.isActive !== false,
        openInNewTab: Boolean(body.openInNewTab),
        icon: body.icon ? String(body.icon) : null,
        columnId: String(body.columnId),
        cmsEnabled: Boolean(body.cmsEnabled),
      };
      const row = body.id
        ? await prisma.footerLink.update({ where: { id: String(body.id) }, data: { ...payload, ...touch() } })
        : await prisma.footerLink.create({ data: { ...payload, ...stamp() } });
      revalidateLayout();
      return { link: row };
    }
    const existing = await prisma.footerSetting.findFirst();
    const payload = {
      logo: body.logo ? String(body.logo) : null,
      logoAlt: body.logoAlt ? String(body.logoAlt) : null,
      logoWidth: Number(body.logoWidth || 120),
      logoHeight: Number(body.logoHeight || 40),
      description: body.description ? String(body.description) : null,
      backgroundColor: String(body.backgroundColor || '#1f2937'),
      textColor: String(body.textColor || '#ffffff'),
      linkColor: String(body.linkColor || '#9ca3af'),
      linkHoverColor: String(body.linkHoverColor || '#ffffff'),
      showNewsletter: Boolean(body.showNewsletter),
      newsletterTitle: String(body.newsletterTitle || ''),
      newsletterDescription: String(body.newsletterDescription || ''),
      newsletterPlaceholder: String(body.newsletterPlaceholder || ''),
      newsletterButtonText: String(body.newsletterButtonText || ''),
      showSocialLinks: Boolean(body.showSocialLinks),
      copyrightText: String(body.copyrightText || ''),
      cmsEnabled: Boolean(body.cmsEnabled),
    };
    const row = existing
      ? await prisma.footerSetting.update({ where: { id: existing.id }, data: { ...payload, ...touch() } })
      : await prisma.footerSetting.create({ data: { ...payload, ...stamp() } });
    revalidateLayout();
    return { row };
  });
}

export async function POST() {
  return cmsWrite(async () => {
    let footer = await prisma.footerSetting.findFirst();
    if (!footer) {
      footer = await prisma.footerSetting.create({
        data: {
          logo: '/logo.png',
          logoAlt: 'Top Webstak',
          logoWidth: 120,
          logoHeight: 40,
          description: FOOTER_IMPORT.description,
          backgroundColor: '#111827',
          textColor: '#ffffff',
          linkColor: '#9ca3af',
          linkHoverColor: '#ffffff',
          showNewsletter: false,
          newsletterTitle: 'הישארו מעודכנים',
          newsletterDescription: '',
          newsletterPlaceholder: 'האימייל שלכם',
          newsletterButtonText: 'הרשמה',
          showSocialLinks: true,
          copyrightText: FOOTER_IMPORT.copyrightText,
          cmsEnabled: false,
          ...stamp(),
        },
      });
    }
    const columns = await prisma.footerColumn.findMany({ where: { footerId: footer.id } });
    for (const column of columns) {
      await prisma.footerLink.deleteMany({ where: { columnId: column.id } });
    }
    await prisma.footerColumn.deleteMany({ where: { footerId: footer.id } });
    let columnOrder = 1;
    for (const column of FOOTER_IMPORT.columns) {
      const created = await prisma.footerColumn.create({
        data: {
          title: column.title,
          order: columnOrder++,
          isActive: true,
          footerId: footer.id,
          cmsEnabled: false,
          ...stamp(),
        },
      });
      let linkOrder = 1;
      for (const link of column.links) {
        await prisma.footerLink.create({
          data: {
            title: link.title,
            url: link.url,
            order: linkOrder++,
            isActive: true,
            openInNewTab: false,
            columnId: created.id,
            cmsEnabled: false,
            ...stamp(),
          },
        });
      }
    }
    revalidateLayout();
    return { ok: true };
  });
}

export async function DELETE(request: NextRequest) {
  return cmsWrite(async () => {
    const { id, kind } = await request.json();
    if (kind === 'column') {
      await prisma.footerLink.deleteMany({ where: { columnId: String(id) } });
      await prisma.footerColumn.delete({ where: { id: String(id) } });
    } else {
      await prisma.footerLink.delete({ where: { id: String(id) } });
    }
    revalidateLayout();
    return { ok: true };
  });
}
