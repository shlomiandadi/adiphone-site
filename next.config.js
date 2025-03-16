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
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://adi-phone.co.il' : '',
  poweredByHeader: false,
}

module.exports = nextConfig 