/**
 * Above-the-fold rules for the blog post template (header + hero).
 * Inlined on /blog/[slug] so the hero can paint before the main stylesheet.
 */
export const BLOG_CRITICAL_CSS = `
html{scroll-behavior:smooth}
body{margin:0;background:#fff;color:#111827;min-height:100vh;display:flex;flex-direction:column;-webkit-font-smoothing:antialiased}
#main-content{flex-grow:1;width:100%}
.skip-to-main{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.site-header{position:fixed;top:0;left:0;right:0;z-index:50}
.site-header[data-contrast=light]{color:#071433}
.site-header[data-contrast=light] .header-logo{color:#1e3a8a}
.site-header[data-contrast=light] .header-fg,.site-header[data-contrast=light] .nav-link{color:#071433}
.site-header .brand-logo--on-dark{display:none}
.site-header .brand-logo--on-light{display:block}
.brand-lockup{position:relative;display:inline-block;flex:none;line-height:0}
.nav-link{padding:.5rem .75rem;font-size:.875rem;font-weight:500;display:flex;align-items:center}
.pt-24{padding-top:6rem}
.container{width:100%;margin-left:auto;margin-right:auto;padding-left:1rem;padding-right:1rem}
.blog-post-hero,.blog-post-hero picture,.blog-post-hero img{opacity:1;visibility:visible;content-visibility:visible;animation:none;transition:none}
.blog-post-hero{position:relative;height:500px;display:flex;align-items:center;justify-content:center;color:#fff;overflow:hidden;contain:layout paint}
.blog-post-hero .absolute{position:absolute}
.blog-post-hero .inset-0{inset:0}
.blog-post-hero .z-0{z-index:0}
.blog-post-hero .z-10{z-index:10}
.blog-post-hero .relative{position:relative}
.blog-post-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.blog-post-hero .text-center{text-align:center}
.blog-post-hero h1{font-size:2.25rem;line-height:2.5rem;font-weight:700;margin:0 0 1rem}
.blog-post-hero .inline-block{display:inline-block;background:#3b82f6;color:#fff;padding:.5rem 1rem;border-radius:9999px;font-size:.875rem;margin-bottom:1rem}
.blog-post-hero .flex{display:flex}
.blog-post-hero .items-center{align-items:center}
.blog-post-hero .justify-center{justify-content:center}
@media (min-width:768px){.blog-post-hero h1{font-size:3rem;line-height:1}}
`.replace(/\s+/g, ' ').trim();

export const BLOG_CRITICAL_STYLE_ID = 'blog-critical-css';
