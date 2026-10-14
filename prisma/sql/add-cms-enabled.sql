-- Additive nullable flag. Run manually. Do not prisma migrate / db push.
-- Rows stay legacy/unused until cmsEnabled is set to true in the admin.
ALTER TABLE "breadcrumbs" ADD COLUMN IF NOT EXISTS "cmsEnabled" BOOLEAN;
ALTER TABLE "page_hierarchy" ADD COLUMN IF NOT EXISTS "cmsEnabled" BOOLEAN;
ALTER TABLE "canonical_tags" ADD COLUMN IF NOT EXISTS "cmsEnabled" BOOLEAN;
ALTER TABLE "seo" ADD COLUMN IF NOT EXISTS "cmsEnabled" BOOLEAN;
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "cmsEnabled" BOOLEAN;
ALTER TABLE "robots_settings" ADD COLUMN IF NOT EXISTS "cmsEnabled" BOOLEAN;
ALTER TABLE "sitemap_settings" ADD COLUMN IF NOT EXISTS "cmsEnabled" BOOLEAN;
ALTER TABLE "header" ADD COLUMN IF NOT EXISTS "cmsEnabled" BOOLEAN;
ALTER TABLE "menus" ADD COLUMN IF NOT EXISTS "cmsEnabled" BOOLEAN;
ALTER TABLE "menu_items" ADD COLUMN IF NOT EXISTS "cmsEnabled" BOOLEAN;
ALTER TABLE "footer" ADD COLUMN IF NOT EXISTS "cmsEnabled" BOOLEAN;
ALTER TABLE "footer_columns" ADD COLUMN IF NOT EXISTS "cmsEnabled" BOOLEAN;
ALTER TABLE "footer_links" ADD COLUMN IF NOT EXISTS "cmsEnabled" BOOLEAN;
ALTER TABLE "top_strip" ADD COLUMN IF NOT EXISTS "cmsEnabled" BOOLEAN;
ALTER TABLE "templates" ADD COLUMN IF NOT EXISTS "cmsEnabled" BOOLEAN;
ALTER TABLE "sections" ADD COLUMN IF NOT EXISTS "cmsEnabled" BOOLEAN;
ALTER TABLE "Page" ADD COLUMN IF NOT EXISTS "cmsEnabled" BOOLEAN;
