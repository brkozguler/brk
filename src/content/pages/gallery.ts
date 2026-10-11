import type { Locale } from '@/i18n/config';
import type { PageKey } from '@/i18n/routes';
import type { GalleryImage, LocalizedPage, PageContent, PageMeta } from '../types';

/**
 * Galeri — Mākena /gallery ve /gallery/{kategori} şablonları (RE §17.6), Arcanus içeriğiyle.
 * İndeks: slim hero + 6 kategori kartı. Kategori: başlık + önceki/sonraki + 12 görsel + lightbox.
 * TR metinler ARCANUS-CONTENT-TR §9; EN/DE/RU çevirileri editör kontrolü bekliyor (PROGRESS).
 * Görseller yer tutucu (scripts/placeholders.mjs); gerçek fotoğraflar aynı adlarla konur.
 */

export const GALLERY_CATEGORIES = ['hotel', 'rooms', 'pools', 'restaurants', 'beach', 'activities'] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

const IMAGES_PER_CATEGORY = 12;
const HERO_IMAGE = 'home/banner-full';

interface CategoryText {
  label: string;
  meta: PageMeta;
}

interface GalleryText {
  meta: PageMeta;
  hero: { eyebrow: string; title: string; alt: string };
  /** Alt metin: "{kategori} — {görsel} {n}" */
  imageWord: string;
  categories: Record<GalleryCategory, CategoryText>;
}

