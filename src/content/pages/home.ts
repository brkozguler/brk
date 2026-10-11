import type { Block, LocalizedPage, PageMeta } from '../types';

/**
 * Ana sayfa — Mākena'nın 13 bloklu dizilimi (RE §16), Arcanus içeriğiyle.
 * Metinler önceki çalışmada karakter bütçesine göre yazılıp onaylandı
 * (ARCANUS-CONTENT-SPEC §02, 4 dil); bilgiler §05'teki doğrulanmış tesis bilgileriyle sınırlı.
 * Görseller şimdilik yer tutucu (assets/images/home); otelin fotoğrafları gelince
 * yalnızca dosyalar değişir.
 */

const IMG = {
  hero: 'home/hero-desktop',
  heroMobile: 'home/hero-mobile',
  bannerScale: 'home/banner-scale',
  storyLarge: 'home/story-large',
  storySmall: 'home/story-small',
  bannerFull: 'home/banner-full',
  featureRooms: 'home/feature-rooms',
  roomStandard: 'home/room-standart',
  roomFamilySuite: 'home/room-family-suite',
  roomSuperior: 'home/room-superior',
  roomDeluxe: 'home/room-deluxe',
  restMain: 'home/rest-main',
  restTurkish: 'home/rest-turkish',
  restItalian: 'home/rest-italian',
  restMexican: 'home/rest-mexican',
  restFarEast: 'home/rest-fareast',
  restFish: 'home/rest-fish',
  expPools: 'home/exp-pools',
  expKids: 'home/exp-kids',
  expActivities: 'home/exp-activities',
  expSpa: 'home/exp-spa',
  expPavilion: 'home/exp-pavilion',
  exploreRooms: 'home/explore-rooms',
  exploreRestaurants: 'home/explore-restaurants',
  exploreActivities: 'home/explore-activities',
  exploreContact: 'home/explore-contact',
} as const;

interface HomeText {
  meta: PageMeta;
  hero: { eyebrow: string; titleLines: string[]; subtitle: string; alt: string };
  intro: string;
  bannerScaleAlt: string;
  content: { eyebrow: string; title: string; text: string };
  story: { text: string; largeAlt: string; smallAlt: string };
  bannerFullAlt: string;
  feature: { eyebrow: string; title: string; text: string; cta: string; alt: string };
  rooms: { eyebrow: string; title: string; text: string; items: [string, string, string, string] };
  dining: { eyebrow: string; title: string; text: string; cta: string; items: [string, string, string, string, string, string] };
  experiences: { title: string; text: string; cta: string; items: [string, string, string, string, string] };
  explore: { title: string; items: [string, string, string, string] };
}

