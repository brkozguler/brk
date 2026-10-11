import type { LocalizedPage } from '../types';

/**
 * Ana sayfa. Hero görseli ve diğer bölümler içerik ve fotoğraflar geldiğinde eklenir.
 * Metinler doğrulanmış bilgiyle sınırlıdır; pazarlama cümlesi uydurulmaz.
 */
export const home: LocalizedPage = {
  tr: {
    meta: {
      title: 'Arcanus Hotels Sorgun',
      description:
        'Arcanus Hotels Sorgun resmi web sitesi: konaklama, restoranlar, havuzlar, çocuk kulübü, pavilyonlar ve spa.',
    },
    sections: [{ type: 'hero', title: 'Arcanus Hotels Sorgun' }],
  },
  en: {
    meta: {
      title: 'Arcanus Hotels Sorgun',
      description:
        'Official website of Arcanus Hotels Sorgun: rooms, restaurants, pools, kids club, pavilions and spa.',
    },
    sections: [{ type: 'hero', title: 'Arcanus Hotels Sorgun' }],
  },
  de: {
    meta: {
      title: 'Arcanus Hotels Sorgun',
      description:
        'Offizielle Website von Arcanus Hotels Sorgun: Zimmer, Restaurants, Pools, Kinderclub, Pavillons und Spa.',
    },
    sections: [{ type: 'hero', title: 'Arcanus Hotels Sorgun' }],
  },
  ru: {
    meta: {
      title: 'Arcanus Hotels Sorgun',
      description:
        'Официальный сайт Arcanus Hotels Sorgun: номера, рестораны, бассейны, детский клуб, павильоны и спа.',
    },
    sections: [{ type: 'hero', title: 'Arcanus Hotels Sorgun' }],
  },
};
