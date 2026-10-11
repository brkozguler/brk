import type { Locale } from '@/i18n/config';
import { routes, type PageKey } from '@/i18n/routes';
import type { GalleryGridDetail, LocalizedPage, PageContent, PageMeta } from '../types';

/**
 * Konaklama — `/tr/konaklama/`. Kullanıcı kararları (2026-10-11): Mākena /gallery şablonu
 * (slim hero + kart ızgarası); kart boyutu ve boşluklar voguehotelsupreme.com/odalar; kart içeriği
 * Vogue oda kartı (başlık → açıklama → m² ✦ kişi ✦ manzara → KEŞFET; eyebrow kullanıcı isteğiyle
 * kaldırıldı), bizim tipografiyle
 * (`gallery_grid` → `columns: 2` + `detail`).
 * Hero metni ARCANUS-CONTENT-TR ROOMS-01 (alt metin Mākena galerisinde olmadığı için kullanılmadı);
 * kart metinleri ROOMS-03…06 (TR onaylı; kişi sayısı kapasitenin üst sınırı); EN/DE/RU çeviri
 * editör kontrolü bekliyor. Kart görselleri ana sayfanın oda yer tutucuları.
 * Oda detay sayfaları henüz yok; kartlar rota haritasındaki adreslere gider.
 */

type RoomKey = 'rooms/standard-room' | 'rooms/family-suite' | 'rooms/superior-family-room' | 'rooms/deluxe-family-room';

/** Alan büyüklüğüne göre: 24 · 38 · 48 · 72 m² */
const ROOM_KEYS: RoomKey[] = [
  'rooms/standard-room',
  'rooms/family-suite',
  'rooms/superior-family-room',
  'rooms/deluxe-family-room',
];

const ROOM_IMAGES: Record<RoomKey, string> = {
  'rooms/standard-room': 'home/room-standart',
  'rooms/family-suite': 'home/room-family-suite',
  'rooms/superior-family-room': 'home/room-superior',
  'rooms/deluxe-family-room': 'home/room-deluxe',
};

const HERO_IMAGE = 'home/banner-scale';

interface RoomsText {
  meta: PageMeta;
  hero: { eyebrow: string; title: string; alt: string };
  /** Mākena intro bloğu (HOME-02 ölçüleri, kullanıcı 2026-10-11) — metin ROOMS-02 */
  intro: string;
  rooms: Record<RoomKey, GalleryGridDetail>;
}

