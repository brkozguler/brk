import { serializeJsonLd, type JsonLd as JsonLdData } from '@/lib/jsonld';

/** Build'de üretilen, kullanıcı girdisi içermeyen JSON-LD'yi <head> yerine gövdeye gömer. */
export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
  );
}
