import clsx from 'clsx';
import { SpecRow } from '@/components/ui/SpecRow';
import s from './BodyColumn.module.css';

interface Props {
  paragraphs: string[];
  specs?: string[];
  specsLabel?: string;
}

/**
 * PROP-03 · Gövde sütunu — Mākena /real-estate/kaeo canlı DOM (1440×900 / 375×812, 2026-10-11):
 *   section pt 8rem (her boyutta) · site-max site-grid · metin body-m (14,4 / 23,04, %70 siyah)
 *   col 1–6 / s: 2–10 / l: 3–8 (880,6 px @1440) · paragraflar arası bir satır boşluk ·
 *   altta mt 8rem, 1 px, marka rengi %20 çizgi; pb yok (slider kendi 8rem'iyle gelir).
 * Bizde ek: ✦ özellik satırı (Vogue kartındaki) paragrafların altında.
 */
export function BodyColumn({ paragraphs, specs, specsLabel }: Props) {
  return (
    <section className={s.section}>
      <div className="site-max site-grid">
        <div className={clsx('body-m', s.body)}>
          {paragraphs.map((p) => (
            <p key={p} className={s.paragraph}>
              {p}
            </p>
          ))}
          {specs?.length ? <SpecRow items={specs} label={specsLabel} className={s.specs} /> : null}
        </div>
        <div className={s.rule} aria-hidden="true" />
      </div>
    </section>
  );
}
