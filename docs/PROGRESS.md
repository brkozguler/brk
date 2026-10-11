# İlerleme

## Durum (2026-10-11, gece)

Ana sayfa, kullanıcı kararıyla **makenagolfandbeachclub.com ana sayfasının birebir kopyası**
olarak kuruldu: 13 blok + header, menü, footer. **Galeri** (`/tr/galeri/` + 6 kategori) Mākena
`/gallery` ve `/gallery/{kategori}` şablonlarının birebir kopyası; **Konaklama, Restoranlar, Barlar**
aynı şablonun intro'lu, iki kolonlu Vogue kartlı varyantı; **20 detay sayfası** (4 oda, 7 restoran,
9 bar) Mākena /real-estate/kaeo şablonu. Build ve lint temiz; 4 dil × 32 sayfa = 128 (+ 404'ler). Görseller yer tutucu
(`scripts/placeholders.mjs`), ana sayfa metinleri onaylı, galeri EN/DE/RU metinleri editör
kontrolü bekliyor; iletişim bilgileri doğrulanmış. Diğer sayfaların içeriği henüz yok; menü ve
footer tüm rotaları listeliyor, bu linkler sayfalar yazılana kadar 404 verir.

Önizleme: `npm run preview` → http://localhost:3001/tr/ · http://localhost:3001/tr/galeri/

### Galeri — ölçüm, canlı Mākena ile aynı anda (2026-10-11)

| Öğe | Mākena | Bizde | Not |
|---|---:|---:|---|
| **/gallery** hero (slim) | 528 | 528 | h1 y 232,8 / eyebrow 191,5 / çizgi 405,1 — birebir (boş alt metin boşluğu `Hero .noSubtitle`) |
| grid section | 1018,7 | 1018,7 | ul y 604,8 · kart 432,1 × 365,4 · satırlar 604,8 / 1066,2 · etiket y 959,6 |
| footer y | 1546,7 | 1546,7 | |
| mobil 375: hero / section / kart | 528,8 / 2081,7 / 286,1 | aynı | kart mb 57,7, son kartta 0 |
| **/gallery/{kat}** başlık kutusu | 121 | 121 | h1 title-l 38,4 px, pb 7rem, 1 px marka çizgisi %30 |
| nav kutusu y | 370,5 | 370,5 | daire 38,4 (.cbtn, köşe .3rem) · etiket eyebrow 700 |
| küçük görseller | 207,9 × 155,9 | aynı | x 48 / 272,2 / 496,4 / 720,7 / 944,9 / 1169,1 · satır adımı 173,2 |
| section | 1032,1 (14 kare) | 859 (12 kare) | kare sayısı içerik; içerik dokümanı 12 |
| mobil 375: nav / kare / "Daha fazla" | 264,2 / 164,9 × 123,7 / 891,6 | aynı | 8 kare + buton; ≥650 hepsi |
| **Lightbox** şerit / oklar / sayaç | 41,3 / 48 · 101,8 / 167 | aynı | beyaz 38,4 kareler, köşesiz |
| kapat / görsel / başlık | y 51,8 / 115,2 × 708 / 856,8 | aynı | genişlik 1344 vs 1329: Mākena kaydırma çubuğunu bırakıyor, biz kilitliyoruz |
| mobil lightbox şerit / kapat / görsel | 735,1 / 38,5 / 96,2 × 619,7 | aynı | |

### Konaklama — `/tr/konaklama/` (2026-10-11, kullanıcı: kart boyutu ve boşluk voguehotelsupreme.com/odalar gibi)

Mākena /gallery şablonu (slim hero + `gallery_grid`), `columns: 2`: kart içeriği Mākena (4:3 yerine
Vogue oranı görsel + eyebrow etiket), **ölçüler ve boşluklar Vogue Hotel Supreme /odalar canlı
ölçümünden** (1440 / 768 / 375). Yol: 320 px ortalı kartlar "çok dar" → Ethno aralıkları →
Mākena ikili → Vogue. 4 oda kartı alan sırasıyla (24 · 38 · 48 · 72 m²).

| Ölçü | Vogue 1440 | Bizde 1440 | Vogue 375 | Bizde 375 |
|---|---:|---:|---:|---:|
| alan | 1280 ortalı (kenar 72,5) | 133,3rem = 1279,7 (kenar 72,7) | tam genişlik, kenar 15 | kenar 19,2 |
| kart / kolon arası | 626 / 28 | 626 / 27,8 (2,9rem) | 345, tek kolon | 336,6, tek kolon |
| görsel | 626 × 426 (sabit yükseklik) | 626 × 426 (aspect 626/426) | 345 × 245 | 336,6 × 239 (345/245) |
| etiket üstü | 40 | 40,3 (4,2rem) | 40 | 40,4 |
| satır arası | 80 | 99,8 (10,4rem — kullanıcı: "biraz daha yukarıdan boşluk") | 80 | 79,8 |
| alt boşluk | 120 | 120 (10,4 + 2,1rem) | 120 | 120 (12,5rem) |

Vogue iki kolona 960'ta geçer, bizde kırılım 1024 (tablet tek kolon, görsel masaüstü oranı 626/426;
Vogue'un tabletteki 693×245 sabit yüksekliği aşırı yatay olduğu için alınmadı). Değerler
`GalleryGrid.module.css` → `.two` / `.sectionTwo`.

**Kart içeriği** (kullanıcı: Vogue kartındaki eyebrow, başlık, açıklama, özellik satırı ve düğme
"bu şekilde, ama bizim font ve font-size"): `GalleryGridItem.detail`, `GalleryGrid .rich`.

| Öğe | Vogue (1440) | Bizde |
|---|---|---|
| eyebrow | Playfair 15 px / 500 / 2,25 px · mt 40 · <960 gizli | **kaldırıldı** (kullanıcı, 2026-10-11); `detail.eyebrow` isteğe bağlı duruyor |
| başlık | Playfair 20 px / 120 % · vurgu rengi · mt 8 | `.title-xs` (21,1 px) · marka rengi · mt 4,2rem (görselden sonra) · bağlantı |
| açıklama | 15 px / 22,5 · mt 40 · tam genişlik | `.body-m` (14,4 px / 1,6) · mt 2rem ("arayı azalt") · max-w 50rem ("biraz daha daralt") |
| özellikler | 15 px / 500 · aralık 56 · ✦ 8×8 (li::after, −28 px) | `.label-s` 500 / lh 1,5 · 1,6 + ✦ .8 + 1,6rem = 38 px ("biraz daha daralt") · sarabilir |
| düğme | 91 × 44, 12 px / 1,5 px, kenar %50 siyah, köşe 2 · mt 40 · tek | `.btn` 14rem × 4,2rem, eyebrow, yazı takası · mt 4,2rem · **KEŞFET + REZERVASYON** (1,6rem ara; rezervasyon hedefi `bookingTarget`: motor adresi yoksa iletişim sayfası) |
| mobil aralıklar | 24 / 24 / ? / 32 / ? | 2,4 / .8 / 3,2 / 3,2 / 3,2rem |

**Intro** (kullanıcı, 2026-10-11: Mākena /experiences intro bloğu "konaklamaya ekle"): hero ve
breadcrumb'dan sonra `intro` bloğu (HOME-02 ile aynı bileşen ve ölçüler: pt 12rem pb 9rem, 3–10. kolon,
92rem, title-m); metin ROOMS-02 (TR onaylı, EN/DE/RU çeviri).

