import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compression for better performance
  compress: true,

  // Image optimization (required for next/image remote URLs like ui-avatars)
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: 'api.ratemyemployee.in',
        pathname: '/**',
      },
    ],
  },

  // Enable static optimization
  output: 'standalone',

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'X-Robots-Tag', value: 'index, follow' },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          { key: 'Content-Type', value: 'application/xml' },
          { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          { key: 'Content-Type', value: 'text/plain' },
          { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' },
        ],
      },
    ];
  },

  async rewrites() {
    // IMPORTANT: Browser pages call same-origin /graphql.
    // This rewrite must exist in production; otherwise POST /graphql returns 405.
    const backend =
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      'https://api.ratemyemployee.in/graphql';

    const trimmed = backend.replace(/\/$/, '');
    const graphqlTarget = trimmed.endsWith('/graphql') ? trimmed : `${trimmed}/graphql`;

    return [
      {
        source: '/graphql',
        destination: graphqlTarget,
      },
      {
        source: '/employee/:path*',
        destination: '/feedback/:path*',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/rate',
        destination: '/feedback',
        permanent: true,
      },
      {
        source: '/qr',
        destination: '/feedback',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;