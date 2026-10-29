#!/usr/bin/env node
/**
 * Writes lib/static-lastmod.json from the last git commit date of each
 * static route's page-specific files. Never fabricates dates.
 *
 * Shallow clones (Netlify): try `git fetch --unshallow` once. If history
 * is still shallow or git is unavailable, keep the committed JSON map.
 */
import { execFileSync, execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'lib/static-lastmod.json');

const LOCAL_PAGES = [
  '/services/bniyat-atarim-pardes-hana',
  '/services/bniyat-atarim-hadera',
  '/services/bniyat-atarim-caesarea',
  '/services/bniyat-atarim-zichron-yaakov',
  '/services/bniyat-atarim-haifa',
  '/services/bniyat-atarim-netanya',
  '/services/bniyat-atarim-or-akiva',
  '/services/bniyat-atarim-binyamina',
  '/services/bniyat-atarim-yokneam',
  '/services/bniyat-atarim-afula',
];

const EXTRA_FILES = {
  '': ['app/page.tsx', 'app/components/HomeSchema.tsx', 'app/components/HomeFAQ.tsx'],
  '/pricing': ['lib/pricing.ts'],
  '/blog/kama-oleh-bniyat-atar-2026': [
    'app/blog/kama-oleh-bniyat-atar-2026/article.ts',
    'lib/pricing.ts',
  ],
};

for (const path of LOCAL_PAGES) {
  EXTRA_FILES[path] = ['app/components/LocalWebsiteBuildingPage.tsx'];
}

const ROUTES = [
  '',
  '/about',
  '/services',
  '/portfolio',
  '/blog',
  '/contact',
  '/pricing',
  '/privacy-policy',
  '/accessibility-statement',
  '/services/ai',
  '/services/analytics',
  '/services/cloud',
  '/services/ecommerce',
  '/services/mobile-apps',
  '/services/ppc',
  '/services/seo',
  '/services/aeo-geo',
  '/services/software-development',
  '/services/ui-design',
  '/services/web-development',
  '/services/website-tadmit',
  '/services/wordpress',
  '/blog/kama-oleh-bniyat-atar-2026',
  ...LOCAL_PAGES,
];

function readFallback() {
  if (!existsSync(outPath)) return { routes: {} };
  try {
    const parsed = JSON.parse(readFileSync(outPath, 'utf8'));
    if (parsed && typeof parsed === 'object' && parsed.routes && typeof parsed.routes === 'object') {
      return parsed;
    }
  } catch {
    // ignore corrupt map
  }
  return { routes: {} };
}

function gitOk(args) {
  try {
    return execFileSync('git', args, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

function isShallow() {
  return gitOk(['rev-parse', '--is-shallow-repository']) === 'true';
}

function filesFor(route) {
  const dir = route === '' ? 'app' : `app${route}`;
  const candidates = [
    `${dir}/page.tsx`,
    `${dir}/content.ts`,
    `${dir}/metadata.ts`,
    `${dir}/article.ts`,
    `${dir}/layout.tsx`,
    ...(EXTRA_FILES[route] || []),
  ];
  return [...new Set(candidates)].filter((file) => existsSync(join(root, file)));
}

function lastCommitIso(file) {
  const iso = gitOk(['log', '-1', '--format=%cI', '--', file]);
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function writeMap(payload) {
  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`);
}

const fallback = readFallback();
let unshallowAttempted = false;
let stillShallow = false;

if (gitOk(['rev-parse', '--git-dir']) === null) {
  console.warn('[gen-lastmod] git unavailable; keeping committed lastmod map');
  writeMap({
    source: 'fallback',
    unshallowAttempted: false,
    stillShallow: false,
    routes: fallback.routes || {},
  });
  process.exit(0);
}

if (isShallow()) {
  unshallowAttempted = true;
  try {
    execSync('git fetch --unshallow --quiet', { cwd: root, stdio: 'inherit' });
  } catch (error) {
    console.warn('[gen-lastmod] git fetch --unshallow failed; using committed map');
  }
}

stillShallow = isShallow();

if (stillShallow) {
  console.warn('[gen-lastmod] repository still shallow; not using partial git dates');
  writeMap({
    source: 'fallback',
    unshallowAttempted,
    stillShallow: true,
    routes: fallback.routes || {},
  });
  process.exit(0);
}

const routes = {};
for (const route of ROUTES) {
  const dates = filesFor(route)
    .map(lastCommitIso)
    .filter(Boolean)
    .sort();
  if (dates.length === 0) continue;
  routes[route] = dates[dates.length - 1];
}

writeMap({
  source: 'git',
  unshallowAttempted,
  stillShallow: false,
  routes,
});

console.log(
  `[gen-lastmod] wrote ${Object.keys(routes).length} routes source=git unshallowAttempted=${unshallowAttempted}`
);
