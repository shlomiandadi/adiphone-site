import { PrismaClient, Post } from '@prisma/client';

const prisma = new PrismaClient();

type Category = 'SEO' | 'WEB_DEVELOPMENT' | 'APP_DEVELOPMENT' | 'DIGITAL_MARKETING' | 'UI_UX' | 'ECOMMERCE';

export async function getPublishedPosts({ limit }: { limit?: number } = {}): Promise<Post[]> {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return prisma.post.findUnique({
    where: { slug },
  });
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug }
  });

  if (!category) {
    return [];
  }

  return prisma.post.findMany({
    where: { 
      categoryId: category.id,
      published: true 
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getRelatedPosts(currentPostId: string, categorySlug: string): Promise<Post[]> {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug }
  });

  if (!category) {
    return [];
  }

  return prisma.post.findMany({
    where: {
      categoryId: category.id,
      published: true,
      id: { not: currentPostId },
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });
}

export async function searchPosts(tag: string): Promise<Post[]> {
  return prisma.post.findMany({
    where: {
      tags: { has: tag },
      published: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createPost(data: {
  title: string;
  content: string;
  excerpt: string;
  mainImage: string;
  images?: string[];
  categorySlug: string;
  tags: string[];
  authorName: string;
  authorEmail: string;
  metaTitle: string;
  metaDesc: string;
}) {
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

  const category = await prisma.category.findUnique({
    where: { slug: data.categorySlug }
  });

  return prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      mainImage: data.mainImage,
      images: data.images || [],
      categoryId: category?.id || null,
      tags: data.tags,
      authorName: data.authorName,
      authorEmail: data.authorEmail,
      metaTitle: data.metaTitle,
      metaDesc: data.metaDesc,
      slug,
      published: false,
    },
  });
}