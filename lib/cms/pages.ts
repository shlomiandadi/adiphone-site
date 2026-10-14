import prisma from '../prisma';
import { cmsCache } from './cache';
import { cmsRead, isCmsEnabled } from './enabled';

export const getCmsPageBySlug = cmsCache('cms-page-by-slug', async (slug: string) => {
  return cmsRead(async () => {
    const normalized = slug.startsWith('/') ? slug : `/${slug}`;
    const row = await prisma.cmsPage.findFirst({
      where: {
        published: true,
        OR: [{ slug }, { slug: normalized }, { slug: slug.replace(/^\//, '') }],
      },
      include: {
        cmsTemplate: { include: { sections: { orderBy: { order: 'asc' } } } },
      },
    });
    if (!row || !isCmsEnabled(row)) return null;
    return row;
  });
});

export const getTemplateSections = cmsCache('cms-template-sections', async (templateId: string) => {
  return cmsRead(async () => {
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: { sections: { orderBy: { order: 'asc' } } },
    });
    if (!template || !isCmsEnabled(template)) return null;
    return template.sections;
  });
});
