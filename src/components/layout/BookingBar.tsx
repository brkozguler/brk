import s from './BookingBar.module.css';

interface Props {
  href: string;
  external: boolean;
  label: string;
}

/** Mobilde ekranın altına sabitlenen rezervasyon butonu. 768 px üstünde gizlidir. */
export function BookingBar({ href, external, label }: Props) {
  return (
    <div id="booking-bar" className={s.bar}>
      <a
        className={s.btn}
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {label}
      </a>
    </div>
  );
}
