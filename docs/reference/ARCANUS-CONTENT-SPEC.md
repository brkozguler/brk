# Arcanus — İçerik Spesifikasyonu

> **Amaç:** Referans sitenin (Mākena) layout'u belirli metin uzunluklarına göre tasarlandı. İçerik bu uzunluklara **yazılacak**, sonradan sığdırılmayacak.
> **Yöntem:** Mākena'nın her block'undaki metin alanlarının karakter sayıları production payload'ından ölçüldü (HTML etiketleri temizlenmiş düz metin).
> **Tarih:** 2026-10-03

---

## 01. Neden karakter bütçesi

Mākena'da başlık ve metin alanlarının genişlikleri sabit:

| Alan               | Ölçülen genişlik @1440                       | Font                |
| ------------------ | -------------------------------------------- | ------------------- |
| Hero H1            | `max-w-[73rem]` = **700,8px**                | 52,8px / lh 63,36px |
| Intro H2           | `l:max-w-[80rem]` = **768px** (grid 880,6px) | 33,6px / lh 47,04px |
| Feature5050 başlık | 1 grid kolonu ≈ **377px** (`pr-[5%]`)        | 28,8px / lh 40,32px |
| Feature5050 gövde  | aynı kolon ≈ **377px**                       | 14,4px / lh 23,04px |
| Storytelling gövde | `l:max-w-[57.2rem]` = **549,1px**            | 14,4px / lh 23,04px |
| BannerScale başlık | `max-w-[57.4rem]` = **551px**                | 38,4px              |

> ⚠️ **Bütçeler Mākena'nın fontlarıyla (IvyMode + Messina Sans) ölçüldü.** Bizim fontlarımız **Kudryashev Display Contrast** (başlık) ve **Inter** (gövde) — karakter genişlikleri farklı. PHASE 02'de, gerçek fontlar yüklendikten sonra bütçeler 1440px'te **yeniden doğrulanacak**; sapma varsa §02 tablosu güncellenecek. Şu anki bütçeler çalışma tabanıdır, nihai değil.

Metin bu genişlikleri aşarsa satır sayısı artar → section yüksekliği değişir → **scroll timeline kayar, parallax oranları bozulur, pixel-perfect eşleşme biter.**

Ayrıca `AnimatedText` satır bazlı (`type: "lines"`) split yapıyor: satır sayısı değişirse stagger süresi ve animasyonun toplam uzunluğu da değişir.

---

## 02. Ölçülen karakter bütçeleri `[VERIFIED]`

Mākena production payload'ından, 7 sayfa × tüm block'lar taranarak çıkarıldı.

| Block                                          | Alan                   | Ölçülen değerler                  | **Bütçe (hedef)**       | Satır sayısı @desktop |
| ---------------------------------------------- | ---------------------- | --------------------------------- | ----------------------- | --------------------- |
| `hero`                                         | eyebrow                | 4 · 5 · 7 · 7 · 11 · 11           | **4–12**                | 1                     |
| `hero`                                         | title                  | 5 · 10 · 15 · 16 · 17 · 17 · 29   | **14–32**               | 2                     |
| `hero`                                         | subtitle               | 0 (boş)                           | **0–90**                | 1–2                   |
| `intro`                                        | text                   | 140 · 183 · 184 · 197 · 219 · 283 | **150–230**             | 3–4                   |
| `content`                                      | eyebrow                | 8                                 | **6–14**                | 1                     |
| `content`                                      | title                  | 61                                | **45–70**               | 2                     |
| `content`                                      | text                   | 392                               | **330–420**             | 5–6                   |
| `feature5050`                                  | eyebrow                | 12                                | **8–16**                | 1                     |
| `feature5050`                                  | title                  | 16 · 19 · 24 · 70                 | **16–30**               | 1–2                   |
| `feature5050`                                  | text                   | 236 · 264 · 307 · 416             | **240–330**             | 5–7                   |
| `experience5050`                               | title                  | 4 · 8 · 9 · 16 · 22               | **6–24**                | 1                     |
| `experience5050`                               | text                   | 176 · 283 · 290 · 301 · 363       | **180–300**             | 4–6                   |
| `banner_scale`                                 | eyebrow / title / text | (ana sayfada boş)                 | **0–14 / 0–40 / 0–240** | —                     |
| `image_carousel`                               | title                  | 20                                | **16–28**               | 1                     |
| `image_carousel`                               | text                   | 47 · 149                          | **60–150**              | 2–3                   |
| `image_carousel`                               | label (CTA)            | 11                                | **6–14**                | 1                     |
| `listings5050`                                 | eyebrow                | 11                                | **8–14**                | 1                     |
| `listings5050`                                 | title                  | 26                                | **20–32**               | 1–2                   |
| `listings5050`                                 | text                   | 171                               | **140–190**             | 3–4                   |
| `experiences_carousel`                         | title                  | 27                                | **20–34**               | 1–2                   |
| `experiences_carousel`                         | text                   | 137                               | **110–160**             | 2–3                   |
| `experiences_carousel`                         | kart başlığı           | 4 · 8 · 9 · 16                    | **4–20**                | 1                     |
| `accordion5050`                                | title                  | 21                                | **16–28**               | 1                     |
| `accordion5050`                                | text                   | 109                               | **90–130**              | 2–3                   |
| `story_slider`                                 | title                  | 37                                | **28–44**               | 1–2                   |
| `story_slider`                                 | text                   | 128                               | **100–150**             | 2–3                   |
| `explore_more`                                 | title                  | 12                                | **8–16**                | 1                     |
| `real_estate_overview` → bizde `overview_cards` | title                  | 5 · 11 · 14 · 19 · 19 · 21        | **5–22**                | 1                     |
| buton etiketi                                  | —                      | 11 ("LEARN MORE")                 | **6–14**                | 1                     |

