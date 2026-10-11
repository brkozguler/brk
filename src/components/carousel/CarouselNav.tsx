'use client';

import clsx from 'clsx';
import type { RefObject } from 'react';
import { ArrowIcon } from '@/components/ui/ArrowIcon';
import type { CarouselNav } from './useDragCarousel';
import s from './CarouselNav.module.css';

export interface NavLabels {
  prev: string;
  next: string;
}

type BarRef = RefObject<HTMLDivElement | null>;
type Tone = 'brand' | 'ink';

/**
 * Carousel ok butonları + ilerleme çubuğu — Mākena'dan birebir (canlı DOM).
 *   CarouselNavRow      track'in altında: ‹ / › + 1 px çubuk (HOME-10, HOME-13)
 *   CarouselOverlayNav  görselin iki yanında beyaz kareler (HOME-12)
 *   CarouselProgress    yalnızca çubuk, altta ortalı (HOME-12)
 * Uçtaki buton `aria-disabled` (odak kaybolmasın); `aria-controls` → track id.
 */
export function CarouselNavRow({
  nav,
  bar,
  onPrev,
  onNext,
  labels,
  controls,
  tone = 'brand',
  className,
}: {
  nav: CarouselNav;
  bar: BarRef;
  onPrev: () => void;
  onNext: () => void;
  labels: NavLabels;
  controls?: string;
  tone?: Tone;
  className?: string;
}) {
  if (!nav.canScroll) return null;
  return (
    <div className={className}>
      <CarouselArrows nav={nav} onPrev={onPrev} onNext={onNext} labels={labels} controls={controls} />
      <ProgressBar bar={bar} tone={tone} />
    </div>
  );
}

export function CarouselArrows({
  nav,
  onPrev,
  onNext,
  labels,
  controls,
  className,
}: {
  nav: CarouselNav;
  onPrev: () => void;
  onNext: () => void;
  labels: NavLabels;
  controls?: string;
  className?: string;
}) {
  return (
    <div className={clsx(s.arrows, className)}>
      <ArrowButton direction="prev" label={labels.prev} disabled={nav.atStart} onClick={onPrev} controls={controls} />
      <Slash />
      <ArrowButton direction="next" label={labels.next} disabled={nav.atEnd} onClick={onNext} controls={controls} />
    </div>
  );
}

export function CarouselOverlayNav({
  nav,
  onPrev,
  onNext,
  labels,
  controls,
  aspectClassName,
}: {
  nav: CarouselNav;
  onPrev: () => void;
  onNext: () => void;
  labels: NavLabels;
  controls?: string;
  /** Görsel çerçevesiyle aynı oran sınıfı — düğmeler görselin ortasına otursun */
  aspectClassName: string;
}) {
  if (!nav.canScroll) return null;
  return (
    <div className={s.overlay}>
      <div className={aspectClassName} />
      <div className={s.overlayInner}>
        <ArrowButton tone="white" direction="prev" label={labels.prev} disabled={nav.atStart} onClick={onPrev} controls={controls} />
        <ArrowButton tone="white" direction="next" label={labels.next} disabled={nav.atEnd} onClick={onNext} controls={controls} />
      </div>
    </div>
  );
}

export function CarouselProgress({
  nav,
  bar,
  tone = 'ink',
  className,
}: {
  nav: CarouselNav;
  bar: BarRef;
  tone?: Tone;
  className?: string;
}) {
  if (!nav.canScroll) return null;
  return (
    <div className={className}>
      <ProgressBar bar={bar} tone={tone} className={s.progressAlone} />
    </div>
  );
}

function ProgressBar({ bar, tone, className }: { bar: BarRef; tone: Tone; className?: string }) {
  return (
    <div className={clsx('cprog', tone === 'ink' && 'cprog--ink', className)} aria-hidden="true">
      <div className="cprog__track" />
      <div ref={bar} className="cprog__bar" />
    </div>
  );
}

function ArrowButton({
  label,
  disabled,
  onClick,
  direction,
  controls,
  tone = 'subtle',
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  direction: 'prev' | 'next';
  controls?: string;
  tone?: 'subtle' | 'white';
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled || undefined}
      aria-label={label}
      aria-controls={controls}
      className={clsx('cbtn', direction === 'next' ? 'cbtn--next' : 'cbtn--prev', tone === 'white' && 'cbtn--white')}
    >
      <ArrowIcon direction={direction} />
    </button>
  );
}

/** Okların arasındaki eğik ayraç — 4×8, marka rengi %25 */
function Slash() {
  return (
    <svg width="4" height="8" viewBox="0 0 4 8" aria-hidden="true" className={s.slash}>
      <path d="M3 0h1L1 8H0z" fill="currentColor" />
    </svg>
  );
}