Metinler CONTENT-TR ROOMS-03…06 (kişi sayısı kapasitenin üst sınırı: 3 · 4 · 5 · 7; manzara kısaltıldı);
EN/DE/RU çeviri editör kontrolü bekliyor. Görsel bağlantısı `tabindex=-1 aria-hidden` (başlıkla aynı
hedef), başlık ve düğme gerçek bağlantı. Hero alt metni Mākena galerisinde olmadığı için kullanılmadı.
Oda kartları `rooms/*` rotalarına gider; **oda detay sayfaları henüz yok** (404).

### Restoranlar — `/tr/restoranlar/` · Barlar — `/tr/barlar/` (2026-10-11, kullanıcı: "bu sayfayı restoranlar barlar olarak da yap")

Konaklama şablonu birebir (slim hero → breadcrumb → intro → iki kolonlu Vogue kartları), içerik
`src/content/pages/venues.ts`: 7 restoran (REST-01…09) ve 9 bar (BARS-01…11), TR onaylı metinler
(⚠️ işaretli cümleler alınmadı), özellik satırı metinlerdeki tür · öğün · yer bilgisinden; EN/DE/RU
çeviri editör kontrolü bekliyor. **Detay sayfası yok** (SEO haritasında restoran/bar URL'si tanımlı
değil) → kartlar bağlantısız: görsel ve başlık düz, yalnızca REZERVASYON düğmesi
(`GalleryGridItem.page` isteğe bağlı). Detay istenirse önce URL haritası genişletilmeli.
Görseller yer tutucu: `assets/images/{restaurants,bars}/<ad>/cover.jpg` (`scripts/placeholders.mjs`
`restaurants` / `bars` setleri, yalnızca kapak). 7 kartta son satır tek kart (sol kolon).

