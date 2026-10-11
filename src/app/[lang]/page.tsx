import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { asLocale } from '@/i18n/config';
import { getPage } from '@/content/pages';
import { pageMetadata } from '@/lib/seo';
import { PageRenderer } from '@/components/page/PageRenderer';

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = asLocale((await params).lang);
  const page = getPage('home', locale);
  return page ? pageMetadata(locale, 'home', page.meta) : {};
}

export default async function HomePage({ params }: Props) {
  const locale = asLocale((await params).lang);
  const page = getPage('home', locale);
  if (!page) notFound();

  return <PageRenderer locale={locale} pageKey="home" page={page} />;
}
