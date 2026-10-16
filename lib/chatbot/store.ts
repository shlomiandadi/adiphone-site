import { neon } from '@neondatabase/serverless';
import type { UsageStore } from './policy.ts';

type Sql = ReturnType<typeof neon>;

let sqlSingleton: Sql | null = null;
let schemaReady: Promise<void> | null = null;
let pruned = false;

function requireSql(): Sql {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error('DATABASE_URL is not set');
  }
  if (!sqlSingleton) {
    sqlSingleton = neon(url);
  }
  return sqlSingleton;
}

async function ensureSchema(sql: Sql): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS "chatbot_usage" (
      "bucket_key" TEXT PRIMARY KEY,
      "count" INTEGER NOT NULL DEFAULT 0,
      "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

async function ready(sql: Sql): Promise<void> {
  if (!schemaReady) {
    schemaReady = ensureSchema(sql).catch((error: unknown) => {
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;
  if (pruned) return;
  pruned = true;
  try {
    await sql`
      DELETE FROM "chatbot_usage"
      WHERE "updated_at" < NOW() - INTERVAL '3 days'
    `;
  } catch {
    pruned = false;
  }
}

function asRows(result: unknown): Array<{ bucket_key?: string; count?: unknown }> {
  if (Array.isArray(result)) return result as Array<{ bucket_key?: string; count?: unknown }>;
  if (result && typeof result === 'object' && Array.isArray((result as { rows?: unknown }).rows)) {
    return (result as { rows: Array<{ bucket_key?: string; count?: unknown }> }).rows;
  }
  throw new Error('usage store returned no rows');
}

function countFor(rows: Array<{ bucket_key?: string; count?: unknown }>, key: string): number {
  const row = rows.find((item) => item.bucket_key === key);
  const count = Number(row?.count);
  if (!Number.isFinite(count)) throw new Error('usage store returned a bad count');
  return count;
}

export async function incrementPair(
  hourKey: string,
  dayKey: string,
): Promise<{ hour: number; day: number }> {
  const sql = requireSql();
  await ready(sql);
  const rows = asRows(await sql`
    INSERT INTO "chatbot_usage" ("bucket_key", "count")
    VALUES (${hourKey}, 1), (${dayKey}, 1)
    ON CONFLICT ("bucket_key")
    DO UPDATE SET "count" = "chatbot_usage"."count" + 1, "updated_at" = NOW()
    RETURNING "bucket_key", "count"
  `);
  return {
    hour: countFor(rows, hourKey),
    day: countFor(rows, dayKey),
  };
}

export async function increment(key: string): Promise<number> {
  const sql = requireSql();
  await ready(sql);
  const rows = asRows(await sql`
    INSERT INTO "chatbot_usage" ("bucket_key", "count")
    VALUES (${key}, 1)
    ON CONFLICT ("bucket_key")
    DO UPDATE SET "count" = "chatbot_usage"."count" + 1, "updated_at" = NOW()
    RETURNING "bucket_key", "count"
  `);
  return countFor(rows, key);
}

export const neonUsageStore: UsageStore = {
  incrementPair,
  increment,
};
