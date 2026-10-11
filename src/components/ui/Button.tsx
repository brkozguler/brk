import clsx from 'clsx';
import { TransitionLink } from '@/components/transition/TransitionLink';
import { SwapLabel } from './SwapLabel';
import s from './Button.module.css';

interface Props {
  href: string;
  label: string;
  external?: boolean;
  /** Yalnızca ekran okuyucuya eklenen bağlam: "KEŞFET: Standart Oda" */
  srLabel?: string;
  className?: string;
}

/**
 * Kenarlıklı hap buton — Mākena `.sh__cta` / BaseBtn markup'ından birebir:
 * `rounded-[.3rem]` · 1 px currentColor kenarlık · `min-w-[14rem]` · iç yükseklik 4,2rem ·
 * eyebrow tipografisi · zemin dolmaz, yalnızca yazı takas yapar (500 ms).
 * Renk ebeveynden miras alınır (header'da scroll durumuna göre beyaz ↔ siyah).
 */
export function Button({ href, label, external = false, srLabel, className }: Props) {
  const classes = clsx('btn eyebrow group', className);
  const content = (
    <>
      <span className="btn__content">
        <SwapLabel label={label} innerClassName={s.inner} />
      </span>
      {srLabel ? <span className="sr-only">: {srLabel}</span> : null}
    </>
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <TransitionLink href={href} className={classes}>
      {content}
    </TransitionLink>
  );
}
