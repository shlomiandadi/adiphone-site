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
    html: `<p data-contextual-links="bnyyt-atrym-laskym-ktnym">לעסק קטן באזור השרון והצפון יש עמוד ייעודי: <a href="/services/bniyat-atarim-pardes-hana">בניית אתרים בפרדס חנה</a>, <a href="/services/bniyat-atarim-haifa">בניית אתרים בחיפה</a>, <a href="/services/bniyat-atarim-hadera">בניית אתרים בחדרה</a>, <a href="/services/bniyat-atarim-netanya">בניית אתרים בנתניה</a>, <a href="/services/bniyat-atarim-caesarea">בניית אתרים בקיסריה</a>, <a href="/services/bniyat-atarim-zichron-yaakov">בניית אתרים בזכרון יעקב</a>, <a href="/services/bniyat-atarim-or-akiva">בניית אתרים באור עקיבא</a>, <a href="/services/bniyat-atarim-binyamina">בניית אתרים בבנימינה</a>, <a href="/services/bniyat-atarim-yokneam">בניית אתרים ביוקנעם</a> ו<a href="/services/bniyat-atarim-afula">בניית אתרים בעפולה</a>. לפירוט על חבילת תדמית ראו <a href="/services/website-tadmit">אתרי תדמית לעסקים</a>.</p>`,
  },
};

function appendContextualLinks(html: string, slug?: string): string {
  if (!slug) return html;
  const block = CONTEXTUAL_INTERNAL_LINKS[slug];
  if (!block || html.includes(block.marker)) return html;
  return `${html}\n${block.html}`;
}

/** Strip machine boilerplate that the SEO-agent template injects into post HTML. */
export function cleanupBlogHtml(html: string, slug?: string): string {
  if (!html) return html;

  let out = html
    .replace(/<div class="aio-summary">[\s\S]*?<\/div>/gi, '')
    .replace(/<p>(?:(?!<\/p>)[\s\S])*עיינו גם ב[\s\S]*?<\/p>/gi, '')
    .replace(/<h2[^>]*>מושגים מרכזיים<\/h2>\s*<dl[\s\S]*?<\/dl>/gi, '')
    .replace(/<h2[^>]*>מאמרים קשורים באתר<\/h2>\s*<ul class="internal-links">[\s\S]*?<\/ul>/gi, '');

  if (slug === 'ptrvnvt-bynh-mlakvtyt') {
    out = out.replace(GENERIC_AI_INTRO, PRACTICAL_AI_INTRO);
  }

  return appendContextualLinks(out, slug);
}