### Detay sayfaları — oda (4) · restoran (7) · bar (9) (2026-10-11, kullanıcı: Mākena /real-estate/kaeo şablonu)

Dizilim `detailBlocks()` (`src/content/pages/room-details.ts`): **hero (tam ekran) → breadcrumb →
intro → `body_column` (gövde + ✦ özellikler + 1 px çizgi) → `media_slider` (3 kare) → `related`
(diğer odalar / restoranlar / barlar)**. Canlı kaeo ölçümü ve bizdeki değerler (1440 / 375):

| Blok | kaeo 1440 | Bizde 1440 | kaeo 375 | Bizde 375 |
|---|---:|---:|---:|---:|
| body_column | pt 76,8 · metin col 3–8 (880,6) · çizgi mt 76,8 | aynı (76,8 + metin + 76,8 + 1) | pt 76,9 | aynı |
| media_slider | 982,5 (track 1329 × 748,3 · ok satırı mt 42,2 · sayaç "1 \| 3") | **982,5** | 398,2 (track 336,6 × 252,1) | **398,2** |
| related | 699,9 (kart 431,5 × 345,7 · x 48 / 496,7 / 945,5 · ok satırı mt 57,6) | **699,9** | 474,2 (kart 284,6, oklar gizli) | 541,5 (oklar görünür — WCAG 2.5.7) |

Routes: `rooms/*` SEO haritasından; **restoran ve bar detayları haritada yoktu**, 16 rota eklendi
(`routes.ts`, slug'lar haritanın sözcük seçimiyle: `/tr/restoranlar/turk-a-la-carte/`,
`/de/bars/steg-bar/`, RU = EN). Kartlar ve KEŞFET artık detaya gider; ana sayfa oda carousel'i de.
İçerik: odalar CONTENT-TR §4 (intro + feature metni + specs; ⚠️ yatak satırı yok), restoran/bar
kart metninin ilk cümlesi intro, kalanı gövde (`splitLead`), meta açıklaması cümle sınırında ≤ 155.
EN/DE/RU çeviri editör kontrolü bekliyor. Görseller yer tutucu: `assets/images/{rooms,restaurants,bars}/<ad>/{cover,01..03}.jpg`.
Related'da mevcut sayfa listelenmez (Mākena kendini de listeliyor). 3 kartlı oda related'ı kaymaz,
oklar devre dışı. Toplam 138 sayfa (4 dil × 32 + kök/sitemap).

### Ana sayfa banner üstü kelime şeridi (2026-10-11, kullanıcı: Ethno Belek .section-line → "görselin üstüne")

Ethno Belek ana sayfasındaki iki satırlı kelime + küçük görsel şeridi, ana sayfadaki tam genişlik
banner görselinin (HOME-08, "Deniz ve iskele") üstüne bindirildi (`BannerFull` → `lines`). Ethno
kodu saf CSS: ≥1200 ikinci satır translateX(−200), şerit hover'ında satırlar yer değiştirir
(transition 1 s); <960 tek sütun zikzak. Canlı ölçüm ve bizdeki değerler:

