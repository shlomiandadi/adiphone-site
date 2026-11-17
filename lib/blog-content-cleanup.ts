const GENERIC_AI_INTRO =
  /<p>\s*בינה מלאכותית \(AI\) היא ענף במדעי המחשב[\s\S]*?<\/p>/i;

const PRACTICAL_AI_INTRO = `<p>ב-Top Webstak אנחנו מיישמים בינה מלאכותית בעסק ככלים שעובדים באתר ובשיווק: צ׳אטבוט שמענה פניות, מערכת לידים, ו<a href="/services/aeo-geo">קידום במנועי AI</a> כדי שהעסק יופיע בתשובות של ChatGPT ו-Gemini. המדריך הזה מתאר איך לבחור ולהטמיע פתרונות כאלה, בלי הסבר אנציקלופדי על מדעי המחשב.</p>`;

const CONTEXTUAL_INTERNAL_LINKS: Record<string, { marker: string; html: string }> = {
  'mh-zh-seo': {
    marker: 'data-contextual-links="mh-zh-seo"',
    html: `<p data-contextual-links="mh-zh-seo">אחרי הבסיס של SEO כדאי גם לבדוק איך העסק מופיע בתשובות של מנועי AI: <a href="/services/aeo-geo">קידום במנועי AI (AEO ו-GEO)</a>.</p>`,
  },
  'ayk-lbchvr-chbrt-kydvm-atrym': {
    marker: 'data-contextual-links="ayk-lbchvr-chbrt-kydvm-atrym"',
    html: `<p data-contextual-links="ayk-lbchvr-chbrt-kydvm-atrym">כשבוחרים חברת קידום, בדקו גם יכולת ב-<a href="/services/aeo-geo">קידום במנועי AI (AEO ו-GEO)</a> ולא רק דירוגים בגוגל.</p>`,
  },
  'ptrvnvt-bann': {
    marker: 'data-contextual-links="ptrvnvt-bann"',
    html: `<p data-contextual-links="ptrvnvt-bann">תשתית הענן היא הבסיס לאתר ולשיווק. לפירוט על האירוח אצלנו ראו <a href="/services/cloud">שירותי ענן</a>, ולנראות במנועי AI ראו <a href="/services/aeo-geo">קידום במנועי AI (AEO ו-GEO)</a>.</p>`,
  },
  'nyhvl-kmpyyn-mmvmn': {
    marker: 'data-contextual-links="nyhvl-kmpyyn-mmvmn"',
    html: `<p data-contextual-links="nyhvl-kmpyyn-mmvmn">ניהול תקציב ממומן משלים קידום אורגני וגם <a href="/services/aeo-geo">קידום במנועי AI (AEO ו-GEO)</a>. לפירוט על השירות ראו <a href="/services/ppc">קמפיינים ממומנים</a>.</p>`,
  },
  'bnyyt-atrym-laskym-ktnym': {
    marker: 'data-contextual-links="bnyyt-atrym-laskym-ktnym"',
    html: `<p data-contextual-links="bnyyt-atrym-laskym-ktnym">לעסק קטן באזור השרון והצפון יש עמוד ייעודי: <a href="/services/bniyat-atarim-pardes-hana">בניית אתרים בפרדס חנה</a>, <a href="/services/bniyat-atarim-haifa">בניית אתרים בחיפה</a>, <a href="/services/bniyat-atarim-hadera">בניית אתרים בחדרה</a>, <a href="/services/bniyat-atarim-netanya">בניית אתרים בנתניה</a>, <a href="/services/bniyat-atarim-caesarea">בניית אתרים בקיסריה</a>, <a href="/services/bniyat-atarim-zichron-yaakov">בניית אתרים בזכרון יעקב</a>, <a href="/services/bniyat-atarim-or-akiva">בניית אתרים באור עקיבא</a>, <a href="/services/bniyat-atarim-binyamina">בניית אתרים בבנימינה</a>, <a href="/services/bniyat-atarim-yokneam">בניית אתרים ביוקנעם</a> ו<a href="/services/bniyat-atarim-afula">בניית אתרים בעפולה</a>. לפירוט על חבילת תדמית ראו <a href="/services/web-development">אתרי תדמית לעסקים</a>.</p>`,
  },
};

