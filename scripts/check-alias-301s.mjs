#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const rules = JSON.parse(readFileSync(join(root, 'lib/blogAliasMap.json'), 'utf8'));
const base = (process.env.CHECK_REDIRECTS_BASE_URL || '').replace(/\/$/, '');

if (!base) {
  console.log(`OK: ${rules.length} alias sources in lib/blogAliasMap.json`);
  console.log('Set CHECK_REDIRECTS_BASE_URL to probe live 301 status codes.');
  process.exit(0);
}

let failed = 0;
for (const rule of rules) {
  const url = `${base}${rule.source}`;
  const res = await fetch(url, { redirect: 'manual' });
  const location = res.headers.get('location') || '';
  const path = (location.replace(/^https?:\/\/[^/]+/i, '') || '').replace(/\/$/, '') || '/';
  const expected = rule.destination.replace(/\/$/, '') || '/';
  if (res.status !== 301 || (path !== expected && !path.endsWith(expected))) {
    console.error(`${url} returned ${res.status} Location ${location}, expected 301 ${rule.destination}`);
    failed += 1;
  }
}
if (failed) process.exit(1);
console.log(`OK: ${rules.length} sources returned 301 against ${base}`);
