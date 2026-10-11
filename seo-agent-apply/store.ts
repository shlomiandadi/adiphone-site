import type { Store } from '@netlify/blobs';
import type { SeoAgentPageOverride, SeoAgentRedirect, SeoAgentStoreState } from './types';

const STORE_NAME = 'seo-agent-apply';
const STATE_KEY = 'state';

export type SeoAgentBlobsMode = 'auto' | 'env' | 'unavailable';

const EMPTY_STATE: SeoAgentStoreState = {
  pages: {},
  redirects: [],
  llms: '',
};

function cloneState(state: SeoAgentStoreState | null | undefined): SeoAgentStoreState {
  if (!state) return { pages: {}, redirects: [], llms: '' };
  return {
    pages: { ...(state.pages || {}) },
    redirects: Array.isArray(state.redirects) ? [...state.redirects] : [],
    llms: typeof state.llms === 'string' ? state.llms : '',
  };
}

/** Dynamic lookup so Next.js Edge/webpack do not inline empty values at build time. */
function readEnv(name: string): string | undefined {
  try {
    const value = typeof process !== 'undefined' ? process.env?.[name] : undefined;
    return typeof value === 'string' && value.trim() ? value.trim() : undefined;
  } catch {
    return undefined;
  }
}

function fallbackCredentials(): { siteID: string; token: string } | null {
  const siteID = readEnv('SEO_AGENT_BLOBS_SITE_ID');
  const token = readEnv('SEO_AGENT_BLOBS_TOKEN');
  if (!siteID || !token) return null;
  return { siteID, token };
}

async function openStore(): Promise<{ store: Store; mode: Exclude<SeoAgentBlobsMode, 'unavailable'> }> {
  const { getStore } = await import('@netlify/blobs');

  try {
    return {
      store: getStore({ name: STORE_NAME, consistency: 'strong' }),
      mode: 'auto',
    };
  } catch (autoError) {
    const fallback = fallbackCredentials();
    if (fallback) {
      return {
        store: getStore({
          name: STORE_NAME,
          siteID: fallback.siteID,
          token: fallback.token,
          consistency: 'strong',
        }),
        mode: 'env',
      };
    }
    throw autoError;
  }
}

/**
 * Netlify Blobs store.
 * 1. Automatic context from @netlify/plugin-nextjs v5 (Node route handlers + Edge middleware)
 * 2. Fallback: SEO_AGENT_BLOBS_SITE_ID + SEO_AGENT_BLOBS_TOKEN
 * Reads return empty state when Blobs are unavailable so pages stay unchanged.
 */
export async function readSeoAgentState(): Promise<SeoAgentStoreState> {
  try {
    const { store } = await openStore();
    const state = (await store.get(STATE_KEY, { type: 'json' })) as SeoAgentStoreState | null;
    return cloneState(state);
  } catch {
    return cloneState(EMPTY_STATE);
  }
}

export async function writeSeoAgentState(state: SeoAgentStoreState): Promise<void> {
  const { store } = await openStore();
  await store.setJSON(STATE_KEY, {
    pages: state.pages || {},
    redirects: state.redirects || [],
    llms: state.llms || '',
  });
}

export async function probeSeoAgentBlobs(): Promise<{ ok: boolean; mode: SeoAgentBlobsMode }> {
  try {
    const { mode } = await openStore();
    return { ok: true, mode };
  } catch {
    return { ok: false, mode: 'unavailable' };
  }
}

export async function getSeoAgentPageOverride(
  path: string
): Promise<SeoAgentPageOverride | null> {
  const state = await readSeoAgentState();
  const override = state.pages[path];
  if (!override || !hasPageOverride(override)) return null;
  return override;
}

export function hasPageOverride(override: SeoAgentPageOverride | null | undefined): boolean {
  if (!override) return false;
  return Boolean(
    override.title ||
      override.description ||
      override.canonical ||
      override.keywords ||
      override.ogTitle ||
      override.ogDescription ||
      override.ogImage ||
      override.schemaMarkup ||
      (override.faq && override.faq.length > 0)
  );
}

export async function getSeoAgentRedirects(): Promise<SeoAgentRedirect[]> {
  const state = await readSeoAgentState();
  return state.redirects.filter((item) => item?.from && item?.to);
}

export async function getSeoAgentLlmsAddition(): Promise<string> {
  const state = await readSeoAgentState();
  return state.llms.trim();
}
