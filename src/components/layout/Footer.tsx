import type { Locale } from '@/i18n/config';
import type { UiStrings } from '@/i18n/ui';
import { site } from '@/content/site';
import type { NavGroup, NavLink, PublishedMatrix } from '@/content/types';
import { TransitionLink } from '@/components/transition/TransitionLink';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';
import s from './Footer.module.css';

interface Props {
  locale: Locale;
  ui: UiStrings;
  groups: NavGroup[];
  legal: NavLink[];
  published: PublishedMatrix;
  homeHref: string;
}

/** Koyu zeminli footer; masaüstünde içeriğin altından açılır (sticky). */
export function Footer({ locale, ui, groups, legal, published, homeHref }: Props) {
  const year = new Date().getFullYear();
  const { address, contact } = site;

  return (
    <footer id="site-footer" className={s.footer} data-surface="dark">
      <div className={s.inner}>
        <div className={s.brand}>
          <TransitionLink href={homeHref} className={s.logo} aria-label={ui.homeLink}>
            <Logo />
          </TransitionLink>
          {address && (
            <address className={s.address}>
              {address.street}
              <br />
              {address.postalCode} {address.district}, {address.city}
            </address>
          )}
          {contact.phone && (
            <a className={s.contact} href={`tel:${contact.phone.replace(/\s+/g, '')}`}>
              {contact.phone}
            </a>
          )}
          {contact.email && (
            <a className={s.contact} href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          )}
        </div>

        {groups.map((group) => (
          <nav key={group.title} className={s.group} aria-label={group.title}>
            <p className={s.groupTitle}>{group.title}</p>
            <ul>
              {group.links.map((link) => (
                <li key={link.href}>
                  <TransitionLink href={link.href} className={s.link}>
                    {link.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className={s.lang}>
          <LanguageSwitcher locale={locale} published={published} label={ui.language} />
        </div>
      </div>

      <div className={s.bottom}>
        <p className={s.copy}>
          © {year} {site.name}. {ui.allRightsReserved}
        </p>
        {legal.length > 0 && (
          <ul className={s.legal}>
            {legal.map((link) => (
              <li key={link.href}>
                <TransitionLink href={link.href} className={s.link}>
                  {link.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  );
}
