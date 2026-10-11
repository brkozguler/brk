# Frontend Teknik Şartname — Next.js

Bu doküman, sitenin ön yüzünü sıfırdan kurmak için gereken yerleşim, hareket ve görsel davranış kurallarını tek yerde topluyor. Amaç; büyük fotoğrafların taşıdığı, sakin ve ağır tempolu, editoryal bir web deneyimi. Her bölümde önce ne yapılacağı, sonra nasıl yapılacağı anlatılıyor.

---

## İçindekiler

1. Teknoloji seçimi
2. Klasör yapısı
3. Kurulum
4. Tasarım token'ları
5. Yerleşim sistemi
6. Global bileşenler (header, menü, footer, yatay mod uyarısı)
7. Hareket altyapısı (GSAP + Lenis)
8. Metin animasyonları
9. Görsel animasyonları
10. Bölüm bileşenleri
11. Sayfa geçişleri
12. Sayfa şablonları
13. Görsel ve performans kuralları
14. Erişilebilirlik
15. Şablon gibi görünmemesi için kurallar
16. Geliştirme sırası ve teslim kontrol listesi

---

## 1. Teknoloji seçimi

| Konu | Seçim | Neden |
|---|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript | SSR/SSG, `next/image`, `next/font` |
| Stil | CSS Modules + global CSS değişkenleri | Animasyonlu bileşenlerde class çakışması yaşamamak için. Tailwind tercih edilirse token'lar `@theme` içine taşınır. |
| Animasyon | `gsap` + `@gsap/react` (ScrollTrigger, SplitText) | Scroll'a bağlı animasyon, timeline, satır bölme |
| Smooth scroll | `lenis` (`lenis/react`) | Ağır, yumuşak kaydırma hissi |
| Yardımcı | `clsx` | Koşullu class |
| İçerik | Başlangıçta `src/content/*.ts` içinde statik veri; sonra istenen headless CMS'e bağlanır | Bileşenler veriden bağımsız kalır |

GSAP ve tüm eklentileri (SplitText dahil) ücretsiz, ticari projede kullanılabiliyor.

---

## 2. Klasör yapısı

```
src/
  app/
    layout.tsx            # font, header, footer, smooth scroll, geçiş sağlayıcısı
    template.tsx          # her sayfa değişiminde yeniden mount olur
    page.tsx              # ana sayfa
    hakkimizda/page.tsx
    deneyimler/page.tsx
    deneyimler/[slug]/page.tsx
    konutlar/page.tsx
    konutlar/[slug]/page.tsx
    galeri/page.tsx
    galeri/[slug]/page.tsx
    iletisim/page.tsx
    globals.css
  components/
    layout/
      Header.tsx  Header.module.css
      Menu.tsx    Menu.module.css
      Footer.tsx  Footer.module.css
      RotateNotice.tsx
      SmoothScroll.tsx
    transition/
      TransitionProvider.tsx
      TransitionLink.tsx
    ui/
      RollButton.tsx  RollButton.module.css
    motion/
      SplitReveal.tsx
      WordFill.tsx
      MediaReveal.tsx
      Parallax.tsx
    sections/
      Hero.tsx
      Statement.tsx
      Collage.tsx
      TextBlock.tsx
      CrossfadeStack.tsx
      HoverList.tsx
      Slider.tsx
      CardGrid.tsx
      ExploreMore.tsx
      Gallery.tsx
      Lightbox.tsx
  hooks/
    useReducedMotion.ts
  lib/
    gsap.ts
    motion.ts            # easing ve süre sabitleri
  content/
    home.ts
    navigation.ts
public/
  logo-light.svg
  logo-dark.svg
  fonts/
```

---

## 3. Kurulum

```bash
npx create-next-app@latest proje --ts --app --src-dir --eslint --no-tailwind
cd proje
npm i gsap @gsap/react lenis clsx
```

`next.config.ts` — uzak görseller için:

```ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 828, 1080, 1440, 1920, 2560],
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.ornek-cms.com' }],
  },
};

export default config;
```

---

## 4. Tasarım token'ları

### 4.1 Renk

Paleti projenin kendi fotoğraflarından çıkarın: en baskın zemin tonu, en koyu gölge tonu ve fotoğraflarda zaten var olan tek bir vurgu rengi. Aşağıdaki değerler kıyı/doğa fotoğrafçılığına göre hazırlanmış bir başlangıç noktası.

```css
/* src/app/globals.css */
:root {
  --c-ink: #1f2a2c;        /* metin, koyu bölümler */
  --c-stone: #e6e2da;      /* açık zemin */
  --c-mist: #c8d2cf;       /* ikincil zemin, çizgiler */
  --c-sea: #2e5b60;        /* koyu vurgu zemini */
  --c-sun: #b88a3e;        /* tek vurgu, çok az kullanılır */
  --c-white: #fbfaf7;

  --bg: var(--c-stone);
  --fg: var(--c-ink);
}

[data-surface='dark'] { --bg: var(--c-ink); --fg: var(--c-white); }
[data-surface='sea']  { --bg: var(--c-sea); --fg: var(--c-white); }
```

Her bölüm kendi `data-surface` değerini taşır. Header rengi de bu değerden okunur (bkz. 6.1).

### 4.2 Tipografi

İki aile yeter: karakterli bir display serif ve sade bir grotesk. Lisanslı font kullanılacaksa `next/font/local`, ücretsiz alternatif için `next/font/google`.

```ts
// src/app/fonts.ts
import localFont from 'next/font/local';

export const display = localFont({
  src: [{ path: '../../public/fonts/display-regular.woff2', weight: '400' }],
  variable: '--font-display',
  display: 'swap',
});

export const text = localFont({
  src: [
    { path: '../../public/fonts/text-regular.woff2', weight: '400' },
    { path: '../../public/fonts/text-medium.woff2', weight: '500' },
  ],
  variable: '--font-text',
  display: 'swap',
});
```

Ölçek, akışkan (`clamp`) ve modüler:

