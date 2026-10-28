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

export function enhanceBlogHtml(html: string): {
  html: string;
  headings: BlogHeading[];
  beforeMid: string;
  afterMid: string;
  takeawayHeadings: BlogHeading[];
} {
  if (!html) {
    return { html: '', headings: [], beforeMid: '', afterMid: '', takeawayHeadings: [] };
  }

  const used = new Set<string>();
  const headings: BlogHeading[] = [];

  let withIds = html.replace(HEADING_RE, (full, tag: string, attrs = '', inner: string) => {
    const text = headingText(inner);
    if (!text) return full;
    const existing = /\sid=["']([^"']+)["']/i.exec(attrs);
    const id = existing ? existing[1] : slugifyHeading(text, used);
    if (existing) used.add(existing[1]);
    headings.push({ id, text, level: Number(tag.charAt(1)) });
    const attrsWithoutId = String(attrs).replace(/\s*id=["'][^"']*["']/i, '');
    return `<${tag} id="${id}"${attrsWithoutId}>${inner}</${tag}>`;
  });

  withIds = wrapFaqSection(withIds);

  const takeawayHeadings = headings.filter(
    (h) => h.level === 2 && !FAQ_HEADING.test(h.text)
  );

  const splitAt = findMidSplit(withIds, headings);
  const beforeMid = splitAt > 0 ? withIds.slice(0, splitAt) : withIds;
  const afterMid = splitAt > 0 ? withIds.slice(splitAt) : '';

  return { html: withIds, headings, beforeMid, afterMid, takeawayHeadings };
}

function wrapFaqSection(html: string): string {
  const h2Re = /<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi;
  const h2s: { start: number; end: number; text: string }[] = [];
  let match: RegExpExecArray | null;
  while ((match = h2Re.exec(html))) {
    h2s.push({
      start: match.index,
      end: match.index + match[0].length,
      text: headingText(match[2]),
    });
  }

  const faq = h2s.find((h) => FAQ_HEADING.test(h.text));
  if (!faq) return html;

  const nextH2 = h2s.find((h) => h.start > faq.start);
  const sectionStart = faq.start;
  const sectionEnd = nextH2 ? nextH2.start : html.length;
  const before = html.slice(0, sectionStart);
  const section = html.slice(sectionStart, sectionEnd);
  const after = html.slice(sectionEnd);

  const headingMatch = section.match(/^<h2\b[^>]*>[\s\S]*?<\/h2>/i);
  if (!headingMatch) return html;
  const headingHtml = headingMatch[0];
  const rest = section.slice(headingHtml.length);
  const wrappedBody = wrapFaqItems(rest);

  return `${before}<div class="blog-faq-section">${headingHtml}${wrappedBody}</div>${after}`;
}

function wrapFaqItems(sectionBody: string): string {
  const h3Re = /<h3\b[^>]*>[\s\S]*?<\/h3>/gi;
  const items: { start: number; end: number }[] = [];
  let match: RegExpExecArray | null;
  while ((match = h3Re.exec(sectionBody))) {
    items.push({ start: match.index, end: match.index + match[0].length });
  }
  if (items.length === 0) return sectionBody;

  let out = sectionBody.slice(0, items[0].start);
  for (let i = 0; i < items.length; i++) {
    const start = items[i].start;
    const headingEnd = items[i].end;
    const nextStart = i + 1 < items.length ? items[i + 1].start : sectionBody.length;
    const heading = sectionBody.slice(start, headingEnd);
    const body = sectionBody.slice(headingEnd, nextStart);
    out += `<details class="blog-faq-item"><summary class="blog-faq-summary">${heading}</summary><div class="blog-faq-answer">${body}</div></details>`;
  }
  return out;
}

function findMidSplit(html: string, headings: BlogHeading[]): number {
  if (html.length < 800 || headings.length < 2) return -1;

  const target = Math.floor(html.length * 0.45);
  let best = -1;
  let bestDist = Infinity;

  for (const heading of headings) {
    if (heading.level !== 2) continue;
    if (FAQ_HEADING.test(heading.text)) continue;
    const needle = `id="${heading.id}"`;
    const idx = html.indexOf(needle);
    if (idx < 0) continue;
    const tagStart = html.lastIndexOf('<h2', idx);
    if (tagStart < 120) continue;
    const dist = Math.abs(tagStart - target);
    if (dist < bestDist) {
      bestDist = dist;
      best = tagStart;
    }
  }

  if (best < 0) {
    const pClose = html.lastIndexOf('</p>', target);
    if (pClose > 400) return pClose + 4;
    return -1;
  }

  return best;
}
