import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

/**
 * GSAP kurulumu — Mākena bundle'ından birebir (RE §13.1).
 * Üç CustomEase + iki registerEffect sitenin tüm motion dilidir.
 *
 * Modül seviyesinde çağrılır: React'te çocuk effect'leri ebeveynden önce
 * koşar; kayıt bir bileşenin effect'ine bırakılırsa blokların `useGSAP`
 * gövdeleri plugin'ler kaydedilmeden çalışır.
 */
let registered = false;

export function registerGsap(): void {
  if (registered || typeof window === 'undefined') return;
  registered = true;

  gsap.registerPlugin(CustomEase, ScrollTrigger, SplitText);

  CustomEase.create(
    'snappy',
    'M0,0 C0.094,0.026 0.124,0.127 0.157,0.29 0.197,0.486 0.254,0.8 0.348,0.884 0.42,0.949 0.374,1 1,1',
  );
  CustomEase.create('expo-hard', 'M0,0 C0.084,0.61 0.156,0.822 0.218,0.883 0.287,0.951 0.374,1 1,1');
  CustomEase.create('unmask', 'M0,0 C0.16,1 0.3,1 1,1');

  gsap.registerEffect({
    name: 'textSplit',
    effect: (targets: gsap.TweenTarget, cfg: Record<string, unknown>) =>
      gsap.from(targets, {
        duration: cfg.duration as number,
        y: cfg.y as string,
        alpha: 0,
        stagger: cfg.stagger as number,
        delay: cfg.delay as number,
        ease: cfg.ease as string,
      }),
    defaults: { y: '4.5rem', duration: 1.5, stagger: 0.1, delay: 0, ease: 'unmask' },
    extendTimeline: true,
  });

  gsap.registerEffect({
    name: 'fade',
    effect: (targets: gsap.TweenTarget, cfg: Record<string, unknown>) =>
      gsap.from(targets, {
        duration: cfg.duration as number,
        alpha: 0,
        stagger: cfg.stagger as number,
        delay: cfg.delay as number,
        ease: cfg.ease as string,
      }),
    defaults: { duration: 1, stagger: 0.1, delay: 0, ease: 'power1' },
    extendTimeline: true,
  });

  // Lenis'i GSAP ticker'ı sürer; lagSmoothing açık kalırsa arka plandan dönüşte scrub zıplar
  gsap.ticker.lagSmoothing(0);
}

registerGsap();

export { gsap, ScrollTrigger, SplitText };