function build(t: HomeText): { meta: PageMeta; blocks: Block[] } {
  const [std, fam, sup, dlx] = t.rooms.items;
  const [main, turkish, italian, mexican, farEast, fish] = t.dining.items;
  const [pools, kids, activities, spa, pavilions] = t.experiences.items;
  const [exRooms, exRestaurants, exActivities, exContact] = t.explore.items;

  return {
    meta: t.meta,
    blocks: [
      {
        type: 'hero',
        eyebrow: t.hero.eyebrow,
        titleLines: t.hero.titleLines,
        subtitle: t.hero.subtitle,
        media: { id: IMG.hero, alt: t.hero.alt, mobileId: IMG.heroMobile, focal: { x: 0.5, y: 0.45 } },
      },
      { type: 'intro', text: t.intro, wide: true },
      { type: 'banner_scale', media: { id: IMG.bannerScale, alt: t.bannerScaleAlt } },
      { type: 'content', eyebrow: t.content.eyebrow, title: t.content.title, text: t.content.text },
      {
        type: 'storytelling',
        text: t.story.text,
        media: {
          large: { id: IMG.storyLarge, alt: t.story.largeAlt },
          small: { id: IMG.storySmall, alt: t.story.smallAlt },
        },
      },
      { type: 'spacer' },
      { type: 'spacer' },
      { type: 'banner_full', media: { id: IMG.bannerFull, alt: t.bannerFullAlt } },
      {
        type: 'feature5050',
        eyebrow: t.feature.eyebrow,
        title: t.feature.title,
        text: t.feature.text,
        link: { page: 'rooms', label: t.feature.cta },
        media: { id: IMG.featureRooms, alt: t.feature.alt },
        left: false,
        background: 'sand',
      },
      {
        type: 'card_carousel',
        variant: 'clamped',
        eyebrow: t.rooms.eyebrow,
        title: t.rooms.title,
        text: t.rooms.text,
        cards: [
          { title: std, media: { id: IMG.roomStandard, alt: std } },
          { title: fam, media: { id: IMG.roomFamilySuite, alt: fam } },
          { title: sup, media: { id: IMG.roomSuperior, alt: sup } },
          { title: dlx, media: { id: IMG.roomDeluxe, alt: dlx } },
        ],
      },
      {
        type: 'listings5050',
        eyebrow: t.dining.eyebrow,
        title: t.dining.title,
        text: t.dining.text,
        link: { page: 'restaurants', label: t.dining.cta },
        items: [
          { title: main, media: { id: IMG.restMain, alt: main } },
          { title: turkish, media: { id: IMG.restTurkish, alt: turkish } },
          { title: italian, media: { id: IMG.restItalian, alt: italian } },
          { title: mexican, media: { id: IMG.restMexican, alt: mexican } },
          { title: farEast, media: { id: IMG.restFarEast, alt: farEast } },
          { title: fish, media: { id: IMG.restFish, alt: fish } },
        ],
      },
      {
        type: 'card_carousel',
        variant: 'infinite',
        title: t.experiences.title,
        text: t.experiences.text,
        label: t.experiences.cta,
        cards: [
          { title: pools, page: 'pools', media: { id: IMG.expPools, alt: pools } },
          { title: kids, page: 'kids-club', media: { id: IMG.expKids, alt: kids } },
          { title: activities, page: 'activities', media: { id: IMG.expActivities, alt: activities } },
          { title: spa, page: 'spa', media: { id: IMG.expSpa, alt: spa } },
          { title: pavilions, page: 'pavilions', media: { id: IMG.expPavilion, alt: pavilions } },
        ],
      },
      {
        type: 'explore_more',
        title: t.explore.title,
        links: [
          { page: 'rooms', label: exRooms, media: { id: IMG.exploreRooms, alt: exRooms } },
          { page: 'restaurants', label: exRestaurants, media: { id: IMG.exploreRestaurants, alt: exRestaurants } },
          { page: 'activities', label: exActivities, media: { id: IMG.exploreActivities, alt: exActivities } },
          { page: 'contact', label: exContact, media: { id: IMG.exploreContact, alt: exContact } },
        ],
      },
    ],
  };
}

const tr: HomeText = {
  meta: {
    title: 'Arcanus Hotels Sorgun | Side Antalya Her Şey Dahil Otel',
    description:
      "Side Sorgun'da denize sıfır, çam ormanı içinde her şey dahil otel. Dört oda tipi, sekiz restoran, 7 kaydıraklı aqua havuzu ve çocuk kulübü.",
  },
  hero: {
    eyebrow: 'HOŞ GELDİNİZ',
    titleLines: ['Çamların denize', 'indiği yer'],
    subtitle: 'Side Sorgun’da, denize sıfır bir her şey dahil tatil',
    alt: 'Arcanus Hotels Sorgun — çam ormanının kumsala indiği kıyı',
  },
  intro:
    'Akdeniz’in turkuaz mavisiyle Sorgun’un çam ormanı burada buluşuyor. Arcanus Hotels Sorgun, denize sıfır konumunda, günü kendi temponuzda kurabileceğiniz bir tatil alanı sunuyor.',
  bannerScaleAlt: 'Havadan çekim: çam ormanı, otel ve kumsal aynı karede',
  content: {
    eyebrow: 'GENEL BAKIŞ',
    title: 'Çam ormanının kumsala indiği noktada, denize sıfır',
    text: 'Arcanus Hotels Sorgun, Side’nin Sorgun bölgesinde yer alıyor. Standart odalardan geniş aile suitlerine uzanan oda tipleri bahçeye ya da denize bakıyor; hepsi sade ve modern bir düzenle hazırlandı. Yüzme havuzları, su kaydırakları, çocuk kulübü, spa ve denize uzanan iskelesiyle otel, günü kendi temponuzda kurmanıza alan bırakıyor.',
  },
  story: {
    text: 'Sabah kahvaltısıyla başlayan gün, havuz başında ya da iskelenin ucunda uzun bir öğleden sonraya dönüşüyor. Akşam ise sofralar kuruluyor, müzik başlıyor. Her şey dahil konsept, planlamayı bırakıp tatile odaklanmanız için kurgulandı.',
    largeAlt: 'Kumsaldan otele bakış',
    smallAlt: 'İskele detayı, gün batımı',
  },
  bannerFullAlt: 'Deniz ve iskele, geniş açı',
  feature: {
    eyebrow: 'KONAKLAMA',
    title: 'Tatilin en konforlu hali',
    text: 'Standart odalardan 72 m²’lik Deluxe Aile Odalarına kadar dört farklı oda tipi var. Her birinde balkon, bahçe ya da deniz manzarası bulunuyor. Aile odalarında iki ayrı yatak odası, Family Suite’te jakuzili balkon yer alıyor.',
    cta: 'KEŞFET',
    alt: 'Deluxe Aile Odası, oturma alanı',
  },
  rooms: {
    eyebrow: 'ODALAR',
    title: 'Size uygun oda tipi',
    text: 'Dört oda tipi, 24 m²’den 72 m²’ye. Kapasite, manzara ve donanım farklarını karşılaştırın.',
    items: ['Standart Oda', 'Family Suite', 'Superior Aile Odası', 'Deluxe Aile Odası'],
  },
  dining: {
    eyebrow: 'GASTRONOMİ',
    title: 'Her akşam başka bir sofra',
    text: "Günün her öğününde açık olan Ana Restaurant'ın yanında beş à la carte restoran ve havuz başı snack noktası var. Akşam yemeğinizi her gün başka bir mutfakta planlayabilirsiniz.",
    cta: 'KEŞFET',
    items: ['Ana Restaurant', "Türk A'la Carte", "İtalyan A'la Carte", "Meksika A'la Carte", "Uzakdoğu A'la Carte", "Balık A'la Carte"],
  },
  experiences: {
    title: 'Keşfedilecek her şey burada',
    text: 'Havuzlardan çocuk kulübüne, spadan pavilyonlara — herkesin kendi tatilini kurabileceği geniş bir alan.',
    cta: 'KEŞFET',
    items: ['Yüzme Havuzları', 'Çocuk Kulübü', 'Aktivite & Eğlence', 'Spa', 'Pavilyon'],
  },
  explore: {
    title: 'Daha Fazlası',
    items: ['KONAKLAMA', 'RESTORANLAR', 'AKTİVİTELER', 'İLETİŞİM'],
  },
};

