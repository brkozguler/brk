# İlerleme

## Durum (2026-10-11, gece)

Ana sayfa, kullanıcı kararıyla **makenagolfandbeachclub.com ana sayfasının birebir kopyası**
olarak kuruldu: 13 blok + header, menü, footer. **Galeri** (`/tr/galeri/` + 6 kategori) Mākena
`/gallery` ve `/gallery/{kategori}` şablonlarının birebir kopyası; **Konaklama** aynı şablonun
iki kolonlu küçük kart varyantı. Build ve lint temiz;
4 dil × (ana sayfa + konaklama + galeri + 6 kategori + 404) = 40 sayfa. Görseller yer tutucu
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

Header galeri kategorilerinde `is-black` (routes.ts `headerDark`): en tepede koyu logo ve metin.
Lightbox `<dialog>` + `showModal` (odak tuzağı, Esc, odak geri dönüşü), kaydırma kilidi,
← → ile gezinme, canlı bölge sayaç; oklar başa/sona sarar. Mākena'da kaydırınca kapanıyor,
kilit yok — bilinçli sapma (CLAUDE.md).

### Referans → bizde

| Mākena | Bizde | Not |
|---|---|---|
| Fluid kök font `clamp(9px, 10·100vw/--size, 10px)` | `globals.css` (rem tabanlı a11y düzeltmesiyle) | 1440 → 9,6 px birebir |
| `.site-max` / `.site-grid` | aynı adlar, `globals.css` | 48 px padding, 12 kolon 16,32 gap ✓ |
| ivy-mode / sweet-sans-pro / messina-sans | Playfair Display / Manrope / Manrope | geçici; lisanslı font gelince `src/app/fonts.ts` |
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
- a11y: logo linkinin `aria-label`'ı görünür metinle uyuşmuyor (2.5.3) → `Header` logo;
  footer yasal linkleri 44 px'in altında (`Footer .terms`). Her ikisi review geçişinde.
- Konsolda 404: henüz yazılmamış sayfaların segment prefetch'i; sayfalar gelince kapanır.
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
3. **Oda detay sayfaları** (`rooms/*`, 4 oda): Konaklama kartları ve ana sayfa carousel'i buraya
   gidiyor, şu an 404. Metinler CONTENT-TR §4 hazır; şablon kullanıcıdan (muhtemelen bir Mākena URL'si).
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

## Günlük

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
  bloğu konaklamaya (ROOMS-02 metni). `gallery_grid` → `columns: 2`, `src/content/pages/rooms.ts`
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
