import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { buildBlogPostingSchema } from './blogPosting.ts';
import { getSiteUrl, organizationLogo } from './seo.ts';
import {
  ARTICLE_DESCRIPTION,
  ARTICLE_HEADLINE,
  ARTICLE_MODIFIED,
  ARTICLE_PUBLISHED,
  ARTICLE_SLUG,
} from '../app/blog/kama-oleh-bniyat-atar-2026/article.ts';
import { PRICING_ARTICLE_PATH, PRICING_ARTICLE_WHATSAPP_TEXT, whatsappHrefForPath, whatsappUrl } from './whatsapp.ts';

describe('buildBlogPostingSchema', () => {
  test('pricing article matches the fields the other posts already publish', () => {
    const image = 'https://adi-phone.co.il/images/og-default.png';
    const schema = buildBlogPostingSchema({
      title: ARTICLE_HEADLINE,
      excerpt: ARTICLE_DESCRIPTION,
      mainImage: image,
      category: 'בניית אתרים',
      createdAt: ARTICLE_PUBLISHED,
      updatedAt: ARTICLE_MODIFIED,
      slug: ARTICLE_SLUG,
      content: ARTICLE_DESCRIPTION,
    });

    assert.equal(schema['@type'], 'BlogPosting');
    assert.equal(schema.headline, ARTICLE_HEADLINE);
    assert.equal(schema.datePublished, ARTICLE_PUBLISHED);
    assert.equal(schema.dateModified, ARTICLE_MODIFIED);
    assert.equal(schema.image, image);
    assert.equal(schema.author.name, 'שלומי');
    assert.deepEqual(schema.publisher.logo, organizationLogo(getSiteUrl()));
    assert.equal(schema.publisher.url, getSiteUrl());
    assert.equal(schema.mainEntityOfPage['@id'], `${getSiteUrl()}/blog/${ARTICLE_SLUG}`);
  });
});

describe('whatsappHrefForPath', () => {
  test('pricing article prefills the price-list message and other pages stay bare', () => {
    assert.equal(
      whatsappHrefForPath(PRICING_ARTICLE_PATH),
      whatsappUrl(PRICING_ARTICLE_WHATSAPP_TEXT)
    );
    assert.equal(whatsappHrefForPath('/pricing'), 'https://wa.me/972509159951');
    assert.match(PRICING_ARTICLE_WHATSAPP_TEXT, /^היי, ראיתי את המחירון באתר ואשמח לקבל הצעת מחיר ל/);
  });
});
