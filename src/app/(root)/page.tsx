import type { Metadata } from 'next';
import { defaultLocale, localeNames, locales } from '@/i18n/config';
import { pagePath } from '@/i18n/routes';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: { absolute: site.name },
  robots: { index: false, follow: true },
};

/**
 * Canlıda kök adresi .htaccess 301 ile /tr/'ye yönlendirir; bu sayfa yalnızca
 * geliştirme sunucusunda ve .htaccess çalışmazsa devreye giren yedektir.
 * IP ya da tarayıcı diline göre otomatik yönlendirme yapılmaz.
 */
export default function RootPage() {
  const target = pagePath(defaultLocale, 'home');
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <p>
        {locales.map((locale, i) => (
          <span key={locale}>
            {i > 0 && ' · '}
            <a href={pagePath(locale, 'home')} lang={locale} hrefLang={locale}>
              {localeNames[locale]}
            </a>
          </span>
        ))}
      </p>
    </>
  );
}
