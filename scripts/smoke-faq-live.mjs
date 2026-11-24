#!/usr/bin/env node
/**
 * Post-deploy smoke test for /faq and every FAQ topic URL.
 * Fails if any FAQ_FILE_SLUGS path returns 404 or the site 404 title.
 *
 *   FAQ_BASE_URL=https://adi-phone.co.il node scripts/smoke-faq-live.mjs
 *
 * Not wired into CI: it needs a live deploy and would fail PRs before merge.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const index = JSON.parse(readFileSync(join(root, 'data/faq/index.json'), 'utf8'));
const slugs = index.topics.map((topic) => topic.topic);
const base = (process.env.FAQ_BASE_URL || 'https://adi-phone.co.il').replace(/\/$/, '');

async function check(path) {
  const url = `${base}${path}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'adiphone-faq-smoke/1.0', 'Cache-Control': 'no-cache', Pragma: 'no-cache' },
    redirect: 'follow',
  });
  const html = await res.text();
  const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || '';
  const is404Page = title.includes('עמוד 404') || title.includes('הדף לא נמצא');
  return { path, status: res.status, title, ok: res.status === 200 && !is404Page };
}

const paths = ['/faq', ...slugs.map((slug) => `/faq/${slug}`)];
const results = [];
for (const path of paths) {
  results.push(await check(path));
}

const failed = results.filter((row) => !row.ok);
for (const row of results) {
  console.log(`${row.ok ? 'OK' : 'FAIL'} ${row.status} ${row.path}  ${row.title}`);
}
if (failed.length) {
  console.error(`FAQ smoke failed: ${failed.length}/${results.length} URLs`);
  process.exit(1);
}
console.log(`FAQ smoke passed: ${results.length} URLs`);
