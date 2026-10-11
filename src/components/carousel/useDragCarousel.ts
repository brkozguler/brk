'use client';

import { useGSAP } from '@gsap/react';
import { useCallback, useId, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/motion/register';
import { isReducedMotion, resize, tick, type TickPayload } from '@/lib/motion/runtime';

/**
 * Sürüklenebilir carousel motoru — Mākena'dan birebir (RE §18).
 *
 *   clamped   uçlarda durur, bırakınca en yakın slide'a snap eder
 *   infinite  sonsuz sarar, merkeze gelen kart 0,62 → 1,00 büyür
 *
 * Performans desenleri: `gsap.quickSetter` · 2 ondalık yuvarlama · `out` bayrağı ·
 * ScrollTrigger `onToggle` görünürlük guard'ı · hedefe oturunca tick kısa devre.
 *
 * Referanstan bilinçli sapmalar: `max` = içerik − track (ölçülen gerçek davranış),
 * Pointer Events + `touch-action: pan-y`, kartlar gerçek `<a>` ve klavye okları,
 * ok butonları her genişlikte (WCAG 2.5.7), eşik altı sürükleme konumu geri alınır.
 */

export type CarouselVariant = 'clamped' | 'infinite';

interface SlideState {
  el: HTMLElement;
  xSet: (value: number) => void;
  start: number;
  end: number;
  width: number;
  tl: gsap.core.Timeline | null;
  out: boolean;
}

const CLICK_THRESHOLD = 10;
const LERP = 0.1;
const SETTLE = 0.05;
const BP_S = 650;
const BP_L = 1024;

export interface CarouselNav {
  canScroll: boolean;
  atStart: boolean;
  atEnd: boolean;
  index: number;
}

export interface CarouselOptions {
  startIndex?: number;
}

export function useDragCarousel(variant: CarouselVariant, { startIndex = 0 }: CarouselOptions = {}) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const trackId = useId();

  const [nav, setNav] = useState<CarouselNav>({
    canScroll: true,
    atStart: variant === 'clamped' && startIndex === 0,
    atEnd: false,
    index: startIndex,
  });

  const api = useRef<{ next: () => void; prev: () => void }>({ next: () => {}, prev: () => {} });
  const next = useCallback(() => api.current.next(), []);
  const prev = useCallback(() => api.current.prev(), []);

  useGSAP(
    () => {
      const rootEl = root.current;
      const trackEl = track.current;
      if (!rootEl || !trackEl) return;

      let slides: SlideState[] = [];
      let snapPositions: number[] = [];
      let target = 0;
      let current = 0;
      let max = 0;
      let overflow = false;
      let multiplier = 2;
      let dragging = false;
      let captured = false;
      let isResizing = false;
      let dragOrigin = 0;
      let downX = 0;
      let moved = 0;
      let active = false;
      let index = 0;
      let marginRight = 0;
      let initialised = false;

      const nearestIndex = (value: number) => {
        const circular = variant === 'infinite' && max > 0;
        const v = circular ? gsap.utils.wrap(0, max, value) : value;
        const dist = (p: number) => {
          const d = Math.abs(p - v);
          return circular ? Math.min(d, max - d) : d;
        };
        return snapPositions.reduce(
          (best, p, i) => (dist(p) < dist(snapPositions[best] ?? 0) ? i : best),
          0,
        );
      };

      let barEl: HTMLElement | null = null;
      let barSet: ((v: number) => void) | null = null;

      const paintBar = () => {
        const el = bar.current;
        if (!el) return;
        if (el !== barEl) {
          barEl = el;
          barSet = gsap.quickSetter(el, 'scaleX') as (v: number) => void;
        }
        if (!barSet || max <= 0) return;
        const pos = variant === 'infinite' ? gsap.utils.wrap(0, max, current) : current;
        barSet(Math.round(gsap.utils.clamp(0, 1, pos / max) * 1000) / 1000);
      };

      const render = () => {
        if (variant === 'infinite') {
          for (const s of slides) {
            const x = overflow ? gsap.utils.wrap(-(max - s.end), s.end, current) : 0;
            const visible = x > s.start && x < s.end;
            const progress = s.tl ? gsap.utils.clamp(0, 1, (x - s.start) / (s.end - s.start)) : 0;
            if (visible || isResizing) {
              s.out = false;
              s.xSet(-x);
              s.tl?.progress(progress);
            } else if (!s.out) {
              s.out = true;
              s.xSet(-x);
              s.tl?.progress(progress);
            }
          }
          paintBar();
          return;
        }

        for (const s of slides) {
          const visible = current > s.start && current < s.end;
          if (visible || isResizing) {
            s.out = false;
            s.xSet(-current);
          } else if (!s.out) {
            s.out = true;
            s.xSet(-current);
          }
        }
        paintBar();
      };

      const clampTarget = () => {
        target = Math.max(0, Math.min(max, target));
      };

      const publishNav = () => {
        const canScroll = overflow;
        const atStart = variant === 'clamped' && target <= 0.5;
        const atEnd = variant === 'clamped' && target >= max - 0.5;
        setNav((prevNav) =>
          prevNav.canScroll === canScroll &&
          prevNav.atStart === atStart &&
          prevNav.atEnd === atEnd &&
          prevNav.index === index
            ? prevNav
            : { canScroll, atStart, atEnd, index },
        );
      };

      const measure = () => {
        isResizing = true;
        const els = Array.from(trackEl.querySelectorAll<HTMLElement>('.js-slide'));
        if (els.length === 0) {
          isResizing = false;
          return;
        }

        const ww = resize.ww || window.innerWidth;
        const small = ww < BP_S;
        const tablet = ww >= BP_S && ww < BP_L;
        multiplier = small ? 3.5 : 2;

        if (slides.length !== els.length) {
          for (const s of slides) s.tl?.kill();
          slides = els.map((el) => ({
            el,
            xSet: gsap.quickSetter(el, 'x', 'px') as (v: number) => void,
            start: 0,
            end: 0,
            width: 0,
            tl: null,
            out: true,
          }));
        } else {
          slides.forEach((s, i) => {
            const el = els[i];
            if (el && el !== s.el) {
              s.el = el;
              s.xSet = gsap.quickSetter(el, 'x', 'px') as (v: number) => void;
            }
          });
        }

        for (const s of slides) s.xSet(0);

        // Önce hepsini oku, sonra yaz — zorunlu reflow yok
        const containerLeft = trackEl.getBoundingClientRect().left;
        const trackWidth = trackEl.clientWidth;
        const prevMax = max;
        const ox = getComputedStyle(trackEl).overflowX;
        const clips = ox === 'clip' || ox === 'hidden' || ox === 'auto' || ox === 'scroll';
        const visLeft = clips ? containerLeft : 0;
        const visRight = clips ? containerLeft + trackWidth : ww;
        snapPositions = [];

        const rects = slides.map((s) => s.el.getBoundingClientRect());
        const lastEl = slides.at(-1)?.el;
        marginRight = lastEl ? parseFloat(getComputedStyle(lastEl).marginRight) || 0 : 0;

        const fromScale = tablet ? 0.72 : 0.62;
        const reduced = isReducedMotion();

        slides.forEach((s, i) => {
          const r = rects[i];
          if (!r) return;
          s.start = r.left - visRight;
          s.end = r.right - visLeft;
          s.width = r.width;
          snapPositions.push(r.left - containerLeft);

          s.tl?.kill();
          s.tl = null;

          if (variant === 'infinite' && !reduced) {
            const scaleEl = s.el.querySelector<HTMLElement>('.js-scale');
            if (scaleEl) {
              s.tl = gsap
                .timeline({ paused: true, defaults: { duration: 0.5, ease: 'none' } })
                .fromTo(scaleEl, { scale: fromScale }, { scale: 1 })
                .to(scaleEl, { scale: fromScale });
            }
          }
        });

        const lastRect = rects.at(-1);
        if (lastRect) {
          const contentWidth = lastRect.right + marginRight - containerLeft;
          overflow = contentWidth - trackWidth > 0.5;
          max = variant === 'infinite' ? contentWidth : Math.max(0, contentWidth - trackWidth);
        }

        if (!initialised) {
          initialised = true;
          const pos = snapPositions[startIndex];
          if (pos !== undefined && startIndex > 0) {
            target = pos;
            current = pos;
            index = startIndex;
          }
        } else if (!dragging) {
          // Yeniden ölçümde pikseli değil indeksi koru
          index = Math.min(index, Math.max(0, slides.length - 1));
          const pos = snapPositions[index] ?? 0;
          const turns = variant === 'infinite' && prevMax > 0 ? Math.floor(target / prevMax) : 0;
          target = turns * max + pos;
          current = target;
        }

        if (!overflow) {
          target = 0;
          current = 0;
          index = 0;
        }

        if (variant === 'clamped') {
          clampTarget();
          current = Math.max(0, Math.min(max, current));
        }

        render();
        publishNav();
        isResizing = false;
      };

      const snap = () => {
        if (snapPositions.length === 0 || max <= 0) return;
        if (variant === 'clamped') {
          clampTarget();
          target = gsap.utils.snap(snapPositions, target);
          clampTarget();
          return;
        }
        const wrapped = gsap.utils.wrap(0, max, target);
        target += gsap.utils.snap([...snapPositions, max], wrapped) - wrapped;
      };

      const step = (dir: 1 | -1) => {
        if (slides.length === 0 || !overflow) return;
        if (variant === 'clamped') {
          index = Math.max(0, Math.min(slides.length - 1, index + dir));
          const pos = snapPositions[index];
          if (pos !== undefined) target = pos;
          clampTarget();
          index = nearestIndex(target);
        } else {
          const w = slides[index]?.width ?? 0;
          target += dir * (w + marginRight);
          index = gsap.utils.wrap(0, slides.length, index + dir);
        }
        publishNav();
      };

      api.current = { next: () => step(1), prev: () => step(-1) };

      const onPointerDown = (e: PointerEvent) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        if (!overflow) return;
        dragging = true;
        captured = false;
        moved = 0;
        downX = e.clientX;
        dragOrigin = target + e.clientX * multiplier;
        trackEl.classList.add('is-dragging');
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!dragging) return;
        target = dragOrigin - e.clientX * multiplier;
        moved = Math.abs(e.clientX - downX);
        // Eşik aşılınca yakala (pointerdown'da yakalamak kart linklerinin tıklanmasını bozuyor)
        if (moved >= CLICK_THRESHOLD && !captured) {
          try {
            trackEl.setPointerCapture(e.pointerId);
            captured = true;
          } catch {
            // yakalama desteklenmiyorsa sürükleme track dışına çıkınca kesilir
          }
        }
      };

      const onPointerUp = () => {
        if (!dragging) return;
        dragging = false;
        captured = false;
        trackEl.classList.remove('is-dragging');
        if (moved < CLICK_THRESHOLD) {
          target = dragOrigin - downX * multiplier;
          return;
        }
        snap();
        index = nearestIndex(target);
        publishNav();
      };

      const onClickCapture = (e: MouseEvent) => {
        if (moved >= CLICK_THRESHOLD && e.detail > 0) {
          e.preventDefault();
          e.stopPropagation();
        }
        moved = 0;
      };

      const onFocusIn = (e: FocusEvent) => {
        const slide = (e.target as HTMLElement | null)?.closest('.js-slide');
        if (!slide || !overflow) return;
        const i = slides.findIndex((s) => s.el === slide);
        const pos = snapPositions[i];
        if (pos === undefined) return;
        if (variant === 'infinite') {
          target += pos - gsap.utils.wrap(0, max, target);
          index = i;
        } else {
          target = pos;
          clampTarget();
          index = nearestIndex(target);
        }
        publishNav();
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          step(1);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          step(-1);
        }
      };

      const onTick = ({ ratio }: TickPayload) => {
        if (!active) return;
        const diff = target - current;
        if (Math.abs(diff) < SETTLE) {
          if (current !== target) {
            current = target;
            render();
          }
          return;
        }
        const amount = isReducedMotion() ? 1 : Math.min(1, LERP * ratio);
        current += diff * amount;
        current = Math.round(current * 100) / 100;
        render();
      };

      measure();

      // Track'in kendi genişliğini izle (lazy yerleşim, scrollbar, font swap)
      const ro = new ResizeObserver(() => measure());
      ro.observe(trackEl);

      const st = ScrollTrigger.create({
        trigger: rootEl,
        onToggle: (self) => {
          active = self.isActive;
        },
      });

      trackEl.addEventListener('pointerdown', onPointerDown);
      trackEl.addEventListener('pointermove', onPointerMove, { passive: true });
      trackEl.addEventListener('click', onClickCapture, true);
      trackEl.addEventListener('focusin', onFocusIn);
      trackEl.addEventListener('keydown', onKeyDown);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
      tick.add(onTick);

      return () => {
        tick.remove(onTick);
        ro.disconnect();
        st.kill();
        trackEl.removeEventListener('pointerdown', onPointerDown);
        trackEl.removeEventListener('pointermove', onPointerMove);
        trackEl.removeEventListener('click', onClickCapture, true);
        trackEl.removeEventListener('focusin', onFocusIn);
        trackEl.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
        for (const s of slides) s.tl?.kill();
        slides = [];
      };
    },
    { scope: root, dependencies: [variant, startIndex], revertOnUpdate: true },
  );

  return { root, track, bar, nav, next, prev, trackId };
}