| | Ethno 1440 | Bizde 1440 | Ethno 375 | Bizde 375 |
|---|---:|---:|---:|---:|
| Kapsayıcı | 1280 + 2 × 40 (x 32,5) | 1360 (x 32,5) | 335 + 2 × 20 | aynı |
| Satır 1 / 2 x | 72,5 / −127,5 | **72,5 / −127,5** | tek sütun | tek sütun |
| Şerit yüksekliği | 240,8 (98,4 + 44 + 98,4) | **240,7** | 570 (5 × 98 + 4 × 20) | **570,6** |
| Kelime | 68 px, lh 1,4 · 300 / italik 400 | 68 · 300 / italik 400 | 32 px | 32 |
| Görsel | 140 × 98,4 | 140 × 98,4 | 140 × 98, solda/sağda zikzak | aynı (x 20 / 214,8) |
| Aralıklar | 36 (öğe içi ve arası) | 36 | 20 | 20 |

Bizde: font Noto Serif Display (italik kesim ayrı next/font örneği, preload yok, yalnızca ana sayfada
iner); kelimeler büyük harfe CSS ile çevrilir (`lang` sayesinde İSKELE). Kelimeler hemen önceki
storytelling metninden, günün sırasıyla (TR Kahvaltı · Havuz · İskele · Sofra · Müzik; EN/DE/RU aynı
metinden) — uydurma metin yok. Görseller dekoratif (alt boş), kelimeyle eşleşen mekânın yer tutucusu.
Sapmalar: Ethno koyu metin/krem zemin → görsel üstünde beyaz metin, karartma yok (kullanıcı kaldırttı); Ethno'nun
960–1199 ara düzeni (tek satır 32 px) yok, <1024 tek sütun; `h3` yerine `ul/li` (başlık sırası).
Masaüstünde satır 1 sağdan taşar (TR KAHVALTI geniş); Ethno'da da dar ekranda taşıyor. DE FRÜHSTÜCK
mobilde yan boşluğa ~9 px biner (Ethno GATHERINGS 11,7 px).

Header galeri kategorilerinde `is-black` (routes.ts `headerDark`): en tepede koyu logo ve metin.
Lightbox `<dialog>` + `showModal` (odak tuzağı, Esc, odak geri dönüşü), kaydırma kilidi,
← → ile gezinme, canlı bölge sayaç; oklar başa/sona sarar. Mākena'da kaydırınca kapanıyor,
kilit yok — bilinçli sapma (CLAUDE.md).

### Referans → bizde

| Mākena | Bizde | Not |
|---|---|---|
| Fluid kök font `clamp(9px, 10·100vw/--size, 10px)` | `globals.css` (rem tabanlı a11y düzeltmesiyle) | 1440 → 9,6 px birebir |
| `.site-max` / `.site-grid` | aynı adlar, `globals.css` | 48 px padding, 12 kolon 16,32 gap ✓ |
| ivy-mode / sweet-sans-pro / messina-sans | Noto Serif Display (300) / Manrope / Manrope | geçici; lisanslı font gelince `src/app/fonts.ts`. Playfair Display 400'den başladığı için başlıklar kalın kalıyordu; kullanıcı "ince yap" (2026-10-11) → değişken ağırlıklı Noto Serif Display, ana sayfa intro'su yine 428,1 |
| `$event` tick · `$resize` · `$scroll` | `src/lib/motion/runtime.ts` | tek RAF, Lenis lerp .15 wheel 1.25 |
| CustomEase + registerEffect | `src/lib/motion/register.ts` | |
| 13 blok | `src/components/blocks/*` | ölçüler her dosyanın başında |
| Header state machine | `components/layout/Header.tsx` + `.module.css` | 100 ms throttle, 5 durum |
| Menü | `Menu.tsx` + `MenuToggle.tsx` | + Esc, inert, odak, dil seçici |
| Footer | `Footer.tsx` | parallax −37,5 % |

### Ölçüm — 1440×900, kök 9,6 px, canlı Mākena ile aynı anda (2026-10-11)

| Blok | Mākena | Bizde | Fark | Sebep |
|---|---:|---:|---:|---|
| hero | 900 | 900 | 0 | |
| intro | 428,1 | 428,1 | 0 | Playfair ile 4 satır (Cormorant 3 satır veriyordu) |
| banner_scale | 720 | 720 | 0 | |
| content | 349,5 | 331,2 | −18,3 | sağ kolon metni 5 satır (Mākena 6) — font/metin |
| storytelling | 806,7 | 749,1 | −57,6 | sağ kolon metni daha az satır — font/metin |
| spacer ×2 | 115,2 | 115,2 | 0 | |
| banner_full | 900 | 900 | 0 | |
| feature5050 | 956 | 956 | 0 | görsel sağda (Mākena gibi) |
| card_carousel | 1183,7 | 1160,6 | −23 | açıklama 1 satır (Mākena 2) |
| listings5050 | 956 | 956 | 0 | |
| experiences | 1100,2 | 1100,2 | 0 | |
| explore_more | 860,5 | 860,5 | 0 | |
| footer | 737,9 | 771,1 | +33 | 2 fazla menü linki, 1 fazla yasal satır, 1 eksik iletişim satırı |

