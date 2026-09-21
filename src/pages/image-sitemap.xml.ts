import type { ImageMetadata } from 'astro';
import type { APIRoute } from 'astro';
import { site } from '../site-config';
import products from '../content/site/products.json';
import builds from '../content/site/builds.json';

const customerBuildModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/customer-builds/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);
const productModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/products/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export const GET: APIRoute = () => {
  const imagesFor = (
    modules: Record<string, { default: ImageMetadata }>,
    slug: string,
    title: string,
  ) =>
    Object.entries(modules)
      .filter(([path]) => path.includes(`/${slug}/`))
      .sort(([left], [right]) => left.localeCompare(right))
      .map(
        ([, photo], index) =>
          `<image:image><image:loc>${escapeXml(new URL(photo.default.src, site.url).href)}</image:loc><image:title>${escapeXml(`${title} ${index + 1}`)}</image:title></image:image>`,
      )
      .join('');
  const customerImages = builds.categories
    .map((category) =>
      imagesFor(
        customerBuildModules,
        category.slug,
        `${category.name} customer build`,
      ),
    )
    .join('');
  const productUrls = products.products
    .map(
      (product) =>
        `<url><loc>${site.url}/products/${product.slug}/</loc>${imagesFor(productModules, product.slug, product.name)}</url>`,
    )
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"><url><loc>${site.url}/gear/</loc>${customerImages}</url>${productUrls}</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
