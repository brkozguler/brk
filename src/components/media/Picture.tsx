import { preload } from 'react-dom';
import type { CSSProperties } from 'react';
import { fallbackWidth, imageSrcSet, imageUrl } from '@/lib/image-url';
import { SIZES, type SizeKey } from '@/lib/image-sizes';
import type { ResolvedImage } from '@/lib/images';

interface Props {
  image: ResolvedImage;
  /** `sizes` sözlüğünden anahtar — zorunlu */
  sizeKey: SizeKey;
  /** Sayfada en fazla bir görselde: eager + fetchpriority=high + preload (LCP) */
  priority?: boolean;
  /** İlk ekranda görünen ama LCP olmayan görseller için `eager` */
  loading?: 'eager' | 'lazy';
  className?: string;
  imgClassName?: string;
}

const MOBILE = '(max-width: 649px)';

/**
 * AVIF + WebP srcset'li <picture>; isteğe bağlı mobil kadraj (art direction).
 * Kapsayıcı `.media-fill` ise img mutlak konumlanır ve kutuyu doldurur;
 * aksi hâlde width/height ile doğal oranında akar (CLS = 0).
 */
export function Picture({ image, sizeKey, priority = false, loading, className, imgClassName }: Props) {
  const { entry, alt, mobile, focal } = image;
  const sizes = SIZES[sizeKey];
  const avif = imageSrcSet(entry, 'avif');
  const webp = imageSrcSet(entry, 'webp');

  if (priority) {
    if (mobile) {
      preload(imageUrl(mobile, fallbackWidth(mobile), 'avif'), {
        as: 'image',
        type: 'image/avif',
        imageSrcSet: imageSrcSet(mobile, 'avif'),
        imageSizes: sizes,
        media: MOBILE,
        fetchPriority: 'high',
      });
    }
    preload(imageUrl(entry, fallbackWidth(entry), 'avif'), {
      as: 'image',
      type: 'image/avif',
      imageSrcSet: avif,
      imageSizes: sizes,
      media: mobile ? '(min-width: 650px)' : undefined,
      fetchPriority: 'high',
    });
  }

  const style: CSSProperties = {};
  if (focal) style.objectPosition = `${focal.x * 100}% ${focal.y * 100}%`;
  if (entry.blur) {
    style.backgroundImage = `url(${entry.blur})`;
    style.backgroundSize = 'cover';
  }

  return (
    <picture className={className}>
      {mobile ? (
        <>
          <source media={MOBILE} type="image/avif" srcSet={imageSrcSet(mobile, 'avif')} sizes={sizes} />
          <source media={MOBILE} type="image/webp" srcSet={imageSrcSet(mobile, 'webp')} sizes={sizes} />
        </>
      ) : null}
      <source type="image/avif" srcSet={avif} sizes={sizes} />
      <img
        src={imageUrl(entry, fallbackWidth(entry), 'webp')}
        srcSet={webp}
        sizes={sizes}
        width={entry.width}
        height={entry.height}
        alt={alt}
        loading={priority ? 'eager' : (loading ?? 'lazy')}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        draggable={false}
        className={imgClassName}
        style={Object.keys(style).length ? style : undefined}
      />
    </picture>
  );
}
