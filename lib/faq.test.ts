import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import {
  FAQ_FILE_SLUGS,
  FAQ_TOPICS,
  FAQ_TOPIC_SLUGS,
  FAQ_TOTAL,
  KNOWN_FAQ_SLUGS,
  faqMetaDescription,
  faqPageJsonLd,
  faqSitemapPaths,
  featuredFaqItems,
  getFaqTopic,
  isFaqTopic,
  normalizeFaqTopicParam,
  requireFaqTopic,
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

  test('static params cover all 21 bundled topic files and match the index', () => {
    assert.equal(FAQ_FILE_SLUGS.length, 21);
    assert.deepEqual([...FAQ_FILE_SLUGS].sort(), [...FAQ_TOPICS.map((t) => t.topic)].sort());
    assert.deepEqual([...KNOWN_FAQ_SLUGS].sort(), [...FAQ_TOPIC_SLUGS].sort());
  });

  test('every FAQ data slug resolves to a topic file', () => {
    const fromDisk = JSON.parse(
      readFileSync(new URL('../data/faq/index.json', import.meta.url), 'utf8')
    ) as { topics: { topic: string }[] };
    const slugs = fromDisk.topics.map((topic) => topic.topic);
    assert.equal(slugs.length, 21);
    for (const slug of slugs) {
      assert.equal(isFaqTopic(slug), true, slug);
      const file = getFaqTopic(slug);
      assert.ok(file, slug);
      assert.equal(file!.topic, slug);
      assert.equal(requireFaqTopic(slug).topic, slug);
    }
    assert.equal(normalizeFaqTopicParam(['seo']), 'seo');
    assert.equal(normalizeFaqTopicParam('pricing'), 'pricing');
  });

  test('FAQ topic and hub pages opt out of ISR', () => {
    const topicPage = readFileSync(new URL('../app/faq/[topic]/page.tsx', import.meta.url), 'utf8');
    const hubPage = readFileSync(new URL('../app/faq/page.tsx', import.meta.url), 'utf8');
    const layout = readFileSync(new URL('../app/faq/layout.tsx', import.meta.url), 'utf8');
    for (const source of [topicPage, hubPage, layout]) {
      assert.match(source, /export const dynamic = 'force-static'/);
      assert.match(source, /export const revalidate = false/);
    }
    assert.match(topicPage, /export const dynamicParams = true/);
    assert.match(topicPage, /KNOWN_FAQ_SLUGS/);
    assert.match(topicPage, /requireFaqTopic/);
    assert.match(topicPage, /Known slugs must not call notFound/);
    assert.match(topicPage, /if \(!isFaqTopic\(slug\)\) notFound\(\)/);
  });

  test('requireFaqTopic returns every bundled slug and throws on unknown', () => {
    for (const slug of FAQ_FILE_SLUGS) {
      assert.equal(requireFaqTopic(slug).topic, slug);
    }
    assert.throws(() => requireFaqTopic('not-a-topic'));
  });

  test('featured FAQ items are 8 unique visible questions', () => {
    const featured = featuredFaqItems();
    assert.equal(featured.length, 8);
    assert.equal(new Set(featured.map((item) => item.id)).size, 8);
    for (const item of featured) {
      assert.ok(item.question.trim());
      assert.ok(item.answer.trim());
    }
    const schema = faqPageJsonLd(featured);
    assert.equal(schema.mainEntity.length, 8);
  });
});