Hero H1 52,8 / 63,36 px, genişlik 700,8, x 362,1 — birebir. Header 137,3 px üst durumda — birebir.
Carousel slide konumları −413 / 106 / 624 / 1142 (Mākena'da ilk kartın 68 px şeridi) — birebir.
Metin kaynaklı farklar font değişince yeniden ölçülecek; `docs/reference/ARCANUS-CONTENT-SPEC.md`
§02'deki karakter bütçeleri bunun için var.

### Bilinen sapmalar (bilinçli)

- Loader (2 s zorunlu açılış perdesi) yapılmadı: LCP'yi doğrudan 2 s geciktiriyor; otel kuralları
  dokümanıyla çelişiyor. İstenirse `docs/reference/...` §15 ölçüleriyle eklenir.
- Sayfa geçiş maskesi (§14) henüz yok — iç sayfalar gelince `TransitionLink`'e eklenecek.
- Mākena mobilde storytelling metnini gizliyor; bizde görünür (SEO + okunabilirlik).
- Ok butonları mobilde de var (WCAG 2.5.7); listings otomatik ilerlemesi seçim yapınca durur (2.2.2).
- Mobilde sabit rezervasyon çubuğu (otel kuralları) — Mākena'da yok.
- Yatay mod uyarısı yok (WCAG 1.3.4).
- Statik export: `next/image` yerine kendi `Picture` bileşenimiz; CSP `'unsafe-inline'`.
- Deneyim carousel'inde 5 kart (Mākena 4, eski içerik 6 — "Toplantı" SEO haritasında sayfa olmadığı için düştü).
- Görünür breadcrumb **her iç sayfada** (kullanıcı 2026-10-11: Akra Didim konaklama sayfasındaki
  gibi, "oluşturduğumuz tüm sayfalar"): Akra ölçüleri (py 20 px, ✦ 8 px ayraç + 8 px kenar, %70 siyah,
  son öğe siyah) bizim yazı tipi ve 1,2rem ölçeğiyle; Akra <1024 gizliyor, bizde her boyutta.
  Hero'lu sayfada hero'dan sonra akışta (grid 57 px aşağı kayar); hero'suz kategori sayfasında
  header'ın altına bindirilir, bölüm ölçüleri değişmez. `PageContent.breadcrumb: false` ile kapanır.
- Galeri kategorisi mobilde 8 kare + "Daha fazla" (Mākena gibi); kalan kareler `display:none`
  ile bekliyor — görsel ızgarası, metin değil; ≥650 hepsi görünür.
- Mākena'nın "önceki" dairesinde köşe yuvarlatma eksik (sınıf unutulmuş); bizde iki daire de .3rem.
- Mākena'nın galeri hero'sundaki boş `<p>` kopyalanmadı; aynı boşluk `Hero .noSubtitle` padding'i.

### QA taraması (2026-10-11, kullanıcı: "tüm projede sorun varsa çöz")

48 sayfa × 320 / 375 / 768 / 1024 / 1440 px, aynı origin'de iframe ile (tarayıcı paneli): yatay
taşma yok, kırpılan başlık/düğme yok, her sayfada tek h1, alt'sız görsel yok, dört dilde de (uzun
DE/RU metinler dahil) düğme sarması yok. Bulunup düzeltilenler:
- Başlık sırası: footer kolon başlıkları h3 → h2 (hero'suz ve 404 sayfalarında h1 → h3 atlıyordu).
- Dokunma hedefi: footer menü ve yasal linklerine görünmez tampon (≥ 24 px), kart başlık linkine
  negatif kenar boşluklu dolgu.
- WCAG 2.5.3 ad uyuşmazlığı: header logo linki ve footer logo düğmesinin `aria-label`'ı görünür
  "Arcanus Hotels Sorgun" metnini içeriyor.
- Konsol 404'leri: `TransitionLink` prefetch varsayılan kapalı (statik export'ta her görünür link
  için segment isteği + yazılmamış sayfalar için 404). Yazılmamış sayfaların linkleri (menü, footer,
  oda kartları → 20 rota × 4 dil) sayfalar gelene kadar gerçek 404 sayfasına düşer; menüde yalnızca
  yayınlanmış sayfaları listelemek istenirse `navigation.ts` → `hasPage` filtresi.
