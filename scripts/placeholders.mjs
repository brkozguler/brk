/**
 * Yer tutucu görsel üretici — otelin fotoğrafları gelene kadar düzeni test etmek için.
 * Gerçek fotoğraf geldiğinde aynı adla assets/images altına konur, bu betik silinir.
 *
 * Kullanım: node scripts/placeholders.mjs gallery
 *   assets/images/gallery/<kategori>/cover.jpg + 01..12.jpg (1600×1200, 4:3)
 * Var olan dosyanın üzerine yazmaz.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'assets', 'images');

const SETS = {
  gallery: {
    size: [1600, 1200],
    count: 12,
    // kategori → ton (hue); ana sayfadaki yer tutucularla aynı yumuşak degrade dili
    groups: { hotel: 205, rooms: 28, pools: 190, restaurants: 18, beach: 200, activities: 95 },
  },
};

function hsl(h, s, l) {
  return `hsl(${h} ${s}% ${l}%)`;
}

function svg(width, height, hue, n) {
  // Her karede ton ve ışık hafifçe kayar; yan yana dururken birbirinden ayırt edilsin
  const h = (hue + n * 7) % 360;
  const top = hsl(h, 32, 62 - (n % 3) * 4);
  const mid = hsl(h + 8, 36, 44);
  const bottom = hsl(h + 16, 40, 20);
  const cx = 30 + ((n * 37) % 40);
  const cy = 20 + ((n * 23) % 30);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${top}"/>
      <stop offset="0.55" stop-color="${mid}"/>
      <stop offset="1" stop-color="${bottom}"/>
    </linearGradient>
    <radialGradient id="r" cx="${cx}%" cy="${cy}%" r="60%">
      <stop offset="0" stop-color="white" stop-opacity="0.28"/>
      <stop offset="1" stop-color="white" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#r)"/>
</svg>`;
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const setName = process.argv[2];
  const set = SETS[setName];
  if (!set) {
    console.error(`Bilinmeyen set: ${setName}. Seçenekler: ${Object.keys(SETS).join(', ')}`);
    process.exit(1);
  }
  const [width, height] = set.size;
  let written = 0;
  for (const [group, hue] of Object.entries(set.groups)) {
    const dir = path.join(SRC, setName, group);
    await fs.mkdir(dir, { recursive: true });
    const names = ['cover', ...Array.from({ length: set.count }, (_, i) => String(i + 1).padStart(2, '0'))];
    for (const [n, name] of names.entries()) {
      const file = path.join(dir, `${name}.jpg`);
      if (await exists(file)) continue;
      await sharp(Buffer.from(svg(width, height, hue, n)))
        .blur(40)
        .jpeg({ quality: 82 })
        .toFile(file);
      written += 1;
    }
  }
  console.log(`placeholders: ${written} dosya yazıldı (${setName})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
