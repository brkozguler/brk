import { defaultLocale, locales, type Locale } from '@/i18n/config';
import { pagePath } from '@/i18n/routes';
import { getPage, hasPage, publishedKeys } from '@/content/pages';
import { site } from '@/content/site';
import { absoluteUrl } from './url';

/**
 * Dil bazlı sitemap'ler ve bir sitemap index. Her URL, mevcut dil karşılıklarını
 * xhtml:link ile taşır. lastmod yalnızca içerikte tarih varsa yazılır.
 */
export function localeSitemap(locale: Locale): string {
  const entries = publishedKeys(locale)
    .filter((key) => key !== 'not-found')
    .map((key) => {
      const page = getPage(key, locale);
      const alternates = locales
        .filter((l) => hasPage(key, l))
        .map((l) => link(l, absoluteUrl(pagePath(l, key))));
      if (hasPage(key, defaultLocale)) {
        alternates.push(link('x-default', absoluteUrl(pagePath(defaultLocale, key))));
      }
      const lastmod = page?.meta.updatedAt ? `<lastmod>${page.meta.updatedAt}</lastmod>` : '';
      return `  <url>\n    <loc>${absoluteUrl(pagePath(locale, key))}</loc>\n    ${lastmod}${alternates.join(
        '\n    ',
      )}\n  </url>`;
    });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');
}

export function sitemapIndex(): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...locales.map((l) => `  <sitemap><loc>${site.url}/sitemap-${l}.xml</loc></sitemap>`),
    '</sitemapindex>',
    '',
  ].join('\n');
}

export function xmlResponse(body: string): Response {
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}

function link(hreflang: string, href: string): string {
  return `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}"/>`;
}