- Küçük ekranda "yüklenmemiş görsel" uyarısı AVIF decode zamanlamasıydı; dosyalar doğrulandı.

Sonuç (Lighthouse, yerel `serve out`): **ana sayfa mobil** perf 87 · a11y 100 · best 100 · SEO 100;
**konaklama masaüstü** 100 / 100 / 100 / 100. Kalan tek konu JS yükü (mobil LCP/TBT).

### Google kuralları denetimi (2026-10-11, `docs/spec/google-frontend-kurallari-2026.md` §14)

Lighthouse 12 (yerel `serve out`, Chrome headless): **mobil** perf 82 · a11y 96 · best 96 · SEO 100
(LCP 3,4 s simüle 4G, TBT 400 ms, CLS 0) · **masaüstü** 100 / 96 / 96 / 100 (LCP 0,8 s, CLS 0).
Sağlanan: tek h1, canonical, hreflang + x-default, OG/Twitter, JSON-LD, gerçek 404, robots/sitemap,
AVIF/WebP + srcset/sizes, width/height her görselde, LCP preload + fetchpriority, lazy + async,
WOFF2 preload + swap, Brotli/deflate + immutable cache, HSTS/CSP/nosniff/Referrer/Permissions,
`<a href>` linkler, landmark'lar, skip link, `:focus-visible`, reduced-motion, `unload` yok.
Açık kalanlar:
- JS ilk yük ~210 KB gzip (bütçe 150 / Google 170) — React 19 + Next çatısı ~120 KB, GSAP+Lenis ~57 KB.
- Gövde metni 14,4 px (Mākena ölçeği; Google 16 px önerir) — kullanıcı kararı gerekir.
- ~~a11y: logo `aria-label` uyuşmazlığı, footer yasal linkleri 24 px altı~~ → QA taramasında düzeltildi.
- ~~Konsolda 404: segment prefetch~~ → prefetch kapatıldı.
- RUM (`web-vitals`), Speculation Rules, nonce'lu CSP (statik export'ta `'unsafe-inline'`),
  Hotel JSON-LD'de yıldız/giriş-çıkış/geo (otelden bilgi bekleniyor).

### Ölçümler (ana sayfa, build sonrası)

| Ölçüm | Değer |
|---|---|
| İlk yük JS | ~200 KB gzip (framework ~130 KB + GSAP/Lenis/bloklar) — bütçe üstü, içerik bitince optimize edilecek |
| Font preload | 4 dosya (latin + latin-ext); Kiril unicode-range ile |
| Görseller | 27 kaynak → 240 AVIF/WebP, blur önizleme |

## ▶ BURADAN DEVAM ET

1. **Kullanıcı kontrolü:** ana sayfa ve galeri canlı Mākena ile yan yana incelenecek (ilk kontroller
   yapıldı, yukarıdaki tablolar). Header/menü/footer da Mākena'dan alındı; kullanıcı kendi sitesinin
   kabuğunu isterse önceki çalışmadaki ölçüler
   `docs/reference/MAKENA-FRONTEND-REVERSE-ENGINEERING.md` Ek C'de ve eski repoda (`src/styles/chrome.css`).
2. Galeri EN/DE/RU metinleri (`src/content/pages/gallery.ts`) editör kontrolü bekliyor; gerçek
   fotoğraflar `assets/images/gallery/<kategori>/cover.jpg + 01..12.jpg` adlarıyla konur, sayı
   değişirse `IMAGES_PER_CATEGORY`; başlık istenirse `GalleryImage.caption`.