const texts: Record<Locale, RoomsText> = {
  tr: {
    meta: {
      title: 'Odalar ve Suitler',
      description:
        "24 m² Standart Oda'dan 72 m² Deluxe Aile Odası'na dört oda tipi. Deniz manzarası, jakuzili balkon ve aile suitleri seçenekleriyle.",
    },
    hero: { eyebrow: 'Konaklama', title: 'Odalar ve aile suitleri', alt: 'Arcanus Hotels Sorgun odaları' },
    intro:
      "Modern tasarım, ferah yaşam alanları ve özenle düşünülmüş detaylar. Arcanus Hotels Sorgun'un dört oda tipinde gün konforla başlıyor, huzurla tamamlanıyor.",
    rooms: {
      'rooms/standard-room': {
        text: 'Modern tasarımın yalın konforla buluştuğu Standart Odalar, balkonundan uzanan bahçe ve Akdeniz manzarasıyla dinlendirici bir konaklama sunuyor.',
        specs: ['24 m²', '3 Kişi', 'Bahçe / deniz manzaralı'],
      },
      'rooms/family-suite': {
        text: 'Akdeniz manzarasını aile konforuyla buluşturan Family Suite, iki ayrı yatak odası ve jakuzili balkonuyla özel bir atmosfer sunuyor.',
        specs: ['38 m²', '4 Kişi', 'Deniz manzaralı'],
      },
      'rooms/superior-family-room': {
        text: 'Ailelere daha fazla alan ve mahremiyet sunan Superior Aile Odaları, iki ayrı yatak odası ve iki banyosuyla konforlu bir tatil sağlıyor.',
        specs: ['48 m²', '5 Kişi', 'Deniz manzaralı'],
      },
      'rooms/deluxe-family-room': {
        text: 'Geniş yaşam alanını aile konforuyla buluşturan Deluxe Aile Odaları; iki yatak odası, oturma odası ve mini mutfağıyla ferah bir düzen sunuyor.',
        specs: ['72 m²', '7 Kişi', 'Deniz manzaralı'],
      },
    },
  },
  en: {
    meta: {
      title: 'Rooms & Suites',
      description:
        'Four room types, from the 24 m² Standard Room to the 72 m² Deluxe Family Room, with sea views, jacuzzi balconies and family suites.',
    },
    hero: { eyebrow: 'Rooms', title: 'Rooms and family suites', alt: 'Rooms at Arcanus Hotels Sorgun' },
    intro:
      'Modern design, generous living spaces and carefully considered details. In the four room types at Arcanus Hotels Sorgun, the day begins in comfort and ends in peace.',
    rooms: {
      'rooms/standard-room': {
        text: 'Standard Rooms pair modern design with simple comfort; the balcony looks out over the garden and the Mediterranean for a restful stay.',
        specs: ['24 m²', '3 guests', 'Garden / sea view'],
      },
      'rooms/family-suite': {
        text: 'The Family Suite brings Mediterranean views together with family comfort: two separate bedrooms and a balcony with a jacuzzi.',
        specs: ['38 m²', '4 guests', 'Sea view'],
      },
      'rooms/superior-family-room': {
        text: 'Superior Family Rooms give families more space and privacy, with two separate bedrooms and two bathrooms.',
        specs: ['48 m²', '5 guests', 'Sea view'],
      },
      'rooms/deluxe-family-room': {
        text: 'Deluxe Family Rooms combine a generous living space with family comfort: two bedrooms, a living room and a kitchenette.',
        specs: ['72 m²', '7 guests', 'Sea view'],
      },
    },
  },
  de: {
    meta: {
      title: 'Zimmer & Suiten',
      description:
        'Vier Zimmertypen vom 24 m² Standardzimmer bis zum 72 m² Deluxe-Familienzimmer, mit Meerblick, Whirlpool-Balkon und Familiensuiten.',
    },
    hero: { eyebrow: 'Zimmer', title: 'Zimmer und Familiensuiten', alt: 'Zimmer im Arcanus Hotels Sorgun' },
    intro:
      'Modernes Design, großzügige Wohnräume und sorgfältig durchdachte Details. In den vier Zimmertypen des Arcanus Hotels Sorgun beginnt der Tag mit Komfort und endet in Ruhe.',
    rooms: {
      'rooms/standard-room': {
        text: 'Die Standardzimmer verbinden modernes Design mit schlichtem Komfort; vom Balkon blickt man auf den Garten und das Mittelmeer.',
        specs: ['24 m²', '3 Personen', 'Garten- / Meerblick'],
      },
      'rooms/family-suite': {
        text: 'Die Familiensuite vereint Mittelmeerblick mit Familienkomfort: zwei getrennte Schlafzimmer und ein Balkon mit Whirlpool.',
        specs: ['38 m²', '4 Personen', 'Meerblick'],
      },
      'rooms/superior-family-room': {
        text: 'Die Superior-Familienzimmer bieten Familien mehr Platz und Privatsphäre, mit zwei getrennten Schlafzimmern und zwei Bädern.',
        specs: ['48 m²', '5 Personen', 'Meerblick'],
      },
      'rooms/deluxe-family-room': {
        text: 'Die Deluxe-Familienzimmer verbinden großzügigen Wohnraum mit Familienkomfort: zwei Schlafzimmer, Wohnzimmer und Kochnische.',
        specs: ['72 m²', '7 Personen', 'Meerblick'],
      },
    },
  },
  ru: {
    meta: {
      title: 'Номера и люксы',
      description:
        'Четыре типа номеров — от стандартного номера 24 м² до семейного номера Делюкс 72 м²: вид на море, балконы с джакузи и семейные люксы.',
    },
    hero: { eyebrow: 'Номера', title: 'Номера и семейные люксы', alt: 'Номера Arcanus Hotels Sorgun' },
    intro:
      'Современный дизайн, просторные жилые зоны и продуманные до мелочей детали. В четырёх типах номеров Arcanus Hotels Sorgun день начинается с комфорта и завершается покоем.',
    rooms: {
      'rooms/standard-room': {
        text: 'Стандартные номера сочетают современный дизайн и простой комфорт; с балкона открывается вид на сад и Средиземное море.',
        specs: ['24 м²', '3 гостя', 'Вид на сад / море'],
      },
      'rooms/family-suite': {
        text: 'Семейный люкс объединяет вид на Средиземное море и семейный комфорт: две отдельные спальни и балкон с джакузи.',
        specs: ['38 м²', '4 гостя', 'Вид на море'],
      },
      'rooms/superior-family-room': {
        text: 'Семейные номера Супериор дают семьям больше пространства и уединения: две отдельные спальни и две ванные комнаты.',
        specs: ['48 м²', '5 гостей', 'Вид на море'],
      },
      'rooms/deluxe-family-room': {
        text: 'Семейные номера Делюкс сочетают просторную жилую зону и семейный комфорт: две спальни, гостиная и мини-кухня.',
        specs: ['72 м²', '7 гостей', 'Вид на море'],
      },
    },
  },
};

function build(locale: Locale): PageContent {
  const t = texts[locale];
  return {
    meta: t.meta,
    blocks: [
      {
        type: 'hero',
        slim: true,
        eyebrow: t.hero.eyebrow,
        titleLines: [t.hero.title],
        media: { id: HERO_IMAGE, alt: t.hero.alt },
      },
      { type: 'intro', text: t.intro, wide: true },
      {
        type: 'gallery_grid',
        columns: 2,
        items: ROOM_KEYS.map((page: PageKey & RoomKey) => ({
          page,
          label: routes[page].label[locale],
          media: { id: ROOM_IMAGES[page], alt: '' },
          detail: t.rooms[page],
        })),
      },
    ],
  };
}

export const rooms: LocalizedPage = Object.fromEntries(
  (Object.keys(texts) as Locale[]).map((locale) => [locale, build(locale)]),
) as LocalizedPage;
