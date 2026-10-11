'use client';

import { useEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';
import type { Locale } from '@/i18n/config';
import type { UiStrings } from '@/i18n/ui';
import type { NavGroup, PublishedMatrix } from '@/content/types';
import { gsap, useGSAP } from '@/lib/gsap';
import { ease } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { TransitionLink } from '@/components/transition/TransitionLink';
import { LanguageSwitcher } from './LanguageSwitcher';
import s from './Menu.module.css';

interface Props {
  id: string;
  open: boolean;
  onClose: () => void;
  locale: Locale;
  ui: UiStrings;
  groups: NavGroup[];
  published: PublishedMatrix;
}

/** Tam ekran menü: aşağıdan perde gibi açılır, linkler maskeden yükselir. */
export function Menu({ id, open, onClose, locale, ui, groups, published }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const lenis = useLenis();
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(root.current, { visibility: 'visible' })
        .fromTo(
          root.current,
          { clipPath: 'inset(100% 0 0 0)' },
          { clipPath: 'inset(0% 0 0 0)', duration: 1, ease: ease.inOut },
        )
        .from(
          '[data-menu-link]',
          { yPercent: 110, duration: 1, stagger: 0.05, ease: ease.out },
          '-=0.45',
        );
    },
    { scope: root },
  );

  useGSAP(
    () => {
      const timeline = tl.current;
      if (!timeline || !root.current) return;
      if (reduced) {
        timeline.pause(0);
        gsap.set(root.current, { visibility: open ? 'visible' : 'hidden', clipPath: 'none' });
        gsap.set('[data-menu-link]', { yPercent: 0 });
        return;
      }
      if (open) timeline.play();
      else timeline.reverse();
    },
    { scope: root, dependencies: [open, reduced] },
  );

  // Kaydırma kilidi, arka planı inert yapma, Esc ve odak
  useEffect(() => {
    const background = ['main', 'site-footer', 'booking-bar']
      .map((domId) => document.getElementById(domId))
      .filter((el): el is HTMLElement => el !== null);

    if (open) {
      lenis?.stop();
      document.documentElement.classList.add('menu-open');
      background.forEach((el) => el.setAttribute('inert', ''));
      root.current?.querySelector<HTMLElement>('a, button')?.focus();
    } else {
      lenis?.start();
      document.documentElement.classList.remove('menu-open');
      background.forEach((el) => el.removeAttribute('inert'));
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, lenis, onClose]);

  return (
    <div
      ref={root}
      id={id}
      className={s.menu}
      data-surface="light"
      role="dialog"
      aria-modal={open}
      aria-hidden={!open}
      aria-label={ui.menu}
    >
      <div className={s.inner}>
        {groups.map((group) => (
          <nav key={group.title} className={s.group} aria-label={group.title}>
            <p className={s.groupTitle}>{group.title}</p>
            <ul>
              {group.links.map((link) => (
                <li key={link.href} className={s.mask}>
                  <TransitionLink
                    href={link.href}
                    data-menu-link=""
                    className={s.link}
                    onClick={onClose}
                  >
                    {link.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div className={s.aside}>
          <LanguageSwitcher locale={locale} published={published} label={ui.language} />
        </div>
      </div>
    </div>
  );
}
