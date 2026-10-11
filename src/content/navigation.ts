import type { Locale } from '@/i18n/config';
import { pagePath, routes, type PageKey } from '@/i18n/routes';
import { getUi } from '@/i18n/ui';
import { site } from './site';
import type { ImageRef, NavGroup, NavLink } from './types';

/**
 * Menü ve footer aynı veriden beslenir. Üç grup: otel · bilgi · yasal
 * (Mākena menüsü de üç kolon). Tüm rota anahtarları listelenir; içeriği henüz
 * olmayan sayfalar sıradaki işte dolacak (docs/PROGRESS.md).
 */
const HOTEL: PageKey[] = ['rooms', 'restaurants', 'bars', 'activities', 'pools', 'kids-club', 'pavilions', 'spa', 'beach'];
const INFO: PageKey[] = ['about', 'concept', 'gallery', 'offers', 'honeymoon', 'faq', 'location', 'contact'];
const LEGAL: PageKey[] = ['privacy', 'cookies', 'accessibility'];

/** Menü görseli (dekoratif) */
export const MENU_FIGURE: ImageRef = { id: 'home/story-small', alt: '' };

function links(keys: PageKey[], locale: Locale): NavLink[] {
  return keys.map((key) => ({ label: routes[key].label[locale], href: pagePath(locale, key) }));
}

export function navGroups(locale: Locale): NavGroup[] {
  const ui = getUi(locale);
  return [
    { title: ui.navHotel, links: links(HOTEL, locale) },
    { title: ui.navInfo, links: links(INFO, locale) },
    { title: ui.navLegal, links: links(LEGAL, locale) },
  ];
}

export function legalLinks(locale: Locale): NavLink[] {
  return links(LEGAL, locale);
}

export interface BookingTarget {
  href: string;
  external: boolean;
}

/** Rezervasyon hedefi: motor adresi; yoksa iletişim sayfası. */
export function bookingTarget(locale: Locale): BookingTarget {
  if (site.bookingUrl) return { href: site.bookingUrl, external: true };
  return { href: pagePath(locale, 'contact'), external: false };
}