```css
:root {
  --fs-xs: 0.75rem;
  --fs-sm: 0.875rem;
  --fs-md: 1.0625rem;
  --fs-lg: clamp(1.25rem, 1rem + 0.8vw, 1.625rem);
  --fs-xl: clamp(1.75rem, 1.2rem + 1.8vw, 2.75rem);
  --fs-2xl: clamp(2.5rem, 1.5rem + 3.5vw, 4.75rem);
  --fs-3xl: clamp(3.25rem, 1.5rem + 6vw, 8rem);

  --lh-tight: 1.02;
  --lh-heading: 1.12;
  --lh-body: 1.6;
}

h1, .h1 { font-family: var(--font-display); font-size: var(--fs-3xl); line-height: var(--lh-tight); font-weight: 400; letter-spacing: -0.02em; }
h2, .h2 { font-family: var(--font-display); font-size: var(--fs-2xl); line-height: var(--lh-heading); font-weight: 400; }
.statement { font-family: var(--font-display); font-size: var(--fs-xl); line-height: 1.25; max-width: 28ch; }
body { font-family: var(--font-text); font-size: var(--fs-md); line-height: var(--lh-body); color: var(--fg); background: var(--bg); }
p { max-width: 62ch; }
```

### 4.3 Hareket

Tüm süre ve eğriler tek dosyada durur, bileşenler sayı yazmaz.

```ts
// src/lib/motion.ts
export const ease = {
  out: 'expo.out',          // girişler, reveal
  inOut: 'power4.inOut',    // perde, menü, slider geçişi
  soft: 'power2.out',       // küçük UI tepkileri
};

export const dur = {
  fast: 0.4,     // renk, opaklık
  base: 0.8,     // buton, küçük reveal
  slow: 1.2,     // başlık satırları
  slower: 1.6,   // görsel maske + ölçek
};

export const stagger = { lines: 0.08, words: 0.04, items: 0.1 };
export const trigger = { start: 'top 85%' };
```

CSS tarafındaki karşılıkları:

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.76, 0, 0.24, 1);
  --dur-fast: 0.4s;
  --dur-base: 0.8s;
}
```

### 4.4 Boşluk

```css
:root {
  --gutter: clamp(1rem, 2.4vw, 2.5rem);
  --pad-x: clamp(1.25rem, 4vw, 4rem);
  --section-y: clamp(6rem, 14vw, 14rem);
  --header-h: 5rem;
}
```

---

## 5. Yerleşim sistemi

### 5.1 Grid

12 kolonlu, dış kenar boşluğu sabit, içerik çoğunlukla kolon atlayarak (offset) yerleşir. Bu, sayfaya simetrik olmayan, dergi sayfası gibi bir ritim verir.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: var(--gutter);
  padding-inline: var(--pad-x);
}

@media (max-width: 767px) {
  .grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

.section { padding-block: var(--section-y); }
.full-bleed { width: 100%; }
```

### 5.2 Kırılım noktaları

| Ad | Genişlik | Not |
|---|---|---|
| mobil | < 768 | 4 kolon, tek sütun düzen |
| tablet | 768–1023 | 8 kolon gibi kullanılır |
| masaüstü | 1024–1439 | 12 kolon |
| geniş | ≥ 1440 | İçerik genişler, metin genişliği `ch` ile sınırlı kalır |

### 5.3 Temel yerleşim kalıpları

```
Hero (100svh, tam genişlik görsel/video)
┌──────────────────────────────────────────┐
│                                          │
│            Başlık (1–2 satır)            │
│                                          │
│                 Aşağı kaydır             │
└──────────────────────────────────────────┘

Statement (büyük tek cümle, 2→9. kolon)
    ┌────────────────────────────┐
    │ Uzun, büyük punto cümle…   │
    └────────────────────────────┘

Collage (3 görsel, farklı boy ve hızlarda)
┌────────┐            ┌──────────────┐
│   A    │   ┌─────┐  │              │
│        │   │  B  │  │      C       │
└────────┘   └─────┘  │              │
                      └──────────────┘

HoverList (sol liste, sağ sabit görsel)
┌──────────────────┬───────────────────┐
│ Öğe 1  (aktif)   │                   │
│ Öğe 2            │   Aktif öğenin    │
│ Öğe 3            │   görseli         │
│ …                │                   │
└──────────────────┴───────────────────┘

CardGrid (4 kart)
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ img  │ │ img  │ │ img  │ │ img  │
│ ad   │ │ ad   │ │ ad   │ │ ad   │
└──────┘ └──────┘ └──────┘ └──────┘
```

Metin bölümleri sola hizalı. Ortalanmış metin sadece hero başlığında kullanılır.

---

## 6. Global bileşenler

### 6.1 Header

Davranış:
- Sabit, şeffaf zemin.
- Altındaki bölümün `data-surface` değerine göre açık ya da koyu logoya geçer. İki logo DOM'da üst üste durur, `opacity` ile değişir.
- Aşağı kaydırınca yukarı kayıp gizlenir, yukarı kaydırınca geri gelir.
- Solda menü butonu, ortada logo, sağda iletişim butonu.

```tsx
// src/components/layout/Header.tsx
'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLenis } from 'lenis/react';
import clsx from 'clsx';
import TransitionLink from '@/components/transition/TransitionLink';
import RollButton from '@/components/ui/RollButton';
import Menu from './Menu';
import s from './Header.module.css';

export default function Header() {
  const pathname = usePathname();
  const [tone, setTone] = useState<'light' | 'dark'>('light');
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Header'ın tam altındaki bölümü izle
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-surface]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const surface = (e.target as HTMLElement).dataset.surface;
          setTone(surface === 'light' ? 'dark' : 'light');
        });
      },
      { rootMargin: '-40px 0px -95% 0px' }
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  useLenis(({ scroll, direction }) => {
    if (menuOpen) return;
    setHidden(direction === 1 && scroll > 200);
  });

  return (
    <>
      <header className={clsx(s.header, hidden && s.hidden)} data-tone={menuOpen ? 'dark' : tone}>
        <button className={s.menuBtn} onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen}>
          {menuOpen ? 'Kapat' : 'Menü'}
        </button>
        <TransitionLink href="/" className={s.logo} aria-label="Ana sayfa">
          <img src="/logo-light.svg" alt="" className={s.logoLight} />
          <img src="/logo-dark.svg" alt="" className={s.logoDark} />
        </TransitionLink>
        <RollButton href="/iletisim">İletişim</RollButton>
      </header>
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
```

```css
/* Header.module.css */
.header {
  position: fixed; inset: 0 0 auto; z-index: 50;
  height: var(--header-h);
  display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
  padding-inline: var(--pad-x);
  color: var(--c-white);
  transition: transform var(--dur-base) var(--ease-out), color var(--dur-fast) ease;
}
.header[data-tone='dark'] { color: var(--c-ink); }
.hidden { transform: translateY(-100%); }

.menuBtn { justify-self: start; background: none; border: 0; color: inherit; font: inherit; cursor: pointer; }
.header > :last-child { justify-self: end; }

.logo { position: relative; display: block; width: 140px; height: 44px; }
.logo img { position: absolute; inset: 0; width: 100%; height: 100%; transition: opacity var(--dur-fast) ease; }
.logoDark { opacity: 0; }
.header[data-tone='dark'] .logoLight { opacity: 0; }
.header[data-tone='dark'] .logoDark { opacity: 1; }
```

