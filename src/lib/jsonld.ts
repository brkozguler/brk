import type { Locale } from '@/i18n/config';
import { breadcrumbKeys, pagePath, routes, type PageKey } from '@/i18n/routes';
import { site } from '@/content/site';
import { absoluteUrl } from './url';

/**
 * JSON-LD üreticileri. Yalnızca sayfada görünen ve doğrulanmış bilgi işaretlenir;
 * boş alanlar çıktıya girmez.
 */
export type JsonLd = Record<string, unknown>;

export function organizationJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: `${site.url}/`,
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

/** Adres ve telefon doğrulanana kadar null döner; o zamana kadar Hotel işaretlenmez. */
export function hotelJsonLd(locale: Locale): JsonLd | null {
  if (!site.address || !site.contact.phone) return null;
  const a = site.address;
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: site.name,
    url: absoluteUrl(pagePath(locale, 'home')),
    telephone: site.contact.phone,
    ...(site.contact.email ? { email: site.contact.email } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      addressLocality: a.district,
      addressRegion: a.city,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: a.lat, longitude: a.lng },
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
