'use client';

import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { useRef } from 'react';
import { Picture } from '@/components/media/Picture';
import { AnimatedText } from '@/components/motion/AnimatedText';
import { Button } from '@/components/ui/Button';
import type { ResolvedImage } from '@/lib/images';
import { gsap } from '@/lib/motion/register';
import s from './Feature5050.module.css';

interface Props {
  eyebrow?: string;
  title: string;
  text: string;
  link?: { href: string; label: string };
  media: ResolvedImage;
  left?: boolean;
  reverse?: boolean;
  background?: 'sand' | 'white';
}

/**
 * HOME-09 · Feature 5050 — RE §16 HOME-09. Tek bileşen, dört varyant (left × reverse).
 * section py 9/10/12rem · eyebrow mb 2,5rem · title-s pr 5% · gövde mt 3rem · buton mt 5rem.
 * Medya oranı görselin kendi boyutundan gelir (sabit oran bölüm yüksekliğini bozuyordu).
 * Parallax: medya y 3,5rem → -3,5rem, scrub, ≥650.
 */
export function Feature5050({
  eyebrow,
  title,
  text,
  link,
  media,
  left = true,
  reverse = false,
  background = 'white',
}: Props) {
  const root = useRef<HTMLElement>(null);
  const mediaCol = useRef<HTMLDivElement>(null);
  const mediaInner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!root.current || !mediaCol.current || !mediaInner.current) return;
      const mm = gsap.matchMedia();
      mm.add('(min-width: 650px) and (prefers-reduced-motion: no-preference)', () => {
        const tween = gsap.fromTo(
          mediaInner.current,
          { y: '3.5rem' },
          { y: '-3.5rem', ease: 'none', scrollTrigger: { trigger: mediaCol.current, scrub: true } },
        );
        return () => tween.kill();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className={clsx(s.section, background === 'sand' ? s.sand : s.white)}>
      <div className={clsx('site-max site-grid', s.grid)}>
        <div
          ref={mediaCol}
          className={clsx(s.media, left ? s.mediaLeft : s.mediaRight, reverse ? s.mediaFirst : s.mediaLast)}
        >
          <div
            ref={mediaInner}
            className={clsx('media-fill', s.mediaInner)}
            style={{ aspectRatio: `${media.entry.width} / ${media.entry.height}` }}
          >
            <Picture image={media} sizeKey="feature5050" />
          </div>
        </div>

        <div className={clsx(s.text, left ? s.textRight : s.textLeft, reverse ? s.textLast : s.textFirst)}>
          <div className={s.textInner}>
            {eyebrow ? <span className={clsx('eyebrow', s.eyebrow)}>{eyebrow}</span> : null}
            <AnimatedText as="h2" className={clsx('title-s', s.title)}>
              <span className={s.line}>{title}</span>
            </AnimatedText>
            <AnimatedText each={0.05} amount="3rem" className={clsx('body-m', s.body)}>
              <p>{text}</p>
            </AnimatedText>
            {link ? <Button href={link.href} label={link.label} className={s.btn} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
