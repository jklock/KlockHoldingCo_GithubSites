# Klock Holding Co. website editing guide

This guide covers the public pages, product catalog, photo workflow, local preview, validation, and publishing. Routine text and photo updates do not require changing page layout code.

## Use the edit folder

Open the top-level `edit/` folder for shortcuts to everything intended for routine updates. It contains editable page-text files, navigation and external-link settings, the logo, this guide, and the three original-photo drop folders. The shortcuts point to the real files and folders, so changes made through `edit/` immediately change the corresponding source content.

### Bold text

In any editable visible-text value, surround words with two asterisks on each side. For example, write `Built for **competition shooters**.` to show “competition shooters” in bold. Keep the quotation marks, commas, braces, and field names unchanged.

- Put customer photos in `edit/customer-build-photos/`.
- Put product photos in `edit/product-photos/`.
- Put SplitShot screenshots in `edit/splitshot-screenshots/`.
- Replace the About Me original in `edit/about-photo/`.
- Replace `edit/logo.png` to change the site logo while keeping that filename.
- Run `./scripts/prepare.sh` after adding, moving, replacing, or removing photos in any photo folder.

## Start the site locally

Open Terminal and run:

```sh
cd /Volumes/Storage/KlockHoldingCo_GithubSites
npm install
npm run dev
```

Open the local address printed by Astro. Leave that Terminal window running while editing; saved text changes normally appear automatically.

## Edit the top navigation

Edit `src/content/site/navigation.json`.

- `home` controls the accessible label for the house-icon Home button.
- `customerBuilds` is the desktop Customer Builds label.
- `customerBuildsShort` is the shorter mobile label.
- `about` controls About Me.
- `products` controls Products.
- `shop` controls Shop.

Edit only the text between quotation marks. Keep the quotation marks, commas, braces, and field names intact.

External URLs are stored in `src/site-config.ts`. This includes Pewcentric, Printables, YouTube, Instagram, Facebook, GitHub, and SplitShot.

## Edit the Home page

Edit `src/content/site/home.json`.

- `heroEyebrow`, `heroHeading`, and `heroText` control the opening section.
- `linksEyebrow` and `linksHeading` control the middle heading.
- Each item under `destinations` controls the visible Pewcentric, Printables, and YouTube descriptions.
- Fields beginning with `splitshot` control the SplitShot panel, the embedded video, and the GitHub button.
- `metaDescription` controls the page description used by search engines and link previews.

The main logo is `src/assets/brand/klock-holding-co-logo.png`.

### Change the SplitShot screenshots

1. Put original screenshots in `photos-originals/splitshot/`.
2. Use descriptive filenames such as `review-timeline.png`; filenames become visible captions.
3. Run `npm run photos:prepare`.
4. Run `./scripts/prepare.sh` and refresh the local site.

The prepared files are written to `src/assets/splitshot-gallery/`. The home page shows the first four files alphabetically as a vertical column beside the SplitShot video; the tiles keep a fixed size that shrinks with the page width, and the column moves below the video on narrow screens. Clicking a screenshot opens it enlarged, where the side arrows or the left and right arrow keys move between screenshots and Escape closes the viewer. Keep exactly four originals in this folder to control the complete column. The preparation step mirrors the originals folder, so removed originals also disappear from the site. The originals folder is intentionally ignored by Git so large source files are never pushed.

## Edit the Customer Build Photos page

Edit `src/content/site/builds.json`.

- `eyebrow`, `heading`, and `intro` control the page introduction.
- `communityHeading` and `communityText` control the customer-submission message.
- Fields beginning with `empty` control the message shown before photos exist.
- `metaDescription` controls the search description.

### Add customer build photos

1. Copy JPEG, PNG, WebP, or AVIF originals into the matching category inside `edit/customer-build-photos/`:

   - `rover-idpa-belt/`
   - `rover-uspsa-belt/`
   - `astro-magazine-pouch/`
   - `gromit-magnet-attachment/`
   - `one-offs-custom-requests/`

