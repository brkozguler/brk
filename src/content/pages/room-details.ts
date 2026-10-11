import type { Locale } from '@/i18n/config';
import { routes, type PageKey } from '@/i18n/routes';
import type { Block, LocalizedPage, PageContent, PageMeta } from '../types';

/**
 * Oda detay sayfaları — kullanıcı kararı (2026-10-11): Mākena /real-estate/kaeo şablonu:
 * hero (tam ekran) → intro → gövde sütunu (+ ✦ özellikler) → tam genişlik slider → diğer odalar.
 * TR metinler ARCANUS-CONTENT-TR §4 (intro.text, feature.text, specs; ⚠️ "yatak" satırı alınmadı);
 * EN/DE/RU çeviri editör kontrolü bekliyor. Görseller yer tutucu: assets/images/rooms/<oda>/.
 */

export type RoomKey = 'rooms/standard-room' | 'rooms/family-suite' | 'rooms/superior-family-room' | 'rooms/deluxe-family-room';

/** Alan sırası: 24 · 38 · 48 · 72 m² */
export const ROOM_KEYS: RoomKey[] = [
  'rooms/standard-room',
  'rooms/family-suite',
  'rooms/superior-family-room',
  'rooms/deluxe-family-room',
];

const ROOM_DIR: Record<RoomKey, string> = {
  'rooms/standard-room': 'rooms/standard-room',
  'rooms/family-suite': 'rooms/family-suite',
  'rooms/superior-family-room': 'rooms/superior-family-room',
  'rooms/deluxe-family-room': 'rooms/deluxe-family-room',
};

interface RoomText {
  meta: PageMeta;
  intro: string;
  body: string;
  specs: string[];
}

interface RoomsDetailText {
  eyebrow: string;
  related: string;
  imageWord: string;
  rooms: Record<RoomKey, RoomText>;
}

