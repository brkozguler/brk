import type { Locale } from '@/i18n/config';
import { routes, type PageKey } from '@/i18n/routes';
import type { GalleryGridItem, LocalizedPage, PageContent, PageMeta } from '../types';
import { detailBlocks } from './room-details';

/**
 * Restoranlar ve Barlar — kullanıcı kararı (2026-10-11): Konaklama sayfasının şablonu
 * (slim hero → breadcrumb → intro → iki kolonlu Vogue kartları); kartlar detay sayfalarına gider.
 * Detaylar: Mākena /real-estate/kaeo şablonu (`detailBlocks`): hero → intro (metnin ilk cümlesi)
 * → gövde (kalanı + ✦ özellikler) → slider → diğer restoranlar/barlar.
 * TR metinler ARCANUS-CONTENT-TR §5 ve §6 (⚠️ işaretli cümleler alınmadı); özellik satırı
 * metinlerdeki bilgilerden (tür · öğün · yer). EN/DE/RU çeviri editör kontrolü bekliyor.
 * Görseller yer tutucu: assets/images/{restaurants,bars}/<ad>/{cover,01..03}.jpg.
 */

interface VenueCard {
  title: string;
  text: string;
  specs: string[];
}

interface VenuePageText {
  meta: PageMeta;
  hero: { eyebrow: string; title: string; alt: string };
  intro: string;
  cards: VenueCard[];
}

const RESTAURANT_IMAGES = ['main', 'turkish', 'italian', 'mexican', 'far-east', 'fish', 'aqua-snack'];
const BAR_IMAGES = ['lobby', 'coffee-house', 'pool', 'beach', 'disco', 'aqua', 'patisserie', 'passion', 'pier'];
const RESTAURANT_KEYS: PageKey[] = RESTAURANT_IMAGES.map((n) => `restaurants/${n}` as PageKey);
const BAR_KEYS: PageKey[] = BAR_IMAGES.map((n) => `bars/${n}` as PageKey);

const RELATED: Record<Locale, { restaurants: string; bars: string; imageWord: string }> = {
  tr: { restaurants: 'Diğer restoranlar', bars: 'Diğer barlar', imageWord: 'görsel' },
  en: { restaurants: 'Other restaurants', bars: 'Other bars', imageWord: 'photo' },
  de: { restaurants: 'Weitere Restaurants', bars: 'Weitere Bars', imageWord: 'Foto' },
  ru: { restaurants: 'Другие рестораны', bars: 'Другие бары', imageWord: 'фото' },
};