### 6.2 Menü

Tam ekran katman. Açılırken aşağıdan yukarı perde gibi açılır, linkler sırayla maskeden yükselir. Açıkken sayfa kaydırması durur.

```tsx
// src/components/layout/Menu.tsx
'use client';
import { useRef } from 'react';
import { useLenis } from 'lenis/react';
import { gsap, useGSAP } from '@/lib/gsap';
import { ease } from '@/lib/motion';
import TransitionLink from '@/components/transition/TransitionLink';
import { navigation } from '@/content/navigation';
import s from './Menu.module.css';

export default function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>();
  const lenis = useLenis();

  useGSAP(() => {
    tl.current = gsap.timeline({ paused: true })
      .set(root.current, { visibility: 'visible' })
      .fromTo(root.current, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1, ease: ease.inOut })
      .from('[data-menu-link]', { yPercent: 110, duration: 1, stagger: 0.05, ease: ease.out }, '-=0.45')
      .from('[data-menu-media]', { scale: 1.15, autoAlpha: 0, duration: 1.4, ease: ease.out }, '<');
  }, { scope: root });

  useGSAP(() => {
    if (!tl.current) return;
    if (open) { tl.current.play(); lenis?.stop(); }
    else { tl.current.reverse(); lenis?.start(); }
  }, { dependencies: [open] });

  return (
    <div ref={root} className={s.menu} data-surface="light" aria-hidden={!open}>
      {navigation.groups.map((g) => (
        <nav key={g.title} className={s.group} aria-label={g.title}>
          <p className={s.groupTitle}>{g.title}</p>
          {g.links.map((l) => (
            <span key={l.href} className={s.mask}>
              <TransitionLink href={l.href} data-menu-link className={s.link} onClick={onClose}>
                {l.label}
              </TransitionLink>
            </span>
          ))}
        </nav>
      ))}
      <div className={s.media} data-menu-media />
    </div>
  );
}
```

```css
/* Menu.module.css */
.menu {
  position: fixed; inset: 0; z-index: 40;
  display: grid; grid-template-columns: repeat(3, 1fr) 1.3fr; gap: var(--gutter);
  padding: calc(var(--header-h) + 8vh) var(--pad-x) 6vh;
  background: var(--bg); color: var(--fg);
  visibility: hidden;
}
.groupTitle { font-size: var(--fs-sm); opacity: 0.6; margin-bottom: 1.5rem; }
.mask { display: block; overflow: hidden; }
.link { display: block; font-family: var(--font-display); font-size: var(--fs-xl); line-height: 1.2; }
.media { background: var(--c-mist) center / cover; }

@media (max-width: 767px) {
  .menu { grid-template-columns: 1fr; overflow-y: auto; }
  .media { display: none; }
}
```

Menü verisi footer ile ortaktır:

```ts
// src/content/navigation.ts
export const navigation = {
  groups: [
    { title: 'Genel', links: [
      { label: 'Hakkımızda', href: '/hakkimizda' },
      { label: 'Deneyimler', href: '/deneyimler' },
      { label: 'Galeri', href: '/galeri' },
      { label: 'İletişim', href: '/iletisim' },
    ]},
    { title: 'Konutlar', links: [ /* … */ ] },
    { title: 'Deneyimler', links: [ /* … */ ] },
  ],
};
```

### 6.3 Footer

Koyu zemin, 4 sütun (logo + 3 link grubu), en altta telif ve yasal linkler. Footer, içeriğin altından açılıyormuş gibi görünür:

```css
main { position: relative; z-index: 1; background: var(--bg); }
.footer { position: sticky; bottom: 0; z-index: 0; }
```

Footer yüksekliği ekrandan uzunsa bu efekt kaldırılır.

### 6.4 Yatay mod uyarısı (mobil)

Tam ekran hero ve sabitlenen bölümler, yatay tutulan telefonda bozulur. Bu durumda tüm sayfayı kaplayan bir uyarı gösterilir.

```tsx
// src/components/layout/RotateNotice.tsx
export default function RotateNotice() {
  return (
    <div className="rotate-notice" role="alert">
      <img src="/logo-light.svg" alt="" width={120} height={40} />
      <p>Siteyi görüntülemek için cihazınızı dikey konuma çevirin.</p>
    </div>
  );
}
```

```css
.rotate-notice { display: none; }
@media (orientation: landscape) and (max-height: 500px) and (pointer: coarse) {
  .rotate-notice {
    position: fixed; inset: 0; z-index: 9999;
    display: grid; place-content: center; gap: 1.5rem; text-align: center;
    background: var(--c-ink); color: var(--c-white); padding: 2rem;
  }
  body { overflow: hidden; }
}
```

### 6.5 Kayan metinli buton

Metin iki kez yazılır, ikinci kopya ekran okuyuculardan gizlenir. Hover'da ikisi birlikte yukarı kayar.

```tsx
// src/components/ui/RollButton.tsx
import TransitionLink from '@/components/transition/TransitionLink';
import s from './RollButton.module.css';

export default function RollButton({ href, children }: { href: string; children: string }) {
  return (
    <TransitionLink href={href} className={s.btn}>
      <span className={s.track}>
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </TransitionLink>
  );
}
```

```css
/* RollButton.module.css */
.btn {
  display: inline-flex; align-items: center;
  padding: 0.9em 1.8em; border: 1px solid currentColor; border-radius: 999px;
  font-size: var(--fs-sm); line-height: 1;
}
.track { display: grid; height: 1em; overflow: hidden; }
.track > span { grid-area: 1 / 1; transition: transform 0.6s var(--ease-in-out); }
.track > span:last-child { transform: translateY(105%); }
.btn:hover .track > span:first-child,
.btn:focus-visible .track > span:first-child { transform: translateY(-105%); }
.btn:hover .track > span:last-child,
.btn:focus-visible .track > span:last-child { transform: translateY(0); }
```

---

## 7. Hareket altyapısı

### 7.1 GSAP kaydı

```ts
// src/lib/gsap.ts
'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
```

Her animasyonlu bileşen `useGSAP` kullanır. Bu hook, bileşen kaldırıldığında tüm tween ve ScrollTrigger'ları temizler; sayfa geçişlerinde sızıntı olmaz.

