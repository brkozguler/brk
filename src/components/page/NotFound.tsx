import type { Locale } from '@/i18n/config';
import { pagePath } from '@/i18n/routes';
import { notFoundText } from '@/content/pages/not-found';
import { Button } from '@/components/ui/Button';
import s from './NotFound.module.css';

/** /xx/404/ sayfası ve segment içi notFound() için ortak gövde. */
export function NotFound({ locale }: { locale: Locale }) {
  const text = notFoundText[locale];
  return (
    <section className={s.wrap}>
      <div className="site-max site-grid">
        <div className={s.body}>
          <p className="eyebrow">404</p>
          <h1 className="title-l">{text.title}</h1>
          <p className="body-m">{text.text}</p>
          <Button href={pagePath(locale, 'home')} label={text.back} />
        </div>
      </div>
    </section>
  );
}
