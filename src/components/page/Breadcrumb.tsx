import type { Locale } from '@/i18n/config';
import { breadcrumbKeys, pagePath, routes, type PageKey } from '@/i18n/routes';
import { getUi } from '@/i18n/ui';
import { TransitionLink } from '@/components/transition/TransitionLink';
import s from './Breadcrumb.module.css';

interface Props {
  locale: Locale;
  pageKey: PageKey;
}

/** Görünür breadcrumb; BreadcrumbList JSON-LD ile aynı zinciri gösterir. */
export function Breadcrumb({ locale, pageKey }: Props) {
  const keys = breadcrumbKeys(pageKey);
  const last = keys.length - 1;

  return (
    <nav className={s.nav} aria-label={getUi(locale).breadcrumb}>
      <ol className={s.list}>
        {keys.map((key, i) => (
          <li key={key} className={s.item}>
            {i === last ? (
              <span aria-current="page">{routes[key].label[locale]}</span>
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
}
