import Lenis from 'lenis';
import { gsap, registerGsap, ScrollTrigger } from './register';

/**
 * Merkezi motion servisleri — Mākena'nın $event / $resize / $scroll katmanı (RE §04.2).
 * Hiçbir bileşen kendi requestAnimationFrame'ini veya resize dinleyicisini açmaz:
 * tek RAF döngüsü (GSAP ticker) ve tek resize dinleyicisi var, bileşenler abone olur.
 */

export interface ResizeState {
  ww: number;
  wh: number;
  /** < 650 px */
  small: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

/** ratio = delta / 16,67 — 120 Hz ekranlarda hız sabit kalır */
export interface TickPayload {
  ratio: number;
  time: number;
}

type ResizeHandler = (state: ResizeState) => void;
type TickHandler = (payload: TickPayload) => void;
type ScrollHandler = (y: number) => void;

const BP_S = 650;
const BP_L = 1024;

const resizeState: ResizeState = {
  ww: 0,
  wh: 0,
  small: false,
  isMobile: false,
  isTablet: false,
  isDesktop: true,
};

const resizeSubs = new Set<ResizeHandler>();
const tickSubs = new Set<TickHandler>();
const scrollSubs = new Set<ScrollHandler>();

let lenis: Lenis | null = null;
let started = false;

function readViewport(): void {
  resizeState.ww = window.innerWidth;
  resizeState.wh = window.innerHeight;
  resizeState.small = resizeState.ww < BP_S;
  resizeState.isMobile = resizeState.ww < BP_S;
  resizeState.isTablet = resizeState.ww >= BP_S && resizeState.ww < BP_L;
  resizeState.isDesktop = resizeState.ww >= BP_L;
}

let resizeRaf = 0;
function onResize(): void {
  if (resizeRaf) cancelAnimationFrame(resizeRaf);
  resizeRaf = requestAnimationFrame(() => {
    resizeRaf = 0;
    readViewport();
    lenis?.resize();
    ScrollTrigger.refresh();
    resizeSubs.forEach((fn) => fn(resizeState));
  });
}

export const resize = {
  get ww() {
    return resizeState.ww;
  },
  get wh() {
    return resizeState.wh;
  },
  get small() {
    return resizeState.small;
  },
  get state() {
    return resizeState;
  },
  add(fn: ResizeHandler) {
    resizeSubs.add(fn);
  },
  remove(fn: ResizeHandler) {
    resizeSubs.delete(fn);
  },
};

export const tick = {
  add(fn: TickHandler) {
    tickSubs.add(fn);
  },
  remove(fn: TickHandler) {
    tickSubs.delete(fn);
  },
};

export const scroll = {
  get lenis() {
    return lenis;
  },
  /** Programatik kaydırma (RE §12.5) */
  to(target: number | string | HTMLElement, opts?: Record<string, unknown>) {
    if (lenis) lenis.scrollTo(target, opts);
    else if (typeof target === 'number') window.scrollTo(0, target);
    else if (target instanceof HTMLElement) target.scrollIntoView();
  },
  /** Menü açıkken kaydırmayı durdur / sürdür */
  lock() {
    lenis?.stop();
    document.documentElement.classList.add('menu-open');
  },
  unlock() {
    lenis?.start();
    document.documentElement.classList.remove('menu-open');
  },
  add(fn: ScrollHandler) {
    scrollSubs.add(fn);
  },
  remove(fn: ScrollHandler) {
    scrollSubs.delete(fn);
  },
  get y() {
    return lenis?.scroll ?? window.scrollY;
  },
};

/**
 * Tembel okuma — cache'lenmiş bayrak değil: `useGSAP` (layout effect) runtime'ın
 * passive effect'inden önce koşar; bayrak orada atansa burada daima false okunurdu.
 */
let rmQuery: MediaQueryList | null = null;

export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  rmQuery ??= window.matchMedia('(prefers-reduced-motion: reduce)');
  return rmQuery.matches;
}

export function startRuntime(): () => void {
  if (started || typeof window === 'undefined') return () => {};
  started = true;

  registerGsap();
  readViewport();

  const reduced = isReducedMotion();

  // Lenis — RE §12.1 birebir; reduced motion'da hiç başlamaz (native scroll)
  if (!reduced) {
    lenis = new Lenis({ lerp: 0.15, wheelMultiplier: 1.25, autoResize: false });
    lenis.on('scroll', ScrollTrigger.update);
  }

  // QA kancası: Lenis varken window.scrollTo lerp'e takılır; ölçüm için anında kaydırma
  (window as Window & { arcanusScrollTo?: (y: number) => void }).arcanusScrollTo = (y) =>
    scroll.to(y, { immediate: true, force: true });

  const emitScroll = () => scrollSubs.forEach((fn) => fn(scroll.y));
  if (lenis) lenis.on('scroll', emitScroll);
  else window.addEventListener('scroll', emitScroll, { passive: true });

  // Tek RAF döngüsü: GSAP ticker
  const onTick = (time: number, deltaMs: number) => {
    lenis?.raf(time * 1000);
    tickSubs.forEach((fn) => fn({ ratio: deltaMs / (1000 / 60), time }));
  };
  gsap.ticker.add(onTick);

  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onResize, { passive: true });

  /**
   * Belge yüksekliği değişince ScrollTrigger'ı tazele: görseller decode olunca,
   * font swap olunca yükseklik büyür ve alttaki scrub animasyonları eksik oynar.
   * 200 ms debounce, yalnızca gerçekten değiştiyse.
   */
  let lastDocHeight = document.documentElement.scrollHeight;
  let refreshCall: gsap.core.Tween | null = null;
  const scheduleRefresh = () => {
    const h = document.documentElement.scrollHeight;
    if (h === lastDocHeight) return;
    lastDocHeight = h;
    refreshCall?.kill();
    refreshCall = gsap.delayedCall(0.2, () => ScrollTrigger.refresh());
  };
  const docObserver = new ResizeObserver(scheduleRefresh);
  docObserver.observe(document.documentElement);
  window.addEventListener('load', scheduleRefresh, { once: true });

  return () => {
    refreshCall?.kill();
    docObserver.disconnect();
    window.removeEventListener('load', scheduleRefresh);
    gsap.ticker.remove(onTick);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('orientationchange', onResize);
    if (!lenis) window.removeEventListener('scroll', emitScroll);
    lenis?.destroy();
    lenis = null;
    started = false;
  };
}
