import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import {
  FAQ_TOPICS,
  FAQ_TOTAL,
  faqMetaDescription,
  faqPageJsonLd,
  faqSitemapPaths,
  getFaqTopic,
  isFaqTopic,
  siblingTopics,
} from './faq.ts';

describe('faq data', () => {
  test('index lists 21 topics totaling 505 questions', () => {
    assert.equal(FAQ_TOPICS.length, 21);
    assert.equal(
      FAQ_TOPICS.reduce((sum, topic) => sum + topic.count, 0),
      FAQ_TOTAL
    );
    assert.equal(FAQ_TOTAL, 505);
  });

  test('loads a topic file with matching items', () => {
    const seo = getFaqTopic('seo');
    assert.ok(seo);
    assert.equal(seo?.titleHe.includes('SEO'), true);
    assert.equal(seo?.items.length, 34);
    assert.equal(isFaqTopic('not-a-topic'), false);
  });

  test('FAQPage JSON-LD uses visible Q&As and he-IL', () => {
    const seo = getFaqTopic('seo');
    assert.ok(seo);
    const schema = faqPageJsonLd(seo!.items);
    assert.equal(schema['@type'], 'FAQPage');
    assert.equal(schema.inLanguage, 'he-IL');
    assert.equal(schema.mainEntity.length, seo!.items.length);
    assert.equal(schema.mainEntity[0].name, seo!.items[0].question);
    assert.equal(schema.mainEntity[0].acceptedAnswer.text, seo!.items[0].answer);
  });

  test('sibling topics wrap around the index', () => {
    const last = FAQ_TOPICS[FAQ_TOPICS.length - 1].topic;
    const siblings = siblingTopics(last, 3);
    assert.equal(siblings.length, 3);
    assert.equal(siblings[0].topic, FAQ_TOPICS[0].topic);
  });

  test('sitemap paths include hub and every topic', () => {
    const paths = faqSitemapPaths();
    assert.equal(paths[0], '/faq');
    assert.equal(paths.length, 22);
    assert.ok(paths.includes('/faq/web-development'));
  });

  test('every indexed topic loads from the bundled JSON map', () => {
    for (const topic of FAQ_TOPICS) {
      const file = getFaqTopic(topic.topic);
      assert.ok(file, topic.topic);
      assert.equal(file!.topic, topic.topic);
      assert.equal(file!.items.length, topic.count);
    }
    assert.equal(getFaqTopic('not-a-topic'), null);
  });

  test('faq loader uses static JSON imports, not filesystem reads', () => {
    const source = readFileSync(new URL('./faq.ts', import.meta.url), 'utf8');
    assert.match(source, /from '\.\.\/data\/faq\/seo\.json' with \{ type: 'json' \}/);
    assert.equal(/from ['"]node:fs['"]/.test(source), false);
    assert.equal(/from ['"]fs['"]/.test(source), false);
  });

  test('every topic has a unique metaDescriptionHe in the 120–155 range', () => {
    const metas = FAQ_TOPICS.map((topic) => {
      const file = getFaqTopic(topic.topic);
      assert.ok(file, topic.topic);
      const meta = file!.metaDescriptionHe?.trim() ?? '';
      assert.ok(meta.length >= 120, `${topic.topic} too short: ${meta.length}`);
      assert.ok(meta.length <= 155, `${topic.topic} too long: ${meta.length}`);
      assert.notEqual(meta, file!.descriptionHe);
      assert.notEqual(meta, file!.titleHe);
      return meta;
    });
    assert.equal(new Set(metas).size, metas.length);
  });

  test('faqMetaDescription falls back to descriptionHe', () => {
    assert.equal(faqMetaDescription({ descriptionHe: 'intro' }), 'intro');
    assert.equal(
      faqMetaDescription({ descriptionHe: 'intro', metaDescriptionHe: '  meta  ' }),
      'meta'
    );
  });
});
