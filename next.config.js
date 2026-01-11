/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features disabled for stability
  
  // Image optimization for better SEO
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
  
  // Compression for better performance
  compress: true,
  
  // Headers for better SEO and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
    ];
  },
  
  // Redirects for SEO
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
    ];
  },
  
  // Rewrites for better URL structure
  async rewrites() {
    // IMPORTANT: Browser pages call same-origin /graphql.
    // This rewrite must exist in production; otherwise POST /graphql returns 405 and feedback pages show "Employee not found".
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
  
  // Enable static optimization
  output: 'standalone',
  
  // SWC minification is enabled by default in Next.js 13+
  
  // Experimental features disabled for stability
};

module.exports = nextConfig;
