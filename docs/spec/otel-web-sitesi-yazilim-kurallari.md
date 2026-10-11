# Otel Web Sitesi Yazılım Kuralları

## 1. Performans ve Mobil

Otel trafiğinin %60–70'i mobilden gelir. Sayfa yüklenmesindeki her saniyelik gecikme dönüşümü belirgin şekilde düşürür.

### Ölçüm hedefleri
- Core Web Vitals'ta mobil için hedefler: LCP < 2,5 sn, INP < 200 ms, CLS < 0,1.
- TTFB 800 ms altında olmalı.
- Lab verisine (Lighthouse) değil, saha verisine (CrUX / Search Console) bakın. Gerçek kullanıcı deneyimini gösteren saha verisidir.

### Görsel yönetimi
- Görselleri WebP/AVIF formatında sunun. JPEG'i yalnızca yedek olarak tutun.
- `srcset` ve `sizes` ile cihaza uygun boyut gönderin. 4000 px'lik fotoğraf telefona gitmemeli.
- `width`/`height` veya `aspect-ratio` tanımlayın. Bu, CLS'nin en yaygın sebebini ortadan kaldırır.
- Hero görselinde `fetchpriority="high"` ve `preload` kullanın. Geri kalan her şeyde `loading="lazy"` kullanın.
- Galeri ve oda görsellerini yükleme anında otomatik işleyen bir pipeline kurun: boyutlandırma, sıkıştırma, format dönüşümü. Otel personeli kontrol edilmemiş, 15 MB'lık fotoğraflar yükleyecektir.

### Video
- Hero videosu varsa sessiz ve kısa olmalı, sıkıştırılmış olmalı (MP4/WebM, 2–3 MB altı). Bir poster görseli bulunmalı.
- Mobilde video yerine statik görsel göstermeyi düşünün.
- YouTube/Vimeo embed'leri tıklanınca yüklenen bir "facade" ile gelmeli.

### Kod ve kaynaklar
- Kritik CSS'i inline verin, gerisini asenkron yükleyin. Kullanılmayan CSS/JS'i temizleyin.
- Fontları kendi sunucunuzda barındırın (WOFF2), alt küme (subset) olarak sunun ve `font-display: swap` kullanın. Türkçe, Almanca ve Kiril karakterleri subset'te mutlaka olmalı.
- Üçüncü parti scriptleri (chat widget, pixel'ler, yorum widget'ları) kısıtlayın ve geciktirin. INP sorunlarının çoğu bunlardan kaynaklanır.
- Slider kütüphanesi yerine CSS scroll-snap gibi hafif çözümleri tercih edin.

### Altyapı
- Statik dosyalar için CDN kullanın, uzun cache süreleri verin (dosya adında hash ile).
- HTTP/2 veya HTTP/3 ile Brotli sıkıştırma kullanın.
- Sayfa cache'i (full-page cache) veya statik üretim (SSG) kullanın. Hedef pazarlarınıza yakın bir sunucu ya da edge çözümü seçin.

### Mobil kullanılabilirlik
- Dokunma alanları en az 44×44 px olmalı.
- Mobilde sabit bir "Rezervasyon" butonu bulunsun.
- Tarih seçici mobilde tam ekran ve parmakla kolay kullanılır olmalı.
- Yatay kaydırma olmamalı. Input'lar 16 px'ten küçük olursa iOS'ta otomatik zoom yapar; buna dikkat edin.

---

## 2. Çok Dillilik

### URL yapısı
- Alt dizin yapısı (`otel.com/en/`, `/de/`, `/ru/`) önerilir. Domain otoritesini tek yerde toplar ve yönetimi kolaydır.
- Varsayılan dil de kendi dizininde olabilir (`/tr/`) veya kökte kalabilir. Önemli olan tutarlılık.
- Dil asla yalnızca çerez, session ya da JavaScript ile değişmemeli. Her dil sürümünün kendine ait, taranabilir bir URL'si olmalı.

