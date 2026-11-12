import { revalidatePath, revalidateTag } from 'next/cache';
import { LLMS_CACHE_TAG, revalidateContentTags } from '../lib/contentCache';
import {
  isSeoAgentApplyPayload,
  isSeoAgentArticlePayload,
  reduceSeoAgentState,
  revalidatePlan,
} from './reduce';
import { readSeoAgentState, writeSeoAgentState } from './state';
import type { SeoAgentApplyPayload } from './types';

export const SEO_AGENT_PROTECTED_SKIP = 'skipped: protected path';

export { isSeoAgentApplyPayload, isSeoAgentArticlePayload };

export function revalidateSeoAgentPaths(paths: string[]) {
  for (const call of revalidatePlan(paths)) {
    try {
      if (call.type) revalidatePath(call.path, call.type);
      else revalidatePath(call.path);
    } catch (error) {
      console.warn('seo-agent: revalidatePath failed', call.path, call.type || '', error);
    }
  }
  try {
    revalidateTag('seo-agent-apply');
  } catch (error) {
    console.warn('seo-agent: revalidateTag failed', error);
  }
  if (paths.includes('/llms.txt')) {
    revalidateContentTags([LLMS_CACHE_TAG]);
  }
}

export async function applySeoAgentPayload(payload: SeoAgentApplyPayload) {
  const action = String(payload.action || payload.type || 'apply').toLowerCase();
  const current = await readSeoAgentState();
  const reduced = reduceSeoAgentState(current, payload);
  const pageWrites = reduced.touched.filter((path) => path !== '/llms.txt');
  const wrotePagesOrStore =
    pageWrites.length > 0 || reduced.redirectsUpdated || reduced.llmsUpdated;

  if (action !== 'revalidate' && wrotePagesOrStore) {
    await writeSeoAgentState(reduced.state);
  }

  if (action !== 'revalidate' && !wrotePagesOrStore && reduced.skippedProtected.length > 0) {
    return {
      success: false as const,
      skipped: SEO_AGENT_PROTECTED_SKIP,
      paths: reduced.skippedProtected,
      storage: 'neon' as const,
    };
  }

  if (reduced.touched.length > 0) {
    revalidateSeoAgentPaths(reduced.touched);
  }

  return {
    success: true as const,
    applied: {
      pages: pageWrites,
      redirects: reduced.redirectsUpdated ? reduced.state.redirects.length : 0,
      llms: reduced.llmsUpdated,
    },
    skipped: reduced.skippedProtected.length ? SEO_AGENT_PROTECTED_SKIP : undefined,
    skippedPaths: reduced.skippedProtected,
    revalidated: reduced.touched,
    storage: 'neon' as const,
  };
}
