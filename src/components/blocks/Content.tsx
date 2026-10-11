import clsx from 'clsx';
import { AnimatedText } from '@/components/motion/AnimatedText';
import s from './Content.module.css';

interface Props {
  eyebrow?: string;
  title?: string;
  text: string;
}

/**
 * HOME-04 · Content — canlı DOM'dan iki kolon:
 *   sol  l: col 2 / span 4 → eyebrow + title-s
 *   sağ  l: col 7 / span 5 → gövde
 * section py 8rem · s: 11rem · mobil pt 4rem. Eyebrow <p>, başlık <h2> (semantik).
 */
export function Content({ eyebrow, title, text }: Props) {
  return (
    <section className={s.section}>
      <div className="site-max site-grid">
        <div className={s.left}>
          {eyebrow ? <p className={clsx('eyebrow', s.eyebrow)}>{eyebrow}</p> : null}
          {title ? (
            <AnimatedText as="h2" className={clsx('title-s', s.title)}>
              <span className={s.line}>{title}</span>
            </AnimatedText>
          ) : null}
        </div>
        <div className={s.right}>
          <AnimatedText each={0.05} amount="3rem" className="body-m">
            <p>{text}</p>
          </AnimatedText>
        </div>
      </div>
    </section>
  );
}
