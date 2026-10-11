import clsx from 'clsx';
import { Picture } from '@/components/media/Picture';
import { TransitionLink } from '@/components/transition/TransitionLink';
import type { ResolvedImage } from '@/lib/images';
import s from './GalleryGrid.module.css';

export interface GalleryGridItemData {
  href: string;
  label: string;
  media: ResolvedImage;
}

interface Props {
  items: GalleryGridItemData[];
}

/**
 * GALLERY-02 · Galeri ızgarası — RE §17.6, canlı DOM 1440×900 / 375×812 (2026-10-11).
 *   section py 4rem / s: pt 8rem pb 2rem · ul site-max site-grid ·
 *   li span 6 / s: span 4 · mb 6rem (sonuncuda yok) / s: mb 10rem (hepsinde) ·
 *   görsel 4:3, mb 2,4rem / s: 3,2rem · etiket eyebrow ortalı (hover: marka rengi 600 ms) ·
 *   hover görsel 1,05 (700 ms). 1440'ta 3 × 432 px, satırlar y 604,8 / 1066,2; section 1018,7 px.
 * Etiket Mākena'da h3; başlık sırası atlanmasın diye h2 (hero'daki h1'den sonra).
 */
export function GalleryGrid({ items }: Props) {
  return (
    <section className={s.section}>
      <ul className={clsx('site-max site-grid', s.list)}>
        {items.map((item) => (
          <li key={item.href} className={s.item}>
            <TransitionLink href={item.href} className={clsx('group', s.link)}>
              <div className={clsx('hoverable media-fill', s.media)}>
                <Picture image={item.media} sizeKey="galleryCard" />
              </div>
              <h2 className={clsx('eyebrow', s.label)}>{item.label}</h2>
            </TransitionLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
