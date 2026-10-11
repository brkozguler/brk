import Link, { type LinkProps } from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

type Props = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode };

/**
 * Tüm iç bağlantılar bu bileşenden geçer. Sayfa geçiş perdesi (şartname §11)
 * eklendiğinde yalnızca burası değişir.
 *
 * Prefetch varsayılan olarak kapalı: statik export'ta her görünür bağlantı için segment
 * dosyası isteniyordu (sayfa başına ~30 istek) ve henüz yazılmamış sayfalar konsola 404
 * düşürüyordu. Statik HTML zaten hızlı; gerekirse `prefetch` açıkça verilir.
 */
export function TransitionLink({ prefetch = false, ...props }: Props) {
  return <Link prefetch={prefetch} {...props} />;
}
