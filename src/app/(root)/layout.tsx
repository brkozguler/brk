import type { ReactNode } from 'react';
import { defaultLocale } from '@/i18n/config';

/** Yalnızca kök adres (/) için ikinci kök layout; sayfa /tr/'ye yönlendirir. */
export default function RootRedirectLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={defaultLocale}>
      <body>{children}</body>
    </html>
  );
}