### 7.2 Lenis + GSAP senkronizasyonu

```tsx
// src/components/layout/SmoothScroll.tsx
'use client';
import { useEffect, useRef } from 'react';
import { ReactLenis, type LenisRef } from 'lenis/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<LenisRef>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const lenis = ref.current?.lenis;
    if (!lenis) return;
    const raf = (t: number) => lenis.raf(t * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(raf); lenis.off('scroll', ScrollTrigger.update); };
  }, [reduced]);

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis root ref={ref} options={{ autoRaf: false, lerp: 0.09, wheelMultiplier: 0.9 }}>
      {children}
    </ReactLenis>
  );
}
```

```ts
// src/hooks/useReducedMotion.ts
'use client';
import { useEffect, useState } from 'react';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}
```

### 7.3 Root layout

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next';
import { display, text } from './fonts';
import SmoothScroll from '@/components/layout/SmoothScroll';
import TransitionProvider from '@/components/transition/TransitionProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RotateNotice from '@/components/layout/RotateNotice';
import './globals.css';

export const metadata: Metadata = { title: { default: 'Proje', template: '%s | Proje' } };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${display.variable} ${text.variable}`}>
      <body>
        <SmoothScroll>
          <TransitionProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </TransitionProvider>
        </SmoothScroll>
        <RotateNotice />
      </body>
    </html>
  );
}
```

---

## 8. Metin animasyonları

### 8.1 Satır satır maskeden yükselme

Başlıklar satırlarına bölünür, her satır kendi maskesinin içinden yukarı çıkar. `autoSplit`, font yüklendiğinde ve ekran boyutu değiştiğinde satırları yeniden hesaplar.

```tsx
// src/components/motion/SplitReveal.tsx
'use client';
import { useRef, type ElementType } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { dur, ease, stagger, trigger } from '@/lib/motion';

type Props = { as?: ElementType; children: React.ReactNode; className?: string; delay?: number; onLoad?: boolean };

export default function SplitReveal({ as: Tag = 'h2', children, className, delay = 0, onLoad = false }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    SplitText.create(ref.current!, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 110,
          duration: dur.slow,
          ease: ease.out,
          stagger: stagger.lines,
          delay,
          scrollTrigger: onLoad ? undefined : { trigger: ref.current, start: trigger.start, once: true },
        }),
    });
  }, { scope: ref });

  return <Tag ref={ref} className={className}>{children}</Tag>;
}
```

Sayfa ilk yüklenirken başlık görünmeden bir an "titrememesi" için:

```css
[data-split-pending] { visibility: hidden; }
```

SplitText çalıştıktan sonra bu öznitelik kaldırılır ya da bileşen `autoAlpha` ile başlatılır.

### 8.2 Kelime kelime dolan büyük cümle

Hero'dan sonraki büyük cümlede kelimeler soluk başlar, kaydırdıkça koyulaşır. Hareket kaydırmaya bağlıdır (scrub), geri kaydırınca geri döner.

```tsx
// src/components/motion/WordFill.tsx
'use client';
import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';

export default function WordFill({ children }: { children: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    SplitText.create(ref.current!, {
      type: 'words',
      autoSplit: true,
      onSplit: (self) =>
        gsap.fromTo(self.words, { opacity: 0.18 }, {
          opacity: 1,
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'bottom 45%', scrub: true },
        }),
    });
  }, { scope: ref });

  return <p ref={ref} className="statement">{children}</p>;
}
```

---

## 9. Görsel animasyonları

### 9.1 Maskeli açılış + ölçek

Görselin kabı aşağıdan yukarı açılırken içteki görsel %125'ten %100'e küçülür. Bütün sitede görsel girişlerinin tek tipi budur.

```tsx
// src/components/motion/MediaReveal.tsx
'use client';
import { useRef } from 'react';
import Image, { type ImageProps } from 'next/image';
import { gsap, useGSAP } from '@/lib/gsap';
import { dur, ease, trigger } from '@/lib/motion';
import s from './MediaReveal.module.css';

type Props = Omit<ImageProps, 'fill'> & { ratio?: string; parallax?: number };

export default function MediaReveal({ ratio = '4 / 5', parallax = 0, className, ...img }: Props) {
  const box = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const inner = box.current!.querySelector('[data-inner]');
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({ scrollTrigger: { trigger: box.current, start: trigger.start, once: true } })
        .fromTo(box.current, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: dur.slower, ease: ease.out })
        .from(inner, { scale: 1.25, duration: dur.slower + 0.4, ease: ease.out }, 0);

      if (parallax) {
        gsap.fromTo(inner, { yPercent: -parallax }, {
          yPercent: parallax, ease: 'none',
          scrollTrigger: { trigger: box.current, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      }
    });
  }, { scope: box });

  return (
    <div ref={box} className={`${s.box} ${className ?? ''}`} style={{ aspectRatio: ratio }}>
      <div data-inner className={s.inner} style={{ inset: parallax ? `-${parallax}% 0` : 0 }}>
        <Image fill {...img} className={s.img} />
      </div>
    </div>
  );
}
```

```css
/* MediaReveal.module.css */
.box { position: relative; overflow: hidden; }
.inner { position: absolute; will-change: transform; }
.img { object-fit: cover; }
```

Not: `scale` ve `yPercent` aynı elemanda birlikte çalışır çünkü GSAP bunları tek `transform` içinde birleştirir.

### 9.2 Çok hızlı parallax (kolaj)

Üç görsel farklı hızlarda kayar; derinlik hissini bu fark verir.

```tsx
// src/components/sections/Collage.tsx
import MediaReveal from '@/components/motion/MediaReveal';
import s from './Collage.module.css';

export default function Collage({ images }: { images: { src: string; alt: string }[] }) {
  const [a, b, c] = images;
  return (
    <section className={`section grid ${s.collage}`} data-surface="light">
      <MediaReveal className={s.a} src={a.src} alt={a.alt} ratio="3 / 4" parallax={6}  sizes="(min-width:1024px) 25vw, 60vw" />
      <MediaReveal className={s.b} src={b.src} alt={b.alt} ratio="1 / 1" parallax={14} sizes="(min-width:1024px) 18vw, 45vw" />
      <MediaReveal className={s.c} src={c.src} alt={c.alt} ratio="4 / 5" parallax={9}  sizes="(min-width:1024px) 33vw, 80vw" />
    </section>
  );
}
```

