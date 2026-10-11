import { revalidatePath, revalidateTag } from 'next/cache';
import { normalizeSeoAgentPath } from './paths';
import { hasPageOverride, readSeoAgentState, writeSeoAgentState } from './store';
import type {
  SeoAgentApplyPayload,
  SeoAgentFaqItem,
  SeoAgentPageOverride,
  SeoAgentRedirect,
} from './types';

const APPLY_ACTIONS = new Set([
  'apply',
  'upsert',
  'update',
  'set',
  'override',
  'delete',
  'remove',
  'redirects',
  'llms',
  'revalidate',
]);

const APPLY_TYPES = new Set([
  'apply',
  'page',
  'override',
  'page_override',
  'redirects',
  'llms',
  'revalidate',
]);

function asFaqItems(value: unknown): SeoAgentFaqItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const row = item as Record<string, unknown>;
      const question = String(row.question || row.q || '').trim();
      const answer = String(row.answer || row.a || '').trim();
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter((item): item is SeoAgentFaqItem => Boolean(item));
}

function stringifySchema(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed || undefined;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return undefined;
  }
}

function pageFromPayload(payload: Partial<SeoAgentApplyPayload>): SeoAgentPageOverride {
  const fromFaq = asFaqItems(payload.faq);
  const faq = fromFaq.length ? fromFaq : asFaqItems(payload.faqs);
  const keywords = Array.isArray(payload.keywords)
    ? payload.keywords.map(String).filter(Boolean).join(', ')
    : payload.keywords;

  return {
    title: payload.title || payload.seoTitle || payload.metaTitle,
    description: payload.description || payload.metaDescription || payload.metaDesc,
    canonical: payload.canonical,
    keywords,
    ogTitle: payload.ogTitle || payload.title || payload.seoTitle,
    ogDescription: payload.ogDescription || payload.description || payload.metaDescription,
    ogImage: payload.ogImage,
    faq: faq.length ? faq : undefined,
    schemaMarkup:
      stringifySchema(payload.schemaMarkup) ||
      stringifySchema(payload.schema) ||
      stringifySchema(payload.jsonLd),
  };
}

function normalizeRedirects(input: SeoAgentApplyPayload['redirects']): SeoAgentRedirect[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input
      .map((item) => {
        const redirect: SeoAgentRedirect = {
          from: normalizeSeoAgentPath(item.from),
          to: item.to?.startsWith('http') ? item.to.trim() : normalizeSeoAgentPath(item.to),
          status: item.status === 302 ? 302 : 301,
        };
        return redirect;
      })
      .filter((item) => item.from && item.to && item.from !== item.to);
  }

  return Object.entries(input)
    .map(([from, to]) => ({
      from: normalizeSeoAgentPath(from),
      to: String(to).startsWith('http') ? String(to).trim() : normalizeSeoAgentPath(to),
      status: 301 as const,
    }))
    .filter((item) => item.from && item.to && item.from !== item.to);
}

export function isSeoAgentApplyPayload(payload: unknown): payload is SeoAgentApplyPayload {
  if (!payload || typeof payload !== 'object') return false;
  const body = payload as SeoAgentApplyPayload;
  if (body.action && APPLY_ACTIONS.has(String(body.action).toLowerCase())) return true;
  if (body.type && APPLY_TYPES.has(String(body.type).toLowerCase())) return true;
  if (body.overrides || body.redirects || body.llmsTxt || body.llms || body.pages) return true;
  if (body.path && !('contentHtml' in body) && !('content' in body) && !('slug' in body)) {
    return true;
  }
  return false;
}

export function isSeoAgentArticlePayload(payload: unknown): boolean {
  if (!payload || typeof payload !== 'object') return false;
  const body = payload as Record<string, unknown>;
  const title = typeof body.title === 'string' && body.title.trim();
  const slug = typeof body.slug === 'string' && body.slug.trim();
  const content =
    (typeof body.contentHtml === 'string' && body.contentHtml.trim()) ||
    (typeof body.content === 'string' && body.content.trim());
  return Boolean(title && slug && content);
}

function collectRevalidatePaths(
  payload: SeoAgentApplyPayload,
  touched: string[]
): string[] {
  const extra = [...(payload.revalidate || []), ...(payload.paths || [])].map(normalizeSeoAgentPath);
  return Array.from(new Set([...touched, ...extra]));
}

export async function applySeoAgentPayload(payload: SeoAgentApplyPayload) {
  const action = String(payload.action || payload.type || 'apply').toLowerCase();
  const state = await readSeoAgentState();
  const touched = new Set<string>();
  let llmsUpdated = false;
  let redirectsUpdated = false;

  if (action === 'delete' || action === 'remove') {
    const path = normalizeSeoAgentPath(payload.path || payload.url);
    delete state.pages[path];
    touched.add(path);
  }

  const singlePath = payload.path || payload.url || payload.override?.path || payload.override?.url;
  if (singlePath && action !== 'redirects' && action !== 'llms' && action !== 'revalidate') {
    const path = normalizeSeoAgentPath(singlePath);
    const next = pageFromPayload({ ...payload, ...(payload.override || {}) });
    if (hasPageOverride(next)) {
      state.pages[path] = { ...(state.pages[path] || {}), ...next };
      touched.add(path);
    }
  }

  if (payload.overrides) {
    for (const [rawPath, value] of Object.entries(payload.overrides)) {
      const path = normalizeSeoAgentPath(rawPath);
      if (!value) {
        delete state.pages[path];
        touched.add(path);
        continue;
      }
      const next = pageFromPayload(value);
      if (hasPageOverride(next)) {
        state.pages[path] = { ...(state.pages[path] || {}), ...next };
        touched.add(path);
      }
    }
  }

  if (Array.isArray(payload.pages)) {
    for (const page of payload.pages) {
      const path = normalizeSeoAgentPath(page.path || page.url);
      const next = pageFromPayload(page);
      if (hasPageOverride(next)) {
        state.pages[path] = { ...(state.pages[path] || {}), ...next };
        touched.add(path);
      }
    }
  }

  if (payload.redirects) {
    state.redirects = normalizeRedirects(payload.redirects);
    redirectsUpdated = true;
    for (const redirect of state.redirects) touched.add(redirect.from);
  }

  if (typeof payload.llmsTxt === 'string' || typeof payload.llms === 'string') {
    state.llms = String(payload.llmsTxt ?? payload.llms ?? '').trim();
    llmsUpdated = true;
    touched.add('/llms.txt');
  }

  if (action !== 'revalidate') {
    await writeSeoAgentState(state);
  }

  const revalidated = collectRevalidatePaths(payload, Array.from(touched));
  for (const path of revalidated) {
    try {
      revalidatePath(path === '/llms.txt' ? '/llms.txt' : path);
    } catch {
      // revalidatePath is a no-op outside a Next.js request in some test contexts
    }
  }
  try {
    revalidateTag('seo-agent-apply');
  } catch {
    // ignore
  }

  return {
    success: true as const,
    applied: {
      pages: Array.from(touched).filter((path) => path !== '/llms.txt'),
      redirects: redirectsUpdated ? state.redirects.length : 0,
      llms: llmsUpdated,
    },
    revalidated,
  };
}
