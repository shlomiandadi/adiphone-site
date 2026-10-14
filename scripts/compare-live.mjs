#!/usr/bin/env node
/**
 * Snapshot HTML of production vs a candidate origin.
 *
 * Usage:
 *   node scripts/compare-live.mjs
 *   COMPARE_BASE=http://localhost:3000 node scripts/compare-live.mjs
 *   LIVE_BASE=https://adi-phone.co.il COMPARE_BASE=https://deploy-preview.example node scripts/compare-live.mjs
 *
 * With current DB data (cmsEnabled unset/false) the candidate HTML for these
 * paths should match production aside from Next.js build IDs and timestamps.
 */
const LIVE_BASE = (process.env.LIVE_BASE || 'https://adi-phone.co.il').replace(/\/$/, '');
const COMPARE_BASE = (process.env.COMPARE_BASE || 'http://localhost:3000').replace(/\/$/, '');

const PATHS = [
  '/',
  '/about',
  '/services',
  '/services/web-development',
  '/contact',
  '/portfolio',
  '/blog',
  '/blog/kama-oleh-bniyat-atar-2026',
  '/robots.txt',
  '/sitemap.xml',
];

function normalize(html) {
  return html
    .replace(/<script id="__NEXT_DATA__"[^>]*>[\s\S]*?<\/script>/g, '')
    .replace(/\/_next\/static\/[^"'/\s]+/g, '/_next/static/BUILD')
    .replace(/buildId":"[^"]+"/g, 'buildId":"BUILD"')
    .replace(/"ts":\d+/g, '"ts":0')
    .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/g, 'TIMESTAMP')
    .replace(/Last-Modified:.*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchText(origin, path) {
  const url = `${origin}${path}`;
  const res = await fetch(url, { redirect: 'follow' });
  const text = await res.text();
  return { url, status: res.status, text };
}

function firstDiff(a, b, context = 80) {
  const max = Math.min(a.length, b.length);
  for (let i = 0; i < max; i += 1) {
    if (a[i] !== b[i]) {
      return {
        index: i,
        live: a.slice(Math.max(0, i - context), i + context),
        candidate: b.slice(Math.max(0, i - context), i + context),
      };
    }
  }
  if (a.length !== b.length) {
    return { index: max, live: a.slice(max, max + context), candidate: b.slice(max, max + context) };
  }
  return null;
}

async function main() {
  console.log(`Live:     ${LIVE_BASE}`);
  console.log(`Compare:  ${COMPARE_BASE}`);
  let failed = 0;

  for (const path of PATHS) {
    let live;
    let candidate;
    try {
      [live, candidate] = await Promise.all([fetchText(LIVE_BASE, path), fetchText(COMPARE_BASE, path)]);
    } catch (error) {
      failed += 1;
      console.log(`FAIL ${path}  fetch error: ${error instanceof Error ? error.message : error}`);
      continue;
    }

    if (live.status !== candidate.status) {
      failed += 1;
      console.log(`FAIL ${path}  status live=${live.status} candidate=${candidate.status}`);
      continue;
    }

    const liveNorm = normalize(live.text);
    const candNorm = normalize(candidate.text);
    if (liveNorm === candNorm) {
      console.log(`OK   ${path}  (${live.status}, ${live.text.length} bytes)`);
      continue;
    }

    failed += 1;
    const diff = firstDiff(liveNorm, candNorm);
    console.log(`DIFF ${path}  live=${live.text.length}B candidate=${candidate.text.length}B at ${diff?.index}`);
    if (diff) {
      console.log(`  live:      …${diff.live}…`);
      console.log(`  candidate: …${diff.candidate}…`);
    }
  }

  if (failed) {
    console.log(`\n${failed}/${PATHS.length} paths differ.`);
    process.exit(1);
  }
  console.log(`\nAll ${PATHS.length} paths match after normalization.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
