'use client';

import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import { Picture } from '@/components/media/Picture';
import { AnimatedText } from '@/components/motion/AnimatedText';
import { Button } from '@/components/ui/Button';
import type { ResolvedImage } from '@/lib/images';
import { gsap, ScrollTrigger } from '@/lib/motion/register';
import s from './Listings5050.module.css';

export interface ListingItemData {
  title: string;
  media: ResolvedImage;
}

interface Props {
  eyebrow?: string;
  title: string;
  text: string;
  link?: { href: string; label: string };
  items: ListingItemData[];
}

/**
 * HOME-11 · Listings 5050 — Mākena `BlockListings5050` (canlı DOM + bundle).
 * Solda etiket + title-m + metin + madde listesi + buton; sağda maddelerin görselleri
 * üst üste (3:4). Aktif maddenin altında 2 px çizgi 6 s'de dolar, dolunca sıradaki
 * madde aktif olur ve görsel çapraz geçişle değişir.
 * Erişilebilirlik: madde seçmek otomatik ilerlemeyi durdurur (WCAG 2.2.2); imleç
 * ya da odak listedeyken sayaç durur; reduced motion'da ilerleme yok; bölüm görünür
 * alanda değilken durur; görünmeyen görseller aria-hidden.
 */
export function Listings5050({ eyebrow, title, text, link, items }: Props) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [stopped, setStopped] = useState(false);
  const hovered = useRef(false);
  const focused = useRef(false);
  const sync = useRef<() => void>(() => {});
  const count = items.length;
  const signature = items.map((i) => i.title).join('|');

  const paused = () => hovered.current || focused.current;
  const setHovered = (value: boolean) => {
    hovered.current = value;
    sync.current();
  };
  const setFocused = (value: boolean) => {
    focused.current = value;
    sync.current();
  };
  const select = (i: number) => {
    setStopped(true);
    setActive(i);
  };

  useGSAP(
    () => {
      const el = root.current;
      if (!el || count === 0) return;

      const lines = Array.from(el.querySelectorAll<HTMLElement>('.lst__underline'));
      gsap.set(lines, { scaleX: 0 });
      const line = lines[active];
      if (!line) return;

      if (stopped) {
        gsap.set(line, { scaleX: 1 });
        return;
      }

      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        let inView = false;
        const tl = gsap
          .timeline({ paused: true, onComplete: () => setActive((i) => (i + 1) % count) })
          .to(line, { scaleX: 1, duration: 6, ease: 'none' });

        const update = () => {
          if (inView && !paused()) tl.play();
          else tl.pause();
        };
        sync.current = update;

        const st = ScrollTrigger.create({
          trigger: el,
          onToggle: (self) => {
            inView = self.isActive;
            update();
          },
        });
        update();

        return () => {
          sync.current = () => {};
          tl.kill();
          st.kill();
        };
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(line, { scaleX: 1 });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [active, stopped, count, signature], revertOnUpdate: true },
  );

  return (
    <section ref={root} className={s.section}>
      <div className="site-max site-grid">
        <div className={s.left}>
          <div className={s.leftInner}>
            {eyebrow ? <p className={clsx('eyebrow', s.eyebrow)}>{eyebrow}</p> : null}
            <AnimatedText as="h2" className={clsx('title-m', s.title)}>
              <span className={s.line}>{title}</span>
            </AnimatedText>
            <AnimatedText each={0.05} amount="3rem" className={clsx('body-m', s.text)}>
              <p>{text}</p>
            </AnimatedText>

            <ul className={clsx('lst__list', s.list)}>
              {items.map((item, i) => (
                <li key={item.title} className={clsx('lst__item', s.item)}>
                  <button
                    type="button"
                    onClick={() => select(i)}
                    onPointerEnter={() => setHovered(true)}
                    onPointerLeave={() => setHovered(false)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    aria-pressed={i === active}
                    className={clsx('label-m', s.itemBtn)}
                  >
                    {item.title}
                  </button>
                  <span className="lst__underline" aria-hidden="true" />
                </li>
              ))}
            </ul>

            {link ? <Button href={link.href} label={link.label} className={s.btn} /> : null}
          </div>
        </div>

        <div className={s.right}>
          <div className={clsx('stack', s.stack)}>
            {items.map((item, i) => (
              <div
                key={item.title}
                aria-hidden={i !== active}
                className={clsx('lst__image media-fill', s.image, i === active && 'is-active')}
              >
                <Picture image={item.media} sizeKey="listingImage" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
