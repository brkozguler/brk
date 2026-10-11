'use client';

import clsx from 'clsx';
import { CarouselArrows, type NavLabels } from '@/components/carousel/CarouselNav';
import { useDragCarousel } from '@/components/carousel/useDragCarousel';
import { Picture } from '@/components/media/Picture';
import type { ResolvedImage } from '@/lib/images';
import s from './MediaSlider.module.css';

interface Props {
  images: ResolvedImage[];
  labels: NavLabels & { carousel: string; image: string };
  /** aria-label bağlamı (oda / restoran adı) */
  title: string;
}

/**
 * PROP-04 · Tam genişlik slider — Mākena `BlockMediaCarousel` (RE §17.5.1, canlı DOM 1440×900 / 375×812):
 *   blok overflow hidden, cursor grab · site-max py 4rem / s: 8rem ·
 *   track aspect 1,335 / s: 1,776 (1329 × 748,3 @1440), slide'lar %100 genişlik, sonsuz motor ·
 *   ok satırı label-s, gap 4rem, mt 3,2rem / s: 4,4rem: ‹ ayraç › + altyazı (mobilde gizli) +
 *   sağda eyebrow sayaç "1 | 3" (çizgi #777). Bölüm 982,5 px @1440.
 * Otomatik ilerleme yok; oklar uçta devre dışı kalmaz (sonsuz).
 */
export function MediaSlider({ images, labels, title }: Props) {
  const { root, track, nav, next, prev, trackId } = useDragCarousel('infinite');
  const count = images.length;
  const current = ((nav.index % count) + count) % count;
  const caption = images[current]?.alt;

  return (
    <section ref={root} className={s.block}>
      <div className={clsx('site-max', s.inner)}>
        <div
          ref={track}
          id={trackId}
          role="group"
          aria-roledescription="carousel"
          aria-label={`${title} — ${labels.carousel}`}
          className={clsx('drag-area', s.track)}
        >
          {images.map((image, i) => (
            <article key={image.entry.name + i} className={clsx('js-slide', s.slide)}>
              <div className={clsx('media-fill', s.media)}>
                <Picture image={image} sizeKey="lightbox" loading={i === 0 ? 'eager' : 'lazy'} />
              </div>
            </article>
          ))}
        </div>

        <div className={clsx('label-s', s.nav)}>
          <CarouselArrows nav={{ ...nav, atStart: false, atEnd: false }} onPrev={prev} onNext={next} labels={labels} controls={trackId} />
          <p className={s.caption}>{caption}</p>
          <div className={clsx('eyebrow', s.counter)} aria-hidden="true">
            {current + 1} <span className={s.bar}>|</span> {count}
          </div>
          <span className="sr-only" aria-live="polite">
            {labels.image} {current + 1} / {count}
          </span>
        </div>
      </div>
    </section>
  );
}
