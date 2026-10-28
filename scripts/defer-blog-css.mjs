/**
 * Next App Router does not apply experimental.optimizeCss (Critters cannot
 * stream). After `next build`, rewrite prerendered blog-post HTML so the main
 * stylesheet is non-blocking. Only documents that already include
 * #blog-critical-css are touched.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const STYLE_ID = 'blog-critical-css';
const STYLESHEET_LINK =
  /<link\b(?=[^>]*\brel=["']stylesheet["'])(?![^>]*\bmedia=["']print["'])[^>]*>/gi;

function withPrintSwap(tag) {
  let next = tag;
  if (/\bmedia=/.test(next)) {
    next = next.replace(/\bmedia=["'][^"']*["']/, 'media="print"');
  } else {
    next = next.replace(/<link\b/, '<link media="print"');
  }
  if (!/\bonload=/.test(next)) {
    next = next.replace(/<link\b/, '<link onload="this.media=\'all\'"');
  }
  return `${next}<noscript>${tag}</noscript>`;
}

function deferBlogStylesheets(html) {
  if (!html.includes(`id="${STYLE_ID}"`) && !html.includes(`id='${STYLE_ID}'`)) {
    return { html, changed: false };
  }
  const next = html.replace(STYLESHEET_LINK, withPrintSwap);
  return { html: next, changed: next !== html };
}

async function walk(dir, files = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, files);
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

async function main() {
  const roots = [
    path.join(process.cwd(), '.next/server/app/blog'),
    path.join(process.cwd(), '.next/server/pages/blog'),
  ];
  let rewritten = 0;
  for (const root of roots) {
    const files = await walk(root);
    for (const file of files) {
      const source = await readFile(file, 'utf8');
      const { html, changed } = deferBlogStylesheets(source);
      if (!changed) continue;
      await writeFile(file, html);
      rewritten += 1;
    }
  }
  console.log(`[defer-blog-css] Rewrote ${rewritten} blog HTML file(s)`);
}

main().catch((error) => {
  console.error('[defer-blog-css] Failed:', error);
  process.exit(1);
});