### hreflang
- Her sayfa, kendisi dahil tüm dil karşılıklarını listelemeli. Bağlantılar karşılıklı olmalı: A sayfası B'yi gösteriyorsa B de A'yı göstermeli.
- `x-default` tanımlayın (genellikle İngilizce sürüm veya dil seçim sayfası).
- Bölge gerekiyorsa `de-DE` ve `de-AT` gibi kodlar kullanın, ama gereksiz yere bölgeye bölmeyin.
- Bir sayfanın bir dilde karşılığı yoksa o dil için hreflang eklemeyin. Ana sayfaya yönlendiren sahte bir karşılık göstermeyin.
- hreflang `<head>` içinde veya sitemap'te verilebilir. Büyük sitelerde sitemap yöntemi daha yönetilebilirdir.

### Yönlendirme ve dil seçimi
- IP veya `Accept-Language` başlığına göre otomatik yönlendirme yapmayın. Googlebot çoğunlukla ABD'den tarar ve diğer dilleri hiç göremeyebilir.
- Bunun yerine kullanıcıya "Bu sayfa Almanca da mevcut" gibi kapatılabilir bir bant gösterin.
- Dil seçicide bayrak değil, dilin kendi adı yazmalı ("Deutsch", "Русский"). Seçici, kullanıcıyı ana sayfaya değil, aynı sayfanın diğer dildeki karşılığına götürmeli.

### Çeviri kapsamı
- Gövde metninin yanı sıra şunlar da çevrilmeli: `<title>`, meta description, URL slug, görsel alt metinleri, form etiketleri ve hata mesajları, 404 sayfası, schema.org içerikleri, e-posta şablonları.
- `<html lang="...">` her dilde doğru olmalı.
- Makine çevirisi editör kontrolünden geçmeli. Almanca ve Rusça pazarlarda kalitesiz çeviri güveni doğrudan düşürür.

### Teknik detaylar
- Tarih, para birimi ve sayı formatları için `Intl.DateTimeFormat` ve `Intl.NumberFormat` kullanın. Örneğin "1.250,00 €" ile "€1,250.00" aynı tutarı farklı yazar.
- Kiril ve Türkçe karakterleri tasarımda test edin. Almanca metinler genelde %30 daha uzundur; buton ve menü tasarımları buna göre esnek olmalı.
- Gelecekte Arapça gibi sağdan sola (RTL) bir dil eklenme ihtimali varsa CSS'te logical properties (`margin-inline-start` vb.) kullanın.
- İçerik modelinde her içerik öğesi dil bazlı çevrilebilir olmalı. Çeviri eksik olduğunda ne olacağına dair bir fallback kuralı tanımlayın.

---

## 3. SEO ve Yapısal Veri

### Site mimarisi
- Her oda tipi, restoran, bar, spa, plaj, toplantı salonu ve aktivite için ayrı bir sayfa oluşturun. Her biri ayrı arama niyetini yakalar ("lara aquapark otel" ya da "antalya otel spa" gibi).
- Sayfa hiyerarşisi mantıklı olmalı: Ana sayfa → Odalar → Oda tipi. Herhangi bir sayfaya en fazla 3 tıkla ulaşılabilmeli.
- Konum odaklı içerik sayfaları ekleyin: havalimanı ulaşımı, çevredeki yerler, bölge rehberi.

### Sayfa düzeyi kurallar
- Her sayfada benzersiz bir `<title>` (yaklaşık 60 karakter) ve meta description (yaklaşık 155 karakter) olmalı.
- Her sayfada tek bir `<h1>` bulunmalı ve başlık hiyerarşisi atlanmamalı.
- Açıklayıcı alt metinler yazın. Dosya adları da anlamlı olsun ("deniz-manzarali-oda.webp" gibi, "IMG_4532.jpg" değil).
- Önemli içerik sekme veya accordion içinde gizlenmişse bile HTML'de bulunmalı, JS ile sonradan yüklenmemeli.

### Yapısal veri (JSON-LD)
- `Hotel` (veya `Resort`) için şu alanları doldurun: `name`, `address`, `geo`, `telephone`, `starRating`, `checkinTime`, `checkoutTime`, `amenityFeature`, `image`, `priceRange`, `petsAllowed`.
- Oda sayfalarında `HotelRoom` ve `bed`, `occupancy` gibi detaylar kullanın.
- Bunlara ek olarak `Restaurant`, `FAQPage`, `BreadcrumbList`, `Organization` (logo, sosyal medya hesapları) ve `WebSite` işaretlemelerini ekleyin.
- Yapısal veri sayfada görünen bilgiyle tutarlı olmalı. Görünmeyen bir puanı işaretlemek ceza riski taşır.
- Rich Results Test ve Search Console ile doğrulayın.

