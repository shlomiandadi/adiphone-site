import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import type { Metadata } from 'next';
import {
  applyCmsTitle,
  mergeOpenGraph,
  metadataTitle,
  stripTitleTemplateSuffix,
  usesTitleTemplate,
} from './seoMerge.ts';

describe('CMS title suffix', () => {
  test('stripTitleTemplateSuffix removes a trailing template suffix', () => {
    assert.equal(stripTitleTemplateSuffix('קידום אתרים | Top Webstak'), 'קידום אתרים');
    assert.equal(stripTitleTemplateSuffix('קידום אתרים'), 'קידום אתרים');
    assert.equal(
      stripTitleTemplateSuffix('קידום אתרים | Top Webstak | Top Webstak'),
      'קידום אתרים'
    );
  });

  test('usesTitleTemplate is true for string, default, and missing titles', () => {
    assert.equal(usesTitleTemplate({ title: 'קידום אתרים' }), true);
    assert.equal(usesTitleTemplate({ title: { default: 'בית' } }), true);
    assert.equal(usesTitleTemplate({}), true);
    assert.equal(usesTitleTemplate({ title: { absolute: 'אודות | Top Webstak' } }), false);
  });

  test('templated page: stored title with trailing suffix applies once (no double suffix)', () => {
    const base: Metadata = { title: 'קידום אתרים' };
    const applied = applyCmsTitle(base, 'קידום אתרים | Top Webstak');
    assert.equal(applied, 'קידום אתרים');
    assert.equal(typeof applied, 'string');
  });

  test('templated page: rendered document title is stripped back to the template segment', () => {
    const pageTitle = 'קידום אתרים אורגני SEO | Top Webstak | דירוגים שמביאים לקוחות';
    const base: Metadata = { title: pageTitle };
    const applied = applyCmsTitle(base, `${pageTitle} | Top Webstak`);
    assert.equal(applied, pageTitle);
  });

  test('templated page: stored title without suffix is used as the template segment', () => {
    const base: Metadata = { title: 'קידום אתרים' };
    assert.equal(applyCmsTitle(base, 'קידום אתרים'), 'קידום אתרים');
    assert.equal(applyCmsTitle(base, 'כותרת חדשה'), 'כותרת חדשה');
  });

  test('templated {default} title strips the suffix then writes default', () => {
    const base: Metadata = { title: { default: 'בית', template: '%s | Top Webstak' } };
    const applied = applyCmsTitle(base, 'בית | Top Webstak');
    assert.deepEqual(applied, { default: 'בית', template: '%s | Top Webstak' });
    assert.equal(metadataTitle({ title: applied }), metadataTitle(base));
  });

  test('absolute title keeps the stored string, including a suffix', () => {
    const base: Metadata = { title: { absolute: 'אודות Top Webstak | עדי פון' } };
    const applied = applyCmsTitle(base, 'אודות Top Webstak | Top Webstak');
    assert.deepEqual(applied, { absolute: 'אודות Top Webstak | Top Webstak' });
  });

  test('same title stored with or without suffix does not rewrite a templated page', () => {
    const base: Metadata = { title: 'קידום אתרים' };
    const withSuffix = applyCmsTitle(base, 'קידום אתרים | Top Webstak');
    const without = applyCmsTitle(base, 'קידום אתרים');
    assert.equal(metadataTitle({ title: withSuffix }), metadataTitle(base));
    assert.equal(metadataTitle({ title: without }), metadataTitle(base));
  });
});

describe('mergeOpenGraph', () => {
  const pageImages = [
    {
      url: '/images/og-default.png',
      width: 1200,
      height: 630,
      alt: 'Top Webstak – בניית וקידום אתרים',
    },
  ];

  test('returns undefined when nothing is set', () => {
    assert.equal(mergeOpenGraph({ openGraph: { title: 'A' } }, {}), undefined);
  });

  test('starts from the page OG and does not inject locale/site_name/type/url', () => {
    const base: Metadata = {};
    const merged = mergeOpenGraph(base, { title: 'OG title', description: 'OG desc' });
    assert.deepEqual(merged, { title: 'OG title', description: 'OG desc' });
    assert.ok(merged);
    assert.equal('locale' in merged, false);
    assert.equal('siteName' in merged, false);
    assert.equal('type' in merged, false);
    assert.equal('url' in merged, false);
  });

  test('patches only set fields and keeps the page locale/siteName/type/url', () => {
    const base: Metadata = {
      openGraph: {
        title: 'Page OG',
        description: 'Page desc',
        type: 'website',
        locale: 'he_IL',
        siteName: 'Top Webstak',
        url: 'https://adi-phone.co.il/services/seo',
        images: pageImages,
      },
    };
    const merged = mergeOpenGraph(base, { title: 'CMS OG title' });
    assert.deepEqual(merged, {
      title: 'CMS OG title',
      description: 'Page desc',
      type: 'website',
      locale: 'he_IL',
      siteName: 'Top Webstak',
      url: 'https://adi-phone.co.il/services/seo',
      images: pageImages,
    });
  });

  test('keeps image alt/width/height when the CMS image URL is unchanged', () => {
    const base: Metadata = { openGraph: { images: pageImages } };
    const merged = mergeOpenGraph(base, {
      title: 'New OG',
      image: '/images/og-default.png',
    });
    assert.deepEqual(merged?.images, pageImages);
  });

  test('same image URL alone does not rewrite openGraph', () => {
    const base: Metadata = { openGraph: { images: pageImages, locale: 'he_IL' } };
    assert.equal(mergeOpenGraph(base, { image: '/images/og-default.png' }), undefined);
  });

  test('replaces images when the CMS image URL changes', () => {
    const base: Metadata = { openGraph: { images: pageImages, locale: 'he_IL' } };
    const merged = mergeOpenGraph(base, { image: '/images/og-custom.png' });
    assert.deepEqual(merged, {
      images: [{ url: '/images/og-custom.png' }],
      locale: 'he_IL',
    });
  });

  test('does not add url from the patch when the page never rendered url', () => {
    const base: Metadata = { openGraph: { title: 'Page' } };
    const merged = mergeOpenGraph(base, {
      title: 'CMS',
      url: 'https://adi-phone.co.il/new',
    });
    assert.deepEqual(merged, { title: 'CMS' });
    assert.equal(merged && 'url' in merged, false);
  });

  test('updates url only when the page already had one', () => {
    const base: Metadata = { openGraph: { title: 'Page', url: 'https://adi-phone.co.il/old' } };
    const merged = mergeOpenGraph(base, { url: 'https://adi-phone.co.il/new' });
    assert.deepEqual(merged, { title: 'Page', url: 'https://adi-phone.co.il/new' });
  });

  test('partial page OG stays partial when only ogImage is set', () => {
    const base: Metadata = { openGraph: { title: 'Page OG' } };
    const merged = mergeOpenGraph(base, { image: '/images/og-custom.png' });
    assert.deepEqual(merged, {
      title: 'Page OG',
      images: [{ url: '/images/og-custom.png' }],
    });
    assert.equal(merged && 'locale' in merged, false);
    assert.equal(merged && 'siteName' in merged, false);
    assert.equal(merged && 'type' in merged, false);
  });
});
