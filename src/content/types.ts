import type { Locale } from '@/i18n/config';
import type { PageKey } from '@/i18n/routes';

/** `id`, scripts/images.mjs manifestindeki anahtardır (assets/images altındaki yol, uzantısız). */
export interface ImageRef {
  id: string;
  alt: string;
  /** Mobil kadraj (art direction) — ayrı manifest anahtarı */
  mobileId?: string;
  /** Odak noktası 0–1 */
  focal?: { x: number; y: number };
}

/** Sayfa anahtarına giden bağlantı; href dil ve rota haritasından türetilir */
export interface PageLink {
  page: PageKey;
  label: string;
}

/* ---------------------------------------------------------------- bloklar */

export interface HeroBlock {
  type: 'hero';
  eyebrow?: string;
  /** Satırlar başlıkta `<span class="block">` olarak ayrı ayrı kırılır */
  titleLines: string[];
  subtitle?: string;
  media: ImageRef;
  /** İç sayfalar: 55rem yüksek kısa hero */
  slim?: boolean;
}

export interface IntroBlock {
  type: 'intro';
  eyebrow?: string;
  text: string;
  /** Ana sayfada `l:max-w-[92rem]`, diğerlerinde 80rem */
  wide?: boolean;
}

export interface BannerScaleBlock {
  type: 'banner_scale';
  eyebrow?: string;
  title?: string;
  text?: string;
  media: ImageRef;
}

export interface ContentBlock {
  type: 'content';
  eyebrow?: string;
  title?: string;
  text: string;
}

export interface StorytellingBlock {
  type: 'storytelling';
  text: string;
  media: { large: ImageRef; small: ImageRef };
}

export interface SpacerBlock {
  type: 'spacer';
}

export interface BannerFullBlock {
  type: 'banner_full';
  media: ImageRef;
}

export interface Feature5050Block {
  type: 'feature5050';
  eyebrow?: string;
  title: string;
  text: string;
  link?: PageLink;
  media: ImageRef;
  /** Medya solda (varsayılan) */
  left?: boolean;
  /** Mobilde medya üstte */
  reverse?: boolean;
  background?: 'sand' | 'white';
}

export interface CarouselCard {
  title: string;
  page?: PageKey;
  media: ImageRef;
}

export interface CardCarouselBlock {
  type: 'card_carousel';
  /** clamped: yalnızca görsel (HOME-10) · infinite: başlık + CTA'lı kart (HOME-12) */
  variant: 'clamped' | 'infinite';
  eyebrow?: string;
  title: string;
  text?: string;
  /** infinite kartlarının buton etiketi */
  label?: string;
  cards: CarouselCard[];
}

export interface ListingItem {
  title: string;
  media: ImageRef;
}

export interface Listings5050Block {
  type: 'listings5050';
  eyebrow?: string;
  title: string;
  text: string;
  link?: PageLink;
  items: ListingItem[];
}

export interface ExploreLink extends PageLink {
  media: ImageRef;
}

export interface ExploreMoreBlock {
  type: 'explore_more';
  title: string;
  links: ExploreLink[];
}

/** Zengin kart içeriği (Vogue Hotel Supreme oda kartı): eyebrow + açıklama + özellik satırı + buton */
export interface GalleryGridDetail {
  eyebrow?: string;
  text: string;
  /** "24 m²" · "3 Kişi" · "Deniz manzaralı" — ✦ ile ayrılır */
  specs: string[];
}

export interface GalleryGridItem {
  page: PageKey;
  label: string;
  media: ImageRef;
  /** Varsa kart: görsel → eyebrow → başlık → metin → özellikler → KEŞFET */
  detail?: GalleryGridDetail;
}

/** Galeri indeksi: 4:3 kapak + eyebrow etiket, 3 kolon (GALLERY-02) */
export interface GalleryGridBlock {
  type: 'gallery_grid';
  items: GalleryGridItem[];
  /** 3 (varsayılan): Mākena galerisi. 2: ikişer kart, Vogue Hotel Supreme /odalar ölçüleri (Konaklama, 2026-10-11). */
  columns?: 2 | 3;
}

export interface GalleryImage extends ImageRef {
  /** Lightbox altındaki başlık; yoksa boş satır kalır (Mākena böyle) */
  caption?: string;
}

/** Galeri kategorisi: başlık + önceki/sonraki + küçük görseller + lightbox (hero yok) */
export interface GalleryCategoryBlock {
  type: 'gallery_category';
  title: string;
  prev: PageKey;
  next: PageKey;
  images: GalleryImage[];
}

export type Block =
  | HeroBlock
  | IntroBlock
  | BannerScaleBlock
  | ContentBlock
  | StorytellingBlock
  | SpacerBlock
  | BannerFullBlock
  | Feature5050Block
  | CardCarouselBlock
  | Listings5050Block
  | ExploreMoreBlock
  | GalleryGridBlock
  | GalleryCategoryBlock;

/* ----------------------------------------------------------------- sayfa */

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
  blocks: Block[];
  /**
   * Görünür breadcrumb — her iç sayfada açık (kullanıcı kararı 2026-10-11, Akra Didim örneği);
   * `false` ile kapatılır. BreadcrumbList JSON-LD her durumda var.
   */
  breadcrumb?: boolean;
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
