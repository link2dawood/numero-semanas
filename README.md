# NumeroSemanas

Next.js website for ISO week numbers, Spanish calendars, holidays, printable planners, and date tools.

## Local development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Production verification

```bash
npm run lint
npm test
npm run build
```

The project targets Node.js 22.x, matching the runtime used for the verified local build and available on Vercel.

## Deploy to Vercel

### Recommended: Vercel dashboard and Git

1. Put this directory in a GitHub, GitLab, or Bitbucket repository.
2. In Vercel, choose **Add New → Project** and import that repository.
3. Keep the detected framework as **Next.js**.
4. Keep the project root as the repository root.
5. Keep the standard commands detected from `package.json` (`npm ci`/install and `npm run build`). No `vercel.json` override is required.
6. Add the environment variables described below.
7. Deploy a Preview first and verify it.
8. Add `numerosemanas.es` and `www.numerosemanas.es` under **Project → Settings → Domains**. Make the apex domain primary and redirect `www` to it.
9. Enable production indexing only when the custom domain is ready, then redeploy Production.

Vercel automatically creates deployments from the production branch and preview deployments from other branches.

### Alternative: Vercel CLI

The CLI requires an interactive Vercel login:

```bash
npm install --global vercel
vercel login
vercel link
vercel
```

The first `vercel` deployment is a Preview. After configuring and checking the project, deploy Production with:

```bash
vercel --prod
```

## Environment variables

Configure values under **Vercel Project → Settings → Environment Variables**. Environment changes apply only to new deployments, so redeploy afterward.

### Required for production launch

| Variable | Production | Preview | Purpose |
|---|---|---|---|
| `SITE_INDEXING` | `enabled` | Leave empty | Production allows crawling; every other environment remains `noindex` by default |

Do not set `SITE_INDEXING=enabled` for Preview deployments. Preview pages use production canonicals but remain blocked from search indexing.

### Recommended for protected previews

| Variable | Production | Preview | Purpose |
|---|---|---|---|
| `STAGING_BASIC_AUTH` | Leave empty | `username:strong-password` | Adds HTTP Basic Auth to publicly reachable previews |

### Required for the contact form

| Variable | Example/purpose |
|---|---|
| `RESEND_API_KEY` | Secret API key from Resend |
| `CONTACT_TO_EMAIL` | Address that receives contact messages |
| `RESEND_FROM_EMAIL` | Verified sender, for example `NumeroSemanas <web@numerosemanas.es>` |

Without these values the site still deploys, but the contact form cannot send messages.

### Optional analytics and social profiles

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_GA_ID` | GA4 measurement ID such as `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity project ID |
| `NEXT_PUBLIC_SOCIAL_FACEBOOK` | Full official Facebook profile URL |
| `NEXT_PUBLIC_SOCIAL_PINTEREST` | Full official Pinterest profile URL |
| `NEXT_PUBLIC_SOCIAL_BLUESKY` | Full official Bluesky profile URL |

GA4 and Clarity load only after analytics consent. Variables prefixed with `NEXT_PUBLIC_` are intentionally visible to the browser and must not contain secrets.

## Domain and SEO launch checklist

After the custom domain is connected and the production deployment has `SITE_INDEXING=enabled`, verify:

```text
https://numerosemanas.es/
https://numerosemanas.es/robots.txt
https://numerosemanas.es/sitemap.xml
https://www.numerosemanas.es/
```

Expected behavior:

- The homepage returns HTTP 200.
- `robots.txt` contains `Allow: /` and the production sitemap URL.
- The sitemap contains canonical `https://numerosemanas.es/...` URLs.
- `www` redirects to `https://numerosemanas.es` in one permanent hop.
- Preview deployments remain `noindex`.

Then add `https://numerosemanas.es/sitemap.xml` in Google Search Console and test the homepage, one week-list page, one calendar page, and one city page with URL Inspection.

## Post-deployment checks

Run the repository audits against the live domain:

```bash
BASE_URL=https://numerosemanas.es npm run check:seo
BASE_URL=https://numerosemanas.es npm run check:crawl
BASE_URL=https://numerosemanas.es npm run check:depth
BASE_URL=https://numerosemanas.es npm run check:links
BASE_URL=https://numerosemanas.es npm run check:images
```

Also verify the contact form, PDF/iCalendar downloads, cookie consent, GA4 Realtime/DebugView, and mobile/desktop PageSpeed Insights.
