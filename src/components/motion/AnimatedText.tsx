'use client';

import { useGSAP } from '@gsap/react';
import { useRef, type ElementType, type ReactNode } from 'react';
import { gsap, SplitText } from '@/lib/motion/register';
import { isReducedMotion, resize } from '@/lib/motion/runtime';

interface Props {
  as?: ElementType;
  /** stagger — başlıklarda 0,1, gövde metinlerinde 0,05 (RE §13.5) */
  each?: number;
  type?: 'lines' | 'words' | 'chars';
  /** y mesafesi — başlıklarda 4,5rem, gövdede 3rem */
  amount?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Scroll reveal — Mākena `AniTextSplit` karşılığı:
 *   SplitText(:scope > *) · ScrollTrigger start "top 80%" (scrub yok, bir kez)
 *   gsap.from(lines, { y: amount, alpha: 0, duration: 1.5, stagger: each, ease: 'unmask' })
 * Reduced motion'da split yapılmaz, metin doğrudan görünür.
 */
export function AnimatedText({
  as: Tag = 'div',
  each = 0.1,
  type = 'lines',
  amount = '4.5rem',
  className,
  children,
}: Props) {
  const el = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = el.current;
      if (!root || isReducedMotion()) return;

      const scoped = root.querySelectorAll(':scope > *');
      const targets = scoped.length > 0 ? Array.from(scoped) : root;

      // aria 'none': varsayılan 'auto' <p>/<span>'e aria-label koyuyor (prohibited)
      const split = new SplitText(targets, { type, aria: 'none' });
      let played = false;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 80%' },
        onComplete: () => {
          played = true;
        },
      });
      // registerEffect ile eklenen metot
      (tl as gsap.core.Timeline & { textSplit: (t: Element[], v: object) => gsap.core.Timeline }).textSplit(
        split[type],
        { y: amount, stagger: each },
      );

      const onResize = () => {
        if (played) split.revert();
      };
      resize.add(onResize);

      return () => {
        resize.remove(onResize);
        tl.kill();
        split.revert();
      };
    },
    { scope: el },
  );

  return (
    <Tag ref={el} className={className}>
      {children}
    </Tag>
  );
}
