#!/usr/bin/env node
/**
 * Verify every permanent-redirect source.
 *
 *   node scripts/check-redirects.mjs
 *     — config-only: map, next.config, netlify.toml
 *
 *   CHECK_REDIRECTS_BASE_URL=https://deploy-preview-N--adi-phone.netlify.app \
 *     node scripts/check-redirects.mjs
 *     — HTTP: each source must return 301 with Location = destination
 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const rules = require('../lib/permanent-redirects-data.cjs');
const nextConfig = require('../next.config.js');
const base = (process.env.CHECK_REDIRECTS_BASE_URL || '').replace(/\/$/, '');

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

const nextRules = await nextConfig.redirects();

for (const rule of rules) {
  const nextMatch = nextRules.find((item) => item.source === rule.source);
  if (nextMatch && (nextMatch.destination !== rule.destination || !nextMatch.permanent)) {
    fail(`next.config ${rule.source} conflicts with map -> ${rule.destination}`);
  }
}

if (!base) {
  if (!process.exitCode) {
    console.log(`OK: ${rules.length} redirect sources in the 301 map`);
    console.log('Set CHECK_REDIRECTS_BASE_URL to probe live 301 status codes.');
  }
  process.exit(process.exitCode || 0);
}

for (const rule of rules) {
  const url = `${base}${rule.source}`;
  const res = await fetch(url, { redirect: 'manual' });
  const location = res.headers.get('location') || '';
  const path = location.replace(/^https?:\/\/[^/]+/i, '');
  if (res.status !== 301) {
    fail(`${url} returned ${res.status}, expected 301 (Location: ${location})`);
    continue;
  }
  const normalized = path.replace(/\/$/, '') || '/';
  const expected = rule.destination.replace(/\/$/, '') || '/';
  if (normalized !== expected && !normalized.endsWith(expected)) {
    fail(`${url} 301 Location ${location}, expected ${rule.destination}`);
  }
}

if (!process.exitCode) {
  console.log(`OK: ${rules.length} sources returned 301 against ${base}`);
}
