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
  | 'restaurants/main'
  | 'restaurants/turkish'
  | 'restaurants/italian'
  | 'restaurants/mexican'
  | 'restaurants/far-east'
  | 'restaurants/fish'
  | 'restaurants/aqua-snack'
  | 'bars'
  | 'bars/lobby'
  | 'bars/coffee-house'
  | 'bars/pool'
  | 'bars/beach'
  | 'bars/disco'
  | 'bars/aqua'
  | 'bars/patisserie'
  | 'bars/passion'
  | 'bars/pier'
  | 'activities'
  | 'pools'
  | 'kids-club'
  | 'pavilions'
  | 'spa'
  | 'beach'
  | 'about'
  | 'concept'
  | 'gallery'
  | 'gallery/hotel'
  | 'gallery/rooms'
  | 'gallery/pools'
  | 'gallery/restaurants'
  | 'gallery/beach'
  | 'gallery/activities'
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
  /** Hero'suz, beyaz zeminle başlayan sayfa: header en tepede de koyu (Mākena is-black). */
  headerDark?: boolean;
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
  // Restoran ve bar detayları — SEO haritasında yok (kullanıcı 2026-10-11: kaeo şablonuyla detay
  // sayfaları); slug'lar haritanın sözcük seçimleriyle tutarlı, RU = EN.
  'restaurants/main': {
    parent: 'restaurants',
    slug: s('ana-restaurant', 'main-restaurant', 'hauptrestaurant'),
    label: s('Ana Restaurant', 'Main Restaurant', 'Hauptrestaurant', 'Главный ресторан'),
  },
  'restaurants/turkish': {
    parent: 'restaurants',
    slug: s('turk-a-la-carte', 'turkish-a-la-carte', 'tuerkisches-a-la-carte'),
    label: s("Türk A'la Carte", 'Turkish À la Carte', 'Türkisches À-la-carte', 'Турецкий à la carte'),
  },
  'restaurants/italian': {
    parent: 'restaurants',
    slug: s('italyan-a-la-carte', 'italian-a-la-carte', 'italienisches-a-la-carte'),
    label: s("İtalyan A'la Carte", 'Italian À la Carte', 'Italienisches À-la-carte', 'Итальянский à la carte'),
  },
  'restaurants/mexican': {
    parent: 'restaurants',
    slug: s('meksika-a-la-carte', 'mexican-a-la-carte', 'mexikanisches-a-la-carte'),
    label: s("Meksika A'la Carte", 'Mexican À la Carte', 'Mexikanisches À-la-carte', 'Мексиканский à la carte'),
  },
  'restaurants/far-east': {
    parent: 'restaurants',
    slug: s('uzakdogu-a-la-carte', 'far-east-a-la-carte', 'fernoestliches-a-la-carte'),
    label: s("Uzakdoğu A'la Carte", 'Far East À la Carte', 'Fernöstliches À-la-carte', 'Дальневосточный à la carte'),
  },
  'restaurants/fish': {
    parent: 'restaurants',
    slug: s('balik-a-la-carte', 'fish-a-la-carte', 'fisch-a-la-carte'),
    label: s("Balık A'la Carte", 'Fish À la Carte', 'Fisch-À-la-carte', 'Рыбный à la carte'),
  },
  'restaurants/aqua-snack': {
    parent: 'restaurants',
    slug: s('aqua-snack', 'aqua-snack', 'aqua-snack'),
    label: s('Aqua Snack', 'Aqua Snack', 'Aqua Snack', 'Aqua Snack'),
  },
  bars: {
    slug: s('barlar', 'bars', 'bars'),
    label: s('Barlar', 'Bars', 'Bars', 'Бары'),
  },
  'bars/lobby': {
    parent: 'bars',
    slug: s('lobi-bar', 'lobby-bar', 'lobby-bar'),
    label: s('Lobi Bar', 'Lobby Bar', 'Lobby Bar', 'Лобби-бар'),
  },
  'bars/coffee-house': {
    parent: 'bars',
    slug: s('arcanus-kahve-evi', 'arcanus-coffee-house', 'arcanus-kaffeehaus'),
    label: s('Arcanus Kahve Evi', 'Arcanus Coffee House', 'Arcanus Kaffeehaus', 'Кофейня Arcanus'),
  },
  'bars/pool': {
    parent: 'bars',
    slug: s('havuz-bar', 'pool-bar', 'pool-bar'),
    label: s('Havuz Bar', 'Pool Bar', 'Pool Bar', 'Бар у бассейна'),
  },
  'bars/beach': {
    parent: 'bars',
    slug: s('sahil-bar', 'beach-bar', 'strandbar'),
    label: s('Sahil Bar', 'Beach Bar', 'Strandbar', 'Пляжный бар'),
  },
  'bars/disco': {
    parent: 'bars',
    slug: s('disco-bar', 'disco-bar', 'disco-bar'),
    label: s('Disco Bar', 'Disco Bar', 'Disco Bar', 'Диско-бар'),
  },
  'bars/aqua': {
    parent: 'bars',
    slug: s('aqua-bar', 'aqua-bar', 'aqua-bar'),
    label: s('Aqua Bar', 'Aqua Bar', 'Aqua Bar', 'Aqua Bar'),
  },
  'bars/patisserie': {
    parent: 'bars',
    slug: s('pastane', 'patisserie', 'patisserie'),
    label: s('Pastane', 'Patisserie', 'Patisserie', 'Кондитерская'),
  },
  'bars/passion': {
    parent: 'bars',
    slug: s('passion-kokteyl-bar', 'passion-cocktail-bar', 'passion-cocktailbar'),
    label: s('Passion Kokteyl Bar', 'Passion Cocktail Bar', 'Passion Cocktailbar', 'Коктейль-бар Passion'),
  },
  'bars/pier': {
    parent: 'bars',
    slug: s('iskele-bar', 'pier-bar', 'steg-bar'),
    label: s('İskele Bar', 'Pier Bar', 'Steg-Bar', 'Бар на пирсе'),
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
  // Galeri kategorileri — SEO haritasında yok; TR slug'ları CONTENT-TR §9.1, diğerleri
  // haritadaki sözcük seçimleriyle (zimmer, strand, aktivitaeten) tutarlı.
  'gallery/hotel': {
    parent: 'gallery',
    slug: s('otel', 'hotel', 'hotel'),
    label: s('Otel', 'Hotel', 'Hotel', 'Отель'),
    headerDark: true,
  },
  'gallery/rooms': {
    parent: 'gallery',
    slug: s('odalar', 'rooms', 'zimmer'),
    label: s('Odalar', 'Rooms', 'Zimmer', 'Номера'),
    headerDark: true,
  },
  'gallery/pools': {
    parent: 'gallery',
    slug: s('havuzlar', 'pools', 'pools'),
    label: s('Havuzlar', 'Pools', 'Pools', 'Бассейны'),
    headerDark: true,
  },
  'gallery/restaurants': {
    parent: 'gallery',
    slug: s('restoranlar', 'restaurants', 'restaurants'),
    label: s('Restoranlar', 'Restaurants', 'Restaurants', 'Рестораны'),
    headerDark: true,
  },
  'gallery/beach': {
    parent: 'gallery',
    slug: s('sahil', 'beach', 'strand'),
    label: s('Sahil', 'Beach', 'Strand', 'Пляж'),
    headerDark: true,
  },
  'gallery/activities': {
    parent: 'gallery',
    slug: s('aktiviteler', 'activities', 'aktivitaeten'),
    label: s('Aktiviteler', 'Activities', 'Aktivitäten', 'Активности'),
    headerDark: true,
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
