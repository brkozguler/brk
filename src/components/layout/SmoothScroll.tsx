'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { ReactLenis, type LenisRef } from 'lenis/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Lenis'i GSAP ticker'ına bağlar; hareket azaltma tercihinde devre dışı kalır. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const ref = useRef<LenisRef>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const lenis = ref.current?.lenis;
    if (!lenis) return;
    const raf = (time: number) => lenis.raf(time * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.off('scroll', ScrollTrigger.update);
    };
  }, [reduced]);

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis root ref={ref} options={{ autoRaf: false, lerp: 0.09, wheelMultiplier: 0.9 }}>
      {children}
    </ReactLenis>
  );
}
