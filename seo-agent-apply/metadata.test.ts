import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import type { Metadata } from 'next';
import { applySeoAgentOverride, resolveSeoAgentPageOverride } from './override.ts';
import { isSeoAgentProtectedPath, normalizeSeoAgentPath } from './paths.ts';
import { reduceSeoAgentState, revalidatePlan } from './reduce.ts';
import type { SeoAgentStoreState } from './types.ts';

const SUFFIX = ' | Top Webstak';
const TEMPLATE = `%s${SUFFIX}`;

const EXPECTED = {
  '/services/ecommerce': 'בניית חנות אינטרנטית לעסקים | Top Webstak',
  '/services/analytics': 'אנליטיקס וניתוח נתונים לעסקים | Top Webstak',
  '/services/software-development': 'פיתוח תוכנה בהתאמה אישית | Top Webstak',
  '/services/ai': 'בינה מלאכותית (AI) לעסקים | Top Webstak',
} as const;

/** Current hardcoded titles. These are what the live pages render when no override applies. */
const HARDCODED: Record<keyof typeof EXPECTED, Metadata> = {
  '/services/ecommerce': {
    title: 'הקמת חנויות אינטרנטיות (Ecommerce) | Top Webstak | פתרונות מסחר מתקדמים',
    description: 'רוצים למכור אונליין?',
    alternates: { canonical: 'https://adi-phone.co.il/services/ecommerce' },
  },
  '/services/analytics': {
    title: 'שירותי אנליטיקס וניתוח נתונים | Top Webstak | קבלת החלטות מבוססות דאטה',
    description: 'הפסיקו לנחש והתחילו למדוד!',
    alternates: { canonical: 'https://adi-phone.co.il/services/analytics' },
  },
  '/services/software-development': {
    title: 'פיתוח תוכנה בהתאמה אישית | Top Webstak | בניית מערכות Web ו-Desktop',
    description: 'כאשר תוכנת מדף לא מספיקה',
    alternates: { canonical: 'https://adi-phone.co.il/services/software-development' },
  },
  '/services/ai': {
    title: 'שירותי בינה מלאכותית (AI) לעסקים | Top Webstak | פתרונות AI מתקדמים',
    description: 'רוצים למנף את הכוח של בינה מלאכותית',
    alternates: { canonical: 'https://adi-phone.co.il/services/ai' },
  },
};

function resolveTitle(title: Metadata['title'], template: string | null): string {
  if (typeof title === 'string') {
    return template ? template.replace('%s', title) : title;
  }
  if (title && typeof title === 'object') {
    if ('absolute' in title && title.absolute) return String(title.absolute);
    if ('default' in title && title.default) {
      const segment = String(title.default);
      return template ? template.replace('%s', segment) : segment;
    }
  }
  return '';
}

function suffixCount(title: string): number {
  return title.split(SUFFIX).length - 1;
}

const empty = (): SeoAgentStoreState => ({ pages: {}, redirects: [], llms: '' });

describe('seo-agent service titles', () => {
  for (const [path, expected] of Object.entries(EXPECTED)) {
    test(`${path} uses the stored title once`, () => {
      const base = HARDCODED[path as keyof typeof EXPECTED];
      const merged = applySeoAgentOverride(base, {
        title: expected,
        description: `תיאור חדש ${path}`,
      });

      assert.deepEqual(merged.title, { absolute: expected });
      assert.equal(resolveTitle(merged.title, TEMPLATE), expected);
      assert.equal(resolveTitle(merged.title, null), expected);
      assert.equal(suffixCount(expected), 1);
      assert.equal(merged.description, `תיאור חדש ${path}`);
      assert.equal(
        typeof merged.alternates?.canonical === 'string' ? merged.alternates.canonical : '',
        base.alternates?.canonical
      );
    });
  }

  test('templated pages strip a stored suffix so the root template adds it once', () => {
    const merged = applySeoAgentOverride(
      { title: 'מחירון בניית אתרים', description: 'ישן' },
      { title: 'מחירון חדש | Top Webstak', description: 'חדש' }
    );
    const rendered = resolveTitle(merged.title, TEMPLATE);
    assert.equal(rendered, 'מחירון חדש | Top Webstak');
    assert.equal(suffixCount(rendered), 1);
    assert.equal(merged.description, 'חדש');
  });

  test('a title-only override does not clear description, canonical, or body fields', () => {
    const base: Metadata = {
      title: HARDCODED['/services/ai'].title,
      description: 'תיאור מקורי',
      alternates: { canonical: 'https://adi-phone.co.il/services/ai' },
      keywords: 'ai',
    };
    const merged = applySeoAgentOverride(base, { title: EXPECTED['/services/ai'] });
    assert.equal(merged.description, 'תיאור מקורי');
    assert.equal(merged.keywords, 'ai');
    assert.equal(merged.alternates?.canonical, 'https://adi-phone.co.il/services/ai');
  });
});

