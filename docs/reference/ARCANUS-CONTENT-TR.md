# Arcanus — Türkçe İçerik Taslağı

> **Bütçe kaynağı:** [`ARCANUS-CONTENT-SPEC.md`](./ARCANUS-CONTENT-SPEC.md) §02
> **Format:** `alan › metin` — karakter sayıları `scripts/count-content.mjs` ile doğrulanır
> **Durum:** Taslak — otel onayı bekliyor. ⚠️ işaretli yerlerde teyit gereken bilgi var.
> **Tarih:** 2026-10-03

Tüm metinler `ARCANUS-CONTENT-SPEC.md` §05'teki doğrulanmış tesis bilgilerine dayanır. **Uydurulmuş özellik, rakam veya hizmet yoktur** — bilinmeyen her şey ⚠️ ile işaretlendi.

## Bütçe durumu

`node scripts/count-content.mjs tr` çıktısı (2026-10-03):

```
Ölçülen alan  : 301
✓ Bütçe içi   : 101
⊘ Muaf        :  95   (özel ad / yapısal alan)
✗ UZUN        :   0   ← layout'u bozar — YOK ✔
⚠ KISA        :  56   ← layout güvenli, zenginleştirilebilir
```

**UZUN = 0.** Hiçbir metin layout'u bozacak kadar uzun değil; scroll timeline ve parallax oranları güvende.

**KISA = 56** — bunların büyük kısmı, otelden teyit beklenen 18 bilgi (§14) eksik olduğu için kısa. Boş sıfatla doldurulmadı (ton kuralı §04). Bilgiler gelince ilgili metinler bütçenin üst bandına çıkarılacak. Kısa metin layout'u bozmaz, sadece section'ı referanstan daha boş gösterir.

---

## 1. Ana Sayfa — `/tr/`

### HOME-01 · hero

```
eyebrow   › HOŞ GELDİNİZ
title     › Çamların denize indiği yer
subtitle  › Side Sorgun'da, denize sıfır bir her şey dahil tatil
```

### HOME-02 · intro

```
text      › Akdeniz'in turkuaz mavisiyle Sorgun'un çam ormanı burada buluşuyor. Arcanus Hotels Sorgun, denize sıfır konumunda, günü kendi temponuzda kurabileceğiniz bir tatil alanı sunuyor.
```

### HOME-03 · banner_scale

```
(yalnızca görsel — metin yok)
görsel    › Havadan çekim: çam ormanı, otel ve kumsal aynı karede
```

### HOME-04 · content

```
eyebrow   › GENEL BAKIŞ
title     › Çam ormanının kumsala indiği noktada, denize sıfır
text      › Arcanus Hotels Sorgun, Side'nin Sorgun bölgesinde yer alıyor. Standart odalardan geniş aile suitlerine uzanan oda tipleri bahçeye ya da denize bakıyor; hepsi sade ve modern bir düzenle hazırlandı. Yüzme havuzları, su kaydırakları, çocuk kulübü, spa ve denize uzanan iskelesiyle otel, günü kendi temponuzda kurmanıza alan bırakıyor.
```

### HOME-05 · storytelling

```
text      › Sabah kahvaltısıyla başlayan gün, havuz başında ya da iskelenin ucunda uzun bir öğleden sonraya dönüşüyor. Akşam ise sofralar kuruluyor, müzik başlıyor. Her şey dahil konsept, planlamayı bırakıp tatile odaklanmanız için kurgulandı.
görsel 1  › Kumsaldan otele bakış (yatay, 4:3 — mobilde 3:4)
görsel 2  › İskele detayı, gün batımı (dikey, 3:4 — mobilde 4:3)
```

### HOME-06 / HOME-07 · spacer ×2

```
(boşluk — metin yok)
```

### HOME-08 · banner_full

```
(yalnızca görsel — tam ekran parallax)
görsel    › Deniz ve iskele, geniş açı
```

### HOME-09 · feature5050 — Konaklama

```
eyebrow   › KONAKLAMA
title     › Tatilin en konforlu hali
text      › Standart odalardan 72 m²'lik Deluxe Aile Odalarına kadar dört farklı oda tipi var. Her birinde balkon, bahçe ya da deniz manzarası bulunuyor. Aile odalarında iki ayrı yatak odası, Family Suite'te jakuzili balkon yer alıyor.
cta       › KEŞFET
görsel    › Deluxe Aile Odası, oturma alanı
```

### HOME-10 · room_carousel (image_carousel_offset)

> 2026-10-04: Mākena'da bu carousel'in kartları **yalnızca görsel** — altında
> başlık, bilgi satırı ya da CTA yok, kart tıklanabilir de değil. Kart
> adları yalnızca `alt` metni olarak kullanılıyor; CTA kaldırıldı.

```
eyebrow   › ODALAR
title     › Size uygun oda tipi
text      › Dört oda tipi, 24 m²'den 72 m²'ye. Kapasite, manzara ve donanım farklarını karşılaştırın.
kart 1    › Standart Oda
kart 2    › Family Suite
kart 3    › Superior Aile Odası
kart 4    › Deluxe Aile Odası
```

### HOME-11 · listings5050 — Gastronomi

> 2026-10-04: Mākena'nın HOME-11'i `feature5050` değil **`listings5050`** —
> madde listesi + üst üste görseller, 6 saniyede bir otomatik ilerleyen alt
> çizgi. Blok buna çevrildi; eski feature5050 metni restoranlar sayfasına
> aktarılabilir.

```
eyebrow   › GASTRONOMİ
title     › Her akşam başka bir sofra
text      › Günün her öğününde açık olan Ana Restaurant'ın yanında beş à la carte restoran ve havuz başı snack noktası var. Akşam yemeğinizi her gün başka bir mutfakta planlayabilirsiniz.
cta       › KEŞFET
madde 1   › Ana Restaurant
madde 2   › Türk A'la Carte
madde 3   › İtalyan A'la Carte
madde 4   › Meksika A'la Carte
madde 5   › Uzakdoğu A'la Carte
madde 6   › Balık A'la Carte
görsel    › her madde için 3:4 restoran görseli (6 adet)
```

### HOME-12 · experiences_carousel

```
title     › Keşfedilecek her şey burada
text      › Havuzlardan çocuk kulübüne, spadan pavilyonlara — herkesin kendi tatilini kurabileceği geniş bir alan.
kart 1    › Yüzme Havuzları
kart 2    › Çocuk Kulübü
kart 3    › Aktivite & Eğlence
kart 4    › Spa
kart 5    › Pavilyon
kart 6    › Toplantı
```

