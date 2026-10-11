import clsx from 'clsx';
import type { Locale } from '@/i18n/config';
import { breadcrumbKeys, pagePath, routes, type PageKey } from '@/i18n/routes';
import { getUi } from '@/i18n/ui';
import { TransitionLink } from '@/components/transition/TransitionLink';
import s from './Breadcrumb.module.css';

interface Props {
  locale: Locale;
  pageKey: PageKey;
  /** Hero'suz sayfa: akışa girmez, header'ın altındaki boşluğa oturur (bölüm ölçüleri değişmez) */
  overlay?: boolean;
}

/**
 * Görünür breadcrumb — kullanıcı kararı (2026-10-11): Akra Didim konaklama sayfasındaki gibi,
 * oluşturulan tüm iç sayfalarda. Akra: section py 20 px · 12 px / 300 / lh 140 % / .025em ·
 * %70 siyah, son öğe tam siyah · ✦ 8×8 ayraç, iki yanı 8 px · <1024 gizli.
 * Bizde: bizim yazı tipi ve ölçek (1,2rem), her boyutta görünür; BreadcrumbList JSON-LD ile aynı zincir.
 */
export function Breadcrumb({ locale, pageKey, overlay = false }: Props) {
  const keys = breadcrumbKeys(pageKey);
  const last = keys.length - 1;

  const nav = (
    <nav className={clsx(s.nav, overlay && s.navOverlay)} aria-label={getUi(locale).breadcrumb}>
      <ol className={clsx('site-max', s.list)}>
        {keys.map((key, i) => (
          <li key={key} className={s.item}>
            {i === last ? (
              <span className={s.current} aria-current="page">
                {routes[key].label[locale]}
              </span>
            ) : (
              <TransitionLink href={pagePath(locale, key)} className={s.link}>
                {routes[key].label[locale]}
              </TransitionLink>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );

  return overlay ? <div className={s.overlayHost}>{nav}</div> : nav;
}
