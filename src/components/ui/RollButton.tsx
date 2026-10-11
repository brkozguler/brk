import clsx from 'clsx';
import { TransitionLink } from '@/components/transition/TransitionLink';
import s from './RollButton.module.css';

interface Props {
  href: string;
  children: string;
  external?: boolean;
  className?: string;
}

/** Hover ve klavye odağında metni yukarı kaydıran yuvarlak buton. Ok işareti yok. */
export function RollButton({ href, children, external = false, className }: Props) {
  const classes = clsx(s.btn, className);
  const track = (
    <span className={s.track}>
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {track}
      </a>
    );
  }

  return (
    <TransitionLink href={href} className={classes}>
      {track}
    </TransitionLink>
  );
}
