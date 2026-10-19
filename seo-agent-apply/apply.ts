import { revalidatePath, revalidateTag } from 'next/cache';
import {
  isSeoAgentApplyPayload,
  isSeoAgentArticlePayload,
  reduceSeoAgentState,
  revalidatePlan,
} from './reduce';
import { readSeoAgentState, writeSeoAgentState } from './state';
import type { SeoAgentApplyPayload } from './types';

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
}

export async function applySeoAgentPayload(payload: SeoAgentApplyPayload) {
  const action = String(payload.action || payload.type || 'apply').toLowerCase();
  const current = await readSeoAgentState();
  const reduced = reduceSeoAgentState(current, payload);

  if (action !== 'revalidate') {
    await writeSeoAgentState(reduced.state);
  }

  revalidateSeoAgentPaths(reduced.touched);

  return {
    success: true as const,
    applied: {
      pages: reduced.touched.filter((path) => path !== '/llms.txt'),
      redirects: reduced.redirectsUpdated ? reduced.state.redirects.length : 0,
      llms: reduced.llmsUpdated,
    },
    revalidated: reduced.touched,
    storage: 'neon' as const,
  };
}
