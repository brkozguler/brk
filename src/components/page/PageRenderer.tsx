import type { Locale } from '@/i18n/config';
import type { PageKey } from '@/i18n/routes';
import type { PageContent } from '@/content/types';
import {
  breadcrumbJsonLd,
  hotelJsonLd,
  organizationJsonLd,
  websiteJsonLd,
  type JsonLd as JsonLdData,
} from '@/lib/jsonld';
import { renderBlock } from '@/components/blocks/registry';
import { Breadcrumb } from './Breadcrumb';
import { JsonLd } from './JsonLd';

interface Props {
  locale: Locale;
  pageKey: PageKey;
  page: PageContent;
}

/** Blokları sırayla çizer; iç sayfalarda hero'dan sonra breadcrumb ekler. */
export function PageRenderer({ locale, pageKey, page }: Props) {
  const data: JsonLdData[] = [organizationJsonLd(), websiteJsonLd(locale)];
  const hotel = hotelJsonLd(locale);
  if (hotel) data.push(hotel);
  if (pageKey !== 'home') data.push(breadcrumbJsonLd(locale, pageKey));

  const blocks = page.blocks.map((block, i) => renderBlock(block, i, locale));
  const heroFirst = page.blocks[0]?.type === 'hero';
  const breadcrumb = pageKey !== 'home' ? <Breadcrumb locale={locale} pageKey={pageKey} /> : null;

  return (
    <>
      <JsonLd data={data} />
      {heroFirst ? (
        <>
          {blocks[0]}
          {breadcrumb}
          {blocks.slice(1)}
        </>
      ) : (
        <>
          {breadcrumb}
          {blocks}
        </>
      )}
    </>
  );
}
