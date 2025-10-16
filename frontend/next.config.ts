// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // other TypeScript-compatible config options
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
  },
};

export default nextConfig;