-- Additive. Run manually. Do not prisma migrate / db push.
-- Empty/null robots means "do not emit a robots tag" (keep the page default).
ALTER TABLE "seo" ALTER COLUMN "robots" DROP NOT NULL;
