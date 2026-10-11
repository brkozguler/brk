/**
 * Görsel URL yardımcıları — istemci bileşenlerinde de kullanılır; manifest
 * (`lib/images.ts`) yalnızca sunucuda okunur, buraya girmez.
 */
export interface ImageEntry {
  /** 'home/' gibi, sonunda eğik çizgiyle; kökteyse boş */
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