const en: HomeText = {
  meta: {
    title: 'Arcanus Hotels Sorgun | All-Inclusive Hotel in Side, Antalya',
    description:
      'Beachfront all-inclusive hotel in the pine forest of Side Sorgun. Four room types, eight restaurants, an aqua pool with 7 slides and a kids’ club.',
  },
  hero: {
    eyebrow: 'WELCOME',
    titleLines: ['Where the pines', 'meet the sea'],
    subtitle: 'A beachfront all-inclusive escape in Side Sorgun',
    alt: 'Arcanus Hotels Sorgun — where the pine forest meets the shore',
  },
  intro:
    'The turquoise of the Mediterranean meets the pine forest of Sorgun. Arcanus Hotels Sorgun sits right on the shore, leaving you room to set the pace of your own day.',
  bannerScaleAlt: 'Aerial view: pine forest, hotel and beach in one frame',
  content: {
    eyebrow: 'OVERVIEW',
    title: 'Where the pine forest reaches the sand, right on the sea',
    text: 'Arcanus Hotels Sorgun sits in the Sorgun district of Side. The room types, from standard rooms to spacious family suites, look onto the garden or the sea; all of them are laid out in a plain, modern way. With swimming pools, water slides, a kids’ club, a spa and a pier reaching into the sea, the hotel leaves you room to set your own pace.',
  },
  story: {
    text: 'The day begins with breakfast and turns into a long afternoon by the pool or at the end of the pier. In the evening the tables are set and the music starts. The all-inclusive concept is built so you can stop planning and focus on the holiday.',
    largeAlt: 'The hotel seen from the beach',
    smallAlt: 'The pier at sunset',
  },
  bannerFullAlt: 'The sea and the pier, wide angle',
  feature: {
    eyebrow: 'ACCOMMODATION',
    title: 'Comfort at its fullest',
    text: 'There are four room types, from standard rooms to the 72 m² Deluxe Family Rooms. Each has a balcony and a view of the garden or the sea. The family rooms have two separate bedrooms, and the Family Suite has a balcony with a jacuzzi.',
    cta: 'DISCOVER',
    alt: 'Deluxe Family Room, seating area',
  },
  rooms: {
    eyebrow: 'ROOMS',
    title: 'A room type that suits you',
    text: 'Four room types, from 24 m² to 72 m². Compare capacity, view and layout.',
    items: ['Standard Room', 'Family Suite', 'Superior Family Room', 'Deluxe Family Room'],
  },
  dining: {
    eyebrow: 'DINING',
    title: 'A different table every evening',
    text: 'Alongside the Main Restaurant, open for every meal of the day, there are five à la carte restaurants and a poolside snack point. Plan dinner in a different kitchen every evening.',
    cta: 'DISCOVER',
    items: ['Main Restaurant', 'Turkish À la Carte', 'Italian À la Carte', 'Mexican À la Carte', 'Far Eastern À la Carte', 'Fish À la Carte'],
  },
  experiences: {
    title: 'Everything there is to discover',
    text: 'From the pools to the kids’ club, from the spa to the pavilions — room enough for everyone to build their own holiday.',
    cta: 'DISCOVER',
    items: ['Swimming Pools', 'Kids’ Club', 'Activities & Entertainment', 'Spa', 'Pavilions'],
  },
  explore: {
    title: 'Explore More',
    items: ['ACCOMMODATION', 'RESTAURANTS', 'ACTIVITIES', 'CONTACT'],
  },
};

