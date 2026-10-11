'use client';

import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import type { Locale } from '@/i18n/config';
import type { UiStrings } from '@/i18n/ui';
import type { NavGroup, PublishedMatrix } from '@/content/types';
import type { ResolvedImage } from '@/lib/images';
import { gsap, SplitText } from '@/lib/motion/register';
import { isReducedMotion, scroll } from '@/lib/motion/runtime';
import { Picture } from '@/components/media/Picture';
import { TransitionLink } from '@/components/transition/TransitionLink';
import { LanguageSwitcher } from './LanguageSwitcher';
import s from './Menu.module.css';

export interface MenuContact {
  phone: string;
  phoneHref: string;
  email: string;
  addressLines: string[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  ui: UiStrings;
  groups: NavGroup[];
  published: PublishedMatrix;
  contact: MenuContact;
  figure: ResolvedImage | null;
}

/**
 * Tam ekran menü — Mākena `aside.menu` (RE §10.2–10.5).
 * Açılış: aside yukarıdan, iç maske aşağıdan (yPercent ∓100, 1,25 s expo.inOut);
 * görsel clip-path alttan açılır (@.25); başlık ve linkler yPercent 105'ten
 * kademeli girer (1,5 s, stagger .075, expo, @.5). Kapanış tersi.
 * Link hover: karakter karakter dikey takas (SplitText chars + --char-index).
 * Eklenenler (a11y): Esc, arka plan inert, odak yönetimi, dil seçici.
 */
export function Menu({ open, onClose, locale, ui, groups, published, contact, figure }: Props) {
  const root = useRef<HTMLElement>(null);
  const mask = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const splits = useRef<SplitText[]>([]);

  // Karakter bölme bir kez; --char-index CSS gecikmesini sürer
  useGSAP(
    () => {
      if (!root.current || isReducedMotion()) return;
      const targets = root.current.querySelectorAll<HTMLElement>('.js-menu-split');
      splits.current = Array.from(targets).map((el) => {
        const split = new SplitText(el, { type: 'chars', charsClass: 'char', aria: 'none' });
        split.chars.forEach((c, i) => (c as HTMLElement).style.setProperty('--char-index', String(i)));
        return split;
      });
      return () => {
        splits.current.forEach((sp) => sp.revert());
        splits.current = [];
      };
    },
    { scope: root },
  );

  useGSAP(
    () => {
      const el = root.current;
      const maskEl = mask.current;
      if (!el || !maskEl) return;

      tl.current?.kill();

      if (isReducedMotion()) {
        gsap.set(el, { visibility: open ? 'visible' : 'hidden' });
        return;
      }

      const clip = el.querySelector('.js-clip');
      const links = el.querySelectorAll('.js-link');

      if (open) {
        tl.current = gsap
          .timeline({ defaults: { duration: 1.25, ease: 'expo.inOut' } })
          .set(el, { visibility: 'visible' })
          .fromTo([el, maskEl], { yPercent: gsap.utils.wrap([-100, 100]) }, { yPercent: 0 }, 0)
          .fromTo(clip, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }, 0.25)
          .fromTo(links, { yPercent: 105 }, { yPercent: 0, stagger: 0.075, duration: 1.5, ease: 'expo' }, 0.5);
      } else {
        tl.current = gsap
          .timeline({
            defaults: { duration: 1.25, ease: 'expo.inOut' },
            onComplete: () => gsap.set(el, { visibility: 'hidden' }),
          })
          .to([el, maskEl], { yPercent: gsap.utils.wrap([-100, 100]) }, 0)
          .to(clip, { clipPath: 'inset(0 0 100% 0)', duration: 1 }, 0);
      }
    },
    { scope: root, dependencies: [open] },
  );

  // Kaydırma kilidi, inert, Esc, odak
  useEffect(() => {
    const background = ['main', 'site-footer', 'booking-bar']
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (open) {
      scroll.lock();
      background.forEach((el) => el.setAttribute('inert', ''));
      root.current?.querySelector<HTMLElement>('a, button')?.focus();
    } else {
      scroll.unlock();
      background.forEach((el) => el.removeAttribute('inert'));
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const [primary, ...secondary] = groups;

  return (
    <aside
      ref={root}
      id="site-menu"
      className={s.menu}
      role="dialog"
      aria-modal={open}
      aria-hidden={!open}
      aria-label={ui.menu}
      data-lenis-prevent=""
    >
      <div ref={mask} className={s.mask}>
        <div className={clsx('site-max site-grid', s.grid)}>
          <div className={s.cols}>
            {/* Mākena sırası: 1. satır menü1 + menü3 (order 2), 2. satır menü2 (order 3) */}
            {primary ? <MenuColumn group={primary} onClose={onClose} /> : null}
            {secondary.map((group, i) => (
              <MenuColumn key={group.title} group={group} onClose={onClose} order={i === 0 ? 2 : 3} />
            ))}
          </div>

          <figure className={clsx('js-clip media-fill', s.fig)}>
            {figure ? <Picture image={figure} sizeKey="menuFigure" /> : null}
          </figure>

          <div className={s.contact}>
            <div className={s.contactCol}>
              <div className={s.clip}>
                <h2 className={clsx('eyebrow js-link', s.colTitle)}>{ui.contact}</h2>
              </div>
              <ul className={clsx('body-m', s.contactList)}>
                <li className={s.clip}>
                  <a className={clsx('js-link', s.contactLink)} href={contact.phoneHref}>
                    {contact.phone}
                  </a>
                </li>
                <li className={s.clip}>
                  <a className={clsx('js-link', s.contactLink)} href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                </li>
              </ul>
            </div>
            <div className={s.contactCol}>
              <div className={s.clip}>
                <h2 className={clsx('eyebrow js-link', s.colTitle)}>{ui.address}</h2>
              </div>
              <address className={clsx('body-m', s.address)}>
                {contact.addressLines.map((line) => (
                  <span key={line} className={s.clip}>
                    <span className={clsx('js-link', s.addressLine)}>{line}</span>
                  </span>
                ))}
              </address>
            </div>
            <div className={s.contactCol}>
              <div className={s.clip}>
                <h2 className={clsx('eyebrow js-link', s.colTitle)}>{ui.language}</h2>
              </div>
              <div className={s.clip}>
                <div className="js-link">
                  <LanguageSwitcher locale={locale} published={published} label={ui.language} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/** Tüm menü linkleri body-m (14,4 px / 23,04) — canlı DOM'dan ölçüldü */
function MenuColumn({ group, onClose, order }: { group: NavGroup; onClose: () => void; order?: 2 | 3 }) {
  return (
    <nav className={clsx(s.col, order === 2 && s.order2, order === 3 && s.order3)} aria-label={group.title}>
      <div className={s.clip}>
        <h2 className={clsx('eyebrow js-link', s.colTitle)}>{group.title}</h2>
      </div>
      <ul className={s.list}>
        {group.links.map((link) => (
          <li key={link.href} className={s.item}>
            <TransitionLink
              href={link.href}
              className={clsx('js-link body-m', s.link)}
              onClick={onClose}
            >
              <span className={clsx('js-menu-split', s.lineTop)}>{link.label}</span>
              <span className={clsx('js-menu-split', s.lineBottom)} aria-hidden="true">
                {link.label}
              </span>
            </TransitionLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
