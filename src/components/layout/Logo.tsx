import clsx from 'clsx';
import { site } from '@/content/site';
import s from './Logo.module.css';

/**
 * Geçici metin logosu. Logo SVG'leri gelince (116×58 oranı, açık + koyu)
 * public/logo-*.svg ile değiştirilir; renk currentColor'dan okunur.
 * Metin erişilebilir ağaçta kalır: kapsayan bağlantı/düğmenin adı görünür
 * "Arcanus Hotels Sorgun" ile başlar (WCAG 2.5.3), ek bağlam sr-only ile gelir.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={clsx(s.logo, className)}>
      <span className={s.name}>Arcanus</span>{' '}
      <span className={s.sub}>{site.name.replace('Arcanus ', '')}</span>
    </span>
  );
}
