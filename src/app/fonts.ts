import { Manrope, Noto_Serif_Display } from 'next/font/google';

/**
 * Geçici font seçimi; lisanslı font gelirse next/font/local ile değiştirilir.
 * Mākena: ivy-mode (display, yüksek kontrastlı didone, 300) · sweet-sans-pro (eyebrow/UI)
 * · messina-sans (gövde). Türkçe + Kiril destekli en yakın ücretsiz karşılıklar:
 * Noto Serif Display (değişken ağırlık 100–900; başlıklar 300 — Playfair Display 400'den
 * başladığı için "ince" görünmüyordu, kullanıcı 2026-10-11) ve Manrope.
 * next/font fontları build'de indirir ve self-host eder; tüm alt kümeler @font-face olarak
 * gelir, `subsets` yalnızca preload'u belirler (4 dosya bütçesi).
 */
export const display = Noto_Serif_Display({
  weight: 'variable',
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap',
  adjustFontFallback: true,
});

/** İtalik kesim yalnızca kelime şeridinde; preload yok, kullanıldığı sayfada iner */
export const displayItalic = Noto_Serif_Display({
  weight: 'variable',
  style: 'italic',
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display-italic',
  display: 'swap',
  preload: false,
  adjustFontFallback: true,
});

export const text = Manrope({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-text',
  display: 'swap',
  adjustFontFallback: true,
});
