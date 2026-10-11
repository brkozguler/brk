'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { Lightbox, type LightboxItem, type LightboxLabels } from '@/components/gallery/Lightbox';
import { Picture } from '@/components/media/Picture';
import { TransitionLink } from '@/components/transition/TransitionLink';
import { ArrowIcon } from '@/components/ui/ArrowIcon';
import { SwapLabel } from '@/components/ui/SwapLabel';
import s from './GalleryCategory.module.css';

export interface GalleryNavLink {
  href: string;
  /** Hedef galerinin adı — yalnızca ekran okuyucuya */
  label: string;
}

export interface GalleryCategoryLabels extends LightboxLabels {
  /** Görünür "Önceki" / "Sonraki" */
  prev: string;
  next: string;
  galleryNav: string;
  previousGallery: string;
  nextGallery: string;
  loadMore: string;
}

interface Props {
  title: string;
  prev: GalleryNavLink;
  next: GalleryNavLink;
  images: LightboxItem[];
  labels: GalleryCategoryLabels;
}

/** Mobilde ilk gösterilen kare sayısı (4 satır × 2); gerisi "Daha fazla" ile açılır (Mākena: 8 + Load more) */
const MOBILE_INITIAL = 8;

/**
 * Galeri kategorisi — RE §17.6, canlı DOM 1440×900 / 375×812 (2026-10-11). Hero yok.
 *   section pt 16rem pb 7,3rem / s: pt 22rem pb 6,8rem · site-max site-grid
 *   başlık kutusu span 12, ortalı, pb 4rem / s: 7rem, altında 1 px marka çizgisi %30 ·
 *   h1 title-l (38,4 px @1440) · nav kutusu my 3rem / s: 4rem, iki uçta önceki/sonraki:
 *   4rem daire (.cbtn, köşe .3rem, zemin subtle, hover marka dolgusu 700 ms) + eyebrow 700 ·
 *   küçük görseller span 3 / s: span 4 / l: span 2, 4:3, mb .7rem / s: 1,8rem
 *   (1440'ta 6 × 208×156, satır adımı 173,2) · odakta 1,05 (200 ms), hover görsel 1,05.
 *   Mobil: 8 kare + "Daha fazla" .btn (16rem, mt 4rem, y 891,6 @375); ≥650 hepsi görünür.
 * Header bu sayfada is-black (routes.ts → headerDark).
 */
export function GalleryCategory({ title, prev, next, images, labels }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const collapsible = images.length > MOBILE_INITIAL && !expanded;

  return (
    <section className={s.section}>
      <div className="site-max site-grid">
        <div className={s.titleBox}>
          <h1 className={clsx('title-l', s.title)}>{title}</h1>
        </div>

        <div className={s.navBox}>
          <nav className={s.nav} aria-label={labels.galleryNav}>
            <TransitionLink href={prev.href} className={clsx(s.navLink, s.navPrev)}>
              <span className={clsx('cbtn cbtn--prev', s.circle)} aria-hidden="true">
                <ArrowIcon direction="prev" />
              </span>
              <span className={clsx('eyebrow', s.navLabel)} aria-hidden="true">
                {labels.prev}
              </span>
              <span className="sr-only">
                {labels.previousGallery}: {prev.label}
              </span>
            </TransitionLink>
            <TransitionLink href={next.href} className={clsx(s.navLink, s.navNext)}>
              <span className={clsx('eyebrow', s.navLabel)} aria-hidden="true">
                {labels.next}
              </span>
              <span className="sr-only">
                {labels.nextGallery}: {next.label}
              </span>
              <span className={clsx('cbtn cbtn--next', s.circle)} aria-hidden="true">
                <ArrowIcon direction="next" />
              </span>
            </TransitionLink>
          </nav>
        </div>

        {images.map((item, i) => (
          <button
            key={item.media.entry.name + i}
            type="button"
            className={clsx('hoverable', s.thumb, collapsible && i >= MOBILE_INITIAL && s.thumbCollapsed)}
            onClick={() => setActive(i)}
          >
            <figure className={clsx('media-fill', s.thumbMedia)}>
              <Picture image={item.media} sizeKey="galleryThumb" />
            </figure>
            <span className="sr-only">
              {labels.image} {i + 1} / {images.length}
            </span>
          </button>
        ))}

        {collapsible ? (
          <button type="button" className={clsx('btn eyebrow group', s.more)} onClick={() => setExpanded(true)}>
            <span className="btn__content">
              <SwapLabel label={labels.loadMore} innerClassName={s.moreInner} />
            </span>
          </button>
        ) : null}
      </div>

      <Lightbox items={images} index={active} onNavigate={setActive} onClose={() => setActive(null)} labels={labels} />
    </section>
  );
}
