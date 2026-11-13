import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { DEFAULT_OG_IMAGE, resolveBlogOgImage } from './seo.ts';

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
