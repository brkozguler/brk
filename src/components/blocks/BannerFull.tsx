'use client';

import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { useRef } from 'react';
import { Picture } from '@/components/media/Picture';
import type { ResolvedImage } from '@/lib/images';
import { gsap } from '@/lib/motion/register';
import s from './BannerFull.module.css';

/**
 * HOME-08 · Banner Full — tam genişlik, 100svh, parallax yPercent -15 → 15
 * (scrub, tüm kırılımlar). Referans 100vh kullanıyor; mobil adres çubuğu için svh.
 */
export function BannerFull({ media }: { media: ResolvedImage }) {
  const el = useRef<HTMLDivElement>(null);
  const parallax = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!el.current || !parallax.current) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          parallax.current,
          { yPercent: -15 },
          { yPercent: 15, ease: 'none', scrollTrigger: { trigger: el.current, scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: el },
  );

  return (
    <div ref={el} className={s.banner}>
      <div ref={parallax} className={clsx('media-fill', s.parallax)}>
        <Picture image={media} sizeKey="bannerFull" />
      </div>
    </div>
  );
}
