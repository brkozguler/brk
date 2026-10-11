import { Cormorant_Garamond, Manrope } from 'next/font/google';

/**
 * Geçici font seçimi; lisanslı font gelirse next/font/local ile değiştirilir.
 * next/font fontları build'de indirir ve self-host eder. Tüm alt kümeler
 * (Kiril dahil) @font-face olarak gelir ve unicode-range ile gerektiğinde yüklenir;
 * `subsets` yalnızca hangilerinin preload edileceğini belirler (4 dosya bütçesi).
 */
export const display = Cormorant_Garamond({
  weight: 'variable',
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap',
});

export const text = Manrope({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-text',
  display: 'swap',
});
