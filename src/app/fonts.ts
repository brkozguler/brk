import { Manrope, Playfair_Display } from 'next/font/google';

/**
 * Geçici font seçimi; lisanslı font gelirse next/font/local ile değiştirilir.
 * Mākena: ivy-mode (display, yüksek kontrastlı didone, 300) · sweet-sans-pro (eyebrow/UI)
 * · messina-sans (gövde). Türkçe + Kiril destekli en yakın ücretsiz karşılıklar:
 * Playfair Display (genişlik ve kontrast olarak ivy-mode'a Cormorant'tan daha yakın)
 * ve Manrope. next/font fontları build'de indirir ve self-host eder; tüm alt kümeler
 * @font-face olarak gelir, `subsets` yalnızca preload'u belirler (4 dosya bütçesi).
 */
export const display = Playfair_Display({
  weight: 'variable',
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap',
  adjustFontFallback: true,
});

export const text = Manrope({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-text',
  display: 'swap',
  adjustFontFallback: true,
});
