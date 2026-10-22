/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://api.adi-phone.co.il' 
      : 'http://localhost:8000'
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
  // OG image metadata routes send immutable cache. Scope that to their own
  // paths. The prerender rewrite must never inherit those headers — it is
  // the shared bot entry for every page URL.
  async headers() {
    const ogImageCache = [
      { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      { key: 'Netlify-CDN-Cache-Control', value: 'public, max-age=31536000, immutable, durable' },
      { key: 'Netlify-Vary', value: 'query' },
    ];
    return [
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
  async redirects() {
    return [
      // Duplicate / thin service stubs → primary service URLs (fixes cannibalization + orphans)
      {
        source: '/services/organic-seo',
        destination: '/services/seo',
        permanent: true,
      },
      {
        source: '/services/paid-promotion',
        destination: '/services/ppc',
        permanent: true,
      },
      {
        source: '/services/app-development',
        destination: '/services/mobile-apps',
        permanent: true,
      },
      {
        source: '/services/software',
        destination: '/services/software-development',
        permanent: true,
      },
      // Near-duplicate PPC blog posts → keep the stronger guide
      {
        source: '/blog/nyhvl-kmpyynym-mmvmnym',
        destination: '/blog/nyhvl-kmpyyn-mmvmn',
        permanent: true,
      },
      // Pardes Hanna location posts → consolidated local service page
      {
        source: '/blog/bnyyt-atrym-prds-chnh',
        destination: '/services/bniyat-atarim-pardes-hana',
        permanent: true,
      },
      {
        source: '/blog/bnyyt-atry-ayntrnt-bprds-chnh',
        destination: '/services/bniyat-atarim-pardes-hana',
        permanent: true,
      },
      // Blog cleanup: merged/deleted posts → canonical targets (content plan)
      {
        source: '/blog/building-websites-for-businesses',
        destination: '/blog/bnyyt-atrym-laskym-ktnym',
        permanent: true,
      },
      {
        source: '/blog/kmpyynym-mmvmnym',
        destination: '/blog/nyhvl-kmpyyn-mmvmn',
        permanent: true,
      },
      {
        source: '/blog/kydvm-mmvmn-ppc',
        destination: '/services/ppc',
        permanent: true,
      },
      {
        source: '/blog/top-webstack',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/blog/kyshvrym-mhyrym',
        destination: '/blog/seo-tips-google-ranking-guide',
        permanent: true,
      },
      {
        source: '/blog/ptrvnvt-ai-mtkdmym',
        destination: '/blog/ptrvnvt-bynh-mlakvtyt',
        permanent: true,
      },
      {
        source: '/blog/thlyk-habvdh-shlnv',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/blog/ady-pvn-tkshvrt',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/blog/mvknym-lhtchyl',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/blog/htknvlvgyvt-shlnv',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/blog/hchzvn-shlnv',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/blog/shyrvty-ann',
        destination: '/services/cloud',
        permanent: true,
      },
      {
        source: '/blog/avdvt-hchbrh',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/blog/bnyyh-vkydvm-atrym-mktsvayym',
        destination: '/services/web-development',
        permanent: true,
      },
      {
        source: '/blog/hshyrvtym-shlnv',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/blog/ai-laskym-ktnym',
        destination: '/blog/ptrvnvt-bynh-mlakvtyt',
        permanent: true,
      },
      {
        source: '/blog/kydvm-atrym-laskym-ktnym',
        destination: '/blog/seo-tips-google-ranking-guide',
        permanent: true,
      },
      {
        source: '/blog/pytvch-aplyktsyvt',
        destination: '/services/mobile-apps',
        permanent: true,
      },
      {
        source: '/blog/ptrvnvt-mschr-mtkdmym',
        destination: '/services/ecommerce',
        permanent: true,
      },
      {
        source: '/blog/hytrvnvt-shlnv',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/blog/anlytyks-vmdydh',
        destination: '/services/analytics',
        permanent: true,
      },
      {
        source: '/blog/htsvvt-shlnv',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/blog/3-hvravt-shymvsh',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/bnyyt-atry-vvrdprs',
        destination: '/services/wordpress',
        permanent: true,
      },
      {
        source: '/blog/kydvm-atrym',
        destination: '/services/seo',
        permanent: true,
      },
      {
        source: '/blog/3-mkvrvt-hmyda',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/hprvyktym-shlnv',
        destination: '/portfolio',
        permanent: true,
      },
      {
        source: '/blog/kblt-hchltvt-mbvssvt-dath',
        destination: '/services/analytics',
        permanent: true,
      },
      {
        source: '/blog/atrym-vprvyktym-mvtslchym',
        destination: '/portfolio',
        permanent: true,
      },
      {
        source: '/blog/tknvn-hgyrh-n',
        destination: '/services/web-development',
        permanent: true,
      },
      {
        source: '/blog/hvpkym-rayvn-lmtsyavt',
        destination: '/services',
        permanent: true,
      },
      {
        source: '/blog/bnyyt-atrym-ktnym',
        destination: '/blog/bnyyt-atrym-laskym-ktnym',
        permanent: true,
      },
      {
        source: '/blog/svknvt-kydvm-atrym',
        destination: '/services/seo',
        permanent: true,
      },
      // Thin placeholder portfolio stubs → hub (orphan cleanup)
      {
        source: '/portfolio/project1',
        destination: '/portfolio',
        permanent: true,
      },
      {
        source: '/portfolio/project2',
        destination: '/portfolio',
        permanent: true,
      },
      {
        source: '/portfolio/project3',
        destination: '/portfolio',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
