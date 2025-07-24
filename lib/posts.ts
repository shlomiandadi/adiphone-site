import { PrismaClient, Category, Post } from '@prisma/client';

const prisma = new PrismaClient();

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

export async function getPostsByCategory(category: Category): Promise<Post[]> {
  return prisma.post.findMany({
    where: { 
      category,
      published: true 
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getRelatedPosts(currentPostId: string, category: Category): Promise<Post[]> {
  return prisma.post.findMany({
    where: {
      category,
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
  category: Category;
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

  return prisma.post.create({
    data: {
      ...data,
      slug,
      published: false,
    },
  });
}