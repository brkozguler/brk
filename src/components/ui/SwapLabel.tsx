import clsx from 'clsx';

/**
 * Dikey yazı takası (Mākena kart CTA'sı ve `.btn` içi): üstteki kopya hover'da
 * yukarı çıkar, alttaki kopya +100%'den girer; 500 ms ease-out. Tıklanabilir
 * kapsayıcının (`.group`) içinde durur, kendisi etkileşimli değildir.
 * İç boşluk HAREKET EDEN etikette (innerClassName) — sarmalayıcıda değil.
 */
export function SwapLabel({
  label,
  className,
  innerClassName,
}: {
  label: string;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <span className={clsx('swap eyebrow', className)}>
      <span className={clsx('swap__a', innerClassName)}>{label}</span>
      <span aria-hidden="true" className="swap__b">
        {label}
      </span>
    </span>
  );
}
