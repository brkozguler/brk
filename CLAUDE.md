# Arcanus Hotels Sorgun — proje kuralları

Dört dilli (tr, en, de, ru) otel sitesi. Next.js 16 App Router, statik export (`output: 'export'`),
cPanel'e `out/` klasörü yüklenir. İçerik şimdilik `src/content` altında statik; faz 2'de Laravel CMS
API'si aynı tipleri besleyecek. Her oturuma `docs/PROGRESS.md` → "▶ BURADAN DEVAM ET" ile başla.

## Kaynak dokümanlar (bağlayıcı)

`docs/spec/` altındaki dört dosya şartnamedir; çelişkide şu kararlar geçerli:

| Konu | Karar |
|---|---|
| Dokunma hedefi | 48 px (`--tap`) |
| CLS hedefi | 0.05 |
| JS bütçesi | İlk yük 150 KB gzip hedef; framework tabanı ölçülüp PROGRESS'te izlenir |
| Hero video | Masaüstü ≤ 4 MB, mobilde yalnızca poster |
| Default export | Yalnızca Next'in zorunlu kıldığı dosyalarda (page, layout, not-found, robots); gerisi named export |
| Yatay mod uyarısı (RotateNotice) | Yapılmaz; WCAG 2.1 AA 1.3.4 Orientation ihlali |
| Klasör/URL yapısı | SEO dokümanındaki harita (`src/i18n/routes.ts`); şartnamedeki genel yollar değil |
| Slider | GSAP ile kendi bileşenimiz; üçüncü parti slider kütüphanesi yok |
| Görseller | `next/image` yok; `scripts/images.mjs` + `components/media/Picture` |
| Kök adres | `/` → `/tr/` 301 (.htaccess); x-default = tr; IP/Accept-Language yönlendirmesi yasak |

## Mimari

- `src/app/[lang]/layout.tsx` kök layout'tur; `<html lang>` buradan. `src/app/(root)/` yalnızca `/` yedeği.
- `src/i18n/routes.ts`: tüm sayfa anahtarları, dil bazlı slug ve etiketler. Slug yalnızca burada değişir.
- `src/content/pages/index.ts`: sayfa kayıt defteri. Bir dilde içeriği olmayan sayfa üretilmez,
  menüde çıkmaz, hreflang almaz. Sayfalar `sections` dizisinden `components/sections/registry.tsx` ile çizilir.
- `src/content/site.ts`: ad, adres, telefon, rezervasyon adresi. Boş alan = doğrulanmamış; bileşen göstermez.
- SEO: `lib/seo.ts` (canonical, hreflang, OG), `lib/jsonld.ts`, `lib/sitemap.ts` + `app/sitemap*.xml/route.ts`.
- Hareket: `lib/gsap.ts`, `lib/motion.ts` (tek yerde süre/eğri), `components/layout/SmoothScroll.tsx` (Lenis).
- Dağıtım: `deploy/htaccess/root.htaccess` + `deploy/redirects.csv` → `scripts/postbuild.mjs` → `out/.htaccess`.
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
- CSS Modules, class adları camelCase; token'lar `globals.css` `:root` içinde; `!important` yok.
- Animasyonda yalnızca `transform` ve `opacity`; `will-change` sadece parallax öğelerinde.
- Her görsel `width`/`height` taşır; LCP görseli `priority` (sayfada bir tane), gerisi lazy.
- Tıklanabilir `div` yok, `outline: none` yok, `unload` yok, `innerHTML`'e kullanıcı verisi yok.
- Üçüncü parti script eklenirken `.htaccess` CSP'si güncellenir ve script geciktirilir.

## Yapılmayacaklar

- Lorem ipsum ya da "lüks yaşamın yeni tanımı" türü uydurma metin. Metin yoksa bölüm çizilmez.
- Doğrulanmamış otel bilgisi (yıldız, saat, fiyat, mesafe). Kaynak: kullanıcı onayı → `site.ts` / içerik dosyası.
- Her paragrafa ve karta ayrı giriş animasyonu; büyük harfli üst etiketler; butonlarda ok işareti;
  başlıkta italik/renkli tek kelime; kartlarda 01/02/03 numaralandırma.
- Bayraklı dil seçici; dilin kendi adı yazılır ve aynı sayfanın karşılığına gider.