const restaurantTexts: Record<Locale, VenuePageText> = {
  tr: {
    meta: {
      title: 'Restoranlar',
      description:
        'Açık büfe Ana Restaurant ve Türk, İtalyan, Meksika, Uzak Doğu, balık à la carte restoranları. Havuz başında Aqua Snack.',
    },
    hero: { eyebrow: 'Gastronomi', title: 'Yedi restoran, yedi sofra', alt: 'Arcanus Hotels Sorgun restoranları' },
    intro:
      "Günün her öğününde açık olan Ana Restaurant'ın yanında beş à la carte restoran ve havuz başı snack noktası var. Akşam yemeğinizi her gün başka bir mutfakta planlayabilirsiniz.",
    cards: [
      {
        title: 'Ana Restaurant',
        text: 'Kahvaltı, öğle ve akşam yemeğinde açık büfe hizmeti veriyor. Sıcak ve soğuk seçenekler, salata barı, tatlı bölümü ve canlı pişirme istasyonlarıyla gün boyu geniş bir seçki sunuyor.',
        specs: ['Açık büfe', 'Kahvaltı · öğle · akşam'],
      },
      {
        title: "Türk A'la Carte",
        text: 'Türk mutfağının köklü lezzetlerini Akdeniz akşamlarının sıcak atmosferiyle buluşturuyor. Açık alanda, özenli bir akşam yemeği deneyimi sunuyor.',
        specs: ['À la carte', 'Akşam yemeği', 'Açık alan'],
      },
      {
        title: "İtalyan A'la Carte",
        text: 'İtalyan mutfağının sevilen tatlarını zarif bir atmosferde sunuyor. Açık ve kapalı alan seçenekleriyle hava durumundan bağımsız bir akşam yemeği imkânı veriyor.',
        specs: ['À la carte', 'Akşam yemeği', 'Açık ve kapalı alan'],
      },
      {
        title: "Meksika A'la Carte",
        text: 'Meksika mutfağının karakteristik lezzetlerini enerjik bir akşam atmosferiyle buluşturuyor. Baharatlı ve bol çeşitli menüsüyle tatile farklı bir gastronomi deneyimi katıyor.',
        specs: ['À la carte', 'Akşam yemeği'],
      },
      {
        title: "Uzakdoğu A'la Carte",
        text: 'Uzak Doğu mutfağının özgün tatlarını açık havanın ferahlığıyla buluşturuyor. Wok, noodle ve sushi ağırlıklı menüsüyle alışılmışın dışında bir akşam sunuyor.',
        specs: ['À la carte', 'Akşam yemeği', 'Açık hava'],
      },
      {
        title: "Balık A'la Carte",
        text: "Deniz ürünlerini Akdeniz'in açık hava atmosferiyle buluşturuyor. Günün balığı ve meze seçkisiyle sahile yakın, ferah bir akşam yemeği deneyimi sağlıyor.",
        specs: ['À la carte', 'Akşam yemeği', 'Sahile yakın'],
      },
      {
        title: 'Aqua Snack',
        text: 'Havuz keyfine lezzetli bir mola veriyor. Gün ortasında yerel ve uluslararası à la carte seçenekleriyle tatilin ritmini kesmeden atıştırma imkânı sunuyor.',
        specs: ['À la carte', 'Öğle', 'Havuz başı'],
      },
    ],
  },
  en: {
    meta: {
      title: 'Restaurants',
      description:
        'The open-buffet Main Restaurant and Turkish, Italian, Mexican, Far Eastern and fish à la carte restaurants. Aqua Snack by the pool.',
    },
    hero: { eyebrow: 'Dining', title: 'Seven restaurants, seven tables', alt: 'Restaurants at Arcanus Hotels Sorgun' },
    intro:
      'Alongside the Main Restaurant, open for every meal of the day, there are five à la carte restaurants and a poolside snack point. You can plan dinner in a different kitchen every day.',
    cards: [
      {
        title: 'Main Restaurant',
        text: 'Open buffet at breakfast, lunch and dinner. Hot and cold dishes, a salad bar, a dessert section and live cooking stations offer a wide selection all day long.',
        specs: ['Open buffet', 'Breakfast · lunch · dinner'],
      },
      {
        title: 'Turkish À la Carte',
        text: 'Brings the deep-rooted flavours of Turkish cuisine together with the warm atmosphere of Mediterranean evenings. A carefully prepared dinner in the open air.',
        specs: ['À la carte', 'Dinner', 'Open air'],
      },
      {
        title: 'Italian À la Carte',
        text: 'Serves the much-loved tastes of Italian cuisine in an elegant setting. Indoor and outdoor seating make dinner possible whatever the weather.',
        specs: ['À la carte', 'Dinner', 'Indoor & outdoor'],
      },
      {
        title: 'Mexican À la Carte',
        text: 'Pairs the characteristic flavours of Mexican cuisine with a lively evening atmosphere. A spicy, varied menu adds a different culinary experience to the holiday.',
        specs: ['À la carte', 'Dinner'],
      },
      {
        title: 'Far East À la Carte',
        text: 'Brings the distinctive tastes of the Far East together with the freshness of the open air. A menu built around wok dishes, noodles and sushi makes for an evening out of the ordinary.',
        specs: ['À la carte', 'Dinner', 'Open air'],
      },
      {
        title: 'Fish À la Carte',
        text: 'Seafood in the open-air atmosphere of the Mediterranean. The catch of the day and a selection of meze make for a relaxed dinner close to the beach.',
        specs: ['À la carte', 'Dinner', 'Near the beach'],
      },
      {
        title: 'Aqua Snack',
        text: 'A tasty break from the pool. Local and international à la carte options at midday let you snack without breaking the rhythm of the holiday.',
        specs: ['À la carte', 'Lunch', 'Poolside'],
      },
    ],
  },
  de: {
    meta: {
      title: 'Restaurants',
      description:
        'Das Hauptrestaurant mit offenem Buffet sowie türkische, italienische, mexikanische, fernöstliche und Fisch-À-la-carte-Restaurants. Aqua Snack am Pool.',
    },
    hero: { eyebrow: 'Gastronomie', title: 'Sieben Restaurants, sieben Tafeln', alt: 'Restaurants im Arcanus Hotels Sorgun' },
    intro:
      'Neben dem Hauptrestaurant, das zu jeder Mahlzeit des Tages geöffnet ist, gibt es fünf À-la-carte-Restaurants und einen Snackpunkt am Pool. Das Abendessen lässt sich jeden Tag in einer anderen Küche planen.',
    cards: [
      {
        title: 'Hauptrestaurant',
        text: 'Offenes Buffet zum Frühstück, Mittag- und Abendessen. Warme und kalte Gerichte, Salatbar, Dessertbereich und Live-Cooking-Stationen bieten den ganzen Tag eine große Auswahl.',
        specs: ['Offenes Buffet', 'Frühstück · Mittag · Abend'],
      },
      {
        title: 'Türkisches À-la-carte',
        text: 'Verbindet die traditionsreichen Aromen der türkischen Küche mit der warmen Atmosphäre mediterraner Abende. Ein sorgfältig zubereitetes Abendessen im Freien.',
        specs: ['À la carte', 'Abendessen', 'Im Freien'],
      },
      {
        title: 'Italienisches À-la-carte',
        text: 'Serviert die beliebten Geschmäcker der italienischen Küche in elegantem Ambiente. Innen- und Außenbereich machen das Abendessen bei jedem Wetter möglich.',
        specs: ['À la carte', 'Abendessen', 'Innen & außen'],
      },
      {
        title: 'Mexikanisches À-la-carte',
        text: 'Vereint die charakteristischen Aromen der mexikanischen Küche mit einer lebhaften Abendstimmung. Die würzige, abwechslungsreiche Karte bringt eine andere kulinarische Erfahrung in den Urlaub.',
        specs: ['À la carte', 'Abendessen'],
      },
      {
        title: 'Fernöstliches À-la-carte',
        text: 'Bringt die eigenständigen Aromen Fernost mit der Frische der freien Luft zusammen. Eine Karte rund um Wok, Nudeln und Sushi sorgt für einen Abend abseits des Gewohnten.',
        specs: ['À la carte', 'Abendessen', 'Im Freien'],
      },
      {
        title: 'Fisch-À-la-carte',
        text: 'Meeresfrüchte in der Open-Air-Atmosphäre des Mittelmeers. Fang des Tages und eine Auswahl an Meze für ein entspanntes Abendessen in Strandnähe.',
        specs: ['À la carte', 'Abendessen', 'Strandnah'],
      },
      {
        title: 'Aqua Snack',
        text: 'Eine leckere Pause vom Pool. Lokale und internationale À-la-carte-Optionen am Mittag, ohne den Rhythmus des Urlaubs zu unterbrechen.',
        specs: ['À la carte', 'Mittag', 'Am Pool'],
      },
    ],
  },
  ru: {
    meta: {
      title: 'Рестораны',
      description:
        'Главный ресторан со шведским столом и рестораны à la carte: турецкий, итальянский, мексиканский, дальневосточный и рыбный. Aqua Snack у бассейна.',
    },
    hero: { eyebrow: 'Гастрономия', title: 'Семь ресторанов, семь столов', alt: 'Рестораны Arcanus Hotels Sorgun' },
    intro:
      'Помимо Главного ресторана, открытого на каждый приём пищи, есть пять ресторанов à la carte и снэк-бар у бассейна. Ужин можно планировать каждый день на новой кухне.',
    cards: [
      {
        title: 'Главный ресторан',
        text: 'Шведский стол на завтрак, обед и ужин. Горячие и холодные блюда, салат-бар, десерты и станции живой кухни — широкий выбор в течение всего дня.',
        specs: ['Шведский стол', 'Завтрак · обед · ужин'],
      },
      {
        title: 'Турецкий à la carte',
        text: 'Соединяет глубокие вкусы турецкой кухни с тёплой атмосферой средиземноморских вечеров. Тщательно приготовленный ужин на открытом воздухе.',
        specs: ['À la carte', 'Ужин', 'На открытом воздухе'],
      },
      {
        title: 'Итальянский à la carte',
        text: 'Любимые вкусы итальянской кухни в элегантной обстановке. Залы в помещении и на воздухе позволяют поужинать при любой погоде.',
        specs: ['À la carte', 'Ужин', 'В помещении и на воздухе'],
      },
      {
        title: 'Мексиканский à la carte',
        text: 'Характерные вкусы мексиканской кухни в энергичной вечерней атмосфере. Острое и разнообразное меню добавляет отпуску новый гастрономический опыт.',
        specs: ['À la carte', 'Ужин'],
      },
      {
        title: 'Дальневосточный à la carte',
        text: 'Самобытные вкусы Дальнего Востока в свежести открытого воздуха. Меню на основе вока, лапши и суши — вечер вне привычного.',
        specs: ['À la carte', 'Ужин', 'На открытом воздухе'],
      },
      {
        title: 'Рыбный à la carte',
        text: 'Морепродукты в атмосфере Средиземноморья под открытым небом. Улов дня и подборка мезе — спокойный ужин рядом с пляжем.',
        specs: ['À la carte', 'Ужин', 'У пляжа'],
      },
      {
        title: 'Aqua Snack',
        text: 'Вкусная пауза у бассейна. Местные и международные блюда à la carte в середине дня — перекус, не нарушающий ритм отдыха.',
        specs: ['À la carte', 'Обед', 'У бассейна'],
      },
    ],
  },
};

