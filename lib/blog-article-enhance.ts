export type BlogHeading = {
  id: string;
  text: string;
  level: number;
};

const FAQ_HEADING = /שאלות\s*נפוצות|שאלות\s*ותשובות|\bfaq\b/i;
const HEADING_RE = /<(h[2-4])(\s[^>]*)?>([\s\S]*?)<\/\1>/gi;

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '');
}

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugifyHeading(text: string, used: Set<string>): string {
  const base =
    text
      .toLowerCase()
      .replace(/[^\u0590-\u05FFa-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'section';
  let id = base;
  let n = 2;
  while (used.has(id)) {
    id = `${base}-${n++}`;
  }
  used.add(id);
  return id;
}

function headingText(inner: string): string {
  return decodeEntities(stripTags(inner));
}

/**
 * Add missing heading ids for TOC anchors. Does not wrap, split, or drop copy —
 * seo-agent posts already ship a wrapping .seo-agent-article, FAQ <details>,
 * and an <a class="article-cta"> that must stay one HTML tree.
 */
export function enhanceBlogHtml(html: string): {
  html: string;
  headings: BlogHeading[];
  takeawayHeadings: BlogHeading[];
} {
  if (!html) {
    return { html: '', headings: [], takeawayHeadings: [] };
  }

  const used = new Set<string>();
  const headings: BlogHeading[] = [];

  const withIds = html.replace(HEADING_RE, (full, tag: string, attrs = '', inner: string) => {
    const text = headingText(inner);
    if (!text) return full;
    const existing = /\sid=["']([^"']+)["']/i.exec(attrs);
    const id = existing ? existing[1] : slugifyHeading(text, used);
    if (existing) used.add(existing[1]);
    headings.push({ id, text, level: Number(tag.charAt(1)) });
    if (existing) return full;
    return `<${tag} id="${id}"${attrs}>${inner}</${tag}>`;
  });

  const takeawayHeadings = headings.filter(
    (h) => h.level === 2 && !FAQ_HEADING.test(h.text)
  );

  return { html: withIds, headings, takeawayHeadings };
}