function appendContextualLinks(html: string, slug?: string): string {
  if (!slug) return html;
  const block = CONTEXTUAL_INTERNAL_LINKS[slug];
  if (!block || html.includes(block.marker)) return html;
  return `${html}\n${block.html}`;
}

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

function plainText(html: string): string {
  return decodeEntities(stripTags(html));
}

const AIO_SUMMARY_RE = /<div\b[^>]*\bclass=["'][^"']*\baio-summary\b[^"']*["'][^>]*>[\s\S]*?<\/div>/i;
const AIO_LEAD_RE = /<p\b[^>]*\bclass=["'][^"']*\baio-lead\b[^"']*["'][^>]*>([\s\S]*?)<\/p>/i;
const AIO_BULLETS_RE = /<ul\b[^>]*\bclass=["'][^"']*\baio-bullets\b[^"']*["'][^>]*>([\s\S]*?)<\/ul>/i;

function eachMatch(source: string, re: RegExp, visit: (inner: string) => void) {
  const pattern = new RegExp(re.source, re.flags.includes('g') ? re.flags : `${re.flags}g`);
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source))) {
    visit(match[1]);
  }
}

function collectTakeaways(inner: string): string[] {
  const items: string[] = [];
  const seen = new Set<string>();

  const push = (value: string) => {
    const text = plainText(value);
    if (!text || seen.has(text)) return;
    seen.add(text);
    items.push(text);
  };

  const lead = inner.match(AIO_LEAD_RE);
  if (lead) push(lead[1]);

  const bullets = inner.match(AIO_BULLETS_RE);
  if (bullets) {
    eachMatch(bullets[1], /<li\b[^>]*>([\s\S]*?)<\/li>/i, push);
  }

  if (items.length === 0) {
    eachMatch(inner, /<p\b[^>]*>([\s\S]*?)<\/p>/i, push);
    eachMatch(inner, /<li\b[^>]*>([\s\S]*?)<\/li>/i, push);
  }

  return items.slice(0, 4);
}

/**
 * Pull answer sentences from the seo-agent `div.aio-summary` (“בקיצור”)
 * and strip that block from the article body so it is not shown twice.
 */
export function extractAndStripAioSummary(html: string): { html: string; takeaways: string[] } {
  if (!html) return { html: html || '', takeaways: [] };

  const match = html.match(AIO_SUMMARY_RE);
  if (!match) return { html, takeaways: [] };

  const inner = match[0].replace(/^<div\b[^>]*>/i, '').replace(/<\/div>\s*$/i, '');
  const takeaways = collectTakeaways(inner);
  const stripped = html.replace(AIO_SUMMARY_RE, '');
  return { html: stripped, takeaways };
}

/** Strip machine boilerplate that the SEO-agent template injects into post HTML. */
export function cleanupBlogHtml(html: string, slug?: string): string {
  if (!html) return html;

  let out = extractAndStripAioSummary(html).html
    .replace(/<p>(?:(?!<\/p>)[\s\S])*עיינו גם ב[\s\S]*?<\/p>/gi, '')
    .replace(/<h2[^>]*>מושגים מרכזיים<\/h2>\s*<dl[\s\S]*?<\/dl>/gi, '')
    .replace(/<h2[^>]*>מאמרים קשורים באתר<\/h2>\s*<ul class="internal-links">[\s\S]*?<\/ul>/gi, '');

  if (slug === 'ptrvnvt-bynh-mlakvtyt') {
    out = out.replace(GENERIC_AI_INTRO, PRACTICAL_AI_INTRO);
  }

  return appendContextualLinks(out, slug);
}
