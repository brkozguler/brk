'use client';

import { useRef, type ReactNode } from 'react';
import clsx from 'clsx';
import { gsap, useGSAP } from '@/lib/gsap';
import { ease } from '@/lib/motion';
import { SplitReveal } from '@/components/motion/SplitReveal';
import s from './Hero.module.css';

interface Props {
  title: string;
  eyebrow?: string;
  /** Sunucuda çizilmiş <Picture> ya da <video>; yoksa düz koyu yüzey */
  media?: ReactNode;
  cueLabel: string;
}

/**
 * Tam ekran hero. Görsel ilk yüklemede ölçekten oturur; kaydırınca daha yavaş
 * kayar ve hafifçe kararır. Başlık satır satır maskeden yükselir.
 */
export function Hero({ title, eyebrow, media, cueLabel }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-hero-cue]', { autoAlpha: 0, duration: 1, delay: 1.3 });
        if (!media) return;

        gsap.from('[data-hero-media]', { scale: 1.15, duration: 2.4, ease: ease.out });
        gsap.to('[data-hero-media]', {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to('[data-hero-shade]', {
          opacity: 0.55,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={clsx(s.hero, !media && s.plain)} data-surface="dark">
      {media && (
        <div className={s.media} data-hero-media>
          {media}
        </div>
      )}
      {media && <div className={s.shade} data-hero-shade />}
      <div className={s.content}>
        {eyebrow && <p className={s.eyebrow}>{eyebrow}</p>}
        <SplitReveal as="h1" className={s.title} onLoad delay={0.4}>
          {title}
        </SplitReveal>
      </div>
      <div className={s.cue} data-hero-cue>
        <span>{cueLabel}</span>
        <i aria-hidden="true" />
      </div>
    </section>
  );
}
