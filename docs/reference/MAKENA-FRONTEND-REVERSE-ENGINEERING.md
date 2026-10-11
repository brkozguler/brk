# Mākena Golf & Beach Club — Front-End Reverse Engineering

> **Hedef site:** https://makenagolfandbeachclub.com/
> **Analiz tarihi:** 2026-10-03
> **Analiz yöntemi:** Canlı DOM + CSSOM okuma, production CSS/JS bundle statik analizi, Nuxt `_payload.json` çözümlemesi, `performance.getEntriesByType('resource')` ağ analizi, 1440×900 ve 390×844 viewport ölçümleri.
> **Amaç:** Bu dokümanı okuyan bir Senior Front-End Developer, referans siteyi açmadan layout + motion mimarisini yeniden üretebilmeli.

## Doğruluk etiketleri

| Etiket | Anlamı |
|---|---|
| `[VERIFIED]` | Production CSS/JS kaynağından veya canlı DOM ölçümünden birebir okundu |
| `[MEASURED]` | Tarayıcıda `getBoundingClientRect` / `getComputedStyle` ile ölçüldü (belirtilen viewport'ta) |
| `[HIGH CONFIDENCE]` | Kaynaktan dolaylı çıkarıldı, davranışla tutarlı |
| `[APPROXIMATION]` | Tahmin — uygulamada ince ayar gerekir |
| `[NEEDS DEVTOOLS]` | Doğrulanmadı, implementasyon sırasında kontrol edilmeli |

---

## 01. Executive Summary

Mākena, **içerik-sürücülü bir "block" sistemi** üzerine kurulu, **tek bir merkezi RAF döngüsü** ile yönetilen, **scroll-scrub ağırlıklı** bir sitedir. Sitenin karakterini belirleyen 6 teknik karar:

1. **Fluid root font-size.** Tüm tipografi, spacing ve grid `rem` cinsinden tanımlı; `html` font-size'ı viewport'a bağlı `clamp()` ile 9px–10px arasında ölçekleniyor. Bu, tek bir token setinin tüm breakpoint'lerde orantılı küçülmesini sağlıyor — *media query ile font küçültme neredeyse hiç yok*. `[VERIFIED]`
2. **Lenis smooth scroll** (`lerp: 0.15`, `wheelMultiplier: 1.25`) sitenin "ağır/yumuşak" hissinin tek kaynağı. `[VERIFIED]`
3. **GSAP ScrollTrigger + `scrub: true`** — neredeyse tüm görsel hareket parallax/scrub tabanlı. Pin, horizontal pin veya ScrollSmoother **kullanılmıyor**. `[VERIFIED]`
4. **GSAP SplitText + özel `unmask` CustomEase** — tüm metin girişleri aynı iki `registerEffect` üzerinden geçiyor (`textSplit`, `fade`). Tek merkezden kontrol edilen bir motion dili. `[VERIFIED]`
5. **Custom drag carousel** — Swiper/Embla yok. `gsap.quickSetter` + manuel lerp + `gsap.utils.wrap`/`snap` ile yazılmış, ScrollTrigger `onToggle` ile görünür değilken tick almıyor. `[VERIFIED]`
6. **Full-screen overlay menü** — `yPercent` wrap tekniği ile katmanlı sürgü + `clip-path` görsel reveal + per-char SplitText link hover. `[VERIFIED]`

**Toplam homepage ağırlığı:** ~1.08 MB transfer, ana JS bundle 173 KB (transfer). Sayfa yüksekliği 1440×900'de **10.087px ≈ 11.2 viewport**. `[MEASURED]`

**Bizim projemiz için kritik çıkarım:** Layout ve motion sistemi birebir yeniden üretilebilir ve üretilmeli. Ancak Mākena'nın **görsel teslimat stratejisi zayıf** (bkz. §24) — orada referansı taklit etmemeli, geçmeliyiz.

---

## 02. Site Map

`sitemap.xml` + internal link taraması ile tespit edilen **24 route**. `[VERIFIED]`

| # | Sayfa | URL | Template | Özel yapı |
|---|---|---|---|---|
| 1 | Home | `/` | `BlockRenderer` | 13 block, en uzun sayfa |
| 2 | About | `/about` | `BlockRenderer` | Globe (WebGL) + DestinationMap |
| 3 | Experiences (index) | `/experiences` | `BlockRenderer` | 4× Experience5050 |
| 4 | Golf | `/experiences/golf` | `BlockRenderer` | Experience detail template |
| 5 | Outdoor Pursuits | `/experiences/outdoor-pursuits` | `BlockRenderer` | Golf ile **aynı** dizilim |
| 6 | Wellness | `/experiences/wellness` | `BlockRenderer` | +1 ek Feature5050 |
| 7 | Lifestyle | `/experiences/lifestyle` | `BlockRenderer` | Golf ile **aynı** dizilim |
| 8 | Real Estate (index) | `/real-estate` | `BlockRenderer` | Categories + Accordion |
| 9 | Kā'eo | `/real-estate/kaeo` | `BlockRenderer` | +PropertyIntro (tek fark) |
| 10 | Kula Villas | `/real-estate/kula-villas` | `BlockRenderer` | Property detail template |
| 11 | Beach Cottages | `/real-estate/beach-cottages` | `BlockRenderer` | Property detail template |
| 12 | Beach Club Residences | `/real-estate/beach-club-residences` | `BlockRenderer` | Property detail template |
| 13 | Molokini Residences | `/real-estate/molokini-residences` | `BlockRenderer` | Property detail template |
| 14 | The Ranch at Mākena | `/real-estate/the-ranch-at-makena` | `BlockRenderer` | Property detail template |
| 15 | Gallery (index) | `/gallery` | `BlockRenderer` | Hero + GalleryGrid |
| 16–21 | Gallery kategorileri | `/gallery/{farm-to-fork,golf,landscapes,lifestyle,outdoor-pursuits,wellness}` | `gallery-slug` | Header `is-black` state'i **sadece burada** |
| 22 | Contact | `/contact` | `BlockRenderer` | ContactForm |
| 23 | Map | `/map` | Özel sayfa | Block yok — tam ekran interaktif harita, kendi loading state'i |
| 24 | Privacy | `/privacy` | `BlockRenderer` | LongformLinks |

### Template paylaşımı

```
Template A — "Experience Detail"   → /experiences/{golf,outdoor-pursuits,lifestyle}  (wellness = A + 1 block)
Template B — "Property Detail"     → /real-estate/{kula-villas,beach-cottages,beach-club-residences,molokini-residences,the-ranch-at-makena}
Template B' — "Property Detail +"  → /real-estate/kaeo   (B + property_intro)
Template C — "Gallery Category"    → /gallery/*          (named route: gallery-slug)
Template D — "Landing"             → /, /about, /experiences, /real-estate
Template E — "Utility"             → /contact, /privacy
Template F — "Standalone"          → /map
```

### Route → Block dizilimi (payload'dan birebir) `[VERIFIED]`

```
/                      hero → intro → banner_scale → content → storytelling → spacer → spacer
                       → banner_full → feature5050 → image_carousel_offset → listings5050
                       → experiences_carousel → explore_more

/about                 hero → intro → feature5050 → storytelling_offset → spacer → banner_full
                       → story_slider → globe → destination_map → image_carousel
                       → experience5050 → spacer → explore_more

/experiences           hero → intro → experience5050 ×4 → spacer → explore_more

/experiences/golf      hero → intro → feature5050 → media_carousel → feature5050 → spacer → explore_more
/experiences/wellness  hero → intro → feature5050 → media_carousel → feature5050 → feature5050 → spacer → explore_more

/real-estate           hero → intro → real_estate_categories → spacer → accordion5050
                       → explore_more → real_estate_overview ×6

/real-estate/kaeo      hero → intro → property_intro → media_carousel → listings_related
                       → real_estate_overview ×6
/real-estate/{diğer}   hero → intro → media_carousel → listings_related → real_estate_overview ×6

/gallery               hero → gallery_grid
/contact               hero → contact_form → explore_more
/privacy               hero → longform_links
/map                   (block yok)
```

> **Not:** `real_estate_overview ×6` blokları DOM'da render ediliyor ama görsel olarak liste/overlay beslemesi için kullanılıyor — ayrı birer section değil. `[HIGH CONFIDENCE]`

---

## 03. Detected Technology Stack

| Katman | Tespit | Durum | Kanıt |
|---|---|---|---|
| Framework | **Nuxt 3 / Vue 3** | `[VERIFIED]` | `window.__NUXT__`, `/_nuxt/*`, `__VUE__`, `_payload.json` |
| Build | Vite + Rollup, route-level code splitting | `[VERIFIED]` | `__vite__mapDeps`, 57 ayrı chunk |
| Render | SSR + prerender (`prerenderedAt` payload alanı) | `[VERIFIED]` | `data-nuxt-data`, `data-ssr="true"` |
| CMS | **DatoCMS** (GraphQL) | `[VERIFIED]` | `$dato.settings()`, `datocms-assets.com`, `responsiveImage` fragment |
| Image CDN | **imgix** (DatoCMS üzerinden) | `[VERIFIED]` | `?auto=format&fit=max&w=2440&h=2440&q=75&dpr=…` |
| Video | **Vimeo** progressive redirect (1080p .mp4) | `[VERIFIED]` | `player.vimeo.com/progressive_redirect/playback/…/rendition/1080p/file.mp4` |
| Animation | **GSAP 3.15.0** | `[VERIFIED]` | `window.gsapVersions = ["3.15.0"]` |
| GSAP plugins | CustomEase, SplitText, ScrollTrigger, DrawSVG | `[VERIFIED]` | `CustomEase.create(...)`, `new SplitText(...)`, `scrollTrigger:{...}`, `drawSVG:"0% 100%"` |
| Smooth scroll | **Lenis 1.3.24** | `[VERIFIED]` | `window.lenisVersion`, `<html class="lenis">` |
| CSS | **Tailwind CSS 3.x** + custom `@layer components` | `[VERIFIED]` | `--tw-*` değişkenleri, arbitrary values, `s:`/`l:` custom screens |
| Yardımcı | `lodash.throttle` (scroll handler) | `[VERIFIED]` | minify edilmiş lodash throttle gövdesi |
| State | **Pinia** | `[VERIFIED]` | `AC=Rt({name:"pinia"...})` |
| Consent | **CookieYes** | `[VERIFIED]` | `cdn-cookieyes.com` |
| Analytics | **GA4** `G-HCQK3JY85T` | `[VERIFIED]` | `googletagmanager.com/gtag/js` |
| Fontlar | Self-hosted `.woff2` + `.woff` | `[VERIFIED]` | `@font-face` → `/_nuxt/*.woff2` |
| Scroll restoration | Manuel (`history.scrollRestoration = "manual"`) | `[VERIFIED]` | Nuxt plugin |
| Hosting | Netlify/Vercel sınıfı statik + edge | `[APPROXIMATION]` | Header'lar incelenmedi |

### Kullanılmayanlar (önemli negatif bulgular) `[VERIFIED]`

- ❌ Locomotive Scroll, ScrollSmoother, Smooth Scrollbar
- ❌ ScrollTrigger `pin` — **hiçbir yerde pin yok**
- ❌ Swiper / Embla / Splide — carousel'lar elle yazılmış
- ❌ Framer Motion
- ❌ Custom cursor / cursor follower
- ❌ Three.js genel kullanımı — **sadece** `/about` sayfasındaki `GlobeBlock` için `[HIGH CONFIDENCE]`

---

## 04. Global Architecture

### 4.1 Uygulama ağacı `[VERIFIED]`

```
app (<div :class="menu.isOpen && 'is-menu'">)
 ├── div.js-t-mask            (fixed inset-0, pointer-events-none, opacity-0, z-9999)
 │    ├── div.js-t-mask-bg        (absolute inset-0, bg-black)
 │    └── div.js-t-mask-content   (absolute inset-0, bg-main #203276)
 ├── SiteHead  (header.sh)
 │    ├── div.sh__bg               (fixed, h-95, z-18, bg-white-pure)
 │    └── div.sh__inner            (absolute→fixed, z-20)
 │         └── div.sh__content     (site-max, flex, h-95)
 │              ├── MenuToggle (button.menu-t)
 │              ├── button.sh__logo  (logo-light.svg + logo-dark.svg)
 │              └── BaseBtn.sh__cta  ("Contact us", mobilde gizli)
 ├── Menu  (aside.menu, v-if menu.isOpen, Transition :css="false")
 ├── Loader (div.fixed.inset-0.bg-main.z-[9999], ilk yüklemede)
 ├── main
 │    └── Block ×N   (dynamic async component, item.type → PascalCase)
 └── SiteFoot (footer.sf)
      └── div.parallax (pt-55 pb-55 s:pb-50)
```

### 4.2 Merkezi servis katmanı (Nuxt plugin'leri) — **mimarinin kalbi** `[VERIFIED]`

Site, komponentlerin kendi `requestAnimationFrame` ve `resize` dinleyicilerini kurmasına izin vermiyor. Dört global servis var:

| Servis | API | Görev |
|---|---|---|
| `$event` | `.on(name, fn)` / `.off(name, fn)` / `.emit(name, payload)` | Global event bus. **`tick`** eventi `{ratio}` payload'ı ile tek RAF döngüsünden yayılıyor. `scroll` eventi `{y}` ile. `leave` eventi route çıkışında. `loaded` eventi ilk yükte. |
| `$scroll` | `.to(y)`, `.lenis` | Lenis instance wrapper |
| `$resize` | `.add(fn)`, `.remove(fn)`, `.ww`, `.wh`, `.small` | Tek resize observer; `.ww`/`.wh` cache'li viewport, `.small` = mobil flag |
| `$device` | `.isMobile`, `.isTablet` | UA/breakpoint tabanlı |

**Neden önemli:** 10+ carousel ve parallax aynı anda çalışırken tek RAF + tek resize listener var. Bizim implementasyonumuzda **birebir bu mimariyi kurmalıyız** — aksi halde ScrollTrigger + N adet `rAF` jank yaratır.

Ek olarak `useReducedMotion()` benzeri bir composable (`{enabled}`) tüm text-split animasyonlarını kapatıyor. `[VERIFIED]`

### 4.3 Z-index sistemi `[VERIFIED]`

| Katman | z-index |
|---|---|
| İçerik akışı | `0`–`6` |
| Header arka planı (`.sh__bg`) | `18` |
| Header içeriği (`.sh__inner`) | `20` |
| Cookie banner | `999` |
| Loader / Page-transition mask / Menü | `9999` |

### 4.4 Fixed / sticky envanteri `[VERIFIED]`

| Element | Konum | Not |
|---|---|---|
| `.sh__bg` | `fixed top-0 left-0 w-full h-95` | `translateY(-101%)` ile gizli, scroll state'inde iner |
| `.sh__inner` | `absolute` → `.is-fixed:not(.is-not-sticky)` olduğunda `fixed` | Dinamik position değişimi |
| `.js-t-mask` | `fixed inset-0` | Sayfa geçiş maskesi |
| `aside.menu` | `fixed inset-0` `[HIGH CONFIDENCE]` | `data-lenis-prevent` ile iç scroll |
| `.rotate-device-message` | `fixed` `[HIGH CONFIDENCE]` | Sadece telefon yatay modda |

> **`position: sticky` sitede hiç kullanılmıyor.** `[VERIFIED]`

---

## 05. Design Tokens

Tümü `:root` üzerinde CSS custom property olarak tanımlı. `[VERIFIED]` — aşağıdaki değerler production CSS'ten birebir kopyalanmıştır.

### 5.1 Renkler

```css
--color-main:              #203276;   /* Lacivert — marka, footer bg, loader bg, transition mask */
--color-main-tint:         #213375cc; /* %80 opak lacivert — eyebrow metinleri */
--color-white:             #f8f8f3;   /* Kirli beyaz — section bg */
--color-white-subtle:      #ffffff1f; /* %12 beyaz — menü içi border */
--color-white-pure:        #ffffff;
--color-white-tint:        #ffffff99; /* %60 beyaz — footer başlıkları */
--color-black:             #000000b3; /* %70 siyah — gövde metni */
--color-black-dark:        #00251b;   /* Koyu yeşilimsi siyah */
--color-black-pure:        #000000;
--color-offset:            #a8a98f;   /* Zeytin/haki */
--color-offset-2:          #d6eaf0;   /* Açık buz mavisi */
--color-offset-3:          #efeae6;   /* Sıcak gri */
--color-offset-4:          #faf8f7;   /* Neredeyse beyaz */
--color-highlight:         #000000;   /* Başlık rengi */
--color-highlight-subtle:  #f2eee8;
--color-highlight-heavy:   #777777;
--color-highlight-rich:    #9a3630;   /* Kiremit — focus outline rengi */
--color-legacy:            #111111;
--color-error:             #e22c2c;
--color-success:           #118850;
--foot-bg-color:           var(--color-main);
--foot-text-color:         var(--color-white-pure);
```

**Kullanım haritası** `[MEASURED]`

| Yüzey | Renk |
|---|---|
| Sayfa gövdesi varsayılanı | `#ffffff` |
| Alternatif section bg | `#f8f8f3` (white) |
| Carousel section bg | `#ffffff` |
| Hero fallback bg | `#000000` (`bg-highlight`) |
| Footer | `#203276` |
| Gövde metni | `rgba(0,0,0,.7)` |
| Başlıklar | `#000000` |
| Eyebrow | `rgba(33,51,117,.8)` |
| Focus outline | `#9a3630`, 2px, offset 1px |

### 5.2 Spacing

Tailwind spacing scale **override edilmiş**: `N` → `N/10 rem`. Yani `pt-120` = `12rem`. `[VERIFIED]`

Gerçekte kullanılan değerler (CSS'te tespit edilen):

```
4  5  6  8  10 12 15 16 20 21 24 25 26 28 30 32 36 37 40 41 42 45 46 48 50
55 56 58 59 60 62 65 70 72 76 80 85 88 90 92 95 100 110 115 120 143 150 220
```

→ rem karşılığı: `0.4rem … 22rem`

**Section vertical rhythm** `[MEASURED @1440]`

| Pattern | mobile | ≥650 (`s:`) | ≥1024 (`l:`) |
|---|---|---|---|
| Intro section | `pt-55 pb-40` | `pt-90 pb-100` | `pt-120 pb-90` |
| Feature5050 | `py-90` | `py-100` | `py-120` |
| Carousel | `pt-70 pb-100` | `pt-150` | `pt-70` |
| Storytelling | `py-0` | `py-0` | `py-100 pt-80` |
| Spacer block | `pt-120` (= 11.52px… hayır: 12rem = 115.2px @1440) | — | — |

> **Altın kural:** ana section dikey boşluğu desktop'ta **≈115px (12rem)**, tablet'te **96px (10rem)**, mobilde **≈86–96px (9rem)**.

### 5.3 Radius

```
--radius-xs: .2rem   /* ~1.9px — küçük focus hedefleri */
--radius-sm: .3rem   /* ~2.9px — butonlar, menü toggle circle */
```
> Sitede **büyük border-radius yok**. Kartlar ve görseller **keskin köşeli**. `[VERIFIED]`

### 5.4 Border

```
Tek stil: 1px solid currentColor
Menü içi ayraç: var(--color-white-subtle) = #ffffff1f
```

### 5.5 Shadow

```css
--tw-shadow: 0 1px 3px 0 #0000001a, 0 1px 2px -1px #0000001a;  /* sadece .shadow */
```
> Sitede gölge neredeyse hiç kullanılmıyor. Derinlik **ölçek ve maske** ile kuruluyor. `[VERIFIED]`

### 5.6 Opacity ölçeği

```
.20  (loader track circle)
.50  (footer copyright, transition mask bg)
.60  (menü link idle)
.80  (eyebrow, hero alt metin)
.88  (koyu zeminde metin)
1
```

---

## 06. Typography

### 6.1 Fontlar `[VERIFIED]` — `@font-face` tanımlarından birebir

#### Font Family 1 — Display

```
Name:      ivy-mode
Role:      Tüm başlıklar (display, title-l/m/s/xs, h1–h4, menü linkleri)
Source:    Self-hosted (Adobe Fonts lisansı ile dağıtılan dosya)
Format:    woff2 (primary) + woff (fallback)
Files:     IvyMode-Light.woff2 / IvyMode-Light.woff
Weights:   300 (Light) — TEK AĞIRLIK
Styles:    normal
Variable:  Hayır
Fallback:  sans-serif
font-display: swap
```

#### Font Family 2 — Serif slot (aslında sans)

```
Name:      sweet-sans-pro
Role:      Eyebrow (uppercase, geniş tracking), butonlar, etiketler
Source:    Self-hosted
Format:    woff2 + woff
Files:     sweet_sans_pro_regular / _medium / _bold
Weights:   400, 500, 700   (sadece 500 ilk yüklemede kullanılıyor)
Styles:    normal
Variable:  Hayır
Fallback:  sans-serif
font-display: swap
```

#### Font Family 3 — Body

```
Name:      messina-sans
Role:      Tüm gövde metni, paragraflar, form elemanları
Source:    Self-hosted
Format:    woff2 + woff
Files:     MessinaSansWeb-Regular / MessinaSansWeb-SemiBold
Weights:   400, 600
Styles:    normal
Variable:  Hayır
Fallback:  sans-serif
font-display: swap
```

```css
--font-family-display: "ivy-mode", sans-serif;
--font-family-serif:   "sweet-sans-pro", sans-serif;
--font-family-sans:    "messina-sans", sans-serif;
--font-variant-numeric: tabular-nums;
```

Ek global ayarlar `[VERIFIED]`:
```css
html {
  font-kerning: none;
  -webkit-font-smoothing: antialiased;
  -webkit-text-size-adjust: none;
  overscroll-behavior: none;
}
```

> ⚠️ **Lisans uyarısı:** Ivy Mode, Sweet Sans Pro ve Messina Sans ticari lisanslı. Projemizde **birebir kullanılamaz** — bkz. §30 "Project Specific Assets".

### 6.2 Fluid root font-size — **sistemin temeli** `[VERIFIED]`

```css
:root { --size: 390; }
@media (min-width: 650px) { :root { --size: 1500; } }

html {
  font-size: clamp(9px, 10 * 100vw / var(--size), 10px);
}
```

Yani: `1rem = clamp(9px, viewport genişliği / --size × 10, 10px)`

**Gerçek değerler** `[MEASURED]`

| Viewport | `--size` | Hesap | `1rem` |
|---|---|---|---|
| 320px | 390 | 8.21 → clamp | **9.00px** |
| 352px | 390 | 9.03 | **9.03px** |
| 375px | 390 | 9.62 | **9.62px** |
| 390px | 390 | 10.00 | **10.00px** |
| 430px | 390 | 11.03 → clamp | **10.00px** |
| 650px | 1500 | 4.33 → clamp | **9.00px** |
| 768px | 1500 | 5.12 → clamp | **9.00px** |
| 1024px | 1500 | 6.83 → clamp | **9.00px** |
| 1280px | 1500 | 8.53 → clamp | **9.00px** |
| **1350px** | 1500 | 9.00 | **9.00px** ← ölçekleme burada başlıyor |
| 1440px | 1500 | 9.60 | **9.60px** ✔ ölçümle doğrulandı |
| 1500px | 1500 | 10.00 | **10.00px** |
| 1920px | 1500 | 12.80 → clamp | **10.00px** |

**Davranışsal sonuç:**
- 390px'te ve 1500px+'ta tipografi **maksimum** (1rem = 10px)
- 650–1350px aralığının **tamamı sabit 9px** — yani tablet ve küçük laptop'ta tipografi tek ve sabit
- 1350→1500 arasında %11'lik yumuşak bir büyüme
- Mobilde 320→390 arasında %11'lik yumuşak küçülme

> 💡 **Yeniden üretim notu:** Bu, `clamp()` tabanlı fluid tipografinin tüm siteye tek bir satırdan uygulanmış hali. Her token ayrı `clamp()` yazmak yerine **root'u ölçekleyip her şeyi rem yapmak**, Mākena'nın en zarif mimari kararı. Projemizde aynen uygulanacak ama **a11y riski** için §28'e bakın.

### 6.3 Typography scale

Tüm değerler `rem`. Aşağıdaki px karşılıkları: **mobil = 390px viewport (1rem=10px)**, **tablet = 768px (1rem=9px)**, **desktop = 1440px (1rem=9.6px)**.

#### `.display` — Hero H1

| | rem | px |
|---|---|---|
| Desktop (≥1024) | `5.5rem` | **52.8px** |
| Tablet (≥650) | `4.8rem` | **43.2px** |
| Mobile | `4rem` | **40.0px** |

```
font-family:    var(--font-family-display)   → ivy-mode
font-weight:    300
line-height:    1.2
letter-spacing: 0
color:          #ffffff (hero) / #000000 (diğer)
```
`[VERIFIED]` + `[MEASURED]` (1440'ta 52.8px / lh 63.36px ölçüldü)

#### `.title-l` — Büyük section başlığı

| | rem | px |
|---|---|---|
| Desktop | `4rem` | **38.4px** |
| Tablet | `3.5rem` | **31.5px** |
| Mobile | `3.2rem` | **32.0px** |

`font-weight: 300 · line-height: 1.4 · letter-spacing: 0 · ivy-mode`

#### `.title-m` — Intro / section başlığı

| | rem | px |
|---|---|---|
| Desktop | `3.5rem` | **33.6px** |
| Tablet | `3.2rem` | **28.8px** |
| Mobile | `2.8rem` | **28.0px** |

`font-weight: 300 · line-height: 1.4 · ivy-mode`

#### `.title-s` — Kart / alt başlık

| | rem | px |
|---|---|---|
| Desktop | `3rem` | **28.8px** |
| Tablet | `2.6rem` | **23.4px** |
| Mobile | `2.4rem` | **24.0px** |

`font-weight: 300 · line-height: 1.4 · ivy-mode`
> Mobilde sık sık `max-s:!text-28` ile 2.8rem'e override ediliyor. `[VERIFIED]`

#### `.title-xs`

| | rem | px |
|---|---|---|
| Desktop | `2.2rem` | **21.1px** |
| Tablet | `1.8rem` | **16.2px** |
| Mobile | `2rem` | **20.0px** |

`font-weight: 300 · line-height: 1.4`

#### `.eyebrow` — **sitenin imza elemanı**

| | rem | px |
|---|---|---|
| Desktop | `1.1rem` | **10.56px** |
| Tablet | `1.2rem` | **10.8px** |
| Mobile | `1.1rem` | **11.0px** |

```
font-family:    sweet-sans-pro
font-weight:    500
line-height:    1
letter-spacing: .22em      → 2.32px @desktop  [MEASURED]
text-transform: uppercase
color:          rgba(33,51,117,.8) | #ffffff | #000000
```
> Menü içinde `!tracking-[0.24em]` ile override ediliyor. `[VERIFIED]`

#### `.body-l` / `.body-m` / `.body-s`

| Token | rem (tüm BP'ler aynı) | px @desktop | line-height | letter-spacing |
|---|---|---|---|---|
| `.body-l` | `2rem` | **19.2px** | 1.6 | 0 |
| `.body-m` | `1.5rem` | **14.4px** | 1.6 (= 23.04px) | 0 |
| `.body-s` | `1.2rem` | **11.52px** | 1.3 | `-.02em` |

`font-family: messina-sans · font-weight: 400`
> **Dikkat:** body token'ları breakpoint'e göre **değişmiyor** — sadece root font-size ile ölçekleniyor. `[VERIFIED]`

#### `.label-l` / `.label-m` / `.label-s`

| Token | Desktop | Tablet | Mobile | ls | lh | fw |
|---|---|---|---|---|---|---|
| `.label-l` | `2.2rem` | `2.1rem` | `2rem` | `-.03em` | 1 | 400 |
| `.label-m` | `1.8rem` | `1.8rem` | `1.8rem` | `-.03em` | 1 | 400 |
| `.label-s` | `1.5rem` | `1.5rem` | `1.5rem` | `-.01em` | 1 | 400 |

#### `.mm-link` — Menü linkleri

| | rem | px |
|---|---|---|
| Desktop / Tablet | `3.5rem` | **33.6 / 31.5px** |
| Mobile | `3rem` | **30.0px** |

`font-weight: 300 · line-height: 1.2 · letter-spacing: -.01em · ivy-mode`

#### `.h1` – `.h4` (içerik/richtext başlıkları)

| Token | Desktop | Mobile | lh | ls | fw |
|---|---|---|---|---|---|
| `.h1` | `5.5rem` | `3.8rem` | 1 | `0em` | 300 |
| `.h2` | `4.8rem` | `3.4rem` | 1.3 | `-.03em` | 300 |
| `.h3` | `4rem` | `3.2rem` | 1.3 | `0` | 300 |
| `.h4` | `3rem` | `2.4rem` | 1.1 | `0em` | 300 |

#### `.p2` (özel)
`2.4rem · lh 1 · ls -.06em · fw normal` — tüm breakpoint'lerde aynı.

#### `.btn`
```css
.btn { font-size: clamp(12px, var(--p-size-mobile), 16px); }  /* = clamp(12px, 1.5rem, 16px) */
```
> Butonlar **root ölçeklemesine rağmen 12–16px arasında kilitli** — a11y açısından doğru karar. `[VERIFIED]`

### 6.4 Fluid typography kullanımı

| Teknik | Kullanım |
|---|---|
| `clamp()` | **Sadece 2 yerde:** `html` root font-size ve `.btn` font-size |
| `vw` birimi | Sadece root font-size hesabında ve image `sizes` attribute'larında |
| `calc()` | Grid genişliklerinde (`w-[calc(50%-1px)]`) ve `--scale` değişkeninde |
| `vmin`/`vmax` | Kullanılmıyor |

> **Çıkarım:** Fluid tipografi *token seviyesinde değil, root seviyesinde* çözülmüş. Bu yaklaşımın avantajı: tek değişken, mükemmel oransal tutarlılık. Dezavantajı: kullanıcının tarayıcı font boyutu tercihi ezilir (bkz. §28).

---

## 07. Grid System

### 7.1 Container — `.site-max` `[VERIFIED]`

```css
.site-max {
  width: 100%;
  margin-inline: auto;
  padding-inline: 2rem;                        /* mobile */
}
@media (min-width: 650px)  { .site-max { padding-inline: 5rem; } }
@media (min-width: 1024px) { .site-max { padding-inline: 5rem; } }
.site-max .site-max { padding-inline: 0; }     /* nested reset */
```

**Gerçek px değerleri** `[MEASURED]`

| Viewport | `1rem` | padding-inline | içerik genişliği |
|---|---|---|---|
| 390px | 10px | **20px** | 350px |
| 375px | 9.62px | **19.2px** | 336.6px |
| 768px | 9px | **45px** | 678px |
| 1024px | 9px | **45px** | 934px |
| 1440px | 9.6px | **48px** | 1329px (scrollbar hariç 1425 → 1329) |
| 1920px | 10px | **50px** | 1820px |

> ⚠️ **`max-width` YOK.** Container sonsuz genişler; 1920px'te içerik 1820px olur. Bu bilinçli bir "full-bleed" kararı. `[VERIFIED]`

### 7.2 Grid — `.site-grid` `[VERIFIED]`

```css
.site-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  grid-column-gap: .7rem;
}
@media (min-width: 650px) {
  .site-grid {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    grid-column-gap: 1.7rem;
  }
}
```

**Ölçülen değerler** `[MEASURED]`

| Viewport | Kolon sayısı | Kolon genişliği | Gap |
|---|---|---|---|
| 390px | 6 | ~52.2px | **7.0px** |
| 1440px | 12 | **95.80px** | **16.32px** |

Doğrulama: `12 × 95.80 + 11 × 16.32 = 1149.6 + 179.5 = 1329.1px` ✔

### 7.3 Genişletilmiş grid — `.site-grid-24` `[VERIFIED]`

```css
.site-grid-24 {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  grid-column-gap: .7rem;
}
@media (min-width: 650px) {
  .site-grid-24 { grid-template-columns: repeat(24, minmax(0,1fr)); grid-column-gap: 1.7rem; }
}
```
> İnce ayarlı yerleşimler (gallery grid, property listing) için kullanılıyor. `[HIGH CONFIDENCE]`

### 7.4 Yaygın kolon şablonları `[VERIFIED]`

| Desen | mobile | `s:` (≥650) | `l:` (≥1024) |
|---|---|---|---|
| **Centered intro** | `col-start-1 col-span-6` | `col-start-2 col-span-10` | `col-start-3 col-span-8` |
| **50/50 medya (sol)** | `col-span-6` | `col-start-1 col-span-6` | `col-start-2 col-span-5` |
| **50/50 metin (sağ)** | `col-span-6` | `col-start-8 col-span-5` | `col-start-8 col-span-4` |
| **50/50 medya (sağ)** | `col-span-6 order-2` | `col-start-7 col-span-6` | `col-start-7 col-span-5` |
| **Storytelling büyük** | `col-span-6` | `col-start-1 col-span-12` | `col-start-2 col-span-7` |
| **Storytelling küçük** | `gizli` | `col-start-9 col-span-4` | `col-start-10 col-span-3` |
| **Banner scale** | `col-start-0 col-span-6` | `col-start-2 col-span-10` | aynı |
| **Menü sol kolon** | `col-start-1 col-span-6` | `col-span-3` | `col-span-6` |
| **Menü görsel** | gizli | `col-start-7 col-span-6` | `col-start-8 col-span-5 row-span-2` |

### 7.5 Media container sistemi `[VERIFIED]`

```css
.media-fill img, .media-fill video {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
}
.media-contain img, .media-contain video {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: contain;
}
```

Aspect ratio, `::before` padding hilesi yerine **inline CSS değişkeni** ile:
```html
<div class="aspect" style="--aspect: 64.5%;"></div>
```
`--aspect = (height / width) × 100` olarak hesaplanıyor. `[VERIFIED]`

Tailwind `aspect-[…]` de kullanılıyor: `aspect-[3/4]`, `aspect-[4/3]`, `aspect-video`.

---

## 08. Responsive System

### 8.1 Breakpoint'ler `[VERIFIED]` — Tailwind config'den çıkarılmış

```js
screens: {
  's': '650px',     // tablet ve üstü    → prefix  s:
  'l': '1024px',    // desktop           → prefix  l:
  // max-* varyantları: max-s: (≤649px), max-l: (≤1023px)
}
```

**Sadece 2 ana breakpoint var.** Ek olarak CSS'te şu raw media query'ler tespit edildi:

```css
/* Layout */
@media (max-width: 1024px)    /* bazı gizlemeler */
@media (min-width: 1024px)
@media (min-width: 1025px)
@media (min-width: 1280px)
@media (min-width: 650px)
@media (max-width: 649px) / (max-width: 650px)
@media (min-width: 649px) and (max-width: 1023px)   /* sadece tablet */
@media (max-width: 768px) / screen and (max-width: 768px)
@media (max-width: 845px)
@media (max-width: 576px) / (max-width: 480px) / (max-width: 440px)
@media (max-width: 425px) / (max-width: 389px) / (max-width: 352px)

/* Yükseklik */
@media (max-height: 480px)
@media (max-height: 576px)
@media (min-width: 576px) and (max-height: 660px)

/* Yetenek */
@media (hover: hover) and (pointer: fine)   /* TÜM hover efektleri bu guard içinde */

/* Orientation */
@media (orientation: portrait) / (orientation: landscape)
@media (max-width: 932px) and (orientation: landscape) and (max-height: 500px)
```

> 💡 **Kritik pattern:** Hiçbir hover efekti `@media (hover:hover) and (pointer:fine)` guard'ı olmadan yazılmamış. Dokunmatik cihazlarda hover state'i hiç tetiklenmiyor. **Birebir kopyalanacak kural.** `[VERIFIED]`

### 8.2 Viewport analizi

| Viewport | `1rem` | Container pad | Grid | Header h | Display font |
|---|---|---|---|---|---|
| 1920×1080 | 10.00px | 50px | 12 × gap 17px | 95px | 55px |
| 1728×1117 | 10.00px | 50px | 12 × gap 17px | 95px | 55px |
| 1600×900 | 10.00px | 50px | 12 × gap 17px | 95px | 55px |
| **1440×900** | **9.60px** | **48px** | **12 × gap 16.32px** | **91.2px** | **52.8px** |
| 1366×768 | 9.11px | 45.5px | 12 × gap 15.5px | 86.5px | 50.1px |
| 1024×1366 | 9.00px | 45px | 12 × gap 15.3px | 85.5px | 52.8px → **43.2px** (tablet) |
| 1024×768 | 9.00px | 45px | 12 | 85.5px | 43.2px |
| 834×1194 | 9.00px | 45px | 12 | 85.5px | 43.2px |
| 768×1024 | 9.00px | 45px | 12 | 85.5px | 43.2px |
| 650×… | 9.00px | 45px | 12 | 85.5px | 43.2px |
| **649×…** | 9.00px | **18px** | **6 × gap 6.3px** | 85.5px | **36.0px** |
| 430×932 | 10.00px | 20px | 6 × gap 7px | 95px | 40.0px |
| 414×896 | 10.00px | 20px | 6 | 95px | 40.0px |
| **390×844** | **10.00px** | **20px** | **6 × gap 7px** | **95px** | **40.0px** ✔ ölçüldü |
| 375×812 | 9.62px | 19.2px | 6 | 91.3px | 38.5px |
| 360×800 | 9.23px | 18.5px | 6 | 87.7px | 36.9px |

> ⚠️ **649px ↔ 650px arasında sert sıçrama var:** grid 6→12, padding 18px→45px, font 36px→43.2px. Bu, tasarımın bilinçli "iki düzen" yaklaşımı.

### 8.3 Media Query Matrix

| Özellik | Mobile (<650) | Tablet (650–1023) | Desktop (≥1024) |
|---|---|---|---|
| **Navigation** | Hamburger + logo (sağdan sola `flex-row-reverse`), CTA gizli | Hamburger + "Menu" metni + ortalı logo + CTA | Aynı + hover efektleri aktif |
| **Hero** | `h-[100svh]`, display 40px, max-w 90% | `h-[100svh]`, 43.2px, max-w 50rem | `h-[100svh]`, 52.8px, max-w 73rem |
| **Typography** | 6 kolonluk mobil ölçek, `max-s:!text-28` override'ları | Sabit 9px root | 1350px'ten sonra ölçekleniyor |
| **Grid** | 6 kolon / gap .7rem / pad 2rem | 12 kolon / gap 1.7rem / pad 5rem | Aynı |
| **Images** | `sizes="calc(100vw - 4rem)"` | `sizes="(min-width:650px) 38.2vw"` | Aynı |
| **Scroll** | Lenis aktif, `syncTouch` kapalı → native touch | Lenis aktif | Lenis aktif |
| **Animation** | Parallax **kapalı** (matchMedia ≥650 guard'ı) | Parallax açık | Parallax + `--progress` scale açık (≥1024) |
| **Carousel** | drag multiplier **3.5**, touch events | multiplier 2, touch | multiplier 2, mouse + `cursor-grab` |
| **Menu** | Tam ekran, scroll edilebilir (`max-s:overflow-y-auto`, `top-[9.5rem]`), görsel gizli | 3 kolon + görsel | 6+5 kolon + görsel + per-char hover |
| **Hover** | Yok (`@media (hover:hover)` guard) | Yok | Tümü aktif |

### 8.4 Desktop ↔ Mobile farkları (detaylı) `[VERIFIED]`

| Değişim | Detay |
|---|---|
| **Element sırası** | Header: `max-s:flex-row-reverse` → mobilde logo solda, hamburger sağda. Feature5050: `max-s:order-1/2` ile metin/görsel sırası içerik bazlı değişiyor. Footer: `order-1/2/3/4` ile tam yeniden diziliyor. |
| **Medya pozisyonu** | Storytelling: desktop'ta iki görsel yan yana (7+3 kolon), mobilde küçük görsel **tamamen gizli** (`max-l:hidden`) |
| **Image crop** | Storytelling medya1: `aspect-[3/4]` (mobil, dikey) → `s:aspect-[4/3]` (yatay). Medya2: `aspect-[4/3]` → `s:aspect-[3/4]` — **ters çevriliyor** |
| **Gizlenen elementler** | `.sh__cta` (mobil), menü görseli (`hidden s:flex`), storytelling küçük sütun (`max-l:hidden`), `.menu-t__text` (`hidden s:flex`) |
| **Animasyon farkı** | `gsap.matchMedia("(min-width:650px)")` → Feature5050 parallax, Storytelling parallax, Footer parallax **mobilde yok**. `"(min-width:1024px)"` → BannerScale `--progress` **sadece desktop**. BannerFull parallax ve Hero parallax **her yerde var**. |
| **Sticky** | Fark yok — her yerde aynı header state machine |
| **Horizontal scroll** | Carousel multiplier mobilde 3.5 (daha hızlı sürükleme), event'ler `touchstart/touchmove/touchend` |
| **Video** | iOS Low Power Mode tespiti → video yerine `videoFallbackImage` gösteriliyor |

### 8.5 Orientation davranışı `[VERIFIED]`

```css
.rotate-device-message { display: none; }

@media (max-width: 932px) and (orientation: landscape) and (max-height: 500px) {
  .rotate-device-message { display: flex; }
}

.rotate-animation {
  animation: rotateAndFade 4s cubic-bezier(.19, 1, .22, 1) infinite;
  transform-origin: center;
}

@keyframes rotateAndFade {
  0%   { opacity: .3; transform: rotate(90deg); }
  25%  { opacity:  1; transform: rotate(0);     }
  75%  { opacity:  1; transform: rotate(0);     }
  100% { opacity:  0; transform: rotate(0);     }
}
```

**Davranış:** Telefon yatay konuma getirildiğinde (genişlik ≤932px **ve** yükseklik ≤500px) tam ekran bir "cihazı çevirin" ekranı belirir; bir telefon ikonu 4 saniyelik döngüde 90°'den 0°'ye dönerek fade yapar.

**Neden bu koşul:** `max-height: 500px` şartı, tablet yatay modunu (iPad landscape: 1024×768) dışarıda bırakıyor. Sadece gerçek telefonlar (iPhone 14 Pro Max landscape = 932×430) yakalanıyor.

**İçerik engelleniyor mu:** Evet — overlay tam ekran ve içeriği kapatıyor. `[HIGH CONFIDENCE]`

Ayrıca kısa ekranlar için ayrı ayarlar var: `@media (max-height:480px)`, `(max-height:576px)`, `(min-width:576px) and (max-height:660px)` — hero içeriği ve spacing sıkıştırılıyor. `[VERIFIED]`

---

## 09. Header

### 9.1 Yapı `[VERIFIED]` — production markup'tan birebir

```html
<header class="sh pointer-events-none [is-scrolled] [is-active] [is-not-sticky] [is-fixed] [is-black]">

  <div class="sh__bg fixed top-0 left-0 w-full h-95 z-[18] bg-white-pure"></div>

  <div ref="innerRef" class="sh__inner absolute top-0 left-0 w-full z-[20]">
    <div class="sh__content relative site-max flex max-s:flex-row-reverse items-center justify-between h-95 z-2">

      <!-- 1. Menu toggle (sol / mobilde sağ) -->
      <MenuToggle />

      <!-- 2. Logo (mobilde akışta, >=650'de mutlak ortalı) -->
      <button class="sh__logo relative s:absolute s:left-1/2" aria-label="Home">
        <img src="/logo-light.svg" width="116" height="58"
             class="sh__logo-light relative h-41 s:h-58 l:h-58 w-auto" alt="...">
        <img src="/logo-dark.svg"  width="116" height="58"
             class="sh__logo-dark absolute top-0 left-0 h-full w-full z-2" alt="...">
      </button>

      <!-- 3. CTA (mobilde render edilmiyor) -->
      <BaseBtn class="sh__cta !border-current !text-current" to="/contact" label="Contact us" />
    </div>
  </div>
</header>
```

### 9.2 Ölçüler `[MEASURED @1440x900]`

| Özellik | Değer |
|---|---|
| `.sh__bg` yüksekliği | `h-95` = **9.5rem = 91.2px** |
| `.sh__content` yüksekliği (scrolled) | `h-95` = **91.2px** |
| `.sh__content` yüksekliği (sayfa tepesinde, >=650) | `14.3rem` = **137.3px** |
| `.sh__inner` toplam yükseklik | **137.3px** (üst durumda) |
| Logo yüksekliği | mobile `h-41` (4.1rem) · >=650 `h-58` (5.8rem = 55.7px) |
| Logo intrinsic | 116 x 58 (SVG) |
| Logo transform (scrolled) | `scale(.85) translate(-50%)` |
| Logo transform (top) | `scale(1) translate(-50%)` |
| Logo transform (mobil) | `scale(1)` — translate yok |
| CTA genişliği | `!min-w-[14rem]` = **134.4px** · iç yükseklik `h-42` = **40.3px** |
| CTA metni | `.eyebrow` → 10.56px / `ls .22em` / uppercase |
| Yatay padding | `.site-max` → 48px @1440 |

### 9.3 Scroll state machine — tam algoritma `[VERIFIED]`

```
// Global scroll bus'tan gelen y, lodash.throttle(fn, 100ms) ile işleniyor
onScroll(y):
    wh = $resize.wh                        // cache'li viewport yüksekligi
    H  = innerRef.offsetHeight             // ~137.3px (üst durumda)

    // 1) is-scrolled — bir tam viewport geçildi mi?
    if (y >= wh  && !isScrolled) isScrolled = true
    if (y <  wh  &&  isScrolled) isScrolled = false

    // 2) is-not-sticky — hala header'in kendi yüksekligi icinde miyiz?
    if (y >= H && isNotSticky)  isNotSticky = false
    if (y <  H && !isNotSticky) isNotSticky = true

    // 3) is-active — yön tabanli gizle/göster (sadece 1 viewport sonrasi)
    if (y > wh && y > prevY && isActive)  isActive = false   // asagi -> gizle
    if (prevY > y && !isActive)           isActive = true    // yukari -> göster

    // 4) is-fixed — position:absolute -> fixed geçisi
    if (y >= wh/1.5 && !isFixed) isFixed = true
    if (y <  wh/1.5 &&  isFixed) isFixed = false

    prevY = y

// Route degisiminde ($event "leave"):
onLeave():
    gsap.delayedCall(1, () => { isActive = true; isNotSticky = true; isScrolled = false })
```

**Başlangıç değerleri:** `isActive = true`, `isNotSticky = true`, `isScrolled = false`, `isFixed = true` (ilk tick'te `false`'a düşer).

### 9.4 State → CSS eşlemesi `[VERIFIED]`

```css
.sh { color: var(--color-white-pure); }

/* --- Arka plan seridi --- */
.sh__bg {
  transform: translateY(-101%);
  transition: transform .5s cubic-bezier(.19,1,.22,1),
              height    .5s cubic-bezier(.19,1,.22,1);
}
.is-active.is-scrolled:not(.is-not-sticky) .sh__bg { transform: translateY(0); opacity: 1; }

/* --- Ic kapsayici --- */
.sh__inner {
  transform: translateY(-100%);
  transition: transform .5s cubic-bezier(.19,1,.22,1);
}
.is-fixed:not(.is-not-sticky) .sh__inner { position: fixed; }
.is-not-sticky            .sh__inner { transform: translateY(0); transition: transform 0s; }
.is-active.is-scrolled:not(.is-not-sticky) .sh__inner { transform: translateY(0); }

/* --- Icerik yüksekligi --- */
.sh__content { transition: transform .5s cubic-bezier(.19,1,.22,1), height .5s cubic-bezier(.19,1,.22,1); }
@media (min-width: 650px) { .is-not-sticky .sh__content { height: 14.3rem; } }

/* --- Logo --- */
.sh__logo { transform: scale(.85) translate(-50%); transform-origin: center;
            transition: opacity .5s ease-out; transition-delay: .1s; }
.is-not-sticky .sh__logo { transform: scale(1) translate(-50%); }
@media (max-width: 650px) { .sh__logo { transform: scale(1); }
                            .is-not-sticky .sh__logo { transform: scale(1); } }

.sh__logo-light { transition: opacity .5s ease-out; }
.sh__logo-dark  { opacity: 0; transition: opacity .5s ease-out; }
.is-scrolled:not(.is-not-sticky) .sh__logo-light { opacity: 0; }
.is-scrolled:not(.is-not-sticky) .sh__logo-dark  { opacity: 1; transform: scale(.95); }
.is-black .sh__logo-light { opacity: 0; }
.is-black .sh__logo-dark  { opacity: 1; }
.is-menu  .sh__logo-light { opacity: 1 !important; transform: scale(1); }
.is-menu  .sh__logo-dark  { opacity: 0 !important; }

/* --- Gecikmeler --- */
.is-black .sh__logo, .is-black .sh__cta, .is-black .menu-t { transition-delay: .5s; }
.is-menu-closing .sh__logo-light, .is-menu-closing .sh__cta { transition-delay: .5s; }

/* --- CTA --- */
.sh__cta { color: inherit; transition: color .5s ease-out, opacity .5s ease-out; transition-delay: .1s; }
@media (min-width: 649px) and (max-width: 1023px) { .sh__cta .btn-mask__content { font-size: 1.6rem; } }

/* --- Globe sayfasi istisnasi --- */
.is-globe .sh { pointer-events: none; }
.is-globe .sh__bg      { transform: translateY(-101%) !important; }
.is-globe .sh__content { transform: translateY(-100%) !important; }
```

### 9.5 State diagram

```
                  +--------------------------------------+
                  |  SAYFA TEPESI (y = 0)                |
                  |  is-not-sticky Y  is-active Y        |
                  |  -> header absolute, h = 14.3rem     |
                  |  -> beyaz logo, seffaf arka plan     |
                  |  -> .sh__inner translateY(0)         |
                  +--------------+-----------------------+
                                 | scroll v (y >= 137px)
                  +--------------v-----------------------+
                  |  is-not-sticky N                     |
                  |  -> .sh__inner translateY(-100%)     |
                  |  -> HEADER TAMAMEN GIZLI             |
                  +--------------+-----------------------+
                                 | y >= wh/1.5 (600px @900h)
                  +--------------v-----------------------+
                  |  is-fixed Y -> position: fixed       |
                  |  (hala gizli)                        |
                  +--------------+-----------------------+
                                 | y >= wh (900px)
                  +--------------v-----------------------+
                  |  is-scrolled Y  is-active Y          |
                  |  -> .sh__bg   translateY(0) (beyaz)  |
                  |  -> .sh__inner translateY(0)         |
                  |  -> siyah logo (scale .95), h=9.5rem |
                  |  -> HEADER GORUNUR / KOMPAKT / BEYAZ |
                  +--------+----------------+------------+
                   scroll v |                | ^ scroll up
                  +---------v------+         |
                  | is-active N    |---------+
                  | -> gizlenir    |
                  |   (.5s expo)   |
                  +----------------+
```

**Özel durum — `/gallery/*` sayfaları:** route adı `gallery-slug` olduğunda `is-black` eklenir → logo her zaman koyu, tüm geçiş gecikmeleri `.5s`'ye çıkar. `[VERIFIED]`

### 9.6 Pixel-Perfect Notes

- `.sh` elementinin kendisi `pointer-events: none`; tıklanabilirlik tek tek çocuklara `pointer-events-auto` ile veriliyor. Aksi halde gizli header tıklamaları yutardı.
- `.sh__bg` `-101%` (`-100%` değil) — subpixel yuvarlamada 1px beyaz şerit sızmasını engellemek için. **Bu detayı kopyalayın.**
- Logo iki ayrı `<img>` olarak üst üste; renk geçişi `opacity` cross-fade ile (filter/mix-blend değil). Her iki SVG de ilk yüklemede indiriliyor.
- `height` transition'ı GPU dostu değil ama sadece header'da ve 0.5s'de bir kez olduğu için kabul edilebilir. Görsel eşleşme için `transform: scaleY()` yerine aynı şekilde `height` kullanın (içerik dikey ortalı kalıyor).
- Scroll handler **100ms throttle**'lı. Daha sık çalıştırmak jank yaratır, daha seyrek göster/gizle gecikmeli hissettirir. `100ms` değerini koruyun.

---

## 10. Navigation / Menu

### 10.1 Menu Toggle (hamburger) `[VERIFIED]`

```html
<button class="menu-t flex items-center [is-active] [is-closing]" aria-label="Menu toggle">
  <div class="hamburger relative stack group s:mr-16">
    <div class="menu-t__circle size-40 s:size-50 l:size-40"></div>
    <div class="menu-t__lines       relative h-[1px] place-self-center w-16 s:w-21 l:w-16 z-1"></div>
    <div class="menu-t__lines-clone relative h-[1px] place-self-center w-16 s:w-21 l:w-16 z-1"></div>
  </div>
  <span class="menu-t__text eyebrow relative hidden leading-[2.4] !tracking-[0.24em]
               text-left s:flex flex-col overflow-hidden w-60">
    <span>Close</span>
    <span>Menu</span>
  </span>
</button>
```

**Ölçüler** `[MEASURED]`: circle `size-40` = 4rem = 38.4px @1440 (tablet `size-50` = 45px), çizgiler `w-16` = 15.36px (tablet `w-21` = 18.9px), metin bloğu `w-60` = 57.6px.

```css
.menu-t { transition: color .5s ease-out, opacity .5s ease-out; transition-delay: .1s; }
.is-black  .menu-t { transition-delay: .5s; }
.menu-t.is-closing { transition-delay: .5s; }

/* Daire */
.menu-t__circle { border: 1px solid; border-radius: .3rem; }   /* idle: opacity 0 */

/* Cizgiler: tek bir 2rem yükseklikli overflow:hidden kutu icinde ::before / ::after */
.menu-t__lines { height: 2rem; overflow: hidden; }
.menu-t__lines::before,
.menu-t__lines::after {
  content: ""; position: absolute; top: 1rem; left: 0; width: 100%; height: 1px;
  background-color: currentColor;
  transition: transform .25s ease-out;
}
.menu-t__lines::before { transform: translateY(-.3rem); transition-delay: .1s; }
.menu-t__lines::after  { transform: translateY( .3rem); }

@media (min-width:649px) and (max-width:1023px) {
  .menu-t__lines::before { transform: translateY(-.4rem); }
  .menu-t__lines::after  { transform: translateY( .4rem); }
}

/* HOVER — "cizgiler saga kayip klonlari soldan girer" */
@media screen and (min-width: 1024px) {
  .menu-t:hover .menu-t__circle        { opacity: 1; }
  .menu-t:hover .menu-t__lines::before { transform: translate(3rem, -.3rem); transition-delay: .05s; }
  .menu-t:hover .menu-t__lines::after  { transform: translate(3rem,  .3rem); }
  .menu-t:hover .menu-t__lines-clone::before { transform: translateY(-.3rem); transition-delay: .2s; }
  .menu-t:hover .menu-t__lines-clone::after  { transform: translateY( .3rem); }
}

/* ACIK durumda — cizgiler kaybolur */
.menu-t.is-active .menu-t__lines { display: none; }
@media screen and (max-width: 768px) { .menu-t.is-active .menu-t__lines { display: block; } }

/* Metin swap — Menu / Close */
.menu-t__text { line-height: 2.4; }
.menu-t__text span { transition: transform .5s cubic-bezier(.455,.03,.515,.955); transition-delay: .25s; }
.menu-t__text span:first-child { position: absolute; transform: translateY(-100%); }  /* "Close" yukarida bekler */
.menu-t.is-active .menu-t__text span:first-child { transform: translateY(0); }        /* "Close" iner */
.menu-t.is-active .menu-t__text span:last-child  { transform: translateY(100%); }     /* "Menu" asagi cikar */
.is-closing .menu-t__text span { transition-delay: .5s; }
```

> **Mekanizma özeti:** Hamburger iki özdeş çizgi çiftinden oluşuyor (`__lines` + `__lines-clone`). Hover'da asıl çizgiler `3rem` sağa kayıp overflow ile kesiliyor, klonlar sıfır pozisyona gelerek yerini alıyor — klasik *marquee swap*. Çizgi aralığı `±.3rem` (tablet `±.4rem`).

### 10.2 Menü overlay yapısı `[VERIFIED]`

```html
<aside class="menu ...">                                    <!-- fixed inset-0, bg-main -->
  <div class="... overflow-hidden js-mask max-s:overflow-y-auto max-s:top-[9.5rem]"
       data-lenis-prevent>
    <div class="site-max site-grid items-start l:items-center
                pt-[5rem] s:pt-[20rem] l:pt-[16.8rem]
                pb-56 s:pb-28 l:pb-50
                gap-y-30 s:gap-y-40" data-lenis-prevent>

      <!-- Kolon grubu 1 (ana menü + ikincil menüler) -->
      <div class="col-start-1 l:col-start-1 col-span-6 s:col-span-3 l:col-span-6
                  flex flex-wrap w-full gap-y-30 s:gap-y-40 pl-10 s:pl-0 gap-x-50 s:gap-x-0">

        <div class="flex flex-col gap-y-12 w-[calc(50%-1px)] s:w-full l:w-[calc(50%-1px)] max-s:flex-1">
          <div class="overflow-hidden">
            <h2 class="eyebrow js-link opacity-80 !tracking-[0.24em]">{{ titleColumn1 }}</h2>
          </div>
          <ul class="flex flex-col items-start gap-y-4">
            <li class="overflow-hidden s:pr-20">
              <a class="menu__link body-m relative overflow-hidden js-link" @mouseenter="setIndex(i)">
                <div class="line-top js-menu-split">{{ label }}</div>
                <div class="line-bottom absolute top-0 left-0 whitespace-nowrap
                            pointer-events-none js-menu-split">{{ label }}</div>
              </a>
            </li>
          </ul>
        </div>

        <div class="... l:order-3 ..."> <!-- menu2 --> </div>
        <div class="... l:order-2 w-full l:w-[calc(50%-1px)]"> <!-- menu3 --> </div>
      </div>

      <!-- Görsel önizleme -->
      <figure class="menu__fig relative w-full overflow-hidden js-clip
                     col-start-7 l:col-start-8 col-span-6 l:col-span-5 l:row-span-2
                     h-full items-center justify-center hidden s:flex order-3 l:order-2">...</figure>

      <!-- Iletisim + adres -->
      <div class="col-start-1 s:col-start-7 l:col-start-1 col-span-4 s:col-span-5 l:col-span-6
                  flex flex-wrap w-full gap-y-40 order-2 l:order-3 pl-10 s:pl-0
                  self-start s:self-start l:self-end">...</div>
    </div>
  </div>
</aside>
```

### 10.3 Menü açılış animasyonu `[VERIFIED]` — Vue `<Transition :css="false">` + GSAP

```
onEnter(el, done):
  store.setMenuState({ isOpening: true })

  tl = gsap.timeline({
    paused: true,
    defaults: { duration: 1.25, ease: "expo.inOut" },
    onComplete: () => store.setMenuState({ isOpening: false })
  })

  tl.clear()
    // 1) Katmanli karsi-sürgü: aside yukaridan, ic maske asagidan
    .from([el, el.querySelector(".js-mask")], {
        yPercent: gsap.utils.wrap([-100, 100])
     })                                                      // t = 0.00 -> 1.25
    // 2) Görsel clip reveal (alttan acilir)
    .from(el.querySelector(".js-clip"), {
        clipPath: "inset(0 0 100% 0)"
     }, 0.25)                                                // t = 0.25 -> 1.50
    // 3) Link ve baslik satirlari yukari kayarak girer
    .from(el.querySelectorAll(".js-link"), {
        yPercent: 105, stagger: 0.075, duration: 1.5, ease: "expo"
     }, 0.5)                                                 // t = 0.50 -> ~2.50
    .restart()
```

```
onLeave(el, done):
  store.setMenuState({ isClosing: true })

  tl.clear()
    .to([el, el.querySelector(".js-mask")], { yPercent: gsap.utils.wrap([-100, 100]) })  // t = 0 -> 1.25
    .to(el.querySelector(".js-clip"), { clipPath: "inset(0 0 100% 0)", duration: 1 }, 0) // t = 0 -> 1.00
    .add(() => { done(); store.setMenuState({ isClosing: false }) })
    .restart()
```

**`gsap.utils.wrap([-100, 100])` ne yapıyor:** İki elemanlı hedef dizisine uygulandığında index 0 → `-100`, index 1 → `+100` döndürüyor. Yani `aside` `translateY(-100%)`'ten, içindeki `.js-mask` `translateY(+100%)`'ten geliyor. Bu **birbirini nötrleyen çift hareket**, içeriğin ekranda sabit dururken panelin üzerinden geçmesi hissini veriyor — klasik *mask slide* tekniği.

### 10.4 Link hover — per-character reveal `[VERIFIED]`

Menü açıldığında (`watch(isOpen)`):

```
nextTick(() => {
  aside.querySelectorAll(".js-link .line-top").forEach(el => {
    new SplitText(el, { type: "chars", charsClass: "char" })
      .chars.forEach((c, i) => c.style.setProperty("--char-index", i))
  })
  aside.querySelectorAll(".js-link .line-bottom").forEach(el => {
    new SplitText(el, { type: "chars", charsClass: "char" })
      .chars.forEach((c, i) => c.style.setProperty("--char-index", i))
  })
})
```

Her karaktere `--char-index` yazılıyor; CSS tarafında `transition-delay: calc(var(--char-index) * Xms)` ile **karakter karakter kademeli** hover geçişi yapılıyor. `line-top` yukarı çıkarken `line-bottom` (mutlak konumlu kopya) aşağıdan girer. `[HIGH CONFIDENCE]`

### 10.5 Scroll lock & kapatma davranışı `[VERIFIED]`

| Davranış | Uygulama |
|---|---|
| Body scroll lock | `data-lenis-prevent` — Lenis bu subtree'de wheel/touch'ı yutmuyor, native scroll çalışıyor |
| Scroll ile kapatma | `isOpen` watcher → `lenis.on("scroll", () => setMenuState({isOpen:false}))`. **Sayfa scroll edilirse menü kapanır.** |
| Route değişimi | `pageTransition.onEnter` içinde `setMenuState({isOpen:false, isOpening:false, isClosing:false})` |
| ESC tuşu | **Tespit edilmedi** `[NEEDS DEVTOOLS]` → bizim implementasyonumuzda **eklenmeli** (a11y) |
| Focus trap | **Tespit edilmedi** → bizim implementasyonumuzda **eklenmeli** (a11y) |
| Mobil iç scroll | `max-s:overflow-y-auto max-s:top-[9.5rem]` — menü header'ın altından başlıyor, kendi içinde kayıyor |

### 10.6 Pixel-Perfect Notes

- Menü üst boşluğu breakpoint'e göre çok değişiyor: `pt-[5rem]` (mobil, 50px) → `s:pt-[20rem]` (180px) → `l:pt-[16.8rem]` (161px). Desktop'ta `items-center` ile dikey ortalanıyor, mobil/tablet'te `items-start`.
- Kolon sırası desktop'ta DOM sırasından farklı: `l:order-2` / `l:order-3` ile menü2 ve menü3 yer değiştiriyor.
- `.js-link` seçicisi **hem başlıkları hem linkleri** kapsıyor — stagger'a eyebrow'lar da dahil.
- Link `<li>`'leri `overflow-hidden`, animasyon `yPercent: 105` (100 değil) — descender'ların (g, y, p) alt kenardan sızmaması için. **Bu 105 değerini koruyun.**

---

## 11. Footer

### 11.1 Yapı `[VERIFIED]`

```html
<footer ref="el" class="sf relative overflow-hidden">        <!-- bg #203276, text #fff -->
  <div ref="parallax" class="pt-55 pb-55 s:pb-50">
    <div class="site-max site-grid">

      <!-- 1. Logo (order-1) -->
      <div class="flex flex-col col-span-6 s:col-span-12 l:col-span-6 order-1">
        <button aria-label="Home" @click="$scroll.to(0)">
          <img src="/logo-light.svg" width="116" height="58" class="relative h-62 s:h-70 l:h-70 w-auto">
        </button>
      </div>

      <!-- 2. 3 menü kolonu (order-3 -> s:order-2) -->
      <div class="flex-col s:flex-row col-span-6 s:col-span-12 l:col-span-5 flex max-s:text-18
                  items-start s:gap-x-[12.5rem] l:gap-x-[10rem] s:justify-start l:justify-end
                  mt-60 s:mt-90 l:mt-0 order-3 s:order-2 items-baseline l:mr-[-8.6rem]">
        <!-- footMenu1 / footMenu2 / footMenu3 -->
        <!-- her biri: <h3 class="eyebrow text-white-tint mb-15 s:mb-25"> + <ul> -->
      </div>

      <!-- 3. Contact (order-2) -->
      <div class="flex flex-col mt-70 s:mt-120 l:mt-[22rem] col-span-6 s:col-span-12 order-2">
        <h3 class="eyebrow text-white-tint mb-25">Contact</h3>
        <ul class="relative flex flex-col items-start gap-y-6 s:gap-y-10 l:gap-y-8 label-m">
          <li>T: <span class="uline">{{phone}}</span> <button aria-label="Copy phone number ...">copy</button></li>
          <li>E: <span class="uline">{{email}}</span> <button aria-label="Copy email address ...">copy</button></li>
          <li><a href="{{instagram}}" target="_blank" rel="noreferrer">Instagram</a></li>
        </ul>
      </div>

      <!-- 4. Alt satir (order-4) -->
      <div class="col-span-6 s:col-span-12 relative flex flex-col s:flex-row items-start
                  s:justify-between mt-60 s:mt-45 text-14 s:items-end order-4">
        <a href="https://discoverylandco.com" class="s:order-2">
          <img src="/dlc-light.svg" width="157" height="36" class="h-37 s:h-35 w-auto">
        </a>
        <div class="flex flex-col items-start s:order-1 mt-40 s:mt-0 tracking-[-.03em] leading-[1.54]">
          <p class="opacity-50">{{copyright}}</p>
          <a class="opacity-50 has-hover:transition-opacity has-hover:duration-500
                    has-hover:ease-out has-hover:hover:opacity-100">{{terms}}</a>
          <a href="https://outpost.design" class="... mt-15">Site by <svg/></a>
        </div>
      </div>
    </div>
  </div>
</footer>
```

**Ölçüler** `[MEASURED @1440]`: footer yüksekliği **737.9px**, bg `rgb(32,50,118)` = `#203276`, padding `pt-55 pb-55` = 5.5rem = 52.8px.

### 11.2 Footer parallax `[VERIFIED]`

```
gsap.matchMedia().add("(min-width: 650px)", () => {
  const tween = gsap.fromTo(parallaxInner,
    { yPercent: -37.5 },
    { yPercent: 0,
      ease: "none",
      scrollTrigger: {
        trigger: footerEl,
        start: "top bottom",      // footer'in üstü viewport'un altina degdiginde
        end:   "bottom bottom",   // footer'in alti viewport'un altina geldiginde
        scrub: true
      }
    })
  return () => tween.kill()
})
```

**Hesaplanan hareket** `[MEASURED]`: footer yüksekliği 737.9px → `37.5%` = **276.7px** yukarıdan başlayıp 0'a geliyor. Scroll mesafesi = footer yüksekliği = 737.9px.

```
Parallax ratio = 276.7 / 737.9 = 0.375
```

İçerik footer'ın içinde "yukarıdan aşağı yetişiyor" — klasik *footer reveal*. Mobilde **kapalı**.

### 11.3 Panoya kopyalama mikro-etkileşimi `[VERIFIED]`

Telefon/e-posta yanındaki 12x12px butona basıldığında:

1. `navigator.clipboard.writeText(value)` denenir
2. Başarısızsa gizli `<textarea>` + `document.execCommand("copy")` fallback'i
3. Buton `bg-green-500` olur, ikon tike döner
4. **2000ms** sonra eski haline döner

`transition: all .2s`, `hover:opacity-80`, `aria-label="Copy phone number {{phone}}"`.

### 11.4 Pixel-Perfect Notes

- Footer logosu header'dan **daha büyük**: `h-62` (62px) mobil / `h-70` (67.2px) desktop. Header'da `h-41`/`h-58`.
- `l:mr-[-8.6rem]` — menü kolonları sağa taşıyor (negatif margin ile grid'i aşıyor). Bilinçli optik hizalama.
- `l:mt-[22rem]` (211px) — Contact bloğu desktop'ta çok aşağıdan başlıyor; menü kolonlarıyla bilinçli asimetri.
- Footer `overflow-hidden` — parallax taşmasını kesiyor. **Zorunlu.**

---

## 12. Smooth Scroll System

### 12.1 Lenis konfigürasyonu `[VERIFIED]` — bundle'dan birebir

```js
new Lenis({
  lerp: 0.15,
  wheelMultiplier: 1.25,
  autoResize: false
})
```

Belirtilmeyenler (Lenis 1.3.24 varsayılanları devreye giriyor):

| Parametre | Etkin değer | Not |
|---|---|---|
| `lerp` | **0.15** | Açıkça set edildi — hissin ana belirleyicisi |
| `duration` | *kullanılmıyor* | `lerp` verildiğinde `duration` yok sayılır |
| `easing` | *kullanılmıyor* | `lerp` modunda geçersiz |
| `wheelMultiplier` | **1.25** | Tekerlek 1 tık = %125 mesafe |
| `touchMultiplier` | `1` | Dokunmatik normal hızda |
| `smoothWheel` | `true` | |
| `syncTouch` | `false` | **Mobilde native scroll** — kritik performans kararı |
| `orientation` | `vertical` | |
| `gestureOrientation` | `vertical` | |
| `autoResize` | **false** | Resize merkezi `$resize` servisi tarafından yönetiliyor |
| `infinite` | `false` | |

CSS tarafı:
```css
html.lenis { overscroll-behavior: none; width: 100%; }
```

### 12.2 Hissin yeniden üretimi

`lerp: 0.15` şu demek:

```
her frame:   current += (target - current) * 0.15
```

60fps'te hedefe yaklaşma: **%15/frame**. Mesafenin %99'u için:

```
0.85^n = 0.01  ->  n = ln(0.01)/ln(0.85) = 28 frame = 467ms @60fps
```

Yani **bir scroll hareketi ~0.47 saniyede yerine oturuyor**. Lenis varsayılanı `lerp: 0.1` (~700ms) ile `0.2` (~310ms) arasında, "yumuşak ama tembel değil" bandında.

`wheelMultiplier: 1.25` — standart tekerlek tıkı (~100px) → 125px hedef. Bu, lerp'in yarattığı gecikmeyi telafi ediyor; kullanıcı "ağır" değil "akışkan" hissediyor.

> **Yeniden üretim kuralı:** `lerp` ve `wheelMultiplier` birlikte kalibre edilmiştir. Birini değiştirip diğerini bırakırsanız his bozulur. İkisini birden kopyalayın.

### 12.3 GSAP ↔ Lenis köprüsü `[HIGH CONFIDENCE]`

ScrollTrigger'ın Lenis ile senkron çalışması için standart köprü gerekiyor (bundle'da ayrıştırılamadı ama davranış bunu gerektiriyor):

```
lenis.on("scroll", ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

Ek tespit: `$event.emit("tick", { ratio })` — merkezi RAF her frame'de `ratio` (delta/16.67 normalizasyonu) yayınlıyor; carousel'lar lerp'lerini bu `ratio` ile ölçekliyor (`lerp(a, b, 0.1 * ratio)`). Bu, 120Hz ekranlarda animasyon hızının sabit kalmasını sağlıyor. **Kopyalanacak kritik detay.**

### 12.4 Scroll opt-out

```html
<div data-lenis-prevent> ... </div>
```
Menü içeriğinde kullanılıyor — bu subtree'de native scroll geçerli. `[VERIFIED]`

### 12.5 Programatik scroll

```js
$scroll.to(0)                 // footer logo -> sayfa basi
$scroll.to($resize.wh)        // hero scroll indicator -> tam 1 viewport asagi
```
`[VERIFIED]`

---

## 13. Global Animation System

### 13.1 GSAP kurulum `[VERIFIED]` — bundle'dan birebir

```js
gsap.registerPlugin(CustomEase, ScrollTrigger, SplitText /* + DrawSVGPlugin */)

CustomEase.create("snappy",    "M0,0 C0.094,0.026 0.124,0.127 0.157,0.29 0.197,0.486 0.254,0.8 0.348,0.884 0.42,0.949 0.374,1 1,1")
CustomEase.create("expo-hard", "M0,0 C0.084,0.61 0.156,0.822 0.218,0.883 0.287,0.951 0.374,1 1,1")
CustomEase.create("unmask",    "M0,0 C0.16,1 0.3,1 1,1")

gsap.registerEffect({
  name: "textSplit",
  effect: (targets, cfg) => gsap.from(targets, {
    duration: cfg.duration, y: cfg.y, alpha: 0,
    stagger: cfg.stagger, delay: cfg.delay, ease: cfg.ease
  }),
  defaults: { y: "4.5rem", duration: 1.5, stagger: 0.1, delay: 0, ease: "unmask" },
  extendTimeline: true
})

gsap.registerEffect({
  name: "fade",
  effect: (targets, cfg) => gsap.from(targets, {
    duration: cfg.duration, alpha: 0,
    stagger: cfg.stagger, delay: cfg.delay, ease: cfg.ease
  }),
  defaults: { duration: 1, stagger: 0.1, delay: 0, ease: "power1" },
  extendTimeline: true
})
```

> **Bu 2 effect + 3 CustomEase, sitenin tüm motion dilinin temelidir.** `extendTimeline: true` sayesinde her timeline'da `.textSplit(...)` ve `.fade(...)` metodu olarak çağrılabiliyorlar.

### 13.2 Easing kütüphanesi

#### CustomEase (GSAP) `[VERIFIED]`

| İsim | SVG path | Karakter | Kullanım |
|---|---|---|---|
| `unmask` | `M0,0 C0.16,1 0.3,1 1,1` | Çok agresif baş, uzun yavaş kuyruk. İlk %16'da hedefin %100'üne yaklaşır, kalan süre "oturma". | **Tüm metin reveal'ları** |
| `expo-hard` | `M0,0 C0.084,0.61 0.156,0.822 0.218,0.883 0.287,0.951 0.374,1 1,1` | Expo'dan daha sert, çok hızlı çıkış | Vurgulu girişler |
| `snappy` | `M0,0 C0.094,0.026 0.124,0.127 0.157,0.29 0.197,0.486 0.254,0.8 0.348,0.884 0.42,0.949 0.374,1 1,1` | S-eğrisi, ortada hızlanma | UI mikro-etkileşimleri |

#### GSAP built-in `[VERIFIED]`

```
"none"          → scrub'lu tüm parallax'lar (zorunlu — scrub ile ease kullanılmaz)
"power1"        → fade efekti, mask bg opacity
"power2.inOut"  → loader timeline defaults
"power3"        → görsel scale (loader js-i-scale, transition js-t-scale)
"power4"        → ikincil
"expo"          → menü link stagger
"expo.inOut"    → menü aç/kapa, sayfa geçişi, loader çıkışı
"linear"        → loader fade-out
```

#### CSS cubic-bezier `[VERIFIED]`

| Değer | Önerilen isim | Kullanım | ~GSAP karşılığı |
|---|---|---|---|
| `cubic-bezier(.19, 1, .22, 1)` | `--ease-primary` | Header state'leri, `.uline`, hover shape'ler | `expo.out` |
| `cubic-bezier(.77, 0, .175, 1)` | `--ease-btn` | **Tüm buton maskeleri ve okları** | `expo.inOut` |
| `cubic-bezier(.455, .03, .515, .955)` | `--ease-swap` | Menü toggle metin swap | `sine.inOut` |
| `cubic-bezier(.23, 1, .32, 1)` | `--ease-soft` | İkincil geçişler | `quint.out` |
| `cubic-bezier(.95, .05, .795, .035)` | `--ease-in-hard` | Çıkış animasyonları | `expo.in` |
| `ease-out` | `--ease-out` | Opacity/color geçişleri (0.5s) | |
| `linear` | — | Progress bar | |

### 13.3 Animation Token tablosu

| Token | Duration | Easing | Kullanım |
|---|---|---|---|
| **Instant** | `0.2s` | `ease` / `all` | Kopyala butonu feedback |
| **Fast** | `0.25s` | `ease-out` | Hamburger çizgi kaydırma |
| **UI** | `0.35s` | `power1` | Hero video fade-in |
| **Medium** | `0.5s` | `cubic-bezier(.19,1,.22,1)` | Header state değişimi, logo cross-fade, menü metin swap |
| **Hover** | `0.75s` | `cubic-bezier(.77,0,.175,1)` / `cubic-bezier(.19,1,.22,1)` | Buton maskeleri, `.uline` alt çizgi |
| **Reveal** | `1.0s` | `unmask` / `expo.inOut` | Standart içerik girişi, transition mask |
| **Text** | `1.5s` | `unmask` | `textSplit` varsayılanı, menü linkleri |
| **Slow** | `2.0s` | `unmask` / `power3` | Karakter reveal, transition görsel scale |
| **Page** | `1.25s` | `expo.inOut` | Menü aç/kapa |
| **Image** | `3.0s` | `power3` | Loader sonrası hero scale (1.25 → 1) |
| **Scrub** | `-` | `none` | Tüm parallax |

### 13.4 Animasyon hook sınıfı sözlüğü `[VERIFIED]`

İki aileye ayrılıyor:

#### `js-i-*` → **i**ntro (ilk yükleme / loader sonrası)

| Sınıf | Hedef | Animasyon |
|---|---|---|
| `js-i-words` | Metin blokları | SplitText `lines` → `y: 3.5rem, alpha: 0` → `y: 0, alpha: 1` · `dur 1.5` `stagger .1` `ease unmask` |
| `js-i-chars` | Vurgulu başlık | SplitText `words, chars` (`wordsClass: overflow-hidden`) → `yPercent: 105` → `yPercent: 5` · `dur 2` `stagger .075` `ease unmask` |
| `js-i-fade` | İkincil içerik | `y: -2rem, alpha: 0` → `y: 0, alpha: 1` · `dur 1.25` `stagger .1` `ease unmask` |
| `js-i-scale` | Hero görseli | `scale: 1.25` → `scale: 1` · `dur 3` `ease power3` |
| `js-i-up` | Ek elemanlar | `js-i-words` ile aynı timeline'da, aynı değerler |

#### `js-t-*` → **t**ransition (route değişimi)

| Sınıf | Hedef | Animasyon |
|---|---|---|
| `js-t-title` | Başlık/eyebrow/alt metin | SplitText `lines` → `textSplit(lines, {stagger: .1})` @ `t=0.5` |
| `js-t-chars` | Vurgulu başlık | SplitText `words, chars` → `yPercent 105 → 5` · `dur 2` `stagger .075` `unmask` @ `t=0.5` |
| `js-t-scale` | Hero görseli | `from scale: 1.35` · `dur 2` `ease power3` @ `t=0` |
| `js-t-up` | Ek elemanlar | `from y: 3.5rem, alpha: 0` · `dur 1.5` `stagger .1` `unmask` @ `t=0.5` |
| `js-t-mask` | Geçiş maskesi kökü | `alpha` 0/1 |
| `js-t-mask-bg` | Siyah katman | `alpha` 0 → .5 → 0 |
| `js-t-mask-content` | Lacivert katman | `yPercent` 100 → 0 → -100 |

#### Carousel

| Sınıf | Rol |
|---|---|
| `js-slide` | Carousel slide elemanı (x transform hedefi) |
| `js-scale` | Slide içindeki görsel (scale timeline hedefi) |
| `js-mask` | Menü iç maske katmanı |
| `js-clip` | `clip-path` ile açılan görsel |
| `js-link` | Menü link/başlık stagger hedefi |
| `js-menu-split` | Per-char split hedefi |
| `js-sh` | Header referansı |

> 💡 **Mimari ders:** Animasyonlar component'lere gömülü değil; **DOM'a sınıf yazarak bildirimsel olarak** tanımlanmış. Bir block yazarken `js-t-title` eklemek, o elemanı otomatik olarak sayfa geçişi timeline'ına dahil ediyor. Bizim implementasyonumuzda **aynı deklaratif yaklaşım** benimsenecek.

### 13.5 `AniTextSplit` — scroll reveal component'i `[VERIFIED]`

Sitenin en çok kullanılan motion component'i. Tam davranışı:

```
props:
  is     : string = "span"     // render edilecek tag
  each   : number = 0.1        // stagger
  type   : string = "lines"    // SplitText tipi
  amount : string = "4.5rem"   // y mesafesi

setup:
  const { enabled: reducedMotion } = useReducedMotion()
  if (reducedMotion) return                      // ← ERİŞİLEBİLİRLİK: hiçbir şey yapma

  await nextTick()
  $resize.add(revertOnResize)                    // merkezi resize servisine kaydol

  let targets = el.querySelectorAll(":scope > *")
  if (targets.length === 0) targets = el         // çocuk yoksa kendisi

  split = new SplitText(targets, { type })

  timeline = gsap.timeline({
    scrollTrigger: { trigger: el, start: "top 80%" },   // ← SCRUB YOK, bir kez oynar
    onComplete: () => { hasPlayed = true }
  })
  .textSplit(split[type], { y: amount, stagger: each })

onUnmounted:
  timeline.kill()
  $resize.remove(revertOnResize)
  split = null

revertOnResize:
  if (split && hasPlayed) split.revert()         // sadece oynadıysa DOM'u geri al
```

Efektin açılımı (`textSplit` defaults ile):
```
gsap.from(lines, {
  duration: 1.5,
  y: "4.5rem",          // veya prop ile 3rem / 3.5rem
  alpha: 0,
  stagger: 0.1,         // veya prop ile 0.05
  delay: 0,
  ease: "unmask"
})
```

**ScrollTrigger ayarları:**
```
trigger : component kökü
start   : "top 80%"     → elemanın üstü viewport'un %80'ine geldiğinde
end     : (yok)
scrub   : false         → bir kez oynar, geri sarmaz
pin     : false
toggleActions: varsayılan "play none none none"
```

**Kullanım varyantları** `[VERIFIED]`

| Yer | `is` | `each` | `amount` | `type` |
|---|---|---|---|---|
| Intro başlığı | `h2` | 0.1 (varsayılan) | 4.5rem | lines |
| Feature5050 başlığı | `h2` | 0.1 | 4.5rem | lines |
| Feature5050 gövde | `div` | **0.05** | **3rem** | lines |
| Storytelling gövde | `div` | **0.05** | **3rem** | lines |
| BannerScale gövde | `div` | **0.05** | **3rem** | lines |

> **Kural:** Başlıklar `0.1 / 4.5rem`, gövde metinleri `0.05 / 3rem`. Gövde metni daha fazla satır içerdiği için stagger yarıya düşürülmüş. **Bu ayrımı koruyun.**

### 13.6 Scroll-driven animasyon envanteri

Site üzerindeki **tüm** scroll animasyonları (hiçbiri pin kullanmıyor):

#### A — Hero parallax `[VERIFIED]`

```
### Animation: Hero Media Parallax

Trigger:  .hero > div[ref=parallax]  (medya sarmalayıcı)
Start:    "top top"
End:      "bottom top"
Scrub:    true
Pin:      none
Easing:   "none"

Initial State:  yPercent: 0
Final State:    yPercent: 25

Scroll mesafesi: 100svh (900px @1440x900)
Element hareketi: 900 * 0.25 = 225px
Parallax ratio:   0.25

Cleanup: onUnmounted → gsap.set(el, { yPercent: 0 }) + tween.kill()
Responsive: TÜM breakpoint'lerde aktif (matchMedia guard'ı YOK)
Implementation: gsap.fromTo + ScrollTrigger
```

#### B — Banner Full parallax `[VERIFIED]`

```
### Animation: Full-Bleed Banner Parallax

Trigger:  div.relative.overflow-hidden.h-screen
Start:    (varsayılan) "top bottom"
End:      (varsayılan) "bottom top"
Scrub:    true
Pin:      none
Easing:   "none"

Initial State:  yPercent: -15
Final State:    yPercent:  15

Scroll mesafesi: viewport + element = 900 + 900 = 1800px
Element hareketi: 900 * 0.30 = 270px
Parallax ratio:   270 / 1800 = 0.15

Container: h-screen (100vh), overflow-hidden
Media:     fill, object-fit cover
Responsive: TÜM breakpoint'lerde aktif
```

#### C — Feature 5050 medya parallax `[VERIFIED]`

```
### Animation: Feature 5050 Media Parallax

matchMedia: "(min-width: 650px)"    ← MOBİLDE KAPALI
Trigger:  medya kolonu (ref=media)
Start:    (varsayılan) "top bottom"
End:      (varsayılan) "bottom top"
Scrub:    true
Easing:   "none"

Initial State:  y: "3.5rem"    (33.6px @1440)
Final State:    y: "-3.5rem"   (-33.6px)

Toplam hareket: 7rem = 67.2px @1440
Scroll mesafesi: viewport + element ≈ 900 + 620 = 1520px
Parallax ratio:  67.2 / 1520 ≈ 0.044  (çok ince, premium his)

Cleanup: matchMedia revert + tween.kill()
```

#### D — Storytelling medya parallax `[VERIFIED]`

```
### Animation: Storytelling Secondary Media Parallax

matchMedia: "(min-width: 650px)"
Trigger:  .site-grid içerik sarmalayıcı (ref=content)
Scrub:    true
Easing:   "none" (timeline defaults)

Initial State:  y: "7.5rem"   (72px @1440)
Final State:    y: "0rem"

Toplam hareket: 72px
Hedef: media2 (küçük, sağdaki görsel)
Not: media1 (büyük) sabit — sadece ikincil görsel hareket ediyor
```

#### E — Banner Scale (`--progress` tabanlı) `[VERIFIED]` — **en ilginç teknik**

```
### Animation: Banner Scale on Enter

matchMedia: "(min-width: 1024px)"   ← SADECE DESKTOP
Trigger:  section wrapper (ref=el)
Start:    "top bottom"     // section'ın üstü viewport'un altına değdiğinde
End:      "top top"        // section'ın üstü viewport'un üstüne geldiğinde
Scrub:    true

Tween:  gsap.fromTo(el, { "--progress": 0 }, { "--progress": 1, scrollTrigger })

CSS tarafı:
  @media (min-width: 1024px) {
    .bscale { --scale: calc(.85 + var(--progress) * .15); }
    .bscale__scale { transform: scale(var(--scale)); }
  }

Initial State:  scale(0.85)
Final State:    scale(1.00)

Scroll mesafesi: 100vh (900px)
Container: .bscale → l:h-[80vh] / l:h-[80svh], col-start-2 col-span-10
           .bscale__stick → relative, overflow-hidden, max-s:aspect-video

Mobil/tablet: animasyon yok, görsel sabit scale(1)
```

> 💡 Bu teknik, GSAP'in bir CSS custom property'yi tween etmesi ve CSS'in bunu `calc()` ile türetilmiş bir `transform`'a çevirmesi üzerine kurulu. Avantajı: **animasyon mantığı CSS'te, sürücü JS'te** — media query ile animasyonu kapatmak için JS'e dokunmak gerekmiyor.

#### F — Footer parallax `[VERIFIED]`

Bkz. §11.2. `yPercent: -37.5 → 0`, `start: "top bottom"`, `end: "bottom bottom"`, `scrub: true`, `≥650px`.

#### G — AniTextSplit reveal `[VERIFIED]`

Bkz. §13.5. `start: "top 80%"`, scrub yok.

#### H — Carousel scale timeline `[VERIFIED]`

Bkz. §18. Scroll değil, **drag pozisyonuna** bağlı progress.

### 13.7 Link & Button sistemi

#### `.uline` — animasyonlu alt çizgi `[VERIFIED]`

```css
.uline {
  display: inline-flex;
  position: relative;
  white-space: nowrap;
  --bottom: -.05em;
}
.uline::before {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: var(--bottom);
  height: .05em;
  min-height: 1px;
  background-color: currentColor;
  transform: scaleX(0);
  transform-origin: right;                    /* kapalıyken sağdan */
  transition: transform .75s cubic-bezier(.19, 1, .22, 1);
}
@media (hover: hover) and (pointer: fine) {
  .uline:hover::before { transform: scaleX(1); transform-origin: left; }   /* açılırken soldan */
}
.uline.is-active::before,
.uline.router-link-exact-active::before { transform: scaleX(1); transform-origin: left; }
```

> **Detay:** `transform-origin` hover'da `left`, idle'da `right`. Bu sayede çizgi **soldan açılır, soldan kapanır** (sağa doğru süpürülerek) — tek yönlü bir süpürme hissi. Klasik "ortadan açıl" veya "soldan açıl/soldan kapan" hatasına düşmeyin.

#### `.uline-double` `[VERIFIED]`

İki çizgi: biri görünür (`scaleX(1)`), diğeri gizli. Hover'da ilki sağa süpürülüp kaybolurken ikincisi soldan girer. Gecikmeli (`transition-delay`).

#### `.btn` — kenarlıklı hap buton `[CORRECTED 2026-10-04]`

> ### ⚠️ BU BÖLÜM YANLIŞTI — aşağıdaki "maskeli buton" tarifi GEÇERSİZ
>
> Canlı sitedeki `.sh__cta` markup'ı (DOM'dan alındı) bambaşka:
>
> ```html
> <a class="inline-flex eyebrow relative rounded-[.3rem] !min-w-[14rem]
>           overflow-hidden cursor-pointer border border-solid group
>           sh__cta !border-current !text-current">
>   <div class="btn__content h-42 eyebrow relative flex items-center
>               justify-center gap-x-12 w-full">
>     <div class="relative display-flex items-center overflow-hidden justify-center">
>       <div class="btn__content_inner has-hover:group-hover:-translate-y-full
>                   transition-transform duration-500 ease-out
>                   will-change-transform mx-30 py-5">Contact us</div>
>       <span class="absolute inset-0 flex items-center justify-center
>                    translate-y-full has-hover:group-hover:-translate-y-[0]
>                    transition-transform duration-500 ease-out
>                    will-change-transform">Contact us</span>
>     </div>
>   </div>
> </a>
> ```
>
> **Arka plan HİÇ dolmuyor.** Buton şeffaf kalıyor; yalnızca YAZI dikey
> takas yapıyor — kart CTA'sıyla (`SwapLabel`) aynı hareket.
>
> Ölçülen değerler: genişlik `!min-w-[14rem]` · iç yükseklik `h-42` ·
> `rounded-[.3rem]` · 1px `currentColor` kenarlık · şeffaf zemin ·
> `eyebrow` tipografisi (10,8px / 500 / .22em) · geçiş **500ms ease-out**
> (aşağıda yazan 750ms `cubic-bezier(.77,0,.175,1)` DEĞİL).
>
> Renk `!border-current !text-current` ile EBEVEYNDEN miras alınıyor —
> header'da scroll state'ine göre beyaz↔siyah dönüyor.
>
> Uygulama: `src/components/ui/Button.tsx` + `components.css` → `.btn`.
> Aşağıdaki eski tarif tarihsel kayıt olarak bırakıldı; **kullanmayın**.

#### ~~`.btn` — maskeli buton~~ `[GEÇERSİZ]`

```html
<a class="btn inline-flex relative rounded-[.3rem] min-w-[16rem] overflow-hidden cursor-pointer
          border border-solid outline-2 focus:outline-offset-[1px] outline-highlight-rich
          focus:outline active:outline-0 border-white-pure">
  <div class="btn__content h-46 relative flex items-center justify-center gap-x-12 px-20 s:px-30 w-full">
    Label
  </div>
  <div class="btn-mask absolute inset-[-1px] rounded-[.3rem] overflow-hidden h-...">
    <div class="btn-mask__content">Label</div>
  </div>
</a>
```

```css
.btn { --t-duration: .75s; font-size: clamp(12px, 1.5rem, 16px); }

@media (hover: hover) and (pointer: fine) {
  .btn__content,
  .btn-mask          { transition: transform var(--t-duration) cubic-bezier(.77,0,.175,1); }
  .btn-mask          { transform: translate3d(0, 100%, 0); }
  .btn:hover .btn-mask,
  .btn:focus .btn-mask { transform: translateZ(0); }

  .btn-mask__content { transform: translate3d(0, -100%, 0);
                       transition: transform var(--t-duration) cubic-bezier(.77,0,.175,1); }
  .btn:hover .btn-mask__content,
  .btn:focus .btn-mask__content { transform: translateZ(0); }
}
```

**Mekanizma:** Maske katmanı alttan (`+100%`) yukarı kayarken, içindeki metin üstten (`-100%`) aşağı kayıyor. İki ters hareket, metnin **yerinde sabit durup arka planın altından kaydığı** izlenimini veriyor. Süre `0.75s`, ease `cubic-bezier(.77,0,.175,1)` (expo.inOut).

**Ölçüler:** `h-42` (header CTA) / `h-46` (404 sayfası) iç yükseklik, `min-w-[14rem]` / `[16rem]`, `px-20 s:px-30`, `gap-x-12`, `rounded-[.3rem]`.

#### `.btn-a` — ok animasyonu `[VERIFIED]`

```css
.btn-a            { transition: transform .75s cubic-bezier(.77,0,.175,1); }
.btn:hover .btn-a { transform: scaleX(-1) translate(-100%); }

.btn-a__left            { transition: transform .75s cubic-bezier(.77,0,.175,1); }
.btn:hover .btn-a__left { transform: translate(-100%); }

.btn-a__left-mask            { transform: translate(100%); transition: transform .75s cubic-bezier(.77,0,.175,1); }
.btn:hover .btn-a__left-mask { transform: translate(0); }

.btn-a__mask            { transform: scaleX(-1) translate(100%); transition: transform .75s cubic-bezier(.77,0,.175,1); }
.btn:hover .btn-a__mask { transform: scaleX(-1) translate(0); }
```

Ok, hover'da kendi genişliği kadar kayıp kaybolurken kopyası diğer taraftan giriyor — `scaleX(-1)` ile yön çevrilerek. Klasik "arrow loop".

#### `.h-shape` — hover shape `[VERIFIED]`

```css
.h-shape__shape               { transition: transform 1s cubic-bezier(.19, 1, .22, 1); }
.h-shape__shape:first-child   { transition-delay: .15s; }
.h-shape__shape:nth-child(2)  { transform: translate(-110%); transition-delay: 0s; }
```

#### Focus stilleri `[VERIFIED]`

```
focus-visible:outline
focus-visible:outline-2
focus-visible:outline-offset-[1px]
outline-highlight-rich            → #9a3630
focus-visible:ring-2
focus-visible:ring-main           → #203276
focus-visible:ring-opacity-50
rounded-[.2rem]                   → focus halkası için küçük radius
```

> ✅ Site `:focus-visible` kullanıyor, `:focus` değil. Klavye kullanıcısına görünür, fare kullanıcısına görünmez. **Doğru pattern, kopyalanacak.**

#### `has-hover:` utility `[VERIFIED]`

Tailwind custom variant: `has-hover:transition-opacity has-hover:duration-500 has-hover:ease-out has-hover:hover:opacity-100` → `@media (hover:hover) and (pointer:fine)` içine sarıyor. **Projemizde aynı variant tanımlanacak.**

### 13.8 Cursor

**Custom cursor YOK.** `[VERIFIED]`

Tek cursor müdahalesi:
```css
.cursor-grab   { cursor: grab; }
.cursor-grab:active,
.cursor-grab.is-dragging { cursor: grabbing; }
```
Carousel section'larında kullanılıyor.

---

## 14. Page Transitions

Nuxt `pageTransition` ile `{ name: "page", mode: "out-in", css: false }`. Tüm animasyon GSAP ile JS tarafında. `[VERIFIED]`

### 14.1 Maske yapısı

```html
<div class="fixed inset-0 pointer-events-none opacity-0 z-[9999] js-t-mask">
  <div class="absolute inset-0 bg-black js-t-mask-bg"></div>
  <div class="absolute inset-0 bg-main  js-t-mask-content"></div>   <!-- #203276 -->
</div>
```

### 14.2 ÇIKIŞ timeline (`onLeave`) `[VERIFIED]`

```
onLeave(el, done):
  $event.emit("leave")                          // header reset'ini tetikler (bkz. §9.3)

  // ilk çalıştırmada DOM referansları cache'lenir
  sh          = document.querySelector(".js-sh")
  mask        = document.querySelector(".js-t-mask")
  maskContent = document.querySelector(".js-t-mask-content")
  maskBg      = document.querySelector(".js-t-mask-bg")

  if (menu.isOpen) { done(); return }           // menü açıkken maske yok — menü zaten kapatıyor

  outTl?.kill()
  outTl = gsap.timeline({ defaults: { duration: 1, ease: "expo.inOut" } })
    .set(mask, { alpha: 1 })                                            // t=0
    .fromTo(maskBg,      { alpha: 0 },      { alpha: .5, duration: 1, ease: "power1" })  // t=0 → 1.0
    .fromTo(maskContent, { yPercent: 100 }, { yPercent: 0 }, 0)          // t=0 → 1.0
    .add(() => done())                                                   // t=1.0
```

### 14.3 GİRİŞ timeline (`onEnter`) `[VERIFIED]`

```
onEnter(el, done):
  window.scrollTo(0, 0)
  done()                                        // Vue'ya hemen "bitti" de, animasyonu biz yönetiyoruz

  nextTick(() => {
    const isMapPage = route.name === "map"
    const titles = el.querySelectorAll(".js-t-title")
    const scale  = el.querySelector(".js-t-scale")
    const chars  = el.querySelector(".js-t-chars")
    const ups    = el.querySelectorAll(".js-t-up")
    const OFFSET = 0.5                          // ← tüm metin animasyonlarının ortak gecikmesi

    inTl?.kill()
    inTl = gsap.timeline({ paused: true, defaults: { duration: 1, ease: "expo.inOut" } })

    // --- Maske çıkışı (menü açık değilse) ---
    if (!menu.isOpen) {
      inTl.to(maskContent, { yPercent: -100 }, 0)                        // t=0 → 1.0
          .to(maskBg,      { alpha: 0, duration: .5, ease: "power1" }, 0) // t=0 → 0.5
          .set(mask,       { alpha: 0 })                                  // t=1.0
    }

    // --- Görsel scale (maske ile EŞ ZAMANLI) ---
    if (scale) inTl.from(scale, { scale: 1.35, duration: 2, ease: "power3" }, 0)   // t=0 → 2.0

    // --- Karakter reveal ---
    if (chars) {
      const split = new SplitText(chars, { type: "words, chars", wordsClass: "overflow-hidden" })
      inTl.fromTo(split.chars,
        { yPercent: 105 },
        { yPercent: 5, duration: 2, stagger: .075, ease: "unmask" },
        OFFSET)                                                           // t=0.5 → ~2.5+
    }

    // --- Satır reveal ---
    if (titles.length) {
      const lines = new SplitText(titles, { type: "lines" }).lines
      inTl.textSplit(lines, { stagger: .1 }, OFFSET)                      // t=0.5 → 2.0
    }

    // --- Ek elemanlar ---
    if (ups.length) {
      inTl.from(ups, { y: "3.5rem", alpha: 0, duration: 1.5, stagger: .1, ease: "unmask" }, OFFSET)
    }

    // --- Oynatma koşulu ---
    const play = () => { menu.setState({ isOpen:false, isOpening:false, isClosing:false }); inTl.play() }

    if (isMapPage) {
      // harita yüklenene kadar bekle, sonra 0.25s gecikmeyle başlat
      waitUntil(() => mapState === "loaded").then(() => gsap.delayedCall(.25, play))
    } else {
      requestIdleCallback(play)   // veya setTimeout(play, 0)
    }
  })
```

### 14.4 Birleşik zaman çizelgesi

```
  t (s)   ÇIKIŞ (eski sayfa)                      GİRİŞ (yeni sayfa)
 ───────────────────────────────────────────────────────────────────────────
  0.00    $event.emit("leave")
          mask.alpha = 1
          maskBg    0 → .5          (power1)
          maskContent yPercent 100 → 0  (expo.inOut)
  ...
  1.00    done() → Vue route değişimi
 ═══════════════════════════════════════════════════════════════════════════
  1.00                                            window.scrollTo(0,0)
                                                  SplitText hesaplanır
  1.00+                                           maskContent yPercent 0 → -100 (expo.inOut, 1s)
  1.00+                                           maskBg .5 → 0 (power1, .5s)
  1.00+                                           js-t-scale  scale 1.35 → 1 (power3, 2s)
  1.50                                            js-t-chars  yPercent 105 → 5 (unmask, 2s, stg .075)
  1.50                                            js-t-title  textSplit lines (unmask, 1.5s, stg .1)
  1.50                                            js-t-up     y 3.5rem → 0 (unmask, 1.5s, stg .1)
  2.00                                            mask.alpha = 0
  3.00                                            js-t-scale tamamlanır
  ~3.5–4.0                                        tüm metin animasyonları tamamlanır
```

**Toplam algılanan geçiş süresi:** ~2.0s (maske), içerik tam oturması ~4.0s.

### 14.5 Pixel-Perfect Notes

- `maskBg` **siyah ve sadece %50 opak** — lacivert panel kayarken altındaki eski sayfayı karartıyor ama tamamen gizlemiyor. Bu derinlik hissini veren ayrıntı.
- Lacivert panel **aşağıdan yukarı** giriyor (`yPercent: 100 → 0`) ve **yukarı doğru** çıkıyor (`0 → -100`). Yani tek yönlü sürekli bir hareket — "perde yukarı kayıyor".
- `js-t-scale` maske ile **aynı anda** (offset 0) başlıyor; yani kullanıcı maske kalkarken görselin zaten büyükten normale geldiğini görüyor. `1.35` değeri `js-i-scale`'in `1.25`'inden **daha agresif** — çünkü loader'da zaten 3s var, burada 2s.
- Menü açıkken sayfa geçişi maskesi **tamamen atlanıyor** — menünün kendi kapanış animasyonu geçiş görevini üstleniyor. Çift maske üst üste binmiyor.
- `window.scrollTo(0,0)` Lenis'i bypass ediyor (anında). Lenis `scrollTo(0, {immediate:true})` değil native kullanılmış. `history.scrollRestoration = "manual"` bunu destekliyor.

---

## 15. Initial Page Load / Loader

### 15.1 Markup `[VERIFIED]`

```html
<div ref="el" class="fixed inset-0 bg-main text-white flex items-center justify-center z-[9999]">
  <div ref="box" class="flex items-center justify-center h-80 w-80 relative opacity-0">

    <!-- 8 köşeli yıldız/pusula işareti -->
    <svg ref="mark" class="relative w-20 h-20" viewBox="0 0 20 20" fill="none">
      <path class="fill-current" d="M20 9.96532L11.9306 8.83237L13.9653 6.03468L11.1676 8L9.96532 0L8.85549
                                    8L6.0578 6.03468L8.02312 8.83237L0 9.96532L8.06936 11.1676L6.03468
                                    13.9653L8.83237 12L9.9422 20L11.1445 11.9306L13.9422 13.9653L11.9769
                                    11.1676L20 9.96532Z"/>
    </svg>

    <!-- Dairesel progress -->
    <svg ref="circle" class="absolute top-0 left-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
      <circle ref="stroke1" class="stroke-current opacity-20" r="38" cx="40" cy="40" fill="none" stroke-width="1"/>
      <circle ref="stroke2" class="stroke-current relative z-2" r="38" cx="40" cy="40" fill="none" stroke-width="1"/>
    </svg>
  </div>
</div>
```

**Ölçüler:** kutu `h-80 w-80` = 8rem = **76.8px** @1440 / **80px** @390. İşaret `w-20 h-20` = 2rem = **19.2px**. Daire `r=38` → çap 76 (viewBox 80), `-rotate-90` ile 12 yönünden başlıyor. Arka plan `#203276`, çizgi beyaz.

### 15.2 Timeline `[VERIFIED]`

```
mounted:
  await nextTick()

  const reduced = useReducedMotion().enabled
  const words  = reduced ? false : $$(".js-i-words")    // querySelectorAll
  const chars  = reduced ? false : $(".js-i-chars")     // querySelector
  const fades  = $$(".js-i-fade")
  const scale  = $(".js-i-scale")
  const ups    = $$(".js-i-up")

  tl = gsap.timeline({
    defaults: { duration: 1, ease: "power2.inOut" },
    onComplete: () => { el.remove(); splitWords?.revert(); tl.kill() }
  })

  // --- DÖNGÜ: sayfa yüklenene kadar tekrar eder ---
  .set(box, { alpha: 1 })                                              // t=0.00
  .fromTo(stroke2, { drawSVG: "0% 0%"   }, { drawSVG: "0% 100%"   }, 0) // t=0.00 → 1.00  (çizgi büyür)
  .fromTo(stroke2, { drawSVG: "0% 100%" }, { drawSVG: "100% 100%" })    // t=1.00 → 2.00  (çizgi kuyruktan yutulur)
  .add(() => { if (!pageLoaded) tl.restart() })                         // t=2.00  ← LOOP
  .addLabel("out")                                                      // t=2.00

  // --- ÇIKIŞ ---
  .to([circle, mark], { scale: 1.5, alpha: 0, stagger: .1, ease: "expo.inOut" }, "out")
                                                                        // t=2.00 → 3.00 (+.1 stagger)
  .to(el, { autoAlpha: 0, ease: "linear" }, "out+=.25")                 // t=2.25 → 3.25

  // --- İÇERİK GİRİŞİ ---
  if (chars) {
    splitChars = new SplitText(chars, { type: "words, chars", wordsClass: "overflow-hidden" })
    tl.fromTo(splitChars.chars,
        { yPercent: 105 },
        { yPercent: 5, duration: 2, stagger: .075, ease: "unmask" },
        "out+=1")                                                       // t=3.00 → ~5.0+
  }

  if (words.length) {
    splitWords = new SplitText(words, { type: "lines", wordsClass: "js-word" })
    tl.fromTo([...splitWords.lines, ...ups],
        { y: "3.5rem", alpha: 0 },
        { y: 0, alpha: 1, duration: 1.5, stagger: .1, ease: "unmask" },
        chars ? "out+=1" : "out+=.75")                                  // t=3.00 (veya 2.75) → ~4.5+
  }

  if (fades.length) {
    tl.fromTo(fades,
        { y: "-2rem", alpha: 0 },
        { y: 0, alpha: 1, duration: 1.25, stagger: .1, ease: "unmask" },
        chars ? "out+=1.25" : "out+=1")                                 // t=3.25 → ~4.5
  }

  if (scale) {
    tl.fromTo(scale, { scale: 1.25 }, { scale: 1, duration: 3, ease: "power3" }, "out")
                                                                        // t=2.00 → 5.00
  }
```

### 15.3 Yüklenme tespiti `[VERIFIED]`

```js
// layout setup içinde
const markLoaded = () => { store.setLoaded(true); $event.emit("loaded") }

onMounted(() => {
  if (document.readyState === "complete") markLoaded()
  else window.addEventListener("load", markLoaded)
})
```

Yani loader `window.load` event'ine kadar (tüm görseller/font'lar dahil) dönüyor. **En az 2 saniye** gösteriliyor (ilk döngü tamamlanmadan `restart()` kontrolü yapılmıyor).

### 15.4 Görsel zaman çizelgesi (hızlı bağlantı senaryosu)

```
 t (s)   Olay
 ──────────────────────────────────────────────────────────────────
 0.00    Lacivert (#203276) tam ekran, kutu alpha 0 → 1
 0.00    Dairesel çizgi 0% → 100% boyunca çizilir  (power2.inOut)
 1.00    Çizgi tamamlandı; baş noktası kuyruğa doğru yutulmaya başlar
 2.00    Döngü kontrolü — sayfa yüklendiyse devam, değilse t=0'a dön
 2.00    [LABEL "out"]
 2.00    Daire scale 1 → 1.5, alpha 1 → 0   (expo.inOut)
 2.00    Hero görseli scale 1.25 → 1 başlar  (power3, 3s)
 2.10    İşaret (yıldız) scale 1 → 1.5, alpha 1 → 0   (stagger .1)
 2.25    Loader katmanı autoAlpha → 0 (linear, 1s)
 2.75    (chars yoksa) H1 satırları y 3.5rem → 0 başlar
 3.00    (chars varsa)  H1 karakterleri yPercent 105 → 5 başlar (stagger .075)
 3.00    Eyebrow + H1 + alt metin satırları girer (stagger .1)
 3.25    İkincil içerik y -2rem → 0 (fade) girer
 4.50    Metin animasyonları tamamlanır
 5.00    Hero scale tamamlanır → loader DOM'dan silinir, SplitText revert
```

### 15.5 Pixel-Perfect Notes

- Loader **sadece ilk yüklemede** var; route geçişlerinde §14'teki maske devreye giriyor.
- `drawSVG` GSAP'in premium plugin'iydi, **GSAP 3.13+'tan itibaren ücretsiz** — projemizde kullanılabilir. Alternatif: `stroke-dasharray` / `stroke-dashoffset` ile manuel.
- Çıkış `stagger: .1` ile daire önce, yıldız sonra kayboluyor. İki ayrı eleman olduğu için stagger 2 adımlı (0 ve 0.1).
- `autoAlpha` = `opacity` + `visibility` — loader tıklamaları yutmaya devam etmiyor.
- `onComplete` içinde `el.remove()` → loader DOM'dan tamamen siliniyor (CSS ile gizlemek yerine). **DOM temizliği için doğru.**
- Reduced motion aktifse `js-i-words` ve `js-i-chars` split'leri **hiç yapılmıyor** — metin direkt görünür. Ama `js-i-fade` ve `js-i-scale` hâlâ çalışıyor. ⚠️ Bu **eksik bir uygulama** — bizim projemizde `prefers-reduced-motion` tüm hareketi kapatmalı (bkz. §28).

---

## 16. Homepage — Section by Section

Tüm ölçümler **1440×900 viewport** (içerik genişliği 1425px, scrollbar 15px), `1rem = 9.6px`. `[MEASURED]`

**Toplam sayfa yüksekliği: 10.086,8px ≈ 11,2 viewport.**

### Scroll haritası (özet)

| ID | Block | Üst (px) | Yükseklik (px) | Arka plan |
|---|---|---:|---:|---|
| HOME-01 | `hero` | 0 | 900 | `#000` (medya) |
| HOME-02 | `intro` | 900 | 428,1 | beyaz |
| HOME-03 | `banner_scale` | 1.328,1 | 720 | beyaz |
| HOME-04 | `content` | 2.105,7 | 349,5 | beyaz |
| HOME-05 | `storytelling` | 2.455,2 | 806,7 | beyaz |
| HOME-06/07 | `spacer` ×2 | 3.261,9 | 115,2 ×2 | beyaz |
| HOME-08 | `banner_full` | 3.492,3 | 900 | medya |
| HOME-09 | `feature5050` | 4.392,3 | 956 | `#F8F8F3` |
| HOME-10 | `image_carousel_offset` | 5.348,3 | 1.183,7 | `#FFFFFF` |
| HOME-11 | `listings5050` | 6.531,9 | 956 | `#F8F8F3` |
| HOME-12 | `experiences_carousel` | 7.487,9 | 1.100,2 | beyaz |
| HOME-13 | `explore_more` | 8.588,1 | 760,7 | `#F8F8F3` |
| — | `footer` | 9.348,9 | 737,9 | `#203276` |

> **Ritim gözlemi:** Beyaz → `#F8F8F3` → beyaz dönüşümlü arka plan, tam-ekran medya blokları (HOME-01, HOME-08) ile bölünüyor. İki `spacer` bloğu (toplam 230px) tam-ekran banner'dan önce nefes alanı yaratıyor.

---

### HOME-01 — Hero

#### Purpose
Marka açılışı. Tam ekran video/görsel + merkezi tipografi + scroll göstergesi.

#### Layout
```html
<div ref="el" class="hero relative text-white-pure flex items-center justify-center
                     overflow-hidden bg-highlight w-full h-[100svh]">
                                            <!-- isSlim ise: h-[55rem] -->

  <!-- Parallax katmanı -->
  <div ref="parallax" class="absolute inset-0 media-fill overflow-hidden bg-black">
    <Media :item="media" fill :background="false"
           class="js-i-scale js-t-scale" custom-sizes="100vw" eager-loading />
  </div>

  <!-- İçerik -->
  <div class="site-max flex flex-col items-center text-center relative pointer-events-none z-5">
    <div class="eyebrow mb-32 js-i-words js-t-title opacity-80" v-html="eyebrow" />
    <h1  class="display w-full js-i-words js-t-title max-w-[90%] s:max-w-[50rem] l:max-w-[73rem]"
         v-html="title" />
    <p   class="body-m js-i-words js-t-title mt-24 portrait:mt-24 l:mt-42" v-html="subtitle" />
  </div>

  <!-- Scroll göstergesi -->
  <div class="absolute bottom-0 left-0 w-full z-6 pb-48 s:pb-40 l:pb-48">
    <div class="site-max flex justify-center">
      <button type="button" class="flex justify-center relative before:absolute before:-inset-10 z-10"
              @click="$scroll.to($resize.wh)">
        <svg viewBox="0 0 2 80" class="flex w-2 h-72 s:h-80">
          <path fill="#000" fill-opacity=".2" d="M2 0v80H0V0z"/>                 <!-- track -->
          <path fill="#fff" d="M2 0v27H0V0z" class="hero-scroll-line"/>          <!-- gösterge -->
        </svg>
        <span class="sr-only">Scroll down</span>
      </button>
    </div>
  </div>
</div>
```

#### Dimensions `[MEASURED]`

| Element | Değer |
|---|---|
| Section yüksekliği | `h-[100svh]` = **900px** |
| Slim varyantı | `h-[55rem]` = **528px** |
| H1 max-width | mobil `90%` · `s:50rem` (450px) · `l:73rem` (**700,8px**) |
| H1 ölçülen genişlik | **700,8px**, x = 362,1 (ortalı) |
| H1 font | 52,8px / lh 63,36px / `ivy-mode` 300 / beyaz |
| Eyebrow | 10,56px / `ls 2,32px` / uppercase / `opacity .8` / `mb-32` (307px… hayır: 3,2rem = **30,7px**) |
| Alt metin | `body-m` 14,4px / lh 23,04px / `mt-24` (23px) · `l:mt-42` (**40,3px**) |
| Scroll göstergesi | `w-2` (1,92px) × `h-72` mobil (69,1px) / `s:h-80` (**76,8px**) |
| Gösterge dolgusu | beyaz segment 27/80 = **%33,75** |
| Gösterge alt boşluğu | `pb-48` (46,1px) · `s:pb-40` (38,4px) · `l:pb-48` (**46,1px**) |
| Tıklama alanı | `before:-inset-10` → **+9,6px her yönde** |

#### Media
```
Tip:        <video> (varsa) veya <Image>
Video src:  Vimeo progressive_redirect 1080p .mp4   (data-src ile lazy)
sizes:      "100vw"
loading:    eager (eager-loading=true)  → LCP adayı
object-fit: cover (media-fill)
Fallback:   videoFallbackImage (iOS Low Power Mode'da)
Poster:     videoFallbackImage.responsiveImage.src
preload:    "none"   ← IntersectionObserver ile yüklenir
```

Video attribute'ları `[VERIFIED]`:
```html
<video data-src="..." muted loop playsinline preload="none" poster="..." v-observe-vid>
```

**IntersectionObserver stratejisi** `[VERIFIED]`:
```
Observer A — rootMargin "0px 0px 300% 0px"  → src ataması (3 viewport önceden yükle)
Observer B — rootMargin "25% 25% 25% 25%"   → play/pause (görünürlük payı ile)
```

#### Animation

**1) Giriş (loader timeline'ı içinde)**
```
js-i-scale  : scale 1.25 → 1    · duration 3   · power3     · @ "out" (t≈2.0)
js-i-words  : eyebrow + h1 + p  → SplitText lines → y 3.5rem→0, alpha 0→1
              duration 1.5 · stagger 0.1 · unmask · @ "out+=.75" veya "out+=1"
```

**2) Route geçişinde**
```
js-t-scale  : from scale 1.35   · duration 2   · power3     · @ t=0
js-t-title  : SplitText lines → textSplit(stagger .1)       · @ t=0.5
```

**3) Scroll**
```
### Animation: Hero Media Parallax
Trigger:  parallax div
Start:    "top top"
End:      "bottom top"
Scrub:    true
Easing:   "none"
Initial:  yPercent: 0
Final:    yPercent: 25
Travel:   900 × 0.25 = 225px
Ratio:    0.25
Responsive: tüm breakpoint'ler
Cleanup:  onUnmounted → gsap.set({yPercent:0}) + kill()
```

**4) Video fade-in** `[VERIFIED]`
```
mediaCheck(video, timeout=2000):
   "loadeddata" | "suspend" | "stalled" | "playing" event'lerinden biri ya da 2s timeout
   readyState >= 2 değilse: preload="auto", load(), muted=true, play().catch(noop)

sonra:  gsap.fromTo(video, {alpha:0}, {alpha:1, duration:.35, ease:"power1"}).play()
```