const texts: Record<Locale, RoomsDetailText> = {
  tr: {
    eyebrow: 'Konaklama',
    related: 'Diğer odalar',
    imageWord: 'görsel',
    rooms: {
      'rooms/standard-room': {
        meta: {
          title: 'Standart Oda',
          description: '24 m² Standart Oda: balkon, bahçe veya deniz manzarası. 2 yetişkin + 1 çocuk ya da 3 yetişkin konaklamaya uygun.',
        },
        intro: 'Yalın bir düzen, ferah bir balkon ve gün boyu değişen manzara. Standart Odalar, tatilin temel konforunu sade bir tasarımla sunuyor.',
        body: 'Balkona açılan geniş cam yüzey, odaya gün boyu doğal ışık alıyor. Yatak alanı ve oturma bölümü aynı mekânda, dolaşımı engellemeyecek şekilde yerleştirildi.',
        specs: ['24 m²', '2 yetişkin + 1 çocuk veya 3 yetişkin', 'Bahçe, yandan deniz veya deniz manzarası', '1 banyo'],
      },
      'rooms/family-suite': {
        meta: {
          title: 'Family Suite',
          description: '38 m² Family Suite: iki yatak odası, jakuzili balkon ve deniz manzarası. 2 yetişkin + 2 çocuk konaklamaya uygun aile suiti.',
        },
        intro: 'İki ayrı yatak odası ve jakuzili balkonuyla Family Suite, aileye hem ortak alan hem kendi köşesini bırakıyor. Tüm suitler deniz manzaralı.',
        body: 'Balkondaki jakuzi, akşamları denizin üzerinden batan güneşe karşı kullanılabiliyor. Balkon oturma grubu, iki kişilik bir akşam için yeterli alan bırakıyor.',
        specs: ['38 m²', '2 yetişkin + 2 çocuk veya 3 yetişkin + 1 çocuk', 'Deniz manzarası', '2 yatak odası', 'Jakuzili balkon'],
      },
      'rooms/superior-family-room': {
        meta: {
          title: 'Superior Aile Odası',
          description: '48 m² Superior Aile Odası: iki yatak odası, iki banyo ve deniz manzarası. 3 yetişkin + 2 çocuğa kadar konaklama.',
        },
        intro: 'Kalabalık aileler için iki ayrı yatak odası ve iki banyo. Superior Aile Odaları, sabah telaşını paylaşmak zorunda kalmayacağınız bir düzen sunuyor.',
        body: 'İki yatak odası birbirinden bağımsız; iki banyo sabah ve akşam hazırlıklarını kolaylaştırıyor. Ortak alan, aileyi gün sonunda bir araya getirecek genişlikte.',
        specs: ['48 m²', '3 yetişkin + 2 çocuk veya 4 yetişkin + 1 çocuk', 'Deniz veya yandan deniz manzarası', '2 yatak odası', '2 banyo'],
      },
      'rooms/deluxe-family-room': {
        meta: {
          title: 'Deluxe Aile Odası',
          description: '72 m² Deluxe Aile Odası: iki yatak odası, oturma odası, mini mutfak ve deniz manzarası. Kalabalık aileler için en geniş oda tipi.',
        },
        intro: 'Otelin en geniş oda tipi. İki yatak odası, ayrı oturma odası ve mini mutfağıyla Deluxe Aile Odaları, uzun konaklamalar için tasarlandı.',
        body: 'Mini mutfak, küçük çocuklu aileler için gün içinde hazırlık yapma imkânı veriyor. Oturma odası yatak odalarından ayrı; akşam saatlerinde ortak alan olarak kullanılabiliyor.',
        specs: ['72 m²', '3 yetişkin + 4 çocuk veya 4 yetişkin + 3 çocuk', 'Deniz manzarası', '2 yatak odası', 'Oturma odası ve mini mutfak'],
      },
    },
  },
  en: {
    eyebrow: 'Rooms',
    related: 'Other rooms',
    imageWord: 'photo',
    rooms: {
      'rooms/standard-room': {
        meta: {
          title: 'Standard Room',
          description: '24 m² Standard Room: balcony with garden or sea view. Suitable for 2 adults + 1 child or 3 adults.',
        },
        intro: 'A simple layout, a generous balcony and a view that changes through the day. Standard Rooms offer the essential comfort of a holiday in an understated design.',
        body: 'A wide glass front opening onto the balcony brings natural light into the room all day. The sleeping area and the seating area share one space, arranged so that nothing gets in the way.',
        specs: ['24 m²', '2 adults + 1 child or 3 adults', 'Garden, side sea or sea view', '1 bathroom'],
      },
      'rooms/family-suite': {
        meta: {
          title: 'Family Suite',
          description: '38 m² Family Suite: two bedrooms, a balcony with jacuzzi and sea view. A family suite for 2 adults + 2 children.',
        },
        intro: 'With two separate bedrooms and a balcony with a jacuzzi, the Family Suite gives the family both a shared space and a corner of their own. All suites have sea views.',
        body: 'The jacuzzi on the balcony can be enjoyed in the evening, facing the sun setting over the sea. The balcony seating leaves enough room for an evening for two.',
        specs: ['38 m²', '2 adults + 2 children or 3 adults + 1 child', 'Sea view', '2 bedrooms', 'Balcony with jacuzzi'],
      },
      'rooms/superior-family-room': {
        meta: {
          title: 'Superior Family Room',
          description: '48 m² Superior Family Room: two bedrooms, two bathrooms and sea view. Sleeps up to 3 adults + 2 children.',
        },
        intro: 'Two separate bedrooms and two bathrooms for larger families. Superior Family Rooms offer a layout where nobody has to share the morning rush.',
        body: 'The two bedrooms are independent of each other; two bathrooms make the morning and evening routines easier. The shared space is wide enough to bring the family together at the end of the day.',
        specs: ['48 m²', '3 adults + 2 children or 4 adults + 1 child', 'Sea or side sea view', '2 bedrooms', '2 bathrooms'],
      },
      'rooms/deluxe-family-room': {
        meta: {
          title: 'Deluxe Family Room',
          description: '72 m² Deluxe Family Room: two bedrooms, living room, kitchenette and sea view. The largest room type, for bigger families.',
        },
        intro: 'The largest room type in the hotel. With two bedrooms, a separate living room and a kitchenette, Deluxe Family Rooms are designed for longer stays.',
        body: 'The kitchenette lets families with small children prepare things during the day. The living room is separate from the bedrooms and serves as a shared space in the evening.',
        specs: ['72 m²', '3 adults + 4 children or 4 adults + 3 children', 'Sea view', '2 bedrooms', 'Living room and kitchenette'],
      },
    },
  },
  de: {
    eyebrow: 'Zimmer',
    related: 'Weitere Zimmer',
    imageWord: 'Foto',
    rooms: {
      'rooms/standard-room': {
        meta: {
          title: 'Standardzimmer',
          description: '24 m² Standardzimmer: Balkon mit Garten- oder Meerblick. Für 2 Erwachsene + 1 Kind oder 3 Erwachsene.',
        },
        intro: 'Eine klare Aufteilung, ein großzügiger Balkon und ein Ausblick, der sich im Lauf des Tages verändert. Die Standardzimmer bieten den Grundkomfort des Urlaubs in schlichtem Design.',
        body: 'Die breite Glasfront zum Balkon lässt den ganzen Tag natürliches Licht ins Zimmer. Schlaf- und Sitzbereich teilen sich einen Raum und sind so angeordnet, dass nichts im Weg steht.',
        specs: ['24 m²', '2 Erwachsene + 1 Kind oder 3 Erwachsene', 'Garten-, seitlicher Meer- oder Meerblick', '1 Bad'],
      },
      'rooms/family-suite': {
        meta: {
          title: 'Familiensuite',
          description: '38 m² Familiensuite: zwei Schlafzimmer, Balkon mit Whirlpool und Meerblick. Familiensuite für 2 Erwachsene + 2 Kinder.',
        },
        intro: 'Mit zwei getrennten Schlafzimmern und einem Balkon mit Whirlpool lässt die Familiensuite der Familie sowohl einen gemeinsamen Bereich als auch eine eigene Ecke. Alle Suiten haben Meerblick.',
        body: 'Der Whirlpool auf dem Balkon lässt sich abends mit Blick auf die über dem Meer untergehende Sonne nutzen. Die Sitzgruppe auf dem Balkon bietet genug Platz für einen Abend zu zweit.',
        specs: ['38 m²', '2 Erwachsene + 2 Kinder oder 3 Erwachsene + 1 Kind', 'Meerblick', '2 Schlafzimmer', 'Balkon mit Whirlpool'],
      },
      'rooms/superior-family-room': {
        meta: {
          title: 'Superior-Familienzimmer',
          description: '48 m² Superior-Familienzimmer: zwei Schlafzimmer, zwei Bäder und Meerblick. Für bis zu 3 Erwachsene + 2 Kinder.',
        },
        intro: 'Zwei getrennte Schlafzimmer und zwei Bäder für größere Familien. Die Superior-Familienzimmer bieten eine Aufteilung, in der niemand die morgendliche Hektik teilen muss.',
        body: 'Die beiden Schlafzimmer sind voneinander unabhängig; zwei Bäder erleichtern die Vorbereitungen am Morgen und am Abend. Der gemeinsame Bereich ist groß genug, um die Familie am Ende des Tages zusammenzubringen.',
        specs: ['48 m²', '3 Erwachsene + 2 Kinder oder 4 Erwachsene + 1 Kind', 'Meer- oder seitlicher Meerblick', '2 Schlafzimmer', '2 Bäder'],
      },
      'rooms/deluxe-family-room': {
        meta: {
          title: 'Deluxe-Familienzimmer',
          description: '72 m² Deluxe-Familienzimmer: zwei Schlafzimmer, Wohnzimmer, Kochnische und Meerblick. Der größte Zimmertyp für große Familien.',
        },
        intro: 'Der größte Zimmertyp des Hotels. Mit zwei Schlafzimmern, separatem Wohnzimmer und Kochnische sind die Deluxe-Familienzimmer für längere Aufenthalte gedacht.',
        body: 'Die Kochnische gibt Familien mit kleinen Kindern die Möglichkeit, tagsüber etwas zuzubereiten. Das Wohnzimmer ist von den Schlafzimmern getrennt und dient abends als gemeinsamer Bereich.',
        specs: ['72 m²', '3 Erwachsene + 4 Kinder oder 4 Erwachsene + 3 Kinder', 'Meerblick', '2 Schlafzimmer', 'Wohnzimmer und Kochnische'],
      },
    },
  },
  ru: {
    eyebrow: 'Номера',
    related: 'Другие номера',
    imageWord: 'фото',
    rooms: {
      'rooms/standard-room': {
        meta: {
          title: 'Стандартный номер',
          description: 'Стандартный номер 24 м²: балкон с видом на сад или море. Для 2 взрослых + 1 ребёнка или 3 взрослых.',
        },
        intro: 'Лаконичная планировка, просторный балкон и вид, меняющийся в течение дня. Стандартные номера предлагают базовый комфорт отдыха в сдержанном дизайне.',
        body: 'Широкое остекление с выходом на балкон наполняет номер естественным светом весь день. Спальная зона и зона отдыха расположены в одном пространстве так, чтобы ничто не мешало движению.',
        specs: ['24 м²', '2 взрослых + 1 ребёнок или 3 взрослых', 'Вид на сад, боковой вид на море или вид на море', '1 ванная'],
      },
      'rooms/family-suite': {
        meta: {
          title: 'Семейный люкс',
          description: 'Семейный люкс 38 м²: две спальни, балкон с джакузи и вид на море. Для 2 взрослых + 2 детей.',
        },
        intro: 'Две отдельные спальни и балкон с джакузи: семейный люкс оставляет семье и общее пространство, и собственный уголок каждому. Все люксы с видом на море.',
        body: 'Джакузи на балконе можно принимать вечером, глядя на закат над морем. Мебель на балконе оставляет достаточно места для вечера вдвоём.',
        specs: ['38 м²', '2 взрослых + 2 ребёнка или 3 взрослых + 1 ребёнок', 'Вид на море', '2 спальни', 'Балкон с джакузи'],
      },
      'rooms/superior-family-room': {
        meta: {
          title: 'Семейный номер Супериор',
          description: 'Семейный номер Супериор 48 м²: две спальни, две ванные и вид на море. До 3 взрослых + 2 детей.',
        },
        intro: 'Две отдельные спальни и две ванные для больших семей. Семейные номера Супериор предлагают планировку, при которой утреннюю суету не придётся делить ни с кем.',
        body: 'Две спальни независимы друг от друга; две ванные упрощают утренние и вечерние сборы. Общая зона достаточно просторна, чтобы собрать семью в конце дня.',
        specs: ['48 м²', '3 взрослых + 2 ребёнка или 4 взрослых + 1 ребёнок', 'Вид на море или боковой вид на море', '2 спальни', '2 ванные'],
      },
      'rooms/deluxe-family-room': {
        meta: {
          title: 'Семейный номер Делюкс',
          description: 'Семейный номер Делюкс 72 м²: две спальни, гостиная, мини-кухня и вид на море. Самый просторный номер для больших семей.',
        },
        intro: 'Самый просторный тип номера в отеле. Две спальни, отдельная гостиная и мини-кухня: семейные номера Делюкс созданы для длительного отдыха.',
        body: 'Мини-кухня позволяет семьям с маленькими детьми готовить в течение дня. Гостиная отделена от спален и вечером служит общим пространством.',
        specs: ['72 м²', '3 взрослых + 4 ребёнка или 4 взрослых + 3 ребёнка', 'Вид на море', '2 спальни', 'Гостиная и мини-кухня'],
      },
    },
  },
};

