import { isLocale, type Locale } from './config';

/**
 * URL haritası — docs/spec/Arcanus-Sorgun-SEO-URL-TR-EN-DE-RU.md
 *
 * Kurallar:
 * - Her dil kendi ön ekinde: /tr/, /en/, /de/, /ru/
 * - Rusça sayfaların slug'ı İngilizce ile aynıdır, içeriği Rusçadır.
 * - Küçük harf, kısa çizgi, sondaki eğik çizgi (trailingSlash: true).
 * - Slug değişikliği yalnızca burada yapılır; sayfalar ve sitemap buradan okur.
 */
export type PageKey =
  | 'home'
  | 'rooms'
  | 'rooms/standard-room'
  | 'rooms/family-suite'
  | 'rooms/deluxe-family-room'
  | 'rooms/superior-family-room'
  | 'restaurants'
  | 'bars'
  | 'activities'
  | 'pools'
  | 'kids-club'
  | 'pavilions'
  | 'spa'
  | 'beach'
  | 'about'
  | 'concept'
  | 'gallery'
  | 'offers'
  | 'offers/early-booking'
  | 'honeymoon'
  | 'faq'
  | 'location'
  | 'contact'
  | 'privacy'
  | 'cookies'
  | 'accessibility'
  | 'not-found';

export interface RouteDef {
  /** Üst sayfa; URL ve breadcrumb bu zincirden türetilir. */
  parent?: PageKey;
  slug: Record<Locale, string>;
  /** Menü, footer ve breadcrumb etiketi. Sayfa başlığı içerik dosyasından gelir. */
  label: Record<Locale, string>;
}

/** Rusça slug varsayılan olarak İngilizce slug'dır. */
function s(tr: string, en: string, de: string, ru: string = en): Record<Locale, string> {
  return { tr, en, de, ru };
}

