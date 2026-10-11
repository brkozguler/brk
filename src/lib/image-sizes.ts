/**
 * `sizes` sözlüğü — her görsel kullanımı buradan değer alır, elle yazılmaz ve
 * `100vw` varsayılanına bırakılmaz (RE §24.4).
 *
 * Türetim: container padding mobil 2rem · ≥650 5rem; grid 12 kolon, gap 1,7rem.
 */
export const SIZES = {
  /** Tam ekran hero — LCP adayı */
  hero: '100vw',
  /** Tam genişlik parallax banner */
  bannerFull: '100vw',
  /** 10/12 kolon, scroll ile ölçeklenen banner */
  bannerScale: '(min-width: 650px) 83vw, calc(100vw - 4rem)',
  /** 50/50 bloğun medya kolonu (l: 5/12, s: 6/12) */
  feature5050: '(min-width: 1024px) 40vw, (min-width: 650px) 47vw, calc(100vw - 4rem)',
  /** Storytelling büyük görsel (l: 7/12) */
  storytellingLg: '(min-width: 1024px) 56vw, (min-width: 650px) 90vw, calc(100vw - 4rem)',
  /** Storytelling küçük görsel (l: 3/12) — altında gizli */
  storytellingSm: '(min-width: 1024px) 23vw, 0px',
  /** Deneyim carousel'i (infinite) — slide, track'in tamamı (8/12 kolon) */
  carouselWide: '(min-width: 1024px) 62vw, (min-width: 650px) 73vw, calc(100vw - 4rem)',
  /** Oda kartı (clamped carousel) — s: 50rem = 480 px @1440 */
  carouselCard: '(min-width: 1024px) 34vw, (min-width: 650px) 59vw, 68vw',
  /** explore_more kare kartı — l: calc(33.333% - 1.2rem) = 431 px @1440 */
  exploreCard: '(min-width: 1024px) 30vw, (min-width: 650px) 47vw, 86vw',
  /** listings5050 sağ kolon (5/12) — 3:4 çerçeve */
  listingImage: '(min-width: 650px) 38vw, calc(100vw - 4rem)',
  /** Menü görseli — mobilde gizli */
  menuFigure: '(min-width: 1024px) 40vw, (min-width: 650px) 48vw, 0px',
  /** Galeri indeks kartı (s: 4/12 kolon = 432 px @1440) */
  galleryCard: '(min-width: 650px) 30.33vw, calc(100vw - 4rem)',
  /** Galeri ızgarası iki kolonlu varyant (l: 626 px @1440 = 44vw; altında tam genişlik) */
  galleryCardWide: '(min-width: 1024px) 44vw, calc(100vw - 4rem)',
  /** Galeri küçük görseli (l: 2/12 = 208 px · s: 4/12 · mobil 3/6) */
  galleryThumb: '(min-width: 1024px) 14.6vw, (min-width: 650px) 31vw, calc(50vw - 2.4rem)',
  /** Lightbox ve tam genişlik slider — site-max içinde */
  lightbox: '(min-width: 650px) 93.33vw, calc(100vw - 4rem)',
  /** İlgili kartlar carousel'i: s: 3'lü (431 px @1440), mobil calc(100% − 5,4rem) */
  relatedCard: '(min-width: 650px) 30vw, calc(100vw - 7.4rem)',
} as const;

export type SizeKey = keyof typeof SIZES;
