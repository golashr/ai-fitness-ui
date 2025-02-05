import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
  output: 'standalone',
};

export default nextConfig;
