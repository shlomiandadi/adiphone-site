import { PrismaClient } from '@prisma/client';

/**
 * One-time (or repeatable) fix: upgrade stored http:// canonicals to https://
 * Usage: DATABASE_URL=... node scripts/fix-http-canonicals.js
 * After prisma generate, prefer: npx ts-node / dotenv + tsx if available.
 */
async function main() {
  const prisma = new PrismaClient();
  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { canonicalUrl: { startsWith: 'http://' } },
          { canonicalUrl: null },
        ],
      },
      select: { id: true, slug: true, canonicalUrl: true },
    });

    let fixed = 0;
    for (const post of posts) {
      const httpsCanonical = `https://adi-phone.co.il/blog/${post.slug}`;
      if (post.canonicalUrl === httpsCanonical) continue;
      await prisma.post.update({
        where: { id: post.id },
        data: { canonicalUrl: httpsCanonical },
      });
      fixed += 1;
      console.log(`Fixed ${post.slug}: ${post.canonicalUrl} -> ${httpsCanonical}`);
    }
    console.log(`Done. Updated ${fixed} posts.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
