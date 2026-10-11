import type { NextConfig } from 'next';

/**
 * Site cPanel'de statik dosya olarak yayınlanır (bkz. docs/DEPLOY-CPANEL.md).
 * Sunucu gerektiren özellikler (redirects, headers, proxy, next/image optimizer)
 * kullanılmaz; bunların karşılığı deploy/htaccess içindedir.
 */
const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    // Görseller build sırasında scripts/images.mjs ile üretilir ve
    // components/media/Picture ile sunulur; next/image optimizer kullanılmaz.
    unoptimized: true,
  },
};

export default config;
