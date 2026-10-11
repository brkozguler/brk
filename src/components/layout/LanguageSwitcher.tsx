'use client';

import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { localeNames, locales, type Locale } from '@/i18n/config';
import { pagePath, resolvePath, type PageKey } from '@/i18n/routes';
import type { PublishedMatrix } from '@/content/types';
import s from './LanguageSwitcher.module.css';

interface Props {
  locale: Locale;
  published: PublishedMatrix;
  label: string;
}

/**
 * Dil seçici: aynı sayfanın diğer dildeki karşılığına götürür; karşılığı yoksa
 * o dilin ana sayfasına. Bayrak değil dilin kendi adı yazılır.
 */
export function LanguageSwitcher({ locale, published, label }: Props) {
  const pathname = usePathname();
  const key: PageKey = resolvePath(pathname)?.key ?? 'home';

  return (
    <nav className={s.switcher} aria-label={label}>
      <ul className={s.list}>
        {locales.map((target) => {
          const pageKey = published[key]?.includes(target) ? key : 'home';
          const active = target === locale;
          return (
            <li key={target}>
              <a
                href={pagePath(target, pageKey)}
                lang={target}
                hrefLang={target}
                aria-current={active ? 'true' : undefined}
                className={clsx(s.link, active && s.active)}
              >
                {localeNames[target]}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