3. ~~Oda detay sayfaları~~ → kaeo şablonuyla yapıldı (oda + restoran + bar).
4. Diğer sayfalar: rota haritası hazır (`src/i18n/routes.ts`); metinler
   `docs/reference/ARCANUS-CONTENT-TR.md` (TR) + eski repodaki `src/content/{en,de,ru}/*.json`.
   Her sayfa `src/content/pages/<key>.ts` + gerekirse yeni blok tipi (`content/types.ts` + `blocks/registry.tsx`).
   Yer tutucu görsel gerekirse `scripts/placeholders.mjs`'e set eklenir. Galeri şablonu
   (`GalleryCategory` + `Lightbox`) oda/restoran detaylarındaki görsel ızgarası için de kullanılabilir.
5. Açık sorular (cevap gelince ilgili dosya):
   - Fotoğraf ve video → `assets/images/`, `public/video/`
   - Logo SVG (açık/koyu, 116×58 oranı) → `public/logo-*.svg`, `components/layout/Logo.tsx`
   - Lisanslı font → `src/app/fonts.ts`
   - Yıldız, giriş/çıkış saati, koordinat, olanaklar → `site.ts`, `lib/jsonld.ts`
   - Rezervasyon motoru adresi → `site.bookingUrl`
   - Eski site URL envanteri → `deploy/redirects.csv`
   - Analitik / üçüncü parti → CSP + çerez onayı
   - GitHub repo adı (remote yok)
6. Sayfa geçiş perdesi, "bu sayfa Almanca da mevcut" bandı, çerez onayı, front-end review
   (NVDA/VoiceOver, klavye, gerçek cihaz, Lighthouse — yukarıdaki açık kalanlar listesi).

7. **Kullanıcının içerik klasörü (Google Drive, 2026-10-11):**
   https://drive.google.com/drive/folders/1AztFDAey-V8482PxaTYWgA7J3gkvrpjd ("Web İçerik", herkese açık
   bağlantı). Yalnızca klasör listesi görüldü, dosyalar henüz açılmadı / indirilmedi:
   - Konaklama: Standart Oda (+ Bahçe / Deniz / Yandan Deniz Manzaralı), Family Suite, Superior Aile
     Odaları, Deluxe Aile Odaları — bizde 4 oda tipi var, Drive'da Standart Oda 3 manzara alt tipiyle.
   - Restaurant & Alacarte: Ana Restaurant, Aqua Snack, Balık, İtalyan, Meksika, Türk, Uzakdoğu
     A'La Carte ve **Sahil Snack Restaurant** (bizde yok).
   - Barlar: Aqua, Arcanus Kahve Evi, Disco, Havuz, İskele, Lobi, Passion Kokteyl, Pastane, Sahil Bar
     ve **Bistro Sorgun** (bizde yok).
   - Aktiviteler: Aktivite & Eğlence, Çocuk Kulübü, Pavilyon, Spa, Toplantı, Yüzme Havuzları.
   - Hakkımızda: `Arcanus-Sorgun-Hakkimizda-TR-EN-DE-RU.md` (6 KB).
   - Kvkk Protokolleri: `Arcanus-Sorgun-KVKK-TR-EN-DE-RU.md` (235 KB).
   Kullanıcı taramayı durdurdu; içerikler okunmadan kullanılmaz, sıradaki adım kullanıcıya sorulur.

## Günlük

- **2026-10-11 (gece, 7)** — Kullanıcı karartma katmanını seçip "arka planı kaldır" dedi;
  şeridin altındaki %25 siyah katman kaldırıldı, metin doğrudan görselin üstünde.
- **2026-10-11 (gece, 6)** — Kullanıcı Ethno Belek ana sayfasındaki kelime şeridini seçip ana
  sayfa banner görselini gösterdi: "burdaki görselin üstüne yaparmısın". Ethno canlı ölçüldü
  (1440 / 375, CSS kuralları okundu), `BannerFull` → `lines` + italik font örneği eklendi, 4 dil.
  Ölçüm birebir (tablo yukarıda), hover geçişi doğrulandı, taşma yok.
- **2026-10-11 (gece, 5)** — Kullanıcı: "konaklama detay, restoran, barlar detay sayfasına bu sayfayı
  yap" + Mākena /real-estate/kaeo. Canlı ölçüm (1440/375): property_intro, media carousel, listings
  related. Yeni bloklar `body_column` · `media_slider` · `related`, ortak `SpecRow`; 16 restoran/bar
  rotası; `room-details.ts` + `venues.ts` detayları; 56 yer tutucu. Slider ve related px birebir.
