'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import type { Locale } from '@/i18n/config';
import type { UiStrings } from '@/i18n/ui';
import type { NavGroup, PublishedMatrix } from '@/content/types';
import { TransitionLink } from '@/components/transition/TransitionLink';
import { RollButton } from '@/components/ui/RollButton';
import { Logo } from './Logo';
import { Menu } from './Menu';
import s from './Header.module.css';

interface Props {
  locale: Locale;
  ui: UiStrings;
  groups: NavGroup[];
  published: PublishedMatrix;
  homeHref: string;
  bookingHref: string | null;
  bookingExternal: boolean;
}

/**
 * Sabit, şeffaf header. Altındaki bölümün data-surface değerine göre açık/koyu
 * renge geçer; aşağı kaydırınca gizlenir, yukarı kaydırınca geri gelir.
 */
export function Header({
  locale,
  ui,
  groups,
  published,
  homeHref,
  bookingHref,
  bookingExternal,
}: Props) {
  const pathname = usePathname();
  const [tone, setTone] = useState<'light' | 'dark'>('light');
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuOpenRef = useRef(false);
  const menuBtn = useRef<HTMLButtonElement>(null);

  // Scroll dinleyicisi yeniden bağlanmadan güncel menü durumunu okusun
  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  // Header'ın hemen altındaki bölümün yüzeyini izle
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-surface]');
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const surface = (entry.target as HTMLElement).dataset.surface;
          setTone(surface === 'light' ? 'dark' : 'light');
        }
      },
      { rootMargin: '-40px 0px -95% 0px' },
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // Aşağı kaydırınca gizle, yukarı kaydırınca göster
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setHidden(y > 200 && y > last && !menuOpenRef.current);
        last = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuBtn.current?.focus();
  }, []);

  return (
    <>
      <header
        className={clsx(s.header, hidden && !menuOpen && s.hidden)}
        data-tone={menuOpen ? 'dark' : tone}
      >
        <button
          ref={menuBtn}
          type="button"
          className={s.menuBtn}
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
        >
          {menuOpen ? ui.close : ui.menu}
        </button>
        <TransitionLink href={homeHref} className={s.logo} aria-label={ui.homeLink}>
          <Logo />
        </TransitionLink>
        <div className={s.right}>
          {bookingHref && (
            <RollButton href={bookingHref} external={bookingExternal}>
              {ui.bookNow}
            </RollButton>
          )}
        </div>
      </header>
      <Menu
        id="site-menu"
        open={menuOpen}
        onClose={closeMenu}
        locale={locale}
        ui={ui}
        groups={groups}
        published={published}
      />
    </>
  );
}
