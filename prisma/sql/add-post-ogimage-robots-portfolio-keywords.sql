-- Additive, nullable/defaulted columns. Run manually. Do not prisma migrate / db push.
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "ogImage" TEXT;
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "robots" TEXT;
ALTER TABLE "PortfolioProject2" ADD COLUMN IF NOT EXISTS "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[];
