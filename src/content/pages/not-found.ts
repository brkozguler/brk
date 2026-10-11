import type { Locale } from '@/i18n/config';
import type { LocalizedPage } from '../types';

export interface NotFoundText {
  title: string;
  text: string;
  back: string;
}

export const notFoundText: Record<Locale, NotFoundText> = {
  tr: {
    title: 'Sayfa bulunamadı',
    text: 'Aradığınız sayfa taşınmış ya da kaldırılmış olabilir.',
    back: 'ANA SAYFA',
  },
  en: {
    title: 'Page not found',
    text: 'The page you are looking for may have been moved or removed.',
    back: 'HOMEPAGE',
  },
  de: {
    title: 'Seite nicht gefunden',
    text: 'Die gesuchte Seite wurde möglicherweise verschoben oder entfernt.',
    back: 'STARTSEITE',
  },
  ru: {
    title: 'Страница не найдена',
    text: 'Возможно, страница была перемещена или удалена.',
    back: 'НА ГЛАВНУЮ',
  },
};

/** Her dilde /xx/404/ üretilsin diye sayfa kaydı; gövdeyi NotFound bileşeni çizer. */
export const notFound: LocalizedPage = Object.fromEntries(
  (Object.keys(notFoundText) as Locale[]).map((locale) => [
    locale,
    {
      meta: { title: notFoundText[locale].title, description: notFoundText[locale].text },
      blocks: [],
    },
  ]),
) as LocalizedPage;
