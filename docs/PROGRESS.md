# İlerleme

## Durum (2026-10-11, akşam)

Ana sayfa, kullanıcı kararıyla **makenagolfandbeachclub.com ana sayfasının birebir kopyası**
olarak kuruldu: 13 blok + header, menü, footer. Build ve lint temiz; 4 dil × (ana sayfa + 404).
Görseller yer tutucu (eski projeden gelen sentetik JPEG'ler), metinler onaylı, iletişim
bilgileri doğrulanmış. Diğer sayfaların içeriği henüz yok; menü ve footer tüm rotaları
listeliyor, bu linkler sayfalar yazılana kadar 404 verir.

Önizleme: `npm run preview` → http://localhost:3001/tr/

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

### Ölçümler (ana sayfa, build sonrası)

| Ölçüm | Değer |
|---|---|
| İlk yük JS | ~200 KB gzip (framework ~130 KB + GSAP/Lenis/bloklar) — bütçe üstü, içerik bitince optimize edilecek |
| Font preload | 4 dosya (latin + latin-ext); Kiril unicode-range ile |
| Görseller | 27 kaynak → 240 AVIF/WebP, blur önizleme |

## ▶ BURADAN DEVAM ET

1. **Kullanıcı kontrolü:** ana sayfa canlı Mākena ile yan yana incelenecek ("bittikten sonra tekrar
   kontrol et" — ilk kontrol yapıldı, yukarıdaki tablo). Header/menü/footer da Mākena'dan alındı;
   kullanıcı kendi sitesinin kabuğunu isterse önceki çalışmadaki ölçüler
   `docs/reference/MAKENA-FRONTEND-REVERSE-ENGINEERING.md` Ek C'de ve eski repoda (`src/styles/chrome.css`).
2. Diğer sayfalar: rota haritası hazır (`src/i18n/routes.ts`); metinler
   `docs/reference/ARCANUS-CONTENT-TR.md` (TR) + eski repodaki `src/content/{en,de,ru}/*.json`.
   Her sayfa `src/content/pages/<key>.ts` + gerekirse yeni blok tipi (`content/types.ts` + `blocks/registry.tsx`).
3. Açık sorular (cevap gelince ilgili dosya):
   - Fotoğraf ve video → `assets/images/`, `public/video/`
   - Logo SVG (açık/koyu, 116×58 oranı) → `public/logo-*.svg`, `components/layout/Logo.tsx`
   - Lisanslı font → `src/app/fonts.ts`
   - Yıldız, giriş/çıkış saati, koordinat, olanaklar → `site.ts`, `lib/jsonld.ts`
   - Rezervasyon motoru adresi → `site.bookingUrl`
   - Eski site URL envanteri → `deploy/redirects.csv`
   - Analitik / üçüncü parti → CSP + çerez onayı
   - GitHub repo adı (remote yok)
4. Sayfa geçiş perdesi, "bu sayfa Almanca da mevcut" bandı, çerez onayı, front-end review
   (NVDA/VoiceOver, klavye, gerçek cihaz, Lighthouse).

## Günlük

- **2026-10-11 (gece)** — Kullanıcı: "Mākena ana sayfası birebir". Eski repodaki tersine mühendislik
  dokümanı ve dört denetimden geçmiş blok uygulamaları yeni mimariye (CSS Modules, kendi görsel
  pipeline'ı, statik export) taşındı. Canlı siteyle 1440×900'de yan yana ölçüldü: 13 bloktan 9'u ve
  header/carousel konumları birebir; kalan farklar font kaynaklı satır sayısı. Display fontu
  Cormorant → Playfair Display (ivy-mode'a daha yakın, intro 4 satıra oturdu). Menü link boyu ve
  footer satır aralığı canlıdan ölçülüp düzeltildi.
- **2026-10-11 (gündüz)** — Proje sıfırdan kuruldu. 4 şartname dokümanı `docs/spec/`, çelişkiler
  CLAUDE.md'de; altyapı + SEO + cPanel dağıtım katmanı; build ve lint temiz.
