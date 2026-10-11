import type { SeoAgentPageOverride, SeoAgentRedirect, SeoAgentStoreState } from './types';

const STORE_NAME = 'seo-agent-apply';
const STATE_KEY = 'state';

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

async function getBlobStore() {
  const { getStore } = await import('@netlify/blobs');
  return getStore({ name: STORE_NAME, consistency: 'strong' });
}

/**
 * Netlify Blobs store. Returns empty state when Blobs are unavailable
 * (local `next build` / `next dev` without Netlify context) so rendering
 * stays identical to the current site until an override is applied.
 */
export async function readSeoAgentState(): Promise<SeoAgentStoreState> {
  try {
    const store = await getBlobStore();
    const state = (await store.get(STATE_KEY, { type: 'json' })) as SeoAgentStoreState | null;
    return cloneState(state);
  } catch {
    return cloneState(EMPTY_STATE);
  }
}

export async function writeSeoAgentState(state: SeoAgentStoreState): Promise<void> {
  const store = await getBlobStore();
  await store.setJSON(STATE_KEY, {
    pages: state.pages || {},
    redirects: state.redirects || [],
    llms: state.llms || '',
  });
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
