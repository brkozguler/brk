# cPanel'e yayınlama

Site statik dosyadır; Node.js sunucusu gerekmez. `out/` klasörünün içeriği `public_html` köküne kopyalanır.

## 1. Build

```bash
npm run build
```

Çıktı: `out/` (HTML, `_next/static`, `img/`, `.htaccess`, `robots.txt`, `sitemap*.xml`).

## 2. Yükleme

Üç yoldan biri:

- **cPanel Dosya Yöneticisi:** `out/` içeriğini zip'leyip `public_html` içine çıkarın.
  Gizli dosyaları (`.htaccess`, `tr/.htaccess` …) göstermeyi unutmayın.
- **FTP/SFTP:** `out/*` → `public_html/`. Gizli dosyaların aktarıldığını doğrulayın.
- **SSH (varsa):**

```bash
rsync -av --delete --exclude='.well-known' out/ kullanici@sunucu:~/public_html/
```

`--delete`, kaldırılan sayfaların eski kopyalarını da siler; `.well-known` (SSL doğrulama) korunur.

## 3. Yayın sonrası kontrol

- `https://arcanushotelssorgun.com/` → 301 → `/tr/`
- `http://` ve `www.` adresleri tek adımda `https://arcanushotelssorgun.com/...` adresine gidiyor
- `/tr/konaklama` → `/tr/konaklama/` (301, tek adım)
- `/de/olmayan-sayfa/` → HTTP **404** durum kodu ve Almanca 404 sayfası
- `/sitemap.xml`, `/robots.txt` açılıyor
- Yanıt başlıklarında `Cache-Control`, `Content-Security-Policy`, `Strict-Transport-Security` var
  (`curl -I` ile bakın). Başlıklar yoksa sunucuda `mod_headers` kapalı demektir; hosting'e sorun.
- `.avif` dosyaları `image/avif` olarak sunuluyor

## 4. Eski adresler

Önceki sitenin URL'leri `deploy/redirects.csv` dosyasına `eski,yeni` satırları olarak eklenir;
`npm run build` bunları `out/.htaccess` içine `RedirectMatch 301` olarak yazar.
Her eski sayfa içerik ve dil olarak karşılık gelen yeni sayfaya gider; toptan ana sayfaya yönlendirme yapılmaz.

## 5. LiteSpeed notu

Çoğu cPanel sunucusu LiteSpeed çalıştırır; `.htaccess` kuralları aynen geçerlidir ve Brotli sıkıştırmayı
LiteSpeed kendisi uygular. Apache'de `mod_brotli` yoksa `mod_deflate` (gzip) devreye girer.
