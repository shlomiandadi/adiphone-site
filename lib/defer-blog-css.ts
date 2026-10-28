import { BLOG_CRITICAL_STYLE_ID } from './blog-critical-css.ts';

const STYLESHEET_LINK =
  /<link\b(?=[^>]*\brel=["']stylesheet["'])(?![^>]*\bmedia=["']print["'])[^>]*>/gi;

function withPrintSwap(tag: string): string {
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

export function shouldDeferBlogStyles(html: string): boolean {
  return html.includes(`id="${BLOG_CRITICAL_STYLE_ID}"`) || html.includes(`id='${BLOG_CRITICAL_STYLE_ID}'`);
}

/** Convert render-blocking stylesheets to print/onload + noscript on marked blog posts. */
export function deferBlogStylesheets(html: string): string {
  if (!shouldDeferBlogStyles(html)) return html;
  return html.replace(STYLESHEET_LINK, withPrintSwap);
}
