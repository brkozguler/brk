/**
 * Site geneli sabitler. İletişim ve adres bilgileri tek kaynaktan buradan beslenir;
 * Google İşletme Profili ile birebir aynı olmalıdır (NAP tutarlılığı).
 *
 * Doğrulanmamış hiçbir bilgi girilmez; boş alan "henüz yok" demektir ve
 * ilgili bileşen o alanı göstermez.
 */
export interface PostalAddress {
  street: string;
  district: string;
  city: string;
  postalCode: string;
  country: 'TR';
  lat: number;
  lng: number;
}

export interface SiteConfig {
  name: string;
  url: string;
  /** Online rezervasyon motoru adresi. Boşken buton iletişim sayfasına gider. */
  bookingUrl: string | null;
  contact: {
    phone: string | null;
    email: string | null;
    whatsapp: string | null;
  };
  address: PostalAddress | null;
  social: { name: string; url: string }[];
}

export const site: SiteConfig = {
  name: 'Arcanus Hotels Sorgun',
  url: 'https://arcanushotelssorgun.com',
  bookingUrl: null,
  contact: {
    phone: null,
    email: null,
    whatsapp: null,
  },
  address: null,
  social: [],
};
