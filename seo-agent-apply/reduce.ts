import { hasPageOverride } from './override.ts';
import { normalizeSeoAgentPath } from './paths.ts';
import type {
  SeoAgentApplyPayload,
  SeoAgentFaqItem,
  SeoAgentPageOverride,
  SeoAgentRedirect,
  SeoAgentStoreState,
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

export type SeoAgentRevalidateCall = {
  path: string;
  type?: 'page' | 'layout';
};

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

function compactOverride(override: SeoAgentPageOverride): SeoAgentPageOverride {
  const next: SeoAgentPageOverride = {};
  const title = override.title?.trim();
  const description = override.description?.trim();
  const canonical = override.canonical?.trim();
  const keywords = override.keywords?.trim();
  const ogTitle = override.ogTitle?.trim();
  const ogDescription = override.ogDescription?.trim();
  const ogImage = override.ogImage?.trim();
  const schemaMarkup = override.schemaMarkup?.trim();
  if (title) next.title = title;
  if (description) next.description = description;
  if (canonical) next.canonical = canonical;
  if (keywords) next.keywords = keywords;
  if (ogTitle) next.ogTitle = ogTitle;
  if (ogDescription) next.ogDescription = ogDescription;
  if (ogImage) next.ogImage = ogImage;
  if (schemaMarkup) next.schemaMarkup = schemaMarkup;
  if (override.faq && override.faq.length > 0) next.faq = override.faq;
  return next;
}

export function pageFromPayload(payload: Partial<SeoAgentApplyPayload>): SeoAgentPageOverride {
  const fromFaq = asFaqItems(payload.faq);
  const faq = fromFaq.length ? fromFaq : asFaqItems(payload.faqs);
  const keywords = Array.isArray(payload.keywords)
    ? payload.keywords.map(String).filter(Boolean).join(', ')
    : payload.keywords;

  return compactOverride({
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
  });
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

function upsertPage(
  state: SeoAgentStoreState,
  touched: Set<string>,
  rawPath: string | null | undefined,
  override: SeoAgentPageOverride
) {
  const path = normalizeSeoAgentPath(rawPath);
  if (!hasPageOverride(override)) return;
  state.pages[path] = { ...(state.pages[path] || {}), ...override };
  touched.add(path);
}

export function reduceSeoAgentState(
  current: SeoAgentStoreState,
  payload: SeoAgentApplyPayload
): { state: SeoAgentStoreState; touched: string[]; redirectsUpdated: boolean; llmsUpdated: boolean } {
  const action = String(payload.action || payload.type || 'apply').toLowerCase();
  const state: SeoAgentStoreState = {
    pages: { ...(current.pages || {}) },
    redirects: Array.isArray(current.redirects) ? [...current.redirects] : [],
    llms: current.llms || '',
  };
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
    upsertPage(state, touched, singlePath, pageFromPayload({ ...payload, ...(payload.override || {}) }));
  }

  if (payload.overrides) {
    for (const [rawPath, value] of Object.entries(payload.overrides)) {
      const path = normalizeSeoAgentPath(rawPath);
      if (!value) {
        delete state.pages[path];
        touched.add(path);
        continue;
      }
      upsertPage(state, touched, path, pageFromPayload(value));
    }
  }

  if (Array.isArray(payload.pages)) {
    for (const page of payload.pages) {
      upsertPage(state, touched, page.path || page.url, pageFromPayload(page));
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

  const extra = [...(payload.revalidate || []), ...(payload.paths || [])].map((path) =>
    normalizeSeoAgentPath(path)
  );
  for (const path of extra) touched.add(path);

  return {
    state,
    touched: Array.from(touched),
    redirectsUpdated,
    llmsUpdated,
  };
}

/**
 * generateMetadata for these service routes lives on the nested layout.
 * `revalidatePath(path)` only tags the page segment, so the cached layout
 * title survives. Tag the page, that layout, and the parent layout.
 */
export function revalidatePlan(paths: string[]): SeoAgentRevalidateCall[] {
  const calls: SeoAgentRevalidateCall[] = [];
  const seen = new Set<string>();
  const add = (path: string, type?: 'page' | 'layout') => {
    const key = `${type || 'default'}:${path}`;
    if (seen.has(key)) return;
    seen.add(key);
    calls.push(type ? { path, type } : { path });
  };

  for (const raw of paths) {
    const path = raw === '/llms.txt' ? '/llms.txt' : normalizeSeoAgentPath(raw);
    add(path);
    add(path, 'page');
    add(path, 'layout');
    const slash = path.lastIndexOf('/');
    const parent = slash > 0 ? path.slice(0, slash) : '';
    if (parent && parent !== path) add(parent, 'layout');
  }

  return calls;
}
