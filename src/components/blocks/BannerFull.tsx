'use client';

import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { useRef } from 'react';
import { Picture } from '@/components/media/Picture';
import type { ResolvedImage } from '@/lib/images';
import { gsap } from '@/lib/motion/register';
import s from './BannerFull.module.css';

export interface BannerWordItem {
  text: string;
  media: ResolvedImage;
}

/**
 * HOME-08 · Banner Full — tam genişlik, 100svh, parallax yPercent -15 → 15
 * (scrub, tüm kırılımlar). Referans 100vh kullanıyor; mobil adres çubuğu için svh.
 *
 * `lines` verilirse görselin üstüne Ethno Belek ana sayfasındaki kelime şeridi
 * (.section-line) bindirilir: kelime + küçük görsel çiftleri, iki satır; masaüstünde
 * ikinci satır 200 px sola kaymış, hover'da satırlar yer değiştirir. Ölçüler CSS'te.
 * Kelimeler sırayla düz (300) / italik (400); mobilde görsel solda/sağda zikzak.
 */
export function BannerFull({ media, lines }: { media: ResolvedImage; lines?: BannerWordItem[][] }) {
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

  const rows = lines?.filter((row) => row.length > 0) ?? [];
  let order = 0;

  return (
    <div ref={el} className={clsx(s.banner, rows.length > 0 && s.withLines)}>
      <div ref={parallax} className={clsx('media-fill', s.parallax)}>
        <Picture image={media} sizeKey="bannerFull" />
      </div>
      {rows.length > 0 ? (
        <div className={s.lines}>
          <div className={s.container}>
            {rows.map((row, r) => (
              <ul key={r} className={s.row}>
                {row.map((word) => {
                  const i = order++;
                  return (
                    <li key={word.text} className={clsx(s.item, i % 2 === 0 && s.imageFirst)}>
                      <span className={clsx(s.word, i % 2 === 1 && s.italic)}>{word.text}</span>
                      <span className={clsx('media-fill', s.media)}>
                        <Picture image={word.media} sizeKey="bannerWord" />
                      </span>
                    </li>
                  );
                })}
              </ul>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
