import type { Locale } from './config';

/**
 * Arayüz metinleri (menü, buton, erişilebilirlik etiketleri).
 * Sayfa içerikleri burada değil, src/content/pages altındadır.
 * Çeviriler editör kontrolünden geçmeli (bkz. docs/PROGRESS.md).
 */
export interface UiStrings {
  skipToContent: string;
  menu: string;
  close: string;
  homeLink: string;
  bookNow: string;
  language: string;
  scrollDown: string;
  breadcrumb: string;
  navHotel: string;
  navInfo: string;
  allRightsReserved: string;
}

const strings: Record<Locale, UiStrings> = {
  tr: {
    skipToContent: 'İçeriğe geç',
    menu: 'Menü',
    close: 'Kapat',
    homeLink: 'Ana sayfa',
    bookNow: 'Rezervasyon',
    language: 'Dil',
    scrollDown: 'Aşağı kaydır',
    breadcrumb: 'Sayfa yolu',
    navHotel: 'Otel',
    navInfo: 'Bilgi',
    allRightsReserved: 'Tüm hakları saklıdır.',
  },
  en: {
    skipToContent: 'Skip to content',
    menu: 'Menu',
    close: 'Close',
    homeLink: 'Home',
    bookNow: 'Book now',
    language: 'Language',
    scrollDown: 'Scroll down',
    breadcrumb: 'Breadcrumb',
    navHotel: 'Hotel',
    navInfo: 'Information',
    allRightsReserved: 'All rights reserved.',
  },
  de: {
    skipToContent: 'Zum Inhalt springen',
    menu: 'Menü',
    close: 'Schließen',
    homeLink: 'Startseite',
    bookNow: 'Buchen',
    language: 'Sprache',
    scrollDown: 'Nach unten scrollen',
    breadcrumb: 'Seitenpfad',
    navHotel: 'Hotel',
    navInfo: 'Informationen',
    allRightsReserved: 'Alle Rechte vorbehalten.',
  },
  ru: {
    skipToContent: 'Перейти к содержанию',
    menu: 'Меню',
    close: 'Закрыть',
    homeLink: 'Главная',
    bookNow: 'Забронировать',
    language: 'Язык',
    scrollDown: 'Листайте вниз',
    breadcrumb: 'Навигация',
    navHotel: 'Отель',
    navInfo: 'Информация',
    allRightsReserved: 'Все права защищены.',
  },
};

export function getUi(locale: Locale): UiStrings {
  return strings[locale];
}
