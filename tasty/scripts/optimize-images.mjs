// Resizes + recompresses the WebP food images used by the site.
// Originals are backed up once to _backup_images/ (outside public/) before overwriting.
// Usage: node scripts/optimize-images.mjs
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC_DIR = 'public/images';
const MIRROR_DIR = 'images'; // Apache serves /images/* from here first if it exists
const BACKUP_DIR = '_backup_images';

// max width per file (cards show ~300px, hero/bento up to ~900px; 2x for retina)
const MAX_WIDTH = { 'logo.webp': 600 };
const DEFAULT_WIDTH = 900;

fs.mkdirSync(BACKUP_DIR, { recursive: true });
let before = 0;
let after = 0;

for (const file of fs.readdirSync(SRC_DIR)) {
  if (!file.endsWith('.webp')) continue;
  const src = path.join(SRC_DIR, file);
  const backup = path.join(BACKUP_DIR, file);
  if (!fs.existsSync(backup)) fs.copyFileSync(src, backup);

  const input = fs.readFileSync(backup); // always compress from the original
  const buf = await sharp(input)
    .resize({ width: MAX_WIDTH[file] ?? DEFAULT_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80, alphaQuality: 85, effort: 5 })
    .toBuffer();

  before += input.length;
  if (buf.length >= input.length) { after += input.length; continue; }
  fs.writeFileSync(src, buf);
  if (fs.existsSync(path.join(MIRROR_DIR, file))) fs.writeFileSync(path.join(MIRROR_DIR, file), buf);
  after += buf.length;
  console.log(`${file}: ${(input.length / 1024).toFixed(0)} KB -> ${(buf.length / 1024).toFixed(0)} KB`);
}
console.log(`TOTAL: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`);
