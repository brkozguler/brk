'use client';

import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { useRef } from 'react';
import type { Locale } from '@/i18n/config';
import type { UiStrings } from '@/i18n/ui';
import type { NavGroup, NavLink, PublishedMatrix } from '@/content/types';
import { gsap } from '@/lib/motion/register';
import { scroll } from '@/lib/motion/runtime';
import { TransitionLink } from '@/components/transition/TransitionLink';
import { CopyButton } from './CopyButton';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';
import s from './Footer.module.css';

interface Props {
  locale: Locale;
  ui: UiStrings;
  groups: NavGroup[];
  legal: NavLink[];
  published: PublishedMatrix;
  siteName: string;
  phone: string;
  phoneHref: string;
  email: string;
  social: { name: string; url: string }[];
}

/**
 * Footer — Mākena `footer.sf` (RE §11): lacivert zemin, logo (üstte, sayfa başına
 * kaydırır), üç menü kolonu, iletişim bloğu (kopyala düğmeli), alt satır.
 * Parallax: iç kapsayıcı yPercent −37,5 → 0, top bottom → bottom bottom, ≥650.
 */
export function Footer({ locale, ui, groups, legal, published, siteName, phone, phoneHref, email, social }: Props) {
  const el = useRef<HTMLElement>(null);
  const parallax = useRef<HTMLDivElement>(null);
  const year = new Date().getFullYear();

  useGSAP(
    () => {
      if (!el.current || !parallax.current) return;
      const mm = gsap.matchMedia();
      mm.add('(min-width: 650px) and (prefers-reduced-motion: no-preference)', () => {
        const tween = gsap.fromTo(
          parallax.current,
          { yPercent: -37.5 },
          {
            yPercent: 0,
            ease: 'none',
            scrollTrigger: { trigger: el.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
          },
        );
        return () => tween.kill();
      });
      return () => mm.revert();
    },
    { scope: el },
  );

  return (
    <footer ref={el} id="site-footer" className={s.sf}>
      <div ref={parallax} className={s.parallax}>
        <div className="site-max site-grid">
          <div className={s.logoCol}>
            {/* Erişilebilir ad: görünür logo metni + sr-only "Sayfanın başına dön" (WCAG 2.5.3) */}
            <button type="button" className={s.logoBtn} onClick={() => scroll.to(0)}>
              <Logo className={s.logo} />
              <span className="sr-only"> – {ui.backToTop}</span>
            </button>
          </div>

          <div className={s.menus}>
            {groups.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                {/* h2: hero'suz ve 404 sayfalarında h1 → h3 atlaması olmasın */}
                <h2 className={clsx('eyebrow', s.menuTitle)}>{group.title}</h2>
                <ul className={s.menuList}>
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <TransitionLink href={link.href} className={clsx('uline label-s', s.menuLink)}>
                        {link.label}
                      </TransitionLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className={s.contact}>
            <h2 className={clsx('eyebrow', s.menuTitle, s.contactTitle)}>{ui.contact}</h2>
            <ul className={clsx('label-m', s.contactList)}>
              <li className={s.contactItem}>
                <span>T:</span>
                <a className="uline" href={phoneHref}>
                  {phone}
                </a>
                <CopyButton value={phone} label={ui.copyPhone} copied={ui.copied} />
              </li>
              <li className={s.contactItem}>
                <span>E:</span>
                <a className="uline" href={`mailto:${email}`}>
                  {email}
                </a>
                <CopyButton value={email} label={ui.copyEmail} copied={ui.copied} />
              </li>
              {social.map((item) => (
                <li key={item.url} className={s.contactItem}>
                  <a className="uline" href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={s.bottom}>
            <div className={s.bottomRight}>
              <LanguageSwitcher locale={locale} published={published} label={ui.language} />
            </div>
            <div className={s.bottomLeft}>
              <p className={s.copyright}>
                © {year} {siteName}. {ui.allRightsReserved}
              </p>
              {legal.map((link) => (
                <TransitionLink key={link.href} href={link.href} className={s.terms}>
                  {link.label}
                </TransitionLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
