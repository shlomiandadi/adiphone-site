import assert from 'node:assert/strict';
import test from 'node:test';
import { deferBlogStylesheets, shouldDeferBlogStyles } from './defer-blog-css.ts';

const marked = '<html><head><style id="blog-critical-css">.x{}</style><link rel="stylesheet" href="/_next/static/css/app.css"></head></html>';

test('only documents with the blog critical style are rewritten', () => {
  assert.equal(shouldDeferBlogStyles('<link rel="stylesheet" href="/app.css">'), false);
  assert.equal(shouldDeferBlogStyles(marked), true);
});

test('stylesheet links become print/onload with a noscript fallback', () => {
  const next = deferBlogStylesheets(marked);
  assert.match(next, /media="print"/);
  assert.match(next, /onload="this.media='all'"/);
  assert.match(next, /<noscript><link rel="stylesheet" href="\/_next\/static\/css\/app.css"><\/noscript>/);
  assert.equal(next.includes('id="blog-critical-css"'), true);
});

test('unmarked HTML is left unchanged', () => {
  const html = '<link rel="stylesheet" href="/app.css">';
  assert.equal(deferBlogStylesheets(html), html);
});
