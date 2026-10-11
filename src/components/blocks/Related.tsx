'use client';

import clsx from 'clsx';
import { CarouselNavRow, type NavLabels } from '@/components/carousel/CarouselNav';
import { useDragCarousel } from '@/components/carousel/useDragCarousel';
import { Picture } from '@/components/media/Picture';
import { AnimatedText } from '@/components/motion/AnimatedText';
import { TransitionLink } from '@/components/transition/TransitionLink';
import type { ResolvedImage } from '@/lib/images';
import s from './Related.module.css';

export interface RelatedItemData {
  href: string;
  label: string;
  media: ResolvedImage;
}

interface Props {
  title: string;
  items: RelatedItemData[];
  labels: NavLabels & { carousel: string };
}

/**
 * PROP-05 · İlgili kartlar — Mākena kaeo `listings_related` (canlı DOM 1440×900 / 375×812, 2026-10-11):
 *   section pt 5,6rem pb 7rem / s: pt 8,8rem pb 8rem, beyaz zemin · h2 title-m ortalı col 2–10,
 *   mb 4rem / l: 5,2rem · track col 1–12, 4:3 kartlar calc((100% − 3,6rem) / 3) (431,5 @1440),
 *   mr 1,8rem; mobil calc(100% − 5,4rem), mr 2rem · etiket eyebrow mt 1,2rem ·
 *   ok satırı col 2–10 mt 6rem: ‹ ayraç › + 1 px çubuk (clamped). Bölüm 699,9 px @1440.
 * Mākena mobilde okları gizler; bizde kalır (WCAG 2.5.7).
 */
export function Related({ title, items, labels }: Props) {
  const { root, track, bar, nav, next, prev, trackId } = useDragCarousel('clamped');

  return (
    <section ref={root} className={s.section}>
      <div className="site-max site-grid">
        <AnimatedText as="h2" className={clsx('title-m', s.title)}>
          <span className={s.line}>{title}</span>
        </AnimatedText>

        <div className={s.trackCol}>
          <div
            ref={track}
            id={trackId}
            role="group"
            aria-roledescription="carousel"
            aria-label={`${title} — ${labels.carousel}`}
            className={clsx('drag-area', s.track)}
          >
            {items.map((item) => (
              <article key={item.href} className={clsx('js-slide', s.slide)}>
                <TransitionLink href={item.href} className={clsx('group', s.link)} draggable={false}>
                  <div className={clsx('hoverable media-fill', s.media)}>
                    <Picture image={item.media} sizeKey="relatedCard" />
                  </div>
                  <h3 className={clsx('eyebrow', s.label)}>{item.label}</h3>
                </TransitionLink>
              </article>
            ))}
          </div>
        </div>

        <CarouselNavRow
          nav={nav}
          bar={bar}
          onPrev={prev}
          onNext={next}
          labels={labels}
          controls={trackId}
          tone="ink"
          className={s.nav}
        />
      </div>
    </section>
  );
}
