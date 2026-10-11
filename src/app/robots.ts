import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { pagePath } from '@/i18n/routes';
import { site } from '@/content/site';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: locales.map((locale) => pagePath(locale, 'not-found')),
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
