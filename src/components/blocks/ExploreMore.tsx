'use client';

import clsx from 'clsx';
import { CarouselNavRow, type NavLabels } from '@/components/carousel/CarouselNav';
import { useDragCarousel } from '@/components/carousel/useDragCarousel';
import { Picture } from '@/components/media/Picture';
import { AnimatedText } from '@/components/motion/AnimatedText';
import { TransitionLink } from '@/components/transition/TransitionLink';
import type { ResolvedImage } from '@/lib/images';
import s from './ExploreMore.module.css';

export interface ExploreLinkData {
  href: string;
  label: string;
  media: ResolvedImage;
}

interface Props {
  title: string;
  links: ExploreLinkData[];
  labels: NavLabels & { carousel: string };
}

/**
 * HOME-13 · Explore More — RE §16 HOME-13 (canlı DOM). Clamped drag carousel:
 * kare görsel + eyebrow etiket. Slide calc(100% - 5,4rem) / s: calc(50% - 1,2rem) /
 * l: calc(33,333% - 1,2rem); hover görsel 1,05. Altında ‹ / › + 1 px siyah çubuk.
 * Kartlar gerçek <a> (referansta data-url + window.open).
 */
export function ExploreMore({ title, links, labels }: Props) {
  const { root, track, bar, nav, next, prev, trackId } = useDragCarousel('clamped');

  return (
    <section ref={root} className={s.section}>
      <div className="site-max site-grid">
        <AnimatedText as="h2" className={clsx('title-l', s.title)}>
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
            {links.map((link) => (
              <article key={link.href} className={clsx('js-slide', s.slide)}>
                <TransitionLink href={link.href} className={clsx('group', s.link)} draggable={false} prefetch={false}>
                  <div className={clsx('hoverable media-fill', s.media)}>
                    <Picture image={link.media} sizeKey="exploreCard" />
                  </div>
                  <h3 className={clsx('eyebrow', s.label)}>{link.label}</h3>
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
