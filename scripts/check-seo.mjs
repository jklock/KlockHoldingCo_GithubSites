import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const outputDirectory = new URL('../dist/', import.meta.url).pathname;
const indexedPages = ['index.html', 'about/index.html', 'gear/index.html'];
const failures = [];

const requirePattern = (html, pattern, message) => {
  if (!pattern.test(html)) failures.push(message);
};

for (const page of indexedPages) {
  const path = join(outputDirectory, page);
  if (!existsSync(path)) {
    failures.push(`${page}: generated page is missing`);
    continue;
  }

  const html = readFileSync(path, 'utf8');
  requirePattern(html, /<title>[^<]+<\/title>/, `${page}: title is missing`);
  requirePattern(
    html,
    /<meta name="description" content="[^"]+">/,
    `${page}: meta description is missing`,
  );
  requirePattern(
    html,
    /<link rel="canonical" href="https:\/\/www\.klockholdingco\.com\/[^"]*">/,
    `${page}: canonical URL is missing or invalid`,
  );
  requirePattern(
    html,
    /<meta name="robots" content="index, follow, max-image-preview:large,[^"]+">/,
    `${page}: indexable robots directive is missing`,
  );
  requirePattern(
    html,
    /<meta property="og:image" content="https:\/\/www\.klockholdingco\.com\/[^"]+">/,
    `${page}: Open Graph image is missing`,
  );
  requirePattern(
    html,
    /<meta name="twitter:image" content="https:\/\/www\.klockholdingco\.com\/[^"]+">/,
    `${page}: Twitter image is missing`,
  );
  const schemaMatch = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  );
  if (!schemaMatch) {
    failures.push(`${page}: schema graph is missing`);
  } else {
    try {
      const schema = JSON.parse(schemaMatch[1]);
      if (schema['@context'] !== 'https://schema.org' || !schema['@graph']) {
        failures.push(`${page}: schema graph is incomplete`);
      }
    } catch {
      failures.push(`${page}: schema graph is invalid JSON`);
    }
  }
  requirePattern(html, /<h1[^>]*>.*?<\/h1>/, `${page}: h1 is missing`);
  if (/noindex/.test(html)) failures.push(`${page}: page is set to noindex`);
}

const robotsPath = join(outputDirectory, 'robots.txt');
const sitemapPath = join(outputDirectory, 'sitemap-index.xml');
const imageSitemapPath = join(outputDirectory, 'image-sitemap.xml');

for (const path of [robotsPath, sitemapPath, imageSitemapPath]) {
  if (!existsSync(path)) failures.push(`${path}: crawl file is missing`);
}

if (existsSync(robotsPath)) {
  const robots = readFileSync(robotsPath, 'utf8');
  requirePattern(
    robots,
    /Allow: \//,
    'robots.txt: site-wide crawling is not allowed',
  );
  requirePattern(
    robots,
    /Sitemap: https:\/\/www\.klockholdingco\.com\/sitemap-index\.xml/,
    'robots.txt: page sitemap is missing',
  );
  requirePattern(
    robots,
    /Sitemap: https:\/\/www\.klockholdingco\.com\/image-sitemap\.xml/,
    'robots.txt: image sitemap is missing',
  );
}

if (existsSync(imageSitemapPath)) {
  const imageSitemap = readFileSync(imageSitemapPath, 'utf8');
  const imageCount = (imageSitemap.match(/<image:image>/g) ?? []).length;
  if (imageCount === 0) failures.push('image sitemap contains no images');
}

if (failures.length > 0) {
  console.error(`SEO validation failed:\n${failures.join('\n')}`);
  process.exit(1);
}

console.log(
  `Checked ${indexedPages.length} indexable pages, robots.txt, page sitemap, image sitemap, social metadata, and structured data.`,
);
