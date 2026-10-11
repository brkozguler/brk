import s from './Spacer.module.css';

/** HOME-06/07 · 12rem boşluk bloğu (115,2 px @1440); ekran okuyucuda yok. */
export function Spacer() {
  return <div aria-hidden="true" className={s.spacer} />;
}
