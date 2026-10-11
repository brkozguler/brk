import Link, { type LinkProps } from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

type Props = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode };

/**
 * Tüm iç bağlantılar bu bileşenden geçer. Sayfa geçiş perdesi (şartname §11)
 * eklendiğinde yalnızca burası değişir.
 */
export function TransitionLink(props: Props) {
  return <Link {...props} />;
}