> **Not:** Mākena'daki iki aşırı değer (`feature5050.title` 70, `content.text` 392) bilinçli istisna. Bizim bütçelerimiz **medyan etrafında daraltılmış** — hem güvenli hem tutarlı.

---

## 03. Dil genişleme katsayıları

Layout İngilizce'ye göre tasarlandı. Aynı anlamı ifade eden metin dile göre uzar:

| Dil           | Latin/İngilizce'ye oran | Bütçeye etkisi                                         |
| ------------- | ----------------------- | ------------------------------------------------------ |
| **İngilizce** | 1,00 (referans)         | —                                                      |
| **Türkçe**    | ~1,10–1,20              | Sondan eklemeli yapı; uzun kelimeler                   |
| **Almanca**   | ~1,20–1,35              | **En riskli** — birleşik kelimeler satır kırmayı bozar |
| **Rusça**     | ~1,05–1,15              | Kiril glifleri Latin'den biraz geniş                   |

### Kural

> **Her dil, §02'deki karakter bütçesinin içinde kalacak.**
> Bu, Türkçe'nin "çevrilmiş İngilizce" olmayacağı anlamına gelir — **Türkçe doğrudan bütçeye yazılır**, sonra diğer diller aynı bütçeye **lokalize edilir** (birebir çeviri değil).

### Almanca için ek önlem

```css
.title-s,
.title-m,
.title-l,
.display {
  hyphens: auto;
  overflow-wrap: break-word;
}
```

`<html lang="de">` ile birlikte tarayıcı Almanca heceleme sözlüğünü kullanır. Yine de her DE sayfası 1440 ve 390'da görsel olarak kontrol edilecek.

---

## 04. Ton ve dil

| Boyut           | Karar                                                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Hitap           | **Siz** (resmî ama sıcak). "Sen" kullanılmaz.                                                                                        |
| Kişi            | Otel için **"biz"** değil, çoğunlukla **nesnel 3. tekil** ("Arcanus Hotels Sorgun … sunuyor"). Mākena'nın tonu bu.                   |
| Cümle uzunluğu  | Ortalama 12–18 kelime. Uzun tamlama zinciri yok.                                                                                     |
| Sıfat yoğunluğu | **Düşük.** "Eşsiz, muhteşem, benzersiz, unutulmaz" gibi boş sıfatlar yasak. Somut bilgi tercih edilir (24 m², 7 kaydırak, 4–11 yaş). |
| Ünlem           | Yok.                                                                                                                                 |
| Emoji           | Yok.                                                                                                                                 |
| Eyebrow         | **BÜYÜK HARF**, 1–2 kelime, tematik etiket (GENEL BAKIŞ, GASTRONOMİ, KONAKLAMA)                                                      |
| H1              | Fiilsiz veya tek fiilli, şiirsel ama abartısız. 2 satıra kırılacak şekilde.                                                          |
| CTA             | 1–2 kelime, büyük harf: **KEŞFET · DAHA FAZLASI · REZERVASYON**                                                                      |
| Rakam           | Türkçe yazımda ondalık **virgül**, binlik **nokta** (24 m², 1.200 m²)                                                                |
| Türkçe karakter | `ı İ ş ğ ü ö ç` tam kullanılacak — ASCII'ye düşürme yok                                                                              |

### Yasaklı kalıplar