### HOME-13 · explore_more

```
title     › Daha Fazlası
link 1    › KONAKLAMA
link 2    › RESTORANLAR
link 3    › AKTİVİTELER
link 4    › İLETİŞİM
```

---

## 2. Hakkımızda — `/tr/hakkimizda/`

### ABOUT-01 · hero

```
eyebrow   › HAKKIMIZDA
title     › Sorgun'un doğasında bir otel
subtitle  › Çam ormanı, Akdeniz ve kendi temponuzda bir tatil
```

### ABOUT-02 · intro

```
text      › Antalya Side'de, Sorgun'un çam ormanıyla Akdeniz'in buluştuğu kıyıda yer alan Arcanus Hotels Sorgun, ailelere kendi temposunu kurabilecekleri bir tatil alanı sunuyor.
```

### ABOUT-03 · feature5050 — Misyon

```
eyebrow   › MİSYONUMUZ
title     › Sürekliliği olan bir hizmet
text      › Misafir beklentilerini merkeze alan, marka sorumluluğunu ilke edinen bir işletme olarak sektörde sürekliliği sağlamayı hedefliyoruz. Çevikliği ve güler yüzlü hizmet anlayışıyla misafirlerimize, çalışanlarımıza ve çevreye kattığımız değeri artırmayı amaçlıyoruz.
görsel    › Otel girişi / lobi
```

### ABOUT-04 · storytelling

```
text      › Çağın getirdiği yeniliklere hızla uyum sağlamak, sürekli yatırımlarla kendimizi yenilemek ve misafirlerimizin ihtiyaçlarına uygun fiyat seçenekleriyle karşılık vermek prensibimiz. Otelcilik bilgimizi marka kimliğimizle özdeş hale getirmek için çalışıyoruz.
görsel 1  › Otelin genel görünümü (yatay)
görsel 2  › Personel / hizmet detayı (dikey)
```

### ABOUT-05 · spacer

### ABOUT-06 · banner_full

```
görsel    › Çam ormanı ve kıyı şeridi, havadan
```

### ABOUT-07 · feature5050 — Vizyon

```
eyebrow   › VİZYONUMUZ
title     › Tercih edilen bir marka
text      › Gelişime açık öneri ve görüşlere yer vererek sürekli tercih edilen bir marka yaratmak, uluslararası alanda ülkemizi turizmde en iyi şekilde temsil etmek istiyoruz. Vizyonumuzun temel öğesi kalitede devamlılık ve misafir sürekliliğidir.
görsel    › Havuz ve otel cephesi
```

### ABOUT-08 · image_carousel

```
title     › Otelden kareler
text      › Odalardan havuzlara, sofralardan sahile uzanan bir bakış.
```

### ABOUT-09 · spacer

### ABOUT-10 · explore_more

```
title     › Daha Fazlası
```

---

## 3. Konaklama — `/tr/konaklama/`

> ✅ **2026-10-04 — uygulandı (Arcanus kendi sitesi):** `/tr/konaklama/` =
> ROOMS-01 slim hero + **ROOMS-03…06 oda kartları** (`overview_cards`, 2 kolon:
> görsel · başlık · text · kapasite / alan / manzara ikonlu · KEŞFET). Kullanıcı
> kararıyla ROOMS-02 intro, ROOMS-07 spacer, ROOMS-08 feature5050 ve ROOMS-09
> explore_more **kullanılmıyor** (referans sayfada yok); metinler ileride
> gerekirse burada duruyor. Kapasite/manzara metinleri §4 ile aynı kaynaktan.

### ROOMS-01 · hero

```
eyebrow   › KONAKLAMA
title     › Odalar ve aile suitleri
subtitle  › 24 m²'den 72 m²'ye, dört farklı oda tipi
```

### ROOMS-02 · intro

```
text      › Modern tasarım, ferah yaşam alanları ve özenle düşünülmüş detaylar. Arcanus Hotels Sorgun'un dört oda tipinde gün konforla başlıyor, huzurla tamamlanıyor.
```

### ROOMS-03…06 · overview_cards ×4

**Standart Oda**

```
title     › Standart Oda
text      › Modern tasarımın yalın konforla buluştuğu Standart Odalar, balkonundan uzanan bahçe ve Akdeniz manzarasıyla dinlendirici bir konaklama sunuyor.
alan      › 24 m²
kapasite  › 2 Yetişkin + 1 Çocuk · veya 3 Yetişkin
manzara   › Bahçe, yandan deniz veya deniz
cta       › KEŞFET
```

**Family Suite**

```
title     › Family Suite
text      › Akdeniz manzarasını aile konforuyla buluşturan Family Suite, iki ayrı yatak odası ve jakuzili balkonuyla özel bir atmosfer sunuyor.
alan      › 38 m²
kapasite  › 2 Yetişkin + 2 Çocuk · veya 3 Yetişkin + 1 Çocuk
manzara   › Deniz
cta       › KEŞFET
```

**Superior Aile Odası**

```
title     › Superior Aile Odası
text      › Ailelere daha fazla alan ve mahremiyet sunan Superior Aile Odaları, iki ayrı yatak odası ve iki banyosuyla konforlu bir tatil sağlıyor.
alan      › 48 m²
kapasite  › 3 Yetişkin + 2 Çocuk · veya 4 Yetişkin + 1 Çocuk
manzara   › Deniz veya yandan deniz
cta       › KEŞFET
```

**Deluxe Aile Odası**

```
title     › Deluxe Aile Odası
text      › Geniş yaşam alanını aile konforuyla buluşturan Deluxe Aile Odaları; iki yatak odası, oturma odası ve mini mutfağıyla ferah bir düzen sunuyor.
alan      › 72 m²
kapasite  › 3 Yetişkin + 4 Çocuk · veya 4 Yetişkin + 3 Çocuk
manzara   › Deniz
cta       › KEŞFET
```

### ROOMS-07 · spacer

### ROOMS-08 · feature5050

```
eyebrow   › HER ŞEY DAHİL
title     › Odanızda sizi bekleyenler
text      › Tüm odalarda klima, uydu yayınlı televizyon, telefon, kasa, mini bar ve balkon bulunuyor. Banyolarda duş veya küvet, saç kurutma makinesi ve bakım ürünleri yer alıyor. ⚠️ Donanım listesi otelden teyit edilecek.
cta       › REZERVASYON
```