const texts: Record<Locale, GalleryText> = {
  tr: {
    meta: {
      title: 'Galeri',
      description: "Arcanus Hotels Sorgun'un odaları, havuzları, restoranları ve sahilinden fotoğraflar.",
    },
    hero: { eyebrow: 'Galeri', title: "Arcanus'tan kareler", alt: 'Arcanus Hotels Sorgun genel görünüm' },
    imageWord: 'görsel',
    categories: {
      hotel: {
        label: 'Otel',
        meta: {
          title: 'Otel — Galeri',
          description:
            "Side Sorgun'da, çam ormanının kumsala indiği noktada denize sıfır konumlanan Arcanus Hotels Sorgun'un genel görünümünden fotoğraflar.",
        },
      },
      rooms: {
        label: 'Odalar',
        meta: {
          title: 'Odalar — Galeri',
          description:
            "Standart Oda'dan 72 m²'lik Deluxe Aile Odası'na, Arcanus Hotels Sorgun'un dört oda tipinden fotoğraflar; balkon, bahçe ve deniz manzaraları.",
        },
      },
      pools: {
        label: 'Havuzlar',
        meta: {
          title: 'Havuzlar — Galeri',
          description:
            "Ana havuz, kapalı havuz, çocuk havuzu ve 7 kaydıraklı Aqua Havuzu: Arcanus Hotels Sorgun'un havuzlarından fotoğraflar.",
        },
      },
      restaurants: {
        label: 'Restoranlar',
        meta: {
          title: 'Restoranlar — Galeri',
          description:
            "Açık büfe Ana Restaurant ve beş à la carte restoran: Arcanus Hotels Sorgun'un sofralarından ve mekânlarından fotoğraflar.",
        },
      },
      beach: {
        label: 'Sahil',
        meta: {
          title: 'Sahil — Galeri',
          description:
            "Denize sıfır kumsal ve denize uzanan iskele: Arcanus Hotels Sorgun'un sahilinden ve kıyı şeridinden fotoğraflar.",
        },
      },
      activities: {
        label: 'Aktiviteler',
        meta: {
          title: 'Aktiviteler — Galeri',
          description:
            "Çocuk kulübü, spa, pavilyonlar ve gün boyu süren aktiviteler: Arcanus Hotels Sorgun'un aktivite alanlarından fotoğraflar.",
        },
      },
    },
  },
  en: {
    meta: {
      title: 'Gallery',
      description: 'Photos of the rooms, pools, restaurants and beach at Arcanus Hotels Sorgun.',
    },
    hero: { eyebrow: 'Gallery', title: 'Scenes from Arcanus', alt: 'Overview of Arcanus Hotels Sorgun' },
    imageWord: 'photo',
    categories: {
      hotel: {
        label: 'Hotel',
        meta: {
          title: 'Hotel — Gallery',
          description:
            'Photos of Arcanus Hotels Sorgun as a whole: a beachfront resort in Side Sorgun, where the pine forest meets the sand.',
        },
      },
      rooms: {
        label: 'Rooms',
        meta: {
          title: 'Rooms — Gallery',
          description:
            'Photos of the four room types at Arcanus Hotels Sorgun, from the Standard Room to the 72 m² Deluxe Family Room; balcony, garden and sea views.',
        },
      },
      pools: {
        label: 'Pools',
        meta: {
          title: 'Pools — Gallery',
          description:
            "Main pool, indoor pool, children's pool and the Aqua Pool with 7 slides: photos of the pools at Arcanus Hotels Sorgun.",
        },
      },
      restaurants: {
        label: 'Restaurants',
        meta: {
          title: 'Restaurants — Gallery',
          description:
            'The open-buffet Main Restaurant and five à la carte restaurants: photos of the tables and venues at Arcanus Hotels Sorgun.',
        },
      },
      beach: {
        label: 'Beach',
        meta: {
          title: 'Beach — Gallery',
          description:
            'The beachfront sand and the pier reaching into the sea: photos of the beach and shoreline at Arcanus Hotels Sorgun.',
        },
      },
      activities: {
        label: 'Activities',
        meta: {
          title: 'Activities — Gallery',
          description:
            'Kids club, spa, pavilions and all-day activities: photos of the activity areas at Arcanus Hotels Sorgun.',
        },
      },
    },
  },
  de: {
    meta: {
      title: 'Galerie',
      description: 'Fotos der Zimmer, Pools, Restaurants und des Strands im Arcanus Hotels Sorgun.',
    },
    hero: { eyebrow: 'Galerie', title: 'Arcanus in Bildern', alt: 'Arcanus Hotels Sorgun im Überblick' },
    imageWord: 'Foto',
    categories: {
      hotel: {
        label: 'Hotel',
        meta: {
          title: 'Hotel — Galerie',
          description:
            'Fotos vom Arcanus Hotels Sorgun im Überblick: ein Resort direkt am Meer in Side Sorgun, dort, wo der Pinienwald auf den Sand trifft.',
        },
      },
      rooms: {
        label: 'Zimmer',
        meta: {
          title: 'Zimmer — Galerie',
          description:
            'Fotos der vier Zimmertypen im Arcanus Hotels Sorgun, vom Standardzimmer bis zum 72 m² großen Deluxe-Familienzimmer; Balkon-, Garten- und Meerblick.',
        },
      },
      pools: {
        label: 'Pools',
        meta: {
          title: 'Pools — Galerie',
          description:
            'Hauptpool, Hallenbad, Kinderbecken und der Aqua-Pool mit 7 Rutschen: Fotos der Pools im Arcanus Hotels Sorgun.',
        },
      },
      restaurants: {
        label: 'Restaurants',
        meta: {
          title: 'Restaurants — Galerie',
          description:
            'Das Hauptrestaurant mit offenem Buffet und fünf À-la-carte-Restaurants: Fotos der Tische und Räume im Arcanus Hotels Sorgun.',
        },
      },
      beach: {
        label: 'Strand',
        meta: {
          title: 'Strand — Galerie',
          description:
            'Der Sandstrand direkt am Meer und der Steg ins Wasser: Fotos vom Strand und der Küste des Arcanus Hotels Sorgun.',
        },
      },
      activities: {
        label: 'Aktivitäten',
        meta: {
          title: 'Aktivitäten — Galerie',
          description:
            'Kinderclub, Spa, Pavillons und Aktivitäten den ganzen Tag: Fotos der Aktivitätsbereiche im Arcanus Hotels Sorgun.',
        },
      },
    },
  },
  ru: {
    meta: {
      title: 'Галерея',
      description: 'Фотографии номеров, бассейнов, ресторанов и пляжа Arcanus Hotels Sorgun.',
    },
    hero: { eyebrow: 'Галерея', title: 'Arcanus в кадрах', alt: 'Общий вид Arcanus Hotels Sorgun' },
    imageWord: 'фото',
    categories: {
      hotel: {
        label: 'Отель',
        meta: {
          title: 'Отель — Галерея',
          description:
            'Общий вид Arcanus Hotels Sorgun: отель на первой линии в Сиде-Соргуне, там, где сосновый лес выходит к песчаному пляжу.',
        },
      },
      rooms: {
        label: 'Номера',
        meta: {
          title: 'Номера — Галерея',
          description:
            'Фотографии четырёх типов номеров Arcanus Hotels Sorgun — от стандартного номера до семейного номера Делюкс площадью 72 м²; балконы, вид на сад и море.',
        },
      },
      pools: {
        label: 'Бассейны',
        meta: {
          title: 'Бассейны — Галерея',
          description:
            'Главный бассейн, крытый бассейн, детский бассейн и аквабассейн с 7 горками: фотографии бассейнов Arcanus Hotels Sorgun.',
        },
      },
      restaurants: {
        label: 'Рестораны',
        meta: {
          title: 'Рестораны — Галерея',
          description:
            'Главный ресторан со шведским столом и пять ресторанов à la carte: фотографии столов и залов Arcanus Hotels Sorgun.',
        },
      },
      beach: {
        label: 'Пляж',
        meta: {
          title: 'Пляж — Галерея',
          description:
            'Песчаный пляж на первой линии и пирс, уходящий в море: фотографии пляжа и побережья Arcanus Hotels Sorgun.',
        },
      },
      activities: {
        label: 'Активности',
        meta: {
          title: 'Активности — Галерея',
          description:
            'Детский клуб, спа, павильоны и развлечения в течение всего дня: фотографии зон активностей Arcanus Hotels Sorgun.',
        },
      },
    },
  },
};

