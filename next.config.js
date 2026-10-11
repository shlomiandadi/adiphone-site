/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://api.adi-phone.co.il' 
      : 'http://localhost:8000'
  },
  images: {
    unoptimized: true,
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
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
  },
  experimental: {
    optimizeCss: true,
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
  generateBuildId: async () => {
    return 'build-' + Date.now()
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
