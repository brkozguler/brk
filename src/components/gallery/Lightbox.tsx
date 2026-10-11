'use client';

import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type SyntheticEvent } from 'react';
import { Picture } from '@/components/media/Picture';
import { ArrowIcon } from '@/components/ui/ArrowIcon';
import type { ResolvedImage } from '@/lib/images';
import { gsap } from '@/lib/motion/register';
import { isReducedMotion, scroll } from '@/lib/motion/runtime';
import s from './Lightbox.module.css';

export interface LightboxItem {
  media: ResolvedImage;
  caption?: string;
}

export interface LightboxLabels {
  carouselPrev: string;
  carouselNext: string;
  close: string;
  image: string;
  galleryViewer: string;
}

interface Props {
  items: LightboxItem[];
  /** Açık görselin sırası; null = kapalı */
  index: number | null;
  onNavigate: (index: number) => void;
  onClose: () => void;
  labels: LightboxLabels;
}

const FADE = 0.5;

/**
 * Lightbox — Mākena MediaModal (RE §17.6, canlı DOM 1440×900 / 375×812, 2026-10-11):
 *   siyah tam ekran · üst şerit site-max mt 4,3rem mb 3,8rem: iki beyaz 4rem ok (köşesiz) +
 *   "1 | 14" sayacı (eyebrow, beyaz, gap 2,8rem) · KAPAT eyebrow uline, top 5,4rem right 5rem ·
 *   görsel alanı inset 0, s: pt 12rem pb 8rem, site-max içinde object-contain ·
 *   başlık bottom 3rem, yPercent 100→0 · mobil: şerit altta (bottom 4rem, iki uçta),
 *   KAPAT top 4rem right 2rem, görsel max-h calc(100% − 20rem).
 *   Giriş opacity 0→1 .5 s power1, çıkış .5 s; görsel değişiminde eskisi .5 s solar.
 * Mākena kaydırınca kapatıyor ve kaydırmayı kilitlemiyor; biz <dialog> (odak tuzağı, Esc,
 * odak geri dönüşü) + kaydırma kilidi kullanıyoruz (CLAUDE.md). Oklar başa/sona sarar.
 */
export function Lightbox({ items, index, onNavigate, onClose, labels }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const caption = useRef<HTMLSpanElement>(null);
  const [leaving, setLeaving] = useState<number | null>(null);
  const open = index !== null;
  const count = items.length;

  const requestClose = useCallback(() => {
    const el = dialog.current;
    if (!el || !el.open) return;
    if (isReducedMotion()) {
      el.close();
      return;
    }
    gsap.to(el, { autoAlpha: 0, duration: FADE, ease: 'power1', onComplete: () => el.close() });
  }, []);

  const go = useCallback(
    (delta: number) => {
      if (index === null || count === 0) return;
      setLeaving(index);
      onNavigate((index + delta + count) % count);
    },
    [index, count, onNavigate],
  );

  // Açılış: showModal + kaydırma kilidi + fade; kapanış sinyali `close` olayından gelir
  useEffect(() => {
    const el = dialog.current;
    if (!el || !open || el.open) return;
    el.showModal();
    scroll.lock();
    el.focus();
    if (!isReducedMotion()) gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: FADE, ease: 'power1' });
  }, [open]);

  const onDialogClose = () => {
    scroll.unlock();
    gsap.set(dialog.current, { clearProps: 'opacity,visibility' });
    onClose();
  };

  const onCancel = (e: SyntheticEvent<HTMLDialogElement>) => {
    // Esc: tarayıcı kapatmadan önce solma
    e.preventDefault();
    requestClose();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    }
  };

  // Görsel değişimi: eski kare .5 s solar, yeni başlık alttan girer
  useGSAP(
    () => {
      if (index === null) return;
      const root = dialog.current;
      if (!root) return;
      const reduced = isReducedMotion();
      const old = root.querySelector<HTMLElement>('[data-leaving]');
      if (old) {
        if (reduced) setLeaving(null);
        else gsap.to(old, { autoAlpha: 0, duration: FADE, ease: 'power1', onComplete: () => setLeaving(null) });
      }
      if (caption.current && !reduced) {
        gsap.fromTo(caption.current, { yPercent: 100 }, { yPercent: 0, duration: FADE, ease: 'expo.out' });
      }
    },
    { dependencies: [index], scope: dialog },
  );

  const current = index !== null ? items[index] : null;
  const leavingItem = leaving !== null && leaving !== index ? items[leaving] : null;

  return (
    <dialog
      ref={dialog}
      className={s.dialog}
      aria-label={labels.galleryViewer}
      data-lenis-prevent=""
      onClose={onDialogClose}
      onCancel={onCancel}
      onKeyDown={onKeyDown}
      tabIndex={-1}
    >
      {current ? (
        <>
          <div className={clsx('site-max', s.strip)}>
            <div className={clsx('eyebrow', s.stripInner)}>
              <nav className={s.nav}>
                <button type="button" className={clsx('cbtn cbtn--prev cbtn--white', s.btn)} aria-label={labels.carouselPrev} onClick={() => go(-1)}>
                  <ArrowIcon direction="prev" />
                </button>
                <button type="button" className={clsx('cbtn cbtn--next cbtn--white', s.btn)} aria-label={labels.carouselNext} onClick={() => go(1)}>
                  <ArrowIcon direction="next" />
                </button>
              </nav>
              <div className={s.counter} aria-hidden="true">
                {index! + 1} | {count}
              </div>
              <span className="sr-only" aria-live="polite">
                {labels.image} {index! + 1} / {count}
              </span>
            </div>
          </div>

          <button type="button" className={clsx('eyebrow uline', s.close)} onClick={requestClose}>
            {labels.close}
          </button>

          <div className={s.stage}>
            <div className={clsx('site-max', s.stageInner)}>
              <div className={s.frame}>
                <div className={s.center}>
                  {leavingItem ? (
                    <figure key={`leaving-${leaving}`} data-leaving="" className={s.figure} aria-hidden="true">
                      <Picture image={leavingItem.media} sizeKey="lightbox" loading="eager" />
                    </figure>
                  ) : null}
                  <figure key={`current-${index}`} className={s.figure}>
                    <Picture image={current.media} sizeKey="lightbox" loading="eager" />
                  </figure>
                </div>
              </div>
            </div>
          </div>

          <span className={clsx('body-m', s.captionBox)} aria-hidden="true">
            <span ref={caption} className={s.caption}>
              {current.caption ?? ' '}
            </span>
          </span>
        </>
      ) : null}
    </dialog>
  );
}
