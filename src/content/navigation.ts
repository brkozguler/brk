import type { Locale } from '@/i18n/config';
import { pagePath, routes, type PageKey } from '@/i18n/routes';
import { getUi } from '@/i18n/ui';
import { hasPage } from './pages';
import { site } from './site';
import type { NavGroup, NavLink } from './types';

/** Menü ve footer aynı veriden beslenir. Yalnızca yayındaki sayfalar listelenir. */
const PRIMARY: PageKey[] = [
  'rooms',
  'restaurants',
  'bars',
  'activities',
  'pools',
  'kids-club',
  'pavilions',
  'spa',
  'beach',
];

const SECONDARY: PageKey[] = [
  'about',
  'concept',
  'gallery',
  'offers',
  'honeymoon',
  'faq',
  'location',
  'contact',
];

const LEGAL: PageKey[] = ['privacy', 'cookies', 'accessibility'];

function links(keys: PageKey[], locale: Locale): NavLink[] {
  return keys
    .filter((key) => hasPage(key, locale))
    .map((key) => ({ label: routes[key].label[locale], href: pagePath(locale, key) }));
}

export function navGroups(locale: Locale): NavGroup[] {
  const ui = getUi(locale);
  return [
    { title: ui.navHotel, links: links(PRIMARY, locale) },
    { title: ui.navInfo, links: links(SECONDARY, locale) },
  ].filter((group) => group.links.length > 0);
}

export function legalLinks(locale: Locale): NavLink[] {
  return links(LEGAL, locale);
}

export interface BookingTarget {
  href: string;
  external: boolean;
}

/** Rezervasyon hedefi: motor adresi; yoksa iletişim sayfası; o da yoksa buton çizilmez. */
export function bookingTarget(locale: Locale): BookingTarget | null {
  if (site.bookingUrl) return { href: site.bookingUrl, external: true };
  if (hasPage('contact', locale)) return { href: pagePath(locale, 'contact'), external: false };
  return null;
}
