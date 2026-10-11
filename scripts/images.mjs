/**
 * Görsel pipeline'ı: assets/images/** → public/img/** (AVIF + WebP, çoklu genişlik)
 * ve src/content/generated/images.json manifesti.
 *
 * Kullanım: npm run images  (build de otomatik çalıştırır)
 * - Dosya adı içerik hash'i taşır; değişmeyen görseller yeniden üretilmez.
 * - Kaynak adı anlamlı olmalı: deniz-manzarali-oda.jpg (IMG_4532.jpg değil).
 * - EXIF yönü uygulanır; manifestteki width/height yöne göre düzeltilmiştir.
 */
import { createHash } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'assets', 'images');
const OUT = path.join(ROOT, 'public', 'img');
const MANIFEST = path.join(ROOT, 'src', 'content', 'generated', 'images.json');

const WIDTHS = [480, 768, 1080, 1440, 1920, 2560];
const FORMATS = { avif: { quality: 55 }, webp: { quality: 78 } };
const SOURCE_EXT = /\.(jpe?g|png|webp|tiff?)$/i;

async function walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function processImage(file, manifest, keep) {
  const rel = path.relative(SRC, file).split(path.sep).join('/');
  const id = rel.replace(SOURCE_EXT, '');
  const dirname = path.posix.dirname(id);
  const dir = dirname === '.' ? '' : `${dirname}/`;
  const name = path.posix.basename(id);

  const buffer = await fs.readFile(file);
  const hash = createHash('sha1').update(buffer).digest('hex').slice(0, 8);
  const meta = await sharp(buffer).metadata();
  const rotated = (meta.orientation ?? 1) >= 5;
  const width = rotated ? meta.height : meta.width;
  const height = rotated ? meta.width : meta.height;

  const widths = WIDTHS.filter((w) => w < width);
  widths.push(Math.min(width, WIDTHS[WIDTHS.length - 1]));

  const outDir = path.join(OUT, dir);
  await fs.mkdir(outDir, { recursive: true });

  let produced = 0;
  for (const w of widths) {
    for (const [format, options] of Object.entries(FORMATS)) {
      const outFile = path.join(outDir, `${name}-${hash}-${w}.${format}`);
      keep.add(outFile);
      if (await exists(outFile)) continue;
      await sharp(buffer)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        [format](options)
        .toFile(outFile);
      produced += 1;
    }
  }

  const blurBuffer = await sharp(buffer).rotate().resize({ width: 16 }).webp({ quality: 30 }).toBuffer();

  manifest[id] = {
    dir,
    name,
    hash,
    width,
    height,
    widths,
    blur: `data:image/webp;base64,${blurBuffer.toString('base64')}`,
  };
  return produced;
}

async function main() {
  await fs.mkdir(SRC, { recursive: true });
  await fs.mkdir(OUT, { recursive: true });
  await fs.mkdir(path.dirname(MANIFEST), { recursive: true });

  const sources = (await walk(SRC)).filter((f) => SOURCE_EXT.test(f)).sort();
  const manifest = {};
  const keep = new Set();
  let produced = 0;

  for (const file of sources) {
    produced += await processImage(file, manifest, keep);
  }

  // Kaynağı silinmiş ya da değişmiş görsellerin eski çıktılarını temizle
  let removed = 0;
  for (const file of await walk(OUT)) {
    if (!keep.has(file)) {
      await fs.unlink(file);
      removed += 1;
    }
  }

  await fs.writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(
    `images: ${sources.length} kaynak, ${keep.size} çıktı (${produced} yeni, ${removed} silindi)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
