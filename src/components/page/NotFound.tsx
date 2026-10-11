import type { Locale } from '@/i18n/config';
import { pagePath } from '@/i18n/routes';
import { notFoundText } from '@/content/pages/not-found';
import { RollButton } from '@/components/ui/RollButton';
import s from './NotFound.module.css';

/** /xx/404/ sayfası ve segment içi notFound() için ortak gövde. */
export function NotFound({ locale }: { locale: Locale }) {
  const text = notFoundText[locale];
  return (
    <section className={`section grid ${s.wrap}`} data-surface="light">
      <div className={s.body}>
        <p className={s.code}>404</p>
        <h1 className="h2">{text.title}</h1>
        <p>{text.text}</p>
        <RollButton href={pagePath(locale, 'home')}>{text.back}</RollButton>
      </div>
    </section>
  );
}
