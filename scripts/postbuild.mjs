/**
 * `next build` sonrası cPanel için out/ klasörünü tamamlar:
 * - deploy/htaccess/root.htaccess → out/.htaccess (eski URL yönlendirmeleri eklenir)
 * - her dil klasörüne kendi 404 sayfasını gösteren .htaccess
 * - temel çıktı doğrulaması
 *
 * Dil listesi src/i18n/config.ts ile aynı tutulmalıdır.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'out');
const LOCALES = ['tr', 'en', 'de', 'ru'];
const DEFAULT_LOCALE = 'tr';

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** deploy/redirects.csv: "eski-yol,yeni-yol" satırları; # ile başlayanlar yorum */
async function redirectRules() {
  const file = path.join(ROOT, 'deploy', 'redirects.csv');
  if (!(await exists(file))) return '';
  const lines = (await fs.readFile(file, 'utf8')).split(/\r?\n/);
  const rules = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const [from, to] = line.split(',').map((s) => s.trim());
    if (!from || !to) continue;
    const pattern = escapeRegex(from.replace(/\/$/, ''));
    rules.push(`RedirectMatch 301 ^${pattern}/?$ ${to}`);
  }
  return rules.join('\n');
}

async function main() {
  for (const locale of LOCALES) {
    const index = path.join(OUT, locale, 'index.html');
    if (!(await exists(index))) {
      throw new Error(`Eksik çıktı: ${path.relative(ROOT, index)}`);
    }
  }

  const template = await fs.readFile(path.join(ROOT, 'deploy', 'htaccess', 'root.htaccess'), 'utf8');
  const root = template.replace('# {{REDIRECTS}}', await redirectRules());
  await fs.writeFile(path.join(OUT, '.htaccess'), root);

  for (const locale of LOCALES) {
    const notFound = path.join(OUT, locale, '404', 'index.html');
    if (!(await exists(notFound))) {
      console.warn(`uyarı: ${locale} için 404 sayfası üretilmemiş`);
      continue;
    }
    await fs.writeFile(
      path.join(OUT, locale, '.htaccess'),
      `ErrorDocument 404 /${locale}/404/index.html\n`,
    );
  }

  const files = await countFiles(OUT);
  console.log(`postbuild: out/ hazır (${files} dosya), kök → /${DEFAULT_LOCALE}/`);
}

async function countFiles(dir) {
  let count = 0;
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    count += entry.isDirectory() ? await countFiles(full) : 1;
  }
  return count;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
