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
  columns?: 2 | 3;
}

/**
 * GALLERY-02 · Galeri ızgarası — RE §17.6, canlı DOM 1440×900 / 375×812 (2026-10-11).
 *   section py 4rem / s: pt 8rem pb 2rem · ul site-max site-grid ·
 *   li span 6 / s: span 4 · mb 6rem (sonuncuda yok) / s: mb 10rem (hepsinde) ·
 *   görsel 4:3, mb 2,4rem / s: 3,2rem · etiket eyebrow ortalı (hover: marka rengi 600 ms) ·
 *   hover görsel 1,05 (700 ms). 1440'ta 3 × 432 px, satırlar y 604,8 / 1066,2; section 1018,7 px.
 * Etiket Mākena'da h3; başlık sırası atlanmasın diye h2 (hero'daki h1'den sonra).
 *
 * `columns={2}` (Konaklama, kullanıcı kararı 2026-10-11: "2'li, kart boşlukları Ethno gibi"):
 * ethnohotels.com/tr/konaklama canlı ölçümü (1440 / 768 / 375) — kolon arası 50 px, satır arası
 * 80 px, mobilde tek kolon ve 40 px. Bizde ≥650 iki kolon (kolon arası 5,2rem → kart 639,5 px
 * @1440, x 48 / 737,4), satır arası 8,3rem; <650 tek kolon, satır arası 4,2rem.
 */
export function GalleryGrid({ items, columns = 3 }: Props) {
  const two = columns === 2;
  return (
    <section className={s.section}>
      <ul className={clsx('site-max site-grid', s.list, two && s.two)}>
        {items.map((item) => (
          <li key={item.href} className={s.item}>
            <TransitionLink href={item.href} className={clsx('group', s.link)}>
              <div className={clsx('hoverable media-fill', s.media)}>
                <Picture image={item.media} sizeKey={two ? 'galleryCardWide' : 'galleryCard'} />
              </div>
              <h2 className={clsx('eyebrow', s.label)}>{item.label}</h2>
            </TransitionLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
