import { locales, type Locale } from '@/i18n/config';
import type { PageKey } from '@/i18n/routes';
import type { LocalizedPage, PageContent, PublishedMatrix } from '../types';
import { gallery, galleryCategories } from './gallery';
import { home } from './home';
import { notFound } from './not-found';

/**
 * Sayfa kayıt defteri. Bir sayfa burada ve ilgili dilde içeriği varsa üretilir;
 * yoksa ne statik dosyası, ne menü bağlantısı, ne de hreflang'ı oluşur.
 * Laravel CMS bağlandığında bu modül API'den beslenecek; bileşenler değişmez.
 */
export const pages: Partial<Record<PageKey, LocalizedPage>> = {
  home,
  gallery,
  ...galleryCategories,
  'not-found': notFound,
};

export function getPage(key: PageKey, locale: Locale): PageContent | null {
  return pages[key]?.[locale] ?? null;
}

export function hasPage(key: PageKey, locale: Locale): boolean {
  return Boolean(pages[key]?.[locale]);
}

export function publishedKeys(locale: Locale): PageKey[] {
  return (Object.keys(pages) as PageKey[]).filter((key) => hasPage(key, locale));
}

export function publishedMatrix(): PublishedMatrix {
  const matrix: PublishedMatrix = {};
  for (const key of Object.keys(pages) as PageKey[]) {
    matrix[key] = locales.filter((locale) => hasPage(key, locale));
  }
  return matrix;
}
