import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/config';
import { pagePath, routes } from '@/i18n/routes';
import { getUi } from '@/i18n/ui';
import { bookingTarget } from '@/content/navigation';
import type { Block, ImageRef, PageLink } from '@/content/types';
import { resolveImage, type ResolvedImage } from '@/lib/images';
import { BannerFull } from './BannerFull';
import { BannerScale } from './BannerScale';
import { BodyColumn } from './BodyColumn';
import { MediaSlider } from './MediaSlider';
import { Related } from './Related';
import { CardCarousel } from './CardCarousel';
import { Content } from './Content';
import { ExploreMore } from './ExploreMore';
import { Feature5050 } from './Feature5050';
import { GalleryCategory } from './GalleryCategory';
import { GalleryGrid } from './GalleryGrid';
import { Hero } from './Hero';
import { Intro } from './Intro';
import { Listings5050 } from './Listings5050';
import { Spacer } from './Spacer';
import { Storytelling } from './Storytelling';

/**
 * Blok tipi → bileşen eşlemesi (Mākena BlockRenderer karşılığı). Sunucuda çalışır:
 * görselleri manifestten çözer, sayfa anahtarlarını dil bazlı yollara çevirir ve
 * istemci bileşenlerine yalnızca düz veri geçer.
 */
export function renderBlock(block: Block, index: number, locale: Locale): ReactNode {
  const ui = getUi(locale);
  const key = `${block.type}-${index}`;
  const img = (ref: ImageRef): ResolvedImage | null => resolveImage(ref);
  const link = (l?: PageLink) => (l ? { href: pagePath(locale, l.page), label: l.label } : undefined);
  const navLabels = { prev: ui.carouselPrev, next: ui.carouselNext, carousel: ui.carousel };

  switch (block.type) {
    case 'hero': {
      const media = img(block.media);
      if (!media) return null;
      return (
        <Hero
          key={key}
          eyebrow={block.eyebrow}
          titleLines={block.titleLines}
          subtitle={block.subtitle}
          media={media}
          slim={block.slim}
          scrollLabel={ui.scrollDown}
        />
      );
    }
    case 'intro':
      return <Intro key={key} eyebrow={block.eyebrow} text={block.text} wide={block.wide} />;
    case 'banner_scale': {
      const media = img(block.media);
      if (!media) return null;
      return <BannerScale key={key} eyebrow={block.eyebrow} title={block.title} text={block.text} media={media} />;
    }
    case 'content':
      return <Content key={key} eyebrow={block.eyebrow} title={block.title} text={block.text} />;
    case 'storytelling': {
      const large = img(block.media.large);
      const small = img(block.media.small);
      if (!large || !small) return null;
      return <Storytelling key={key} text={block.text} large={large} small={small} />;
    }
    case 'spacer':
      return <Spacer key={key} />;
    case 'banner_full': {
      const media = img(block.media);
      if (!media) return null;
      return <BannerFull key={key} media={media} />;
    }
    case 'feature5050': {
      const media = img(block.media);
      if (!media) return null;
      return (
        <Feature5050
          key={key}
          eyebrow={block.eyebrow}
          title={block.title}
          text={block.text}
          link={link(block.link)}
          media={media}
          left={block.left}
          reverse={block.reverse}
          background={block.background}
        />
      );
    }
    case 'card_carousel': {
      const cards = block.cards.flatMap((card) => {
        const media = img(card.media);
        return media ? [{ title: card.title, href: card.page ? pagePath(locale, card.page) : undefined, media }] : [];
      });
      return (
        <CardCarousel
          key={key}
          variant={block.variant}
          eyebrow={block.eyebrow}
          title={block.title}
          text={block.text}
          label={block.label}
          cards={cards}
          labels={navLabels}
        />
      );
    }
    case 'listings5050': {
      const items = block.items.flatMap((item) => {
        const media = img(item.media);
        return media ? [{ title: item.title, media }] : [];
      });
      return (
        <Listings5050
          key={key}
          eyebrow={block.eyebrow}
          title={block.title}
          text={block.text}
          link={link(block.link)}
          items={items}
        />
      );
    }
    case 'explore_more': {
      const links = block.links.flatMap((l) => {
        const media = img(l.media);
        return media ? [{ href: pagePath(locale, l.page), label: l.label, media }] : [];
      });
      return <ExploreMore key={key} title={block.title} links={links} labels={navLabels} />;
    }
    case 'gallery_grid': {
      const items = block.items.flatMap((item) => {
        const media = img(item.media);
        if (!media) return [];
        const href = item.page ? pagePath(locale, item.page) : undefined;
        return [{ href, label: item.label, media, detail: item.detail }];
      });
      const booking = bookingTarget(locale);
      return (
        <GalleryGrid
          key={key}
          items={items}
          columns={block.columns}
          ctaLabel={ui.explore}
          booking={{ href: booking.href, external: booking.external, label: ui.bookNow }}
        />
      );
    }
    case 'body_column':
      return <BodyColumn key={key} paragraphs={block.paragraphs} specs={block.specs} />;
    case 'media_slider': {
      const images = block.images.flatMap((ref) => {
        const media = img(ref);
        return media ? [media] : [];
      });
      if (!images.length) return null;
      return (
        <MediaSlider
          key={key}
          images={images}
          title={block.images[0]?.alt ?? ''}
          labels={{ ...navLabels, image: ui.image }}
        />
      );
    }
    case 'related': {
      const items = block.items.flatMap((item) => {
        const media = img(item.media);
        return media ? [{ href: pagePath(locale, item.page), label: item.label, media }] : [];
      });
      if (!items.length) return null;
      return <Related key={key} title={block.title} items={items} labels={navLabels} />;
    }
    case 'gallery_category': {
      const images = block.images.flatMap((ref) => {
        const media = img(ref);
        return media ? [{ media, caption: ref.caption }] : [];
      });
      const navLink = (page: typeof block.prev) => ({ href: pagePath(locale, page), label: routes[page].label[locale] });
      return (
        <GalleryCategory
          key={key}
          title={block.title}
          prev={navLink(block.prev)}
          next={navLink(block.next)}
          images={images}
          labels={{
            prev: ui.carouselPrev,
            next: ui.carouselNext,
            carouselPrev: ui.carouselPrev,
            carouselNext: ui.carouselNext,
            close: ui.close,
            image: ui.image,
            galleryViewer: ui.galleryViewer,
            galleryNav: ui.galleryNav,
            previousGallery: ui.previousGallery,
            nextGallery: ui.nextGallery,
            loadMore: ui.loadMore,
          }}
        />
      );
    }
    default:
      return null;
  }
}