### ROOMS-09 · explore_more

```
title     › Daha Fazlası
```

---

## 4. Oda Detayları

> ✅ **2026-10-04 — uygulandı (Yellowstone şablonu):** oda sayfaları
> `hero (slim · eyebrow + h1 — Arcanus kendi sitesi, 2026-10-05) → detail_title (ad · asHeading false) → detail_body → media_slider (3 görsel,
> Mākena kaeo — kullanıcı kararı, 16:9 banner yerine) →
> media_carousel → explore_more` dizilimiyle kuruldu (RE Ek B; fotoğraf ızgarası
> kullanıcı kararıyla 2026-10-04 gece kaldırıldı).
> Alan eşlemesi: `hero.title` → h1 · `hero.subtitle` → etiket satırı ·
> `specs.alan` → meta (m²) · `intro.text` → lead (`title-s`) · `feature.text` →
> gövde · `specs.kapasite/manzara/yatakodasi/banyo/balkon/ekstra` → ikonlu
> bilgi listesi · `cta` → buton (`/contact`). `feature.eyebrow/title` ve
> `hero.eyebrow` bu şablonda KULLANILMIYOR. `specs.yatak` (⚠️) listede yok.

Dört oda sayfası aynı şablonu kullanır: `hero → intro → room_specs → media_carousel → feature5050 → related_rooms → explore_more`

### 4.1 Standart Oda — `/tr/konaklama/standart-oda/`

```
hero.eyebrow   › KONAKLAMA
hero.title     › Standart Oda
hero.subtitle  › 24 m² · bahçe, yandan deniz veya deniz manzarası

intro.text     › Yalın bir düzen, ferah bir balkon ve gün boyu değişen manzara. Standart Odalar, tatilin temel konforunu sade bir tasarımla sunuyor.

specs.alan      › 24 m²
specs.kapasite  › 2 Yetişkin + 1 Çocuk · veya 3 Yetişkin
specs.manzara   › Bahçe, yandan deniz veya deniz
specs.yatak     › ⚠️ teyit edilecek
specs.banyo     › 1

feature.eyebrow › ODA DÜZENİ
feature.title   › Günün her saatinde ferah
feature.text    › Balkona açılan geniş cam yüzey, odaya gün boyu doğal ışık alıyor. Yatak alanı ve oturma bölümü aynı mekânda, dolaşımı engellemeyecek şekilde yerleştirildi.

cta             › REZERVASYON
```

### 4.2 Family Suite — `/tr/konaklama/family-suite/`

```
hero.eyebrow   › KONAKLAMA
hero.title     › Family Suite
hero.subtitle  › 38 m² · iki yatak odası, jakuzili balkon

intro.text     › İki ayrı yatak odası ve jakuzili balkonuyla Family Suite, aileye hem ortak alan hem kendi köşesini bırakıyor. Tüm suitler deniz manzaralı.

specs.alan      › 38 m²
specs.kapasite  › 2 Yetişkin + 2 Çocuk · veya 3 Yetişkin + 1 Çocuk
specs.manzara   › Deniz
specs.yatakodasi › 2
specs.balkon    › Jakuzili

feature.eyebrow › BALKON
feature.title   › Denize bakan jakuzi
feature.text    › Balkondaki jakuzi, akşamları denizin üzerinden batan güneşe karşı kullanılabiliyor. Balkon oturma grubu, iki kişilik bir akşam için yeterli alan bırakıyor.

cta             › REZERVASYON
```

### 4.3 Superior Aile Odası — `/tr/konaklama/superior-aile-odalari/`

```
hero.eyebrow   › KONAKLAMA
hero.title     › Superior Aile Odası
hero.subtitle  › 48 m² · iki yatak odası, iki banyo

intro.text     › Kalabalık aileler için iki ayrı yatak odası ve iki banyo. Superior Aile Odaları, sabah telaşını paylaşmak zorunda kalmayacağınız bir düzen sunuyor.

specs.alan      › 48 m²
specs.kapasite  › 3 Yetişkin + 2 Çocuk · veya 4 Yetişkin + 1 Çocuk
specs.manzara   › Deniz veya yandan deniz
specs.yatakodasi › 2
specs.banyo     › 2

feature.eyebrow › AİLE DÜZENİ
feature.title   › Herkese kendi alanı
feature.text    › İki yatak odası birbirinden bağımsız; iki banyo sabah ve akşam hazırlıklarını kolaylaştırıyor. Ortak alan, aileyi gün sonunda bir araya getirecek genişlikte.

cta             › REZERVASYON
```

### 4.4 Deluxe Aile Odası — `/tr/konaklama/deluxe-aile-odalari/`

```
hero.eyebrow   › KONAKLAMA
hero.title     › Deluxe Aile Odası
hero.subtitle  › 72 m² · oturma odası ve mini mutfak

intro.text     › Otelin en geniş oda tipi. İki yatak odası, ayrı oturma odası ve mini mutfağıyla Deluxe Aile Odaları, uzun konaklamalar için tasarlandı.

specs.alan      › 72 m²
specs.kapasite  › 3 Yetişkin + 4 Çocuk · veya 4 Yetişkin + 3 Çocuk
specs.manzara   › Deniz
specs.yatakodasi › 2
specs.ekstra    › Oturma odası, mini mutfak

feature.eyebrow › MİNİ MUTFAK
feature.title   › Kendi düzeninizi kurun
feature.text    › Mini mutfak, küçük çocuklu aileler için gün içinde hazırlık yapma imkânı veriyor. Oturma odası yatak odalarından ayrı; akşam saatlerinde ortak alan olarak kullanılabiliyor.

cta             › REZERVASYON
```

---

## 5. Restoranlar — `/tr/restoranlar/`

> ✅ **2026-10-04 — uygulandı (Arcanus kendi sitesi):** indeks = REST-01 slim hero + REST-03…09 kartları (`overview_cards`, 3 kolon: görsel · başlık · text · KEŞFET).
> REST-02 intro yalnızca meta açıklamasında; REST-10/11 kullanılmıyor. Her restoranın DETAY sayfası oda detayı şablonunda (lead = ilk cümle, gövde = kalanı, bilgi satırı: tür · öğün · yer; ⚠️ cümleleri alınmadı). Arcanus sitesindeki "Sahil Snack" §05'te olmadığı için yok.