2. Give each file a descriptive local name, such as `orange-idpa-belt-jane-doe.jpg`. Filenames are not shown publicly.
3. Run:

   ```sh
   ./scripts/prepare.sh
   ```

4. Preview the gallery locally.
5. Commit the generated files under `src/assets/customer-builds/`; do not commit `photos-originals/`.

The preparation command corrects camera rotation, limits the longest edge to 1600 pixels, converts the image to WebP, and lowers quality further only when needed to keep a prepared file near or below 900 KB. Each category is mirrored separately: only files in that category's `edit/` folder appear in its gallery, and stale generated WebPs for that same category are removed. During the site build, Astro creates 320-pixel and 640-pixel responsive thumbnails. Browsers lazy-load those thumbnails, and off-screen gallery tiles use `content-visibility` so a large gallery does not render all at once. Clicking a tile loads the full prepared image in the gallery viewer.

The Customer Builds page opens with four photos per populated category. Use `+` to show all category photos, `−` to return to four, and `>` to hide that category's photos. Existing photos begin in `one-offs-custom-requests/`; move originals into another category folder when you are ready to sort them.

## Edit Products

Edit `edit/product-catalog.json` for all product names, summaries, descriptions, photo alt text, and optional links. Keep the JSON punctuation and field names intact.

- `youtubeUrl`: paste a normal YouTube watch URL. The page adds both an embedded video and a YouTube button.
- `printablesUrl`: paste the direct Printables model URL. The page adds a Printables button.
- Leave either field empty (`""`) to hide it from the page.
- `benefits`, `specifications`, `configuration`, and `purchaseNote` control the buying information below the photos. Keep the brackets, quotation marks, and commas intact; edit only the text.

### Edit the "Make it yourself" section

Each product page ends with the build details copied from its Printables page, under a "Make it yourself" heading. A product with no `makerBlocks` skips the whole section.

Every entry in `makerBlocks` is one titled block, and the blocks appear on the page in the order you list them. Each block needs a `label` plus one of the following:

- `rows`: `["Label", "Value"]` pairs, shown as a two-column list. Use it for design goals, print settings, bills of materials, part and link types, magnet or fit options, and specifications.
- `steps`: one sentence per step, numbered in order. Use it for assembly.
- `notes`: one sentence per bullet. Use it for fit and sizing, compatibility, field testing, care and maintenance, and future development.

A block can also carry a `note`, a single closing paragraph printed under that block. Delete a block and it disappears from the page; delete `makerBlocks` entirely and the section goes away.

The section eyebrow, heading, and intro live in the `maker` block at the top of the same file and are shared by every product, so edit those once rather than per product.

### Add product photos

Each product has a matching folder in `edit/product-photos/`. Add JPEG, PNG, WebP, or AVIF originals to its folder, then run `./scripts/prepare.sh`.

- The first image alphabetically is the large side-by-side product image.
- The first four images alphabetically appear as fixed product-photo tiles (not a carousel).
- Use filename prefixes such as `01-front.jpg`, `02-side.jpg`, and `03-detail.jpg` to control the order.

The prepared files are committed under `src/assets/products/`; originals remain local and ignored by Git. Product and customer-build folders are separate: a file appears only in the matching product or customer-build category where you put its original.

## Edit the About Me page

Edit `src/content/site/about.json`.

- Fields beginning with `hero` control the opening copy.
- `storyEyebrow`, `storyHeading`, and `storyParagraphs` control the origin story.
- `openHeading` and `openParagraphs` control the open-design section.
- `photoAlt` describes the main image for screen readers.
- `metaDescription` controls the search description.

To replace the main photo, put a new image at `photos-originals/brand/about-me.png` (JPEG, PNG, WebP, and AVIF are also accepted), then run `./scripts/prepare.sh`. The prepared file is written to `src/assets/brand/about-me.webp`, and Astro creates smaller responsive versions when the site builds.

