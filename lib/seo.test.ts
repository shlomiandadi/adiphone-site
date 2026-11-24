import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { completeOpenGraph, DEFAULT_OG_IMAGE, resolveBlogOgImage } from './seo.ts';

describe('resolveBlogOgImage', () => {
  test('empty ogImage and mainImage fall back to the default OG image', () => {
    assert.deepEqual(
      resolveBlogOgImage({ title: 'A post', ogImage: '', mainImage: '' }),
      {
        url: DEFAULT_OG_IMAGE.url,
        width: DEFAULT_OG_IMAGE.width,
        height: DEFAULT_OG_IMAGE.height,
        alt: DEFAULT_OG_IMAGE.alt,
      }
    );
    assert.deepEqual(
      resolveBlogOgImage({ title: 'A post', ogImage: null, mainImage: '   ' }),
      {
        url: DEFAULT_OG_IMAGE.url,
        width: DEFAULT_OG_IMAGE.width,
        height: DEFAULT_OG_IMAGE.height,
        alt: DEFAULT_OG_IMAGE.alt,
      }
    );
  });

  test('mainImage is used when ogImage is empty', () => {
    const mainImage = 'https://cdn.example.com/hero.jpg';
    assert.deepEqual(
      resolveBlogOgImage({ title: 'Hero post', ogImage: '', mainImage }),
      {
        url: mainImage,
        width: DEFAULT_OG_IMAGE.width,
        height: DEFAULT_OG_IMAGE.height,
        alt: 'Hero post',
      }
    );
  });
});

describe('completeOpenGraph', () => {
  test('fills url, type and default image when they are missing', () => {
    const merged = completeOpenGraph('/privacy-policy', { title: 'פרטיות' });
    assert.equal(merged.openGraph?.url, 'https://adi-phone.co.il/privacy-policy');
    assert.equal(merged.openGraph?.type, 'website');
    const images = merged.openGraph?.images;
    assert.ok(Array.isArray(images) && images.length === 1);
  });

  test('replaces a homepage og:url inherited on an inner page', () => {
    const merged = completeOpenGraph('/terms', {
      openGraph: { url: 'https://adi-phone.co.il', title: 'תנאים' },
    });
    assert.equal(merged.openGraph?.url, 'https://adi-phone.co.il/terms');
    assert.equal(merged.openGraph?.title, 'תנאים');
  });

  test('keeps a correct existing url and images', () => {
    const merged = completeOpenGraph('/services/seo', {
      openGraph: {
        url: 'https://adi-phone.co.il/services/seo',
        type: 'website',
        images: [{ url: '/services/seo/opengraph-image' }],
      },
    });
    assert.equal(merged.openGraph?.url, 'https://adi-phone.co.il/services/seo');
    assert.deepEqual(merged.openGraph?.images, [{ url: '/services/seo/opengraph-image' }]);
  });
});