### REST-01 · hero

```
eyebrow   › GASTRONOMİ
title     › Yedi restoran, yedi sofra
subtitle  › Açık büfeden à la carte akşam yemeğine
```

### REST-02 · intro

```
text      › Günün her öğününde açık olan Ana Restaurant'ın yanında beş à la carte restoran ve havuz başı snack noktası var. Akşam yemeğinizi her gün başka bir mutfakta planlayabilirsiniz.
```

### REST-03…09 · experience5050 ×7

**Ana Restaurant**

```
title     › Ana Restaurant
text      › Kahvaltı, öğle ve akşam yemeğinde açık büfe hizmeti veriyor. Sıcak ve soğuk seçenekler, salata barı, tatlı bölümü ve canlı pişirme istasyonlarıyla gün boyu geniş bir seçki sunuyor.
cta       › KEŞFET
```

**Türk A'la Carte**

```
title     › Türk A'la Carte
text      › Türk mutfağının köklü lezzetlerini Akdeniz akşamlarının sıcak atmosferiyle buluşturuyor. Açık alanda, özenli bir akşam yemeği deneyimi sunuyor. ⚠️ Rezervasyon koşulu teyit edilecek.
cta       › KEŞFET
```

**İtalyan A'la Carte**

```
title     › İtalyan A'la Carte
text      › İtalyan mutfağının sevilen tatlarını zarif bir atmosferde sunuyor. Açık ve kapalı alan seçenekleriyle hava durumundan bağımsız bir akşam yemeği imkânı veriyor.
cta       › KEŞFET
```

**Meksika A'la Carte**

```
title     › Meksika A'la Carte
text      › Meksika mutfağının karakteristik lezzetlerini enerjik bir akşam atmosferiyle buluşturuyor. Baharatlı ve bol çeşitli menüsüyle tatile farklı bir gastronomi deneyimi katıyor.
cta       › KEŞFET
```

**Uzakdoğu A'la Carte**

```
title     › Uzakdoğu A'la Carte
text      › Uzak Doğu mutfağının özgün tatlarını açık havanın ferahlığıyla buluşturuyor. Wok, noodle ve sushi ağırlıklı menüsüyle alışılmışın dışında bir akşam sunuyor. ⚠️ Menü içeriği teyit edilecek.
cta       › KEŞFET
```

**Balık A'la Carte**

```
title     › Balık A'la Carte
text      › Deniz ürünlerini Akdeniz'in açık hava atmosferiyle buluşturuyor. Günün balığı ve meze seçkisiyle sahile yakın, ferah bir akşam yemeği deneyimi sağlıyor.
cta       › KEŞFET
```

**Aqua Snack**

```
title     › Aqua Snack
text      › Havuz keyfine lezzetli bir mola veriyor. Gün ortasında yerel ve uluslararası à la carte seçenekleriyle tatilin ritmini kesmeden atıştırma imkânı sunuyor.
cta       › KEŞFET
```

### REST-10 · spacer

### REST-11 · explore_more

```
title     › Daha Fazlası
```

---

## 6. Barlar — `/tr/barlar/`

> ✅ **2026-10-04 — uygulandı (Arcanus kendi sitesi):** indeks = BARS-01 slim hero + dokuz bar tek ızgarada (`overview_cards`, 3 kolon).
> "3 öne çıkan + bar_grid" alternatifi kalktı. Detaylar oda detayı şablonunda; tek cümlelik metinlerde (Pastane, Passion) lead/gövde bölünmesi yeniden kurgulandı, bilgi eklenmedi. Arcanus sitesindeki "Bistro Sorgun" §05'te olmadığı için yok.


> **Tasarım notu:** 9 bar için 9 ayrı `experience5050` bloğu sayfayı aşırı uzatır (≈14 viewport). Önerilen düzen: ilk 3 bar `experience5050`, kalan 6 bar kompakt `bar_grid` (3 kolon kart). Metinler her iki düzen için de hazır.

### BARS-01 · hero

```
eyebrow   › BARLAR
title     › Dokuz bar, gün boyu
subtitle  › Sabah kahvesinden gece müziğine
```

### BARS-02 · intro

```
text      › Lobiden sahile, havuz başından iskeleye kadar dokuz ayrı noktada içecek servisi var. Her biri günün farklı bir saatine ve farklı bir ritme göre kurgulandı.
```

### BARS-03…11 · experience5050 / bar_grid

**Lobi Bar** — `öne çıkan`

```
title     › Lobi Bar
text      › Otelin buluşma noktalarından biri. Günün her saatinde yerli ve yabancı alkollü ve alkolsüz içecek seçenekleriyle keyifli bir mola sunuyor.
```

**Arcanus Kahve Evi** — `öne çıkan`

```
title     › Arcanus Kahve Evi
text      › Kahve molalarını günün keyifli anlarına dönüştürüyor. Farklı kahve çeşitleriyle sakin ve sıcak bir buluşma noktası sunuyor.
```

**Havuz Bar** — `öne çıkan`

```
title     › Havuz Bar
text      › Havuz başındaki tatil ritmine eşlik ediyor. Sıcak ve soğuk içeceklerin yanı sıra şarap ve bira seçenekleriyle günün ferahlatıcı molalarına ev sahipliği yapıyor.
```

**Sahil Bar**

```
title     › Sahil Bar
text      › Deniz ve güneşle geçen anlara eşlik ediyor. Yerli ve yabancı alkollü ve alkolsüz içecek seçenekleriyle sahil keyfine ferahlatıcı bir mola katıyor.
```

**Disco Bar**

```
title     › Disco Bar
text      › Gecenin enerjisine eşlik ediyor. Yerli ve yabancı alkollü ve alkolsüz içecek seçenekleriyle tatil eğlencesini geceye taşıyor.
```

**Aqua Bar**

```
title     › Aqua Bar
text      › Kaydırakların hemen yanında. Serinleten içecekler ve gün boyu dondurma seçenekleriyle su eğlencesine eşlik ediyor.
```

**Pastane**

```
title     › Pastane
text      › Tatlı ve tuzlu kurabiyeler, pasta çeşitleri, sıcak içecekler ve dondurma seçenekleriyle gün içinde keyifli bir lezzet molası sunuyor.
```

**Passion Kokteyl Bar**