const barTexts: Record<Locale, VenuePageText> = {
  tr: {
    meta: {
      title: 'Barlar',
      description: "Lobi Bar'dan İskele Bar'a dokuz ayrı bar. Kahve, kokteyl, dondurma ve gece eğlencesi gün boyu açık.",
    },
    hero: { eyebrow: 'Barlar', title: 'Dokuz bar, gün boyu', alt: 'Arcanus Hotels Sorgun barları' },
    intro:
      'Lobiden sahile, havuz başından iskeleye kadar dokuz ayrı noktada içecek servisi var. Her biri günün farklı bir saatine ve farklı bir ritme göre kurgulandı.',
    cards: [
      {
        title: 'Lobi Bar',
        text: 'Otelin buluşma noktalarından biri. Günün her saatinde yerli ve yabancı alkollü ve alkolsüz içecek seçenekleriyle keyifli bir mola sunuyor.',
        specs: ['Gün boyu', 'Lobi'],
      },
      {
        title: 'Arcanus Kahve Evi',
        text: 'Kahve molalarını günün keyifli anlarına dönüştürüyor. Farklı kahve çeşitleriyle sakin ve sıcak bir buluşma noktası sunuyor.',
        specs: ['Kahve', 'Gün boyu'],
      },
      {
        title: 'Havuz Bar',
        text: 'Havuz başındaki tatil ritmine eşlik ediyor. Sıcak ve soğuk içeceklerin yanı sıra şarap ve bira seçenekleriyle günün ferahlatıcı molalarına ev sahipliği yapıyor.',
        specs: ['Havuz başı', 'Şarap · bira'],
      },
      {
        title: 'Sahil Bar',
        text: 'Deniz ve güneşle geçen anlara eşlik ediyor. Yerli ve yabancı alkollü ve alkolsüz içecek seçenekleriyle sahil keyfine ferahlatıcı bir mola katıyor.',
        specs: ['Sahil', 'Alkollü · alkolsüz'],
      },
      {
        title: 'Disco Bar',
        text: 'Gecenin enerjisine eşlik ediyor. Yerli ve yabancı alkollü ve alkolsüz içecek seçenekleriyle tatil eğlencesini geceye taşıyor.',
        specs: ['Gece', 'Alkollü · alkolsüz'],
      },
      {
        title: 'Aqua Bar',
        text: 'Kaydırakların hemen yanında. Serinleten içecekler ve gün boyu dondurma seçenekleriyle su eğlencesine eşlik ediyor.',
        specs: ['Kaydırakların yanı', 'Dondurma'],
      },
      {
        title: 'Pastane',
        text: 'Tatlı ve tuzlu kurabiyeler, pasta çeşitleri, sıcak içecekler ve dondurma seçenekleriyle gün içinde keyifli bir lezzet molası sunuyor.',
        specs: ['Pasta · kurabiye', 'Sıcak içecek'],
      },
      {
        title: 'Passion Kokteyl Bar',
        text: 'Meyve püreleriyle hazırlanan alkollü ve alkolsüz kokteylleri ve dondurma seçenekleriyle güne renkli ve ferahlatıcı bir dokunuş katıyor.',
        specs: ['Kokteyl', 'Dondurma'],
      },
      {
        title: 'İskele Bar',
        text: "Akdeniz'in yanı başında geçirilen anlara eşlik ediyor. Sıcak ve soğuk içeceklerin yanı sıra şarap ve bira seçenekleri sunuyor.",
        specs: ['İskele', 'Şarap · bira'],
      },
    ],
  },
  en: {
    meta: {
      title: 'Bars',
      description:
        'Nine bars, from the Lobby Bar to the Pier Bar. Coffee, cocktails, ice cream and night-time entertainment, open all day.',
    },
    hero: { eyebrow: 'Bars', title: 'Nine bars, all day long', alt: 'Bars at Arcanus Hotels Sorgun' },
    intro:
      'From the lobby to the beach, from the poolside to the pier, drinks are served at nine different spots. Each is designed for a different hour of the day and a different rhythm.',
    cards: [
      {
        title: 'Lobby Bar',
        text: 'One of the meeting points of the hotel. Local and international alcoholic and soft drinks at any hour of the day make for a pleasant break.',
        specs: ['All day', 'Lobby'],
      },
      {
        title: 'Arcanus Coffee House',
        text: 'Turns coffee breaks into the pleasant moments of the day. A calm, warm meeting point with a range of coffees.',
        specs: ['Coffee', 'All day'],
      },
      {
        title: 'Pool Bar',
        text: 'Keeps pace with the holiday rhythm by the pool. Hot and cold drinks as well as wine and beer for the refreshing breaks of the day.',
        specs: ['Poolside', 'Wine · beer'],
      },
      {
        title: 'Beach Bar',
        text: 'Accompanies the hours spent with sea and sun. Local and international alcoholic and soft drinks add a refreshing break to the beach.',
        specs: ['Beach', 'Alcoholic · soft drinks'],
      },
      {
        title: 'Disco Bar',
        text: 'Keeps up with the energy of the night. Local and international alcoholic and soft drinks carry the holiday fun into the evening.',
        specs: ['Night', 'Alcoholic · soft drinks'],
      },
      {
        title: 'Aqua Bar',
        text: 'Right next to the slides. Cooling drinks and ice cream all day long accompany the fun in the water.',
        specs: ['By the slides', 'Ice cream'],
      },
      {
        title: 'Patisserie',
        text: 'Sweet and savoury biscuits, cakes, hot drinks and ice cream for a pleasant break during the day.',
        specs: ['Cakes · biscuits', 'Hot drinks'],
      },
      {
        title: 'Passion Cocktail Bar',
        text: 'Alcoholic and non-alcoholic cocktails made with fruit purées, plus ice cream, add a colourful and refreshing touch to the day.',
        specs: ['Cocktails', 'Ice cream'],
      },
      {
        title: 'Pier Bar',
        text: 'Accompanies the moments spent right beside the Mediterranean. Hot and cold drinks as well as wine and beer.',
        specs: ['Pier', 'Wine · beer'],
      },
    ],
  },
  de: {
    meta: {
      title: 'Bars',
      description:
        'Neun Bars von der Lobby Bar bis zur Steg-Bar. Kaffee, Cocktails, Eis und Abendunterhaltung, den ganzen Tag geöffnet.',
    },
    hero: { eyebrow: 'Bars', title: 'Neun Bars, den ganzen Tag', alt: 'Bars im Arcanus Hotels Sorgun' },
    intro:
      'Von der Lobby bis zum Strand, vom Pool bis zum Steg: An neun Stellen werden Getränke serviert. Jede ist auf eine andere Tageszeit und einen anderen Rhythmus abgestimmt.',
    cards: [
      {
        title: 'Lobby Bar',
        text: 'Einer der Treffpunkte des Hotels. Lokale und internationale alkoholische und alkoholfreie Getränke zu jeder Tageszeit für eine angenehme Pause.',
        specs: ['Ganztägig', 'Lobby'],
      },
      {
        title: 'Arcanus Kaffeehaus',
        text: 'Macht Kaffeepausen zu den schönen Momenten des Tages. Ein ruhiger, warmer Treffpunkt mit verschiedenen Kaffeespezialitäten.',
        specs: ['Kaffee', 'Ganztägig'],
      },
      {
        title: 'Pool Bar',
        text: 'Begleitet den Urlaubsrhythmus am Pool. Warme und kalte Getränke sowie Wein und Bier für die erfrischenden Pausen des Tages.',
        specs: ['Am Pool', 'Wein · Bier'],
      },
      {
        title: 'Strandbar',
        text: 'Begleitet die Stunden mit Meer und Sonne. Lokale und internationale alkoholische und alkoholfreie Getränke für eine erfrischende Pause am Strand.',
        specs: ['Strand', 'Mit & ohne Alkohol'],
      },
      {
        title: 'Disco Bar',
        text: 'Begleitet die Energie der Nacht. Lokale und internationale alkoholische und alkoholfreie Getränke tragen den Urlaubsspaß in den Abend.',
        specs: ['Nachts', 'Mit & ohne Alkohol'],
      },
      {
        title: 'Aqua Bar',
        text: 'Direkt neben den Rutschen. Kühlende Getränke und den ganzen Tag Eis begleiten den Wasserspaß.',
        specs: ['An den Rutschen', 'Eis'],
      },
      {
        title: 'Patisserie',
        text: 'Süßes und salziges Gebäck, Kuchen, Heißgetränke und Eis für eine genussvolle Pause am Tag.',
        specs: ['Kuchen · Gebäck', 'Heißgetränke'],
      },
      {
        title: 'Passion Cocktailbar',
        text: 'Cocktails mit und ohne Alkohol aus Fruchtpürees sowie Eis bringen eine bunte, erfrischende Note in den Tag.',
        specs: ['Cocktails', 'Eis'],
      },
      {
        title: 'Steg-Bar',
        text: 'Begleitet die Momente direkt am Mittelmeer. Warme und kalte Getränke sowie Wein und Bier.',
        specs: ['Steg', 'Wein · Bier'],
      },
    ],
  },
  ru: {
    meta: {
      title: 'Бары',
      description:
        'Девять баров — от лобби-бара до бара на пирсе. Кофе, коктейли, мороженое и вечерние развлечения весь день.',
    },
    hero: { eyebrow: 'Бары', title: 'Девять баров на весь день', alt: 'Бары Arcanus Hotels Sorgun' },
    intro:
      'От лобби до пляжа, от бассейна до пирса — напитки подают в девяти разных точках. Каждая задумана для своего часа дня и своего ритма.',
    cards: [
      {
        title: 'Лобби-бар',
        text: 'Одно из мест встречи в отеле. Местные и импортные алкогольные и безалкогольные напитки в любое время дня — для приятной паузы.',
        specs: ['Весь день', 'Лобби'],
      },
      {
        title: 'Кофейня Arcanus',
        text: 'Превращает кофейные паузы в приятные моменты дня. Спокойное и тёплое место встречи с разными видами кофе.',
        specs: ['Кофе', 'Весь день'],
      },
      {
        title: 'Бар у бассейна',
        text: 'Сопровождает ритм отдыха у бассейна. Горячие и холодные напитки, а также вино и пиво для освежающих пауз в течение дня.',
        specs: ['У бассейна', 'Вино · пиво'],
      },
      {
        title: 'Пляжный бар',
        text: 'Сопровождает часы, проведённые с морем и солнцем. Местные и импортные алкогольные и безалкогольные напитки — освежающая пауза на пляже.',
        specs: ['Пляж', 'Алкогольные · безалкогольные'],
      },
      {
        title: 'Диско-бар',
        text: 'Поддерживает энергию ночи. Местные и импортные алкогольные и безалкогольные напитки продолжают отпускное веселье вечером.',
        specs: ['Ночь', 'Алкогольные · безалкогольные'],
      },
      {
        title: 'Aqua Bar',
        text: 'Прямо рядом с горками. Прохладительные напитки и мороженое в течение всего дня сопровождают водные развлечения.',
        specs: ['У горок', 'Мороженое'],
      },
      {
        title: 'Кондитерская',
        text: 'Сладкое и солёное печенье, торты, горячие напитки и мороженое — приятная пауза в течение дня.',
        specs: ['Торты · печенье', 'Горячие напитки'],
      },
      {
        title: 'Коктейль-бар Passion',
        text: 'Алкогольные и безалкогольные коктейли на фруктовом пюре и мороженое добавляют дню яркости и свежести.',
        specs: ['Коктейли', 'Мороженое'],
      },
      {
        title: 'Бар на пирсе',
        text: 'Сопровождает моменты у самого Средиземного моря. Горячие и холодные напитки, а также вино и пиво.',
        specs: ['Пирс', 'Вино · пиво'],
      },
    ],
  },
};

