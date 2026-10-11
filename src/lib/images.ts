import manifest from '@/content/generated/images.json';

/**
 * scripts/images.mjs çıktısı. Kaynak: assets/images/**, çıktı: public/img/**.
 * Dosya adı içerik hash'i taşır; bu yüzden .htaccess'te bir yıl immutable cache verilir.
 */
export interface ImageEntry {
  /** 'rooms/' gibi, sonunda eğik çizgiyle; kökteyse boş */
  dir: string;
  name: string;
  hash: string;
  width: number;
  height: number;
  /** Üretilen genişlikler, küçükten büyüğe */
  widths: number[];
  /** 16 px genişlikte base64 webp önizleme */
  blur?: string;
}

export type ImageFormat = 'avif' | 'webp';

const images = manifest as unknown as Record<string, ImageEntry>;

export function getImage(id: string): ImageEntry | null {
  return images[id] ?? null;
}

export function imageUrl(img: ImageEntry, width: number, format: ImageFormat): string {
  return `/img/${img.dir}${img.name}-${img.hash}-${width}.${format}`;
}

export function imageSrcSet(img: ImageEntry, format: ImageFormat): string {
  return img.widths.map((w) => `${imageUrl(img, w, format)} ${w}w`).join(', ');
}

/** Varsayılan `src` için en büyük 1920'yi aşmayan genişlik */
export function fallbackWidth(img: ImageEntry): number {
  const fitting = img.widths.filter((w) => w <= 1920);
  return fitting.length ? fitting[fitting.length - 1] : img.widths[0];
}