```css
/* Collage.module.css */
.collage { align-items: start; }
.a { grid-column: 1 / span 3; margin-top: 12vw; }
.b { grid-column: 5 / span 2; margin-top: 28vw; }
.c { grid-column: 8 / span 5; }

@media (max-width: 767px) {
  .a { grid-column: 1 / span 3; margin-top: 0; }
  .b { grid-column: 3 / span 2; margin-top: -10vw; }
  .c { grid-column: 1 / -1; margin-top: 2rem; }
}
```

### 9.3 Hero görseli

İlk yüklemede görsel ölçekten oturur; kaydırınca daha yavaş kayar ve hafif kararır.

```tsx
// src/components/sections/Hero.tsx
'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { gsap, useGSAP } from '@/lib/gsap';
import { ease } from '@/lib/motion';
import SplitReveal from '@/components/motion/SplitReveal';
import s from './Hero.module.css';

type Props = { title: string; image?: string; video?: string; poster?: string };

export default function Hero({ title, image, video, poster }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from('[data-hero-media]', { scale: 1.15, duration: 2.4, ease: ease.out });
    gsap.from('[data-hero-cue]', { autoAlpha: 0, duration: 1, delay: 1.3 });

    gsap.to('[data-hero-media]', {
      yPercent: 18, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('[data-hero-shade]', {
      opacity: 0.55, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
    });
  }, { scope: root });

  return (
    <section ref={root} className={s.hero} data-surface="dark">
      <div className={s.media} data-hero-media>
        {video ? (
          <video src={video} poster={poster} autoPlay muted loop playsInline className={s.fill} />
        ) : (
          <Image src={image!} alt="" fill priority sizes="100vw" className={s.fill} />
        )}
      </div>
      <div className={s.shade} data-hero-shade />
      <SplitReveal as="h1" className={s.title} onLoad delay={0.4}>{title}</SplitReveal>
      <div className={s.cue} data-hero-cue>
        <span>Aşağı kaydır</span>
        <i />
      </div>
    </section>
  );
}
```

```css
/* Hero.module.css */
.hero { position: relative; height: 100svh; overflow: hidden; display: grid; place-items: center; color: var(--c-white); }
.media { position: absolute; inset: -10% 0 0; }
.fill { width: 100%; height: 100%; object-fit: cover; }
.shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgb(0 0 0 / 0.3), rgb(0 0 0 / 0) 40%, rgb(0 0 0 / 0.35)); opacity: 0.25; }
.title { position: relative; text-align: center; max-width: 14ch; }
.cue { position: absolute; bottom: 2rem; left: 50%; translate: -50% 0; display: grid; justify-items: center; gap: 0.75rem; font-size: var(--fs-xs); }
.cue i { width: 1px; height: 3.5rem; background: rgb(255 255 255 / 0.3); position: relative; overflow: hidden; }
.cue i::after { content: ''; position: absolute; inset: 0; background: currentColor; animation: cue 2.2s var(--ease-in-out) infinite; }
@keyframes cue { 0% { transform: translateY(-100%); } 50% { transform: translateY(0); } 100% { transform: translateY(100%); } }

@media (prefers-reduced-motion: reduce) { .cue i::after { animation: none; } }
```

Hero'da video kullanılacaksa: 8–15 saniye, sessiz, H.264 MP4 + WebM, 1920 px genişlik, 4–6 MB üstüne çıkmamalı. Mobilde ayrı, daha küçük bir dosya verilir ya da sadece poster gösterilir.

---

## 10. Bölüm bileşenleri

### 10.1 Statement

Hero'dan hemen sonra gelen tek, büyük cümle. `WordFill` ile kullanılır, 2. kolondan 10. kolona kadar uzanır.

### 10.2 TextBlock

Başlık + paragraf + buton. İki kolonlu: başlık solda (1–5), metin sağda (7–11). Başlık `SplitReveal` ile girer; paragraf ve buton ayrıca animasyonlanmaz. Bütün sayfadaki her bloğa ayrı giriş efekti vermek hareketi değersizleştirir.

### 10.3 CrossfadeStack

Birkaç görselin üst üste durup belirli aralıklarla birbirine geçtiği alan. Ekran dışındayken durur.

```tsx
// src/components/sections/CrossfadeStack.tsx
'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import s from './CrossfadeStack.module.css';

export default function CrossfadeStack({ images, interval = 3 }: { images: { src: string; alt: string }[]; interval?: number }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const items = gsap.utils.toArray<HTMLElement>('[data-slide]');
    gsap.set(items, { autoAlpha: 0, scale: 1.06 });
    gsap.set(items[0], { autoAlpha: 1, scale: 1 });

    const loop = gsap.timeline({ repeat: -1, paused: true });
    items.forEach((el, i) => {
      const next = items[(i + 1) % items.length];
      loop
        .to(next, { autoAlpha: 1, scale: 1, duration: 1.4, ease: 'power2.inOut', zIndex: 2 }, `+=${interval}`)
        .set(el, { autoAlpha: 0, scale: 1.06, zIndex: 1 });
    });

    ScrollTrigger.create({
      trigger: root.current, start: 'top bottom', end: 'bottom top',
      onToggle: (st) => (st.isActive ? loop.play() : loop.pause()),
    });
  }, { scope: root });

  return (
    <div ref={root} className={s.stack}>
      {images.map((img, i) => (
        <div key={img.src} data-slide className={s.slide}>
          <Image src={img.src} alt={img.alt} fill sizes="(min-width:1024px) 60vw, 100vw" priority={i === 0} />
        </div>
      ))}
    </div>
  );
}
```

```css
.stack { position: relative; aspect-ratio: 16 / 10; overflow: hidden; }
.slide { position: absolute; inset: 0; }
.slide img { object-fit: cover; }
```

### 10.4 HoverList

Solda bir liste, sağda tek bir görsel alanı. Masaüstünde fare hangi öğenin üstündeyse onun görseli maskeden açılır. Mobilde liste kaydırıldıkça ekranın ortasına gelen öğe aktif olur.