```
title     › Passion Kokteyl Bar
text      › Meyve püreleriyle hazırlanan alkollü ve alkolsüz kokteylleri ve dondurma seçenekleriyle güne renkli ve ferahlatıcı bir dokunuş katıyor.
```

**İskele Bar**

```
title     › İskele Bar
text      › Akdeniz'in yanı başında geçirilen anlara eşlik ediyor. Sıcak ve soğuk içeceklerin yanı sıra şarap ve bira seçenekleri sunuyor.
```

### BARS-12 · explore_more

```
title     › Daha Fazlası
```

---

## 7. Aktiviteler — `/tr/aktiviteler/`

> ✅ **2026-10-04 — uygulandı (Arcanus kendi sitesi):** indeks = ACT-01 slim hero + ACT-03…08 kartları (`overview_cards`, 3 kolon).
> ACT-02 intro yalnızca meta açıklamasında. Detaylar §8'den oda detayı şablonuna eşlendi (aşağıdaki not).


### ACT-01 · hero

```
eyebrow   › AKTİVİTELER
title     › Günü nasıl isterseniz
subtitle  › Havuzlardan spaya, çocuk kulübünden toplantı salonuna
```

### ACT-02 · intro

```
text      › Arcanus Hotels Sorgun'da gündüzler hareket ve suyla, akşamlar müzik ve şovlarla geçiyor. Tatilinizi ister aktif ister sakin bir ritimde kurabilirsiniz.
```

### ACT-03…08 · experience5050 ×6

**Yüzme Havuzları**

```
title     › Yüzme Havuzları
text      › Ana havuz, kapalı havuz, çocuk havuzu ve 7 kaydıraklı Aqua Havuzu. Farklı ihtiyaçlara göre ayrılmış havuzlar, yüzmeden su eğlencesine uzanan bir gün sunuyor.
cta       › KEŞFET
```

**Çocuk Kulübü**

```
title     › Çocuk Kulübü
text      › 4–11 yaş arasındaki çocuklara oyun, eğlence ve gelişimi bir araya getiren bir program sunuyor. Gün içinde düzenli etkinliklerle çocuklar kendi tatillerini yaşıyor.
cta       › KEŞFET
```

**Aktivite & Eğlence**

```
title     › Aktivite & Eğlence
text      › Gündüzleri spor ve oyun, akşamları canlı müzik ve şov. Animasyon ekibi gün boyu farklı etkinliklerle programı canlı tutuyor.
cta       › KEŞFET
```

**Spa**

```
title     › Spa
text      › Tatilin hareketli ritminden uzaklaşıp bedeninize ve zihninize zaman ayırabileceğiniz sakin bir alan. ⚠️ Hizmet listesi (hamam, sauna, masaj türleri) otelden teyit edilecek.
cta       › KEŞFET
```

**Pavilyon**

```
title     › Pavilyon
text      › Tatilinize daha özel ve ayrıcalıklı anlar katmak için rezervasyonla sunulan ücretli bir hizmet. Havuz ya da sahil kenarında kendinize ait bir alan.
cta       › KEŞFET
```

**Toplantı**

```
title     › Toplantı
text      › Tatil deneyiminin yanı sıra kurumsal buluşmalar için toplantı salonu imkânı sunuyor. ⚠️ Kapasite, m² ve teknik donanım bilgisi teyit edilecek.
cta       › KEŞFET
```

### ACT-09 · spacer

### ACT-10 · explore_more

```
title     › Daha Fazlası
```

---

## 8. Aktivite Detayları

Altı sayfa **oda detayı şablonunu** kullanır (kullanıcı kararı 2026-10-04): `hero (slim · eyebrow + h1 — Arcanus kendi sitesi, 2026-10-05) → detail_title (ad · asHeading false) → detail_body → media_slider → media_carousel → explore_more`. Eşleme: `hero.title` → h1 · `hero.subtitle` → etiket · `intro.text` → lead · `f1.text` (+ `f2.text`) → gövde, ⚠️ cümleleri çıkarılarak · doğrulanmış özellikler → ikonlu bilgi (spa: yok) · CTA → İLETİŞİM (`/contact`). Spa gövdesi intro'nun kısa yeniden yazımı; hamam/sauna/masaj listesi teyit gelince eklenecek.

### 8.1 Yüzme Havuzları — `/tr/aktiviteler/yuzme-havuzlari/`

```
hero.eyebrow   › AKTİVİTELER
hero.title     › Yüzme Havuzları
hero.subtitle  › Dört havuz ve 7 kaydıraklı Aqua Havuzu

intro.text     › Ana havuz, kapalı havuz, çocuk havuzu ve Aqua Havuzu. Dört farklı havuz, günün farklı saatlerine ve farklı yaş gruplarına göre ayrıldı.

f1.eyebrow     › AQUA HAVUZU
f1.title       › Yedi kaydırak
f1.text        › Aqua Havuzu'nda yedi ayrı kaydırak bulunuyor. Farklı yükseklik ve hızlardaki kaydıraklar, hem çocukların hem yetişkinlerin kullanabileceği şekilde ayrıldı. Hemen yanındaki Aqua Bar serinleten içecekler ve dondurma sunuyor.

f2.eyebrow     › DİĞER HAVUZLAR
f2.title       › Her yaşa uygun
f2.text        › Ana havuz gün boyu açık; kapalı havuz hava koşullarından bağımsız yüzme imkânı veriyor. Çocuk havuzu sığ derinliğiyle küçük misafirler için ayrıldı. ⚠️ Havuz boyutları ve açılış saatleri teyit edilecek.
```

### 8.2 Spa — `/tr/aktiviteler/spa/`

```
hero.eyebrow   › AKTİVİTELER
hero.title     › Spa
hero.subtitle  › Tatilin sakin tarafı

intro.text     › Günün hareketli temposundan uzaklaşıp bedeninize ve zihninize zaman ayırabileceğiniz bir alan. Spa, tatilin dinlenme tarafını üstleniyor.

f1.eyebrow     › HİZMETLER
f1.title       › Bedeninize zaman
f1.text        › ⚠️ Hamam, sauna, buhar odası ve masaj seçenekleri otelden teyit edildikten sonra yazılacak. Bu alan yaklaşık 260 karakterlik bir metin alacak.

f2.eyebrow     › REZERVASYON
f2.title       › Randevu ile
f2.text        › ⚠️ Ücretlendirme ve randevu koşulları teyit edilecek.
```