const locales = Object.keys(texts) as Locale[];

function categoryKey(category: GalleryCategory): PageKey {
  return `gallery/${category}`;
}

function categoryImages(category: GalleryCategory, t: GalleryText): GalleryImage[] {
  const label = t.categories[category].label;
  return Array.from({ length: IMAGES_PER_CATEGORY }, (_, i) => ({
    id: `gallery/${category}/${String(i + 1).padStart(2, '0')}`,
    alt: `${label} — ${t.imageWord} ${i + 1}`,
  }));
}

function indexPage(t: GalleryText): PageContent {
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
        items: GALLERY_CATEGORIES.map((category) => ({
          page: categoryKey(category),
          label: t.categories[category].label,
          media: { id: `gallery/${category}/cover`, alt: '' },
        })),
      },
    ],
  };
}

function categoryPage(category: GalleryCategory, t: GalleryText): PageContent {
  const i = GALLERY_CATEGORIES.indexOf(category);
  const count = GALLERY_CATEGORIES.length;
  // Önceki/sonraki indeks sırasında döner (Mākena: son kategoriden ilke geçer)
  const prev = GALLERY_CATEGORIES[(i - 1 + count) % count];
  const next = GALLERY_CATEGORIES[(i + 1) % count];
  return {
    meta: t.categories[category].meta,
    blocks: [
      {
        type: 'gallery_category',
        title: t.categories[category].label,
        prev: categoryKey(prev),
        next: categoryKey(next),
        images: categoryImages(category, t),
      },
    ],
  };
}

function localized(build: (t: GalleryText) => PageContent): LocalizedPage {
  return Object.fromEntries(locales.map((locale) => [locale, build(texts[locale])])) as LocalizedPage;
}

export const gallery: LocalizedPage = localized(indexPage);

export const galleryCategories: Record<PageKey & `gallery/${string}`, LocalizedPage> = Object.fromEntries(
  GALLERY_CATEGORIES.map((category) => [categoryKey(category), localized((t) => categoryPage(category, t))]),
) as Record<PageKey & `gallery/${string}`, LocalizedPage>;
