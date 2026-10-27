import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { cleanupBlogHtml } from './blog-content-cleanup.ts';

describe('cleanupBlogHtml', () => {
  test('removes the generic summary box and broken related list', () => {
    const html = `
<div class="aio-summary"> <strong>בקיצרה:</strong> <p>מידע מקצועי</p></div>
<p>למידע נוסף על<strong>לפתרונות בינה מלאכותית</strong>, עיינו גם ב<a href="/privacy-policy">מדיניות פרטיות</a>.</p>
<p>תוכן אמיתי נשאר.</p>
<h2>מושגים מרכזיים</h2> <dl class="entity-definitions"><dt>x</dt><dd>y</dd></dl>
<h2>מאמרים קשורים באתר</h2> <ul class="internal-links"><li><a href="/privacy-policy">מדיניות פרטיות</a></li></ul>
<p>עוד תוכן.</p>`;
    const cleaned = cleanupBlogHtml(html, 'ptrvnvt-bynh-mlakvtyt');
    assert.equal(cleaned.includes('בקיצרה'), false);
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
});
