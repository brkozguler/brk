'use client';

import { useEffect } from 'react';
import { startRuntime } from '@/lib/motion/runtime';

/** Lenis + GSAP ticker + merkezi resize/tick servislerini başlatır. */
export function MotionRuntime() {
  useEffect(() => startRuntime(), []);
  return null;
}
