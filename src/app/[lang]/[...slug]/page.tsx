import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { asLocale, isLocale } from '@/i18n/config';
import { pageSegments, resolvePage } from '@/i18n/routes';
import { getPage, publishedKeys } from '@/content/pages';
import { pageMetadata } from '@/lib/seo';
import { NotFound } from '@/components/page/NotFound';
import { PageRenderer } from '@/components/page/PageRenderer';

export const dynamicParams = false;

interface Props {
  params: Promise<{ lang: string; slug: string[] }>;
}

/** Yalnızca o dilde içeriği olan sayfalar üretilir; ana sayfa [lang]/page.tsx'tedir. */
export function generateStaticParams({ params }: { params: { lang: string } }) {
  if (!isLocale(params.lang)) return [];
  return publishedKeys(params.lang)
    .filter((key) => key !== 'home')
    .map((key) => ({ slug: pageSegments(params.lang as never, key) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = asLocale(lang);
  const key = resolvePage(locale, slug);
  const page = key ? getPage(key, locale) : null;
  return key && page ? pageMetadata(locale, key, page.meta) : {};
}

export default async function LocalizedPage({ params }: Props) {
  const { lang, slug } = await params;
  const locale = asLocale(lang);
  const key = resolvePage(locale, slug);
  const page = key ? getPage(key, locale) : null;
  if (!key || !page) notFound();

  if (key === 'not-found') return <NotFound locale={locale} />;

  return <PageRenderer locale={locale} pageKey={key} page={page} />;
}