const SLIDES = 3;

/**
 * kaeo dizilimi: hero → intro → body_column → media_slider → related. Ortak kurucu;
 * restoran/bar detayları da (venues.ts) aynı diziyi kullanır.
 */
export function detailBlocks(opts: {
  eyebrow: string;
  title: string;
  heroAlt: string;
  dir: string;
  intro: string;
  paragraphs: string[];
  specs?: string[];
  imageWord: string;
  related: { title: string; items: { page: PageKey; label: string; media: { id: string; alt: string } }[] };
}): Block[] {
  return [
    {
      type: 'hero',
      eyebrow: opts.eyebrow,
      titleLines: [opts.title],
      media: { id: `${opts.dir}/cover`, alt: opts.heroAlt },
    },
    { type: 'intro', text: opts.intro, wide: true },
    { type: 'body_column', paragraphs: opts.paragraphs, specs: opts.specs },
    {
      type: 'media_slider',
      images: Array.from({ length: SLIDES }, (_, i) => ({
        id: `${opts.dir}/${String(i + 1).padStart(2, '0')}`,
        alt: `${opts.title} — ${opts.imageWord} ${i + 1}`,
      })),
    },
    { type: 'related', title: opts.related.title, items: opts.related.items },
  ];
}

function build(key: RoomKey, locale: Locale): PageContent {
  const t = texts[locale];
  const room = t.rooms[key];
  const title = routes[key].label[locale];
  return {
    meta: room.meta,
    blocks: detailBlocks({
      eyebrow: t.eyebrow,
      title,
      heroAlt: title,
      dir: ROOM_DIR[key],
      intro: room.intro,
      paragraphs: [room.body],
      specs: room.specs,
      imageWord: t.imageWord,
      related: {
        title: t.related,
        items: ROOM_KEYS.filter((k) => k !== key).map((k) => ({
          page: k,
          label: routes[k].label[locale],
          media: { id: `${ROOM_DIR[k]}/cover`, alt: '' },
        })),
      },
    }),
  };
}

export const roomDetails: Record<RoomKey, LocalizedPage> = Object.fromEntries(
  ROOM_KEYS.map((key) => [
    key,
    Object.fromEntries((Object.keys(texts) as Locale[]).map((locale) => [locale, build(key, locale)])) as LocalizedPage,
  ]),
) as Record<RoomKey, LocalizedPage>;