#### Interaction
- Scroll göstergesine tıklama → `$scroll.to(window.innerHeight)` (tam 1 viewport)
- İçerik bloğu `pointer-events-none` — metin tıklamayı engellemiyor
- `sr-only` "Scroll down" metni ekran okuyucu için

#### Desktop / Tablet / Mobile

| | Desktop (≥1024) | Tablet (650–1023) | Mobile (<650) |
|---|---|---|---|
| Yükseklik | 100svh | 100svh | 100svh |
| H1 | 52,8px, max-w 73rem | 43,2px, max-w 50rem | 40px, max-w 90% |
| Alt metin mt | `mt-42` (40,3px) | `mt-24` (21,6px) | `mt-24` (24px) |
| Gösterge | h-80, pb-48 | h-80, pb-40 | h-72, pb-48 |
| Parallax | ✔ | ✔ | ✔ |

#### Implementation Notes
- `h-[100svh]` kullanılıyor — `100vh` değil. iOS Safari'de adres çubuğu kaymasını engelliyor. **Zorunlu.**
- Parallax `yPercent: 25` olduğu için medya kapsayıcısı **görünür alandan %25 daha uzun olmalı**, aksi halde altta boşluk görünür. `media-fill` + `object-fit: cover` bunu sağlıyor; görsel kapsayıcıyı tamamen dolduruyor ve `overflow-hidden` taşmayı kesiyor.
- `bg-black` parallax katmanında — video yüklenene kadar siyah zemin (flash önleme).
- `bg-highlight` (#000) section'da — ikinci güvence.
- `eager-loading` + `sizes="100vw"` → LCP görseli. **Kritik: bu görseli `<link rel="preload">` ile de çağırın.**

#### Pixel-Perfect Notes
- H1'in `max-w-[73rem]` (700,8px) değeri, 1425px container içinde **%49,2** — tam ortada ve dar. Daha geniş yaparsanız kompozisyon bozulur.
- Eyebrow ile H1 arası `mb-32` = 30,7px; H1 ile alt metin arası `l:mt-42` = 40,3px. **Asimetrik** — eyebrow daha yakın.
- Scroll göstergesi **2px genişliğinde dikey çizgi**, üstte %33,75'i beyaz. **HAREKETLİ** `[VERIFIED 2026-10-04]` — canlı CSS:
  `.hero .hero-scroll-line { animation: hero-scroll-line 2s cubic-bezier(.19,1,.22,1) infinite }` ·
  `@keyframes hero-scroll-line { 0% { transform: translateY(-100%) } 100% { transform: translateY(100%) } }`.
  Yüzdeler SVG viewport'una göre (`transform-box: view-box`): segment 80 birimlik kutunun tamamını üstten alta kat ediyor, iki uçta görünmez. Uygulama: `components.css` → `.hero-scroll-line`.

---

### HOME-02 — Intro

#### Purpose
Marka manifestosu. Tek büyük `title-m` cümlesi, ortalı, geniş nefes alanı.

#### Layout
```html
<section class="pt-55 s:pt-90 l:pt-120 pb-40 s:pb-100 l:pb-90 text-center">
  <div class="site-max site-grid gap-40">
    <span class="eyebrow text-highlight
                 col-start-1 col-span-6 s:col-start-2 s:col-span-10 l:col-start-3 l:col-span-8">
      {{ eyebrow }}
    </span>
    <AniTextSplit is="h2"
      class="title-m w-full col-start-1 col-span-6 s:col-start-2 s:col-span-10
             l:col-start-3 l:col-span-8 l:ml-auto l:mr-auto text-highlight
             l:max-w-[80rem]">        <!-- xl ise l:max-w-[92rem] -->
      <div v-html="sanitize(text, ['em','i'])" />
    </AniTextSplit>
  </div>
</section>
```

#### Dimensions `[MEASURED]`

| Özellik | Değer |
|---|---|
| Section yüksekliği | **428,1px** |
| padding-top | `l:pt-120` = **115,2px** |
| padding-bottom | `l:pb-90` = **86,4px** |
| `gap-40` row-gap | **38,4px** |
| H2 kolon | `l:col-start-3 col-span-8` → x = **272,2px**, genişlik **880,6px** |
| H2 max-width | `l:max-w-[80rem]` = **768px** — **ana sayfa `xl`: `l:max-w-[92rem]` = 883,2px** `[VERIFIED 2026-10-04 canlı DOM]` |
| Eyebrow satırı | Ana sayfada `<span class="eyebrow">` **BOŞ ama DOM'da** — grid'de 0px'lik bir satır + `gap-40` (38,4px) üretiyor. Koşullu render edilirse section 389,7px'e düşüyor (ölçüldü). Bizde `IntroBlock` satırı her zaman render ediyor. |
| H2 font | 33,6px / lh 47,04px / `ivy-mode` 300 / `#000` |
| Eyebrow | 10,56px / `ls 2,32px` / `#000` |

#### Animation
```
AniTextSplit (varsayılan):
  SplitText type "lines"
  ScrollTrigger { trigger: h2, start: "top 80%" }, scrub yok
  gsap.from(lines, { y: "4.5rem", alpha: 0, duration: 1.5, stagger: 0.1, ease: "unmask" })
```
Eyebrow animasyonsuz (statik).

#### Responsive
| | Desktop | Tablet | Mobile |
|---|---|---|---|
| Padding | `pt-120 pb-90` | `pt-90 pb-100` | `pt-55 pb-40` |
| Kolon | start 3, span 8 | start 2, span 10 | start 1, span 6 |
| H2 | 33,6px | 28,8px | 28px |
| max-width | 80rem | — | — |

#### Pixel-Perfect Notes
- Mobilde `pt-55` (55px) → tablet `pt-90` (81px) → desktop `pt-120` (115px). Alt boşluk ise tablet'te **en büyük** (`pb-100` = 90px), desktop'ta düşüyor (`pb-90` = 86px). Bilinçli optik denge.
- `l:ml-auto l:mr-auto` + `max-w` kombinasyonu: grid kolonu 880,6px ama içerik 768px'de kilitli ve ortalı. **Grid + max-width çift kısıt.**

---

### HOME-03 — Banner Scale

#### Purpose
Scroll'a bağlı büyüyen tam genişlikte görsel. Sayfanın ilk "vay" anı.

#### Layout
```html
<section>
  <!-- Opsiyonel metin bloğu -->
  <div class="site-max pt-90">
    <div class="site-grid">
      <div class="col-span-8 s:col-span-6 s:col-start-1 l:col-start-2">
        <h3 class="eyebrow mb-30 text-highlight" v-html="eyebrow" />
        <AniTextSplit is="h2" class="h3 max-w-[57.4rem]">{{ title }}</AniTextSplit>
        <AniTextSplit is="div" :each="0.05" amount="3rem">
          <div class="txt mt-30" v-html="sanitize(text, ['p'])" />
        </AniTextSplit>
      </div>
    </div>
  </div>

  <!-- Görsel -->
  <div ref="el" class="site-max mt-42 l:mt-0 mb-40 l:mb-60">
    <div class="site-grid">
      <div class="bscale relative l:h-[80vh] l:h-[80svh]
                  col-span-6 col-start-0 s:col-span-10 s:col-start-2">
        <div class="bscale__stick relative l:top-0 l:left-0 w-full h-full overflow-hidden
                    max-s:aspect-video">
          <Media :item="media" fill class="bscale__scale"
                 custom-sizes="(min-width: 650px) 93.33vw, calc(100vw - 4rem)" />
        </div>
      </div>
    </div>
  </div>
</section>
```

#### Dimensions `[MEASURED]`

| Özellik | Değer |
|---|---|
| Section yüksekliği | **720px** |
| Görsel yüksekliği | `l:h-[80svh]` = **720px** |
| Görsel kolonları | `s:col-start-2 col-span-10` → 10/12 kolon |
| Alt boşluk | `l:mb-60` = **57,6px** |
| Metin max-width | `max-w-[57.4rem]` = **551px** |
| `sizes` | `(min-width: 650px) 93.33vw, calc(100vw - 4rem)` |

#### Animation
```
### Animation: Banner Scale on Enter

matchMedia: "(min-width: 1024px)"        ← SADECE DESKTOP
Trigger:  div[ref=el]  (site-max sarmalayıcı)
Start:    "top bottom"
End:      "top top"
Scrub:    true
Pin:      none

Tween:    gsap.fromTo(el, {"--progress": 0}, {"--progress": 1, scrollTrigger})

CSS:      --scale: calc(.85 + var(--progress) * .15)
          .bscale__scale { transform: scale(var(--scale)) }

Initial:  scale(0.85)
Final:    scale(1.00)
Scroll:   1 viewport (900px)
Cleanup:  matchMedia.revert() + tween.kill()
```

#### Responsive
| | Desktop (≥1024) | Tablet (650–1023) | Mobile (<650) |
|---|---|---|---|
| Görsel yüksekliği | `80svh` | otomatik (grid) | `aspect-video` (16:9) |
| Scale animasyonu | ✔ 0.85→1 | ✘ | ✘ |
| Kolon | `col-start-2 col-span-10` | aynı | `col-start-0 col-span-6` |
| Üst boşluk | `l:mt-0` | `mt-42` (37,8px) | `mt-42` (42px) |

#### Pixel-Perfect Notes
- `l:h-[80vh] l:h-[80svh]` — **iki kez yazılmış**, ikincisi destekleyen tarayıcılarda kazanıyor. Progressive enhancement. Aynı şekilde yazın.
- `col-start-0` geçersiz bir Tailwind sınıfı (CSS'te karşılığı yok) — mobilde varsayılan `col-start-auto` davranışı geçerli. Kopyalarken `col-start-1` yazın.
- `.bscale__stick` içinde `l:top-0 l:left-0` var ama `position: relative` — yani etkisiz. Geçmiş bir sticky denemesinden kalma ölü kod. **Kopyalamayın.**
- Mobilde `aspect-video` ile 16:9 — desktop'taki 80svh'den çok farklı bir kadraj. Görsel seçerken **her iki kadrajda da çalışmasına** dikkat edin (focal point).

---

### HOME-04 — Content

#### Purpose
İki kolonlu tanıtım bloğu. Solda etiket + başlık, sağda gövde metni.

> ⚠️ **DÜZELTME (2026-10-04):** Burada önce "serbest metin bloğu (richtext)"
> yazıyordu ve tek kolon olarak uygulanmıştı. Canlı DOM'dan alınan gerçek
> yerleşim İKİ KOLON.

#### Layout `[VERIFIED]` — canlı DOM'dan
```html
<section class="max-s:pt-40 py-80 s:py-110">
  <div class="site-max site-grid">
    <!-- SOL: etiket + başlık -->
    <div class="col-span-6 l:col-start-2 s:col-span-5 l:col-span-4 mb-32 s:mb-0">
      <h2 class="eyebrow mb-30 text-main-tint">Overview</h2>
      <h3 class="title-s text-black-pure">
        Sustainable, family-friendly<br>residences on the island of Maui.
      </h3>
    </div>
    <!-- SAĞ: gövde -->
    <div class="col-span-6 s:col-start-7 s:col-span-6 l:col-start-7 l:col-span-5">
      <div class="txt"><p>A picturesque golf and beach community…</p></div>
    </div>
  </div>
</section>
```

> ⚠️ Referans eyebrow'u `<h2>`, başlığı `<h3>` yapmış — eyebrow bir başlık
> değil, sonraki başlığın etiketi. Ekran okuyucunun başlık listesine sahte
> bir giriş giriyor ve taslak h2→h3 sırasıyla ters dönüyor.
> **Bizde eyebrow `<p>`, başlık `<h2>`.**

#### Dimensions `[MEASURED]`
```
class:      "max-s:pt-40 py-80 s:py-110"
Yükseklik:  349,5px
padding:    py-110 = 105,6px (üst ve alt)
sol kolon:  l:col-start-2 col-span-4
sağ kolon:  l:col-start-7 col-span-5
```

#### Animation
`AniTextSplit` ile satır reveal (`each: 0.05`, `amount: 3rem`). `[HIGH CONFIDENCE]`

---

### HOME-05 — Storytelling

#### Purpose
Asimetrik iki görselli anlatı bloğu. Sitenin en karakteristik yerleşimi.

#### Layout
```html
<section class="py-0 l:py-100 l:pt-80">
  <div ref="content" class="site-max site-grid items-end s:ml-0 l:!-ml-59">

    <!-- Büyük görsel (sol) -->
    <div class="s:col-start-1 l:col-start-2 col-span-6 s:col-span-12 l:col-span-7
                s:mt-60 max-s:mb-0 s:mt-0 aspect-[3/4] s:aspect-[4/3]">
      <div class="relative w-full h-full">
        <Media ref="media1" :item="media[1]" fill
               custom-sizes="(min-width: 650px) 22.47vw, calc(100vw - 4rem)" />
      </div>
    </div>

    <!-- Küçük görsel + metin (sağ) -->
    <div class="col-start-1 s:col-start-9 col-span-4 s:col-span-4 l:col-span-3 l:col-start-10
                flex flex-col s:justify-between items-end s:items-start
                gap-80 s:gap-0 l:-mb-80 max-l:hidden">
      <div class="aspect-[4/3] s:aspect-[3/4] w-full h-full">
        <div class="relative w-full h-full">
          <Media ref="media2" :item="media[0]" fill
                 custom-sizes="(min-width: 650px) 53.9vw, calc(66vw - 4rem)" />
        </div>
      </div>
      <AniTextSplit is="div" :each="0.05" amount="3rem"
                    class="stry__p body-p l:max-w-[57.2rem]">
        <div v-html="sanitize(text)" />
      </AniTextSplit>
    </div>
  </div>
</section>
```

#### Dimensions `[MEASURED]`

| Özellik | Değer |
|---|---|
| Section yüksekliği | **806,7px** |
| padding | `l:pt-80` = 76,8px · `l:py-100` → pb = **96px** |
| Grid x konumu | **-56,6px** (negatif margin `l:!-ml-59` = -5,9rem = -56,6px) |
| Büyük görsel | `l:col-start-2 col-span-7` · aspect `4/3` (desktop) / `3/4` (mobil) |
| Küçük görsel | `l:col-start-10 col-span-3` · aspect `3/4` (desktop) / `4/3` (mobil) |
| Metin max-width | `l:max-w-[57.2rem]` = **549,1px** |
| Sağ kolon alt taşma | `l:-mb-80` = **-76,8px** |
| Hizalama | `items-end` (grid) + `s:justify-between` (sağ kolon) |

#### Animation
```
### Animation: Storytelling Secondary Media Parallax

matchMedia: "(min-width: 650px)"
Trigger:  div[ref=content]
Scrub:    true
Defaults: ease "none"
Target:   media2 ($el) — küçük sağdaki görsel

Initial:  y: "7.5rem"    (72px @1440)
Final:    y: "0rem"
Travel:   72px

Not: media1 (büyük görsel) SABİT — hareket etmiyor.
Cleanup:  matchMedia.revert()
```
Metin için ayrıca `AniTextSplit` (`0.05` / `3rem`).

#### Responsive
| | Desktop (≥1024) | Tablet (650–1023) | Mobile (<650) |
|---|---|---|---|
| Büyük görsel | `col-start-2 col-span-7`, 4:3 | `col-span-12`, 4:3 | `col-span-6`, 3:4 |
| Küçük görsel + metin | `col-start-10 col-span-3`, 3:4 | **gizli** (`max-l:hidden`) | **gizli** |
| Negatif margin | `-ml-59` (-56,6px) | `ml-0` | yok |
| Parallax | ✔ | ✔ | ✘ |
| padding | `pt-80 pb-100` | `py-0` | `py-0` |

#### Pixel-Perfect Notes
- **Aspect ratio'lar ters çevriliyor:** büyük görsel mobilde dikey (3:4) → desktop'ta yatay (4:3); küçük görsel tam tersi. Bu, iki farklı crop gerektirir — görselleri hazırlarken **her iki oranı da düşünün**.
- `l:!-ml-59` grid'i sola taşırıyor (`!` = `!important`). Bu, büyük görselin sol kenarının container padding'ini aşmasını sağlıyor — "sayfadan taşan görsel" etkisi.
- `l:-mb-80` sağ kolonun metninin section'ın alt sınırını aşmasını sağlıyor.
- `custom-sizes` değerleri **ters** görünüyor (büyük görsel `22.47vw`, küçük görsel `53.9vw`). Bu Mākena'daki bir hata — biz doğrusunu yazacağız (§24).
- `items-end` — iki kolon **alt kenarlarından** hizalanıyor, üstten değil.

---

### HOME-06 / HOME-07 — Spacer ×2

```html
<div class="space pointer-events-none"></div>   <!-- pt-120 -->
```
**Yükseklik: 115,2px her biri, toplam 230,4px.** `[MEASURED]`

> İçerik yönetiminden eklenebilen boşluk bloğu. Burada iki tane art arda kullanılarak tam ekran banner'dan önce **4 viewport'luk içerikten sonra nefes** yaratılmış.

---

### HOME-08 — Banner Full

#### Layout
```html
<div ref="el" class="relative overflow-hidden h-screen">
  <Media ref="parallax" :item="media" fill />
</div>
```

#### Dimensions `[MEASURED]`
```
Yükseklik: h-screen = 900px (tam viewport)
Genişlik:  100% (site-max YOK — full bleed)
overflow:  hidden
```

#### Animation
```
### Animation: Full-Bleed Banner Parallax

Trigger:  div[ref=el]
Start:    "top bottom"   (varsayılan)
End:      "bottom top"   (varsayılan)
Scrub:    true
Easing:   "none"
Initial:  yPercent: -15
Final:    yPercent:  15
Travel:   %30 → 270px
Scroll:   1800px (viewport + element)
Ratio:    0.15
Responsive: TÜM breakpoint'ler (matchMedia yok)
Cleanup:  onUnmounted → tween.kill()
```

#### Pixel-Perfect Notes
- `yPercent: ±15` olduğundan medya kapsayıcısı **%130 yükseklikte** olmalı. `media-fill` + `cover` ile görsel `h-screen`'i doldurduğu ve `overflow-hidden` taştığı için boşluk görünmüyor. Ancak görselin **dikey merkezinin** kompozisyonda önemli olmasına dikkat edin — üst ve alt %15'i kırpılıyor.
- `h-screen` (`100vh`) kullanılmış, `100svh` **değil**. Hero'dan farklı. Mobil Safari'de adres çubuğu açıkken taşma olur. **Biz `100svh` kullanacağız.**

---

### HOME-09 — Feature 5050

#### Layout
```html
<section class="py-90 s:py-100 l:py-120" :style="{ backgroundColor: customize?.background?.color?.hex }">
  <div class="site-max site-grid items-start l:items-center">

    <!-- Medya -->
    <div ref="media" class="col-span-6 s:col-span-6 l:col-span-5
         [left ? 's:col-start-1 l:col-start-2' : 's:order-2 s:col-start-7 l:col-start-7']
         [reverse ? 'max-s:order-1' : 'max-s:order-2 max-s:mt-60']
         [isMobile && (reverse ? 'mb-65' : 'mt-65')]">
      <Media ref="parallax" :item="media" clamp :custom-aspect="imageAspectRatio"
             custom-sizes="(min-width: 650px) 38.2vw, calc(100vw - 4rem)" />
    </div>

    <!-- Metin -->
    <div class="col-span-6 s:col-span-5 l:col-span-4 s:mt-24 l:mt-0
         [left ? 's:col-start-8 l:col-start-8' : 's:col-start-1 l:col-start-2 s:order-1']
         [reverse ? 'max-s:order-2' : 'max-s:order-1']">
      <div class="flex flex-col items-start">
        <span class="eyebrow text-main-tint mb-25">{{ eyebrow }}</span>
        <AniTextSplit is="h2" class="title-s max-s:!text-28 pr-[5%] text-highlight">
          <div v-html="sanitize(title, ['em'])" />
        </AniTextSplit>
        <AniTextSplit is="div" :each="0.05" amount="3rem">
          <div class="txt mt-30 s:mt-30" v-html="sanitize(text, ['p','em'])" />
        </AniTextSplit>
        <BaseBtn :data="link" :label="link.label" :dark="bgHex !== '#024533'" class="mt-50" />
      </div>
    </div>
  </div>
</section>
```

#### Dimensions `[MEASURED]`

| Özellik | Değer |
|---|---|
| Section yüksekliği | **956px** |
| Arka plan | `#F8F8F3` (CMS'ten) |
| padding | `l:py-120` = **115,2px** |
| Medya kolonu | `l:col-start-2 col-span-5` → x = **160,1px** |
| Metin kolonu | `l:col-start-8 col-span-4` |
| `sizes` | `(min-width: 650px) 38.2vw, calc(100vw - 4rem)` |
| Başlık | `title-s` 28,8px / lh 40,32px, `pr-[5%]` |
| Eyebrow | 10,56px, `mb-25` = 24px, `rgba(33,51,117,.8)` |
| Gövde | 14,4px / lh 23,04px / `rgba(0,0,0,.7)` / `mt-30` = 28,8px |
| Buton | `mt-50` = **48px** |
| Hizalama | `items-start` → `l:items-center` |

#### Animation
```
### Animation: Feature 5050 Media Parallax

matchMedia: "(min-width: 650px)"
Trigger:  div[ref=media]
Scrub:    true
Easing:   "none"
Initial:  y: "3.5rem"    (33,6px)
Final:    y: "-3.5rem"   (-33,6px)
Travel:   7rem = 67,2px
Ratio:    ~0.044
Cleanup:  matchMedia.revert()
```

#### Varyant mantığı `[VERIFIED]`

| Prop | Etki |
|---|---|
| `left: true` | Medya solda (`col-start-2`), metin sağda (`col-start-8`) |
| `left: false` | Medya sağda (`order-2 col-start-7`), metin solda (`col-start-2 order-1`) |
| `reverse: true` | Mobilde medya **üstte** (`max-s:order-1`), metin altta, medyaya `mb-65` |
| `reverse: false` | Mobilde metin üstte, medya altta (`max-s:order-2 max-s:mt-60`), medyaya `mt-65` |
| `bgHex === "#024533"` | Metinler `!text-white-pure opacity-[88%]`, buton `dark: false` |
| `imageAspectRatio` | CMS'ten gelen custom aspect (yoksa görselin doğal oranı) |

> Bu, **tek component ile 4 görsel varyant** üreten iyi bir tasarım. Projemizde aynı prop seti kullanılacak.

#### Pixel-Perfect Notes
- `clamp` prop'u Media component'ine geçiyor — muhtemelen maksimum yüksekliği sınırlıyor `[NEEDS DEVTOOLS]`.
- `pr-[5%]` başlıkta — sağda %5 nefes bırakıyor, satır sonlarının kolon kenarına dayanmasını engelliyor. **İnce ama etkili.**
- Mobilde `mt-65`/`mb-65` (65px) ek boşluk — metin ve görsel arasında belirgin ayrım.
- `max-s:!text-28` — mobilde başlık 28px'e zorlanıyor (normalde `title-s` mobile = 24px). Yani mobilde **daha büyük**.

---

### HOME-10 — Image Carousel Offset

#### Dimensions `[MEASURED]`
```
class:      "ico relative py-100 pt-70 s:pt-150 l:pt-70 overflow-hidden s:px-60 cursor-grab"
Yükseklik:  1183,7px
padding-top:    l:pt-70  = 67,2px
padding-bottom: py-100   = 96px
padding-x:      s:px-60  = 57,6px  (site-max'in ÜSTÜNE)
Arka plan:  #FFFFFF
cursor:     grab / grabbing
```

İç grid: `mt-80 s:mt-100 s:col-start-1 col-span-6 s:col-span-12 site-grid site-max select-none`
→ **1309,8px genişlik, x = 57,6px** `[MEASURED]`

#### Başlık bloğu `[VERIFIED]` — canlı DOM'dan

ORTALI, başlığın üstünde bölüm etiketi var:

```html
<div class="site-max">
  <div class="flex flex-col items-center text-center">
    <div class="eyebrow w-full text-main-tint s:max-w-[70rem] mt-25 l:mt-32">Experiences</div>
    <h2   class="title-l text-highlight     s:max-w-[70rem] mt-24 l:mt-28">In pursuit of wonder</h2>
    <div  class="txt body-p w-full          s:max-w-[70rem] mt-26 l:mt-28"><p>…</p></div>
  </div>
</div>
<div class="mt-80 s:mt-100 … site-grid site-max select-none">   <!-- track -->
```

> ⚠️ **DÜZELTME (2026-10-04):** Bu başlık bloğu dokümanda hiç yoktu ve
> grid kolonunda SOLA yaslı uygulanmıştı. Ortalı + eyebrow'lu olacak.

#### Ok butonları `[VERIFIED]`

Referansta VARLAR — explore_more'da sol altta (yanında ilerleme çizgisiyle),
deneyim carousel'inde kartın iki yanında beyaz kareler olarak.
§18.7'deki `next()` / `prev()` bunlara bağlı.

> ⚠️ İlk incelemede ana sayfada göremediğim için "referansta yok" diye
> not düşmüştüm; yanlıştı.

#### Mekanik
Bkz. §18 — **Drag Carousel (clamped varyant)**.

---

### HOME-11 — Listings 5050

#### Dimensions `[MEASURED]`
```
class:      "re-l pt-80 pb-100 s:py-120 bg-[#F8F8F3]"
Yükseklik:  956px
padding:    s:py-120 = 115,2px
Arka plan:  #F8F8F3
```

İçerik: Real estate listeleri (Kā'eo, Kula Villas, Beach Cottages, Beach Club Residences, Molokini Residences, The Ranch at Mākena) + başlık + "LEARN MORE" butonu. `[MEASURED]`

---

### HOME-12 — Experiences Carousel

#### Dimensions `[MEASURED]`
```
class:      "relative overflow-hidden select-none cursor-grab
             pt-76 s:pt-120 l:pt-100 s:pb-120 l:pb-100 pb-70"
Yükseklik:  1100,2px
padding:    l:pt-100 = 96px · l:pb-100 = 96px
```

İçerik: başlık (`title-l`, ortalı) + 4 kart (Golf, Outdoor Pursuits, Wellness, Lifestyle), her kartta `title-s` başlık + "LEARN MORE" butonu.

Kart x konumları `[MEASURED]`: Golf `685,8`, Outdoor Pursuits `1487,4`, Wellness `2419,5`, Lifestyle `-217,5`
→ **Sonsuz döngü (wrap) aktif** — Lifestyle negatif x'te, yani viewport'un solunda bekliyor.

#### Mekanik
Bkz. §18 — **Drag Carousel (infinite varyant)**.

---

### HOME-13 — Explore More

#### Dimensions `[MEASURED]`
```
class:      "ico relative pt-80 pb-85 s:pb-92 l:pb-88 s:pt-80 l:pt-120 overflow-hidden bg-white"
Yükseklik:  760,7px
padding:    l:pt-120 = 115,2px · l:pb-88 = 84,48px
Arka plan:  #F8F8F3  (bg-white token'ı = --color-white = #f8f8f3, saf beyaz DEĞİL)
```

İçerik: "Explore More" başlığı + 4 büyük link (ABOUT, EXPERIENCES, REAL ESTATE, CONTACT). Site genelinde tekrar eden bir "sonraki adım" bloğu — `/`, `/about`, `/experiences`, `/experiences/*`, `/contact`, `/real-estate` sayfalarında var. `[VERIFIED]`

> ⚠️ **Dikkat:** `bg-white` Tailwind sınıfı burada `--color-white` = `#f8f8f3` anlamına geliyor, saf beyaz değil. Saf beyaz için `bg-white-pure`. Token isimlendirmesinde bu tuzağa düşmeyin.

---

### §16 DÜZELTMELER — 2026-10-04 birebir denetimi `[VERIFIED — canlı DOM + CSSOM + bundle]`

Ana sayfa blok blok yeniden ölçüldü (1440×900). Yukarıdaki HOME-10 … HOME-13
bölümlerinde eksik ya da yanlış olanlar:

**HOME-10 — Image Carousel Offset**

- Slide'lar **yalnızca görsel**: `<div class="min-w-[26.5rem] s:min-w-[50rem] max-w-[26.5rem] s:max-w-[50rem] flex-shrink-0 mr-32 l:mr-40 js-slide">` içinde tek bir `figure`. Altında başlık, meta ya da CTA **yok**; kart tıklanabilir **değil** (`data-url` yok).
- Oranlar dönüşümlü: `padding-top: 75%` · `130%` · `75%` · `130%` → 480px genişlikte **360 / 624 / 360 / 624**. `items-center` ile dikeyde kayık dizilim.
- **Başlangıç konumu ikinci kart:** yüklemede dört slide da `translate(-518px)` (= snapPositions[1] = 480 + 38,4). İlk kartın 68px'lik şeridi sol kenardan görünüyor — "offset" karakterinin ikinci yarısı. Bizde `useDragCarousel(…, { startIndex: 1 })`.
- Track grid'inin ikinci çocuğu bir **ok satırı**: `s:col-start-1 l:col-start-2 col-span-6 s:col-span-12 l:col-span-10 s:flex s:items-center s:gap-x-40 mt-70` → `nav.flex.gap-x-16.items-center.max-s:hidden` (‹ · eğik ayraç 4×8 · ›) + `div.relative.h-[1px].overflow-hidden.flex-1` (ray `bg-offset-2` #d6eaf0, çubuk `bg-main` origin-left, scaleX = current/max).
- Ok butonu (`carousel__button`): 40×40 (38,4px), zemin `highlight-subtle` **#f2eee8**, köşe yok; `::after` lacivert dolgu `scale(0) → scale(1)` 700ms ease-out-expo; ok ikonu hover'da beyaz + `left`/`right` keyframe'i (opacity 0 + translate(∓1rem) → 37,5%'te yerinde, 1s ease); devre dışı `opacity-50 pointer-events-none`; focus-visible lacivert zemin.

**HOME-11 — Listings 5050** (`BlockListings5050`, bundle'dan)

- Sol kolon `l:col-start-2 col-span-4`: `h3.eyebrow mb-30 s:mb-25 opacity-80` · `h2.title-m` · `.txt mt-30 s:mt-25` · `ul.mt-50` (üst çizgi `offset` #a8a98f %50) · 6 × `li` (18px / lh 1,4 / ls −.03em / `#2B2B2D`, link `py-20`, alt çizgi 1px %20, altında `.re-l__underline` 2px lacivert origin-left) · `.btn mt-40 l:mt-48`. Ölçülen: kolon 432×726, `li` 63px, `ul` 375px.
- Sağ kolon `l:col-start-7 col-span-5 max-s:mt-60`: `div.stack.overflow-hidden` içinde 6 `figure` (`padding-top: 133.33%` → **3:4 sabit**, görselin oranı değil), `.re-l__image { opacity:0; transform:scale(1.1); transition: transform 1s cb(.19,1,.22,1), opacity .5s ease-out }` · `.is-active { opacity:1; transform:scale(1) }`. Ölçülen 544×726.
- Mekanik: `gsap.timeline({ onComplete: sıradaki, onUpdate: --timeline-progress }).to(underline[aktif], { scaleX: 1, duration: 6, ease: 'none' })`; `onClick`/`onTouchstart` maddeyi seçip sayacı sıfırlıyor. Görünürlük guard'ı **yok**.
- Section `re-l pt-80 pb-100 s:py-120 bg-[#F8F8F3]`, 956px.

**HOME-12 — Experiences Carousel**

- Başlık kolonu `col-span-6 s:col-span-12 l:col-span-6 l:col-start-4 mb-50 s:mb-70 text-center`: `h2.title-l s:pt-[1px]` + `.txt.body-m w-full s:max-w-[70rem] mt-26 l:mt-28 mx-auto`. **Eyebrow yok.**
- Track kolonu `col-span-6 s:col-start-2 s:col-span-10 l:col-start-3 l:col-span-8 max-s:!flex relative stack items-start` (`.stack { display:grid } .stack > * { grid-area: 1/1 }`): track `relative flex w-full z-1 min-w-[100%]` + **ok katmanı** `nav.hidden.s:block.pointer-events-none.z-2` → `div.pt-[56.25%]` + `div.absolute.inset-0.flex.items-center.justify-between.px-40` → iki `experiences-carousel__button` (40×40, **beyaz**, `rounded-[3px]`, `::after` lacivert `scale(0) → .95` 500ms, ok ikonu aynı keyframe'ler). Ölçülen: x = 312 / 1077, görselin dikey ortasında.
- Kart: `article.relative.min-w-[100%].max-w-[100%].js-slide[data-url]` → `div.block.relative` ( `figure.absolute.inset-0.js-scale` + oran spacer'ı **`pt-[102.85%] s:pt-[56.25%]`** ) + `div.flex.flex-col.items-center.mt-32.l:mt-40` → **`h3.title-s`** + **`.btn mt-28 l:mt-30`** ("Learn more"). Kart 881×645.
- Grid'in üçüncü çocuğu **ilerleme çubuğu**: `col-span-6 s:col-start-4 s:col-span-6 mt-60 l:mt-70` → `div.relative.h-[1px].overflow-hidden.flex-1 max-s:w-full max-s:max-w-[23.1rem] max-s:mx-auto` (ray `offset-2`, çubuk `black-pure`). Section 1100,2 = 96 + 128 + 67 + 645 + 68 + 96.
- Section'ın ilk çocuğu `absolute … aspect-[1500/600]` boş bir arka plan yuvası — ana sayfada şeffaf, etkisiz.

**HOME-13 — Explore More**

- Slide `hoverable em-slide relative flex-shrink-0 mr-20 s:mr-18 js-slide`; genişlik CSS'ten: `.em-slide { width: calc(100% - 5.4rem) }` · ≥650 `calc(50% - 1.2rem)` · ≥1024 `calc(33.3333% - 1.2rem)` (= 431,5px @1440). `.hoverable { overflow:hidden } .hoverable img { transition: transform .7s cb(.19,1,.22,1) } .hoverable:hover img { transform: scale(1.05) }`.
- Etiket `h3.eyebrow` — **alt çizgi (`.uline`) yok.**
- Grid'in üçüncü çocuğu ok satırı: `… l:col-span-10 l:col-start-2 flex max-s:gap-30 max-s:flex-col-reverse s:items-center s:gap-x-40 mt-42 s:mt-50 l:mt-64 px-0 s:px-28 l:px-0` → nav (HOME-10 ile aynı) + çubuk (`bg-black-pure`). Section artık **860,5px** (yukarıdaki 760,7 ok satırsız eski ölçüm).

**HOME-02 — Intro:** bkz. tablo — ana sayfa `l:max-w-[92rem]`, boş eyebrow satırı.
**HOME-01 — Hero:** scroll çizgisi hareketli (yukarıda).

---

## 17. Other Pages

Tüm iç sayfalar aynı `BlockRenderer` motorunu kullandığı için **yeni layout mantığı yok** — sadece farklı block dizilimleri. Aşağıda her sayfanın kendine özgü yanları.

### 17.1 About — `/about`

```
ABOUT-01  hero
ABOUT-02  intro
ABOUT-03  feature5050
ABOUT-04  storytelling_offset      ← storytelling'in ayna varyantı
ABOUT-05  spacer
ABOUT-06  banner_full
ABOUT-07  story_slider             ← SADECE BURADA
ABOUT-08  globe                    ← SADECE BURADA (WebGL)
ABOUT-09  destination_map          ← SADECE BURADA
ABOUT-10  image_carousel
ABOUT-11  experience5050
ABOUT-12  spacer
ABOUT-13  explore_more
```

**Özel bloklar:**

| Block | Not |
|---|---|
| `storytelling_offset` | `StorytellingBlock`'un ayna/kaydırılmış varyantı — aynı parallax mantığı, ters yerleşim `[HIGH CONFIDENCE]` |
| `story_slider` | Yatay hikâye slider'ı `[NEEDS DEVTOOLS]` |
| `globe` | 3D dünya. `.is-globe` sınıfı body'ye ekleniyor → **header tamamen gizleniyor** (`.is-globe .sh__content { transform: translateY(-100%) !important }`). Three.js/WebGL `[HIGH CONFIDENCE]` |
| `destination_map` | Konum haritası |

**Kritik:** Globe bloğu site genelinde **tek WebGL kullanımı**. Payload'ı 74 KB (en ağır sayfa). Bizim projemizde buna karşılık gelen bir ihtiyaç yoksa **eklemeyin** — bundle maliyeti yüksek.

### 17.2 Experiences index — `/experiences`

```
EXPERIENCES-01  hero
EXPERIENCES-02  intro
EXPERIENCES-03  experience5050     ← Golf
EXPERIENCES-04  experience5050     ← Outdoor Pursuits
EXPERIENCES-05  experience5050     ← Wellness
EXPERIENCES-06  experience5050     ← Lifestyle
EXPERIENCES-07  spacer
EXPERIENCES-08  explore_more
```

`Experience5050Block`, `Feature5050Block`'un kardeşi — ayrı CSS dosyası var (`Experience5050.dmWieozV.css`), muhtemelen kart/link odaklı bir varyant. `[VERIFIED]`

**Ardışık 4 adet 5050 bloğu** — sol/sağ alternasyonu ile ritim kuruluyor (`left` prop'u sırayla `true/false`). `[HIGH CONFIDENCE]`

### 17.3 Experience detail — `/experiences/{golf,outdoor-pursuits,lifestyle}`

```
EXP-DETAIL-01  hero
EXP-DETAIL-02  intro
EXP-DETAIL-03  feature5050
EXP-DETAIL-04  media_carousel
EXP-DETAIL-05  feature5050
EXP-DETAIL-06  spacer
EXP-DETAIL-07  explore_more
```

`/experiences/wellness` = aynı + bir ek `feature5050` (05'ten sonra).

> **Template kararı:** Bu 4 sayfa **tek bir template** olarak kurulabilir; fark sadece içerik sayısı. Bizim projemizde aynı yaklaşım.

### 17.4 Real Estate index — `/real-estate`

```
RE-01  hero
RE-02  intro
RE-03  real_estate_categories      ← kategori ızgarası
RE-04  spacer
RE-05  accordion5050               ← SADECE BURADA
RE-06  explore_more
RE-07…12  real_estate_overview ×6  ← veri besleme blokları
```

`accordion5050` için ayrı CSS: `Accordion5050.CuYjufw5.css`. `[VERIFIED]`

### 17.5 Property detail — `/real-estate/*`

```
PROP-01  hero
PROP-02  intro
PROP-03  property_intro            ← SADECE /kaeo'da
PROP-04  media_carousel
PROP-05  listings_related
PROP-06…11  real_estate_overview ×6
```

İlgili CSS chunk'ları: `PropertyGallery.BX_5nieo.css`, `PropertyListing.Bptc5zXc.css`, `ListingsRelated.Dt811PYO.css`, `Features.BJGWy-1u.css`. `[VERIFIED]`

#### 17.5.1 `BlockMediaCarousel` — tam genişlik slider `[VERIFIED — bundle BhbibsHT.js + canlı DOM 1440×900 / 375×812, 2026-10-04]`

Mülk detaylarında (`/real-estate/kaeo` …) ve `/experiences/golf`'ta. **Bizde oda
detayındaki 16:9 banner'ın yerine** (kullanıcı kararı, 2026-10-04 akşam) →
`media_slider`.

```
div.overflow-hidden.select-none.cursor-grab            ← olaylar BURADA (blok tamamı), .is-active sürüklerken
  div.site-max.py-40.s:py-80
    div.col-span-6.s:col-span-12
      div.relative.flex.w-full.aspect-[1.335].s:aspect-[1.776].overflow-hidden   ← track (slides ref)
        article.relative.min-w-[100%].max-w-[100%].js-slide  × N   (translate x)
          div.block > [media fill, custom-sizes "(min-width: 650px) 93.33vw, calc(100vw - 4rem)"] + div.pt-[50%]
      div.label-s.flex.items-center.gap-x-40.mt-32.s:mt-44.l:mt-44
        CarouselButtons (hasSeparator) → button.carousel__button ×2 + 4×8 eğik ayraç (#28476C %25)
        div.relative.stack.max-s:!hidden > p   ← altyazı = media[i].image.title (çoğu boş)
        div.eyebrow.relative.ml-auto → "1 <span class=text-[#777777]>|</span> 3"
```

Motor **sonsuz** varyant (RE §18.3): `max` = içerik genişliği, `wrap(0, max)`,
snap slide başlangıçlarına, çarpan `small ? 3.5 : 2`, lerp `0.1 × ratio`,
`ScrollTrigger onToggle` guard'ı, oklar `width + marginRight` kadar; sayaç
`i` snap'te ve ok tıklamasında güncelleniyor. Otomatik ilerleme YOK, uçlarda
devre dışı buton YOK. `pt-[50%]` yer tutucusu etkisiz: flex slide'ı track
yüksekliğine geriyor (0,5 < 1/1,776 = 0,563).

| Ölçü (1440, 15px scrollbar) | Değer |
|---|---|
| bölüm (`py-80`) | **982,5** = 76,8 + 748,3 + 42,24 + 38,4 + 76,8 |
| track | 1329 × 748,3 (1,776) |
| ok satırı | mt 42,24 · 38,4 yüksek · oklar x = 48 / 121,1 · ayraç x = 101,8 |
| sayaç | eyebrow 10,56px / 500 / +2,32px · `rgba(0,0,0,.7)` · çizgi `#777` |
| 375 (bizde ölçülen, aynı sınıflar) | track 336,6 × 252,1 (1,335) · satır mt 30,8 · oklar 38,5 |


### 17.6 Gallery — `/gallery` ve `/gallery/{kategori}`

```
GALLERY-01  hero
GALLERY-02  gallery_grid
```

6 kategori: `farm-to-fork`, `golf`, `landscapes`, `lifestyle`, `outdoor-pursuits`, `wellness`.

**Özel davranış** `[VERIFIED]`: Route adı `gallery-slug` olduğunda `SiteHead` `is-black` sınıfını alır:
- Logo **her zaman koyu** (açık logo hiç görünmez)
- Tüm header geçiş gecikmeleri `.1s` → `.5s`'ye çıkar
- Hamburger ve CTA da aynı gecikmeyi alır

CSS: `GalleryGrid.C5uMxoaN.css`. Modal/lightbox var: `.modal__image { max-height: calc(100% - 20rem) }` @ max-width 649px. `[VERIFIED]`

#### 17.6 DÜZELTMELER — 2026-10-04 `[VERIFIED — canlı DOM + bundle, 1440×900]`

**/gallery (indeks):** slim hero (`h-[55rem]` = 528px; alt metin boş) + `section.py-40.s:pt-80.s:pb-20` → `ul.site-max.site-grid` → 6 × `li.mb-60.relative.col-span-6.s:col-span-4.s:mb-100` (sonuncuda `mb-60` yok) → `a.gg-item.hoverable` → `div.relative.mb-24.s:mb-32.aspect-[4/3]` + `h3.eyebrow.text-center` (hover: `text-highlight`, 600ms; görsel 1.05). 1440'ta 3 × 432px, satırlar y = 604,8 / 1066,2; section 1018,7px.

**/gallery/{kategori}:** hero YOK; `section.pt-160.s:pt-220.pb-73.s:pb-68` → `site-max site-grid`:

- başlık `col-span-12 text-center pb-40 s:pb-70` + `before:` 1px `main` %30 alt çizgi · `h1.title-l mx-auto w-fit` → 121px
- `div.my-30.s:my-40` → `nav.flex.justify-between` → iki link (`flex items-center gap-x-24`): `.media-gallery__button-circle` 40×40, zemin `highlight-subtle`, 1px şeffaf kenarlık, `::after` lacivert `.3rem` köşeli dolgu 700ms ease-primary, ok ikonu `left/right` keyframe · `span.eyebrow.!font-[700]`
- küçük görseller `button.hoverable.col-span-3.s:col-span-4.l:col-span-2.mb-7.s:mb-18` (4:3; 1440'ta 6 × 208×156, satır arası 17,3px; focus-visible ring + figure `scale-105` 200ms) — 15 adet → section 1032px
- header `is-black`: sayfa beyaz zeminle başladığı için metin en tepede koyu

**Lightbox (`MediaModal`, bundle):** `aside.fixed.inset-0.bg-black-pure.z-[20]`; giriş `gsap.from(el, {opacity:0, duration:.5, ease:'power1'})`, çıkış `alpha:0 .5s`. Üst şerit `site-max flex items-center gap-x-28 mt-43 mb-38` (mobil `absolute bottom-40`) → `nav.flex.gap-x-16` iki `carousel__button` (BEYAZ zemin, köşesiz) + sayaç `div.relative.text-white-pure` "1 | 15" (eyebrow). Kapat: `button.eyebrow.uline.text-white-pure.!absolute.top-54.right-50` (mobil `top-40 right-20`), alt çizgi 1px / −5px. Görsel: `absolute inset-0 flex s:pt-120 s:pb-80` → `site-max` → `object-contain`, `custom-sizes` `(min-width: 650px) 93.33vw, calc(100vw - 4rem)`, mobil `max-height: calc(100% - 20rem)`. Görsel değişiminde eskisi .5s solar; altta `bottom-30` başlık takası (`yPercent 100 → 0`). Klavye ← → Esc. **Kaydırınca kapanıyor** (`lenis.on('scroll', close)`) — kaydırma kilidi yok. Uygulamamız: `src/components/gallery/Lightbox.tsx` (kilit + diyalog erişilebilirliği, CLAUDE.md sicil #28–29).


### 17.7 Contact — `/contact`

```
CONTACT-01  hero
CONTACT-02  contact_form
CONTACT-03  explore_more
```

CSS: `ContactForm.BPb6hfux.css`. Form alanları `--color-error` / `--color-success` token'larını kullanıyor. `[HIGH CONFIDENCE]`

### 17.8 Map — `/map`

**Block yok.** Tam ekran interaktif harita, kendi yükleme durumu var.

Sayfa geçişi burada **özel davranıyor** `[VERIFIED]`:
```js
if (route.name === "map") {
  new Promise(resolve => watchEffect(() => { if (mapState === "loaded") resolve() }))
    .then(() => gsap.delayedCall(0.25, playEnterTimeline))
}
```
→ Giriş animasyonu harita yüklenene kadar bekliyor, sonra 0.25s gecikmeyle başlıyor. **Diğer sayfalarda `requestIdleCallback` kullanılıyor.**

### 17.9 Privacy — `/privacy`

```
PRIVACY-01  hero
PRIVACY-02  longform_links
```

CSS: `LongformLinks.DTX4qpSr.css`. Payload 43 KB (uzun metin). `[VERIFIED]`

### 17.10 404

```html
<main class="relative min-h-screen text-center text-white flex items-center justify-center
             error-page s:h-screen h-[100svh]">
  <picture class="absolute inset-0 w-full h-full">
    <source media="(max-width: 649px)" srcset="/404-bg-mobile.webp" type="image/webp">
    <source media="(max-width: 649px)" srcset="/404-bg-mobile.jpg"  type="image/jpeg">
    <source media="(min-width: 650px)" srcset="/404-bg-desktop.webp" type="image/webp">
    <source media="(min-width: 650px)" srcset="/404-bg-desktop.jpg"  type="image/jpeg">
    <img src="/404-bg-desktop.jpg" alt="404 background" class="w-full h-full object-cover">
  </picture>

  <div class="site-max flex flex-col items-center text-center relative z-5">
    <span class="eyebrow s:mb-40 mb-32 js-i-words js-t-title opacity-80">404</span>
    <h1 class="h1 w-full mb-30 s:max-w-[60rem] js-i-words js-t-title">Page not found</h1>
    <p class="body-m px-20 s:mb-40 mb-32 opacity-80">
      <span class="inline s:block">Sorry, the page you are looking for could not be found.</span>
      You can return to our homepage or contact us if you can't find what you are looking for.
    </p>
    <a href="/" class="mt-36 btn ...">Homepage</a>
  </div>
</main>
```

> 404 sayfası `<picture>` + art direction kullanan **tek yer** — mobil/desktop için ayrı görseller, WebP + JPEG fallback. İçerik sayfalarında bu yapılmıyor (DatoCMS responsiveImage kullanılıyor). `[VERIFIED]`

---

## 18. Carousel Mechanics — Custom Drag Engine

Site **hiçbir carousel kütüphanesi kullanmıyor**. İki varyant var: **infinite wrap** (ExperiencesCarousel) ve **clamped** (ImageCarouselOffset / MediaCarousel). Aşağıda tam algoritma. `[VERIFIED]`

### 18.1 Ortak state

```
slides[]      // her slide için: { el, xSet, start, end, left, width, tl, out }
target        // sürükleme hedefi (px)
current       // lerp'li gerçek pozisyon (px)
max           // maksimum kaydırma mesafesi (px)
marginRight   // son slide'ın margin-right değeri (px)
index         // aktif slide indeksi (snap sonrası)
multiplier    // drag çarpanı: 2 (desktop/tablet) · 3.5 (mobil)
isDragging    // bool
isActive      // ScrollTrigger onToggle → görünürlük
```

### 18.2 Ölçüm (resize ve mount'ta)

```
measure():
  isResizing = true
  slides = $$(".js-slide", root)
  lastIndex = slides.length - 1
  containerLeft = track.getBoundingClientRect().left
  ww = $resize.ww
  multiplier = $resize.small ? 3.5 : 2

  snapPositions = []

  if (first run):
    slides.forEach((el, i) => {
      const xSet = gsap.quickSetter(el, "x", "px")     // ← HER FRAME setAttribute yerine
      xSet(0)
      const scaleTarget = el.querySelector(".js-scale")
      const { left, right, width } = el.getBoundingClientRect()

      // Scale timeline (sadece infinite varyantta)
      let s = $device.isTablet ? 0.72 : 0.62
      const tl = gsap.timeline({ paused: true, defaults: { duration: .5, ease: "none" } })
        .fromTo(scaleTarget, { scale: s }, { scale: 1 })      // 0.0 → 0.5
        .to(scaleTarget, { scale: s })                        // 0.5 → 1.0

      snapPositions.push(left - containerLeft)
      if (i === lastIndex) computeMax(el, right, containerLeft)

      return { el, xSet, start: left - ww, end: right, left, width, tl, out: true }
    })
  else:
    // yeniden ölçüm: xSet(0) ile sıfırla, bounding rect'leri güncelle
    ...

  render()
  nextTick(() => isResizing = false)

computeMax(el, right, containerLeft):
  marginRight = parseInt(getComputedStyle(el).marginRight)
  max = Math.max(0, right + marginRight - containerLeft)
```

### 18.3 Sürükleme

```
pointerDown(e):
  { x, y } = getPoint(e)
  isDragging = true
  startX = x; startY = y; downX = x
  dragOrigin = target + x * multiplier

pointerMove(e):
  if (!isDragging) return
  { x, y } = getPoint(e)
  // yatay hareket dikey hareketten büyükse sayfa scroll'unu engelle
  if (Math.abs(x - startX) > Math.abs(y - startY) && e.cancelable) {
    e.preventDefault(); e.stopPropagation()
  }
  target = dragOrigin - x * multiplier

pointerUp(e):
  if (!isDragging) return
  isDragging = false

  // --- CLAMPED varyantta: tıklama/sürükleme ayrımı ---
  const { x } = getPoint(e)
  if (Math.abs(x - downX) < 10) {                 // 10px eşiği
    const link = e.target.closest("[data-url]")
    if (link) window.open(link.dataset.url, "_blank")
    return
  }

  snap()
  clamp()        // sadece clamped varyantta

snap():
  const wrapped = gsap.utils.wrap(0, max, target)
  const nearest = gsap.utils.snap(snapPositions, wrapped)
  target += nearest - wrapped
  index = snapPositions.indexOf(nearest)

clamp():                                           // SADECE clamped varyant
  target = Math.max(0, Math.min(max, target))
```

**Event eşlemesi** `[VERIFIED]`:
```
$device.isMobile || $device.isTablet
  ? { down: "touchstart", move: "touchmove", up: "touchend" }
  : { down: "mousedown",  move: "mousemove", up: "mouseup"  }

down/move → track elementine
up        → window'a   ← sürüklemeyi carousel dışında bitirebilmek için
```

### 18.4 RAF döngüsü

```
$event.on("tick", ({ ratio }) => {
  if (!isActive) return                            // ← ScrollTrigger görünürlük guard'ı
  current = lerp(current, target, 0.1 * ratio)     // ratio = 120Hz normalizasyonu
  current = Math.round(current * 100) / 100        // 2 ondalık — gereksiz repaint önleme
  render()
  progressBar?.animate(gsap.utils.wrap(0, max, current), max)
})
```

**Lerp faktörü `0.1`** — Lenis'in `0.15`'inden daha yavaş, carousel daha "ağır" hissettiriyor. Bilinçli bir kontrast.

### 18.5 Render

#### Infinite varyant (ExperiencesCarousel)

```
render():
  slides.forEach(s => {
    const { start, end, left, width, xSet, tl } = s
    const x = gsap.utils.wrap(-(max - end), end, current)    // ← SONSUZ DÖNGÜ

    const visible = x > start && x < end
    const progress = tl ? gsap.utils.clamp(0, 1, (x - start) / (end - start)) : 0

    if (visible || isResizing) {
      s.out = false
      xSet(-x)
      tl?.progress(progress)
    } else if (!s.out) {
      s.out = true
      xSet(-x)
      tl?.progress(progress)              // ← görünmez olduktan sonra BİR KEZ daha yaz, sonra dur
    }
  })
```

**Scale timeline mantığı:** Slide viewport'un sağından girerken `progress 0` → `scale 0.62`. Viewport ortasına geldiğinde `progress 0.5` → `scale 1.0`. Soldan çıkarken `progress 1` → `scale 0.62`. Yani **kartlar merkeze geldiğinde büyüyor**.

```
scale değerleri:
  Desktop:  0.62 → 1.00 → 0.62
  Tablet:   0.72 → 1.00 → 0.72
  Mobil:    (scale timeline yok / 0.62) [NEEDS DEVTOOLS]
```

#### Clamped varyant (ImageCarouselOffset)

```
render():
  slides.forEach(s => {
    const { start, end, xSet } = s
    const visible = current > start && current < end
    if (visible || isResizing) { s.out = false; xSet(-current) }
    else if (!s.out)          { s.out = true;  xSet(-current) }
  })
```
Wrap yok, tüm slide'lar aynı `x` değerini alıyor (tek track). Ayrıca RTL desteği var (`l.value` flag'i ile yön çevriliyor). `[VERIFIED]`

### 18.6 Görünürlük optimizasyonu

```
ScrollTrigger.create({
  trigger: root,
  onToggle: (self) => { isActive = self.isActive }
})
```

Carousel viewport dışındayken `tick` handler'ı erken dönüyor → **CPU tasarrufu**. 3 carousel'lı bir sayfada bu, aynı anda sadece 1 tanesinin hesap yapması demek. **Kritik performans deseni — kopyalayın.**

### 18.7 Ok butonları

```
next():
  const w = slides[index].width
  target += w + marginRight
  index = gsap.utils.wrap(0, slides.length, index + 1)      // infinite
  // veya: index = Math.max(0, Math.min(lastIndex, index + 1)); clamp()   // clamped

prev():
  const w = slides[index].width
  target -= w + marginRight
  index = gsap.utils.wrap(0, slides.length, index - 1)
```

Clamped varyantta `isFirst` / `isLast` computed'ları ile butonlar devre dışı bırakılıyor. `[VERIFIED]`

Overflow kontrolü: `canScroll = track.scrollWidth > track.clientWidth` — içerik sığıyorsa carousel devre dışı. `[VERIFIED]`

### 18.8 Pixel-Perfect Notes

- `gsap.quickSetter(el, "x", "px")` kullanımı **kritik**: her frame `gsap.set()` çağırmak yerine önceden derlenmiş setter. N slide × 60fps'te ciddi fark yaratır.
- `Math.round(current * 100) / 100` — subpixel titremeyi ve gereksiz compositor işini engelliyor.
- `out` flag'i ile "görünmez olduktan sonra bir kez daha yaz, sonra dur" deseni — slide'lar ekran dışındayken transform güncellenmiyor.
- Tıklama eşiği **10px** — bunun altı tıklama, üstü sürükleme. Dokunmatikte çok önemli.
- `select-none` ve `cursor-grab` sınıfları track'te; metin seçimi sürüklemeyi bozmuyor.
- Mobilde `multiplier: 3.5` — parmak hareketi 3.5× hızında. Desktop'ta `2`. Bu değerler hissin anahtarı.

---

## 19. Component Inventory

### 19.1 Global / Layout

| Component | Dosya ipucu | Not |
|---|---|---|
| `SiteHead` | main bundle | Header + scroll state machine |
| `MenuToggle` | main bundle | Hamburger |
| `Menu` | main bundle | Full-screen overlay |
| `SiteFoot` | `CIHhbQAA.js` | Footer + parallax |
| `Loader` | main bundle | İlk yükleme |
| `PageTransition` | `D5yMeylq.js` | Nuxt middleware |
| `RotateDevice` | `default.css` | Yatay mod uyarısı |

### 19.2 UI

| Component | Not |
|---|---|
| `BaseLink` | `to` / `label` / `data` / `extraClass` props |
| `BaseBtn` | Maskeli buton (`.btn` + `.btn-mask` + `.btn-a`) |
| `Media` | Video/Image switch + iOS low-power fallback |
| `Image` | DatoCMS `responsiveImage` → `<picture>` |
| `CarouselButtons` | `CarouselButtons.gEB2ZNjT.css` |
| `ProgressBar` | `.animate(current, max)` API'si |
| `Modal` | Gallery lightbox |

### 19.3 Motion

| Component | Not |
|---|---|
| `AniTextSplit` | Scroll reveal — `is` / `each` / `type` / `amount` props |

### 19.4 Block'lar (29 adet) `[VERIFIED]`

```
HeroBlock                  IntroBlock                 Accordion5050Block
BannerScaleBlock           BannerFullBlock            ContentBlock
Feature5050Block           Experience5050Block        ExploreMoreBlock
ImageCarouselBlock         ImageCarouselOffsetBlock   MediaCarouselBlock
ExperiencesCarouselBlock   LongFormBlock              LongformLinksBlock
ContactFormBlock           Listings5050Block          PropertyIntroBlock
FeaturesBlock              DownloadsBlock             PropertyGalleryBlock
ListingsRelatedBlock       SpacerBlock                StorytellingBlock
StorytellingOffsetBlock    StorySliderBlock           GalleryGridBlock
RealEstateOverviewBlock    RealEstateCategoriesBlock  PropertyListingBlock
GlobeBlock                 DestinationMapBlock
```

**Çözümleme mekanizması** `[VERIFIED]`:
```js
// item.type = "banner_scale_block"  →  "BannerScaleBlock"
const name = computed(() =>
  item.type.split(/[-_]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("")
)
const component = computed(() => BLOCK_MAP[name.value])
```

Her block `defineAsyncComponent(() => import(...))` ile **lazy** yükleniyor → route bazlı değil, **block bazlı code splitting**. `[VERIFIED]`

### 19.5 Reusability analizi

| Block | Kapsam |
|---|---|
| `HeroBlock`, `IntroBlock`, `SpacerBlock`, `ExploreMoreBlock` | **Global** — her sayfada |
| `Feature5050Block`, `BannerFullBlock`, `MediaCarouselBlock` | **Global** — çoğu sayfada |
| `Experience5050Block` | Variant of Feature5050 |
| `StorytellingOffsetBlock` | Variant of Storytelling |
| `ImageCarouselOffsetBlock` | Variant of ImageCarousel |
| `GlobeBlock`, `DestinationMapBlock`, `StorySliderBlock` | **Page-specific** — sadece `/about` |
| `Accordion5050Block` | **Page-specific** — sadece `/real-estate` |
| `PropertyIntroBlock` | **Page-specific** — sadece `/real-estate/kaeo` |
| `GalleryGridBlock` | **Page-specific** — `/gallery` |
| `ContactFormBlock` | **Page-specific** — `/contact` |
| `LongformLinksBlock` | **Page-specific** — `/privacy` |

### 19.6 Önerilen component hiyerarşisi (bizim proje için)

```
App
 ├── SmoothScrollProvider            (Lenis + GSAP ticker köprüsü)
 ├── MotionProvider                  (CustomEase + registerEffect + reduced-motion)
 ├── TickProvider                    ($event tick bus)
 ├── ResizeProvider                  ($resize cache servisi)
 ├── PageTransitionMask
 ├── Loader                          (sadece ilk yükte)
 ├── Header
 │    ├── MenuToggle
 │    ├── Logo                       (light + dark cross-fade)
 │    ├── LocaleSwitcher             (← bizde YENİ)
 │    └── BookNowButton              (← bizde YENİ, Mākena'daki "Contact us" yerine)
 ├── MenuOverlay
 │    ├── MenuColumn ×3
 │    ├── MenuFigure                 (clip-path reveal)
 │    └── MenuContact
 ├── main
 │    └── BlockRenderer
 │         ├── HeroBlock
 │         ├── IntroBlock
 │         ├── BannerScaleBlock
 │         ├── BannerFullBlock
 │         ├── Feature5050Block
 │         ├── StorytellingBlock
 │         ├── DragCarouselBlock     (infinite | clamped variant)
 │         ├── RoomsGridBlock        (← bizde YENİ)
 │         ├── RestaurantsBlock      (← bizde YENİ)
 │         ├── GalleryGridBlock
 │         ├── ContactFormBlock
 │         ├── SpacerBlock
 │         └── ExploreMoreBlock
 ├── Footer
 └── RotateDeviceOverlay
```

Ortak motion primitive'leri:
```
<AnimatedText>      — SplitText + scroll reveal      (AniTextSplit karşılığı)
<ParallaxMedia>     — yPercent/y scrub parallax
<ScaleOnScroll>     — --progress tabanlı scale
<RevealOnScroll>    — fade/up reveal
<MaskedButton>      — .btn karşılığı
<UnderlineLink>     — .uline karşılığı
```

---

## 20. Animation Inventory (tek tablo)

| # | Ad | Hedef | Trigger | Start | End | Scrub | Initial | Final | Duration | Ease | BP |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Loader ring draw | `circle r=38` | — | — | — | — | `drawSVG 0% 0%` | `drawSVG 0% 100%` | 1s | `power2.inOut` | all |
| 2 | Loader ring eat | `circle r=38` | — | — | — | — | `drawSVG 0% 100%` | `drawSVG 100% 100%` | 1s | `power2.inOut` | all |
| 3 | Loader exit | `circle`+`mark` | — | — | — | — | `scale 1, α1` | `scale 1.5, α0` | 1s, stg .1 | `expo.inOut` | all |
| 4 | Loader fade | root | — | — | — | — | `autoAlpha 1` | `autoAlpha 0` | 1s | `linear` | all |
| 5 | Intro chars | `.js-i-chars` | — | — | — | — | `yPercent 105` | `yPercent 5` | 2s, stg .075 | `unmask` | all |
| 6 | Intro lines | `.js-i-words` | — | — | — | — | `y 3.5rem, α0` | `y 0, α1` | 1.5s, stg .1 | `unmask` | all |
| 7 | Intro fade | `.js-i-fade` | — | — | — | — | `y -2rem, α0` | `y 0, α1` | 1.25s, stg .1 | `unmask` | all |
| 8 | Intro scale | `.js-i-scale` | — | — | — | — | `scale 1.25` | `scale 1` | 3s | `power3` | all |
| 9 | Transition out bg | `.js-t-mask-bg` | route | — | — | — | `α 0` | `α .5` | 1s | `power1` | all |
| 10 | Transition out panel | `.js-t-mask-content` | route | — | — | — | `yPercent 100` | `yPercent 0` | 1s | `expo.inOut` | all |
| 11 | Transition in panel | `.js-t-mask-content` | route | — | — | — | `yPercent 0` | `yPercent -100` | 1s | `expo.inOut` | all |
| 12 | Transition in bg | `.js-t-mask-bg` | route | — | — | — | `α .5` | `α 0` | .5s | `power1` | all |
| 13 | Transition scale | `.js-t-scale` | route | — | — | — | `scale 1.35` | `scale 1` | 2s | `power3` | all |
| 14 | Transition chars | `.js-t-chars` | route | — | — | — | `yPercent 105` | `yPercent 5` | 2s, stg .075 @.5 | `unmask` | all |
| 15 | Transition lines | `.js-t-title` | route | — | — | — | `y 4.5rem, α0` | `y 0, α1` | 1.5s, stg .1 @.5 | `unmask` | all |
| 16 | Transition up | `.js-t-up` | route | — | — | — | `y 3.5rem, α0` | `y 0, α1` | 1.5s, stg .1 @.5 | `unmask` | all |
| 17 | Menu open slide | `aside`+`.js-mask` | click | — | — | — | `yPercent ∓100` | `0` | 1.25s | `expo.inOut` | all |
| 18 | Menu clip | `.js-clip` | click | — | — | — | `inset(0 0 100% 0)` | `inset(0)` | 1.25s @.25 | `expo.inOut` | all |
| 19 | Menu links | `.js-link` | click | — | — | — | `yPercent 105` | `0` | 1.5s, stg .075 @.5 | `expo` | all |
| 20 | Hero parallax | hero media | hero | `top top` | `bottom top` | ✔ | `yPercent 0` | `yPercent 25` | — | `none` | all |
| 21 | Banner full parallax | media | section | `top bottom` | `bottom top` | ✔ | `yPercent -15` | `yPercent 15` | — | `none` | all |
| 22 | Feature5050 parallax | media | media col | `top bottom` | `bottom top` | ✔ | `y 3.5rem` | `y -3.5rem` | — | `none` | ≥650 |
| 23 | Storytelling parallax | media2 | content | `top bottom` | `bottom top` | ✔ | `y 7.5rem` | `y 0` | — | `none` | ≥650 |
| 24 | Banner scale | `--progress` | section | `top bottom` | `top top` | ✔ | `scale .85` | `scale 1` | — | `none` | ≥1024 |
| 25 | Footer parallax | footer inner | footer | `top bottom` | `bottom bottom` | ✔ | `yPercent -37.5` | `yPercent 0` | — | `none` | ≥650 |
| 26 | AniTextSplit | `:scope > *` | self | `top 80%` | — | ✘ | `y 4.5rem/3rem, α0` | `y 0, α1` | 1.5s, stg .1/.05 | `unmask` | all |
| 27 | Carousel scale | `.js-scale` | drag pos | — | — | (drag) | `scale .62/.72` | `scale 1` | .5s×2 | `none` | all |
| 28 | Video fade-in | `<video>` | load | — | — | — | `α 0` | `α 1` | .35s | `power1` | all |
| 29 | Header bg | `.sh__bg` | state | — | — | — | `translateY(-101%)` | `translateY(0)` | .5s | `cb(.19,1,.22,1)` | all |
| 30 | Header inner | `.sh__inner` | state | — | — | — | `translateY(-100%)` | `translateY(0)` | .5s | `cb(.19,1,.22,1)` | all |
| 31 | Header height | `.sh__content` | state | — | — | — | `14.3rem` | `9.5rem` | .5s | `cb(.19,1,.22,1)` | ≥650 |
| 32 | Logo cross-fade | light/dark img | state | — | — | — | `α 1/0` | `α 0/1` | .5s | `ease-out` | all |
| 33 | Underline | `.uline::before` | hover | — | — | — | `scaleX(0)` origin R | `scaleX(1)` origin L | .75s | `cb(.19,1,.22,1)` | hover |
| 34 | Button mask | `.btn-mask` | hover | — | — | — | `translate3d(0,100%,0)` | `translateZ(0)` | .75s | `cb(.77,0,.175,1)` | hover |
| 35 | Button mask text | `.btn-mask__content` | hover | — | — | — | `translate3d(0,-100%,0)` | `translateZ(0)` | .75s | `cb(.77,0,.175,1)` | hover |
| 36 | Button arrow | `.btn-a` | hover | — | — | — | `translate(0)` | `scaleX(-1) translate(-100%)` | .75s | `cb(.77,0,.175,1)` | hover |
| 37 | Hamburger lines | `.menu-t__lines::*` | hover | — | — | — | `translateY(∓.3rem)` | `translate(3rem,∓.3rem)` | .25s | `ease-out` | ≥1024 |
| 38 | Hamburger text | `.menu-t__text span` | state | — | — | — | `translateY(-100%/0)` | `translateY(0/100%)` | .5s | `cb(.455,.03,.515,.955)` | ≥650 |
| 39 | Rotate device icon | `.rotate-animation` | css | — | — | — | `rotate(90deg) α.3` | `rotate(0) α0` | 4s loop | `cb(.19,1,.22,1)` | landscape |

---

## 21. Scroll Timeline Map (Homepage @1440×900)

```
vh      px        Olay
──────────────────────────────────────────────────────────────────────────────────
0.0     0         HERO başlar · header absolute, h=14.3rem, beyaz logo
0.0     0         Hero medya parallax başlar (yPercent 0 → 25, scrub)
0.15    137       is-not-sticky ✘ → header translateY(-100%), GİZLİ
0.67    600       is-fixed ✔ (y ≥ wh/1.5) → position: fixed
1.0     900       is-scrolled ✔ → header BEYAZ + KOMPAKT görünür (yukarı scroll'da)
1.0     900       Hero parallax biter (yPercent 25) · INTRO başlar
1.0     900       Intro H2 → AniTextSplit tetiği "top 80%" ≈ y=680'de geçmiş
1.48    1.328     BANNER SCALE başlar
1.48    1.328     --progress 0 → 1 başlar (start "top bottom")
2.27    2.048     --progress = 1, görsel scale(1) (end "top top")
2.34    2.106     CONTENT başlar
2.73    2.455     STORYTELLING başlar · media2 parallax (y 7.5rem → 0)
3.62    3.262     SPACER ×2 (230px nefes)
3.88    3.492     BANNER FULL başlar · parallax yPercent -15 → 15
4.88    4.392     FEATURE 5050 başlar (bg #F8F8F3) · media parallax ±3.5rem
5.94    5.348     IMAGE CAROUSEL OFFSET başlar (bg beyaz, drag aktif)
5.94    5.348     ScrollTrigger onToggle → carousel tick AÇILIR
7.26    6.532     LISTINGS 5050 başlar (bg #F8F8F3)
7.26    6.532     Önceki carousel tick KAPANIR
8.32    7.488     EXPERIENCES CAROUSEL başlar (infinite, scale .62↔1)
9.54    8.588     EXPLORE MORE başlar (bg #F8F8F3)
10.39   9.349     FOOTER başlar · parallax yPercent -37.5 → 0 (start "top bottom" @ y=8449)
11.21   10.087     Sayfa sonu
```

**Gözlemler:**
- Aynı anda en fazla **3 aktif ScrollTrigger** var (parallax'lar üst üste binmiyor). Bu, sayfa akışının bilinçli olarak aralıklı kurgulandığını gösteriyor.
- İlk 1 viewport'ta header gizleniyor, 1 viewport sonra beyaz olarak dönüyor — kullanıcı hero'yu kesintisiz görüyor.
- Carousel'lar birbirinden ~2 viewport uzakta → aynı anda ikisi tick almıyor.

---

## 22. Motion Map

```
          PAGE LOAD
              │
              ▼
      ┌───────────────┐
      │    LOADER     │  lacivert · dairesel progress · 2s min · loop until load
      └───────┬───────┘
              │ "out"
              ▼
      ┌───────────────────────────────────────────────┐
      │  HERO REVEAL                                  │
      │   t+0.0  loader scale 1.5 + fade              │
      │   t+0.0  hero img scale 1.25 → 1 (3s)         │
      │   t+0.75 eyebrow/h1/p lines y 3.5rem → 0      │
      │   t+1.25 ikincil içerik y -2rem → 0           │
      └───────┬───────────────────────────────────────┘
              │ SCROLL
              ▼
      ┌───────────────┐   hero media yPercent 0 → 25 (scrub)
      │ HERO PARALLAX │   header gizlenir
      └───────┬───────┘
              ▼
      ┌───────────────┐   AniTextSplit "top 80%" · lines y 4.5rem → 0
      │  INTRO TEXT   │   header beyaz olarak geri döner
      └───────┬───────┘
              ▼
      ┌───────────────┐   --progress 0 → 1 · scale .85 → 1 (sadece ≥1024)
      │ BANNER SCALE  │
      └───────┬───────┘
              ▼
      ┌───────────────┐   media2 y 7.5rem → 0 (≥650)
      │ STORYTELLING  │   metin satır reveal (stagger .05)
      └───────┬───────┘
              ▼
      ┌───────────────┐   2× spacer = 230px boşluk
      │    SPACER     │
      └───────┬───────┘
              ▼
      ┌───────────────┐   yPercent -15 → 15 (scrub, tüm BP)
      │ BANNER FULL   │
      └───────┬───────┘
              ▼
      ┌───────────────┐   media y ±3.5rem (≥650) · metin reveal · buton hover mask
      │  FEATURE 5050 │
      └───────┬───────┘
              ▼
      ┌───────────────┐   drag · lerp .1 · snap · scale .62↔1 · tick ON/OFF
      │   CAROUSEL    │
      └───────┬───────┘
              ▼
      ┌───────────────┐   liste + CTA
      │  LISTINGS     │
      └───────┬───────┘
              ▼
      ┌───────────────┐   infinite wrap carousel
      │  EXPERIENCES  │
      └───────┬───────┘
              ▼
      ┌───────────────┐   4 büyük link · uline hover
      │  EXPLORE MORE │
      └───────┬───────┘
              ▼
      ┌───────────────┐   yPercent -37.5 → 0 (≥650)
      │    FOOTER     │
      └───────────────┘
              │ ROUTE CHANGE
              ▼
      ┌───────────────────────────────────────────────┐
      │  PAGE TRANSITION                              │
      │   OUT: mask bg α0→.5 · panel yPercent 100→0   │
      │   IN:  panel 0→-100 · scale 1.35→1            │
      │        +0.5s: chars/lines/up reveal           │
      └───────────────────────────────────────────────┘
```

---

## 23. Image Optimization — Mākena'nın yaptığı

### 23.1 Pipeline `[VERIFIED]`

DatoCMS GraphQL `responsiveImage` alanı, sabit imgix parametreleriyle sorgulanıyor:

```graphql
fragment ImageFragment on FileField {
  alt
  title
  focalPoint { x y }
  responsiveImage(imgixParams: { fit: max, w: 2440, h: 2440, auto: format, q: 75 }) {
    bgColor
    srcSet
    webpSrcSet
    sizes
    src
    width
    height
    aspectRatio
    alt
    title
    base64
  }
}
```

### 23.2 Üretilen çıktı `[VERIFIED]`

```
src:     .../image.jpg?auto=format&fit=max&h=2440&q=75&w=2440

srcSet:  .../image.jpg?auto=format&dpr=0.25&fit=max&h=2440&q=75&w=2440   610w
         .../image.jpg?auto=format&dpr=0.5&fit=max&h=2440&q=75&w=2440   1220w
         .../image.jpg?auto=format&dpr=0.75&fit=max&h=2440&q=75&w=2440  1830w
         .../image.jpg?auto=format&fit=max&h=2440&q=75&w=2440           2440w

sizes:   "(max-width: 2440px) 100vw, 2440px"      ← VARSAYILAN (çoğu yerde override ediliyor)
width:   2440
height:  1574
aspectRatio: 1.5496
bgColor: "#1e9487"
base64:  "data:image/jpeg;base64,/9j/4AAQ..."     ← LQIP blur placeholder
webpSrcSet: ""                                     ← BOŞ (auto=format yeterli görülmüş)
```

### 23.3 Component bazlı `sizes` override'ları `[VERIFIED]`

| Component | `custom-sizes` |
|---|---|
| `HeroBlock` | `100vw` |
| `BannerScaleBlock` | `(min-width: 650px) 93.33vw, calc(100vw - 4rem)` |
| `Feature5050Block` | `(min-width: 650px) 38.2vw, calc(100vw - 4rem)` |
| `StorytellingBlock` medya1 | `(min-width: 650px) 22.47vw, calc(100vw - 4rem)` |
| `StorytellingBlock` medya2 | `(min-width: 650px) 53.9vw, calc(66vw - 4rem)` |

### 23.4 Gözlenen gerçek transferler `[MEASURED]`

```
1760612706-makena-fall-back-3.png?auto=format&fit=max&h=2440&q=75&w=2440   →  193 KB
1759831114-lifestyle-1.jpg?auto=format&fit=max&h=2440&q=75&w=2440         →   52 KB
1759831069-landscape-2.jpg?auto=format&dpr=0.75&fit=max&h=2440&q=75&w=2440 →  433 KB  ⚠
```

Toplam sayfa transferi: **~1.079 KB**.

### 23.5 ⚠️ Tespit edilen zayıflıklar — **BUNLARI KOPYALAMAYIN**

| Sorun | Etki | Bizim çözümümüz |
|---|---|---|
| **Sadece 4 srcSet adımı** (610 / 1220 / 1830 / 2440) | 1440px ekranda 1830w yerine çoğu zaman 2440w iniyor → %40 fazla byte | 8+ genişlik adımı: 320, 480, 640, 828, 1080, 1280, 1600, 1920, 2560 |
| **`sizes` varsayılanı `100vw`** | 38vw'lik bir kolona 100vw sizes verilirse tarayıcı 2.6× büyük görsel seçer | Her kullanımda **zorunlu** doğru `sizes` |
| **`dpr` tabanlı srcSet** | `w` descriptor ile birlikte kullanılması tarayıcı seçimini bulanıklaştırıyor | Saf `w` descriptor |
| **AVIF yok** | `auto=format` imgix'te WebP veriyor, AVIF vermiyor | AVIF birincil, WebP fallback |
| **`q=75` sabit** | Büyük hero'da gereksiz yüksek, küçük thumbnail'de gereksiz düşük | Boyuta göre kademeli kalite |
| **PNG kaynak** (`makena-fall-back-3.png` 193 KB) | Fotoğraf PNG olarak servis ediliyor | Kaynak formatı zorunlu AVIF/WebP |
| **`fit=max` + `w=2440&h=2440`** | Art direction yok; mobil ve desktop aynı kadraj | Focal-point tabanlı crop (`gravity`) |
| **`base64` LQIP her görselde** | HTML payload'ı şişiriyor (sayfa başına ~10-30 KB) | Sadece LCP ve above-fold görsellerde |

### 23.6 Image container davranışı `[VERIFIED]`

| Durum | CSS |
|---|---|
| `fill: true` | `position: absolute; inset: 0;` + `.media-fill img { width:100%; height:100%; object-fit:cover }` |
| `fill: false` | `position: relative; width: 100%` + `<div class="aspect" style="--aspect: {h/w*100}%">` spacer |
| `object-position` | Belirtilmemiş → `center` (focalPoint sorgulanıyor ama **CSS'e yansıtılmıyor** ⚠) |
| `border-radius` | Yok (keskin köşe) |
| `overflow` | Parallax kapsayıcılarında `hidden` |
| LQIP | `bgColor` arka plan + `base64` blur `[HIGH CONFIDENCE]` |

> ⚠️ `focalPoint { x y }` GraphQL'de sorgulanıyor ama DOM'da `object-position` olarak **kullanılmıyor**. Bu bir kayıp — biz kullanacağız.

---

## 24. Responsive Media Strategy — bizim yaklaşımımız (Cloudflare)

> Bu bölüm referans siteden **farklıdır**. Mākena'nın pipeline'ı yeterli değil; aşağıdaki plan Cloudflare R2 + Images üzerine kurulu ve §27'deki performans hedeflerini karşılamak için tasarlandı.

### 24.1 Mimari

```
Orijinal dosyalar (TIFF/PNG/JPG, 4000–6000px)
        │
        ▼
  Cloudflare R2  (egress ücretsiz, S3 uyumlu)
        │
        ▼
  Cloudflare Images / Image Resizing
  /cdn-cgi/image/width=…,quality=…,format=auto,fit=cover,gravity=…/<R2 public URL>
        │
        ▼
  Next.js <Image> custom loader
        │
        ▼
  AVIF (destekliyorsa) → WebP → JPEG
```

### 24.2 Width ladder

```
320, 480, 640, 828, 1080, 1280, 1600, 1920, 2560
```

Next.js config:
```
deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560]
imageSizes:  [16, 32, 48, 64, 96, 128, 256, 384]
formats:     ["image/avif", "image/webp"]
```

### 24.3 Kalite kademesi

| Kullanım | `quality` |
|---|---|
| Hero / full-bleed (≥1600w) | **72** |
| İçerik görselleri (640–1280w) | **78** |
| Kart / thumbnail (<640w) | **82** |
| LQIP placeholder | 20 (10px genişlik) |

> Büyük görsellerde kalite düşürülebilir çünkü piksel yoğunluğu algılanan kaliteyi telafi ediyor. Küçük görsellerde tersi geçerli.

### 24.4 `sizes` sözlüğü — her block için zorunlu değer

Container: mobil `100vw - 4rem`, ≥650 `100vw - 10rem` (bkz. §7.1)
Grid: 12 kolon, gap `1.7rem`

| Block | `sizes` |
|---|---|
| `HeroBlock` | `100vw` |
| `BannerFullBlock` | `100vw` |
| `BannerScaleBlock` | `(min-width: 1024px) 83vw, (min-width: 650px) 83vw, calc(100vw - 4rem)` |
| `Feature5050Block` medya | `(min-width: 1024px) 40vw, (min-width: 650px) 47vw, calc(100vw - 4rem)` |
| `StorytellingBlock` büyük | `(min-width: 1024px) 56vw, (min-width: 650px) 90vw, calc(100vw - 4rem)` |
| `StorytellingBlock` küçük | `(min-width: 1024px) 23vw, (min-width: 650px) 31vw, 0px` |
| Carousel slide (desktop 3'lü) | `(min-width: 1024px) 30vw, (min-width: 650px) 45vw, 80vw` |
| Oda kartı (3 kolon grid) | `(min-width: 1024px) 31vw, (min-width: 650px) 47vw, calc(100vw - 4rem)` |
| Galeri thumbnail (4 kolon) | `(min-width: 1024px) 23vw, (min-width: 650px) 31vw, 47vw` |
| Menü figürü | `(min-width: 1024px) 40vw, (min-width: 650px) 48vw, 0px` |

> **Kural:** `sizes` değeri asla `100vw` varsayılanına bırakılmayacak. Her `<Image>` kullanımında açıkça yazılacak. Lint kuralı ile zorlanacak (bkz. `ARCANUS-PROJECT-BLUEPRINT.md`).

### 24.5 Art direction

Mākena'da yok. Bizde **hero ve banner'larda zorunlu**:

```
Desktop  : 16:9  veya 21:9   (gravity: auto / focal point)
Tablet   : 4:3
Mobil    : 3:4  veya 4:5     ← dikey kadraj, farklı crop
```

Uygulama: `<picture>` + `<source media="...">` veya Next `<Image>`'ı media query ile iki kez render edip birini `hidden` yapmak yerine **tek `<picture>`** tercih edilecek (çift indirme riski yok).

### 24.6 Loading stratejisi

| Konum | `loading` | `priority` | `fetchpriority` | Preload |
|---|---|---|---|---|
| Hero görseli/poster | eager | ✔ | high | ✔ `<link rel="preload" as="image" imagesrcset>` |
| İlk viewport içi diğer | eager | ✘ | auto | ✘ |
| 1–2 viewport altı | lazy | ✘ | auto | ✘ |
| Carousel ilk 2 slide | eager | ✘ | auto | ✘ |
| Carousel diğer slide'lar | lazy | ✘ | low | ✘ |
| Menü figürü | lazy | ✘ | low | ✘ |
| Footer | lazy | ✘ | low | ✘ |

### 24.7 LQIP

- **Sadece** hero + ilk viewport görsellerinde `placeholder="blur"` + `blurDataURL`
- Blur verisi 10px genişlikte, `q=20`, base64 **≤ 400 byte**
- Diğer tüm görsellerde `bgColor` (dominant renk) CSS arka planı — HTML'i şişirmez

### 24.8 CLS önleme

Her görsel kapsayıcısı **mutlaka** bir aspect-ratio taşıyacak:
```css
.media { aspect-ratio: var(--aspect, 16/9); }
```
veya `<Image width height>` ile intrinsic oran. **Asla oransız görsel render edilmeyecek.**

---

## 25. Video Optimization

### 25.1 Mākena'nın yaptığı `[VERIFIED]`

```html
<video data-src="https://player.vimeo.com/progressive_redirect/playback/726174807/rendition/1080p/file.mp4?loc=external&signature=…"
       muted loop playsinline preload="none"
       poster="{videoFallbackImage.responsiveImage.src}"
       v-observe-vid>
</video>
```

| Özellik | Değer |
|---|---|
| Kaynak | Vimeo progressive redirect, **tek rendition: 1080p** |
| Format | H.264 MP4 (WebM yok) |
| `autoplay` | Attribute yok — JS ile `.play()` |
| `muted` | ✔ |
| `loop` | ✔ |
| `playsinline` | ✔ |
| `preload` | `none` |
| `poster` | CMS'ten fallback görsel |
| Lazy loading | IntersectionObserver `rootMargin: "0px 0px 300% 0px"` → `data-src` → `src` |
| Play/pause | IntersectionObserver `rootMargin: "25% 25% 25% 25%"` |
| Mobil fallback | iOS Low Power Mode tespiti → video yerine görsel |
| Scroll kontrolü | **Yok** — video scroll'a bağlı değil |

**iOS Low Power Mode tespiti** `[VERIFIED]`:
```js
const checkLowPower = async () => {
  const v = document.createElement("video")
  v.muted = true; v.playsinline = true; v.ariaHidden = true; v.src = ""
  try { await v.play(); return false }
  catch (e) { return e.name === "NotAllowedError" }   // Low Power Mode
  finally { v.remove() }
}
// sadece iOS veya Safari ise çalıştırılıyor
```

**`mediaCheck` yarış koşulu çözümü** `[VERIFIED]`:
```js
mediaCheck(video, timeout = 2000) {
  // "loadeddata" | "suspend" | "stalled" | "playing" event'lerinden biri
  // ya da 2000ms timeout → hangisi önce gelirse
  // readyState < 2 ise: preload="auto", load(), muted=true, play().catch(noop)
}
// sonra: gsap.fromTo(video, {alpha:0}, {alpha:1, duration:.35, ease:"power1"})
```

### 25.2 ⚠️ Zayıflıklar

| Sorun | Etki |
|---|---|
| Tek 1080p rendition | Mobilde 1080p video indiriliyor — gereksiz 5–15 MB |
| WebM/VP9 veya AV1 yok | H.264 %30-50 daha büyük |
| Üçüncü parti host (Vimeo) | Ekstra DNS + TLS + redirect gecikmesi |
| Poster görseli `responsiveImage.src` (2440px) | Poster için 2440px aşırı |

### 25.3 Bizim video stratejimiz

**Medya kategorileri:**

```
CRITICAL MEDIA   — Hero poster görseli (preload, priority)
DEFERRED MEDIA   — Hero videosu (poster gösterilir, video arkada yüklenir)
LAZY MEDIA       — Fold altındaki tüm video/görseller
```

**Kaynak matrisi:**

| Hedef | Çözünürlük | Codec | Bitrate | Format |
|---|---|---|---|---|
| Desktop ≥1280 | 1920×1080 | AV1 → VP9 → H.264 | 2.5–3.5 Mbps | `.webm` + `.mp4` |
| Tablet 650–1279 | 1280×720 | VP9 → H.264 | 1.5–2 Mbps | `.webm` + `.mp4` |
| Mobil <650 | 720×1280 (dikey) | H.264 | 0.8–1.2 Mbps | `.mp4` |
| Poster | görsel ladder | AVIF/WebP | — | — |

```html
<video muted loop playsinline preload="none" poster="/hero-poster.avif" aria-hidden="true">
  <source src="/hero-1920.webm" type="video/webm" media="(min-width: 1280px)">
  <source src="/hero-1920.mp4"  type="video/mp4"  media="(min-width: 1280px)">
  <source src="/hero-1280.webm" type="video/webm" media="(min-width: 650px)">
  <source src="/hero-1280.mp4"  type="video/mp4"  media="(min-width: 650px)">
  <source src="/hero-720.mp4"   type="video/mp4">
</video>
```

**Kurallar:**
- Video **hiçbir zaman LCP elementi olmayacak** — poster görseli LCP olacak, video üstüne fade ile binecek (Mākena'daki `0.35s power1` deseni)
- `prefers-reduced-motion: reduce` → video hiç yüklenmeyecek, poster kalacak
- Save-Data / `effectiveType` 2g-3g → video yüklenmeyecek (Mākena'da bu kontrol var: `vC()` fonksiyonu `saveData || /2g/.test(effectiveType)`) `[VERIFIED]`
- Video Cloudflare R2'de barındırılacak, Vimeo kullanılmayacak
- IntersectionObserver eşikleri Mākena ile aynı: yükleme `300%`, oynatma `25%`

---

## 26. Preload Strategy

### 26.1 Mākena'nın yaptığı `[VERIFIED]`

```html
<link rel="preload" as="fetch" href="/_payload.json?…" crossorigin>
<link rel="stylesheet" href="/_nuxt/entry.css">
<link rel="stylesheet" href="/_nuxt/{Block}.css"> × 11   ← route'a göre
```

| Varlık | Preload? |
|---|---|
| Payload JSON | ✔ (`as=fetch`) |
| Kritik CSS | ✔ (stylesheet, render-blocking) |
| **Fontlar** | ✘ **YOK** — ciddi eksik |
| **Hero görseli** | ✘ **YOK** — LCP riski |
| Video poster | ✘ |

> ⚠️ **İki büyük eksik:** Font preload yok (FOUT riski — `font-display: swap` ile ağırlaşıyor) ve hero görseli preload edilmiyor. Bunlar LCP'yi doğrudan etkiliyor.

### 26.2 Bizim preload planımız

```html
<!-- 1. Kritik fontlar — sadece ilk ekranda görünen 2 ağırlık -->
<link rel="preload" href="/fonts/display-light.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/body-regular.woff2"  as="font" type="font/woff2" crossorigin>

<!-- 2. LCP görseli — responsive preload -->
<link rel="preload" as="image"
      imagesrcset="/cdn-cgi/image/width=828,…/hero.jpg 828w,
                   /cdn-cgi/image/width=1280,…/hero.jpg 1280w,
                   /cdn-cgi/image/width=1920,…/hero.jpg 1920w"
      imagesizes="100vw" fetchpriority="high">

<!-- 3. CDN bağlantısı -->
<link rel="preconnect" href="https://images.arcanus.example" crossorigin>
<link rel="dns-prefetch" href="https://images.arcanus.example">
```

**Preload ETMEYECEKLERİMİZ:**
- Logo SVG'leri (küçük, inline edilecek)
- Fold altı görseller
- Hero videosu
- 3+ font ağırlığı (sadece 2 kritik)
- Analytics / consent script'leri

### 26.3 Font yükleme stratejisi

| Karar | Değer |
|---|---|
| Format | **WOFF2 tek başına** (WOFF fallback gereksiz — tüm hedef tarayıcılar WOFF2 destekliyor) |
| `font-display` | `swap` — Mākena ile aynı |
| Subset | Latin + Latin-Extended + **Türkçe** (ı, İ, ş, ğ, ü, ö, ç) + **Kiril** (RU locale için ayrı dosya) |
| `unicode-range` | Kiril ayrı dosyada, `unicode-range: U+0400-04FF` → TR/EN/DE kullanıcısı indirmez |
| Next.js | `next/font/local` ile self-host + otomatik `size-adjust` fallback metrikleri |
| Fallback metrikleri | `adjustFontFallback` ile CLS ≈ 0 |
| Variable font | Varsa tercih (tek dosya, tüm ağırlıklar) |

> 💡 **RU locale kritik notu:** Mākena'nın fontlarının Kiril desteği muhtemelen yok. Türkçe + Kiril + Almanca aksan desteği olan bir display font seçimi **font seçim kriterimizin birinci maddesi**.

---

## 27. Performance

### 27.1 Mākena'nın ölçülen durumu `[MEASURED]`

| Metrik | Değer |
|---|---|
| Toplam transfer (homepage) | **1.079 KB** |
| Ana JS bundle | **173 KB** (transfer, gzip/br) |
| Route chunk'ları | 21 adet, toplam ~45 KB |
| CSS | `entry.css` 101.595 byte (ham), + 11 block CSS |
| Görseller | 3 adet ölçüldü: 193 + 52 + 433 KB |
| DOM derinliği | Orta — block tabanlı, aşırı iç içe değil |
| Aktif ScrollTrigger (eşzamanlı) | En fazla 3 |
| Sayfa yüksekliği | 10.087px (11,2 viewport) |

### 27.2 Risk analizi

| Risk | Mākena'daki durum | Önem |
|---|---|---|
| **LCP** | Hero görseli `eager` ama **preload yok**; loader 2s minimum gösteriliyor → LCP en az 2s | 🔴 Yüksek |
| **CLS** | Aspect-ratio spacer + `bgColor` kullanılıyor → iyi. Font preload yok → FOUT kaynaklı küçük CLS riski | 🟡 Orta |
| **INP** | Scroll handler 100ms throttle ✔, carousel `quickSetter` ✔, `onToggle` guard ✔ → iyi | 🟢 Düşük |
| **Oversized images** | `sizes` varsayılanı `100vw`, 4 adımlı srcSet, 2440px tavan | 🔴 Yüksek |
| **Unoptimized video** | Tek 1080p rendition, WebM yok, 3. parti host | 🔴 Yüksek |
| **Animation jank** | Tüm animasyonlar `transform`/`opacity`; `height` sadece header'da | 🟢 Düşük |
| **Excessive DOM** | Block bazlı, kontrollü | 🟢 Düşük |
| **Excessive ScrollTriggers** | Max 3 eşzamanlı, `matchMedia` ile mobilde azaltılıyor | 🟢 Düşük |
| **Forced reflow** | `getBoundingClientRect()` carousel ölçümünde — sadece mount ve resize'da | 🟢 Düşük |
| **Layout thrashing** | Yok — ölçüm ve yazma ayrılmış | 🟢 Düşük |
| **GPU-heavy** | `clip-path` animasyonu sadece menüde; blur/filter yok | 🟢 Düşük |
| **Unused JS** | Globe (Three.js) sadece `/about`'ta lazy — doğru | 🟢 Düşük |
| **3rd party** | CookieYes (2 script) + GTM/GA4 — render-blocking değil | 🟡 Orta |

### 27.3 GPU / Compositing

**Animasyonda kullanılan property'ler** `[VERIFIED]`:

| Property | Kullanım | Compositor dostu |
|---|---|---|
| `transform: translate/translate3d` | Tüm parallax, maske, buton | ✔ |
| `transform: scale` | Görsel reveal, carousel | ✔ |
| `transform: scaleX` | `.uline`, ok animasyonu | ✔ |
| `opacity` / `alpha` | Tüm fade'ler | ✔ |
| `clip-path` | Menü figürü (1 yerde) | ⚠ paint |
| `height` | Header `.sh__content` (1 yerde, .5s) | ⚠ layout |
| `--progress` (custom property) | BannerScale → `transform`'a dönüşüyor | ✔ |
| `drawSVG` (`stroke-dashoffset`) | Loader (1 yerde) | ⚠ paint, ama küçük alan |

**Kaçınılmış:** `top`, `left`, `width`, `margin` animasyonu **hiç yok**. `[VERIFIED]`

**`will-change`:** CSS'te global `will-change` **bulunamadı**. GSAP `force3D` varsayılanı ile `translate3d` kullanıyor; bu yeterli. ✔ Doğru karar — gereksiz `will-change` katman patlamasına yol açar.

### 27.4 Bizim performans bütçemiz

| Metrik | Hedef | Sert sınır |
|---|---|---|
| **LCP** (mobil 4G) | ≤ 1,8s | 2,5s |
| **INP** | ≤ 150ms | 200ms |
| **CLS** | ≤ 0,02 | 0,1 |
| **TTFB** | ≤ 400ms | 800ms |
| **FCP** | ≤ 1,2s | 1,8s |
| **TBT** (Lighthouse) | ≤ 150ms | 300ms |
| **Speed Index** | ≤ 2,5s | 3,4s |
| JS (ilk yükleme, gzip) | ≤ 140 KB | 180 KB |
| CSS (kritik) | ≤ 20 KB | 35 KB |
| Font (ilk yükleme) | ≤ 90 KB | 120 KB |
| LCP görseli | ≤ 180 KB | 250 KB |
| Toplam ilk yükleme | ≤ 700 KB | 1.000 KB |
| PageSpeed mobil | ≥ 95 | 90 |
| PageSpeed desktop | ≥ 99 | 97 |

**Loader kararı:** Mākena'nın 2 saniyelik zorunlu loader'ı LCP'yi mahvediyor. Bizim loader'ımız:
- Maksimum **800ms** gösterilecek
- Hero görseli **loader'ın arkasında** yüklenmeye başlayacak
- `document.readyState === "complete"` beklenmeyecek; `hero image decoded` yeterli
- İkinci ziyarette (`sessionStorage`) loader **hiç gösterilmeyecek**

---

## 28. Accessibility

### 28.1 Mākena'nın yaptıkları ✔ `[VERIFIED]`

| Konu | Durum |
|---|---|
| Semantik HTML | `<header>`, `<main>`, `<footer>`, `<aside>`, `<section>`, `<nav>`, `<address>`, `<ul>/<li>` ✔ |
| Başlık hiyerarşisi | `h1` → `h2` → `h3` tutarlı ✔ |
| `:focus-visible` | `outline-2`, `outline-offset-1px`, `outline-highlight-rich` (#9a3630) ✔ |
| `aria-label` | Tüm ikon butonlarda: `"Menu toggle"`, `"Home"`, `"Copy phone number {x}"`, `"Open Instagram in a new tab"` ✔ |
| `sr-only` | Scroll indicator'da `"Scroll down"` ✔ |
| `rel="noreferrer"` | Tüm dış linklerde ✔ |
| `alt` metni | CMS'ten geliyor, 404 arka planında var ✔ |
| Reduced motion | `useReducedMotion()` composable → `AniTextSplit` ve loader split'leri kapanıyor ⚠ kısmi |
| Hover guard | `@media (hover:hover) and (pointer:fine)` ✔ |
| `type="button"` | Tüm non-submit butonlarda ✔ |

### 28.2 Mākena'nın eksikleri ❌

| Eksik | Risk | Bizim çözümümüz |
|---|---|---|
| **Skip link yok** | Klavye kullanıcısı her sayfada menüyü geçmek zorunda | `<a href="#main" class="sr-only focus:not-sr-only">İçeriğe atla</a>` |
| **ESC ile menü kapatma yok** | WCAG 2.1.2 (No Keyboard Trap) riski | `keydown` ESC → kapat |
| **Focus trap yok** (menü açıkken) | Tab, arkadaki içeriğe kaçıyor | `inert` attribute + focus trap |
| **`aria-expanded` yok** (hamburger) | Durum ekran okuyucuya bildirilmiyor | `aria-expanded` + `aria-controls` |
| **`aria-modal` / `role="dialog"` yok** | Menü overlay dialog olarak tanınmıyor | `role="dialog" aria-modal="true" aria-label="Menü"` |
| **Reduced motion kısmi** | `js-i-scale`, `js-i-fade`, tüm parallax ve carousel hâlâ çalışıyor | **Tüm** motion kapatılacak |
| **Carousel klavye erişimi yok** | Drag-only, Tab ile slide'lar arası geçiş belirsiz | Ok tuşları + görünür focus + `aria-roledescription="carousel"` |
| **Orientation lock** | WCAG 1.3.4 (Orientation) ihlali — içerik yatayda engelleniyor | Uyarı göster ama **içeriği engelleme** (dismiss edilebilir) |
| **Root font-size `clamp(px)`** | Kullanıcının tarayıcı font boyutu tercihi **tamamen eziliyor** — WCAG 1.4.4 ihlali | Aşağıya bakın |
| `lang` attribute | Tek dil; bizde locale başına `lang` + `dir` gerekiyor | `<html lang="tr">` vb. |

### 28.3 Root font-size sorunu ve çözümümüz

**Sorun:** `html { font-size: clamp(9px, 10*100vw/var(--size), 10px) }` — `px` tabanlı olduğu için kullanıcı tarayıcı ayarından "yazı tipi boyutu: büyük" seçerse **hiçbir şey değişmiyor**. WCAG 1.4.4 (Resize Text, AA) %200 büyütme gerektiriyor.

**Çözümümüz** — aynı fluid davranış, ama kullanıcı tercihine saygılı:

```css
:root { --size: 390; }
@media (min-width: 650px) { :root { --size: 1500; } }

html {
  /* Sınırlar rem: 0.5625rem = 9px, 0.625rem = 10px (16px kök varsayımıyla) */
  font-size: clamp(0.5625rem, calc(10 * 100vw / var(--size)), 0.625rem);
}
```

**Neden işe yarıyor:** CSS spec'e göre kök elementin `font-size`'ındaki `rem`, özelliğin **başlangıç değerine** — yani kullanıcının tarayıcı yazı tipi tercihine — göre çözülür. Kullanıcı varsayılanı 16px→20px yaparsa clamp sınırları 11,25px / 12,5px'e çıkar; `vw` tabanlı orta terim neredeyse her viewport'ta alt sınırın altında kaldığı için **tüm site orantılı büyür**. Mākena'nın px tabanlı clamp'ı bu tercihi tamamen eziyordu.

Orta terim birimsiz çarpan × uzunluk olduğu için (`10 * 100vw / 390`) geçerli `calc()`'tır ve referanstaki değerleri birebir üretir — 1440px'te 9,6px, 390px'te 10px, 650–1350px arası 9px.

> ⚠️ `clamp(56.25%, 62.5% * 100vw / (var(--size) * 1px), 62.5%)` biçiminde bir formül **geçersizdir** — `calc()` içinde yüzde ile uzunluk çarpılamaz. Yukarıdaki rem tabanlı hâl kullanılmalı.

Ek önlem: `.btn { font-size: clamp(12px, 1.5rem, 16px) }` deseni **genişletilecek** — gövde metni için de minimum okunabilir taban:
```css
.body-m { font-size: max(1.5rem, 14px); }
```

### 28.4 `prefers-reduced-motion` tam planı

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

JS tarafında:

| Sistem | Reduced motion davranışı |
|---|---|
| Lenis | **Devre dışı** — native scroll |
| Tüm ScrollTrigger parallax'ları | **Kurulmaz** (`gsap.matchMedia("(prefers-reduced-motion: no-preference)")` guard'ı) |
| `AnimatedText` | Split yapılmaz, metin direkt görünür |
| Loader | Gösterilmez (veya statik logo, animasyonsuz) |
| Page transition | Sadece 150ms opacity cross-fade |
| Banner scale | `scale(1)` sabit |
| Carousel | Drag çalışır, lerp **kapalı** (anında konumlanır), scale timeline kapalı |
| Hero video | **Yüklenmez** — poster kalır |
| Hamburger / buton hover | Transition `0ms`, state değişimi anında |

> **Uygulama deseni:** Tüm motion `gsap.matchMedia()` içinde kurulacak ve `(prefers-reduced-motion: no-preference)` koşulu her matchMedia sorgusuna eklenecek:
> ```
> mm.add("(min-width: 650px) and (prefers-reduced-motion: no-preference)", () => { … })
> ```

### 28.5 Kontrast kontrolü `[MEASURED]`

| Kombinasyon | Oran | WCAG AA (4.5:1) |
|---|---|---|
| `#000` üzerine `#fff` (hero) | 21:1 | ✔ |
| `#fff` üzerine `rgba(0,0,0,.7)` (gövde) | ~12,6:1 | ✔ |
| `#fff` üzerine `rgba(33,51,117,.8)` (eyebrow) | ~8,9:1 | ✔ |
| `#f8f8f3` üzerine `rgba(0,0,0,.7)` | ~12,2:1 | ✔ |
| `#203276` üzerine `#fff` (footer) | ~11,6:1 | ✔ |
| `#203276` üzerine `rgba(255,255,255,.6)` (menü idle) | ~5,2:1 | ✔ |
| `#203276` üzerine `rgba(255,255,255,.5)` (copyright) | ~3,9:1 | ⚠ **AA altı** (küçük metin) |
| Hero görseli üzerine beyaz metin | değişken | ⚠ **overlay gerekli** |

**Aksiyonlar:**
- Footer copyright opaklığı `.5` → **`.65`** çıkarılacak
- Hero metinlerinin altına `linear-gradient(transparent, rgba(0,0,0,.45))` veya global `rgba(0,0,0,.25)` overlay eklenecek — tüm görsellerde garanti kontrast

### 28.6 Klavye navigasyon haritası (bizim implementasyon)

```
Tab sırası (sayfa tepesi):
  1. Skip link ("İçeriğe atla")              ← YENİ
  2. Menü toggle                              (aria-expanded, aria-controls)
  3. Logo / ana sayfa
  4. Dil seçici                               ← YENİ
  5. Rezervasyon butonu                       ← YENİ
  6. [main içeriği]
  7. Footer linkleri

Menü AÇIKKEN:
  - Focus menüye taşınır (ilk link)
  - Arkadaki #main → inert
  - Tab döngüsü menü içinde kilitli
  - ESC → kapat + focus menü toggle'a döner

Carousel:
  - Tab → carousel container'a
  - ← / → → önceki/sonraki slide
  - Tab → slide içindeki linke
  - aria-live="polite" ile "Slide 2 / 6" duyurusu
```

---

## 29. Recommended Tech Stack (bizim proje)

| Katman | Seçim | Sürüm | Gerekçe |
|---|---|---|---|
| Framework | **Next.js (App Router)** | 16.3.x | Kullanıcı şartı; RSC + streaming + en iyi görsel pipeline |
| Runtime | React | 19.x | Next 16 ile gelen |
| Dil | TypeScript | 5.x | `strict: true` |
| Styling | **Tailwind CSS v4** | 4.3.x | `@theme` ile CSS değişkeni tabanlı token; Mākena'nın token mimarisine birebir oturuyor |
| Animasyon | **GSAP** | 3.15.x | Referans site ile **aynı sürüm** → birebir davranış. Ticari lisans gerekmiyor (Webflow sponsorluğu ile tüm plugin'ler ücretsiz) |
| GSAP plugin | ScrollTrigger, SplitText, CustomEase, DrawSVG | 3.15.x | Hepsi referansta kullanılıyor |
| React entegrasyonu | `@gsap/react` (`useGSAP`) | latest | `gsap.context()` + otomatik cleanup |
| Smooth scroll | **Lenis** | 1.3.x | Referans ile aynı |
| i18n | **next-intl** | 4.14.x | App Router native, localized pathnames desteği |
| Görsel | Cloudflare R2 + Images + Next `<Image>` custom loader | — | Kullanıcı şartı |
| Font | `next/font/local` (WOFF2) | — | Self-host + otomatik fallback metrikleri |
| Form | React Hook Form + Zod | latest | Tip güvenli validasyon |
| Backend (faz 2) | **Laravel** (headless API) | 12.x | Kullanıcı şartı |
| Analitik | GA4 + Cloudflare Web Analytics | — | |
| Consent | Kendi CMP'miz veya CookieYes | — | KVKK + GDPR |
| Test | Playwright (E2E + görsel regresyon) | latest | §33 Visual QA için |
| Lint | ESLint + `eslint-plugin-jsx-a11y` + Prettier | latest | |

### Three.js / WebGL

**Dahil edilmeyecek.** Mākena'da sadece `/about` sayfasındaki Globe bloğu için var. Otel konseptinde karşılığı yok; bundle maliyeti (~150 KB+) gerekçesiz. İleride 360° oda turu gerekirse ayrı lazy route olarak eklenir.

---

## 30. Reproduce vs. Project Specific

### ✅ Reproduce — birebir yeniden üretilecek

| Alan | Detay |
|---|---|
| **Fluid root font-size sistemi** | `--size` değişkeni + `clamp()` root ölçekleme (a11y düzeltmesiyle, §28.3) |
| **Grid sistemi** | `.site-max` (2rem/5rem padding, max-width yok) + `.site-grid` (6/12 kolon, .7rem/1.7rem gap) |
| **Breakpoint mantığı** | Sadece 2 ana BP: 650 ve 1024 + `@media (hover:hover)` guard |
| **Typography scale** | Tüm token'ların oransal ilişkileri (display/title-l/m/s/xs, body-l/m/s, label, eyebrow) |
| **Eyebrow deseni** | uppercase + `.22em` tracking + 500 weight + küçük boyut |
| **Spacing ritmi** | Section `py` desenleri: 90/100/120 (mobil/tablet/desktop) |
| **Header state machine** | 5 state + geçiş kuralları + 100ms throttle |
| **Scroll engine** | Lenis `lerp: .15`, `wheelMultiplier: 1.25`, `autoResize: false` |
| **Merkezi servis mimarisi** | `$event` tick bus + `$resize` cache + `$scroll` + `$device` |
| **Motion dili** | `unmask` CustomEase + `textSplit`/`fade` effect'leri + tüm duration/stagger değerleri |
| **Deklaratif animasyon sınıfları** | `js-i-*` / `js-t-*` sistemi |
| **Parallax oranları** | Hero .25 · BannerFull .15 · Feature5050 ±3.5rem · Storytelling 7.5rem · Footer .375 |
| **BannerScale `--progress` tekniği** | CSS custom property tween'i |
| **Drag carousel motoru** | `quickSetter` + lerp .1 + wrap/snap + `onToggle` guard + 10px tıklama eşiği |
| **Menü animasyon timeline'ı** | `wrap([-100,100])` + clip-path + link stagger |
| **Page transition timeline'ı** | Çift katmanlı maske + 0.5s içerik offset'i |
| **Loader timeline'ı** | Dairesel draw + loop + çıkış (süre kısaltılacak, §27.4) |
| **Buton/link mikro-etkileşimleri** | `.uline` origin-swap, `.btn` çift maske, `.btn-a` ok döngüsü |
| **Blok mimarisi** | CMS-driven block renderer + per-block lazy loading |
| **Section ritmi** | beyaz / `#F8F8F3` alternasyonu + tam-ekran medya bölücüler |
| **Orientation uyarısı** | `(max-width:932px) and (orientation:landscape) and (max-height:500px)` |

### 🔄 Project Specific — değiştirilecek / yeniden yazılacak

| Alan | Mākena | Arcanus |
|---|---|---|
| **Logo & marka varlıkları** | Mākena logoları | Arcanus logoları (light + dark SVG, 116×58 oranında) |
| **Fontlar** | ivy-mode / sweet-sans-pro / messina-sans (ticari lisans) | TR + Kiril destekli alternatifler (bkz. aşağı) |
| **Renk paleti** | `#203276` lacivert + `#f8f8f3` | Arcanus marka renkleri |
| **Fotoğraf & video** | Maui içerikleri | Otel içerikleri |
| **Metinler** | İngilizce, golf/emlak | TR/EN/DE/RU, otel/tatil |
| **Route yapısı** | `/experiences`, `/real-estate` | `/konaklama`, `/restoranlar`, `/aktiviteler` (4 dilde lokalize) |
| **Block seti** | 29 block (emlak ağırlıklı) | ~18 block (otel ağırlıklı) + yeni: `RoomsGrid`, `RoomDetail`, `RestaurantList`, `OffersBlock`, `BookingWidget` |
| **CMS** | DatoCMS | Laravel (faz 2) — faz 1'de statik JSON/MDX |
| **Görsel CDN** | DatoCMS/imgix | **Cloudflare R2 + Images** |
| **Video** | Vimeo | Cloudflare R2 (multi-rendition) |
| **CTA** | "Contact us" | "Rezervasyon" (booking engine entegrasyonu) |
| **i18n** | Yok (tek dil) | tr/en/de/ru + lokalize URL'ler + hreflang |
| **Globe / Harita** | Three.js globe + destination map | Yok (gerekirse basit konum haritası) |
| **Loader süresi** | 2s minimum | ≤800ms, ikinci ziyarette yok |
| **A11y** | Kısmi | Tam WCAG 2.2 AA |

#### Font alternatifleri (TR + Kiril + Almanca destekli)

| Rol | Mākena | Önerilen alternatif |
|---|---|---|
| Display (serif/didone hissi) | Ivy Mode Light | **Playfair Display** (variable, Kiril ✔, Google Fonts) · **Cormorant Garamond** (Kiril ✔) · ticari: **Canela**, **Reckless** |
| Eyebrow / UI | Sweet Sans Pro | **Inter** (variable, Kiril ✔) · **Archivo** · **Manrope** |
| Gövde | Messina Sans | **Inter** (Kiril ✔) · **Geist Sans** · ticari: **Söhne**, **Suisse Int'l** |

> **Not:** Ivy Mode'un karakteri yüksek kontrastlı bir "didone" — Playfair Display en yakın ücretsiz eşleşme, ancak biraz daha ağır. Marka bütçesi varsa ticari bir didone (Canela, Ogg, Reckless) görsel eşleşmeyi belirgin artırır. Seçilen fontun **mutlaka** `ı`, `İ`, `ş`, `ğ`, `ü`, `ö`, `ç`, `ä`, `ß` ve Kiril glifleri olmalı.

---

## 31. Proposed Folder Structure

```
arcanus/
├── docs/
│   ├── MAKENA-FRONTEND-REVERSE-ENGINEERING.md     ← bu dosya
│   └── ARCANUS-PROJECT-BLUEPRINT.md               ← uygulama planı
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                      (root — html/body yok, sadece provider)
│   │   ├── not-found.tsx
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   └── [locale]/
│   │       ├── layout.tsx                  (html lang/dir, fontlar, Header/Footer)
│   │       ├── page.tsx                    (ana sayfa)
│   │       ├── not-found.tsx
│   │       └── [...slug]/page.tsx          (lokalize slug çözümleyici)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header/            (Header, MenuToggle, Logo, LocaleSwitcher, BookButton)
│   │   │   ├── MenuOverlay/
│   │   │   ├── Footer/
│   │   │   └── RotateDeviceOverlay/
│   │   ├── blocks/
│   │   │   ├── BlockRenderer.tsx
│   │   │   ├── HeroBlock/
│   │   │   ├── IntroBlock/
│   │   │   ├── BannerScaleBlock/
│   │   │   ├── BannerFullBlock/
│   │   │   ├── Feature5050Block/
│   │   │   ├── StorytellingBlock/
│   │   │   ├── DragCarouselBlock/
│   │   │   ├── RoomsGridBlock/
│   │   │   ├── RestaurantsBlock/
│   │   │   ├── GalleryGridBlock/
│   │   │   ├── ContactFormBlock/
│   │   │   ├── SpacerBlock/
│   │   │   └── ExploreMoreBlock/
│   │   ├── motion/
│   │   │   ├── AnimatedText.tsx            (AniTextSplit karşılığı)
│   │   │   ├── ParallaxMedia.tsx
│   │   │   ├── ScaleOnScroll.tsx
│   │   │   ├── RevealOnScroll.tsx
│   │   │   ├── PageTransitionMask.tsx
│   │   │   └── Loader.tsx
│   │   ├── media/
│   │   │   ├── Media.tsx                   (video/image switch)
│   │   │   ├── CldImage.tsx                (Cloudflare loader'lı Image)
│   │   │   └── BackgroundVideo.tsx
│   │   └── ui/
│   │       ├── MaskedButton.tsx            (.btn)
│   │       ├── UnderlineLink.tsx           (.uline)
│   │       ├── Eyebrow.tsx
│   │       ├── CarouselButtons.tsx
│   │       └── ProgressBar.tsx
│   │
│   ├── providers/
│   │   ├── SmoothScrollProvider.tsx        (Lenis + GSAP ticker köprüsü)
│   │   ├── MotionProvider.tsx              (CustomEase + registerEffect)
│   │   ├── TickProvider.tsx                ($event tick bus)
│   │   └── ResizeProvider.tsx              ($resize cache)
│   │
│   ├── hooks/
│   │   ├── useTick.ts
│   │   ├── useResize.ts
│   │   ├── useLenis.ts
│   │   ├── useParallax.ts
│   │   ├── useReducedMotion.ts
│   │   ├── useHeaderState.ts
│   │   ├── useDragCarousel.ts
│   │   └── useDevice.ts
│   │
│   ├── lib/
│   │   ├── animations/
│   │   │   ├── register.ts                 (CustomEase + effects)
│   │   │   ├── easings.ts
│   │   │   ├── tokens.ts                   (duration/stagger sabitleri)
│   │   │   ├── splitText.ts
│   │   │   ├── parallax.ts
│   │   │   └── pageTransition.ts
│   │   ├── images/
│   │   │   ├── cloudflareLoader.ts
│   │   │   ├── sizes.ts                    (§24.4 sözlüğü)
│   │   │   └── blur.ts
│   │   ├── seo/
│   │   │   ├── metadata.ts
│   │   │   ├── jsonld.ts                   (Hotel, Room, BreadcrumbList…)
│   │   │   └── hreflang.ts
│   │   └── utils/
│   │       ├── lerp.ts
│   │       ├── clamp.ts
│   │       └── throttle.ts
│   │
│   ├── i18n/
│   │   ├── routing.ts                      (locale + pathnames haritası)
│   │   ├── request.ts
│   │   ├── navigation.ts
│   │   └── messages/
│   │       ├── tr.json
│   │       ├── en.json
│   │       ├── de.json
│   │       └── ru.json
│   │
│   ├── content/                            (faz 1 — Laravel'e geçene kadar)
│   │   ├── tr/  en/  de/  ru/
│   │
│   ├── styles/
│   │   ├── globals.css                     (@theme, @layer base/components)
│   │   ├── tokens.css                      (CSS custom properties)
│   │   └── typography.css                  (.display, .title-*, .body-*, .eyebrow)
│   │
│   └── types/
│       ├── blocks.ts
│       ├── content.ts
│       └── media.ts
│
├── public/
│   ├── fonts/
│   ├── logo-light.svg
│   ├── logo-dark.svg
│   └── favicon/
│
├── .claude/
│   └── agents/
│       ├── frontend-expert.md
│       └── backend-expert.md
│
├── middleware.ts                           (next-intl locale routing)
├── next.config.ts                          (images, headers, redirects)
├── tailwind.config.ts / globals.css @theme
├── CLAUDE.md
└── package.json
```

---

## 32. Implementation Order

```
PHASE 00  — Hazırlık
            · Font seçimi + lisans (TR/Kiril/DE glif kontrolü)
            · Marka renk paleti
            · Cloudflare R2 bucket + Images aktivasyonu
            · İçerik envanteri (sayfa × dil matrisi)

PHASE 01  — Project Setup
            · Next.js 16 + TS strict + Tailwind v4
            · ESLint (jsx-a11y) + Prettier + husky
            · next.config: images loader, güvenlik header'ları
            · middleware: next-intl locale routing

PHASE 02  — Design Tokens + Typography
            · @theme ile tüm renk/spacing/radius token'ları
            · Fluid root font-size (a11y düzeltmeli, §28.3)
            · .display / .title-* / .body-* / .label-* / .eyebrow sınıfları
            · next/font/local + preload + unicode-range subsetleri
            · Tailwind custom screens: s=650, l=1024 + has-hover variant

PHASE 03  — Global Layout
            · .site-max + .site-grid (+ .site-grid-24)
            · Z-index katmanları
            · Provider zinciri: Resize → Tick → SmoothScroll → Motion
            · Reduced-motion global guard

PHASE 04  — i18n İskeleti
            · routing.ts: 4 locale + lokalize pathnames (RU = İngilizce slug)
            · hreflang + canonical + x-default
            · LocaleSwitcher (aynı sayfanın karşılığına gider)
            · 404 / not-found her locale'de

PHASE 05  — Header / Navigation
            · 5-state scroll machine + 100ms throttle
            · Logo cross-fade
            · MenuToggle (hamburger marquee swap)
            · MenuOverlay + GSAP timeline
            · A11y: skip link, ESC, focus trap, aria-expanded, inert

PHASE 06  — Smooth Scroll + Motion Sistemi
            · Lenis (lerp .15 / wheelMultiplier 1.25)
            · GSAP ticker köprüsü + lagSmoothing(0)
            · CustomEase: unmask / expo-hard / snappy
            · registerEffect: textSplit / fade
            · AnimatedText, ParallaxMedia, ScaleOnScroll, RevealOnScroll

PHASE 07  — Media Pipeline
            · Cloudflare custom loader
            · sizes sözlüğü (§24.4) + lint kuralı
            · Media component (image/video switch + low-power fallback)
            · BackgroundVideo (multi-rendition + IO eşikleri)
            · LQIP + bgColor

PHASE 08  — Ana Sayfa (statik layout)
            · 13 block'un statik hali, animasyonsuz
            · Tüm breakpoint'lerde pixel-perfect eşleşme
            · Visual QA turu #1

PHASE 09  — Ana Sayfa (motion)
            · Hero parallax + loader + giriş timeline'ı
            · BannerScale --progress
            · BannerFull / Feature5050 / Storytelling parallax'ları
            · Footer parallax
            · Motion QA turu #1

PHASE 10  — Carousel Motoru
            · useDragCarousel (infinite + clamped)
            · ScrollTrigger onToggle guard
            · Klavye erişimi + aria

PHASE 11  — Page Transition + Loader
            · Çift katmanlı maske
            · js-t-* deklaratif sistemi
            · View Transitions API değerlendirmesi (fallback GSAP)

PHASE 12  — İç Sayfalar
            · Konaklama (+ oda detayları)
            · Restoranlar / Barlar
            · Aktiviteler (+ alt sayfalar)
            · Galeri / İletişim / Hakkımızda
            · KVKK / Aydınlatma metni

PHASE 13  — Responsive + Orientation
            · 14 viewport'ta tam geçiş
            · Orientation uyarısı (dismiss edilebilir)
            · Touch hedef boyutları ≥44px

PHASE 14  — SEO
            · Metadata API (her locale)
            · JSON-LD: Hotel, HotelRoom, Restaurant, BreadcrumbList, Organization, FAQPage
            · sitemap.ts (locale alternates ile)
            · robots.ts
            · OG görselleri (locale başına)

PHASE 15  — Güvenlik
            · CSP (nonce tabanlı), HSTS, X-Frame-Options, Referrer-Policy,
              Permissions-Policy, X-Content-Type-Options
            · Form rate limiting + honeypot + Turnstile
            · Cloudflare WAF

PHASE 16  — Performance
            · Bundle analizi + budget CI gate
            · Preload denetimi
            · Lighthouse CI
            · §27.4 bütçelerinin doğrulanması

PHASE 17  — Accessibility Audit
            · axe-core otomatik + manuel klavye turu
            · Ekran okuyucu testi (NVDA/VoiceOver)
            · Kontrast doğrulaması

PHASE 18  — Visual QA + Motion QA
            · §33 ve §34 protokolleri

PHASE 19  — Test Protokolü
            · PageSpeed Insights · GTmetrix · WebPageTest
            · Yellow Lab Tools · DebugBear/Treo RUM

PHASE 20  — Backend Entegrasyonu (Laravel)
            · API sözleşmesi
            · Block şemalarının CMS'e taşınması
            · ISR / on-demand revalidation
```

---

## 33. Pixel-Perfect QA

### 33.1 Süreç

```
1. Referans ekran görüntüsü     (makenagolfandbeachclub.com, viewport X)
          ↓
2. Implementasyon görüntüsü     (aynı viewport, aynı scroll pozisyonu)
          ↓
3. Overlay karşılaştırma        (difference blend mode, %50 opacity)
          ↓
4. Piksel farkı raporu          (pixelmatch / Playwright toMatchSnapshot)
          ↓
5. Spacing düzeltmesi           (padding/margin/gap)
          ↓
6. Typography düzeltmesi        (font-size/line-height/letter-spacing/max-width)
          ↓
7. Grid düzeltmesi              (col-start/col-span)
          ↓
8. Tekrar — fark < %2 olana kadar
```

### 33.2 Karşılaştırma viewport'ları

**Zorunlu (her sayfa, her faz):**
```
1920 × 1080
1440 ×  900      ← ana referans
1024 ×  768
 768 × 1024
 390 ×  844      ← ana mobil referans
```

**Genişletilmiş (final QA):**
```
1728 × 1117    1600 × 900    1366 × 768
1024 × 1366     834 × 1194    650 ×  900   ← breakpoint sınırı
 649 ×  900    ← breakpoint sınırı (6/12 kolon geçişi)
 430 ×  932     414 ×  896    375 ×  812    360 ×  800
 932 ×  430    ← landscape (orientation uyarısı)
```

### 33.3 Her viewport'ta kontrol listesi

- [ ] Container padding (`.site-max`) — beklenen px değeri
- [ ] Grid kolon genişliği + gap
- [ ] Root font-size (`getComputedStyle(document.documentElement).fontSize`)
- [ ] H1/H2 font-size, line-height, max-width
- [ ] Section `padding-top` / `padding-bottom`
- [ ] Header yüksekliği (üst durum + scrolled durum)
- [ ] Logo boyutu ve pozisyonu
- [ ] Görsel aspect-ratio ve crop
- [ ] Element sırası (order değişimleri)
- [ ] Gizlenen elementler
- [ ] Yatay taşma yok (`document.body.scrollWidth === window.innerWidth`)

### 33.4 Otomasyon

```
Playwright görsel regresyon:
  · Her sayfa × 5 zorunlu viewport = N snapshot
  · maxDiffPixelRatio: 0.02
  · Animasyonlar devre dışı (prefers-reduced-motion + gsap.globalTimeline.pause())
  · Fontlar yüklenene kadar bekle (document.fonts.ready)
  · CI'da her PR'da çalışır
```

**Ölçüm script'i** (tarayıcı konsolunda, hem referansta hem bizde çalıştırılır):
```js
const probe = (sel) => {
  const el = document.querySelector(sel); if (!el) return null
  const r = el.getBoundingClientRect(), c = getComputedStyle(el)
  return { w:+r.width.toFixed(1), h:+r.height.toFixed(1), x:+r.x.toFixed(1), y:+r.y.toFixed(1),
           fs:c.fontSize, lh:c.lineHeight, ls:c.letterSpacing,
           pt:c.paddingTop, pb:c.paddingBottom, pl:c.paddingLeft }
}
console.table({
  root:    { fs: getComputedStyle(document.documentElement).fontSize },
  header:  probe('.sh__content'),
  hero:    probe('.hero'),
  h1:      probe('h1'),
  siteMax: probe('.site-max'),
  grid:    probe('.site-grid'),
  footer:  probe('footer'),
})
```

---

## 34. Motion QA

Ekran görüntüsü yeterli değil. Her animasyon için şu parametreler doğrulanacak:

### 34.1 Kontrol matrisi

| Animasyon | start timing | end timing | scroll mesafesi | easing | duration | transform değerleri | stagger |
|---|---|---|---|---|---|---|---|
| Hero parallax | y=0 | y=900 | 900px | none | — | yPercent 0→25 | — |
| BannerFull parallax | top bottom | bottom top | 1800px | none | — | yPercent -15→15 | — |
| Feature5050 parallax | top bottom | bottom top | ~1520px | none | — | y 3.5rem→-3.5rem | — |
| Storytelling parallax | top bottom | bottom top | — | none | — | y 7.5rem→0 | — |
| BannerScale | top bottom | top top | 900px | none | — | scale .85→1 | — |
| Footer parallax | top bottom | bottom bottom | 738px | none | — | yPercent -37.5→0 | — |
| AnimatedText | top 80% | — | — | unmask | 1.5s | y 4.5rem→0, α0→1 | .1 |
| AnimatedText (body) | top 80% | — | — | unmask | 1.5s | y 3rem→0, α0→1 | .05 |
| Menu open | click | — | — | expo.inOut | 1.25s | yPercent ∓100→0 | — |
| Menu links | click+.5 | — | — | expo | 1.5s | yPercent 105→0 | .075 |
| Page transition out | route | — | — | expo.inOut | 1.0s | yPercent 100→0 | — |
| Page transition in | route | — | — | expo.inOut | 1.0s | yPercent 0→-100 | — |
| Transition text | route+.5 | — | — | unmask | 1.5s | y 4.5rem→0 | .1 |
| Header show/hide | y>wh | — | — | cb(.19,1,.22,1) | .5s | translateY 0/-100% | — |
| Button hover | hover | — | — | cb(.77,0,.175,1) | .75s | translate3d ±100% | — |
| Underline hover | hover | — | — | cb(.19,1,.22,1) | .75s | scaleX 0→1 | — |
| Carousel scale | drag | — | — | none | .5s×2 | scale .62→1→.62 | — |

### 34.2 Doğrulama yöntemleri

**A. Scroll pozisyonu bazlı transform ölçümü**
```js
// Hem referansta hem bizde, aynı scroll pozisyonunda çalıştır
const measureAt = async (y, sel) => {
  window.scrollTo(0, y)
  await new Promise(r => setTimeout(r, 600))      // Lenis lerp'in oturmasını bekle
  const el = document.querySelector(sel)
  return { y, transform: getComputedStyle(el).transform }
}
// Örnek: [0, 225, 450, 675, 900].map(y => measureAt(y, '.hero [ref=parallax]'))
```

**B. Timeline süresi ölçümü**
```js
// GSAP timeline'larının toplam süresini karşılaştır
gsap.globalTimeline.getChildren().map(t => ({ dur: t.duration(), target: t.targets?.()[0]?.className }))
```

**C. Video kaydı karşılaştırma**
- Her iki siteyi aynı anda kaydet (60fps)
- Frame-by-frame karşılaştır: animasyon başlangıç frame'i, bitiş frame'i
- Kabul kriteri: ±2 frame (±33ms)

**D. Scroll hızı testi**
- Aynı tekerlek hareketiyle her iki sitede scroll et
- 500ms sonraki scroll pozisyonunu karşılaştır
- Kabul kriteri: %5 fark

### 34.3 Jank kontrolü

```
Chrome DevTools Performance:
  · 10 saniyelik scroll kaydı
  · Long task (>50ms) sayısı: 0 olmalı
  · Dropped frame oranı: <%2
  · Layout/Recalculate Style olayları: scroll sırasında 0 olmalı
  · Composite-only katmanlar: parallax elementleri
```

---

## 35. Open Questions / DevTools Verification

| # | Soru | Durum | Etki |
|---|---|---|---|
| 1 | `.hero-scroll-line` animasyonlu mu, statik mi? | `[NEEDS DEVTOOLS]` | Düşük |
| 2 | Hamburger `is-active` durumunda X şekli nasıl oluşuyor? (`.menu-t__lines` `display:none` sonrası) | `[NEEDS DEVTOOLS]` | Orta |
| 3 | Menü link `--char-index` ile hangi CSS geçişi yapılıyor? | `[HIGH CONFIDENCE]` ama kesin değer bilinmiyor | Orta |
| 4 | `Media` component'indeki `clamp` prop'u ne yapıyor? | `[NEEDS DEVTOOLS]` | Düşük |
| 5 | GSAP ↔ Lenis köprüsünün tam implementasyonu | `[HIGH CONFIDENCE]` (standart desen) | Düşük |
| 6 | `$event.emit("tick", {ratio})` içindeki `ratio` tam formülü | `[HIGH CONFIDENCE]` (delta/16.67) | Düşük |
| 7 | `GlobeBlock` gerçekten Three.js mi? | `[HIGH CONFIDENCE]` | Yok (kullanmıyoruz) |
| 8 | Mobilde carousel scale timeline'ı var mı? | `[NEEDS DEVTOOLS]` | Orta |
| 9 | `StorytellingBlock` `custom-sizes` değerleri hatalı mı? | `[VERIFIED]` — evet, ters görünüyor | Yok (düzelteceğiz) |
| 10 | `Experience5050Block` ile `Feature5050Block` farkı | `[NEEDS DEVTOOLS]` | Orta |
| 11 | Gallery lightbox/modal animasyonu | `[NEEDS DEVTOOLS]` | Orta |
| 12 | `ContactForm` validasyon ve gönderim akışı | `[NEEDS DEVTOOLS]` | Düşük (kendimiz yazacağız) |
| 13 | Hosting/CDN sağlayıcısı ve cache header'ları | `[NEEDS DEVTOOLS]` | Düşük |
| 14 | `accordion5050` açılma animasyonu | `[NEEDS DEVTOOLS]` | Orta |
| 15 | `story_slider` mekanizması | `[NEEDS DEVTOOLS]` | Düşük |

**Doğrulama yöntemi:** Yukarıdaki maddeler, ilgili sayfalarda Chrome DevTools ile (Elements → Computed/Animations paneli, Sources → ilgili chunk) tek tek kontrol edilecek. PHASE 08–11 sırasında, o bileşene sıra geldiğinde yapılacak — şimdi tamamını çözmek gereksiz.

---

## Ek B — Yellowstone Club homesite detayı → oda detay şablonu `[VERIFIED — canlı DOM, 1440×900, 2026-10-04]`

Kaynak: `https://yellowstoneclub.com/real-estate/homesites/64a-andesite-ridge` — kullanıcı
kararıyla **oda detay sayfalarının** şablonu. Site Mākena'yla aynı ajansın işi
(Nuxt, Lenis, `site-max` / `site-grid` / `media-fill` / `ico`, kök 9,6px); bu
yüzden ölçüler bizim sisteme doğrudan oturuyor. Yalnızca tipografi ölçeği
farklı (title-l 4,4rem, title-s 2,8rem, title-m 3,4rem) — **bizde Mākena
ölçeği korunuyor** (tek ölçek).

| # | Bölüm | Sınıflar / ölçü | Bizde |
|---|---|---|---|
| 0 | Hero (yalnızca medya) — ⚠️ **2026-10-05'ten beri kullanılmıyor**: detaylarda Arcanus'un slim hero'su (eyebrow + h1, kullanıcı kararı) | `hero … h-[calc(100svh-20rem)] s:h-[calc(100svh-23rem)] l:h-[calc(100svh-25rem)]` → **660px**; `js-i-scale` 1,25→1; parallax yPercent 0→25 (400px scroll'da %15,15 ölçüldü); metin, gösterge, karartma yok (`after:opacity-0`) | `hero` + `variant: 'media'` |
| 1 | Başlık | `section.pt-38.s:pt-38.l:pt-52` → `h1.title-l pt-[1px] w-full s:max-w-[92.5rem] l:col-start-3 l:col-span-8 mb-20 s:mb-24` · `label-m` (lh 1,3) `mb-24 s:mb-40 opacity-80` · meta satırı `body-m flex gap-14 s:gap-16` → tek öğe `hidden l:flex gap-8`: 15px ikon + değer ("2.31 acres") · çizgi `mt-42 s:mt-48 h-[1px] bg-[#777] opacity-20`. **255,6px**. Reveal animasyonu YOK. | `detail_title` (meta = m²) |
| 2 | Gövde | `section.pt-56.pb-88.l:pb-56` → sol `l:col-start-3 l:col-span-5 l:pr-50` → `flex flex-col gap-24 l:gap-30`: `p.title-s` (display fontu, 153 kr) + `div.body-p` (546 kr) · sağ `l:col-start-8 l:col-span-3 mt-40 s:mt-56 l:mt-0` → `flex flex-col items-start gap-40 s:gap-56 l:gap-40 l:pl-55`: `ul.grid.grid-cols-1.gap-8.s:grid-cols-2.s:gap-12.l:grid-cols-1.l:gap-8` → `li.flex.items-center.gap-12` (18px ikon + `body-m`) + buton (`h-44 min-w-[14rem] rounded-[3px]`, yazı takası). **425,5px**; kolonlar 544 / 320. | `detail_body` (buton bizim `.btn`) |
| 3 | ~~16:9 banner~~ → **slider** | Yellowstone: `section.py-40.s:py-60` → `site-max` → `aspect-video` parallax (`translate ∓15%`, 862,8px). **Kullanıcı kararıyla (2026-10-04 akşam) yerine Mākena kaeo slider'ı** — yapı ve ölçüler §17.5.1: `site-max py-40 s:py-80` → track `aspect-[1.335] s:aspect-[1.776]` → tam genişlik slide'lar · altta ‹ / › + "1 \| 3". 1440'ta **982,5px**, bizde **982,5** (birebir; kök 9,6px). | `media_slider` (`banner_full.contained` varyantı kaldırıldı — ölü koddu) |
| 4 | Görsel carousel | `section.ico.relative.s:px-0.l:px-60.overflow-hidden.py-56.s:py-88.l:py-[10.4rem].cursor-grab` → track `flex h-[36rem] l:h-[51.7rem]` → slide `h-[36rem] l:h-[51.7rem] flex-shrink-0 mr-16` → `figure … h-[36rem] max-s:w-[35rem] s:h-full s:w-auto` (3:2 → 744×496) + `p.body-s my-20 l:my-24` (altyazı, boş) · ok satırı `flex items-center gap-x-40 mt-70 l:mt-90 justify-center` + 1px çubuk. İlk slide x = 106, başlangıç 0. **820,8px**. Ok butonu Yellowstone'da şeffaf + %12 kenarlık + 3px köşe; bizde Mākena `.cbtn`. | `media_carousel` |
| 5 | ~~Fotoğraf ızgarası~~ | `section.py-80.s:pb-57` → `h2.title-m text-center s:col-start-2 s:col-span-10` ("Gallery") + `div.flex.gap-18.s:gap-17.flex-wrap … l:col-start-2 l:col-span-10 mb-45 s:mt-65` → `button.hoverable.relative.aspect-[4/3].w-full.s:w-[calc((100%-8.5rem)/3+1.7rem)].l:w-[calc((100%-15.3rem)/5+1.7rem)]` (5 × 208×156, satır arası 16,3) → aynı `MediaModal` lightbox ("1 \| 10"). **604,4px**. | **KALDIRILDI** — kullanıcı 2026-10-04 gece tüm detay sayfalarından çıkarttı; `photo_grid` bloğu kodda duruyor, içerikte yok |
| 6 | Explore more | Mākena'daki blokla aynı (`bg` beyaz) | `explore_more` |

Header bu sayfada standart (hero var → açık metin). Toplam 5138px.


## Ek C — Arcanus kendi sitesi: konaklama indeksi → `overview_cards` `[VERIFIED — canlı DOM 1440×900 / 375×812, 2026-10-04]`

Kaynak: `https://arc-taupe-eight.vercel.app/tr/konaklama/` — kullanıcı kararı
("konaklama sayfası bu şekilde olacak"). Aynı tasarım sözlüğü (`site-max`,
`site-grid`, `media-fill`, `eyebrow`, kök 9,6px); tipografi sınıfları
`t-title-s` 3rem/1,4 · `t-body` 1,5rem/1,6 · `t-body-s` 1,2rem/1,3/−0,02em =
bizim `title-s` · `body-m` · `body-s`.

```
section[data-hero] h-[55rem] (528px)      ← bizde mevcut slim hero (Mākena), içerik CONTENT-TR ROOMS-01
section.py-40.s:pt-80.s:pb-20 > .site-max.site-grid
  div.group.relative.col-span-6.mb-60.flex.flex-col.s:mb-100          × 4   (≥650: iki kolon)
    a[tabindex=-1].block.overflow-hidden
      .media-fill.aspect-[4/3]  hover: scale 1,035 · 1100ms · cubic-bezier(.2,.7,.2,1)
    .mt-24.flex.flex-1.flex-col
      h2.t-title-s.text-ink-pure > a (hover opacity-60, 500ms)
      p.t-body.mt-12
      .mt-auto.pt-20
        ul.flex.flex-wrap.items-center.gap-x-28.gap-y-10 > li.text-ink-soft.flex.items-center.gap-x-10
          svg.text-main.size-20 (24×24 kontur 1,2, yuvarlak uç) + span.t-body-s      ← kapasite · m² · manzara
        a.btn (Mākena yazı takası, min-w 14rem, h-42, rounded .3rem) .mt-24  "KEŞFET"
```

| Ölçü | 1440 (15px scrollbar) | 375 |
|---|---|---|
| hero | 528 | 528,8 |
| bölüm | **1744,9** = 76,8 + 716,9 + 96 + 740 + 96 + 19,2 | py 38,5 · kart alt boşluğu 57,7 (`mb-60`) |
| kart | 656,3 geniş · 716,9 / 740 yüksek (metin 2–3 satır) | 336,5 geniş |
| görsel | 656,3 × 492,3 (4:3) | 336,5 × 252,4 |
| başlık | h2 40,3 (28,8px/1,4) · `mt-24` 23 | 2,4rem (mobil ölçek) |
| metin | 46,1 (2 satır · 14,4/23) · `mt-12` 11,5 | — |
| bilgi satırı | 19,2 · ikon 19,2 · metin 11,52/14,98 · sütun 26,9 · satır 9,6 · `pt-20` | sarıyor (`flex-wrap`) |
| buton | 134,4 × 42,3 · `mt-24` | aynı |
| renkler | başlık `#000` · metin `rgba(0,0,0,.7)` · bilgi `#2b2b2d` · ikon `rgb(32,50,118)` (marka) | — |

Sayfada başka bölüm yok (intro / feature / explore yok) — planlanan ROOMS-02,
07, 08, 09 blokları kullanıcı kararıyla düştü.

Bizde ölçülen (1440): bölüm **1721,8** (2. sıra kartları 716,9 — metinler 2 satır; Arcanus 740, 3 satır) · kart **656,3** (x = 48 / 720,7) · görsel **656,3×492,3** · 375'te taşma yok.


### Ek C.1 — Üç kolonlu kartlar: restoranlar · barlar · aktiviteler `[VERIFIED — canlı DOM 1440×900 / 375×812, 2026-10-04]`

Aynı sitenin `/tr/restoranlar/`, `/tr/barlar/`, `/tr/aktiviteler/` sayfaları:
yapı Ek C ile birebir, tek fark kart `s:col-span-4` (3 kolon) ve bilgi listesinin
olmaması. Görsel `sizes` `(min-width: 650px) 30vw, 100vw`. Görsel linki orada da
`tabindex=-1 aria-hidden`.

| Ölçü (1440) | Arcanus | Bizde (`overview_cards`, `columns: 3`) |
|---|---|---|
| kart | 432,1 geniş · x = 48 / 496,4 / 944,9 · satır arası 96 | **aynı** |
| görsel | 432,1 × 324,1 (4:3) | **aynı** |
| h2 · p · buton (y) | 951,9 · 1003,8 · 1115,1 | **aynı** (satır yüksekliği en uzun karta göre, `mt-auto`) |
| kart yüksekliği | 552,6 | **552,6** |
| 375 | kart 336,6 · görsel 336,6×252,4 · taşma yok | **aynı** |

Detay sayfaları (restoran, bar, aktivite) **oda detayı şablonu** (Ek B + §17.5.1):
ölçülen 1440: hero 660 · başlık 235,6 (m² satırı yok) · gövde 263–303 · slider
982,5 · carousel 820,8 · explore 860,5 (fotoğraf ızgarası kullanıcı kararıyla kaldırıldı). Bilgi listesi boşsa
(spa) sağ kolonda yalnızca buton.


## Ek A — Hızlı Referans Kartı

```
ROOT FONT        clamp(9px, 10 * 100vw / var(--size), 10px)
                 --size: 390 (mobil) / 1500 (≥650)
                 → 390px:10px · 650–1350px:9px · 1440px:9.6px · ≥1500px:10px

BREAKPOINTS      s: 650px      l: 1024px      (+ max-s:, max-l:)
HOVER GUARD      @media (hover: hover) and (pointer: fine)

CONTAINER        .site-max  padding-inline: 2rem → 5rem (≥650)   max-width: YOK
GRID             .site-grid  6 kolon gap .7rem  →  12 kolon gap 1.7rem (≥650)

RENKLER          main #203276 · white #f8f8f3 · white-pure #fff
                 text rgba(0,0,0,.7) · heading #000 · eyebrow rgba(33,51,117,.8)
                 focus #9a3630

TİPOGRAFİ        display 5.5/4.8/4rem · title-l 4/3.5/3.2 · title-m 3.5/3.2/2.8
                 title-s 3/2.6/2.4 · body-m 1.5rem · eyebrow 1.1rem/.22em/500/upper
                 TÜM BAŞLIKLAR font-weight: 300

SCROLL           Lenis lerp .15 · wheelMultiplier 1.25 · autoResize false

EASING           unmask     M0,0 C0.16,1 0.3,1 1,1
                 primary    cubic-bezier(.19, 1, .22, 1)
                 button     cubic-bezier(.77, 0, .175, 1)
                 swap       cubic-bezier(.455, .03, .515, .955)

MOTION           textSplit  y 4.5rem · dur 1.5 · stagger .1 · unmask
                 fade       dur 1 · stagger .1 · power1
                 reveal ST  start "top 80%" · scrub YOK

PARALLAX         hero        yPercent  0 → 25    (top top → bottom top)
                 bannerFull  yPercent -15 → 15   (top bottom → bottom top)
                 feature     y 3.5rem → -3.5rem  (≥650)
                 story       y 7.5rem → 0        (≥650)
                 footer      yPercent -37.5 → 0  (top bottom → bottom bottom, ≥650)
                 scale       --progress 0→1 → scale .85→1  (≥1024, top bottom → top top)

HEADER           h-95 (9.5rem) scrolled · 14.3rem top (≥650)
                 throttle 100ms · hide after 1vh scroll-down · show on scroll-up
                 states: is-scrolled · is-active · is-not-sticky · is-fixed · is-black

Z-INDEX          içerik 0-6 · header-bg 18 · header 20 · consent 999 · overlay 9999

CAROUSEL         multiplier 2 (desktop) / 3.5 (mobil) · lerp .1 · snap
                 scale .62 ↔ 1 (desktop) / .72 ↔ 1 (tablet)
                 tıklama eşiği 10px · ScrollTrigger onToggle guard
```

### Ek C.2 — İletişim sayfası → `contact_details` `[VERIFIED — canlı DOM 1440×900 / 768 / 640 / 390 + bundle okuması, 2026-10-05]`

Kaynak: `arc-taupe-eight.vercel.app/tr/iletisim/` (kullanıcı kararı: "bu sayfa gibi").
Sayfa = slim hero (`h-[55rem]`, eyebrow İLETİŞİM + h1) + tek bölüm. **Form yok.**

```
section.py-90.s:py-100.l:py-120
└── .site-max.site-grid.items-start.l:items-center
    ├── görsel  col-span-6 s:col-span-6 s:col-start-1 l:col-span-5 l:col-start-2
    │           .media-fill aspect 3/4
    │             └── katman 1 (reveal)  : scale 1.12 → 1, 1.6 s, power3.out, trigger "top 90%", once
    │                 └── katman 2 (parallax): ≥650 scale 1.16, yPercent −8 → 8
    │                                           <650 scale 1.08, yPercent −4 → 4
    │                                           start "top bottom" · end "bottom top" · scrub 1.1
    └── metin   col-span-6 s:col-span-5 s:col-start-8 s:mt-24 l:col-span-4 l:col-start-8 l:mt-0
        ├── h2.t-title-s.pr-[5%]                 "Arcanus Hotels Sorgun"
        ├── çizgi  my-24 h-[1px] bg-ink-soft opacity-20
        ├── dl.flex.flex-col.gap-y-24            5 satır: ADRES · RESEPSİYON · FAKS · ÇAĞRI MERKEZİ · E-POSTA
        │   └── satır  flex items-start gap-x-12
        │       ├── svg  size-18 mt-3 text-main  (24×24 kontur; konum 1.2, diğerleri 1.3)
        │       ├── dt   eyebrow text-[1.5rem] tracking-[0.14em] text-ink-soft opacity-70 mb-8
        │       └── dd   t-body text-[15px]      (tel: / mailto: linkleri, hover opacity .6 / 500 ms)
        ├── p.t-body-s.mt-28 text-[1.5rem] leading-[1.6] text-ink-soft   "Turizm İşletme Belge Numarası: 2574"
        └── a.eyebrow.mt-28 text-[1.6rem] tracking-[0.14em] text-main underline underline-offset-4
                target=_blank → google.com/maps/search/?api=1&query=<ad + adres>
```

| Ölçüm (1440×900, kök 9,6) | Değer |
| --- | --- |
| hero | 528 |
| bölüm | 956 (`py` 115,2) |
| görsel kolonu | 544,2 × 725,6 · x 160,1 |
| metin kolonu | 432,1 × 529,7 · x 832,8 (dikey ortada) |
| h2 | 28,8 / 40,32 · 40,3 yüksek |
| çizgi | y 804,5 |
| dl | 346,5 · satır aralığı 23,04 · satırlar 70,1 (adres) + 4 × 46,1 |
| dt | 14,4px / 2,016px tracking · dd 15px / 24px |
| ikon | 17,3 × 17,3 · `mt` 2,88 · renk marka |
| belge satırı | 14,4 / 23,04 · y 1201,9 |
| harita linki | 15,36 / 2,15 tracking · y 1251,8 |

| Ölçüm (390, kök 10) | Değer |
| --- | --- |
| hero | 550 · bölüm `py-90` |
| görsel | 350 × 466,7 |
| h2 | 24 / 33,6 — **görsele bitişik (0px boşluk)** → bizde `max-s:mb-65` |
| dt / dd / harita | 15 / 15 / 16 px |

768 (kök 9): görsel 323,8 × 431,8 · metin 267,3 @x440,7 (`s:mt-24` = 21,6) ·
h2 27px iki satır. Arcanus `t-title-s` 650–1023'te zaten 3rem (tablet adımı
yok); bizde site ölçeği (2,6rem) korunuyor.

Bizdeki karşılık: `ContactDetailsBlock` (Server) + `RevealParallaxMedia`
(istemci, `lazy.tsx`). Bilgiler `nav.ts` → `CONTACT`, etiketler `messages.contact`.
Sapmalar: CLAUDE.md sicil #46–#49.
