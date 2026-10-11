'use client';

import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { useRef } from 'react';
import { Picture } from '@/components/media/Picture';
import { AnimatedText } from '@/components/motion/AnimatedText';
import type { ResolvedImage } from '@/lib/images';
import { gsap } from '@/lib/motion/register';
import s from './BannerScale.module.css';

interface Props {
  eyebrow?: string;
  title?: string;
  text?: string;
  media: ResolvedImage;
}

/**
 * HOME-03 · Banner Scale — RE §16 HOME-03.
 * Görsel scroll'a bağlı 0,85 → 1,00 büyür: GSAP `--progress` değişkenini sürer,
 * transform'u CSS hesaplar (globals.css `.bscale__scale`). Yalnızca ≥1024 ve
 * reduced-motion kapalıyken; guard CSS'teki media query ile birebir aynı.
 * l: yükseklik 80svh · s: col 2 / span 10 · mobil ve tablet 16:9.
 */
export function BannerScale({ eyebrow, title, text, media }: Props) {
  const el = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!el.current) return;
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const tween = gsap.fromTo(
          el.current,
          { '--progress': 0 },
          {
            '--progress': 1,
            ease: 'none',
            scrollTrigger: { trigger: el.current, start: 'top bottom', end: 'top top', scrub: true },
          },
        );
        return () => tween.kill();
      });
      return () => mm.revert();
    },
    { scope: el },
  );

  const hasText = Boolean(eyebrow || title || text);

  return (
    <section>
      {hasText ? (
        <div className={clsx('site-max', s.textWrap)}>
          <div className="site-grid">
            <div className={s.textCol}>
              {eyebrow ? <p className={clsx('eyebrow', s.eyebrow)}>{eyebrow}</p> : null}
              {title ? (
                <AnimatedText as="h2" className={clsx('title-s', s.title)}>
                  <span className={s.line}>{title}</span>
                </AnimatedText>
              ) : null}
              {text ? (
                <AnimatedText each={0.05} amount="3rem" className={clsx('body-m', s.text)}>
                  <p>{text}</p>
                </AnimatedText>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div ref={el} className={clsx('site-max', s.wrap)}>
        <div className="site-grid">
          <div className={s.col}>
            <div className={s.frame}>
              <div className={clsx('bscale__scale media-fill', s.scale)}>
                <Picture image={media} sizeKey="bannerScale" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
