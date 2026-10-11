import clsx from 'clsx';
import { AnimatedText } from '@/components/motion/AnimatedText';
import s from './Intro.module.css';

interface Props {
  eyebrow?: string;
  text: string;
  wide?: boolean;
}

/**
 * HOME-02 · Intro — RE §16 HOME-02.
 * section pt 12rem / pb 9rem · grid row-gap 4rem · H2 title-m ortalı,
 * l: col 3 / span 8, max-w 80rem (ana sayfada 92rem).
 * Eyebrow satırı boşken de render edilir: Mākena'da grid'de 0 px'lik bir satır +
 * row-gap üretir; koşullu render edilince bölüm 38,4 px kısalıyordu (ölçüldü).
 */
export function Intro({ eyebrow, text, wide = false }: Props) {
  return (
    <section className={s.section}>
      <div className={clsx('site-max site-grid', s.grid)}>
        <span className={clsx('eyebrow', s.eyebrow)}>{eyebrow}</span>
        <AnimatedText as="h2" className={clsx('title-m', s.title, wide && s.wide)}>
          <span className={s.line}>{text}</span>
        </AnimatedText>
      </div>
    </section>
  );
}
