import type { Locale } from '@/i18n/config';
import { breadcrumbKeys, pagePath, routes, type PageKey } from '@/i18n/routes';
import { site } from '@/content/site';
import { absoluteUrl } from './url';

/**
 * JSON-LD üreticileri. Yalnızca sayfada görünen ve doğrulanmış bilgi işaretlenir;
 * boş alanlar çıktıya girmez. Yıldız, giriş/çıkış saati ve olanaklar otelden
 * teyit gelince eklenir (docs/PROGRESS.md açık sorular).
 */
export type JsonLd = Record<string, unknown>;

export function organizationJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: `${site.url}/`,
    telephone: site.contact.phone,
    email: site.contact.email,
    ...(site.social.length ? { sameAs: site.social.map((s) => s.url) } : {}),
  };
}

export function websiteJsonLd(locale: Locale): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: absoluteUrl(pagePath(locale, 'home')),
    inLanguage: locale,
  };
}

export function hotelJsonLd(locale: Locale): JsonLd | null {
  const a = site.address;
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: site.name,
    url: absoluteUrl(pagePath(locale, 'home')),
    telephone: site.contact.phone,
    email: site.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      addressLocality: a.district,
      addressRegion: a.city,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    ...(a.lat !== null && a.lng !== null
      ? { geo: { '@type': 'GeoCoordinates', latitude: a.lat, longitude: a.lng } }
      : {}),
  };
}

export function breadcrumbJsonLd(locale: Locale, key: PageKey): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbKeys(key).map((k, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: routes[k].label[locale],
      item: absoluteUrl(pagePath(locale, k)),
    })),
  };
}

/** `<script>` içine güvenli gömme: `<` kaçışlanır. */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
