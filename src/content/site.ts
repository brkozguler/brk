/**
 * Site geneli sabitler. İletişim ve adres bilgileri tek kaynaktan buradan beslenir;
 * Google İşletme Profili ile birebir aynı olmalıdır (NAP tutarlılığı).
 *
 * Aşağıdaki iletişim bilgileri resmî sitenin /iletisim sayfasından
 * 2026-10-05'te doğrulandı (önceki çalışma, ARCANUS-CONTENT-SPEC §05).
 * Doğrulanmamış hiçbir bilgi girilmez; boş alan "henüz yok" demektir.
 */
export interface PostalAddress {
  street: string;
  district: string;
  city: string;
  postalCode: string;
  country: 'TR';
  lat: number | null;
  lng: number | null;
}

export interface SiteConfig {
  name: string;
  url: string;
  /** Online rezervasyon motoru adresi. Boşken buton iletişim sayfasına gider. */
  bookingUrl: string | null;
  contact: {
    /** Çağrı merkezi — header, menü, footer */
    phone: string;
    reception: string;
    fax: string;
    email: string;
    whatsapp: string | null;
  };
  address: PostalAddress;
  /** Kültür ve Turizm Bakanlığı turizm işletme belge numarası */
  licence: string;
  social: { name: string; url: string }[];
}

export const site: SiteConfig = {
  name: 'Arcanus Hotels Sorgun',
  url: 'https://arcanushotelssorgun.com',
  bookingUrl: null,
  contact: {
    phone: '+90 242 642 03 10',
    reception: '+90 242 756 93 21',
    fax: '+90 242 756 93 20',
    email: 'info@arcanushotels.com',
    whatsapp: null,
  },
  address: {
    street: 'Sorgun Mevkii, Acısu Cd. No:8',
    district: 'Manavgat',
    city: 'Antalya',
    postalCode: '07600',
    country: 'TR',
    lat: null,
    lng: null,
  },
  licence: '2574',
  social: [],
};

/** tel: bağlantısı için boşluksuz numara */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
