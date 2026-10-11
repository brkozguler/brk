export const locales = ['tr', 'en', 'de', 'ru'] as const;

export type Locale = (typeof locales)[number];

/** Kök adres bu dile yönlenir (.htaccess 301) ve hreflang x-default bu dildir. */
export const defaultLocale: Locale = 'tr';

/** Dil seçicide bayrak değil dilin kendi adı yazılır. */
export const localeNames: Record<Locale, string> = {
  tr: 'Türkçe',
  en: 'English',
  de: 'Deutsch',
  ru: 'Русский',
};

/** Open Graph `locale` ve Intl biçimlendirme için bölgeli etiketler. */
export const localeTags: Record<Locale, string> = {
  tr: 'tr_TR',
  en: 'en_GB',
  de: 'de_DE',
  ru: 'ru_RU',
};

export function isLocale(value: string | undefined): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

export function asLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}
