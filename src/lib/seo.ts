import type { Metadata } from 'next';
import { defaultLocale, localeTags, locales, type Locale } from '@/i18n/config';
import { pagePath, type PageKey } from '@/i18n/routes';
import { hasPage } from '@/content/pages';
import { site } from '@/content/site';
import type { PageMeta } from '@/content/types';
import { getImage, imageUrl } from './images';
import { absoluteUrl } from './url';

/**
 * Sayfa başına <head> çıktısı: title, description, self canonical,
 * yalnızca mevcut dil karşılıkları için hreflang, x-default ve Open Graph.
 */
export function pageMetadata(locale: Locale, key: PageKey, meta: PageMeta): Metadata {
  const canonical = absoluteUrl(pagePath(locale, key));

  const languages: Record<string, string> = {};
  for (const other of locales) {
    if (hasPage(key, other)) languages[other] = absoluteUrl(pagePath(other, key));
  }
  if (hasPage(key, defaultLocale)) {
    languages['x-default'] = absoluteUrl(pagePath(defaultLocale, key));
  }

  const ogImage = meta.image ? getImage(meta.image.id) : null;
  const images = ogImage
    ? [
        {
          url: absoluteUrl(imageUrl(ogImage, nearestWidth(ogImage.widths, 1200), 'webp')),
          width: nearestWidth(ogImage.widths, 1200),
          height: Math.round((nearestWidth(ogImage.widths, 1200) * ogImage.height) / ogImage.width),
          alt: meta.image?.alt,
        },
      ]
    : undefined;

  const isNotFound = key === 'not-found';

  return {
    title: key === 'home' ? { absolute: meta.title } : meta.title,
    description: meta.description,
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      siteName: site.name,
      locale: localeTags[locale],
      alternateLocale: locales.filter((l) => l !== locale && hasPage(key, l)).map((l) => localeTags[l]),
      url: canonical,
      title: meta.title,
      description: meta.description,
      images,
    },
    twitter: { card: images ? 'summary_large_image' : 'summary' },
    robots: isNotFound ? { index: false, follow: false } : undefined,
  };
}

function nearestWidth(widths: number[], target: number): number {
  return widths.reduce((best, w) => (Math.abs(w - target) < Math.abs(best - target) ? w : best));
}