const de: HomeText = {
  meta: {
    title: 'Arcanus Hotels Sorgun | All-inclusive-Hotel in Side, Antalya',
    description:
      'All-inclusive-Hotel direkt am Strand im Pinienwald von Side Sorgun. Vier Zimmertypen, acht Restaurants, Aquapool mit 7 Rutschen und Kinderclub.',
  },
  hero: {
    eyebrow: 'WILLKOMMEN',
    titleLines: ['Wo die Pinien', 'das Meer treffen'],
    subtitle: 'All-inclusive direkt am Strand in Side Sorgun',
    alt: 'Arcanus Hotels Sorgun — wo der Pinienwald auf den Strand trifft',
  },
  intro:
    'Das Türkis des Mittelmeers trifft auf den Pinienwald von Sorgun. Arcanus Hotels Sorgun liegt direkt am Strand und lässt Ihnen Raum, Ihren Tag selbst zu gestalten.',
  bannerScaleAlt: 'Luftaufnahme: Pinienwald, Hotel und Strand in einem Bild',
  content: {
    eyebrow: 'ÜBERBLICK',
    title: 'Dort, wo der Pinienwald den Strand erreicht, direkt am Meer',
    text: 'Arcanus Hotels Sorgun liegt im Stadtteil Sorgun von Side. Die Zimmertypen, vom Standardzimmer bis zur geräumigen Familiensuite, blicken in den Garten oder auf das Meer; alle sind schlicht und modern eingerichtet. Mit Swimmingpools, Wasserrutschen, Kinderclub, Spa und einem Steg ins Meer lässt das Hotel Ihnen Raum für Ihren eigenen Rhythmus.',
  },
  story: {
    text: 'Der Tag beginnt mit dem Frühstück und wird zu einem langen Nachmittag am Pool oder am Ende des Stegs. Am Abend werden die Tische gedeckt, die Musik beginnt. Das All-inclusive-Konzept ist so angelegt, dass Sie das Planen lassen und sich auf den Urlaub konzentrieren.',
    largeAlt: 'Blick vom Strand auf das Hotel',
    smallAlt: 'Der Steg bei Sonnenuntergang',
  },
  bannerFullAlt: 'Meer und Steg, Weitwinkel',
  feature: {
    eyebrow: 'UNTERKUNFT',
    title: 'Der komfortabelste Urlaub',
    text: 'Es gibt vier Zimmertypen, vom Standardzimmer bis zum 72 m² großen Deluxe-Familienzimmer. Jedes hat einen Balkon und Garten- oder Meerblick. Die Familienzimmer haben zwei getrennte Schlafzimmer, die Family Suite einen Balkon mit Whirlpool.',
    cta: 'ENTDECKEN',
    alt: 'Deluxe-Familienzimmer, Sitzbereich',
  },
  rooms: {
    eyebrow: 'ZIMMER',
    title: 'Der passende Zimmertyp',
    text: 'Vier Zimmertypen, von 24 m² bis 72 m². Vergleichen Sie Belegung, Ausblick und Ausstattung.',
    items: ['Standardzimmer', 'Family Suite', 'Superior-Familienzimmer', 'Deluxe-Familienzimmer'],
  },
  dining: {
    eyebrow: 'GASTRONOMIE',
    title: 'Jeden Abend ein anderer Tisch',
    text: 'Neben dem Hauptrestaurant, das zu jeder Mahlzeit geöffnet ist, gibt es fünf À-la-carte-Restaurants und eine Snackstation am Pool. Planen Sie Ihr Abendessen jeden Tag in einer anderen Küche.',
    cta: 'ENTDECKEN',
    items: ['Hauptrestaurant', 'Türkisches À-la-carte', 'Italienisches À-la-carte', 'Mexikanisches À-la-carte', 'Fernöstliches À-la-carte', 'Fisch-À-la-carte'],
  },
  experiences: {
    title: 'Alles, was es zu entdecken gibt',
    text: 'Von den Pools bis zum Kinderclub, vom Spa bis zu den Pavillons — Raum genug, damit jeder seinen eigenen Urlaub gestaltet.',
    cta: 'ENTDECKEN',
    items: ['Swimmingpools', 'Kinderclub', 'Aktivität & Unterhaltung', 'Spa', 'Pavillons'],
  },
  explore: {
    title: 'Mehr entdecken',
    items: ['UNTERKUNFT', 'RESTAURANTS', 'AKTIVITÄTEN', 'KONTAKT'],
  },
};

