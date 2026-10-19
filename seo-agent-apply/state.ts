import { readDbState, writeDbState } from './db';
import { readSeoAgentBlobState as readBlobState, writeSeoAgentBlobState as writeBlobState } from './store';
import type { SeoAgentPageOverride, SeoAgentStoreState } from './types';
import { hasPageOverride } from './override';

const EMPTY: SeoAgentStoreState = { pages: {}, redirects: [], llms: '' };

export function hasStoredContent(state: SeoAgentStoreState | null | undefined): boolean {
  if (!state) return false;
  if (state.llms.trim()) return true;
  if (state.redirects.some((item) => item?.from && item?.to)) return true;
  return Object.values(state.pages).some((page) => hasPageOverride(page));
}

function cloneState(state: SeoAgentStoreState): SeoAgentStoreState {
  return {
    pages: { ...(state.pages || {}) },
    redirects: Array.isArray(state.redirects) ? [...state.redirects] : [],
    llms: state.llms || '',
  };
}

/**
 * Neon is the source of truth (same DATABASE_URL the rest of the site uses).
 * Netlify Blobs are a mirror for Edge redirects and a one-time import of
 * overrides written before this store existed. Page rendering must not depend
 * on Blobs: static generation and ISR on Netlify often have no Blobs context,
 * and a failed read used to fall back to the hardcoded title.
 */
export async function readSeoAgentState(): Promise<SeoAgentStoreState> {
  const db = await readDbState();
  if (db && hasStoredContent(db)) return cloneState(db);

  let blobs: SeoAgentStoreState = EMPTY;
  try {
    blobs = await readBlobState();
  } catch {
    blobs = EMPTY;
  }

  if (hasStoredContent(blobs)) {
    try {
      await writeDbState(blobs);
    } catch (error) {
      console.warn('seo-agent: could not import Blobs into Neon', error);
    }
    return cloneState(blobs);
  }

  return cloneState(db || EMPTY);
}

export async function writeSeoAgentState(state: SeoAgentStoreState): Promise<void> {
  await writeDbState(state);
  try {
    await writeBlobState(state);
  } catch (error) {
    console.warn('seo-agent: Blobs mirror failed; Neon copy was saved', error);
  }
}

export async function getSeoAgentPageOverride(path: string): Promise<SeoAgentPageOverride | null> {
  const state = await readSeoAgentState();
  const override = state.pages[path];
  if (!override || !hasPageOverride(override)) return null;
  return override;
}

export async function getSeoAgentLlmsAddition(): Promise<string> {
  const state = await readSeoAgentState();
  return state.llms.trim();
}

export async function syncSeoAgentStore(): Promise<{ imported: boolean; paths: string[] }> {
  const db = await readDbState();
  if (db && hasStoredContent(db)) {
    return { imported: false, paths: Object.keys(db.pages) };
  }

  let blobs: SeoAgentStoreState = EMPTY;
  try {
    blobs = await readBlobState();
  } catch {
    blobs = EMPTY;
  }
  if (!hasStoredContent(blobs)) return { imported: false, paths: [] };

  await writeDbState(blobs);
  const paths = Object.keys(blobs.pages);
  if (blobs.llms.trim()) paths.push('/llms.txt');
  for (const redirect of blobs.redirects) {
    if (redirect?.from) paths.push(redirect.from);
  }
  return { imported: true, paths };
}
