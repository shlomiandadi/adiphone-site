import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  FAQ_TOPICS,
  FAQ_TOTAL,
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
});
