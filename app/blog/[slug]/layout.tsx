import { BLOG_CRITICAL_CSS, BLOG_CRITICAL_STYLE_ID } from '../../../lib/blog-critical-css';

/**
 * Blog posts only: inline the header/hero rules so the LCP image can paint
 * before the main stylesheet. The build/edge step then loads that stylesheet
 * with media=print + onload swap (see scripts/defer-blog-css.mjs).
 */
export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style id={BLOG_CRITICAL_STYLE_ID} dangerouslySetInnerHTML={{ __html: BLOG_CRITICAL_CSS }} />
      {children}
    </>
  );
}
