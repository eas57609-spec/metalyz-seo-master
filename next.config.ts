import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // SSL fix headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-SSL-Fix',
            value: 'enabled',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  
  // Replace middleware with rewrites (Next.js 13+ standard)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  
  // Redirect configuration for auth routes
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/',
        permanent: false,
      },
      {
        source: '/projects',
        destination: '/my-projects',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;