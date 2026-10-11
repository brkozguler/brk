import { lang } from 'next/root-params';
import { asLocale } from '@/i18n/config';
import { NotFound } from '@/components/page/NotFound';

/** Segment içinde notFound() çağrılınca (geliştirme sunucusu) gösterilir. */
export default async function LocaleNotFound() {
  return <NotFound locale={asLocale(await lang())} />;
}
