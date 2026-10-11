# İlerleme

## Durum (2026-10-11)

Sıfırdan kurulum tamamlandı. Build temiz: 4 dil × (ana sayfa + 404), robots.txt, sitemap index + 4 dil
sitemap'i, `.htaccess` dosyaları. Henüz gerçek içerik, fotoğraf, logo ve otel bilgisi yok; ana sayfada
yalnızca otel adı başlıklı düz hero var.

### Kurulu altyapı

- Next.js 16.4 (App Router, TypeScript, Turbopack), statik export, `trailingSlash`.
- i18n: `[lang]` kök layout, dil bazlı slug haritası, yalnızca yayındaki sayfalar üretiliyor.
- SEO: self canonical, karşılıklı hreflang + x-default (tr), Open Graph, Organization + WebSite JSON-LD,
  BreadcrumbList (iç sayfalarda), dil bazlı sitemap'ler, robots.
- Tasarım token'ları, 12 kolon grid, tipografi ölçeği, odak stilleri, skip link, reduced-motion.
- Fontlar: Cormorant Garamond + Manrope (next/font/google, self-host; latin + latin-ext preload,
  Kiril unicode-range ile). Geçici; lisanslı font gelirse `src/app/fonts.ts` değişir.
- Hareket: GSAP + ScrollTrigger + SplitText, Lenis smooth scroll, `SplitReveal`, `Hero`.
- Kabuk: Header (yüzeye göre renk, kaydırınca gizlenme), tam ekran Menü (Esc, inert, odak dönüşü),
  Footer (sticky açılış), dil seçici, mobil sabit rezervasyon çubuğu (hedef tanımlanınca görünür).
- Görsel pipeline'ı: `assets/images` → AVIF/WebP 6 genişlik + blur önizleme + manifest; `Picture` bileşeni.
- cPanel: `deploy/htaccess/root.htaccess` (https, www'suz, kök → /tr/, cache, güvenlik başlıkları,
  sıkıştırma), dil klasörü başına 404, `deploy/redirects.csv` ile eski URL 301'leri.

### Ölçümler (ana sayfa, build sonrası)

| Ölçüm | Değer | Not |
|---|---|---|
| İlk yük JS | ~192 KB gzip (~170 KB brotli) | 39 KB'lık polyfill chunk'ı `nomodule`, modern tarayıcı indirmez. Tabanın ~130 KB'ı React 19.3 + Next 16 runtime; GSAP + ScrollTrigger + SplitText ~46 KB, Lenis ~13 KB |
| CSS | 4.6 KB gzip | |
| HTML | 4.5 KB gzip | |
| Font preload | 4 dosya, ~76 KB | Kiril preload edilmez, gerektiğinde yüklenir |

JS bütçesi (150 KB) framework tabanı nedeniyle tutmuyor. Azaltma adayları: SplitText/ScrollTrigger'ı
kullanan bileşenlerde dinamik `import()`, Lenis'i `prefers-reduced-motion`'da hiç yüklememe.
Karar: içerik ve bölümler eklendikten sonra tek seferde optimize edilecek.

### Bilinen sapmalar

- Şartname `next/image` istiyor; statik export + cPanel'de optimizer çalışmadığı için kendi
  `Picture` bileşenimiz var (AVIF + WebP srcset, width/height, lazy, LCP için preload).
- Şartnamedeki RotateNotice yapılmadı (WCAG 1.3.4).
- Statik çıktıda CSP `script-src 'unsafe-inline'` içeriyor (Next'in satır içi RSC script'leri nonce alamaz).
- `out/404.html` Next'in varsayılanı (İngilizce, lang'siz); Apache kullanmıyor, `/xx/404/` sayfaları geçerli.

## ▶ BURADAN DEVAM ET

Sıradaki iş, kullanıcının cevaplarına bağlı. Cevaplanan kararlar: sıfırdan başlandı, kök `/tr/`,
cPanel statik, CMS sonra Laravel. **Açık sorular** (cevap gelince ilgili dosya):

1. Tasarım referansı: şartname mi, canlı siteden seçilen elemanlar mı? → bölüm bileşenleri
2. 4 dilde metinler nerede? → `src/content/pages/*.ts`
3. Fotoğraf/video klasörü, hero videosu var mı? → `assets/images/`, `public/video/`
4. Logo SVG (açık/koyu) → `public/logo-*.svg`, `components/layout/Logo.tsx`
5. Lisanslı font var mı? → `src/app/fonts.ts`
6. Otel sabit bilgileri: adres, telefon, e-posta, koordinat, giriş/çıkış saati, yıldız, evcil hayvan,
   fiyat aralığı → `src/content/site.ts`, `lib/jsonld.ts` (Hotel şeması)
7. Faz 1 sayfa kapsamı; restoran/bar başına ayrı sayfa mı? → `src/i18n/routes.ts`, kayıt defteri
8. Rezervasyon motoru adresi → `site.bookingUrl`
9. Hosting detayı: cPanel'de Apache mi LiteSpeed mi; eski sitenin URL envanteri → `deploy/redirects.csv`
10. Analitik / üçüncü parti (GA4, pixel, chat) → CSP ve çerez onayı
11. İletişim formu faz 1 mi? (Laravel API gerekir)
12. GitHub repo adı (remote henüz eklenmedi)

Kullanıcıdan bağımsız sıradaki geliştirme (şartname §16 sırası):

- [ ] Hareket bileşenleri: `WordFill`, `MediaReveal` (parallax dahil)
- [ ] Bölümler: Statement, TextBlock, Collage, CrossfadeStack, HoverList, Slider, CardGrid, ExploreMore
- [ ] Sayfa geçiş perdesi: `TransitionProvider` + `TransitionLink` (şu an düz Link sarmalayıcı)
- [ ] "Bu sayfa Almanca da mevcut" kapatılabilir dil bandı (client, `navigator.languages`)
- [ ] Çerez onay bileşeni (analitik eklenince)
- [ ] Erişilebilirlik beyanı, KVKK/gizlilik, çerez sayfaları (metin gelince)
- [ ] Front-end review: NVDA/VoiceOver, klavye, gerçek cihaz, Lighthouse mobil

## Günlük

- **2026-10-11** — Proje sıfırdan kuruldu. 4 şartname dokümanı `docs/spec/` altına kopyalandı,
  çelişkiler CLAUDE.md'de karara bağlandı. Altyapı + kabuk + hero + SEO + cPanel dağıtım katmanı yazıldı,
  build ve lint temiz.
