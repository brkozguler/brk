# Arcanus Hotels Sorgun

Dört dilli (tr, en, de, ru) otel sitesi. Next.js 16, statik export, cPanel'de yayın.

```bash
npm install
npm run dev       # http://localhost:3000/tr/
npm run build     # out/ klasörünü üretir
npm run preview   # out/ klasörünü http://localhost:3001 adresinde sunar
npm run check     # tip + lint
```

- Proje kuralları ve mimari: [CLAUDE.md](CLAUDE.md)
- Durum ve sıradaki işler: [docs/PROGRESS.md](docs/PROGRESS.md)
- Yayınlama: [docs/DEPLOY-CPANEL.md](docs/DEPLOY-CPANEL.md)
- Şartname dokümanları: [docs/spec/](docs/spec/)

Görseller `assets/images/` altına anlamlı adlarla konur; `npm run images` AVIF/WebP boyutlarını ve
manifesti üretir. İçerik `src/content/` altındadır; URL haritası `src/i18n/routes.ts`.
