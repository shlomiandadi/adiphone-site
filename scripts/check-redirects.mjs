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
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { PERMANENT_REDIRECTS: rules } = await import('../lib/permanent-redirects-data.js');
const require = createRequire(import.meta.url);
const nextConfig = require('../next.config.js');
const toml = readFileSync(join(root, 'netlify.toml'), 'utf8');
const base = (process.env.CHECK_REDIRECTS_BASE_URL || '').replace(/\/$/, '');

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

const nextRules = await nextConfig.redirects();

for (const rule of rules) {
  const nextMatch = nextRules.find((item) => item.source === rule.source);
  if (!nextMatch || nextMatch.destination !== rule.destination || !nextMatch.permanent) {
    fail(`next.config missing permanent ${rule.source} -> ${rule.destination}`);
  }
  const from = `from = "${rule.source}"`;
  const idx = toml.indexOf(from);
  if (idx === -1) {
    fail(`netlify.toml missing ${rule.source}`);
    continue;
  }
  const slice = toml.slice(idx, idx + 220);
  if (!slice.includes(`to = "${rule.destination}"`) || !slice.includes('status = 301')) {
    fail(`netlify.toml ${rule.source} is not a 301 to ${rule.destination}`);
  }
}

if (!base) {
  if (!process.exitCode) {
    console.log(`OK: ${rules.length} redirect sources in next.config + netlify.toml`);
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
