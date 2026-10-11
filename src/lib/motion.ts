/**
 * Tüm süre ve eğriler burada durur; bileşenler sayı yazmaz.
 * CSS karşılıkları globals.css içindeki --ease-* ve --dur-* değişkenleridir.
 */
export const ease = {
  /** girişler, reveal */
  out: 'expo.out',
  /** perde, menü, slider geçişi */
  inOut: 'power4.inOut',
  /** küçük arayüz tepkileri */
  soft: 'power2.out',
} as const;

export const dur = {
  /** renk, opaklık */
  fast: 0.4,
  /** buton, küçük reveal */
  base: 0.8,
  /** başlık satırları */
  slow: 1.2,
  /** görsel maske + ölçek */
  slower: 1.6,
} as const;

export const stagger = { lines: 0.08, words: 0.04, items: 0.1 } as const;

export const trigger = { start: 'top 85%' } as const;
