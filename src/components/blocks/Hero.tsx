'use client';

import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { useRef } from 'react';
import { Picture } from '@/components/media/Picture';
import type { ResolvedImage } from '@/lib/images';
import { gsap, SplitText } from '@/lib/motion/register';
import { resize, scroll } from '@/lib/motion/runtime';
import s from './Hero.module.css';

interface Props {
  eyebrow?: string;
  titleLines: string[];
  subtitle?: string;
  media: ResolvedImage;
  slim?: boolean;
  scrollLabel: string;
}

/**
 * HOME-01 · Hero — RE §16 HOME-01 birebir.
 *   section 100svh (slim 55rem) · H1 display max-w 90% / 50rem / 73rem ·
 *   eyebrow mb 3,2rem · alt metin mt 2,4rem / l: 4,2rem · scroll çizgisi 2×72/80 px
 * Giriş: görsel 1,25→1 (3 s, power3) · satırlar y 3,5rem→0 (1,5 s, stagger .1, unmask)
 * Scroll: medya yPercent 0→25, scrub, top top → bottom top (tüm kırılımlar)
 */
export function Hero({ eyebrow, titleLines, subtitle, media, slim = false, scrollLabel }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const parallax = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rootEl = root.current;
      const parallaxEl = parallax.current;
      const contentEl = content.current;
      if (!rootEl || !parallaxEl || !contentEl) return;

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          parallaxEl,
          { yPercent: 0 },
          {
            yPercent: 25,
            ease: 'none',
            scrollTrigger: { trigger: parallaxEl, start: 'top top', end: 'bottom top', scrub: true },
          },
        );

        const scaleTarget = rootEl.querySelector<HTMLElement>('.js-i-scale');
        const words = contentEl.querySelectorAll('.js-i-words');
        const split = new SplitText(Array.from(words), { type: 'lines', aria: 'none' });

        const tl = gsap.timeline({ defaults: { ease: 'unmask' } });
        if (scaleTarget) {
          tl.fromTo(scaleTarget, { scale: 1.25 }, { scale: 1, duration: 3, ease: 'power3' }, 0);
        }
        tl.fromTo(split.lines, { y: '3.5rem', alpha: 0 }, { y: 0, alpha: 1, duration: 1.5, stagger: 0.1 }, 0.15);

        const onResize = () => split.revert();
        resize.add(onResize);
        return () => {
          resize.remove(onResize);
          split.revert();
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={clsx(s.hero, slim && s.slim)}>
      <div ref={parallax} className={clsx('media-fill', s.parallax)}>
        <Picture image={media} sizeKey="hero" priority imgClassName="js-i-scale hero-i-scale" />
        {/* Fotoğraf üstü beyaz metin için kontrast katmanı (RE §28.5) */}
        <div aria-hidden="true" className={s.shade} />
      </div>

      {/* Alt metinsiz hero'da Mākena boş <p>'nin üst boşluğunu koruyor (başlık 20 px yukarıda); aynı boşluk padding ile */}
      <div ref={content} className={clsx('site-max', s.content, !subtitle && s.noSubtitle)}>
        {eyebrow ? <p className={clsx('eyebrow js-i-words', s.eyebrow)}>{eyebrow}</p> : null}
        <h1 className={clsx('display js-i-words', s.title)}>
          {titleLines.map((line) => (
            <span key={line} className={s.line}>
              {line}
            </span>
          ))}
        </h1>
        {subtitle ? <p className={clsx('body-m js-i-words', s.subtitle)}>{subtitle}</p> : null}
      </div>

      <div className={s.cue}>
        <div className={clsx('site-max', s.cueInner)}>
          <button
            type="button"
            className={s.cueBtn}
            onClick={() => scroll.to(root.current?.offsetHeight ?? resize.wh)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 2 80" className={s.cueSvg} aria-hidden="true">
              <path fill="#000" fillOpacity=".2" d="M2 0v80H0V0z" />
              <path fill="currentColor" d="M2 0v27H0V0z" className="hero-scroll-line" />
            </svg>
            <span className="sr-only">{scrollLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
