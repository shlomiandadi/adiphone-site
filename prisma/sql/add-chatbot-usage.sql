-- Additive chatbot quota table. Safe to run more than once.
-- The chatbot route also runs this CREATE TABLE IF NOT EXISTS on first use
-- through the Neon HTTP driver. It does not alter any existing table.
CREATE TABLE IF NOT EXISTS "chatbot_usage" (
  "bucket_key" TEXT PRIMARY KEY,
  "count" INTEGER NOT NULL DEFAULT 0,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
