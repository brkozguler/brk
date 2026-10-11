'use client';

import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import s from './CopyButton.module.css';

/**
 * Panoya kopyalama (Mākena footer, RE §11.3): 12 px düğme, başarıda yeşil zemin
 * ve tik, 2 s sonra eski hâli. Clipboard API yoksa gizli textarea fallback'i.
 */
export function CopyButton({ value, label, copied }: { value: string; label: string; copied: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setDone(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setDone(false), 2000);
  };

  return (
    <button type="button" onClick={copy} aria-label={`${label} ${value}`} className={clsx(s.btn, done && s.done)}>
      <svg viewBox="0 0 12 12" aria-hidden="true" className={s.icon}>
        {done ? (
          <path d="M2 6.5 5 9l5-6" fill="none" stroke="currentColor" strokeWidth="1.2" />
        ) : (
          <>
            <rect x="3.5" y="3.5" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M8.5 3.5v-1h-6v6h1" fill="none" stroke="currentColor" strokeWidth="1" />
          </>
        )}
      </svg>
      <span className="sr-only" aria-live="polite">
        {done ? copied : ''}
      </span>
    </button>
  );
}
