import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const outputDirectory = new URL('../dist/', import.meta.url).pathname;

if (!existsSync(outputDirectory)) {
  console.error('dist/ is missing. Run npm run build first.');
  process.exit(1);
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const htmlFiles = walk(outputDirectory).filter(
  (file) => extname(file) === '.html',
);
const failures = [];
const attributePattern = /(?:href|src)=["']([^"']+)["']/g;

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const [, rawReference] of html.matchAll(attributePattern)) {
    if (/^(?:https?:|mailto:|tel:|data:|#)/.test(rawReference)) continue;
    const reference = rawReference.split(/[?#]/)[0];
    if (!reference) continue;

    const relativeReference = reference.startsWith('/')
      ? reference.slice(1)
      : join(
          relative(outputDirectory, new URL('.', `file://${file}`).pathname),
          reference,
        );
    const candidate = join(outputDirectory, relativeReference);
    const resolved = extname(candidate)
      ? candidate
      : join(candidate, 'index.html');
    if (!existsSync(resolved) && !existsSync(candidate)) {
      failures.push(`${relative(outputDirectory, file)} -> ${rawReference}`);
    }
  }
}

if (failures.length > 0) {
  console.error(`Broken internal references:\n${failures.join('\n')}`);
  process.exit(1);
}

console.log(
  `Checked ${htmlFiles.length} generated HTML files; internal references resolve.`,
);
