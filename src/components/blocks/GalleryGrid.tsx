import clsx from 'clsx';
import { Picture } from '@/components/media/Picture';
import { TransitionLink } from '@/components/transition/TransitionLink';
import { Button } from '@/components/ui/Button';
import type { ResolvedImage } from '@/lib/images';
import type { GalleryGridDetail } from '@/content/types';
import s from './GalleryGrid.module.css';

export interface GalleryGridItemData {
  href: string;
  label: string;
  media: ResolvedImage;
  detail?: GalleryGridDetail;
}

export interface GalleryGridBooking {
  href: string;
  label: string;
  external: boolean;
}

interface Props {
  items: GalleryGridItemData[];
  columns?: 2 | 3;
  /** Zengin kartların buton etiketi (KEŞFET) */
  ctaLabel?: string;
  /** İkinci düğme: REZERVASYON → rezervasyon motoru ya da iletişim sayfası */
  booking?: GalleryGridBooking;
}

/**
 * GALLERY-02 · Galeri ızgarası — RE §17.6, canlı DOM 1440×900 / 375×812 (2026-10-11).
 *   section py 4rem / s: pt 8rem pb 2rem · ul site-max site-grid ·
 *   li span 6 / s: span 4 · mb 6rem (sonuncuda yok) / s: mb 10rem (hepsinde) ·
 *   görsel 4:3, mb 2,4rem / s: 3,2rem · etiket eyebrow ortalı (hover: marka rengi 600 ms) ·
 *   hover görsel 1,05 (700 ms). 1440'ta 3 × 432 px, satırlar y 604,8 / 1066,2; section 1018,7 px.
 * Etiket Mākena'da h3; başlık sırası atlanmasın diye h2 (hero'daki h1'den sonra).
 *
 * `columns={2}` (Konaklama, kullanıcı kararı 2026-10-11: kart boyutu ve boşluk
 * voguehotelsupreme.com/odalar gibi): ≥1024 iki kart, 133,3rem (1280 px) ortalı alan, kart 626 px
 * (x 72,7 / 726,8 @1440), kolon arası 2,9rem (28), satır arası 8,3rem (80), görsel 626/426,
 * alt boşluk 120; <1024 tek kolon, görsel 345/245.
 *
 * `detail` (Vogue oda kartı, "bizim font ve font-size"): görsel → eyebrow (mt 4,2rem; Vogue 40) →
 * başlık title-xs (mt .8rem; Vogue 20 px Playfair, 8) → açıklama body-m (mt 4,2rem) →
 * özellikler label-s 500, ✦ ayraçlı → KEŞFET + REZERVASYON .btn (Vogue 91×44 düz kenarlı tek düğme,
 * bizde 14rem × 4,2rem yazı takaslı iki düğme). Kullanıcı düzeltmeleri (2026-10-11): eyebrow yok,
 * açıklama mt 2rem ve max-w 50rem, özellik aralığı 1,6rem, satır arası 10,4rem, ikinci düğme.
 */
export function GalleryGrid({ items, columns = 3, ctaLabel, booking }: Props) {
  const two = columns === 2;
  return (
    <section className={clsx(s.section, two && s.sectionTwo)}>
      <ul className={clsx('site-max site-grid', s.list, two && s.two)}>
        {items.map((item) =>
          item.detail ? (
            <li key={item.href} className={clsx('group', s.item, s.rich)}>
              {/* Görsel bağlantısı başlıkla aynı hedef; klavye ve ekran okuyucu için tekrar değil */}
              <TransitionLink href={item.href} className={s.mediaLink} tabIndex={-1} aria-hidden="true">
                <div className={clsx('hoverable media-fill', s.media)}>
                  <Picture image={item.media} sizeKey={two ? 'galleryCardWide' : 'galleryCard'} />
                </div>
              </TransitionLink>
              {item.detail.eyebrow ? <p className={clsx('eyebrow', s.richEyebrow)}>{item.detail.eyebrow}</p> : null}
              <h2 className={clsx('title-xs', s.richTitle)}>
                <TransitionLink href={item.href}>{item.label}</TransitionLink>
              </h2>
              <p className={clsx('body-m', s.richText)}>{item.detail.text}</p>
              <ul className={clsx('label-s', s.specs)} aria-label={item.label}>
                {item.detail.specs.map((spec) => (
                  <li key={spec} className={s.spec}>
                    {spec}
                  </li>
                ))}
              </ul>
              {ctaLabel || booking ? (
                <div className={s.ctaRow}>
                  {ctaLabel ? <Button href={item.href} label={ctaLabel} srLabel={item.label} /> : null}
                  {booking ? (
                    <Button href={booking.href} label={booking.label} external={booking.external} srLabel={item.label} />
                  ) : null}
                </div>
              ) : null}
            </li>
          ) : (
            <li key={item.href} className={s.item}>
              <TransitionLink href={item.href} className={clsx('group', s.link)}>
                <div className={clsx('hoverable media-fill', s.media)}>
                  <Picture image={item.media} sizeKey={two ? 'galleryCardWide' : 'galleryCard'} />
                </div>
                <h2 className={clsx('eyebrow', s.label)}>{item.label}</h2>
              </TransitionLink>
            </li>
          ),
        )}
      </ul>
    </section>
  );
}
