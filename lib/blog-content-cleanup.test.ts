import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { cleanupBlogHtml, extractAndStripAioSummary } from './blog-content-cleanup.ts';
import { enhanceBlogHtml } from './blog-article-enhance.ts';

describe('cleanupBlogHtml', () => {
  test('removes the generic summary box and broken related list', () => {
    const html = `
<div class="aio-summary"> <strong>בקיצרה:</strong> <p>מידע מקצועי</p></div>
<p>למידע נוסף על<strong>לפתרונות בינה מלאכותית</strong>, עיינו גם ב<a href="/privacy-policy">מדיניות פרטיות</a>.</p>
<p>תוכן אמיתי נשאר.</p>
<h2>מושגים מרכזיים</h2> <dl class="entity-definitions"><dt>x</dt><dd>y</dd></dl>
<h2>מאמרים קשורים באתר</h2> <ul class="internal-links"><li><a href="/privacy-policy">מדיניות פרטיות</a></li></ul>
<p>עוד תוכן.</p>`;
    const extracted = extractAndStripAioSummary(html);
    assert.deepEqual(extracted.takeaways, ['מידע מקצועי']);
    const cleaned = cleanupBlogHtml(html, 'ptrvnvt-bynh-mlakvtyt');
    assert.equal(cleaned.includes('בקיצרה'), false);
    assert.equal(cleaned.includes('aio-summary'), false);
    assert.equal(cleaned.includes('עיינו גם'), false);
    assert.equal(cleaned.includes('מדיניות פרטיות'), false);
    assert.equal(cleaned.includes('תוכן אמיתי נשאר'), true);
    assert.equal(cleaned.includes('עוד תוכן'), true);
  });

  test('replaces the encyclopedic AI intro on the target slug only', () => {
    const html = '<p>בינה מלאכותית (AI) היא ענף במדעי המחשב שמטרתו לפתח מכונות המסוגלות לחשוב, ללמוד, להבין, ולבצע משימות באופן המדמה אינטליגנציה אנושית.</p>';
    const cleaned = cleanupBlogHtml(html, 'ptrvnvt-bynh-mlakvtyt');
    assert.equal(cleaned.includes('ענף במדעי המחשב'), false);
    assert.equal(cleaned.includes('/services/aeo-geo'), true);
    assert.equal(cleanupBlogHtml(html, 'other-post').includes('ענף במדעי המחשב'), true);
  });

  test('adds city and AEO contextual links on target slugs only', () => {
    const local = cleanupBlogHtml('<p>תוכן.</p>', 'bnyyt-atrym-laskym-ktnym');
    assert.equal(local.includes('/services/bniyat-atarim-haifa'), true);
    assert.equal(local.includes('/services/web-development'), true);
    const seo = cleanupBlogHtml('<p>תוכן.</p>', 'mh-zh-seo');
    assert.equal(seo.includes('/services/aeo-geo'), true);
    assert.equal(cleanupBlogHtml('<p>תוכן.</p>', 'other-post').includes('/services/aeo-geo'), false);
  });
});

describe('extractAndStripAioSummary', () => {
  test('returns lead plus up to three bullets and strips the block from the body', () => {
    const html = `
<div class="aio-summary">
<p class="aio-lead">קידום אורגני הוא הופעה בגוגל בלי לשלם על כל קליק.</p>
<ul class="aio-bullets">
<li>הוא נבנה מתוכן, טכניקה וסמכות לאורך זמן.</li>
<li>זה לא פרסום ממומן — התוצאות נשארות גם אחרי שהתקציב נעצר.</li>
<li>לעסקים מקומיים הוא מביא פניות מלקוחות שמחפשים עכשיו.</li>
<li>משפט חמישי לא אמור להיכנס לתיבה.</li>
</ul>
</div>
<h2>מה זה קידום אורגני?</h2>
<p>גוף המאמר.</p>`;
    const { html: body, takeaways } = extractAndStripAioSummary(html);
    assert.deepEqual(takeaways, [
      'קידום אורגני הוא הופעה בגוגל בלי לשלם על כל קליק.',
      'הוא נבנה מתוכן, טכניקה וסמכות לאורך זמן.',
      'זה לא פרסום ממומן — התוצאות נשארות גם אחרי שהתקציב נעצר.',
      'לעסקים מקומיים הוא מביא פניות מלקוחות שמחפשים עכשיו.',
    ]);
    assert.equal(body.includes('aio-summary'), false);
    assert.equal(body.includes('aio-lead'), false);
    assert.equal(body.includes('גוף המאמר'), true);
    assert.equal(cleanupBlogHtml(html).includes('aio-summary'), false);
  });

  test('returns no takeaways when the article has no summary', () => {
    const html = '<h2>מה זה קידום אורגני?</h2><p>גוף.</p>';
    const { html: body, takeaways } = extractAndStripAioSummary(html);
    assert.deepEqual(takeaways, []);
    assert.equal(body, html);
  });
});

describe('blog article takeaways vs TOC', () => {
  test('takeaways are summary sentences while TOC still lists H2s once', () => {
    const html = `
<div class="aio-summary">
<p class="aio-lead">תשובה קצרה על קידום אורגני.</p>
<ul class="aio-bullets">
<li>נקודה שנייה.</li>
<li>נקודה שלישית.</li>
</ul>
</div>
<h2>מה זה קידום אורגני?</h2>
<p>תשובה ארוכה.</p>
<h2>למי זה מתאים?</h2>
<p>לעסקים.</p>
<h2>סיכום</h2>
<p>סיום.</p>
<h2>שאלות נפוצות</h2>
<details><summary>שאלה</summary><p>תשובה</p></details>
<a href="/contact" class="article-cta"><h3>רוצים לדעת עוד?</h3><p>צרו קשר.</p></a>`;
    const { html: withoutSummary, takeaways } = extractAndStripAioSummary(html);
    const prepared = enhanceBlogHtml(cleanupBlogHtml(withoutSummary));
    assert.deepEqual(takeaways, [
      'תשובה קצרה על קידום אורגני.',
      'נקודה שנייה.',
      'נקודה שלישית.',
    ]);
    assert.deepEqual(
      prepared.takeawayHeadings.map((h) => h.text),
      ['מה זה קידום אורגני?', 'למי זה מתאים?', 'סיכום']
    );
    assert.equal(takeaways.some((t) => prepared.takeawayHeadings.some((h) => h.text === t)), false);
    assert.match(prepared.html, /class="article-cta"/);
    assert.equal(prepared.html.includes('aio-summary'), false);
  });
});
