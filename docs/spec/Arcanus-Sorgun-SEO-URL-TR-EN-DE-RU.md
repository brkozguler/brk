# Arcanus Hotels Sorgun — SEO URL Yapısı

Ana alan adı: https://arcanushotelssorgun.com/

Bu belge önerilen yeni URL mimarisidir; mevcut adreslerin tam envanteri veya uygulanmış bir değişiklik değildir.

## Dil ve URL standardı

- Türkçe: `/tr/` altında Türkçe URL adları.
- İngilizce: `/en/` altında İngilizce URL adları.
- Almanca: `/de/` altında Almanca URL adları.
- Rusça: `/ru/` altında İngilizce URL adları.
- Rusça sayfaların içeriği Rusça kalır. İngilizce sayfalara yönlendirilmez; yalnızca URL adları İngilizceyle aynıdır.
- Aşağıdaki yolların başına ana alan adı eklenir.

Örnek Rusça sayfa: https://arcanushotelssorgun.com/ru/rooms/standard-room/

## Mevcut içeriklere dayalı önerilen sayfalar

| Sayfa | Türkçe | İngilizce | Almanca | Rusça |
|---|---|---|---|---|
| Ana sayfa | `/tr/` | `/en/` | `/de/` | `/ru/` |
| Konaklama | `/tr/konaklama/` | `/en/rooms/` | `/de/zimmer/` | `/ru/rooms/` |
| Standart oda | `/tr/konaklama/standart-oda/` | `/en/rooms/standard-room/` | `/de/zimmer/standardzimmer/` | `/ru/rooms/standard-room/` |
| Family Suite | `/tr/konaklama/family-suite/` | `/en/rooms/family-suite/` | `/de/zimmer/familiensuite/` | `/ru/rooms/family-suite/` |
| Deluxe aile odası | `/tr/konaklama/deluxe-aile-odasi/` | `/en/rooms/deluxe-family-room/` | `/de/zimmer/deluxe-familienzimmer/` | `/ru/rooms/deluxe-family-room/` |
| Superior aile odası | `/tr/konaklama/superior-aile-odasi/` | `/en/rooms/superior-family-room/` | `/de/zimmer/superior-familienzimmer/` | `/ru/rooms/superior-family-room/` |
| Restoranlar | `/tr/restoranlar/` | `/en/restaurants/` | `/de/restaurants/` | `/ru/restaurants/` |
| Aktivite ve eğlence | `/tr/aktivite-ve-eglence/` | `/en/activities-entertainment/` | `/de/aktivitaeten-unterhaltung/` | `/ru/activities-entertainment/` |
| Havuzlar | `/tr/havuzlar/` | `/en/pools/` | `/de/pools/` | `/ru/pools/` |
| Çocuk kulübü | `/tr/cocuk-kulubu/` | `/en/kids-club/` | `/de/kinderclub/` | `/ru/kids-club/` |
| Pavilyon | `/tr/pavilyon/` | `/en/pavilions/` | `/de/pavillons/` | `/ru/pavilions/` |
| Spa ve wellness | `/tr/spa-wellness/` | `/en/spa-wellness/` | `/de/spa-wellness/` | `/ru/spa-wellness/` |

## İçerik hazırlanması koşuluyla eklenebilecek sayfalar

Aşağıdaki sayfalar için ayrı, yeterli ve ilgili dilde içerik hazırlanmalıdır.

| Sayfa | Türkçe | İngilizce | Almanca | Rusça |
|---|---|---|---|---|
| Otel hakkında | `/tr/hakkimizda/` | `/en/about-us/` | `/de/ueber-uns/` | `/ru/about-us/` |
| Tatil konsepti | `/tr/konsept/` | `/en/concept/` | `/de/konzept/` | `/ru/concept/` |
| Barlar | `/tr/barlar/` | `/en/bars/` | `/de/bars/` | `/ru/bars/` |
| Plaj | `/tr/plaj/` | `/en/beach/` | `/de/strand/` | `/ru/beach/` |
| Galeri | `/tr/galeri/` | `/en/gallery/` | `/de/galerie/` | `/ru/gallery/` |
| Kampanyalar | `/tr/kampanyalar/` | `/en/offers/` | `/de/angebote/` | `/ru/offers/` |
| Erken rezervasyon | `/tr/kampanyalar/erken-rezervasyon/` | `/en/offers/early-booking/` | `/de/angebote/fruehbucher/` | `/ru/offers/early-booking/` |
| Balayı | `/tr/balayi/` | `/en/honeymoon/` | `/de/flitterwochen/` | `/ru/honeymoon/` |
| Sıkça sorulan sorular | `/tr/sikca-sorulan-sorular/` | `/en/faq/` | `/de/faq/` | `/ru/faq/` |
| Konum ve ulaşım | `/tr/konum-ve-ulasim/` | `/en/location-directions/` | `/de/lage-anreise/` | `/ru/location-directions/` |
| İletişim | `/tr/iletisim/` | `/en/contact/` | `/de/kontakt/` | `/ru/contact/` |

## SEO ve yönlendirme kuralları

1. URL adlarında küçük harf ve kelimeler arasında kısa çizgi kullan.
2. Türkçe ve Almanca URL adlarında yukarıdaki Latin harfli yazımı tutarlı uygula. Bu bir proje standardıdır; yerel karakter kullanımı SEO açısından yasak değildir.
3. Tüm sayfalarda sondaki eğik çizgi standardını koru.
4. Alan adında marka bulunduğu için her URL'ye tekrar otel adı, Antalya veya Side ekleme.
5. Eski adresleri içerik ve dil açısından karşılık gelen yeni adrese 301 ile yönlendir. Bütün eski sayfaları ana sayfaya yönlendirme.
6. Her dil sayfasında kendisini gösteren canonical kullan. Rusça sayfanın canonical adresi İngilizce sayfa olmamalıdır.
7. Dil karşılıklarını karşılıklı hreflang etiketleriyle ilişkilendir: tr, en, de, ru.
8. Dil seçici kullanıcıyı aynı içeriğin seçilen dildeki karşılığına götürmeli.
9. XML sitemap ve site içi bağlantılar yeni canonical adresleri kullanmalı.
10. URL'si İngilizce olsa bile Rusça sayfanın başlığı, açıklaması, ana içeriği ve HTML dil tanımı Rusça olmalı.

## Standart oda için canonical ve hreflang örneği

Rusça standart oda sayfasında:

```html
<html lang="ru">
<head>
  <link rel="canonical" href="https://arcanushotelssorgun.com/ru/rooms/standard-room/" />
  <link rel="alternate" hreflang="tr" href="https://arcanushotelssorgun.com/tr/konaklama/standart-oda/" />
  <link rel="alternate" hreflang="en" href="https://arcanushotelssorgun.com/en/rooms/standard-room/" />
  <link rel="alternate" hreflang="de" href="https://arcanushotelssorgun.com/de/zimmer/standardzimmer/" />
  <link rel="alternate" hreflang="ru" href="https://arcanushotelssorgun.com/ru/rooms/standard-room/" />
</head>
```

Diğer üç dil sürümünde de aynı hreflang eşleştirmeleri bulunmalı; canonical her sayfanın kendi URL'sini göstermelidir.

## Kaynaklar

- [Arcanus Hotels Sorgun](https://arcanushotelssorgun.com/)
- [Konaklama sayfası](https://arcanushotelssorgun.com/konaklama)
- [Google: URL yapısı](https://developers.google.com/search/docs/crawling-indexing/url-structure)
- [Google: Çok dilli siteler](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
- [Google: Dil sürümleri ve hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google: Canonical URL](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

