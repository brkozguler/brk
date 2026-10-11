import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/config';
import { getUi } from '@/i18n/ui';
import type { Section } from '@/content/types';
import { Picture } from '@/components/media/Picture';
import { Hero } from './Hero';

/**
 * Bölüm tipi → bileşen eşlemesi. Sayfalar bir bölüm dizisinden çizilir;
 * CMS'e geçince sayfa yapısı panelden değiştirilebilir.
 */
export function renderSection(section: Section, index: number, locale: Locale): ReactNode {
  const ui = getUi(locale);

  switch (section.type) {
    case 'hero': {
      const media = section.image ? (
        <Picture id={section.image.id} alt={section.image.alt} sizes="100vw" priority />
      ) : undefined;
      return (
        <Hero
          key={index}
          title={section.title}
          eyebrow={section.eyebrow}
          media={media}
          cueLabel={ui.scrollDown}
        />
      );
    }
    default:
      return null;
  }
}
