import clsx from 'clsx';
import { site } from '@/content/site';
import s from './Logo.module.css';

/**
 * Geçici metin logosu. Logo SVG'leri gelince (116×58 oranı, açık + koyu)
 * public/logo-*.svg ile değiştirilir; renk currentColor'dan okunur.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={clsx(s.logo, className)} aria-hidden="true">
      <span className={s.name}>Arcanus</span>
      <span className={s.sub}>{site.name.replace('Arcanus ', '')}</span>
    </span>
  );
}
