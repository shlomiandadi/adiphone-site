-- Additive nullable column. Run manually. Do not prisma migrate / db push.
-- Lets CMS header items store the same submenu descriptions as navigation-data.ts.
ALTER TABLE "menu_items" ADD COLUMN IF NOT EXISTS "description" TEXT;
