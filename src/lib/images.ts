import manifest from '@/content/generated/images.json';
import type { ImageRef } from '@/content/types';
import type { ImageEntry } from './image-url';

export type { ImageEntry } from './image-url';
export { fallbackWidth, imageSrcSet, imageUrl } from './image-url';

/**
 * scripts/images.mjs manifesti — yalnızca SUNUCU tarafında okunur; istemci
 * bileşenlerine çözümlenmiş `ResolvedImage` nesneleri prop olarak geçer.
 */
const images = manifest as unknown as Record<string, ImageEntry>;

export function getImage(id: string): ImageEntry | null {
  return images[id] ?? null;
}

/** Blokların istemci tarafına geçen, manifest'ten bağımsız görsel verisi */
export interface ResolvedImage {
  entry: ImageEntry;
  alt: string;
  /** Mobil kadraj (art direction), < 650 px */
  mobile?: ImageEntry;
  /** Odak noktası 0–1 */
  focal?: { x: number; y: number };
}

export function resolveImage(ref: ImageRef): ResolvedImage | null {
  const entry = getImage(ref.id);
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Görsel manifestte yok: "${ref.id}" — assets/images altına ekleyip "npm run images" çalıştırın.`);
    }
    return null;
  }
  const mobile = ref.mobileId ? (getImage(ref.mobileId) ?? undefined) : undefined;
  return { entry, alt: ref.alt, mobile, focal: ref.focal };
}
