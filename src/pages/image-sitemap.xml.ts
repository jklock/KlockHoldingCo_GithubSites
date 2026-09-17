import type { ImageMetadata } from 'astro';
import type { APIRoute } from 'astro';
import { site } from '../site-config';

const photoModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/gear-gallery/*.{jpg,jpeg,png,webp,avif}',
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
  const photos = Object.entries(photoModules).sort(([left], [right]) =>
    left.localeCompare(right),
  );
  const images = photos
    .map(([, photo], index) => {
      const location = new URL(photo.default.src, site.url).href;
      const title = `Klock Holding Co. customer competition gear build photo ${index + 1}`;
      return `<image:image><image:loc>${escapeXml(location)}</image:loc><image:title>${escapeXml(title)}</image:title></image:image>`;
    })
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"><url><loc>${site.url}/gear/</loc>${images}</url></urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
