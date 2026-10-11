# Arcanus Hotels Sorgun — proje kuralları

Dört dilli (tr, en, de, ru) otel sitesi. Next.js 16 App Router, statik export (`output: 'export'`),
cPanel'e `out/` klasörü yüklenir. İçerik şimdilik `src/content` altında statik; faz 2'de Laravel CMS
API'si aynı tipleri besleyecek. Her oturuma `docs/PROGRESS.md` → "▶ BURADAN DEVAM ET" ile başla.

## Tasarım referansı — Mākena, birebir

Kullanıcı kararı (2026-10-11): **ana sayfa makenagolfandbeachclub.com ana sayfasının birebir kopyası**
(header, menü, footer dahil); **galeri** de Mākena `/gallery` + `/gallery/{kategori}` birebir. Ölçüler `docs/reference/MAKENA-FRONTEND-REVERSE-ENGINEERING.md`
(canlı DOM + bundle, 1440×900); kullanıcı bir canlı eleman gösterip "böyle olsun" derse o seçim
spec'tir — önce ölç, ölçülen değere kur, sapmayı PROGRESS'e yaz. Yeni blok: önce referans doküman,
sonra canlı ölçüm (`window.arcanusScrollTo(y)` QA kancası + `getBoundingClientRect`).

`docs/spec/` altındaki dört doküman teknik kurallar için bağlayıcıdır (performans, SEO, a11y,
kod standartları); görsel sistem ve blok ölçüleri için Mākena referansı önceliklidir. Çelişkide:

| Konu | Karar |
|---|---|
| Dokunma hedefi | 44–48 px; Mākena'nın küçük hedeflerine görünmez `::before` tamponu |
| CLS hedefi | 0,05 |
| JS bütçesi | Hedef 150 KB gzip; framework tabanı ölçülüp PROGRESS'te izlenir |
| Default export | Yalnızca Next'in zorunlu kıldığı dosyalarda; gerisi named export |
| Yatay mod uyarısı / loader | Yapılmaz (WCAG 1.3.4 / LCP) |
| URL yapısı | SEO dokümanındaki harita (`src/i18n/routes.ts`) |
| Görseller | `next/image` yok; `scripts/images.mjs` + `components/media/Picture` (`sizes` sözlüğü zorunlu) |
| Kök adres | `/` → `/tr/` 301 (.htaccess); x-default = tr; IP/Accept-Language yönlendirmesi yasak |
| Mobilde gizleme | İçerik `display:none` ile gizlenmez (Mākena storytelling metnini gizliyor, biz göstermiyoruz) |

## Mimari

- `src/app/[lang]/layout.tsx` kök layout'tur; `<html lang>` buradan. `src/app/(root)/` yalnızca `/` yedeği.
- `src/i18n/routes.ts`: tüm sayfa anahtarları, dil bazlı slug ve etiketler. Slug yalnızca burada değişir.
- `src/content/pages/index.ts`: sayfa kayıt defteri. Bir dilde içeriği olmayan sayfa üretilmez,
  hreflang almaz. Sayfalar `blocks` dizisinden `components/blocks/registry.tsx` ile çizilir;
  registry sunucuda görselleri çözer (`lib/images.ts`), istemci bloklarına düz veri geçer.
- `src/content/site.ts`: ad, adres, telefon, rezervasyon adresi — doğrulanmış tek kaynak.
- Tasarım sistemi `src/app/globals.css`: fluid kök font, `.site-max`, `.site-grid`, `.media-fill`,
  tipografi sınıfları (`display`, `title-*`, `body-*`, `label-*`, `eyebrow`), `.btn`, `.uline`,
  `.cbtn`, `.cprog`, `.lst__*`, `.bscale__scale`. Blok yerleşimleri CSS Modules'da, değerler rem.
- Hareket: `lib/motion/register.ts` (CustomEase + effect'ler) · `lib/motion/runtime.ts`
  (tek RAF, resize/tick/scroll servisleri, Lenis). Bileşen kendi rAF/resize dinleyicisini açmaz.
  Tüm GSAP kurulumu `gsap.matchMedia()` içinde, reduced-motion koşuluyla.
- Carousel motoru `components/carousel/useDragCarousel.ts` (clamped / infinite).
- Galeri: `blocks/GalleryGrid` (indeks; `columns: 2` = aynı ızgara, kartlar ikişer — Konaklama) ·
  `blocks/GalleryCategory` + `components/gallery/Lightbox`
  (`<dialog>` + showModal, kaydırma kilidi, ← → Esc). Hero'suz sayfa `routes.ts` → `headerDark: true`
  (Mākena is-black). Görünür breadcrumb yalnızca `PageContent.breadcrumb: true` ile.
- Yer tutucu görsel: `node scripts/placeholders.mjs <set>` → `assets/images/<set>/…`; gerçek
  fotoğraf aynı adla konur, betikteki set silinir.
- SEO: `lib/seo.ts`, `lib/jsonld.ts`, `lib/sitemap.ts` + `app/sitemap*.xml/route.ts`.
- Dağıtım: `deploy/htaccess/root.htaccess` + `deploy/redirects.csv` → `scripts/postbuild.mjs` → `out/`.
- Sunucu gerektiren Next özellikleri (redirects/headers/proxy/ISR/server actions) kullanılmaz.

## Komutlar

```bash
npm run dev        # geliştirme; / adresi /tr/ ye gider
npm run images     # assets/images → public/img + manifest
npm run build      # images + next build + postbuild → out/
npm run preview    # out/ klasörünü 3001 portunda sun
npm run check      # typegen + tsc + eslint + stylelint
```

## Kod standartları

- 2 boşluk, tek tırnak, noktalı virgül, `printWidth` 100 (Prettier).
- Tanımlayıcılar İngilizce, yorumlar ve commit mesajları Türkçe, kısa ve işlevsel.
  Her blok dosyasının başında ölçülen değerler ve referans bölümü yazılı.
- CSS Modules camelCase; global sınıflar yalnızca tasarım sistemi; `!important` yok.
- Animasyonda yalnızca `transform` ve `opacity`; `will-change` sadece sürekli hareket edenlerde.
- Her görsel `width`/`height` taşır; LCP görseli `priority` (sayfada bir tane), gerisi lazy.
- Tıklanabilir `div` yok, `outline: none` yok, `unload` yok, hover efektleri `(hover: hover)` guard'ında.
- Üçüncü parti script eklenirken `.htaccess` CSP'si güncellenir ve script geciktirilir.
- React Compiler lint kuralları: effect gövdesinde `setState` yok, render'da ref okuma yok.

## Yapılmayacaklar

- Lorem ipsum ya da uydurma pazarlama metni. Metin yoksa blok çizilmez.
- Doğrulanmamış otel bilgisi. Kaynak: kullanıcı onayı → `site.ts` / içerik dosyası;
  karakter bütçeleri `docs/reference/ARCANUS-CONTENT-SPEC.md` §02.
- Bayraklı dil seçici; dilin kendi adı yazılır ve aynı sayfanın karşılığına gider.
- Mākena'nın hataları kopyalanmaz: `sizes` varsayılanı 100vw, `col-start-0`, ölü sticky kodu,
  Esc'siz menü, `data-url` div linkleri, px tabanlı kök font.
