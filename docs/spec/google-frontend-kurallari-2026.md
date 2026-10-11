# Google Standartlarına Göre Front-End Geliştirme Rehberi (2026)

> Kaynaklar: web.dev, Google Search Central, Google HTML/CSS Style Guide, Google JavaScript & TypeScript Style Guide, Lighthouse, Chrome Developers.
> Son kontrol: Ekim 2026

---

## İçindekiler

1. [Core Web Vitals](#1-core-web-vitals)
2. [LCP: Yükleme Performansı](#2-lcp-yükleme-performansı)
3. [INP: Etkileşim Hızı](#3-inp-etkileşim-hızı)
4. [CLS: Görsel Kararlılık](#4-cls-görsel-kararlılık)
5. [Ölçüm ve İzleme](#5-ölçüm-ve-izleme)
6. [Google HTML/CSS Stil Kuralları](#6-google-htmlcss-stil-kuralları)
7. [Google JavaScript / TypeScript Stil Kuralları](#7-google-javascript--typescript-stil-kuralları)
8. [Erişilebilirlik (a11y)](#8-erişilebilirlik-a11y)
9. [JavaScript SEO](#9-javascript-seo)
10. [Yapılandırılmış Veri (Schema)](#10-yapılandırılmış-veri-schema)
11. [Görsel, Font ve Kaynak Optimizasyonu](#11-görsel-font-ve-kaynak-optimizasyonu)
12. [Güvenlik](#12-güvenlik)
13. [Mobil Uyumluluk](#13-mobil-uyumluluk)
14. [Yayın Öncesi Kontrol Listesi](#14-yayın-öncesi-kontrol-listesi)

---

## 1. Core Web Vitals

Google'ın sayfa deneyimini ölçtüğü ve sıralamada kullandığı üç temel metrik:

| Metrik | Ölçtüğü şey | İyi | İyileştirilmeli | Kötü |
|---|---|---|---|---|
| **LCP** (Largest Contentful Paint) | En büyük içeriğin yüklenme süresi | ≤ 2.5 sn | 2.5 – 4 sn | > 4 sn |
| **INP** (Interaction to Next Paint) | Tüm etkileşimlere yanıt hızı | ≤ 200 ms | 200 – 500 ms | > 500 ms |
| **CLS** (Cumulative Layout Shift) | Sayfa kaymaları | ≤ 0.1 | 0.1 – 0.25 | > 0.25 |

### Bilinmesi gereken temel noktalar

- **FID artık yok.** Mart 2024'te INP, FID'nin yerini aldı. FID'den bahseden kaynaklar güncel değildir.
- **Saha verisi esastır.** Google, gerçek kullanıcı verisini (CrUX) **28 günlük pencerede, 75. persentil** üzerinden değerlendirir. Mobil ve masaüstü ayrı ayrı ölçülür.
- **Lighthouse puanı sıralama ölçütü değildir.** Lighthouse bir laboratuvar aracıdır ve hata ayıklama için kullanılır. 100 puan alan bir sayfa sahada başarısız olabilir.
- **Eşik söylentilerine dikkat.** Bazı bloglar 2026'da INP eşiğinin 150 ms'ye düştüğünü iddia ediyor. Resmi web.dev dokümantasyonu hâlâ **200 ms** diyor. Her zaman resmi kaynağı esas alın.

---

## 2. LCP: Yükleme Performansı

LCP öğesi genellikle hero görseli, büyük bir başlık veya banner'dır.

### Kurallar

**LCP görselini asla lazy-load yapmayın.**

```html
<!-- YANLIŞ -->
<img src="hero.jpg" loading="lazy" alt="...">

<!-- DOĞRU -->
<img src="hero.avif" fetchpriority="high" width="1200" height="600" alt="Antalya'da oto kurtarma hizmeti">
```

**LCP kaynağını erken keşfettirin.** CSS arka planı veya JS ile yüklenen görseller geç bulunur, bu yüzden preload kullanın:

```html
<link rel="preload" as="image" href="/img/hero.avif" fetchpriority="high">
```

**Render'ı bloklayan kaynakları azaltın:**

```html
<!-- Kritik CSS inline -->
<style>/* ekranın ilk görünen kısmı için minimum CSS */</style>

<!-- Geri kalan CSS asenkron -->
<link rel="preload" href="/css/main.css" as="style" onload="this.rel='stylesheet'">

<!-- JS'i bloklamayan şekilde yükleyin -->
<script src="/js/app.js" defer></script>
```

**Sunucu yanıt süresini (TTFB) düşürün.** Hedef 800 ms'nin altıdır. CDN, önbellekleme (cache) ve SSR/statik üretim kullanın.

**Bağlantıları önceden açın:**

```html
<link rel="preconnect" href="https://cdn.example.com" crossorigin>
<link rel="dns-prefetch" href="https://analytics.example.com">
```

**Modern formatlar kullanın:**

```html
<picture>
  <source srcset="hero.avif" type="image/avif">
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" width="1200" height="600" alt="..." fetchpriority="high">
</picture>
```

### LCP'yi bozan yaygın hatalar

- Hero görselinin JavaScript ile (slider kütüphanesi vb.) sonradan eklenmesi
- Client-side rendering ile içeriğin geç oluşturulması
- Optimize edilmemiş, birkaç MB'lık JPG/PNG dosyalar
- Hero görselinin bir 3. parti domain'den yüklenmesi

---

## 3. INP: Etkileşim Hızı

INP, kullanıcının sayfadaki **tüm** tıklama, dokunma ve klavye etkileşimlerini ölçer ve en yavaşını (aykırı değerler hariç) raporlar. Hover ve scroll dahil değildir. 2026'da en çok başarısız olunan metriktir.

Bir etkileşimin süresi üç parçadan oluşur:

1. **Input delay:** Ana thread meşgul olduğu için bekleme süresi
2. **Processing time:** Event handler'ların çalışma süresi
3. **Presentation delay:** Bir sonraki karenin çizilmesi

### Kurallar

**Uzun görevleri (50 ms+) bölün:**

```js
// Ana thread'i tarayıcıya geri ver (scheduler.yield yoksa setTimeout'a düş)
function yieldToMain() {
  if (globalThis.scheduler?.yield) {
    return scheduler.yield();
  }
  return new Promise((resolve) => setTimeout(resolve, 0));
}

async function processItems(items) {
  let sonYield = performance.now();
  for (const item of items) {
    process(item);
    // Her ~50 ms'de bir tarayıcıya nefes aldır
    if (performance.now() - sonYield > 50) {
      await yieldToMain();
      sonYield = performance.now();
    }
  }
}
```

**Görsel geri bildirimi önce verin, ağır işi sonra yapın:**

```js
button.addEventListener('click', () => {
  // 1. Kullanıcıya anında tepki ver
  button.classList.add('loading');

  // 2. Ağır işi bir sonraki kareye ertele
  requestAnimationFrame(() => {
    setTimeout(() => {
      heavyCalculation();
    }, 0);
  });
});
```

**Yoğun hesaplamaları Web Worker'a taşıyın:**

```js
const worker = new Worker('/js/calc-worker.js');
worker.postMessage(data);
worker.onmessage = (e) => render(e.data);
```

**Input olaylarını debounce edin:**

```js
function debounce(fn, ms = 150) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
searchInput.addEventListener('input', debounce(search));
```

**DOM boyutunu küçük tutun.** 1.400 node'un üzerindeki DOM'lar yeniden çizim süresini artırır. Uzun listeler için sanallaştırma (virtualization) veya `content-visibility` kullanın:

```css
.uzun-liste-bolumu {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}
```

**Layout thrashing'den kaçının** (okuma ve yazmayı karıştırmayın):

```js
// YANLIŞ: her döngüde zorunlu layout
items.forEach(el => {
  el.style.width = container.offsetWidth + 'px';
});

// DOĞRU: önce oku, sonra yaz
const w = container.offsetWidth;
items.forEach(el => { el.style.width = w + 'px'; });
```

**3. parti script'leri kontrol altına alın.** Analytics, chat widget, reklam ve tag manager script'leri INP'nin en büyük düşmanıdır. Bunları `defer` ile, kullanıcı etkileşiminden sonra veya `requestIdleCallback` içinde yükleyin.

---

## 4. CLS: Görsel Kararlılık

### Kurallar

**Her medyaya boyut verin:**

```html
<img src="foto.webp" width="800" height="533" alt="...">
<iframe src="..." width="560" height="315"></iframe>
```

```css
img, video { max-width: 100%; height: auto; }
.video-kutu { aspect-ratio: 16 / 9; }
```

**Dinamik içeriğe önceden yer ayırın** (reklam, banner, çerez bildirimi):

```css
.reklam-alani { min-height: 250px; }
```

**Çerez banner'ı ve bildirimleri içeriği itmemeli.** Bunun yerine `position: fixed` ile overlay olarak gösterin.

**Font kaymasını önleyin:**

```css
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/myfont.woff2') format('woff2');
  font-display: swap; /* veya optional */
  size-adjust: 105%;  /* fallback font ile boyutu eşitlemek için */
}
```

```html
<link rel="preload" href="/fonts/myfont.woff2" as="font" type="font/woff2" crossorigin>
```

**Animasyonlarda sadece `transform` ve `opacity` kullanın:**

```css
/* YANLIŞ: layout tetikler */
.kutu { transition: top 0.3s, height 0.3s; }

/* DOĞRU */
.kutu { transition: transform 0.3s, opacity 0.3s; }
```

**bfcache'i bozmayın.** `unload` event'i kullanmayın; bunun yerine `pagehide` kullanın. Bu sayede geri/ileri gezinmede sayfa anında ve kaymadan açılır.

---

## 5. Ölçüm ve İzleme

| Araç | Veri türü | Ne için |
|---|---|---|
| **Search Console → Core Web Vitals** | Saha (CrUX) | Google'ın gerçekten gördüğü veri |
| **PageSpeed Insights** | Saha + Lab | Sayfa bazlı hızlı kontrol |
| **Chrome DevTools → Performance** | Lab | INP/uzun görev hata ayıklama |
| **Lighthouse** | Lab | Geliştirme sırasında denetim |
| **web-vitals kütüphanesi** | Saha (RUM) | Kendi analitiğinize gerçek veri |

### Gerçek kullanıcı verisi toplama

```html
<script type="module">
  import { onLCP, onINP, onCLS } from 'https://unpkg.com/web-vitals@4/dist/web-vitals.attribution.js?module';

  function gonder(metric) {
    navigator.sendBeacon('/analytics', JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      attribution: metric.attribution
    }));
  }

  onLCP(gonder);
  onINP(gonder);
  onCLS(gonder);
</script>
```

> Attribution build sayesinde INP'yi bozan script'i (Long Animation Frames verisi ile) ve LCP öğesini tam olarak görebilirsiniz.

---

## 6. Google HTML/CSS Stil Kuralları

### Genel

- Girinti **2 boşluk** olmalı; tab kullanılmamalı.
- Etiket, attribute ve CSS özellikleri **küçük harfle** yazılmalı.
- Satır sonlarında boşluk bırakılmamalı.
- Dosyalar **UTF-8** olmalı: `<meta charset="utf-8">`
- Kaynaklarda protokol belirtin ve **HTTPS** kullanın.

### HTML

```html
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sayfaya Özgü Başlık</title>
  <link rel="stylesheet" href="/css/main.css">  <!-- type="text/css" yazmayın -->
</head>
<body>
  <header>...</header>
  <nav>...</nav>
  <main>
    <article>
      <h1>Tek bir H1</h1>
      <section>
        <h2>Alt başlık</h2>
      </section>
    </article>
  </main>
  <footer>...</footer>
  <script src="/js/app.js" defer></script>  <!-- type="text/javascript" yazmayın -->
</body>
</html>
```

**Semantik kullanın:**

```html
<!-- YANLIŞ -->
<div class="btn" onclick="gonder()">Gönder</div>

<!-- DOĞRU -->
<button type="button">Gönder</button>
```

- İçerik, sunum ve davranışı ayırın: inline `style` ve `onclick` kullanmaktan kaçının.
- Multimedyaya alternatif içerik verin: `alt`, `<track>` altyazı vb.
- Entity yerine doğrudan UTF-8 karakter kullanın (`&ccedil;` yerine `ç`). Yalnızca `<`, `>`, `&` gibi özel karakterler entity olarak yazılmalı.

### CSS

```css
/* Anlamlı, tireyle ayrılmış class isimleri */
.urun-karti { }
.urun-karti__baslik { }

/* ID seçici yerine class */
/* #header {} yerine */
.site-header { }

/* Gereksiz tip seçicisi yok */
/* div.hata {} yerine */
.hata { }

/* Kısaltma özellikleri */
.kutu {
  margin: 0 auto;
  padding: 1rem 2rem;
}

/* 0 değerinde birim yok, ondalıkta başta 0 */
.oge {
  margin: 0;
  opacity: 0.8;
}

/* Kısa hex */
.renk { color: #ebc; }

/* Her bildirim noktalı virgülle biter, iki nokta sonrası boşluk */
.ornek {
  display: flex;
  gap: 1rem;
}
```

- `!important` kullanmaktan kaçının.
- Özellikleri alfabetik veya mantıksal gruplar halinde sıralayın ve tutarlı olun.
- Modern düzen için **Flexbox ve Grid** kullanın, float'tan kaçının.
- Renkler ve aralıklar için **CSS değişkenleri** kullanın:

```css
:root {
  --renk-ana: #1a73e8;
  --bosluk-m: 1rem;
}
```

---

## 7. Google JavaScript / TypeScript Stil Kuralları

### Değişkenler

```js
// var KULLANMAYIN
const MAX_DENEME = 3;        // değişmeyen sabit: CONSTANT_CASE
const kullanici = getUser(); // varsayılan: const
let sayac = 0;               // sadece yeniden atanacaksa let
```

### Modüller

```js
// Named export tercih edin
export function hesapla() {}
export const AYARLAR = {};

// Default export'tan kaçının
// export default function() {}   ← önerilmez

import { hesapla } from './hesapla.js';
```

### Adlandırma

| Tür | Stil | Örnek |
|---|---|---|
| Sınıf, tip, interface | UpperCamelCase | `UserService` |
| Değişken, fonksiyon | lowerCamelCase | `getUserName` |
| Global sabit | CONSTANT_CASE | `API_URL` |
| Dosya adı | küçük harf, tire/alt çizgi | `user-service.ts` |

### Genel kurallar

```js
// Her zaman === ve !==
if (deger === null) { }

// Arrow function ile this sorunlarından kaçının
items.map((item) => item.id);

// Template literal
const mesaj = `Merhaba ${ad}`;

// Destructuring
const { ad, soyad } = kullanici;

// Optional chaining ve nullish coalescing
const sehir = kullanici?.adres?.sehir ?? 'Bilinmiyor';

// Süslü parantezi her zaman kullanın
if (kosul) {
  yap();
}

// Noktalı virgül her zaman
const x = 5;

// Tek tırnak (string için)
const s = 'metin';

// eval() ve with KULLANMAYIN
```

### Asenkron kod

```js
async function veriGetir() {
  try {
    const res = await fetch('/api/veri');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Veri alınamadı:', err);
    throw err;
  }
}
```

### TypeScript'e özel

```ts
// any yerine unknown
function parse(girdi: unknown): Kullanici { /* tip kontrolü */ }

// Interface tercih edin (nesne şekilleri için)
interface Kullanici {
  id: number;
  ad: string;
  email?: string;
}

// Gereksiz tip yazmayın, çıkarıma güvenin
const sayi = 5; // : number yazmaya gerek yok

// Non-null assertion (!) kullanımını en aza indirin
// enum yerine sabit union tipler genellikle daha iyi
type Durum = 'aktif' | 'pasif' | 'beklemede';

// namespace kullanmayın, ES modülleri kullanın
```

### Yorumlar

```js
/**
 * İki fiyat arasındaki indirimi hesaplar.
 * @param {number} eskiFiyat
 * @param {number} yeniFiyat
 * @return {number} Yüzde indirim
 */
function indirimHesapla(eskiFiyat, yeniFiyat) { }
```

---

## 8. Erişilebilirlik (a11y)

Lighthouse erişilebilirlik puanında 90+ hedefleyin; ancak otomatik testler sorunların yalnızca bir kısmını yakalar.

### Kurallar

**Görsellerde anlamlı `alt` kullanın:**

```html
<img src="cekici.webp" alt="Sarı renkli kayar kasa çekici aracı">
<img src="dekor.svg" alt="">  <!-- dekoratifse boş alt -->
```

**Formlarda label kullanın:**

```html
<label for="tel">Telefon</label>
<input id="tel" type="tel" autocomplete="tel" required>
```

**Renk kontrastı:** Normal metinde en az **4.5:1**, büyük metinde **3:1** (WCAG AA).

**Klavye erişimi:**

```css
/* Focus'u ASLA tamamen kaldırmayın */
/* :focus { outline: none; }  ← YANLIŞ */

:focus-visible {
  outline: 3px solid var(--renk-ana);
  outline-offset: 2px;
}
```

**Dil belirtin:** `<html lang="tr">`

**Başlık hiyerarşisi:** H1 → H2 → H3 sırasında olmalı; seviye atlanmamalı.

**ARIA'yı doğru kullanın.** Native HTML yeterliyse ARIA eklemeyin:

```html
<!-- Native yetmediğinde -->
<button aria-expanded="false" aria-controls="menu">Menü</button>
<ul id="menu" hidden>...</ul>

<!-- İkon butonlarda erişilebilir isim -->
<button aria-label="Kapat"><svg>...</svg></button>
```

**Dokunma hedefleri:** En az **48×48 px** olmalı ve aralarında yeterli boşluk bulunmalı.

**Hareketi azaltma tercihine saygı gösterin:**

```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

---

## 9. JavaScript SEO

### Kurallar

**Linkler gerçek `<a href>` olmalı:**

```html
<!-- Google bunu takip edemez -->
<span onclick="location.href='/hizmetler'">Hizmetler</span>
<a onclick="git('/hizmetler')">Hizmetler</a>

<!-- DOĞRU -->
<a href="/hizmetler">Hizmetler</a>
```

**Kritik içeriği HTML'de sunun.** SSR, SSG (statik üretim) veya hibrit rendering kullanın. Tamamen client-side render edilen içerik geç veya eksik indekslenebilir.

**Her sayfa benzersiz meta etiketlerine sahip olmalı:**

```html
<title>Antalya Oto Kurtarıcı | 7/24 Çekici Hizmeti</title>
<meta name="description" content="Sayfaya özgü, 150-160 karakterlik açıklama.">
<link rel="canonical" href="https://example.com/sayfa">
```

**URL yapısı:**
- Temiz, okunabilir URL'ler kullanın: `/hizmetler/yol-yardim`
- Hash tabanlı routing kullanmayın (`/#/sayfa`); History API kullanın.
- Gerçek 404 sayfaları için HTTP 404 durum kodu döndürün (soft 404'ten kaçının).

**robots.txt'te JS ve CSS dosyalarını engellemeyin.** Google sayfayı render ederken bunlara ihtiyaç duyar.

**Lazy-load edilen içerik** Intersection Observer veya native `loading="lazy"` ile yüklenmeli. Scroll event'ine bağlı yükleme Google tarafından tetiklenmez.

**Çok dilli siteler için hreflang ekleyin:**

```html
<link rel="alternate" hreflang="tr" href="https://example.com/tr/">
<link rel="alternate" hreflang="en" href="https://example.com/en/">
<link rel="alternate" hreflang="x-default" href="https://example.com/">
```

**Diğer gereklilikler:**
- `sitemap.xml` hazırlayın ve Search Console'a gönderin.
- Open Graph etiketleri ekleyin (sosyal paylaşımlar için).
- Search Console → URL Denetimi ile render edilmiş HTML'i kontrol edin.

---

## 10. Yapılandırılmış Veri (Schema)

JSON-LD formatı Google'ın önerdiği formattır. Yapılandırılmış veri, sayfada **görünen** içerikle tutarlı olmalıdır.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Firma Adı",
  "url": "https://example.com",
  "telephone": "+90-XXX-XXX-XX-XX",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Antalya",
    "addressCountry": "TR"
  },
  "openingHours": "Mo-Su 00:00-23:59",
  "areaServed": "Antalya"
}
</script>
```

Sık kullanılan tipler: `Organization`, `LocalBusiness`, `Product`, `Article`, `BreadcrumbList`, `Hotel`, `Event`.

> Not: Google, FAQ ve HowTo zengin sonuçlarını büyük ölçüde kısıtladı. Bunları eklemek zarar vermez, ancak zengin sonuç garantisi yoktur.

Doğrulama araçları: **Rich Results Test** ve **Schema Markup Validator**.

---

## 11. Görsel, Font ve Kaynak Optimizasyonu

### Görseller

```html
<img
  src="urun-800.webp"
  srcset="urun-400.webp 400w, urun-800.webp 800w, urun-1600.webp 1600w"
  sizes="(max-width: 600px) 100vw, 50vw"
  width="800" height="600"
  loading="lazy"
  decoding="async"
  alt="...">
```

- Format önceliği: **AVIF > WebP > JPEG**
- Ekranın ilk görünen kısmının **altındaki** görseller için `loading="lazy"` kullanın.
- Görselleri gösterilecek boyutta sunun; 4000px'lik görseli 400px'te göstermeyin.
- İkonlar için SVG veya ikon sprite kullanın.

### Fontlar

- Yalnızca **WOFF2** formatı kullanın.
- Kullanılan karakter setine göre subset alın (Türkçe için `latin-ext`).
- Kullanılmayan font ağırlıklarını yüklemeyin.
- Mümkünse fontları kendi sunucunuzda barındırın (self-host).
- Değişken fontları (variable fonts) değerlendirin.

### JavaScript

- **Code splitting** uygulayın: sayfa bazlı ve dinamik `import()` ile.
- Tree-shaking yapılabilen kütüphaneler tercih edin.
- Ölü kodu kaldırın; Chrome DevTools → Coverage ile kontrol edin.
- Hedef: Ana bundle sıkıştırılmış halde **~170 KB**'ın altında olmalı.

```js
// İhtiyaç anında yükleme
button.addEventListener('click', async () => {
  const { haritaGoster } = await import('./harita.js');
  haritaGoster();
});
```

### Sıkıştırma ve önbellekleme

- **Brotli** (veya gzip) sıkıştırması kullanın.
- Statik kaynaklarda uzun süreli cache ve dosya adında hash kullanın:

```
Cache-Control: public, max-age=31536000, immutable
```

- HTTP/2 veya HTTP/3 kullanın.

### Speculation Rules (anında sayfa geçişi)

```html
<script type="speculationrules">
{
  "prerender": [{
    "where": { "href_matches": "/*" },
    "eagerness": "moderate"
  }]
}
</script>
```

---

## 12. Güvenlik

- Her yerde **HTTPS** kullanın; HSTS başlığı ekleyin.
- **Content Security Policy (CSP)** tanımlayın:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{RASTGELE}'; object-src 'none'; base-uri 'self';
```

- **Trusted Types** ile DOM tabanlı XSS'i engelleyin:

```
Content-Security-Policy: require-trusted-types-for 'script';
```

- Kullanıcı verisini DOM'a eklerken `innerHTML` yerine `textContent` kullanın:

```js
// YANLIŞ
el.innerHTML = kullaniciGirdisi;

// DOĞRU
el.textContent = kullaniciGirdisi;
```

- Dış linklerde `rel="noopener noreferrer"` kullanın.
- 3. parti script'ler için **Subresource Integrity** ekleyin:

```html
<script src="https://cdn.example.com/lib.js"
        integrity="sha384-..." crossorigin="anonymous"></script>
```

- Diğer güvenlik başlıkları: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`.
- API anahtarlarını front-end koduna koymayın.

---

## 13. Mobil Uyumluluk

Google, sitenin **mobil sürümünü** indeksler (mobile-first indexing).

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

- Zoom'u engellemeyin (`user-scalable=no` veya `maximum-scale=1` kullanmayın).
- Gövde metni en az **16px** olmalı.
- Yatay kaydırma olmamalı.
- Mobil ve masaüstünde **aynı içerik** sunulmalı; mobilde içerik gizlemeyin.
- Mobil-öncelikli CSS yazın:

```css
/* Önce mobil */
.grid { display: grid; grid-template-columns: 1fr; }

/* Sonra büyük ekranlar */
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}
```

- Sayfayı ilk açılışta kaplayan rahatsız edici pop-up'lardan (intrusive interstitials) kaçının. Bu tür pop-up'lar sıralamayı olumsuz etkiler.
- Container queries ile bileşen bazlı responsive tasarım yapın:

```css
.kart-kapsayici { container-type: inline-size; }
@container (min-width: 400px) {
  .kart { display: flex; }
}
```

---

## 14. Yayın Öncesi Kontrol Listesi

### Performans
- [ ] LCP görselinde `fetchpriority="high"` var, `loading="lazy"` yok
- [ ] Tüm görsellerde `width`/`height` veya `aspect-ratio` tanımlı
- [ ] Görseller AVIF/WebP formatında ve doğru boyutta
- [ ] Kritik CSS inline, script'ler `defer`/`async`
- [ ] Fontlar WOFF2, preload edilmiş, `font-display` ayarlı
- [ ] 3. parti script'ler geciktirilmiş
- [ ] 50 ms üzeri uzun görevler bölünmüş
- [ ] Brotli sıkıştırma ve cache başlıkları aktif
- [ ] `unload` event'i kullanılmıyor (bfcache uyumlu)

### SEO
- [ ] Her sayfada benzersiz `<title>` ve meta description var
- [ ] Canonical URL tanımlı
- [ ] Tüm linkler `<a href>` ile yazılmış
- [ ] Kritik içerik ilk HTML yanıtında mevcut
- [ ] JSON-LD yapılandırılmış veri eklenmiş ve doğrulanmış
- [ ] `sitemap.xml` ve `robots.txt` hazır
- [ ] Gerçek 404 sayfaları 404 durum kodu döndürüyor
- [ ] Gerekiyorsa hreflang tanımlı

### Erişilebilirlik
- [ ] `<html lang="tr">` tanımlı
- [ ] Tüm görsellerde uygun `alt` var
- [ ] Form alanlarında `<label>` var
- [ ] Kontrast oranı en az 4.5:1
- [ ] Klavye ile tüm öğelere ulaşılabiliyor, focus görünür
- [ ] Başlık hiyerarşisi düzgün (tek H1)
- [ ] Dokunma hedefleri en az 48×48 px

### Güvenlik
- [ ] HTTPS ve HSTS aktif
- [ ] CSP başlığı tanımlı
- [ ] Kullanıcı girdisi `innerHTML` ile eklenmiyor
- [ ] Front-end kodunda API anahtarı yok

### Ölçüm
- [ ] PageSpeed Insights'ta mobil ve masaüstü kontrol edildi
- [ ] Search Console'a site eklendi, Core Web Vitals raporu izleniyor
- [ ] `web-vitals` kütüphanesi ile gerçek kullanıcı verisi toplanıyor

---

## Faydalı Kaynaklar

- web.dev: https://web.dev
- Google Search Central: https://developers.google.com/search
- Google HTML/CSS Style Guide: https://google.github.io/styleguide/htmlcssguide.html
- Google JavaScript Style Guide: https://google.github.io/styleguide/jsguide.html
- Google TypeScript Style Guide: https://google.github.io/styleguide/tsguide.html
- PageSpeed Insights: https://pagespeed.web.dev
- Rich Results Test: https://search.google.com/test/rich-results
- Chrome DevTools: https://developer.chrome.com/docs/devtools
