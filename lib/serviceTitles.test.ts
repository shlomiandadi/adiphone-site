import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { forceAbsoluteTitle, SERVICE_DOCUMENT_TITLES, TITLE_BRAND_SUFFIX } from './serviceTitles.ts';

describe('short service titles', () => {
  for (const [name, title] of Object.entries(SERVICE_DOCUMENT_TITLES)) {
    test(`${name} is 60 characters or fewer and ends with the brand`, () => {
      assert.equal(title.length <= 60, true, `${title} is ${title.length}`);
      assert.equal(title.endsWith(TITLE_BRAND_SUFFIX), true);
      const keyword = title.slice(0, title.length - TITLE_BRAND_SUFFIX.length).trim();
      assert.equal(keyword.length > 0, true);
      assert.equal(/[א-ת]/.test(keyword), true);
    });
  }
});

describe('forced document title after an SEO-agent override', () => {
  test('replaces only the title and keeps description, canonical, and social tags', () => {
    const merged = {
      title: { absolute: 'הקמת חנויות אינטרנטיות (Ecommerce) | Top Webstak | פתרונות מסחר מתקדמים' },
      description: 'תיאור שנשמר מהסוכן',
      alternates: { canonical: 'https://adi-phone.co.il/services/ecommerce' },
      openGraph: {
        title: 'כותרת OG שנשמרת',
        description: 'תיאור OG שנשמר',
        url: 'https://adi-phone.co.il/services/ecommerce',
      },
      twitter: { title: 'כותרת טוויטר שנשמרת', description: 'תיאור טוויטר שנשמר' },
      keywords: 'ecommerce',
    };

    const next = forceAbsoluteTitle(merged, SERVICE_DOCUMENT_TITLES.ecommerce);

    assert.deepEqual(next.title, { absolute: SERVICE_DOCUMENT_TITLES.ecommerce });
    assert.equal(next.description, merged.description);
    assert.deepEqual(next.alternates, merged.alternates);
    assert.deepEqual(next.openGraph, merged.openGraph);
    assert.deepEqual(next.twitter, merged.twitter);
    assert.equal(next.keywords, merged.keywords);
  });

  test('only the four service layouts pass a forced absolute title', () => {
    const root = join(dirname(fileURLToPath(import.meta.url)), '..');
    const forced = [
      ['app/services/ecommerce/layout.tsx', 'SERVICE_DOCUMENT_TITLES.ecommerce'],
      ['app/services/analytics/layout.tsx', 'SERVICE_DOCUMENT_TITLES.analytics'],
      ['app/services/software-development/layout.tsx', 'SERVICE_DOCUMENT_TITLES.softwareDevelopment'],
      ['app/services/ai/layout.tsx', 'SERVICE_DOCUMENT_TITLES.ai'],
    ] as const;

    for (const [file, token] of forced) {
      const source = readFileSync(join(root, file), 'utf8');
      assert.match(source, /createSeoAgentGenerateMetadata\(/);
      assert.match(source, new RegExp(token.replace('.', '\\.')));
    }

    const untouched = readFileSync(join(root, 'app/services/seo/layout.tsx'), 'utf8');
    assert.equal(untouched.includes('SERVICE_DOCUMENT_TITLES'), false);
    assert.equal(untouched.includes('absoluteTitle'), false);
  });
});
