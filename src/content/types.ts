import type { Locale } from '@/i18n/config';
import type { PageKey } from '@/i18n/routes';

/** `id`, scripts/images.mjs manifestindeki anahtardır (assets/images altındaki yol, uzantısız). */
export interface ImageRef {
  id: string;
  alt: string;
}

export interface VideoRef {
  /** public/ altındaki yol, ör. /video/hero.mp4 */
  src: string;
  poster: ImageRef;
}

export interface HeroSection {
  type: 'hero';
  title: string;
  eyebrow?: string;
  image?: ImageRef;
  video?: VideoRef;
}

/** Yeni bölüm tipleri eklendikçe bu birlik genişler (bkz. components/sections/registry). */
export type Section = HeroSection;

export interface PageMeta {
  /** <title>; ana sayfada şablonsuz kullanılır. */
  title: string;
  /** meta description, yaklaşık 155 karakter. */
  description: string;
  /** Open Graph görseli; yoksa site varsayılanı. */
  image?: ImageRef;
  /** ISO tarih (YYYY-MM-DD); sitemap lastmod. Bilinmiyorsa boş bırakılır. */
  updatedAt?: string;
}

export interface PageContent {
  meta: PageMeta;
  sections: Section[];
}

/** Bir dilde içerik yoksa o dilde sayfa üretilmez ve hreflang verilmez. */
export type LocalizedPage = Partial<Record<Locale, PageContent>>;

/** Hangi sayfanın hangi dillerde yayında olduğu; dil seçici bunu kullanır. */
export type PublishedMatrix = Partial<Record<PageKey, Locale[]>>;

export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}