### 8.3 Çocuk Kulübü — `/tr/aktiviteler/cocuk-kulubu/`

```
hero.eyebrow   › AKTİVİTELER
hero.title     › Çocuk Kulübü
hero.subtitle  › 4–11 yaş arası için

intro.text     › Çocuk Kulübü, 4–11 yaş arasındaki çocuklara oyun, eğlence ve gelişimi bir araya getiren bir program sunuyor. Gün içinde düzenli etkinlikler var.

f1.eyebrow     › PROGRAM
f1.title       › Gün boyu etkinlik
f1.text        › Oyun saatleri, el işi atölyeleri ve açık hava etkinlikleriyle gün bölümlere ayrılıyor. Çocuklar kendi yaş gruplarıyla vakit geçirirken ebeveynler tatillerini planlayabiliyor. ⚠️ Saat aralıkları teyit edilecek.

f2.eyebrow     › GÜVENLİK
f2.title       › Gözetim altında
f2.text        › ⚠️ Personel sayısı, gözetim ve teslim koşulları teyit edilecek.
```

### 8.4 Aktivite & Eğlence — `/tr/aktiviteler/aktivite-eglence/`

```
hero.eyebrow   › AKTİVİTELER
hero.title     › Aktivite ve Eğlence
hero.subtitle  › Gündüz spor, akşam sahne

intro.text     › Arcanus Hotels Sorgun'da günler hareket, spor ve eğlenceyle; akşamlar canlı müzik ve şovlarla geçiyor. Gün boyunca farklı deneyimler sizi bekliyor.

f1.eyebrow     › GÜNDÜZ
f1.title       › Hareketli bir gün
f1.text        › Animasyon ekibi gün boyu havuz oyunları, su sporları ve grup etkinlikleri düzenliyor. Katılım isteğe bağlı; programı takip edip istediğiniz etkinliğe dahil olabiliyorsunuz. ⚠️ Etkinlik listesi teyit edilecek.

f2.eyebrow     › AKŞAM
f2.title       › Sahne ve müzik
f2.text        › Akşam programı canlı müzik ve şov gösterilerinden oluşuyor. Gece Disco Bar'da devam ediyor.
```

### 8.5 Pavilyon — `/tr/aktiviteler/pavilyon/`

```
hero.eyebrow   › AKTİVİTELER
hero.title     › Pavilyon
hero.subtitle  › Rezervasyonla, ücretli hizmet

intro.text     › Pavilyon hizmeti, tatilinize daha özel ve ayrıcalıklı anlar katmak için rezervasyonla sunulan ücretli bir deneyimdir.

f1.eyebrow     › KULLANIM
f1.title       › Kendinize ait alan
f1.text        › Havuz ya da sahil kenarında ayrılmış, gölgeli ve özel bir oturma alanı. Gün boyu kullanım için önceden rezervasyon yapılması gerekiyor. ⚠️ Konum seçenekleri, kapasite ve ücret bilgisi teyit edilecek.

f2.eyebrow     › REZERVASYON
f2.title       › Önceden ayırtın
f2.text        › ⚠️ Rezervasyon kanalı (resepsiyon / online) ve iptal koşulları teyit edilecek.
```

### 8.6 Toplantı — `/tr/aktiviteler/toplanti/`

```
hero.eyebrow   › AKTİVİTELER
hero.title     › Toplantı Salonu
hero.subtitle  › Kurumsal buluşmalar için

intro.text     › Arcanus Hotels Sorgun, tatil deneyiminin yanı sıra toplantı salonu olanağıyla kurumsal buluşmalar için de bir mekân seçeneği sunuyor.

f1.eyebrow     › SALON
f1.title       › Esnek düzen
f1.text        › ⚠️ Salon m²'si, kapasite (tiyatro / sınıf / U düzeni), teknik donanım (projeksiyon, ses sistemi, sahne) ve ikram seçenekleri otelden teyit edildikten sonra yazılacak.

f2.eyebrow     › TALEP
f2.title       › Teklif alın
f2.text        › Toplantı ve etkinlik talepleriniz için iletişim formundan ya da doğrudan telefonla bize ulaşabilirsiniz.
cta            › İLETİŞİM
```

---

## 9. Galeri — `/tr/galeri/`

```
hero.eyebrow   › GALERİ
hero.title     › Arcanus'tan kareler
hero.subtitle  › Odalar, havuzlar, sofralar ve sahil

kategori 1     › Otel
kategori 2     › Odalar
kategori 3     › Havuzlar
kategori 4     › Restoranlar
kategori 5     › Sahil
kategori 6     › Aktiviteler
```

### 9.1 Kategori sayfaları — `/tr/galeri/{otel|odalar|havuzlar|restoranlar|sahil|aktiviteler}/`

Hero YOK (Mākena `/gallery/{kategori}` böyle): başlık + önceki/sonraki galeri + küçük görseller + lightbox.
Görseller yer tutucu; gerçek fotoğraflar gelince kategori başına 12–18 kare.

```
title          › Otel · Odalar · Havuzlar · Restoranlar · Sahil · Aktiviteler
görsel         › her kategoride 12 × 4:3 (alt: "{kategori} — görsel {n}")
```

---

## 10. İletişim — `/tr/iletisim/`

> ✅ **2026-10-05 — uygulandı:** sayfa Arcanus'un kendi sitesindeki
> `/tr/iletisim/` gibi (kullanıcı kararı): slim hero + `contact_details`
> (solda 3:4 görsel, sağda "Arcanus Hotels Sorgun" başlığı + ikonlu ADRES ·
> RESEPSİYON · FAKS · ÇAĞRI MERKEZİ · E-POSTA + belge no + "HARİTADA GÖSTER").
> Hero metni aşağıdaki gibi; **form Faz 2'de** (`form.*` ve `konu.*` satırları
> o zaman kullanılacak). Bilgiler `src/lib/nav.ts` → `CONTACT`'tan, etiketler
> `messages/*.json` → `contact`'tan; üretici `scripts/content/gen-contact.mjs`.
> Eklenen doğrulanmış bilgiler (CONTENT-SPEC §05): posta kodu 07600, resepsiyon
> +90 (242) 756 93 21, faks +90 (242) 756 93 20, belge no 2574.

