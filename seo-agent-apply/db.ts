import { neon } from '@neondatabase/serverless';
import type { SeoAgentStoreState } from './types';

const ROW_ID = 'state';

type Sql = ReturnType<typeof neon>;

let sqlSingleton: Sql | null = null;
let schemaReady: Promise<void> | null = null;

function databaseUrl(): string | null {
  const url = process.env.DATABASE_URL?.trim();
  return url || null;
}

function requireSql(): Sql {
  const url = databaseUrl();
  if (!url) {
    throw new Error('DATABASE_URL is not set; SEO agent overrides cannot be stored');
  }
  if (!sqlSingleton) sqlSingleton = neon(url);
  return sqlSingleton;
}

async function ensureSchema(sql: Sql): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS "seo_agent_state" (
      "id" TEXT PRIMARY KEY,
      "payload" TEXT NOT NULL,
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
}

function asRows(result: unknown): Array<{ payload?: unknown }> {
  if (Array.isArray(result)) return result as Array<{ payload?: unknown }>;
  if (result && typeof result === 'object' && Array.isArray((result as { rows?: unknown }).rows)) {
    return (result as { rows: Array<{ payload?: unknown }> }).rows;
  }
  return [];
}

export function parseSeoAgentPayload(payload: unknown): SeoAgentStoreState | null {
  if (!payload) return null;
  let value: unknown = payload;
  if (typeof payload === 'string') {
    try {
      value = JSON.parse(payload);
    } catch {
      return null;
    }
  }
  if (!value || typeof value !== 'object') return null;
  const row = value as Partial<SeoAgentStoreState>;
  return {
    pages: row.pages && typeof row.pages === 'object' ? { ...row.pages } : {},
    redirects: Array.isArray(row.redirects) ? [...row.redirects] : [],
    llms: typeof row.llms === 'string' ? row.llms : '',
  };
}

/** null when Neon is unreachable or DATABASE_URL is missing. Empty state when no row exists. */
export async function readDbState(): Promise<SeoAgentStoreState | null> {
  if (!databaseUrl()) return null;
  try {
    const sql = requireSql();
    await ready(sql);
    const rows = asRows(await sql`
      SELECT "payload" FROM "seo_agent_state" WHERE "id" = ${ROW_ID} LIMIT 1
    `);
    if (!rows.length) {
      return { pages: {}, redirects: [], llms: '' };
    }
    return parseSeoAgentPayload(rows[0]?.payload) || { pages: {}, redirects: [], llms: '' };
  } catch (error) {
    console.warn('seo-agent: Neon read failed', error);
    return null;
  }
}

export async function writeDbState(state: SeoAgentStoreState): Promise<void> {
  const sql = requireSql();
  await ready(sql);
  const payload = JSON.stringify({
    pages: state.pages || {},
    redirects: state.redirects || [],
    llms: state.llms || '',
  });
  await sql`
    INSERT INTO "seo_agent_state" ("id", "payload", "updated_at")
    VALUES (${ROW_ID}, ${payload}, NOW())
    ON CONFLICT ("id")
    DO UPDATE SET "payload" = EXCLUDED."payload", "updated_at" = NOW()
  `;
}
