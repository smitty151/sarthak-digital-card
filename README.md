# Sarthak — Digital Contacts & Resume

A minimalist Next.js site with Tailwind. Includes:
- Contact & social + vCard
- Resume & Cover Letter (embedded PDF)
- Calendly link
- Optional contact form via Formspree
- OpenGraph image + favicon
- Optional analytics (GA4 or Plausible)

## Quick Start (Vercel)
1. **Fork or upload** this repo to GitHub (e.g., `smitty151/sarthak-digital-card`).
2. Go to **vercel.com** → New Project → Import from GitHub → select this repo → Deploy.
3. Set **Environment Variables** (optional but recommended):
   - `NEXT_PUBLIC_GA_ID` = `G-XXXXXXXXXX` (leave empty to disable GA)
   - `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` = your domain (e.g., `sarthak.vercel.app`)
   - `NEXT_PUBLIC_PLAUSIBLE_SRC` = `https://plausible.io/js/script.js` (default)
   - `NEXT_PUBLIC_FORMSPREE_ENDPOINT` = your Formspree endpoint (e.g., `https://formspree.io/f/abcdwxyz`)

4. (Optional) Add a **custom domain** in Vercel → Project → Domains and point your registrar to Vercel’s records.

## Local Dev
```bash
npm install
npm run dev
```
Visit http://localhost:3000

## PDFs
- Replace `/public/resume.pdf` and `/public/cover-letter.pdf` with your latest versions as needed.

## Contact Form (Formspree)
- Create a free form at https://formspree.io/
- Copy the endpoint and set `NEXT_PUBLIC_FORMSPREE_ENDPOINT` in Vercel.
- Submissions will email you without needing a backend.

## Analytics
- GA4: Create a GA property → get Measurement ID (G-XXXXX) → add to Vercel env.
- Plausible: Add your domain in Plausible → set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` env.

## Notes
- OpenGraph image and favicon live in `/public`.
- Edit page copy in `app/page.tsx`. Metadata in `app/layout.tsx`.