const ru: HomeText = {
  meta: {
    title: 'Arcanus Hotels Sorgun | Отель «всё включено» в Сиде, Анталья',
    description:
      'Отель «всё включено» на первой линии в сосновом лесу Сиде Соргун. Четыре типа номеров, восемь ресторанов, аквабассейн с 7 горками и детский клуб.',
  },
  hero: {
    eyebrow: 'ДОБРО ПОЖАЛОВАТЬ',
    titleLines: ['Там, где сосны', 'выходят к морю'],
    subtitle: 'Отель «всё включено» на первой линии в Сиде',
    alt: 'Arcanus Hotels Sorgun — там, где сосновый лес выходит к берегу',
  },
  intro:
    'Бирюза Средиземного моря встречается с сосновым лесом Соргуна. Arcanus Hotels Sorgun расположен на первой линии и оставляет вам свободу выстроить день в своём ритме.',
  bannerScaleAlt: 'Вид сверху: сосновый лес, отель и пляж в одном кадре',
  content: {
    eyebrow: 'ОБЗОР',
    title: 'Там, где сосновый лес выходит к пляжу, у самого моря',
    text: 'Arcanus Hotels Sorgun расположен в районе Соргун города Сиде. Номера — от стандартных до просторных семейных сьютов — выходят в сад или на море; все оформлены просто и современно. Бассейны, водные горки, детский клуб, спа и пирс, уходящий в море, оставляют вам место, чтобы выстроить день в своём темпе.',
  },
  story: {
    text: 'День начинается с завтрака и превращается в долгий день у бассейна или на краю пирса. Вечером накрывают столы, начинается музыка. Концепция «всё включено» устроена так, чтобы вы перестали планировать и сосредоточились на отдыхе.',
    largeAlt: 'Вид на отель с пляжа',
    smallAlt: 'Пирс на закате',
  },
  bannerFullAlt: 'Море и пирс, широкий угол',
  feature: {
    eyebrow: 'РАЗМЕЩЕНИЕ',
    title: 'Отдых в самом удобном виде',
    text: 'Четыре типа номеров — от стандартных до делюкс-семейных площадью 72 м². В каждом есть балкон и вид на сад или на море. В семейных номерах две отдельные спальни, в Family Suite — балкон с джакузи.',
    cta: 'СМОТРЕТЬ',
    alt: 'Семейный номер Deluxe, зона отдыха',
  },
  rooms: {
    eyebrow: 'НОМЕРА',
    title: 'Подходящий вам номер',
    text: 'Четыре типа номеров, от 24 м² до 72 м². Сравните вместимость, вид и оснащение.',
    items: ['Стандартный номер', 'Family Suite', 'Семейный номер Superior', 'Семейный номер Deluxe'],
  },
  dining: {
    eyebrow: 'ГАСТРОНОМИЯ',
    title: 'Каждый вечер — новый стол',
    text: 'Помимо главного ресторана, открытого на каждый приём пищи, работают пять ресторанов à la carte и снек-точка у бассейна. Ужин можно планировать каждый день в другой кухне.',
    cta: 'СМОТРЕТЬ',
    items: ['Главный ресторан', 'Турецкий à la carte', 'Итальянский à la carte', 'Мексиканский à la carte', 'Дальневосточный à la carte', 'Рыбный à la carte'],
  },
  experiences: {
    title: 'Всё, что стоит открыть',
    text: 'От бассейнов до детского клуба, от спа до павильонов — достаточно места, чтобы каждый построил свой отдых.',
    cta: 'СМОТРЕТЬ',
    items: ['Бассейны', 'Детский клуб', 'Активности и развлечения', 'Спа', 'Павильоны'],
  },
  explore: {
    title: 'Больше о нас',
    items: ['РАЗМЕЩЕНИЕ', 'РЕСТОРАНЫ', 'АКТИВНОСТИ', 'КОНТАКТЫ'],
  },
};

export const home: LocalizedPage = {
  tr: build(tr),
  en: build(en),
  de: build(de),
  ru: build(ru),
};
