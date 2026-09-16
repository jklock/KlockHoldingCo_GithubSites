# Klock Holding Co. website

Production source for [www.klockholdingco.com](https://www.klockholdingco.com), a three-page static link hub for Klock Holding Co. Products link to Pewcentric for purchasing; the site has no cart, accounts, database, or backend.

For routine text edits, photo uploads, local preview, validation, publishing, and DNS instructions, use the [website editing guide](docs/USER_GUIDE.md).

## Stack

- Astro 7 with TypeScript and static generation
- Astro Assets and Sharp for responsive image output
- Plain CSS with shared design tokens
- GitHub Actions and GitHub Pages

## Requirements

- Node.js 24.16 or newer in the supported lines (the expected version is in `.node-version` and `.nvmrc`)
- npm 11 or newer

## Local development

```sh
npm install
npm run dev
```

Astro prints the local address. For a production-equivalent check:

```sh
npm test
npm run preview
```

Useful commands:

| Command                  | Purpose                                               |
| ------------------------ | ----------------------------------------------------- |
| `npm run dev`            | Start the local development server                    |
| `npm run build`          | Generate the static site in `dist/`                   |
| `npm run preview`        | Serve the generated production build                  |
| `npm run check`          | Run Astro and TypeScript checks                       |
| `npm run lint`           | Run ESLint                                            |
| `npm run format`         | Format source and documentation                       |
| `npm run format:check`   | Verify formatting without changing files              |
| `npm run photos:prepare` | Convert local originals into bounded WebP site assets |
| `npm run test:links`     | Check links and assets inside the generated site      |
| `npm test`               | Run checks, lint, build, and internal-link validation |

## Repository structure

```text
src/
  assets/
    gear-gallery/                Prepared customer-build photos
    splitshot-gallery/           Prepared SplitShot screenshots
  components/                  Reusable presentation components
  content/
    site/                      Editable copy for the three main pages
  layouts/                     Shared HTML shell and metadata
  pages/                       Site routes
  site-config.ts               Navigation, social links, domain, and site name
  styles/global.css            Site-wide design tokens and base styles
docs/USER_GUIDE.md             Page-by-page editing and publishing guide
photos-originals/              Ignored local inbox for original photos
public/                        Files copied directly to the final site
```

## Content management

Visible page text is stored in JSON under `src/content/site/`. The [website editing guide](docs/USER_GUIDE.md) maps every field to its page and explains the safe editing workflow.

### Add gallery photos

Copy originals into `photos-originals/customer-builds/` or `photos-originals/splitshot/`, then run `npm run photos:prepare`. The command creates bounded WebP sources in the corresponding `src/assets/` gallery. Astro generates smaller responsive thumbnails during the production build. See the [website editing guide](docs/USER_GUIDE.md) for the complete workflow.

### Change navigation, social links, or branding

- Navigation order, labels, canonical domain, organization name, and social destinations: `src/site-config.ts`
- Colors, typography, spacing, radii, shadows, and shared breakpoints: variables near the top of `src/styles/global.css`
- Primary logo asset: `src/assets/brand/klock-holding-co-logo.png`
- Header/footer presentation and favicon: `src/components/Header.astro`, `src/components/Footer.astro`, and `public/favicon.png`

The tracked logo matches the current official Klock Holding Co. profile image on Pewcentric. When the logo changes, replace both PNG files so the page branding and browser icon stay aligned.

## Deployment to GitHub Pages

`.github/workflows/deploy-pages.yml` validates and deploys the static `dist/` directory whenever `main` is updated. `astro.config.mjs` uses the custom production origin, so canonical URLs and the sitemap point to `https://www.klockholdingco.com`.

One-time repository setup:

1. Create the GitHub repository and push this repository with the default branch named `main`.
2. In the GitHub repository, open **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Under **Custom domain**, enter `www.klockholdingco.com` and save it.
5. Wait for the deployment workflow to complete, then enable **Enforce HTTPS** when GitHub makes it available.

DNS changes must be made manually with the DNS provider:

1. Create a `CNAME` record named `www` that points directly to `<github-owner>.github.io` (replace the placeholder with the repository owner; do not append the repository name).
2. To redirect `klockholdingco.com` to `www.klockholdingco.com`, also configure the apex with the `A`, `AAAA`, `ALIAS`, or `ANAME` records currently documented by GitHub Pages. Do not copy old IP addresses from third-party tutorials.
3. Remove conflicting records for the same host. Avoid wildcard DNS records.
4. DNS and certificate issuance can take time. Confirm the domain check in GitHub Pages settings before enforcing HTTPS.

The build includes `public/CNAME` as an additional record of the intended domain, although GitHub's Actions-based Pages deployment uses the domain configured in repository settings.

## Deployment checklist

- `npm test` passes locally.
- `public/CNAME`, `astro.config.mjs`, and `src/site-config.ts` all use `www.klockholdingco.com`.
- No content file remains public with placeholder copy or `draft: true` unintentionally.
- New external links are opened manually or checked with `curl --head --location <url>`.
- The GitHub Pages workflow completes and the custom-domain check succeeds.

No secrets are required. Do not add private keys, access tokens, analytics credentials, or customer data to this repository.
