import type { Metadata } from 'next';

const TITLE_PHONE_SUFFIX = /\s*[–\-]\s*0?50[-.]?9159951\b/gi;
const TITLE_PHONE_ANY = /\b0?50[-.]?9159951\b/gi;

/** Remove the business phone from a document title; leave descriptions alone. */
export function stripPhoneFromTitle(title: string): string {
  let next = title.replace(TITLE_PHONE_SUFFIX, '').replace(TITLE_PHONE_ANY, '');
  next = next.replace(/\s{2,}/g, ' ').trim();
  next = next.replace(/[–\-]+\s*$/g, '').trim();
  next = next.replace(/\s+\|\s*$/g, '').trim();
  return next;
}

function titleText(value: Metadata['title']): string | null {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') {
    if ('absolute' in value && value.absolute) return String(value.absolute);
    if ('default' in value && value.default) return String(value.default);
  }
  return null;
}

/** CMS/agent rows may still store the old phone suffix; titles must stay keyword + brand. */
export function withoutPhoneInLocalTitles(meta: Metadata): Metadata {
  const next: Metadata = { ...meta };
  const current = titleText(meta.title);
  if (current) {
    const cleaned = stripPhoneFromTitle(current);
    if (cleaned !== current) {
      next.title = { absolute: cleaned };
    }
  }

  const og = meta.openGraph && typeof meta.openGraph === 'object' ? { ...meta.openGraph } : null;
  if (og && typeof og.title === 'string') {
    const cleaned = stripPhoneFromTitle(og.title);
    if (cleaned !== og.title) {
      og.title = cleaned;
      next.openGraph = og;
    }
  }

  const twitter = meta.twitter && typeof meta.twitter === 'object' ? { ...meta.twitter } : null;
  if (twitter && typeof twitter.title === 'string') {
    const cleaned = stripPhoneFromTitle(twitter.title);
    if (cleaned !== twitter.title) {
      twitter.title = cleaned;
      next.twitter = twitter;
    }
  }

  return next;
}
