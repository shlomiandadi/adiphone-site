/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://api.adi-phone.co.il' 
      : 'http://localhost:8000',
    // Netlify sets CONTEXT=production | deploy-preview | branch-deploy | dev.
    NEXT_PUBLIC_NETLIFY_CONTEXT: process.env.CONTEXT || process.env.NEXT_PUBLIC_NETLIFY_CONTEXT || '',
  },
  images: {
    // Delivery is handled by lib/imageLoader.ts (Cloudinary f_auto/q_auto/c_limit
    // and Unsplash auto=format). The default optimizer is off so Netlify does not
    // need sharp, and originals are no longer shipped at full size.
    loader: 'custom',
    loaderFile: './lib/imageLoader.ts',
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'adi-phone.co.il',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-icons/fa', 'react-icons/si', 'framer-motion'],
    outputFileTracingIncludes: {
      '/faq': ['./data/faq/**/*'],
      '/faq/[topic]': ['./data/faq/**/*'],
    },
  },
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: true,
  distDir: '.next',
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  poweredByHeader: false,
  staticPageGenerationTimeout: 120,
  // Cache policy is path-scoped on purpose. A /:path* rule would also match
  // /netlify-prerender-function and can re-attach year-long CDN cache to the
  // shared bot rewrite (the PR #70 failure). Homepage HTML may use durable
  // Edge TTL; OG images stay immutable; the prerender path stays short-lived
  // and varies on `url`.
  async headers() {
    const ogImageCache = [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      { key: 'Netlify-CDN-Cache-Control', value: 'public, max-age=31536000, immutable, durable' },
      { key: 'Netlify-Vary', value: 'query' },
    ];
    // netlify.toml [[headers]] already sets these on static files. Next.js
    // HTML from @netlify/plugin-nextjs does not inherit that block, so the
    // same security values are applied here (no cache keys — do not widen TTL).
    const documentSecurity = [
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
      {
        key: 'Content-Security-Policy-Report-Only',
        value:
          "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com https://www.gstatic.com https://connect.facebook.net https://analytics.ahrefs.com https://tag.netlify.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.googletagmanager.com https://www.gstatic.com; img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com https://www.google.com https://www.google.co.il https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.facebook.com https://connect.facebook.net https://*.facebook.com https://res.cloudinary.com https://images.unsplash.com https://analytics.ahrefs.com https://seo-agent-tools.netlify.app https://app.netlify.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://www.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://stats.g.doubleclick.net https://www.facebook.com https://connect.facebook.net https://graph.facebook.com https://*.facebook.com https://analytics.ahrefs.com https://res.cloudinary.com https://images.unsplash.com https://*.netlify.app https://*.netlify.com https://app.netlify.com https://tag.netlify.com https://adi-phone.co.il https://www.adi-phone.co.il https://seo.adi-phone.co.il https://leads.adi-phone.co.il https://wa.me https://api.whatsapp.com; frame-src 'self' https://www.googletagmanager.com https://www.google.com https://maps.google.com https://www.google.com/maps https://td.doubleclick.net https://rd.doubleclick.net https://www.facebook.com https://bid.g.doubleclick.net https://app.netlify.com https://tag.netlify.com; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self' https://www.facebook.com https://wa.me; frame-ancestors 'none'",
      },
    ];
    return [
      {
        source: '/:path*',
        headers: documentSecurity,
      },
      {
        source: '/',
        headers: [
          { key: 'Netlify-CDN-Cache-Control', value: 'public, durable, s-maxage=31536000, stale-while-revalidate=31536000' },
          ...documentSecurity,
        ],
      },
      {
        source: '/brand/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000' },
          { key: 'Netlify-CDN-Cache-Control', value: 'public, max-age=31536000, durable' },
        ],
      },
      {
        source: '/opengraph-image',
        headers: ogImageCache,
      },
      {
        source: '/:path+/opengraph-image',
        headers: ogImageCache,
      },
      {
        source: '/netlify-prerender-function',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Netlify-CDN-Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'Netlify-Vary', value: 'query=url' },
        ],
      },
    ];
  },
  // Next.js `permanent: true` is 308. Live 301s are middleware + netlify.toml
  // force rules from lib/permanent-redirects-data.js (existing pages shadow
  // next.config redirects on Netlify).
  async redirects() {
    const { PERMANENT_REDIRECTS: permanentRedirects } = await import(
      './lib/permanent-redirects-data.js'
    );
    return permanentRedirects.flatMap((rule) => {
      const entries = [
        {
          source: rule.source,
          destination: rule.destination,
          permanent: true,
        },
      ];
      if (!rule.source.endsWith('/')) {
        entries.push({
          source: `${rule.source}/`,
          destination: rule.destination,
          permanent: true,
        });
      }
      return entries;
    });
  },
}

module.exports = nextConfig
