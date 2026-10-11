import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import 'lenis/dist/lenis.css';
import '../globals.css';
import { display, displayItalic, text } from '../fonts';
import { isLocale, locales } from '@/i18n/config';
import { pagePath } from '@/i18n/routes';
import { getUi } from '@/i18n/ui';
import { bookingTarget, legalLinks, MENU_FIGURE, navGroups } from '@/content/navigation';
import { publishedMatrix } from '@/content/pages';
import { site, telHref } from '@/content/site';
import { resolveImage } from '@/lib/images';
import { BookingBar } from '@/components/layout/BookingBar';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { MotionRuntime } from '@/components/layout/MotionRuntime';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  applicationName: site.name,
};

interface Props {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}

/** Kök layout dil segmentinin altındadır; <html lang> buradan okunur. */
export default async function LocaleLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const ui = getUi(lang);
  const groups = navGroups(lang);
  const legal = legalLinks(lang);
  const booking = bookingTarget(lang);
  const published = publishedMatrix();
  const homeHref = pagePath(lang, 'home');
  const { address, contact } = site;
  const menuContact = {
    phone: contact.phone,
    phoneHref: telHref(contact.phone),
    email: contact.email,
    addressLines: [address.street, `${address.postalCode} ${address.district} / ${address.city}`],
  };

  return (
    <html lang={lang} className={`${display.variable} ${displayItalic.variable} ${text.variable}`}>
      <body className="has-booking-bar">
        <a className="skip-link" href="#main">
          {ui.skipToContent}
        </a>
        <MotionRuntime />
        <Header
          locale={lang}
          ui={ui}
          groups={groups}
          published={published}
          homeHref={homeHref}
          ctaHref={booking.href}
          ctaExternal={booking.external}
          contact={menuContact}
          menuFigure={resolveImage(MENU_FIGURE)}
        />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer
          locale={lang}
          ui={ui}
          groups={groups}
          legal={legal}
          published={published}
          siteName={site.name}
          phone={contact.phone}
          phoneHref={telHref(contact.phone)}
          email={contact.email}
          social={site.social}
        />
        <BookingBar href={booking.href} external={booking.external} label={ui.bookNow} />
      </body>
    </html>
  );
}