interface VenueSet {
  texts: Record<Locale, VenuePageText>;
  dir: 'restaurants' | 'bars';
  images: string[];
  keys: PageKey[];
  heroImage: string;
}

const SETS: VenueSet[] = [
  { texts: restaurantTexts, dir: 'restaurants', images: RESTAURANT_IMAGES, keys: RESTAURANT_KEYS, heroImage: 'home/banner-full' },
  { texts: barTexts, dir: 'bars', images: BAR_IMAGES, keys: BAR_KEYS, heroImage: 'home/exp-pavilion' },
];

function buildVenuePage(set: VenueSet, locale: Locale): PageContent {
  const t = set.texts[locale];
  const items: GalleryGridItem[] = t.cards.map((card, i) => ({
    page: set.keys[i],
    label: card.title,
    media: { id: `${set.dir}/${set.images[i]}/cover`, alt: '' },
    detail: { text: card.text, specs: card.specs },
  }));
  return {
    meta: t.meta,
    blocks: [
      {
        type: 'hero',
        slim: true,
        eyebrow: t.hero.eyebrow,
        titleLines: [t.hero.title],
        media: { id: set.heroImage, alt: t.hero.alt },
      },
      { type: 'intro', text: t.intro, wide: true },
      { type: 'gallery_grid', columns: 2, items },
    ],
  };
}

