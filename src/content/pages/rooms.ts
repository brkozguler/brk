import type { Locale } from '@/i18n/config';
import { routes, type PageKey } from '@/i18n/routes';
import type { LocalizedPage, PageContent, PageMeta } from '../types';

/**
 * Konaklama — `/tr/konaklama/`. Kullanıcı kararı (2026-10-11): Mākena /gallery şablonu
 * (slim hero + kart ızgarası), kart boyutu ve boşluklar voguehotelsupreme.com/odalar gibi
 * (`gallery_grid` → `columns: 2`).
 * Hero metni ARCANUS-CONTENT-TR ROOMS-01 (alt metin Mākena galerisinde olmadığı için kullanılmadı);
 * kart adları routes.ts etiketleri; meta TR içerik dokümanı §meta tablosu, EN/DE/RU çeviri
 * editör kontrolü bekliyor. Kart görselleri ana sayfanın oda yer tutucuları.
 * Oda detay sayfaları henüz yok; kartlar rota haritasındaki adreslere gider.
 */

/** Alan büyüklüğüne göre: 24 · 38 · 48 · 72 m² */
const ROOM_KEYS: PageKey[] = [
  'rooms/standard-room',
  'rooms/family-suite',
  'rooms/superior-family-room',
  'rooms/deluxe-family-room',
];

const ROOM_IMAGES: Record<string, string> = {
  'rooms/standard-room': 'home/room-standart',
  'rooms/family-suite': 'home/room-family-suite',
  'rooms/superior-family-room': 'home/room-superior',
  'rooms/deluxe-family-room': 'home/room-deluxe',
};

const HERO_IMAGE = 'home/banner-scale';

interface RoomsText {
  meta: PageMeta;
  hero: { eyebrow: string; title: string; alt: string };
}

const texts: Record<Locale, RoomsText> = {
  tr: {
    meta: {
      title: 'Odalar ve Suitler',
      description:
        "24 m² Standart Oda'dan 72 m² Deluxe Aile Odası'na dört oda tipi. Deniz manzarası, jakuzili balkon ve aile suitleri seçenekleriyle.",
    },
    hero: { eyebrow: 'Konaklama', title: 'Odalar ve aile suitleri', alt: 'Arcanus Hotels Sorgun odaları' },
  },
  en: {
    meta: {
      title: 'Rooms & Suites',
      description:
        'Four room types, from the 24 m² Standard Room to the 72 m² Deluxe Family Room, with sea views, jacuzzi balconies and family suites.',
    },
    hero: { eyebrow: 'Rooms', title: 'Rooms and family suites', alt: 'Rooms at Arcanus Hotels Sorgun' },
  },
  de: {
    meta: {
      title: 'Zimmer & Suiten',
      description:
        'Vier Zimmertypen vom 24 m² Standardzimmer bis zum 72 m² Deluxe-Familienzimmer, mit Meerblick, Whirlpool-Balkon und Familiensuiten.',
    },
    hero: { eyebrow: 'Zimmer', title: 'Zimmer und Familiensuiten', alt: 'Zimmer im Arcanus Hotels Sorgun' },
  },
  ru: {
    meta: {
      title: 'Номера и люксы',
      description:
        'Четыре типа номеров — от стандартного номера 24 м² до семейного номера Делюкс 72 м²: вид на море, балконы с джакузи и семейные люксы.',
    },
    hero: { eyebrow: 'Номера', title: 'Номера и семейные люксы', alt: 'Номера Arcanus Hotels Sorgun' },
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
      {
        type: 'gallery_grid',
        columns: 2,
        items: ROOM_KEYS.map((page) => ({
          page,
          label: routes[page].label[locale],
          media: { id: ROOM_IMAGES[page], alt: '' },
        })),
      },
    ],
  };
}

export const rooms: LocalizedPage = Object.fromEntries(
  (Object.keys(texts) as Locale[]).map((locale) => [locale, build(locale)]),
) as LocalizedPage;
