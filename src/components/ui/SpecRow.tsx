import clsx from 'clsx';
import s from './SpecRow.module.css';

interface Props {
  items: string[];
  /** Ekran okuyucu için liste adı (örn. oda adı) */
  label?: string;
  className?: string;
}

/**
 * ✦ ayraçlı özellik satırı — Vogue Hotel Supreme oda kartı (properties): label-s 500,
 * öğeler arası 1,6rem + ✦ .8rem + 1,6rem (kullanıcı "biraz daha daralt", 2026-10-11). Sarabilir.
 */
export function SpecRow({ items, label, className }: Props) {
  if (!items.length) return null;
  return (
    <ul className={clsx('label-s', s.specs, className)} aria-label={label}>
      {items.map((item) => (
        <li key={item} className={s.spec}>
          {item}
        </li>
      ))}
    </ul>
  );
}