## Check an edit before publishing

Two commands cover the whole routine. First, prepare the site and start the local preview:

```sh
./scripts/prepare.sh
```

It prepares every photo and starts the local preview at <http://127.0.0.1:4321/>. Leave that Terminal window running while you review the site.

Then, once the pages look right, publish them:

```sh
./scripts/updatesite.sh
```

That script validates and then publishes, so nothing goes online when a check fails. The next section has the details.

### Refresh photos in the local site

Astro updates text immediately, but new, moved, or removed photos must first be converted into the optimized WebP assets used by the site. Run `./scripts/prepare.sh` again after changing any photo folder. It prepares the photos and restarts the local preview so the new gallery files are visible.

## Google Search indexing

The production build automatically provides:

- indexable page metadata, canonical URLs, social preview images, and structured data;
- `robots.txt` with no crawl blocks;
- `sitemap-index.xml` for public pages;
- `image-sitemap.xml` for customer build photos.

After the first deployment or a major URL change, sign in to [Google Search Console](https://search.google.com/search-console/), add the `klockholdingco.com` domain property, and complete Google’s DNS ownership verification. Submit both sitemap URLs under **Indexing → Sitemaps**:

```text
https://www.klockholdingco.com/sitemap-index.xml
https://www.klockholdingco.com/image-sitemap.xml
```

Use **URL inspection** to test and request indexing for the homepage, About page, and Customer Builds page. Search Console reports Google’s crawl and indexing decisions; appearing or ranking in results is controlled by Google and may take time after submission.

## Publish an edit to GitHub

From the repository’s top-level folder, run:

```sh
./scripts/updatesite.sh
```

The Bash wrapper runs `edit/publish.command`, which automatically:

1. Confirms the required system tools, the `main` branch, and the GitHub remote are available.
2. Downloads and verifies the website’s pinned Node.js runtime when needed, then installs all required website packages.
3. Prepares optimized copies of new photos.
4. Runs the complete validation suite and stops without publishing if a check fails.
5. Commits every intended site change, synchronizes with GitHub, and pushes `main`.

For a validation-only run that does not commit or push, use `./scripts/updatesite.sh --check`.

The script uses the existing GitHub login configured on this Mac. Pushing `main` starts the GitHub Pages workflow. Follow its result under the repository’s **Actions** tab: <https://github.com/jklock/KlockHoldingCo_GithubSites/actions>.

## Domain records

The site’s canonical address is `www.klockholdingco.com`. In the DNS provider, configure:

| Type  | Host  | Value              |
| ----- | ----- | ------------------ |
| CNAME | `www` | `jklock.github.io` |
| A     | `@`   | `185.199.108.153`  |
| A     | `@`   | `185.199.109.153`  |
| A     | `@`   | `185.199.110.153`  |
| A     | `@`   | `185.199.111.153`  |

Remove conflicting `www` or apex records. Do not use a wildcard record. DNS changes can take up to 24 hours. Once GitHub confirms the domain, enable **Enforce HTTPS** in **Settings → Pages**.

## Photo-size policy

- Keep camera originals only in `photos-originals/`; that directory is ignored by Git.
- Commit only the prepared WebP files.
- Avoid adding images directly to `public/`, because those files bypass Astro optimization.
- GitHub recommends keeping individual Git objects below 1 MB and GitHub Pages source/published sites below 1 GB. If the prepared gallery approaches those limits, move future image delivery to an image CDN rather than Git LFS; Pages cannot publish usable photos from LFS pointer files without additional handling.

Reference documentation:

- [Astro responsive image widths, sizes, formats, quality, and lazy loading](https://docs.astro.build/en/reference/modules/astro-assets/)
- [GitHub repository limits](https://docs.github.com/en/repositories/creating-and-managing-repositories/repository-limits)
- [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [GitHub Pages custom-domain DNS](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
