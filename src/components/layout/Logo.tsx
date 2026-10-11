import { site } from '@/content/site';
import s from './Logo.module.css';

/**
 * Geçici metin logosu. Logo SVG'leri gelince public/logo-light.svg ve
 * public/logo-dark.svg ile değiştirilir; renk currentColor'dan okunur.
 */
export function Logo() {
  return (
    <span className={s.logo} aria-hidden="true">
      <span className={s.name}>Arcanus</span>
      <span className={s.sub}>{site.name.replace('Arcanus ', '')}</span>
    </span>
  );
}