describe('seo-agent apply reducer', () => {
  test('stores a full URL under the site path and keeps omitted fields', () => {
    const first = reduceSeoAgentState(empty(), {
      action: 'apply',
      path: 'https://adi-phone.co.il/blog/x/',
      title: 'כותרת בלוג',
      metaDescription: 'תיאור בלוג',
    });
    assert.equal(first.state.pages['/blog/x'].title, 'כותרת בלוג');
    assert.equal(first.state.pages['/blog/x'].description, 'תיאור בלוג');

    const second = reduceSeoAgentState(first.state, {
      path: '/blog/x',
      metaTitle: 'כותרת מעודכנת | Top Webstak',
    });
    assert.equal(second.state.pages['/blog/x'].title, 'כותרת מעודכנת | Top Webstak');
    assert.equal(second.state.pages['/blog/x'].description, 'תיאור בלוג');
  });

  test('pages[] payload still applies non-service routes', () => {
    const reduced = reduceSeoAgentState(empty(), {
      type: 'apply',
      pages: [
        { path: '/blog/x', title: 'Blog X', description: 'desc /blog/x' },
        { path: '/about', title: 'About', description: 'desc /about' },
      ],
    });
    assert.equal(reduced.state.pages['/blog/x'].title, 'Blog X');
    assert.equal(reduced.state.pages['/about'].title, 'About');
    assert.ok(reduced.touched.includes('/blog/x'));
    assert.ok(reduced.touched.includes('/about'));
  });

  test('revalidate tags the page, its layout, and the parent services layout', () => {
    const calls = revalidatePlan(['/services/ecommerce', '/services/ai']);
    const keys = calls.map((call) => `${call.type || 'path'}:${call.path}`);
    assert.ok(keys.includes('path:/services/ecommerce'));
    assert.ok(keys.includes('page:/services/ecommerce'));
    assert.ok(keys.includes('layout:/services/ecommerce'));
    assert.ok(keys.includes('layout:/services'));
    assert.ok(keys.includes('layout:/services/ai'));
    assert.equal(keys.filter((key) => key === 'layout:/services').length, 1);
  });
});

describe('seo-agent protected service paths', () => {
  const protectedExamples = ['/services/chatgpt-business-hub', '/services/web-development', '/services'];

  test('isSeoAgentProtectedPath covers /services and nested service pages', () => {
    for (const path of protectedExamples) {
      assert.equal(isSeoAgentProtectedPath(normalizeSeoAgentPath(path)), true);
    }
    assert.equal(isSeoAgentProtectedPath('/blog/x'), false);
    assert.equal(isSeoAgentProtectedPath('/about'), false);
  });

  for (const path of ['/services/chatgpt-business-hub', '/services/web-development']) {
    test(`rejects remote override for ${path} (apply, apply_change, pages, overrides)`, () => {
      const payloads = [
        { action: 'apply', path, title: 'Hacked title', description: 'Hacked desc' },
        { action: 'apply_change', path, title: 'Hacked title', faq: [{ question: 'Q', answer: 'A' }] },
        { type: 'page_override', path, schemaMarkup: '{"@type":"FAQPage"}' },
        { pages: [{ path, title: 'Hacked title' }] },
        { overrides: { [path]: { title: 'Hacked title' } } },
      ];
      for (const payload of payloads) {
        const reduced = reduceSeoAgentState(empty(), payload);
        assert.equal(reduced.state.pages[path], undefined);
        assert.equal(reduced.touched.includes(path), false);
        assert.ok(reduced.skippedProtected.includes(path));
      }
    });
  }

  test('still accepts /blog/x article-style page overrides', () => {
    const reduced = reduceSeoAgentState(empty(), {
      action: 'apply_change',
      path: '/blog/x',
      title: 'Blog override',
      metaDescription: 'ok',
    });
    assert.equal(reduced.state.pages['/blog/x'].title, 'Blog override');
    assert.ok(reduced.touched.includes('/blog/x'));
    assert.equal(reduced.skippedProtected.length, 0);
  });

  test('redirects and llms.txt still apply even when a service override is in the same payload', () => {
    const reduced = reduceSeoAgentState(empty(), {
      action: 'apply',
      path: '/services/web-development',
      title: 'should skip',
      redirects: [{ from: '/old', to: '/blog/x', status: 301 }],
      llmsTxt: 'extra llms line',
    });
    assert.equal(reduced.state.pages['/services/web-development'], undefined);
    assert.ok(reduced.skippedProtected.includes('/services/web-development'));
    assert.equal(reduced.redirectsUpdated, true);
    assert.equal(reduced.state.redirects[0].from, '/old');
    assert.equal(reduced.llmsUpdated, true);
    assert.equal(reduced.state.llms, 'extra llms line');
  });

  test('render helpers ignore a stale stored override for a protected path', () => {
    const stale = {
      '/services/chatgpt-business-hub': { title: 'Stale', description: 'Do not show' },
      '/blog/x': { title: 'Live blog' },
    };
    assert.equal(resolveSeoAgentPageOverride('/services/chatgpt-business-hub', stale), null);
    assert.equal(resolveSeoAgentPageOverride('/services/web-development', stale), null);
    assert.equal(resolveSeoAgentPageOverride('/blog/x', stale)?.title, 'Live blog');
  });
});