```
hero.eyebrow   › İLETİŞİM
hero.title     › Sorularınız için buradayız
hero.subtitle  › Rezervasyon, bilgi ve talepleriniz

form.baslik    › Bize yazın
form.aciklama  › Formu doldurun, en kısa sürede dönüş yapalım.

form.ad        › Ad Soyad
form.eposta    › E-posta
form.telefon   › Telefon
form.konu      › Konu
form.mesaj     › Mesajınız
form.kvkk      › Kişisel verilerimin Aydınlatma Metni kapsamında işlenmesini kabul ediyorum.
form.gonder    › GÖNDER
form.basarili  › Mesajınız alındı. En kısa sürede size dönüş yapacağız.
form.hata      › Mesaj gönderilemedi. Lütfen tekrar deneyin ya da telefonla ulaşın.

konu.1         › Rezervasyon
konu.2         › Genel bilgi
konu.3         › Toplantı ve etkinlik
konu.4         › Geri bildirim
konu.5         › KVKK başvurusu

adres.baslik   › Adres
adres.metin    › Sorgun Mevkii, Acısu Cd. No:8, Manavgat / Antalya
telefon        › +90 (242) 642 03 10
eposta         › info@arcanushotels.com
harita.cta     › GOOGLE MAPS
```

---

## 11. Footer

```
menu1.baslik   › KEŞFET
menu1          › Konaklama · Restoranlar · Barlar · Aktiviteler · Galeri · İletişim

menu2.baslik   › KURUMSAL
menu2          › Hakkımızda · KVKK Protokolleri · Aydınlatma Metni

menu3.baslik   › İLETİŞİM
menu3          › T: +90 (242) 642 03 10 · E: info@arcanushotels.com
                 Sorgun Mevkii, Acısu Cd. No:8, Manavgat / Antalya

copyright      › © 2026 Arcanus Hotels Sorgun. Tüm hakları saklıdır.
```

---

## 12. Menü (overlay)

> ✅ **2026-10-04 (gece) — uygulandı:** menü içeriği Arcanus'un kendi sitesindeki
> çekmeceyle BİREBİR (kullanıcı kararı: "açılan menü içeriği aynı olacak").
> Oda / aktivite alt listeleri ve adres satırı menüde yok; footer değişmedi.
> Dil linkleri Arcanus'tan farklı olarak aynı sayfanın karşılığına gider.

```
baglantilar    › Konaklama · Restoranlar · Barlar · Aktiviteler · Galeri · İletişim
sosyal         › Facebook · Instagram · YouTube · X · LinkedIn   (40px daire, ⚠️ hesap adresleri teyit bekliyor)
iletisim       › info@arcanushotels.com · +90 (242) 642 03 10   (ikonlu)
dil            › TR · EN · DE · RU   (etkin dil %100, diğerleri %70 opaklık)

toggle.ac      › MENÜ
toggle.kapat   › KAPAT
cta (header)   › REZERVASYON
```

Ölçülen (1440, Arcanus = bizde): çekmece 499,2 · nav `pt-120 px-40` · satır
2,4rem/1,3 `py-18` (64,5px) · çizgi beyaz %12 · daire 38,4 kenarlık beyaz %24 ·
ikon 15,4 · e-posta/telefon 1,5rem/1,6, ikon 17,3 beyaz %60 · dil satırı y = 838,6.

---

## 13. SEO Metinleri

| Sayfa                | `<title>`                                                | `meta description`                                                                                                                           |
| -------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Ana sayfa            | Arcanus Hotels Sorgun \| Side Antalya Her Şey Dahil Otel | Side Sorgun'da denize sıfır, çam ormanı içinde her şey dahil otel. Dört oda tipi, yedi restoran, 7 kaydıraklı aqua havuzu ve çocuk kulübü.   |
| Hakkımızda           | Hakkımızda \| Arcanus Hotels Sorgun                      | Antalya Side Sorgun'da, çam ormanıyla Akdeniz'in buluştuğu kıyıda yer alan Arcanus Hotels Sorgun'un hikâyesi, misyonu ve vizyonu.            |
| Konaklama            | Odalar ve Suitler \| Arcanus Hotels Sorgun               | 24 m² Standart Oda'dan 72 m² Deluxe Aile Odası'na dört oda tipi. Deniz manzarası, jakuzili balkon ve aile suitleri seçenekleriyle.           |
| Standart Oda         | Standart Oda \| Arcanus Hotels Sorgun                    | 24 m² Standart Oda: balkon, bahçe veya deniz manzarası. 2 yetişkin + 1 çocuk ya da 3 yetişkin konaklamaya uygun.                             |
| Family Suite         | Family Suite \| Arcanus Hotels Sorgun                    | 38 m² Family Suite: iki yatak odası, jakuzili balkon ve deniz manzarası. 2 yetişkin + 2 çocuk konaklamaya uygun aile suiti.                  |
| Superior Aile Odası  | Superior Aile Odası \| Arcanus Hotels Sorgun             | 48 m² Superior Aile Odası: iki yatak odası, iki banyo ve deniz manzarası. 3 yetişkin + 2 çocuğa kadar konaklama.                             |
| Deluxe Aile Odası    | Deluxe Aile Odası \| Arcanus Hotels Sorgun               | 72 m² Deluxe Aile Odası: iki yatak odası, oturma odası, mini mutfak ve deniz manzarası. Kalabalık aileler için en geniş oda tipi.            |
| Restoranlar          | Restoranlar \| Arcanus Hotels Sorgun                     | Açık büfe Ana Restaurant ve Türk, İtalyan, Meksika, Uzak Doğu, balık à la carte restoranları. Havuz başında Aqua Snack.                      |
| Barlar               | Barlar \| Arcanus Hotels Sorgun                          | Lobi Bar'dan İskele Bar'a dokuz ayrı bar. Kahve, kokteyl, dondurma ve gece eğlencesi gün boyu açık.                                          |
| Aktiviteler          | Aktiviteler \| Arcanus Hotels Sorgun                     | Dört havuz ve 7 kaydıraklı Aqua Havuzu, 4–11 yaş çocuk kulübü, spa, pavilyon ve toplantı salonu.                                             |
| Yüzme Havuzları      | Yüzme Havuzları \| Arcanus Hotels Sorgun                 | Ana havuz, kapalı havuz, çocuk havuzu ve 7 kaydıraklı Aqua Havuzu. Her yaşa uygun su eğlencesi.                                              |
| Spa                  | Spa \| Arcanus Hotels Sorgun                             | Arcanus Hotels Sorgun Spa: tatilin hareketli temposundan uzaklaşıp dinlenebileceğiniz sakin bir alan.                                        |
| Çocuk Kulübü         | Çocuk Kulübü \| Arcanus Hotels Sorgun                    | 4–11 yaş arası çocuklar için oyun, eğlence ve gelişimi bir araya getiren günlük etkinlik programı.                                           |
| Aktivite & Eğlence   | Aktivite ve Eğlence \| Arcanus Hotels Sorgun             | Gündüz spor ve havuz oyunları, akşam canlı müzik ve şov. Animasyon ekibiyle gün boyu etkinlik.                                               |
| Pavilyon             | Pavilyon \| Arcanus Hotels Sorgun                        | Havuz ya da sahil kenarında, rezervasyonla sunulan ücretli özel oturma alanı hizmeti.                                                        |
| Toplantı             | Toplantı Salonu \| Arcanus Hotels Sorgun                 | Kurumsal buluşmalar, seminer ve etkinlikler için toplantı salonu. Teklif için iletişime geçin.                                               |
| Galeri               | Galeri \| Arcanus Hotels Sorgun                          | Arcanus Hotels Sorgun'un odaları, havuzları, restoranları ve sahilinden fotoğraflar.                                                         |
| Galeri · Otel        | Otel — Galeri \| Arcanus Hotels Sorgun                   | Side Sorgun'da, çam ormanının kumsala indiği noktada denize sıfır konumlanan Arcanus Hotels Sorgun'un genel görünümünden fotoğraflar.        |
| Galeri · Odalar      | Odalar — Galeri \| Arcanus Hotels Sorgun                 | Standart Oda'dan 72 m²'lik Deluxe Aile Odası'na, Arcanus Hotels Sorgun'un dört oda tipinden fotoğraflar; balkon, bahçe ve deniz manzaraları. |
| Galeri · Havuzlar    | Havuzlar — Galeri \| Arcanus Hotels Sorgun               | Ana havuz, kapalı havuz, çocuk havuzu ve 7 kaydıraklı Aqua Havuzu: Arcanus Hotels Sorgun'un havuzlarından fotoğraflar.                       |
| Galeri · Restoranlar | Restoranlar — Galeri \| Arcanus Hotels Sorgun            | Açık büfe Ana Restaurant ve beş à la carte restoran: Arcanus Hotels Sorgun'un sofralarından ve mekânlarından fotoğraflar.                    |
| Galeri · Sahil       | Sahil — Galeri \| Arcanus Hotels Sorgun                  | Denize sıfır kumsal ve denize uzanan iskele: Arcanus Hotels Sorgun'un sahilinden ve kıyı şeridinden fotoğraflar.                             |
| Galeri · Aktiviteler | Aktiviteler — Galeri \| Arcanus Hotels Sorgun            | Çocuk kulübü, spa, pavilyonlar ve gün boyu süren aktiviteler: Arcanus Hotels Sorgun'un aktivite alanlarından fotoğraflar.                    |
| İletişim             | İletişim \| Arcanus Hotels Sorgun                        | Arcanus Hotels Sorgun iletişim bilgileri: Sorgun Mevkii, Acısu Cd. No:8, Manavgat / Antalya. Çağrı merkezi +90 (242) 642 03 10, info@arcanushotels.com. |

