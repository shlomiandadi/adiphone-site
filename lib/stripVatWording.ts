/** Remove VAT / מע״מ wording from copy that may arrive from CMS or SEO-agent overlays. */

const VAT_GERESH = '[\\"״″‟\'׳]';

const PLUS_VAT = new RegExp(String.raw`\s*\+\s*מע${VAT_GERESH}מ`, 'g');
const NOT_INCLUDING_VAT = new RegExp(
  String.raw`,?\s*לא כוללים מע${VAT_GERESH}מ|,?\s*לא כולל מע${VAT_GERESH}מ`,
  'g'
);
const VAT_FAQ_Q = new RegExp(String.raw`האם המחירים כוללים מע${VAT_GERESH}מ\??`, 'g');
const VAT_WORD = new RegExp(String.raw`מע${VAT_GERESH}מ`, 'g');

export function stripVatWording(text: string): string {
  let next = text
    .replace(PLUS_VAT, '')
    .replace(NOT_INCLUDING_VAT, '')
    .replace(VAT_FAQ_Q, '')
    .replace(VAT_WORD, '');
  next = next.replace(/\s{2,}/g, ' ').replace(/\s+([.,;:])/g, '$1').trim();
  return next;
}

export function stripVatFromUnknown(value: unknown): unknown {
  if (typeof value === 'string') return stripVatWording(value);
  if (Array.isArray(value)) return value.map(stripVatFromUnknown);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (key === 'valueAddedTaxIncluded') continue;
      out[key] = stripVatFromUnknown(nested);
    }
    return out;
  }
  return value;
}
