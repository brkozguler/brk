'use client';

import clsx from 'clsx';
import { CarouselNavRow, CarouselOverlayNav, CarouselProgress, type NavLabels } from '@/components/carousel/CarouselNav';
import { useDragCarousel } from '@/components/carousel/useDragCarousel';
import { Picture } from '@/components/media/Picture';
import { AnimatedText } from '@/components/motion/AnimatedText';
import { TransitionLink } from '@/components/transition/TransitionLink';
import { Button } from '@/components/ui/Button';
import type { ResolvedImage } from '@/lib/images';
import s from './CardCarousel.module.css';

export interface CarouselCardData {
  title: string;
  href?: string;
  media: ResolvedImage;
}

interface Props {
  variant: 'clamped' | 'infinite';
  eyebrow?: string;
  title: string;
  text?: string;
  label?: string;
  cards: CarouselCardData[];
  labels: NavLabels & { carousel: string };
}

/**
 * HOME-10 / HOME-12 · Sürüklenebilir carousel — RE §16, §18; canlı DOM'dan doğrulandı.
 *
 * clamped (HOME-10): yalnızca görsel slide'lar (26,5rem / s: 50rem, mr 3,2 / l: 4rem),
 *   oranlar 4:3 · 10:13 dönüşümlü, başlangıç İKİNCİ kart, altında ok satırı + çubuk.
 * infinite (HOME-12): slide track'in tamamı, kart 16:9 (mobil 100/102,85), merkezde
 *   0,62 → 1,00; altında ortalı title-s + .btn; oklar görselin iki yanında beyaz kareler.
 * `overflow: clip` (hidden değil): odak kaydırması section'ı yatay kaydırmasın.
 */
export function CardCarousel({ variant, eyebrow, title, text, label, cards, labels }: Props) {
  const infinite = variant === 'infinite';
  const { root, track, bar, nav, next, prev, trackId } = useDragCarousel(variant, {
    startIndex: infinite ? 0 : 1,
  });
  const ariaLabel = `${title} — ${labels.carousel}`;

  if (infinite) {
    return (
      <section ref={root} className={s.infSection}>
        <div className="site-max site-grid">
          <div className={s.infHead}>
            <AnimatedText as="h2" className={clsx('title-l', s.infTitle)}>
              <span className={s.line}>{title}</span>
            </AnimatedText>
            {text ? (
              <AnimatedText each={0.05} amount="3rem" className={clsx('body-m', s.infText)}>
                <p>{text}</p>
              </AnimatedText>
            ) : null}
          </div>

          <div className={clsx('stack', s.infStack)}>
            <div
              ref={track}
              id={trackId}
              role="group"
              aria-roledescription="carousel"
              aria-label={ariaLabel}
              className={clsx('drag-area', s.infTrack)}
            >
              {cards.map((card) => (
                <WideCard key={card.title} card={card} label={label} />
              ))}
            </div>
            <CarouselOverlayNav
              nav={nav}
              onPrev={prev}
              onNext={next}
              labels={labels}
              controls={trackId}
              aspectClassName={s.wideAspect}
            />
          </div>

          <CarouselProgress nav={nav} bar={bar} tone="ink" className={s.infProgress} />
        </div>
      </section>
    );
  }

  return (
    <section ref={root} className={s.clSection}>
      <div className="site-max">
        <div className={s.clHead}>
          {eyebrow ? <p className={clsx('eyebrow', s.clEyebrow)}>{eyebrow}</p> : null}
          <AnimatedText as="h2" className={clsx('title-l', s.clTitle)}>
            <span className={s.line}>{title}</span>
          </AnimatedText>
          {text ? (
            <AnimatedText each={0.05} amount="3rem" className={clsx('body-m', s.clText)}>
              <p>{text}</p>
            </AnimatedText>
          ) : null}
        </div>
      </div>

      <div className={clsx('site-max site-grid', s.clGrid)}>
        <div className={s.clTrackCol}>
          <div
            ref={track}
            id={trackId}
            role="group"
            aria-roledescription="carousel"
            aria-label={ariaLabel}
            className={clsx('drag-area', s.clTrack)}
          >
            {cards.map((card) => (
              <div key={card.title} className={clsx('js-slide', s.clSlide)}>
                <div
                  className={clsx('media-fill', s.clMedia)}
                  style={{ aspectRatio: `${card.media.entry.width} / ${card.media.entry.height}` }}
                >
                  <Picture image={card.media} sizeKey="carouselCard" />
                </div>
              </div>
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
          className={s.clNav}
        />
      </div>
    </section>
  );
}

/** Deneyim kartı — slide track'in tamamı, görsel scale ile ayrışır */
function WideCard({ card, label }: { card: CarouselCardData; label?: string }) {
  const frame = (
    <div className={s.wideFrame}>
      <div className={clsx('js-scale media-fill', s.wideScale)}>
        <Picture image={card.media} sizeKey="carouselWide" />
      </div>
      <div className={s.wideAspect} />
    </div>
  );

  return (
    <article className={clsx('js-slide', s.wideSlide)}>
      {/* Görsel de hedefe götürür ama sekme sırasına ikinci durak eklemez; gerçek link alttaki buton */}
      {card.href ? (
        <TransitionLink href={card.href} className={s.wideLink} tabIndex={-1} aria-hidden="true" draggable={false} prefetch={false}>
          {frame}
        </TransitionLink>
      ) : (
        frame
      )}
      <div className={s.wideCaption}>
        <h3 className={clsx('title-s', s.wideTitle)}>{card.title}</h3>
        {label && card.href ? <Button href={card.href} label={label} srLabel={card.title} className={s.wideBtn} /> : null}
      </div>
    </article>
  );
}