export const routes: Record<PageKey, RouteDef> = {
  home: {
    slug: s('', '', ''),
    label: s('Ana Sayfa', 'Home', 'Startseite', 'Главная'),
  },
  rooms: {
    slug: s('konaklama', 'rooms', 'zimmer'),
    label: s('Konaklama', 'Rooms', 'Zimmer', 'Номера'),
  },
  'rooms/standard-room': {
    parent: 'rooms',
    slug: s('standart-oda', 'standard-room', 'standardzimmer'),
    label: s('Standart Oda', 'Standard Room', 'Standardzimmer', 'Стандартный номер'),
  },
  'rooms/family-suite': {
    parent: 'rooms',
    slug: s('family-suite', 'family-suite', 'familiensuite'),
    label: s('Family Suite', 'Family Suite', 'Familiensuite', 'Семейный люкс'),
  },
  'rooms/deluxe-family-room': {
    parent: 'rooms',
    slug: s('deluxe-aile-odasi', 'deluxe-family-room', 'deluxe-familienzimmer'),
    label: s(
      'Deluxe Aile Odası',
      'Deluxe Family Room',
      'Deluxe-Familienzimmer',
      'Семейный номер Делюкс',
    ),
  },
  'rooms/superior-family-room': {
    parent: 'rooms',
    slug: s('superior-aile-odasi', 'superior-family-room', 'superior-familienzimmer'),
    label: s(
      'Superior Aile Odası',
      'Superior Family Room',
      'Superior-Familienzimmer',
      'Семейный номер Супериор',
    ),
  },
  restaurants: {
    slug: s('restoranlar', 'restaurants', 'restaurants'),
    label: s('Restoranlar', 'Restaurants', 'Restaurants', 'Рестораны'),
  },
  bars: {
    slug: s('barlar', 'bars', 'bars'),
    label: s('Barlar', 'Bars', 'Bars', 'Бары'),
  },
  activities: {
    slug: s('aktivite-ve-eglence', 'activities-entertainment', 'aktivitaeten-unterhaltung'),
    label: s(
      'Aktivite ve Eğlence',
      'Activities & Entertainment',
      'Aktivitäten & Unterhaltung',
      'Развлечения и активности',
    ),
  },
  pools: {
    slug: s('havuzlar', 'pools', 'pools'),
    label: s('Havuzlar', 'Pools', 'Pools', 'Бассейны'),
  },
  'kids-club': {
    slug: s('cocuk-kulubu', 'kids-club', 'kinderclub'),
    label: s('Çocuk Kulübü', 'Kids Club', 'Kinderclub', 'Детский клуб'),
  },
  pavilions: {
    slug: s('pavilyon', 'pavilions', 'pavillons'),
    label: s('Pavilyon', 'Pavilions', 'Pavillons', 'Павильоны'),
  },
  spa: {
    slug: s('spa-wellness', 'spa-wellness', 'spa-wellness'),
    label: s('Spa ve Wellness', 'Spa & Wellness', 'Spa & Wellness', 'Спа и велнес'),
  },
  beach: {
    slug: s('plaj', 'beach', 'strand'),
    label: s('Plaj', 'Beach', 'Strand', 'Пляж'),
  },
  about: {
    slug: s('hakkimizda', 'about-us', 'ueber-uns'),
    label: s('Hakkımızda', 'About Us', 'Über uns', 'О нас'),
  },
  concept: {
    slug: s('konsept', 'concept', 'konzept'),
    label: s('Konsept', 'Concept', 'Konzept', 'Концепция'),
  },
  gallery: {
    slug: s('galeri', 'gallery', 'galerie'),
    label: s('Galeri', 'Gallery', 'Galerie', 'Галерея'),
  },
  offers: {
    slug: s('kampanyalar', 'offers', 'angebote'),
    label: s('Kampanyalar', 'Offers', 'Angebote', 'Акции'),
  },
  'offers/early-booking': {
    parent: 'offers',
    slug: s('erken-rezervasyon', 'early-booking', 'fruehbucher'),
    label: s('Erken Rezervasyon', 'Early Booking', 'Frühbucher', 'Раннее бронирование'),
  },
  honeymoon: {
    slug: s('balayi', 'honeymoon', 'flitterwochen'),
    label: s('Balayı', 'Honeymoon', 'Flitterwochen', 'Медовый месяц'),
  },
  faq: {
    slug: s('sikca-sorulan-sorular', 'faq', 'faq'),
    label: s('Sıkça Sorulan Sorular', 'FAQ', 'FAQ', 'Вопросы и ответы'),
  },
  location: {
    slug: s('konum-ve-ulasim', 'location-directions', 'lage-anreise'),
    label: s('Konum ve Ulaşım', 'Location & Directions', 'Lage & Anreise', 'Расположение и проезд'),
  },
  contact: {
    slug: s('iletisim', 'contact', 'kontakt'),
    label: s('İletişim', 'Contact', 'Kontakt', 'Контакты'),
  },
  privacy: {
    slug: s('gizlilik-politikasi', 'privacy-policy', 'datenschutz'),
    label: s(
      'Gizlilik Politikası',
      'Privacy Policy',
      'Datenschutz',
      'Политика конфиденциальности',
    ),
  },
  cookies: {
    slug: s('cerez-politikasi', 'cookie-policy', 'cookie-richtlinie'),
    label: s('Çerez Politikası', 'Cookie Policy', 'Cookie-Richtlinie', 'Политика cookie'),
  },
  accessibility: {
    slug: s('erisilebilirlik', 'accessibility', 'barrierefreiheit'),
    label: s('Erişilebilirlik', 'Accessibility', 'Barrierefreiheit', 'Доступность'),
  },
  'not-found': {
    slug: s('404', '404', '404'),
    label: s('Sayfa Bulunamadı', 'Page Not Found', 'Seite nicht gefunden', 'Страница не найдена'),
  },
};

export const pageKeys = Object.keys(routes) as PageKey[];

/** Dil ön eki hariç yol parçaları: ['konaklama', 'standart-oda'] */
export function pageSegments(locale: Locale, key: PageKey): string[] {
  const def = routes[key];
  const parent = def.parent ? pageSegments(locale, def.parent) : [];
  const own = def.slug[locale];
  return own ? [...parent, own] : parent;
}

/** Siteye göre yol: /tr/konaklama/standart-oda/ */
export function pagePath(locale: Locale, key: PageKey): string {
  return `/${[locale, ...pageSegments(locale, key)].join('/')}/`;
}

/** Breadcrumb zinciri: ['home', 'rooms', 'rooms/standard-room'] */
export function breadcrumbKeys(key: PageKey): PageKey[] {
  const chain: PageKey[] = [];
  let current: PageKey | undefined = key;
  while (current) {
    chain.unshift(current);
    current = routes[current].parent;
  }
  if (chain[0] !== 'home') chain.unshift('home');
  return chain;
}

/** Dil ön eki hariç yol parçalarından sayfa anahtarı bulur. */
export function resolvePage(locale: Locale, segments: string[]): PageKey | null {
  const target = segments.join('/');
  for (const key of pageKeys) {
    if (pageSegments(locale, key).join('/') === target) return key;
  }
  return null;
}

/** Tam yoldan (/de/zimmer/) dil ve sayfa anahtarı bulur. */
export function resolvePath(pathname: string): { locale: Locale; key: PageKey } | null {
  const [first, ...rest] = pathname.split('/').filter(Boolean);
  if (!isLocale(first)) return null;
  const key = resolvePage(first, rest);
  return key ? { locale: first, key } : null;
}