---

## 14. Teyit Bekleyen Bilgiler

> ➕ 2026-10-04: Arcanus'un kendi sitesinde listelenen **"Sahil Snack"** (restoran) ve
> **"Bistro Sorgun"** (bar) CONTENT-SPEC §05'te yok — teyit gelince `venues.ts`,
> `routing.ts` ve `gen-venues.mjs` ile eklenecek.

Aşağıdaki başlıklar otelden alınmadan içerik tamamlanamaz. İçerikte ⚠️ ile işaretlendi.

| #   | Bilgi                                                     | Nerede gerekli                       |
| --- | --------------------------------------------------------- | ------------------------------------ |
| 1   | Toplam oda sayısı                                         | `Hotel` JSON-LD, hakkımızda          |
| 2   | Yıldız sayısı                                             | `Hotel` JSON-LD (`starRating`)       |
| 3   | Check-in / check-out saatleri                             | `Hotel` JSON-LD, oda sayfaları       |
| 4   | Oda donanım listesi (klima, mini bar, kasa, TV…)          | 4 oda sayfası + Konaklama            |
| 5   | Yatak tipleri ve sayıları                                 | 4 oda sayfası `specs`                |
| 6   | Spa hizmet listesi (hamam, sauna, masaj türleri, ücret)   | Spa sayfası — şu an placeholder      |
| 7   | Çocuk kulübü saatleri ve gözetim koşulları                | Çocuk Kulübü sayfası                 |
| 8   | Toplantı salonu m², kapasite, teknik donanım              | Toplantı sayfası — şu an placeholder |
| 9   | Pavilyon konumları, kapasite, ücret                       | Pavilyon sayfası                     |
| 10  | Havuz boyutları ve açılış saatleri                        | Yüzme Havuzları sayfası              |
| 11  | À la carte rezervasyon koşulu (ücretli/ücretsiz, kaç kez) | Restoranlar                          |
| 12  | Her şey dahil kapsamı — ücretli hizmetler listesi         | Tüm sayfalar, `amenityFeature`       |
| 13  | Plaj: uzunluk, mavi bayrak, şezlong/şemsiye               | Ana sayfa, galeri                    |
| 14  | AYT havalimanına mesafe                                   | `Hotel` JSON-LD, iletişim            |
| 15  | GPS koordinatları                                         | `Hotel` JSON-LD (`geo`), harita      |
| 16  | Evcil hayvan, engelli erişimi, otopark                    | `amenityFeature`                     |
| 17  | Animasyon etkinlik listesi                                | Aktivite & Eğlence                   |
| 18  | Uzakdoğu restoran menü içeriği (sushi var mı)             | Restoranlar                          |

---

## 15. Sonraki Adım

1. ⬜ Otel bu taslağı okur, ⚠️ işaretli 18 maddeyi tamamlar
2. ⬜ Karakter sayımı doğrulanır (`scripts/count-content.mjs`)
3. ⬜ Bütçe aşan alanlar kısaltılır
4. ⬜ EN / DE / RU lokalizasyonu — **aynı bütçeye**, çeviri değil lokalizasyon
5. ⬜ PHASE 01'de blok şeması netleşince `src/content/{locale}/*.json` dosyalarına aktarılır