### Teknik SEO
- SSR veya SSG kullanın. İçerik ilk HTML yanıtında bulunmalı.
- Her sayfaya self-referencing canonical ekleyin. Filtre ve parametreli URL'ler (`?tarih=`, `?utm=`) ana sayfaya canonical vermeli.
- Dil bazlı XML sitemap'ler ve bir sitemap index oluşturun. Sitemap'te `lastmod` doğru olmalı.
- `robots.txt` ile admin ve arama sonuç sayfalarını kapatın, ama CSS/JS dosyalarını engellemeyin.
- Gerçek 404 ve 410 durum kodları döndürün. "Soft 404" hatasından kaçının.
- Yönlendirmeler tek adımlık 301 olmalı, zincirleme yönlendirme yapmayın.
- Site taşımasında eski URL'lerin tam bir haritasını çıkarın. Otel siteleri yıllar içinde güçlü backlink'ler kazanmıştır; bu bağlantılar kaybolmamalı.
- Breadcrumb navigasyonu ve anlamlı iç linkleme kurun (oda sayfasından spa'ya, restorandan menüye gibi).
- Open Graph ve Twitter Card etiketlerini ekleyin. Paylaşılan linklerde doğru görsel çıkmalı.

### Yerel SEO
- Firma adı, adres ve telefon (NAP) bilgileri sitede, Google İşletme Profili'nde ve OTA'larda birebir aynı olmalı.
- Footer'da adres bilgisi bulunsun ve haritanın embed'i tıklanınca yüklensin (performans için).

---

## 4. Erişilebilirlik

AB'de Haziran 2025'te yürürlüğe giren European Accessibility Act, online rezervasyon hizmetlerini de kapsıyor. Bu nedenle WCAG 2.1 AA seviyesini hedefleyin; yakın vadede 2.2 AA ideal.

### Görsel
- Metin kontrastı en az 4.5:1, büyük metin ve arayüz öğeleri için 3:1 olmalı. Otel sitelerinde fotoğraf üstüne beyaz yazı en sık görülen ihlaldir; altına bir overlay ekleyin.
- Bilgi yalnızca renkle verilmemeli. Örneğin dolu günler takvimde sadece kırmızı olmamalı, ayrıca bir işaret veya etiket taşımalı.
- Metin %200 büyütüldüğünde sayfa bozulmamalı.

### Klavye ve odak
- Tüm etkileşimler klavyeyle yapılabilmeli: menü, slider, galeri lightbox'ı, tarih seçici, modal'lar.
- Görünür bir odak göstergesi olmalı. `outline: none` kullanmayın.
- Modal açıkken odak modal içinde kalmalı, `Esc` ile kapanmalı ve kapandığında odak tetikleyen öğeye dönmeli.
- Sayfa başına "İçeriğe geç" bağlantısı ekleyin.

### Anlamsal yapı
- Doğru HTML öğelerini kullanın: buton için `<button>`, bağlantı için `<a>`. Tıklanabilir `<div>` kullanmayın.
- Landmark bölgelerini (`header`, `nav`, `main`, `footer`) tanımlayın.
- Her form alanının bir `<label>`'ı olmalı. Hata mesajları alana bağlanmalı (`aria-describedby`) ve ekran okuyucuya duyurulmalı.
- Tarih seçicide ARIA grid deseni uygulayın veya erişilebilirliği test edilmiş bir kütüphane kullanın.

### Medya ve hareket
- Dekoratif görsellerde `alt=""` kullanın, anlamlı görseller açıklayıcı alt metin taşımalı.
- Otomatik oynayan slider ve videolarda durdurma kontrolü olmalı. `prefers-reduced-motion` tercihine saygı gösterin.
- Videolarda altyazı bulunmalı.

### Test
- Otomatik araçlar (axe, Lighthouse) sorunların yalnızca yaklaşık %30–40'ını yakalar. NVDA veya VoiceOver ile manuel test yapın, klavyeyle tam bir rezervasyon başlatma senaryosu deneyin.
- Sitede bir erişilebilirlik beyanı sayfası yayınlayın.

---

## 5. İçerik Yönetimi ve Bakım

### CMS yapısı
- İçerik modeli yapısal olmalı: oda tipi, olanak, restoran, teklif ve SSS ayrı içerik tipleri olarak tanımlanmalı. Oda kapasitesi, metrekare, yatak tipi gibi alanlar serbest metin değil, yapılandırılmış alan olmalı. Böylece schema.org ve filtreleme otomatik beslenir.
- Teklif ve kampanyalarda başlangıç/bitiş tarihi tanımlanabilmeli ve süresi dolanlar otomatik yayından kalkmalı.
- Rol bazlı yetkilendirme kurun: satış ekibi teklifleri, F&B ekibi menüleri düzenler, yalnızca admin yapıyı değiştirir.
- Taslak, önizleme, zamanlanmış yayın ve sürüm geçmişi özellikleri bulunmalı.
- Editörün tasarımı bozamayacağı, sınırlandırılmış bileşen tabanlı bir sayfa oluşturucu kullanın.

### Ortamlar ve dağıtım
- Geliştirme, staging ve canlı ortamlar ayrı olmalı. Kod Git ile yönetilmeli, canlıya doğrudan FTP ile dosya atılmamalı.
- Dağıtım otomatik (CI/CD) olmalı ve hızlı geri alma (rollback) mümkün olmalı.
- Ortam değişkenleri ve API anahtarları kod deposunda tutulmamalı.

### Yedekleme ve izleme
- Veritabanı ve medya dosyaları günlük, otomatik ve sunucu dışında yedeklenmeli. Geri yükleme düzenli aralıklarla test edilmeli.
- Uptime izleme ve SSL sertifikası bitiş uyarısı kurun.
- Hata loglama için Sentry veya benzeri bir araç kullanın. 404 hatalarını takip edip düzenli olarak yönlendirin.
- Search Console'u ve Core Web Vitals raporunu aylık kontrol edin.

### Güncelleme rutini
- CMS, eklentiler ve bağımlılıklar düzenli olarak güncellenmeli. Kullanılmayan eklentileri kaldırın.
- Sezon öncesinde (Nisan–Mayıs gibi) içerik, fiyat bağlantıları, görseller ve formlar için tam bir kontrol yapın.

### Tutarlılık ve iletişim
- Telefon numaraları `tel:` bağlantısıyla, WhatsApp `wa.me` bağlantısıyla, adres ise harita bağlantısıyla mobilde tek dokunuşla çalışmalı.
- İletişim bilgileri tek bir kaynaktan (global ayar) yönetilmeli ve tüm sayfalara oradan beslenmeli. Böylece bir değişiklik her yere aynı anda yansır ve Google İşletme Profili ile uyum korunur.

---

## 6. Kod Standartları ve Mimari

- Yapı bileşen tabanlı olmalı (oda kartı, teklif kartı, galeri gibi yeniden kullanılabilir parçalar). Tasarım sistemi ve token'lar (renk, tipografi, boşluk) merkezi olarak tanımlanmalı.
- Mimari olarak headless CMS ile Next.js/Nuxt/Astro gibi bir SSG/SSR çözümü, ya da iyi yapılandırılmış ve cache'lenmiş klasik bir CMS uygundur. Seçimi, ekibin bakım kapasitesine göre yapın.
- Lint (ESLint, Stylelint) ve formatlama (Prettier) kuralları kurun. TypeScript tercih edin.
- Görsel regresyon testi ve temel E2E testleri yazın. En azından "dil değiştir" ve "rezervasyon butonuna tıkla" senaryoları her dağıtımda otomatik test edilmeli.
- Performans bütçesi tanımlayın (örneğin sayfa başına JS 150 KB altı) ve CI'da Lighthouse ile denetleyin.
- Dokümantasyon hazırlayın: kurulum, dağıtım, içerik ekleme rehberi. Otel projelerinde ekipler değişir ve bu bilgi kaybolmamalı.

---

## Öncelik Sırası

1. **Performans ve mobil deneyim:** Doğrudan dönüşümü etkiler.
2. **Çok dilli SEO ve yapısal veri:** Görünürlük için temeli oluşturur.
3. **Erişilebilirlik:** AB pazarında artık yasal bir gereklilik.
4. **Bakım ve kod standartları:** Sitenin ikinci yılında da aynı kalitede kalmasını sağlar.
