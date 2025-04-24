import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/qr',
        destination: '/feedback',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;