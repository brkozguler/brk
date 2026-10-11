import { site } from '@/content/site';

/** Siteye göre yolu mutlak adrese çevirir: /tr/ → https://.../tr/ */
export function absoluteUrl(path: string): string {
  return `${site.url}${path}`;
}
