/**
 * After deploy, confirm the four service pages render the seo-agent titles once.
 *
 *   node scripts/verify-seo-agent-titles.mjs
 *   node scripts/verify-seo-agent-titles.mjs https://adi-phone.co.il
 *
 * The webhook stores overrides in Neon. A GET to /api/seo-agent/webhook imports
 * any older Netlify Blobs payload and revalidates the layout paths. Run that
 * once if these titles are still the hardcoded ones right after the first deploy:
 *
 *   curl -sS https://adi-phone.co.il/api/seo-agent/webhook
 */

const origin = (process.argv[2] || 'https://adi-phone.co.il').replace(/\/$/, '');

const expected = {
  '/services/ecommerce': 'בניית חנות אינטרנטית לעסקים | Top Webstak',
  '/services/analytics': 'אנליטיקס וניתוח נתונים לעסקים | Top Webstak',
  '/services/software-development': 'פיתוח תוכנה בהתאמה אישית | Top Webstak',
  '/services/ai': 'בינה מלאכותית (AI) לעסקים | Top Webstak',
};

function titleOf(html) {
  const match = html.match(/<title[^>]*>(.*?)<\/title>/i);
  return match ? match[1].replace(/\s+/g, ' ').trim() : '';
}

let failed = 0;
for (const [path, want] of Object.entries(expected)) {
  const url = `${origin}${path}`;
  const response = await fetch(url, {
    headers: { 'cache-control': 'no-cache', accept: 'text/html' },
    redirect: 'follow',
  });
  const html = await response.text();
  const title = titleOf(html);
  const doubled = (title.match(/ \| Top Webstak/g) || []).length > 1;
  const date = response.headers.get('x-nextjs-date') || '';
  const ok = response.ok && title === want && !doubled;
  if (!ok) failed += 1;
  console.log(`${ok ? 'ok' : 'FAIL'} ${response.status} ${path}`);
  console.log(`  title: ${title || '(missing)'}`);
  if (title !== want) console.log(`  want:  ${want}`);
  if (doubled) console.log('  suffix appears more than once');
  if (date) console.log(`  x-nextjs-date: ${date}`);
}

if (failed) {
  console.error(`\n${failed} page(s) still do not render the stored title.`);
  console.error(`If this is the first request after deploy, import Blobs and revalidate:`);
  console.error(`  curl -sS ${origin}/api/seo-agent/webhook`);
  console.error('Then run this script again.');
  process.exit(1);
}

console.log('\nAll four service titles match.');
