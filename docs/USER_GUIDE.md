# Klock Holding Co. website editing guide

This guide covers the three public pages, photo workflow, local preview, validation, and publishing. Routine text and photo updates do not require changing page layout code.

## Use the edit folder

Open the top-level `edit/` folder for shortcuts to everything intended for routine updates. It contains editable page-text files, navigation and external-link settings, the logo, this guide, and the three original-photo drop folders. The shortcuts point to the real files and folders, so changes made through `edit/` immediately change the corresponding source content.

- Put customer photos in `edit/customer-build-photos/`.
- Put SplitShot screenshots in `edit/splitshot-screenshots/`.
- Replace the About Me original in `edit/about-photo/`.
- Replace `edit/logo.png` to change the site logo while keeping that filename.
- Run `npm run photos:prepare` after adding or replacing photos in any photo folder.

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

- `home` controls the Home button.
- `customerBuilds` is the desktop Customer Builds label.
- `customerBuildsShort` is the shorter mobile label.
- `about` controls About Me.
- `shop` controls Shop.

Edit only the text between quotation marks. Keep the quotation marks, commas, braces, and field names intact.

External URLs are stored in `src/site-config.ts`. This includes Pewcentric, Printables, YouTube, Instagram, Facebook, GitHub, and SplitShot.

## Edit the Home page

Edit `src/content/site/home.json`.

- `heroEyebrow`, `heroHeading`, and `heroText` control the opening section.
- `linksEyebrow` and `linksHeading` control the middle heading.
- Each item under `destinations` controls the visible Pewcentric, Printables, and YouTube descriptions.
- Fields beginning with `splitshot` control the SplitShot panel and GitHub button.
- `metaDescription` controls the page description used by search engines and link previews.

The main logo is `src/assets/brand/klock-holding-co-logo.png`.

### Change the SplitShot screenshot row

1. Put original screenshots in `photos-originals/splitshot/`.
2. Use descriptive filenames such as `review-timeline.png`; filenames become visible captions.
3. Run `npm run photos:prepare`.
4. Refresh the local site.

The prepared files are written to `src/assets/splitshot-gallery/`. The home page displays the first four files alphabetically in a compact row beneath the SplitShot description. Keep exactly four prepared files in this directory to control the complete row. Remove a prepared file from that directory to remove it from the page. The originals folder is intentionally ignored by Git so large source files are never pushed.

## Edit the Customer Build Photos page

Edit `src/content/site/builds.json`.

- `eyebrow`, `heading`, and `intro` control the page introduction.
- `communityHeading` and `communityText` control the customer-submission message.
- Fields beginning with `empty` control the message shown before photos exist.
- `metaDescription` controls the search description.

### Add customer build photos

1. Copy JPEG, PNG, WebP, or AVIF originals into `photos-originals/customer-builds/`.
2. Give each file a descriptive name, such as `orange-idpa-belt-jane-doe.jpg`. The filename becomes its caption and alternative text.
3. Run:

   ```sh
   npm run photos:prepare
   ```

4. Preview the gallery locally.
5. Commit the generated files under `src/assets/gear-gallery/`; do not commit `photos-originals/`.

The preparation command corrects camera rotation, limits the longest edge to 1600 pixels, converts the image to WebP, and lowers quality further only when needed to keep a prepared file near or below 900 KB. During the site build, Astro creates 320-pixel and 640-pixel responsive thumbnails. Browsers lazy-load those thumbnails, and off-screen gallery cards use `content-visibility` so a large gallery does not render all at once.

To remove a customer photo, delete its matching `.webp` file from `src/assets/gear-gallery/`.

## Edit the About Me page

Edit `src/content/site/about.json`.

- Fields beginning with `hero` control the opening copy.
- `storyEyebrow`, `storyHeading`, and `storyParagraphs` control the origin story.
- `openHeading` and `openParagraphs` control the open-design section.
- `photoAlt` describes the main image for screen readers.
- `metaDescription` controls the search description.

To replace the main photo, put a new image at `photos-originals/brand/about-me.png` (JPEG, PNG, WebP, and AVIF are also accepted), then run `npm run photos:prepare`. The prepared file is written to `src/assets/brand/about-me.webp`, and Astro creates smaller responsive versions when the site builds.

## Check an edit before publishing

Run:

```sh
npm run photos:prepare
npm test
```

`npm test` checks the content, code, formatting rules, production build, and internal links. Do not publish if it fails.

## Publish an edit to GitHub

Double-click `edit/publish.command` in Finder. The script automatically:

1. Confirms the required system tools, the `main` branch, and the GitHub remote are available.
2. Downloads and verifies the website’s pinned Node.js runtime when needed, then installs all required website packages.
3. Prepares optimized copies of new photos.
4. Runs the complete validation suite and stops without publishing if a check fails.
5. Commits every intended site change, synchronizes with GitHub, and pushes `main`.

To run it from Terminal instead:

```sh
./edit/publish.command
```

For a validation-only run that does not commit or push, use `./edit/publish.command --check`.

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
