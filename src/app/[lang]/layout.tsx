import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import 'lenis/dist/lenis.css';
import '../globals.css';
import { display, text } from '../fonts';
import { isLocale, locales } from '@/i18n/config';
import { pagePath } from '@/i18n/routes';
import { getUi } from '@/i18n/ui';
import { bookingTarget, legalLinks, navGroups } from '@/content/navigation';
import { publishedMatrix } from '@/content/pages';
import { site } from '@/content/site';
import { BookingBar } from '@/components/layout/BookingBar';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SmoothScroll } from '@/components/layout/SmoothScroll';

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

  return (
    <html lang={lang} className={`${display.variable} ${text.variable}`}>
      <body className={booking ? 'has-booking-bar' : undefined}>
        <a className="skip-link" href="#main">
          {ui.skipToContent}
        </a>
        <SmoothScroll>
          <Header
            locale={lang}
            ui={ui}
            groups={groups}
            published={published}
            homeHref={homeHref}
            bookingHref={booking?.href ?? null}
            bookingExternal={booking?.external ?? false}
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
            homeHref={homeHref}
          />
        </SmoothScroll>
        {booking && <BookingBar href={booking.href} external={booking.external} label={ui.bookNow} />}
        <noscript>
          <style>{'[data-split-pending]{visibility:visible}'}</style>
        </noscript>
      </body>
    </html>
  );
}
