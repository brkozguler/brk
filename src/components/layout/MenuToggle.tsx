'use client';

import clsx from 'clsx';
import type { Ref } from 'react';
import s from './MenuToggle.module.css';

interface Props {
  open: boolean;
  onClick: () => void;
  labels: { menu: string; close: string; toggle: string };
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Hamburger — Mākena `.menu-t` (RE §10.1): kare çerçeve hover'da belirir,
 * iki çizgi hover'da 3rem sağa kayıp klonları soldan girer (marquee swap),
 * yanındaki "Menü / Kapat" metni dikey takas yapar (≥650).
 */
export function MenuToggle({ open, onClick, labels, ref }: Props) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls="site-menu"
      aria-label={labels.toggle}
      className={clsx(s.toggle, open && s.isActive)}
    >
      <span className={s.hamburger}>
        <span className={s.circle} />
        <span className={s.lines} />
        <span className={clsx(s.lines, s.linesClone)} />
      </span>
      <span className={clsx('eyebrow', s.text)} aria-hidden="true">
        <span>{labels.close}</span>
        <span>{labels.menu}</span>
      </span>
    </button>
  );
}
