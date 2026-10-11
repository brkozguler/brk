'use client';

import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Locale } from '@/i18n/config';
import type { UiStrings } from '@/i18n/ui';
import type { NavGroup, PublishedMatrix } from '@/content/types';
import type { ResolvedImage } from '@/lib/images';
import { resize, scroll } from '@/lib/motion/runtime';
import { TransitionLink } from '@/components/transition/TransitionLink';
import { Button } from '@/components/ui/Button';
import { Logo } from './Logo';
import { Menu, type MenuContact } from './Menu';
import { MenuToggle } from './MenuToggle';
import s from './Header.module.css';

interface Props {
  locale: Locale;
  ui: UiStrings;
  groups: NavGroup[];
  published: PublishedMatrix;
  homeHref: string;
  ctaHref: string;
  ctaExternal: boolean;
  contact: MenuContact;
  menuFigure: ResolvedImage | null;
  /** Hero'suz sayfa: en tepede de koyu metin (Mākena is-black) */
  dark?: boolean;
}

interface HeaderState {
  scrolled: boolean;
  active: boolean;
  notSticky: boolean;
  fixed: boolean;
}

const INITIAL: HeaderState = { scrolled: false, active: true, notSticky: true, fixed: false };
const THROTTLE = 100;

/**
 * Header — Mākena scroll state machine (RE §09.3), 100 ms throttle:
 *   is-not-sticky  y < header yüksekliği → absolute, 14,3rem, beyaz logo, şeffaf
 *   is-fixed       y ≥ wh/1,5 → position fixed (hâlâ gizli)
 *   is-scrolled    y ≥ wh → beyaz zemin, kompakt 9,5rem, koyu metin
 *   is-active      yön: aşağı → gizle, yukarı → göster
 * Menü açıkken daima görünür ve açık renk (is-menu).
 */
export function Header({
  locale,
  ui,
  groups,
  published,
  homeHref,
  ctaHref,
  ctaExternal,
  contact,
  menuFigure,
  dark = false,
}: Props) {
  const pathname = usePathname();
  const [state, setState] = useState<HeaderState>(INITIAL);
  const [menuOpen, setMenuOpen] = useState(false);
  const stateRef = useRef<HeaderState>(INITIAL);
  const inner = useRef<HTMLDivElement>(null);
  const toggleBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let prevY = scroll.y;
    let last = 0;
    let pending: number | null = null;

    const compute = (y: number) => {
      const wh = resize.wh || window.innerHeight;
      const h = inner.current?.offsetHeight ?? 0;
      const cur = stateRef.current;
      const next: HeaderState = { ...cur };

      if (y >= wh && !next.scrolled) next.scrolled = true;
      if (y < wh && next.scrolled) next.scrolled = false;
      if (y >= h && next.notSticky) next.notSticky = false;
      if (y < h && !next.notSticky) next.notSticky = true;
      if (y > wh && y > prevY && next.active) next.active = false;
      if (prevY > y && !next.active) next.active = true;
      if (y >= wh / 1.5 && !next.fixed) next.fixed = true;
      if (y < wh / 1.5 && next.fixed) next.fixed = false;
      prevY = y;

      if (
        next.scrolled !== cur.scrolled ||
        next.active !== cur.active ||
        next.notSticky !== cur.notSticky ||
        next.fixed !== cur.fixed
      ) {
        stateRef.current = next;
        setState(next);
      }
    };

    // lodash.throttle(fn, 100) davranışı: öncü + artçı çağrı
    const onScroll = (y: number) => {
      const now = performance.now();
      const elapsed = now - last;
      if (elapsed >= THROTTLE) {
        last = now;
        compute(y);
      } else if (pending === null) {
        pending = window.setTimeout(() => {
          pending = null;
          last = performance.now();
          compute(scroll.y);
        }, THROTTLE - elapsed);
      }
    };

    // Rota değişiminde sıfırla; ilk hesap bir sonraki karede (effect gövdesinde setState yok)
    const raf = requestAnimationFrame(() => {
      stateRef.current = INITIAL;
      setState(INITIAL);
      compute(scroll.y);
    });
    scroll.add(onScroll);
    return () => {
      cancelAnimationFrame(raf);
      scroll.remove(onScroll);
      if (pending !== null) clearTimeout(pending);
    };
  }, [pathname]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    toggleBtn.current?.focus();
  }, []);

  return (
    <>
      <header
        className={clsx(
          s.sh,
          state.scrolled && s.isScrolled,
          state.active && s.isActive,
          state.notSticky && s.isNotSticky,
          state.fixed && s.isFixed,
          menuOpen && s.isMenu,
          dark && s.isBlack,
        )}
      >
        <div className={s.bg} />
        <div ref={inner} className={s.inner}>
          <div className={clsx('site-max', s.content)}>
            <MenuToggle
              ref={toggleBtn}
              open={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              labels={{ menu: ui.menu, close: ui.close, toggle: ui.menuToggle }}
            />
            <TransitionLink href={homeHref} className={s.logo} aria-label={ui.homeLink}>
              <Logo className={s.logoMark} />
            </TransitionLink>
            <Button href={ctaHref} label={ui.bookNow} external={ctaExternal} className={s.cta} />
          </div>
        </div>
      </header>
      <Menu
        open={menuOpen}
        onClose={closeMenu}
        locale={locale}
        ui={ui}
        groups={groups}
        published={published}
        contact={contact}
        figure={menuFigure}
      />
    </>
  );
}