```tsx
// src/components/sections/HoverList.tsx
'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { ease } from '@/lib/motion';
import TransitionLink from '@/components/transition/TransitionLink';
import s from './HoverList.module.css';

type Item = { title: string; href: string; image: string; alt: string };

export default function HoverList({ items }: { items: Item[] }) {
  const root = useRef<HTMLElement>(null);
  const current = useRef(0);
  const [active, setActive] = useState(0);

  const { contextSafe } = useGSAP(() => {
    const imgs = gsap.utils.toArray<HTMLElement>('[data-img]');
    gsap.set(imgs, { clipPath: 'inset(100% 0 0 0)' });
    gsap.set(imgs[0], { clipPath: 'inset(0% 0 0 0)' });

    // Mobil: kaydırarak aktifleştirme
    gsap.matchMedia().add('(hover: none)', () => {
      gsap.utils.toArray<HTMLElement>('[data-item]').forEach((el, i) => {
        ScrollTrigger.create({ trigger: el, start: 'top center', end: 'bottom center', onToggle: (st) => st.isActive && show(i) });
      });
    });
  }, { scope: root });

  const show = contextSafe((i: number) => {
    if (i === current.current) return;
    const imgs = gsap.utils.toArray<HTMLElement>('[data-img]', root.current);
    const prev = imgs[current.current];
    const next = imgs[i];
    gsap.killTweensOf([prev, next]);
    gsap.set(next, { zIndex: 2 });
    gsap.set(prev, { zIndex: 1 });
    gsap.timeline()
      .fromTo(next, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1, ease: ease.inOut })
      .fromTo(next.querySelector('img'), { scale: 1.15 }, { scale: 1, duration: 1.3, ease: ease.out }, 0)
      .set(prev, { clipPath: 'inset(100% 0 0 0)' });
    current.current = i;
    setActive(i);
  });

  return (
    <section ref={root} className={`section grid ${s.wrap}`} data-surface="light">
      <ul className={s.list}>
        {items.map((it, i) => (
          <li key={it.href} data-item>
            <TransitionLink
              href={it.href}
              className={clsx(s.link, active === i && s.active)}
              onMouseEnter={() => show(i)}
              onFocus={() => show(i)}
            >
              {it.title}
            </TransitionLink>
          </li>
        ))}
      </ul>
      <div className={s.media}>
        {items.map((it) => (
          <div key={it.href} data-img className={s.img}>
            <Image src={it.image} alt={it.alt} fill sizes="(min-width:1024px) 45vw, 100vw" />
          </div>
        ))}
      </div>
    </section>
  );
}
```

```css
/* HoverList.module.css */
.wrap { align-items: center; }
.list { grid-column: 1 / span 5; list-style: none; padding: 0; margin: 0; }
.link { display: block; padding-block: 0.35em; font-family: var(--font-display); font-size: var(--fs-xl); opacity: 0.35; transition: opacity var(--dur-fast) ease, transform 0.6s var(--ease-out); }
.active { opacity: 1; transform: translateX(0.5rem); }
.media { grid-column: 7 / span 6; position: relative; aspect-ratio: 4 / 5; overflow: hidden; position: sticky; top: calc(var(--header-h) + 2rem); }
.img { position: absolute; inset: 0; }
.img img { object-fit: cover; }

@media (max-width: 767px) {
  .list { grid-column: 1 / -1; order: 2; }
  .media { grid-column: 1 / -1; top: var(--header-h); }
}
```

### 10.5 Slider (sayaçlı)

Sağa/sola okla ya da kaydırarak ilerleyen, `1 / 3` biçiminde sayacı olan slider. Geçiş yandan maskeyle silinir.

```tsx
// src/components/sections/Slider.tsx
'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { gsap, useGSAP } from '@/lib/gsap';
import { ease } from '@/lib/motion';
import s from './Slider.module.css';

export default function Slider({ images }: { images: { src: string; alt: string }[] }) {
  const root = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const busy = useRef(false);
  const startX = useRef(0);

  const { contextSafe } = useGSAP(() => {
    const slides = gsap.utils.toArray<HTMLElement>('[data-slide]');
    gsap.set(slides, { autoAlpha: 0 });
    gsap.set(slides[0], { autoAlpha: 1 });
  }, { scope: root });

  const go = contextSafe((dir: 1 | -1) => {
    if (busy.current) return;
    busy.current = true;
    const slides = gsap.utils.toArray<HTMLElement>('[data-slide]', root.current);
    const nextIndex = (index + dir + slides.length) % slides.length;
    const prev = slides[index];
    const next = slides[nextIndex];

    gsap.timeline({ onComplete: () => { busy.current = false; } })
      .set(next, { autoAlpha: 1, zIndex: 2, clipPath: dir > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' })
      .to(next, { clipPath: 'inset(0 0% 0 0%)', duration: 1.1, ease: ease.inOut })
      .fromTo(next.querySelector('img'), { scale: 1.12 }, { scale: 1, duration: 1.6, ease: ease.out }, 0)
      .set(prev, { autoAlpha: 0, zIndex: 1 });

    setIndex(nextIndex);
  });

  return (
    <div
      ref={root}
      className={s.slider}
      onPointerDown={(e) => { startX.current = e.clientX; }}
      onPointerUp={(e) => {
        const dx = e.clientX - startX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
      role="region"
      aria-roledescription="carousel"
    >
      <div className={s.track}>
        {images.map((img, i) => (
          <div key={img.src} data-slide className={s.slide} aria-hidden={i !== index}>
            <Image src={img.src} alt={img.alt} fill sizes="(min-width:1024px) 66vw, 100vw" />
          </div>
        ))}
      </div>
      <div className={s.ui}>
        <button onClick={() => go(-1)} aria-label="Önceki görsel">‹</button>
        <span className={s.count} aria-live="polite">{index + 1} / {images.length}</span>
        <button onClick={() => go(1)} aria-label="Sonraki görsel">›</button>
      </div>
    </div>
  );
}
```

```css
/* Slider.module.css */
.track { position: relative; aspect-ratio: 16 / 10; overflow: hidden; touch-action: pan-y; }
.slide { position: absolute; inset: 0; }
.slide img { object-fit: cover; }
.ui { display: flex; align-items: center; gap: 1.25rem; margin-top: 1.25rem; }
.ui button { width: 2.75rem; height: 2.75rem; border: 1px solid currentColor; border-radius: 50%; background: none; color: inherit; cursor: pointer; }
.count { font-variant-numeric: tabular-nums; min-width: 4ch; text-align: center; }
```

### 10.6 CardGrid

Dört kart: görsel, başlık, link. Görsel 3:4. Masaüstünde 4 kolon, tablette 2, mobilde yatay kaydırmalı şerit (`overflow-x: auto; scroll-snap-type: x mandatory`). Hover'da görsel çok hafif büyür; başka hover efekti eklenmez.

