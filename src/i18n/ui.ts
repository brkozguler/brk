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
  menuToggle: string;
  homeLink: string;
  bookNow: string;
  language: string;
  scrollDown: string;
  breadcrumb: string;
  navHotel: string;
  navInfo: string;
  navLegal: string;
  carousel: string;
  carouselPrev: string;
  carouselNext: string;
  contact: string;
  address: string;
  copy: string;
  copied: string;
  copyPhone: string;
  copyEmail: string;
  backToTop: string;
  allRightsReserved: string;
  loadMore: string;
  image: string;
  galleryNav: string;
  previousGallery: string;
  nextGallery: string;
  galleryViewer: string;
  explore: string;
}

const strings: Record<Locale, UiStrings> = {
  tr: {
    skipToContent: 'İçeriğe geç',
    menu: 'Menü',
    close: 'Kapat',
    menuToggle: 'Menüyü aç veya kapat',
    homeLink: 'Ana sayfa',
    bookNow: 'Rezervasyon',
    language: 'Dil',
    scrollDown: 'Aşağı kaydırın',
    breadcrumb: 'Sayfa yolu',
    navHotel: 'Otel',
    navInfo: 'Bilgi',
    navLegal: 'Yasal',
    carousel: 'Kaydırılabilir galeri',
    carouselPrev: 'Önceki',
    carouselNext: 'Sonraki',
    contact: 'İletişim',
    address: 'Adres',
    copy: 'Kopyala',
    copied: 'Kopyalandı',
    copyPhone: 'Telefon numarasını kopyala',
    copyEmail: 'E-posta adresini kopyala',
    backToTop: 'Sayfanın başına dön',
    allRightsReserved: 'Tüm hakları saklıdır.',
    loadMore: 'Daha fazla',
    image: 'Görsel',
    galleryNav: 'Galeriler arasında geçiş',
    previousGallery: 'Önceki galeri',
    nextGallery: 'Sonraki galeri',
    galleryViewer: 'Galeri görüntüleyici',
    explore: 'Keşfet',
  },
  en: {
    skipToContent: 'Skip to content',
    menu: 'Menu',
    close: 'Close',
    menuToggle: 'Toggle menu',
    homeLink: 'Home',
    bookNow: 'Book now',
    language: 'Language',
    scrollDown: 'Scroll down',
    breadcrumb: 'Breadcrumb',
    navHotel: 'Hotel',
    navInfo: 'Information',
    navLegal: 'Legal',
    carousel: 'Scrollable gallery',
    carouselPrev: 'Previous',
    carouselNext: 'Next',
    contact: 'Contact',
    address: 'Address',
    copy: 'Copy',
    copied: 'Copied',
    copyPhone: 'Copy phone number',
    copyEmail: 'Copy email address',
    backToTop: 'Back to top',
    allRightsReserved: 'All rights reserved.',
    loadMore: 'Load more',
    image: 'Image',
    galleryNav: 'Switch gallery',
    previousGallery: 'Previous gallery',
    nextGallery: 'Next gallery',
    galleryViewer: 'Gallery viewer',
    explore: 'Explore',
  },
  de: {
    skipToContent: 'Zum Inhalt springen',
    menu: 'Menü',
    close: 'Schließen',
    menuToggle: 'Menü öffnen oder schließen',
    homeLink: 'Startseite',
    bookNow: 'Buchen',
    language: 'Sprache',
    scrollDown: 'Nach unten scrollen',
    breadcrumb: 'Seitenpfad',
    navHotel: 'Hotel',
    navInfo: 'Informationen',
    navLegal: 'Rechtliches',
    carousel: 'Scrollbare Galerie',
    carouselPrev: 'Zurück',
    carouselNext: 'Weiter',
    contact: 'Kontakt',
    address: 'Adresse',
    copy: 'Kopieren',
    copied: 'Kopiert',
    copyPhone: 'Telefonnummer kopieren',
    copyEmail: 'E-Mail-Adresse kopieren',
    backToTop: 'Nach oben',
    allRightsReserved: 'Alle Rechte vorbehalten.',
    loadMore: 'Mehr laden',
    image: 'Bild',
    galleryNav: 'Galerie wechseln',
    previousGallery: 'Vorherige Galerie',
    nextGallery: 'Nächste Galerie',
    galleryViewer: 'Galerieansicht',
    explore: 'Entdecken',
  },
  ru: {
    skipToContent: 'Перейти к содержанию',
    menu: 'Меню',
    close: 'Закрыть',
    menuToggle: 'Открыть или закрыть меню',
    homeLink: 'Главная',
    bookNow: 'Забронировать',
    language: 'Язык',
    scrollDown: 'Листайте вниз',
    breadcrumb: 'Навигация',
    navHotel: 'Отель',
    navInfo: 'Информация',
    navLegal: 'Правовая информация',
    carousel: 'Прокручиваемая галерея',
    carouselPrev: 'Назад',
    carouselNext: 'Далее',
    contact: 'Контакты',
    address: 'Адрес',
    copy: 'Копировать',
    copied: 'Скопировано',
    copyPhone: 'Скопировать номер телефона',
    copyEmail: 'Скопировать адрес электронной почты',
    backToTop: 'Наверх',
    allRightsReserved: 'Все права защищены.',
    loadMore: 'Показать ещё',
    image: 'Изображение',
    galleryNav: 'Переход между галереями',
    previousGallery: 'Предыдущая галерея',
    nextGallery: 'Следующая галерея',
    galleryViewer: 'Просмотр галереи',
    explore: 'Подробнее',
  },
};

export function getUi(locale: Locale): UiStrings {
  return strings[locale];
}
