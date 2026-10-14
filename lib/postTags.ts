import { PrismaClient } from '@prisma/client';
import { slugify } from './slugify';

type PrismaLike = Pick<PrismaClient, 'tag' | 'postTag'>;

export function normalizeTagNames(input: unknown): string[] {
  const values = Array.isArray(input)
    ? input
    : typeof input === 'string'
      ? input.split(',')
      : [];
  const names = values
    .map((value) => String(value ?? '').trim())
    .filter(Boolean);
  return Array.from(new Set(names));
}

export async function syncPostTags(prisma: PrismaLike, postId: string, tagNames: string[]) {
  const names = normalizeTagNames(tagNames);
  const tags = [];

  for (const name of names) {
    const slug = slugify(name) || name.toLowerCase();
    const existingBySlug = await prisma.tag.findUnique({ where: { slug } });
    const existingByName = existingBySlug
      ? existingBySlug
      : await prisma.tag.findUnique({ where: { name } });

    if (existingByName) {
      tags.push(existingByName);
      continue;
    }

    tags.push(
      await prisma.tag.create({
        data: { name, slug },
      })
    );
  }

  await prisma.postTag.deleteMany({ where: { postId } });
  if (tags.length > 0) {
    await prisma.postTag.createMany({
      data: tags.map((tag) => ({ postId, tagId: tag.id })),
      skipDuplicates: true,
    });
  }

  return names;
}

export function tagPathValues(names: Array<string | null | undefined>, slugs: Array<string | null | undefined> = []) {
  return [...names, ...slugs].filter((value): value is string => Boolean(value && value.trim()));
}