```css
.cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--gutter); padding-inline: var(--pad-x); }
.card { display: block; }
.cardMedia { position: relative; aspect-ratio: 3 / 4; overflow: hidden; }
.cardMedia img { object-fit: cover; transition: transform 1.2s var(--ease-out); }
.card:hover .cardMedia img { transform: scale(1.04); }
.cardTitle { margin-top: 1rem; font-family: var(--font-display); font-size: var(--fs-lg); }

@media (max-width: 1023px) { .cards { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 767px) {
  .cards { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; }
  .card { flex: 0 0 78%; scroll-snap-align: start; }
}
```

### 10.7 ExploreMore

Her alt sayfanın sonunda, footer'dan hemen önce gelen ortak modül. Ana bölümlere giden 4 küçük görselli link. İçinde bulunulan sayfanın linki gösterilmez.

### 10.8 Gallery + Lightbox

Galeri sayfası: başlık, önceki/sonraki galeri linkleri, altında masonry benzeri bir görsel düzeni. Görsele tıklanınca tam ekran lightbox açılır; içinde sıra numarası, açıklama, ok tuşları ve Esc ile kapanma vardır. Lightbox için yerel `<dialog>` kullanılır, böylece odak yönetimi tarayıcıdan gelir.

```tsx
// src/components/sections/Lightbox.tsx
'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useLenis } from 'lenis/react';
import { gsap } from '@/lib/gsap';

type Img = { src: string; alt: string; caption?: string };

export default function Lightbox({ images, index, onChange, onClose }: {
  images: Img[]; index: number | null; onChange: (i: number) => void; onClose: () => void;
}) {
  const dlg = useRef<HTMLDialogElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (index === null) { dlg.current?.close(); lenis?.start(); return; }
    if (!dlg.current?.open) { dlg.current?.showModal(); lenis?.stop(); }
    gsap.fromTo('[data-lb-img]', { autoAlpha: 0, scale: 1.03 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'expo.out' });
  }, [index, lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (index === null) return;
      if (e.key === 'ArrowRight') onChange((index + 1) % images.length);
      if (e.key === 'ArrowLeft') onChange((index - 1 + images.length) % images.length);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [index, images.length, onChange]);

  if (index === null) return <dialog ref={dlg} />;
  const img = images[index];

  return (
    <dialog ref={dlg} className="lightbox" onClose={onClose}>
      <button onClick={onClose} className="lightbox__close">Kapat</button>
      <div data-lb-img className="lightbox__media">
        <Image src={img.src} alt={img.alt} fill sizes="100vw" />
      </div>
      <p className="lightbox__meta">
        <span>{index + 1} / {images.length}</span>
        {img.caption && <span>{img.caption}</span>}
      </p>
    </dialog>
  );
}
```

---

## 11. Sayfa geçişleri

App Router'da çıkış animasyonu için link tıklaması yakalanır: önce perde kapanır, sonra yönlendirme yapılır, yeni sayfa geldiğinde perde açılır.

```tsx
// src/components/transition/TransitionProvider.tsx
'use client';
import { createContext, useContext, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLenis } from 'lenis/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { ease } from '@/lib/motion';

const Ctx = createContext<(href: string) => void>(() => {});
export const useTransitionTo = () => useContext(Ctx);

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lenis = useLenis();
  const curtain = useRef<HTMLDivElement>(null);
  const pending = useRef(false);

  const go = (href: string) => {
    if (href === pathname || pending.current) return;
    pending.current = true;
    gsap.timeline()
      .set(curtain.current, { yPercent: 100, autoAlpha: 1 })
      .to(curtain.current, { yPercent: 0, duration: 0.7, ease: ease.inOut, onComplete: () => router.push(href) });
  };

  useEffect(() => {
    if (!pending.current) return;
    lenis?.scrollTo(0, { immediate: true });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      gsap.to(curtain.current, {
        yPercent: -100, duration: 0.8, ease: ease.inOut, delay: 0.1,
        onComplete: () => { pending.current = false; gsap.set(curtain.current, { autoAlpha: 0 }); },
      });
    });
  }, [pathname, lenis]);

  return (
    <Ctx.Provider value={go}>
      {children}
      <div ref={curtain} className="curtain" aria-hidden="true" />
    </Ctx.Provider>
  );
}
```

```tsx
// src/components/transition/TransitionLink.tsx
'use client';
import Link, { type LinkProps } from 'next/link';
import type { AnchorHTMLAttributes } from 'react';
import { useTransitionTo } from './TransitionProvider';

type Props = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>;

export default function TransitionLink({ href, onClick, ...rest }: Props) {
  const go = useTransitionTo();
  return (
    <Link
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || rest.target === '_blank') return;
        e.preventDefault();
        go(href.toString());
      }}
    />
  );
}
```

```css
.curtain {
  position: fixed; inset: 0; z-index: 60;
  background: var(--c-ink);
  visibility: hidden; pointer-events: none;
}
```

Hareket azaltma tercihi açıksa perde kullanılmaz, `router.push` doğrudan çağrılır.

---

## 12. Sayfa şablonları

| Sayfa | Bölüm sırası |
|---|---|
| Ana sayfa | Hero → Statement → TextBlock + Collage → TextBlock → CrossfadeStack → HoverList (konutlar) → CardGrid (deneyimler) → ExploreMore |
| Konutlar | Hero (görsel) → Statement → Konut blokları (görsel/metin sırayla sağ-sol) → Özellik listesi (3 madde) → ExploreMore |
| Konut detay | Hero → Statement → Slider → TextBlock'lar → Kat planı / özellik tablosu → İlgili konutlar (CardGrid) → ExploreMore |
| Deneyimler | Hero → Statement → CardGrid (tüm deneyimler) → ExploreMore |
| Deneyim detay | Hero → Statement → Büyük tek görsel → TextBlock + Slider → TextBlock + görsel → ExploreMore |
| Galeri | Başlık → Galeri kartları (her kategori için kapak) |
| Galeri detay | Başlık + önceki/sonraki galeri → Görsel düzeni → Lightbox |
| İletişim | Başlık → Form (solda) + adres, telefon, e-posta (sağda) → Harita ya da tek görsel |

Bölümler bir veri dizisinden render edilir, böylece CMS'e geçince sayfa yapısı panelden değiştirilebilir:

```tsx
// src/app/page.tsx
import { home } from '@/content/home';
import { renderSection } from '@/components/sections/registry';

export default function Page() {
  return <>{home.sections.map(renderSection)}</>;
}
```

