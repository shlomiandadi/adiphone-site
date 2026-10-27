const GENERIC_AI_INTRO =
  /<p>\s*בינה מלאכותית \(AI\) היא ענף במדעי המחשב[\s\S]*?<\/p>/i;

const PRACTICAL_AI_INTRO = `<p>ב-Top Webstak אנחנו מיישמים בינה מלאכותית בעסק ככלים שעובדים באתר ובשיווק: צ׳אטבוט שמענה פניות, מערכת לידים, ו<a href="/services/aeo-geo">קידום במנועי AI</a> כדי שהעסק יופיע בתשובות של ChatGPT ו-Gemini. המדריך הזה מתאר איך לבחור ולהטמיע פתרונות כאלה, בלי הסבר אנציקלופדי על מדעי המחשב.</p>`;

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

  return out;
}