```
❌ "Hayalinizdeki tatil sizi bekliyor"
❌ "Unutulmaz anlar için"
❌ "Eşsiz bir deneyim"
❌ "Tatilin tadını çıkarın!"
❌ "Siz de ailenizle..."
✅ "Çam ormanının kumsala indiği noktada"
✅ "24 m², bahçe ya da deniz manzarası"
✅ "4–11 yaş arası çocuklar için"
```

---

## 05. Doğrulanmış tesis bilgileri

Mevcut siteden (`arcanushotelssorgun.com`) alındı — içerikte **bu bilgiler dışına çıkılmayacak**, eksik bilgi için otelden teyit istenecek.

### Künye

```
Ad       : Arcanus Hotels Sorgun
Konum    : Sorgun Mevkii, Acısu Cd. No:8, Manavgat / Antalya
Bölge    : Side / Sorgun — denize sıfır, çam ormanı içinde
Telefon  : +90 (242) 642 03 10   (çağrı merkezi — header / menü / footer)
E-posta  : info@arcanushotels.com
Konsept  : Her şey dahil

— 2026-10-05, resmî sitenin /iletisim sayfasından doğrulandı (iletişim sayfası için):
Posta kodu : 07600  → "Sorgun Mevkii, Acısu Cd. No:8 · 07600 Manavgat / Antalya"
Resepsiyon : +90 (242) 756 93 21
Faks       : +90 (242) 756 93 20
Belge      : Kültür ve Turizm Bakanlığı — Turizm İşletme Belge Numarası 2574
```

