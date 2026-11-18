import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, test } from 'node:test';
import { FAQ_TOPICS } from './faq.ts';
import {
  FAQ_TOPIC_TITLE_HE,
  faqTopicForService,
  faqTopicForServicePath,
  listedServiceFaqMappings,
} from './service-faq-topic.ts';

describe('service → FAQ topic mapping', () => {
  test('titles match the FAQ hub index', () => {
    for (const topic of FAQ_TOPICS) {
      assert.equal(FAQ_TOPIC_TITLE_HE[topic.topic], topic.titleHe);
    }
  });

  test('every mapped topic exists in the hub', () => {
    const slugs = new Set(FAQ_TOPICS.map((topic) => topic.topic));
    for (const { path, topic } of listedServiceFaqMappings()) {
      assert.ok(slugs.has(topic), `${path} maps to unknown topic ${topic}`);
    }
  });

  test('example mappings from the product brief', () => {
    assert.equal(faqTopicForServicePath('/services/seo')?.href, '/faq/seo');
    assert.equal(faqTopicForServicePath('/services/ecommerce')?.href, '/faq/ecommerce');
    assert.equal(faqTopicForServicePath('/services/wordpress')?.href, '/faq/web-development');
    assert.equal(faqTopicForServicePath('/services/chatgpt-ads')?.href, '/faq/chatgpt-ads');
    assert.equal(faqTopicForServicePath('/services/chatgpt-business-hub')?.href, '/faq/chatgpt-business-hub');
    assert.equal(faqTopicForServicePath('/services/bniyat-atarim-haifa')?.href, '/faq/local-areas');
    assert.equal(faqTopicForServicePath('/services/web-development/lawyers')?.href, '/faq/verticals');
  });

  test('serviceType aliases resolve through ServiceLayout keys', () => {
    assert.equal(faqTopicForService('seo')?.topic, 'seo');
    assert.equal(faqTopicForService('ppc')?.topic, 'ppc');
    assert.equal(faqTopicForService('paid-promotion')?.topic, 'ppc');
    assert.equal(faqTopicForService('cloud')?.topic, 'ui-software-analytics-cloud');
    assert.equal(faqTopicForService('wordpress')?.topic, 'web-development');
    assert.equal(faqTopicForService('app-development')?.topic, 'mobile-apps');
  });

  test('services hub has no single topic match', () => {
    assert.equal(faqTopicForServicePath('/services'), null);
  });

  test('every app/services page.tsx is mapped or listed as skipped', () => {
    const skipped = new Set(['/services']);
    const pagesDir = join(process.cwd(), 'app/services');
    const routes: string[] = [];

    function walk(dir: string, prefix: string) {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
          walk(join(dir, entry.name), `${prefix}/${entry.name}`);
        } else if (entry.name === 'page.tsx') {
          routes.push(prefix || '/services');
        }
      }
    }
    walk(pagesDir, '/services');

    const unmapped = routes.filter((route) => !skipped.has(route) && !faqTopicForServicePath(route));
    assert.deepEqual(unmapped, []);
  });
});