```tsx
// src/components/sections/registry.tsx
import Hero from './Hero';
import Collage from './Collage';
import HoverList from './HoverList';
// …

export function renderSection(section: any, i: number) {
  switch (section.type) {
    case 'hero': return <Hero key={i} {...section} />;
    case 'collage': return <Collage key={i} {...section} />;
    case 'hoverList': return <HoverList key={i} {...section} />;
    default: return null;
  }
}
```

---

## 13. Görsel ve performans kuralları

- Tüm görseller `next/image` ile verilir ve her birinin doğru `sizes` değeri vardır. Tek bir 2500 px görseli her cihaza göndermek mobilde sayfayı ağırlaştırır.
- Hero görseli `priority`, diğerleri lazy.
- Kalite: hero `quality={80}`, diğerleri varsayılan (75).
- Yerel görsellerde `placeholder="blur"`; uzak görsellerde CMS'in verdiği küçük base64 önizleme `blurDataURL` olarak geçilir.
- Fotoğraflar yüklenmeden reveal animasyonu tetiklenirse boş kutu açılır. Görsel yüklenince `ScrollTrigger.refresh()` çağrılır ya da `onLoad` sonrası animasyon başlatılır.
- `will-change: transform` sadece parallax ve sürekli hareket eden elemanlarda.
- Aynı anda en fazla bir pinned bölüm. Pinned bölümler mobilde kapatılır (`gsap.matchMedia`).
- Fontlar `woff2`, en fazla 4 dosya, `display: swap`.

Hedefler (mobil, Lighthouse):

| Ölçüt | Hedef |
|---|---|
| LCP | < 2.5 sn |
| CLS | < 0.05 |
| INP | < 200 ms |
| İlk yüklenen JS | < 180 KB (gzip) |
| Hero video | < 6 MB masaüstü, < 2 MB mobil |

---

## 14. Erişilebilirlik

- `prefers-reduced-motion: reduce` açıkken: Lenis kapanır, perde geçişi kapanır, scroll'a bağlı efektler çalışmaz, metin ve görseller doğrudan görünür.
- Çift yazılan buton metinlerinde ikinci kopya `aria-hidden="true"`.
- Menü açıkken arka plan `inert`, Esc ile kapanır, odak menü butonuna döner.
- Slider sayacı `aria-live="polite"`; oklar `aria-label` taşır.
- Klavye odağı her etkileşimli elemanda görünür (`:focus-visible` için 2 px kontur).
- Hero üstündeki metin ile görsel arasında yeterli kontrast için gradient katman korunur.
- Dekoratif görsellerde `alt=""`, içerik taşıyan görsellerde anlamlı açıklama.

---

## 15. Şablon gibi görünmemesi için kurallar

Bu tarz siteler kolayca birbirine benzer. Projeye özgü durması için:

- **Hareketi tek yerde harca.** Asıl gösteri hero girişi ve görsel açılışları. Her paragrafa, her karta ayrı "aşağıdan yükselerek gelme" efekti verme; paragraflar sabit kalsın.
- **Büyük harfli üst etiketleri her başlığın üstüne koyma.** Gerekiyorsa sadece hero'da ve normal yazımla kullan.
- **Başlıkta tek bir kelimeyi italik ya da farklı renk yapma.** Vurguyu tipografinin kendisi (boyut, satır kırılımı) taşısın.
- **Numaralandırmayı sadece gerçekten sıralı içerikte kullan** (galeri sırası, slider sayacı). Kartlara 01/02/03 yazma.
- **Butonlara ok işareti ekleme;** buton metni ne olacağını söylesin ("Konutları incele", "Bize yazın").
- **Paleti fotoğraflardan çıkar.** Hazır krem + kiremit ya da siyah + neon yeşil kombinasyonlarından uzak dur.
- **Her şeye aynı köşe yuvarlaklığını ve aynı gölgeyi verme.** Görseller köşeli, sadece butonlar yuvarlak.
- **Metinleri gerçek içerikle yaz.** "Lorem ipsum" ya da "Lüks yaşamın yeni tanımı" gibi her projeye uyan cümleler tasarımı da sıradanlaştırır.
- **Kod yorumları ve commit mesajları** proje diline ve ekibin alışkanlığına uygun, kısa ve işlevsel olsun.

---

## 16. Geliştirme sırası ve teslim kontrol listesi

### Aşamalar

1. **Altyapı:** Next.js kurulumu, fontlar, token'lar, grid, `lib/gsap.ts`, SmoothScroll.
2. **Kabuk:** Header (tema geçişi, gizlenme), Menü, Footer, RotateNotice, RollButton.
3. **Hareket bileşenleri:** SplitReveal, WordFill, MediaReveal (parallax dahil).
4. **Bölümler:** Hero, Statement, TextBlock, Collage, CrossfadeStack, HoverList, Slider, CardGrid, ExploreMore.
5. **Sayfalar:** Ana sayfa → Konutlar → Konut detay → Deneyimler → Galeri → İletişim.
6. **Geçişler:** TransitionProvider + TransitionLink, tüm iç linklerin buna geçirilmesi.
7. **CMS bağlantısı:** İçerik dosyalarının API sorgularıyla değiştirilmesi, `generateStaticParams`, ISR.
8. **Cila:** Performans ölçümü, erişilebilirlik testleri, cihaz testleri.

### Kontrol listesi

- [ ] Header her bölümde doğru logoya geçiyor, menü açıkken koyu kalıyor
- [ ] Aşağı kaydırınca header gizleniyor, yukarıda geri geliyor
- [ ] Menü açıkken sayfa kaymıyor, Esc ile kapanıyor
- [ ] Butonların kayan metni klavye odağında da çalışıyor
- [ ] Başlık satırları farklı ekran genişliklerinde doğru bölünüyor (font yüklendikten sonra)
- [ ] Görseller boş kutu olarak açılmıyor
- [ ] Parallax görsellerinde kenar boşluğu görünmüyor
- [ ] HoverList mobilde kaydırarak çalışıyor
- [ ] Slider dokunmatik kaydırmayla ilerliyor, sayaç doğru
- [ ] CrossfadeStack ekran dışındayken duruyor
- [ ] Sayfa geçişinden sonra scroll en üstte, ScrollTrigger'lar yeni sayfaya göre hesaplanıyor
- [ ] Geri/ileri tarayıcı butonları sorunsuz
- [ ] Telefon yatay tutulunca uyarı çıkıyor
- [ ] Hareket azaltma tercihi açıkken site eksiksiz okunuyor
- [ ] Lighthouse mobil hedefleri tutuyor
- [ ] Safari (iOS) ve Chrome (Android) üzerinde gerçek cihaz testi yapıldı