- **2026-10-11 (gece, 4)** — Kullanıcı: "tüm projede sorun varsa çöz" + intro başlığı "ince yap".
  48 sayfa × 5 genişlik iframe taraması; başlık sırası, dokunma hedefleri, aria-label uyumu,
  prefetch 404'leri düzeltildi; display fontu Playfair → Noto Serif Display (300). Lighthouse yeniden.
- **2026-10-11 (gece, 3)** — Kullanıcı: Mākena /gallery sayfasını Konaklama yap, "responsive olarak
  2'li, kart tasarımları küçük" → 320 px'lik ortalı kartlar "çok dar" bulundu → "kart boşlukları
  ethnohotels.com/tr/konaklama gibi, 2'li" → Ethno ölçüldü (1440: kolon arası 50, satır 80, kart 415
  üçlü; 768/375 tek kolon, satır 40) ve uygulandı → kullanıcı: "Mākena galerisindeki gibi 2'li yan
  yana" (galeri ızgarası, 6'şar kolon) → kullanıcı: "voguehotelsupreme.com/odalar gibi kart boyutu ve
  boşluk" → Vogue ölçüldü (1280 alan, kart 626, kolon 28, satır 80, görsel 626×426, etiket üstü 40,
  alt 120; <960 tek kolon 345×245) ve uygulandı → kullanıcı Vogue kartının içeriğini seçti ("bu
  şekilde yap ama bizim font ve font-size"): `detail` (eyebrow · title-xs · body-m · ✦'li label-s ·
  KEŞFET) → kullanıcı: eyebrow "kaldır", açıklama "arayı azalt" (2rem), ikinci satıra "biraz daha
  yukarıdan boşluk" (satır arası 10,4rem) → açıklama ve özellikler "biraz daha daralt" (max-w 50rem;
  özellik aralığı 1,6rem), "REZERVASYON diye bir buton daha" (bookingTarget) → Akra Didim breadcrumb'ı
  "oluşturduğumuz tüm sayfalara" (`Breadcrumb` yeniden yazıldı, varsayılan açık) → Mākena intro
  bloğu konaklamaya (ROOMS-02 metni) → aynı şablon **Restoranlar ve Barlar** (`venues.ts`, 7 + 9
  bağlantısız kart, 16 kapak yer tutucu). `gallery_grid` → `columns: 2`, `src/content/pages/rooms.ts`
  4 dil. Oda detayları sıradaki iş.
- **2026-10-11 (gece, 2)** — Kullanıcı: "galeri sayfasını yapalım" + Mākena /gallery. Canlı sitede
  indeks, kategori ve lightbox 1440×900 + 375×812 ölçüldü (RE §17.6 doğrulandı; mobilde 8 kare +
  Load more, boş alt metin boşluğu, önceki dairesinde eksik köşe). Yeni: `gallery_grid` ve
  `gallery_category` blokları, `components/gallery/Lightbox` (`<dialog>`), `routes.ts` 6 kategori +
  `headerDark`, `PageContent.breadcrumb`, `scripts/placeholders.mjs` (78 yer tutucu). Dört dilde
  36 sayfa; ölçümler birebir. Google kuralları denetimi + Lighthouse sonuçları yukarıda.

- **2026-10-11 (gece)** — Kullanıcı: "Mākena ana sayfası birebir". Eski repodaki tersine mühendislik
  dokümanı ve dört denetimden geçmiş blok uygulamaları yeni mimariye (CSS Modules, kendi görsel
  pipeline'ı, statik export) taşındı. Canlı siteyle 1440×900'de yan yana ölçüldü: 13 bloktan 9'u ve
  header/carousel konumları birebir; kalan farklar font kaynaklı satır sayısı. Display fontu
  Cormorant → Playfair Display (ivy-mode'a daha yakın, intro 4 satıra oturdu). Menü link boyu ve
  footer satır aralığı canlıdan ölçülüp düzeltildi.
- **2026-10-11 (gündüz)** — Proje sıfırdan kuruldu. 4 şartname dokümanı `docs/spec/`, çelişkiler
  CLAUDE.md'de; altyapı + SEO + cPanel dağıtım katmanı; build ve lint temiz.
