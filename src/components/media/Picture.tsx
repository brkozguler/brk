import { preload } from 'react-dom';
import { fallbackWidth, getImage, imageSrcSet, imageUrl } from '@/lib/images';

interface Props {
  /** assets/images altındaki yol, uzantısız: 'rooms/standart-oda-1' */
  id: string;
  alt: string;
  /** Görselin yerleşimdeki genişliği, ör. "(min-width: 1024px) 50vw, 100vw" */
  sizes: string;
  /** LCP görseli: eager + fetchpriority=high + preload; sayfada en fazla bir tane */
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}

/**
 * AVIF + WebP srcset'li <picture>. next/image yerine kullanılır çünkü site statik
 * dosya olarak yayınlanır; boyutlar build'de scripts/images.mjs ile üretilir.
 * width/height her zaman verilir (CLS), ilk ekran dışındakiler lazy yüklenir.
 */
export function Picture({ id, alt, sizes, priority = false, className, imgClassName }: Props) {
  const img = getImage(id);
  if (!img) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Picture: "${id}" manifestte yok. assets/images altına ekleyip "npm run images" çalıştırın.`);
    }
    return null;
  }

  const avif = imageSrcSet(img, 'avif');
  const webp = imageSrcSet(img, 'webp');

  if (priority) {
    preload(imageUrl(img, fallbackWidth(img), 'avif'), {
      as: 'image',
      type: 'image/avif',
      imageSrcSet: avif,
      imageSizes: sizes,
      fetchPriority: 'high',
    });
  }

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={avif} sizes={sizes} />
      <img
        src={imageUrl(img, fallbackWidth(img), 'webp')}
        srcSet={webp}
        sizes={sizes}
        width={img.width}
        height={img.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={imgClassName}
        style={
          img.blur ? { backgroundImage: `url(${img.blur})`, backgroundSize: 'cover' } : undefined
        }
      />
    </picture>
  );
}
