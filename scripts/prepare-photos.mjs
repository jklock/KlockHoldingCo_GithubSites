import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const galleries = [
  {
    name: 'About Me',
    input: path.join(root, 'photos-originals/brand'),
    output: path.join(root, 'src/assets/brand'),
  },
  {
    name: 'customer builds',
    input: path.join(root, 'photos-originals/customer-builds'),
    output: path.join(root, 'src/assets/gear-gallery'),
  },
  {
    name: 'SplitShot',
    input: path.join(root, 'photos-originals/splitshot'),
    output: path.join(root, 'src/assets/splitshot-gallery'),
  },
];
const supported = new Set(['.avif', '.jpeg', '.jpg', '.png', '.webp']);

function slugify(filename) {
  return path
    .basename(filename, path.extname(filename))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function optimize(inputPath) {
  for (const quality of [82, 74, 66]) {
    const output = await sharp(inputPath)
      .rotate()
      .resize({
        width: 1600,
        height: 1600,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality, effort: 5 })
      .toBuffer();

    if (output.length <= 900_000 || quality === 66) return output;
  }
}

let created = 0;
let skipped = 0;

for (const gallery of galleries) {
  await mkdir(gallery.input, { recursive: true });
  await mkdir(gallery.output, { recursive: true });

  const files = (await readdir(gallery.input)).filter((filename) =>
    supported.has(path.extname(filename).toLowerCase()),
  );

  for (const filename of files) {
    const inputPath = path.join(gallery.input, filename);
    const outputPath = path.join(gallery.output, `${slugify(filename)}.webp`);
    const inputStats = await stat(inputPath);
    const outputStats = await stat(outputPath).catch(() => null);

    if (outputStats && outputStats.mtimeMs >= inputStats.mtimeMs) {
      skipped += 1;
      continue;
    }

    const optimized = await optimize(inputPath);
    await writeFile(outputPath, optimized);
    created += 1;
    console.log(
      `${gallery.name}: ${filename} -> ${path.relative(root, outputPath)} (${Math.round(optimized.length / 1024)} KB)`,
    );
  }
}

console.log(
  `Prepared ${created} photo(s); skipped ${skipped} unchanged photo(s).`,
);