/** İlk cümle intro, kalanı gövde; tek cümlelik metinde gövde boş kalır */
function splitLead(text: string): { lead: string; rest: string[] } {
  const m = text.match(/^([^]+?[.!?])\s+([^]+)$/);
  if (!m) return { lead: text, rest: [] };
  return { lead: m[1], rest: [m[2]] };
}

/** meta description: cümle sınırında ≤ 155 karakter */
function describe(text: string): string {
  if (text.length <= 155) return text;
  const cut = text.slice(0, 155);
  const end = cut.lastIndexOf('. ');
  return end > 60 ? cut.slice(0, end + 1) : `${cut.trimEnd()}…`;
}

function buildVenueDetail(set: VenueSet, index: number, locale: Locale): PageContent {
  const t = set.texts[locale];
  const card = t.cards[index];
  const key = set.keys[index];
  const title = routes[key].label[locale];
  const { lead, rest } = splitLead(card.text);
  const rel = RELATED[locale];
  return {
    meta: { title, description: describe(card.text) },
    blocks: detailBlocks({
      eyebrow: t.hero.eyebrow,
      title,
      heroAlt: title,
      dir: `${set.dir}/${set.images[index]}`,
      intro: lead,
      paragraphs: rest,
      specs: card.specs,
      imageWord: rel.imageWord,
      related: {
        title: rel[set.dir],
        items: set.keys
          .map((k, i) => ({ page: k, label: routes[k].label[locale], media: { id: `${set.dir}/${set.images[i]}/cover`, alt: '' } }))
          .filter((item) => item.page !== key),
      },
    }),
  };
}

const LOCALES = Object.keys(restaurantTexts) as Locale[];

function localized(build: (locale: Locale) => PageContent): LocalizedPage {
  return Object.fromEntries(LOCALES.map((locale) => [locale, build(locale)])) as LocalizedPage;
}

export const restaurants: LocalizedPage = localized((locale) => buildVenuePage(SETS[0], locale));
export const bars: LocalizedPage = localized((locale) => buildVenuePage(SETS[1], locale));

/** 7 restoran + 9 bar detayı — sayfa kayıt defterine yayılır */
export const venueDetails: Partial<Record<PageKey, LocalizedPage>> = Object.fromEntries(
  SETS.flatMap((set) => set.keys.map((key, i) => [key, localized((locale) => buildVenueDetail(set, i, locale))])),
);
