'use client';

import { useRef, type ElementType, type ReactNode } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { dur, ease, stagger, trigger } from '@/lib/motion';

interface Props {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  /** true: sayfa açılışında; false: görünüme girince */
  onLoad?: boolean;
}

/**
 * Başlık satırlarını böler, her satır kendi maskesinden yukarı çıkar.
 * HTML'de metin tam olarak bulunur (SEO); yalnızca görünürlük JS ile açılır.
 */
export function SplitReveal({
  as: Tag = 'h2',
  children,
  className,
  delay = 0,
  onLoad = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(el, { visibility: 'visible' });
        return;
      }

      const split = SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: dur.slow,
            ease: ease.out,
            stagger: stagger.lines,
            delay,
            scrollTrigger: onLoad ? undefined : { trigger: el, start: trigger.start, once: true },
          }),
      });
      gsap.set(el, { visibility: 'visible' });

      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} data-split-pending="">
      {children}
    </Tag>
  );
}
