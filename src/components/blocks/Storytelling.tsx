'use client';

import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { useRef } from 'react';
import { Picture } from '@/components/media/Picture';
import { AnimatedText } from '@/components/motion/AnimatedText';
import type { ResolvedImage } from '@/lib/images';
import { gsap } from '@/lib/motion/register';
import s from './Storytelling.module.css';

interface Props {
  text: string;
  large: ResolvedImage;
  small: ResolvedImage;
}

/**
 * HOME-05 · Storytelling — RE §16 HOME-05. Sitenin en karakteristik yerleşimi:
 * grid l: -5,9rem sola taşar, sağ kolon -8rem alttan taşar, iki kolon alt kenardan hizalı.
 * Büyük görsel mobil 3:4 → ≥650 4:3; küçük görsel ≥1024 3:4.
 * Yalnızca küçük görsel hareket eder (y 7,5rem → 0, scrub); yolu layout'ta
 * rezerve edilir (mb 7,5rem) ki metnin üstüne binmesin.
 * Metin her kırılımda görünür (Mākena mobilde gizliyor — SEO ve okunabilirlik).
 */
export function Storytelling({ text, large, small }: Props) {
  const content = useRef<HTMLDivElement>(null);
  const media2 = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!content.current || !media2.current) return;
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const tween = gsap.fromTo(
          media2.current,
          { y: '7.5rem' },
          { y: '0rem', ease: 'none', scrollTrigger: { trigger: content.current, scrub: true } },
        );
        return () => tween.kill();
      });
      return () => mm.revert();
    },
    { scope: content },
  );

  return (
    <section className={s.section}>
      <div ref={content} className={clsx('site-max site-grid', s.grid)}>
        <div className={s.large}>
          <div className={clsx('media-fill', s.fill)}>
            <Picture image={large} sizeKey="storytellingLg" />
          </div>
        </div>

        <div className={s.aside}>
          <div className={s.small}>
            <div ref={media2} className={clsx('media-fill', s.fill)}>
              <Picture image={small} sizeKey="storytellingSm" />
            </div>
          </div>
          <AnimatedText each={0.05} amount="3rem" className={clsx('body-m', s.text)}>
            <p>{text}</p>
          </AnimatedText>
        </div>
      </div>
    </section>
  );
}
