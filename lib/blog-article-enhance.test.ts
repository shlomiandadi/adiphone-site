import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { enhanceBlogHtml } from './blog-article-enhance.ts';

const CTA = `<a href="https://adi-phone.co.il/contact" class="article-cta">
<h3>רוצים לדעת עוד?</h3>
<p>צרו קשר עם Top Webstak לייעוץ מקצועי.</p>
</a>`;

const SAMPLE = `<div class="seo-agent-article" dir="rtl">
<h2>הבסיס של SEO: איך מנועי חיפוש עובדים?</h2>
<p>פסקה אחת</p>
<h2>מרכיבי מפתח</h2>
<p>פסקה שתיים</p>
<h2>סיכום</h2>
<p>סיום</p>
<h2>שאלות נפוצות</h2>
<div class="faq-section" itemscope itemtype="https://schema.org/FAQPage">
<details class="faq-item"><summary>שאלה</summary><div class="faq-answer"><p>תשובה</p></div></details>
</div>
${CTA}
</div>`;

describe('enhanceBlogHtml', () => {
  test('keeps the article CTA sentence and does not wrap existing FAQ details', () => {
    const result = enhanceBlogHtml(SAMPLE);
    assert.match(result.html, /צרו קשר עם Top Webstak לייעוץ מקצועי/);
    assert.match(result.html, /class="article-cta"/);
    assert.equal(result.html.includes('blog-faq-item'), false);
    assert.equal(result.html.includes('<details class="blog-faq-item">'), false);
    assert.ok(result.html.includes('class="faq-section"'));
    assert.equal(result.takeawayHeadings.length, 3);
  });
});