> Kodda tek kaynak: `src/lib/nav.ts` → `CONTACT` (Faz 2'de `/settings`).

### Odalar

| Oda                 |     m² | Kapasite                               | Manzara                      | Özellikler                               |
| ------------------- | -----: | -------------------------------------- | ---------------------------- | ---------------------------------------- |
| Standart Oda        | **24** | 2 Yetişkin + 1 Çocuk · veya 3 Yetişkin | Bahçe · yandan deniz · deniz | Balkon                                   |
| Family Suite        | **38** | 2 Yet. + 2 Çoc. · veya 3 Yet. + 1 Çoc. | Deniz                        | 2 yatak odası, jakuzili balkon           |
| Superior Aile Odası | **48** | 3 Yet. + 2 Çoc. · veya 4 Yet. + 1 Çoc. | Deniz · yandan deniz         | 2 yatak odası, 2 banyo                   |
| Deluxe Aile Odası   | **72** | 3 Yet. + 4 Çoc. · veya 4 Yet. + 3 Çoc. | Deniz                        | 2 yatak odası, oturma odası, mini mutfak |

> ✅ 2026-10-05: tüm oda bilgileri (kapasite, yatak düzeni, banyo, balkon, donanım) otelin
> dokümanlarında — **kaynak `docs/rooms/*.md`** (7 oda/varyant, 4 dil). Aşağıdaki tablo ile çelişirse doküman geçerli.

#### Standart Oda — otelden (kullanıcı, 2026-10-05)

Yatak: çift kişilik ya da iki ayrı yatak + açılabilir tek kişilik koltuk.
Donanım: Wi-Fi · LCD TV · telefon · minibar · çay ve kahve hazırlama seti · su ısıtıcısı ·
kasa · makyaj aynası · saç kurutma makinesi · terlik · laminat zemin. Merkezi ısıtma ve
soğutma mevsime bağlı olarak belirli saatlerde çalışır. (§14 #4–#5 bu oda için kapandı.)

### Restoranlar (8)

> ✅ 2026-10-05: restoran bilgileri otelin dokümanlarında — **kaynak `docs/venues/restaurants/*.md`** (4 dil).
> **Sahil Snack** (sahil alanı, 170 kişi) dokümanla teyit edildi ve eklendi. Kavram: **Ultra Her Şey Dahil**;
> à la carte: konaklama boyunca toplam 1 ücretsiz rezervasyon, ikincisi ücretli; şort/mayo/terlikle giriş yok.

Ana Restoran (açık büfe, 700 kişi) · Türk A'la Carte · İtalyan A'la Carte · Meksika A'la Carte · Uzakdoğu A'la Carte · Balık A'la Carte · Aqua Snack (aquapark, 128 kişi) · Sahil Snack (sahil, 170 kişi)

### Barlar (10)

> ✅ 2026-10-05: bar bilgileri otelin dokümanlarında — **kaynak `docs/venues/bars/*.md`** (4 dil).
> **Bistro Sorgun** (kapalı alan + teras, 50 kişi, à la carte) dokümanla teyit edildi ve eklendi.
> Ultra premium yabancı / premium yerli alkol ek ücretli; 18 yaş altına alkol servisi yok.

Lobi Bar · Arcanus Kahve Evi · Havuz Bar · Sahil Bar · Disco Bar · Aqua Bar · Pastane · Passion Kokteyl Bar · İskele Bar · Bistro Sorgun

### Aktiviteler (6)

> ✅ 2026-10-05: aktivite bilgileri otelin dokümanlarında — **kaynak `docs/venues/activities/*.md`** (4 dil).
> Yeni teyitler: ana havuz **1.200 m²**; spa: hamam, sauna, masaj, spa ürünleri/uygulamaları, güzellik
> merkezi, kuaför; çocuk kulübü aquapark / Aqua Snack / **Aqua Splash Park** yanında; pavilyon ikram ve
> içecek listesi, öğle yemeği ayrıca ücretli; aktivite listesi (aerobik, su aerobiği, jimnastik, yoga,
> tenis, masa tenisi, plaj voleybolu, okçuluk, fitness, boccia, dart, dama, satranç, canlı müzik/şov, çocuk diskosu).

- **Yüzme Havuzları** — ana havuz, kapalı havuz, çocuk havuzu, **7 kaydıraklı Aqua Havuzu**
- **Çocuk Kulübü** — **4–11 yaş**
- **Aktivite & Eğlence** — gündüz spor/oyun, akşam canlı müzik ve şov
- **Spa**
- **Pavilyon** — rezervasyonla, **ücretli**
- **Toplantı** — toplantı salonu, kurumsal buluşmalar

### Diğer

Denize uzanan **iskele** var (İskele Bar ile bağlantılı).

### ⚠️ Eksik — otelden teyit alınacak

- Oda sayısı (toplam)
- Yıldız sayısı
- Açılış/yenileme yılı
- Check-in / check-out saatleri
- Spa hizmet listesi (hamam, sauna, masaj türleri)
- Toplantı salonu kapasitesi ve m²
- Plaj uzunluğu, mavi bayrak durumu
- Havalimanına mesafe (AYT ≈ 65 km — **teyit gerekli**)
- Ücretli/ücretsiz hizmet ayrımı (her şey dahil kapsamı)
- Evcil hayvan, engelli erişimi, otopark

> Bu bilgiler **`Hotel` JSON-LD şeması** için de gerekli (`starRating`, `checkinTime`, `amenityFeature`, `geo`). Google Hotels görünürlüğü buna bağlı.

---

## 06. Sayfa → Block planı

Mākena'nın block dizilimleri otel içeriğine uyarlandı. Block tipleri birebir aynı; isimler korunuyor.

### Ana sayfa — `/tr/`

```
hero                    eyebrow + title
intro                   text
banner_scale            (sadece görsel)
content                 eyebrow + title + text          → GENEL BAKIŞ
storytelling            text + 2 görsel                 → konum/doğa anlatısı
spacer ×2
banner_full             (sadece görsel)
feature5050             eyebrow + title + text + CTA    → KONAKLAMA
image_carousel_offset   eyebrow + title + text + 4 GÖRSEL → oda tipleri (kartlarda başlık/CTA YOK — Mākena böyle)
listings5050            eyebrow + title + text + 6 madde + CTA → GASTRONOMİ (restoran listesi, 6 sn otomatik)
experiences_carousel    title + text + 6 kart           → aktiviteler
explore_more            title + 4 link
```

### Hakkımızda — `/tr/hakkimizda/`

```
hero → intro → feature5050 (Misyon) → storytelling → spacer
→ banner_full → feature5050 (Vizyon) → image_carousel → spacer → explore_more
```

> Mākena'daki `globe` ve `destination_map` **çıkarıldı** (WebGL maliyeti, otelde karşılığı yok).

### Konaklama — `/tr/konaklama/`

> ⚠️ **2026-10-04 — geçici uygulama:** kullanıcı isteğiyle konaklama sayfaları
> ŞİMDİLİK **galeri şablonunun kopyası**: `/tr/konaklama/` = slim hero + 4 oda
> kartı (`gallery_grid`); oda sayfası = başlık + önceki/sonraki oda + görsel
> ızgarası + lightbox (`gallery_category`, `navNamespace: rooms`). Aşağıdaki
> plan ve metinler hazır; bloklar yazılınca buraya geçilecek.

```
hero (slim) → overview_cards (4 kart, 2 kolon)   ← Arcanus kendi sitesi (RE Ek C), 2026-10-04; intro/feature5050/explore_more düştü
```

### Oda detay — `/tr/konaklama/{oda}/`

```
hero (slim · eyebrow + h1 — Arcanus kendi sitesi, 2026-10-05) → detail_title (ad · asHeading false) → detail_body (lead + metin · ikonlu bilgiler + CTA)
→ media_slider (Mākena kaeo, 3 görsel) → media_carousel → explore_more   ← Yellowstone şablonu (RE Ek B) + kaeo slider'ı (RE §17.5.1), 2026-10-04; photo_grid kaldırıldı
```

### Restoranlar — `/tr/restoranlar/`

```
hero (slim) → overview_cards (7 kart, 3 kolon)   ← Arcanus kendi sitesi (RE Ek C.1), 2026-10-04 · detay: oda detayı şablonu
```

### Barlar — `/tr/barlar/`

```
hero (slim) → overview_cards (9 kart, 3 kolon)   ← Arcanus kendi sitesi (RE Ek C.1), 2026-10-04 · detay: oda detayı şablonu
```

> 9 blok uzun bir sayfa yapar. **Alternatif:** 3 öne çıkan bar için `experience5050`, kalan 6'sı için kompakt `bar_grid`. Tasarım aşamasında karar verilecek.

### Aktiviteler — `/tr/aktiviteler/`

```
hero (slim) → overview_cards (6 kart, 3 kolon)   ← Arcanus kendi sitesi (RE Ek C.1), 2026-10-04
```

### Aktivite detay — `/tr/aktiviteler/{aktivite}/`

```
hero (slim · eyebrow + h1 — Arcanus kendi sitesi, 2026-10-05) → detail_title (ad · asHeading false) → detail_body → media_slider → media_carousel → explore_more   ← oda detayı şablonu, 2026-10-04
```

### Galeri — `/tr/galeri/`

```
hero → gallery_grid
```

### Galeri kategorileri — `/tr/galeri/{kategori}/` (6 sayfa)

```
gallery_category        title + prev/next + 12 görsel + lightbox   (hero YOK — Mākena böyle)
```

### İletişim — `/tr/iletisim/`

```
hero (slim) → contact_details   ← Arcanus kendi sitesi (RE Ek C.2), 2026-10-05
```

> `contact_form` (+ Turnstile, `POST /api/v1/inquiries`) **Faz 2** — referans
> sayfada form yok; alan etiketleri CONTENT-TR §10'da hazır bekliyor.

### KVKK / Aydınlatma Metni

```
hero → longform
```

> Hukuki metinler — otelin mevcut metinleri kullanılacak, yeniden yazılmayacak.

---

## 07. SEO metin bütçeleri

| Alan                | Bütçe                       | Not                                                                                                   |
| ------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------- |
| `<title>`           | **50–60 karakter**          | Marka adı dahil: `{Sayfa} \| Arcanus Hotels Sorgun` = 28 karakter sabit → sayfa adına **22–32** kalır |
| `meta description`  | **120–155 karakter**        | Her sayfa benzersiz                                                                                   |
| `og:title`          | ≤ 60                        | `<title>` ile aynı olabilir                                                                           |
| `og:description`    | ≤ 155                       |                                                                                                       |
| `<h1>`              | hero.title ile aynı (14–32) | Sayfada tek                                                                                           |
| `alt` metni         | 60–125 karakter             | Anahtar kelime doldurma yok                                                                           |
| Sayfa toplam kelime | **300–600**                 | Otel sayfaları için yeterli; "ince içerik" eşiğinin üstü                                              |

> Mevcut TR `<title>` = `Arcanus Hotels Sorgun | Side Antalya Her Şey Dahil Otel` = **56 karakter** ✔ bütçe içinde, korunabilir.

---

## 08. Çalışma akışı

```
1. TR içerik yazılır       → bütçeye göre, docs/ARCANUS-CONTENT-TR.md
2. Karakter sayımı          → her alan otomatik kontrol edilir
3. Onay                     → otel tarafı içeriği onaylar, eksik bilgiler tamamlanır
4. EN / DE / RU lokalizasyon → aynı bütçeye, çeviri değil lokalizasyon
5. JSON'a aktarım           → src/content/{locale}/*.json  (PHASE 01'de şema netleşince)
6. Layout doğrulaması       → her dil × 1440 + 390'da satır sayısı kontrolü
```

### Karakter sayımı script'i

```bash
node -e "
const c = require('./src/content/tr/home.json');
const strip = s => String(s).replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
const walk = (o, p='') => Object.entries(o).forEach(([k,v]) =>
  typeof v === 'string' ? console.log((p+k).padEnd(40), strip(v).length)
  : v && typeof v === 'object' && walk(v, p+k+'.'));
walk(c);
"
```

CI'da bütçe aşımı **uyarı** üretir (hata değil — tasarım kararı gerekebilir).
