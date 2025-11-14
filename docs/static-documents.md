# Static PDF Document Hosting

The Life Nervous System frontend is built with Next.js 13 (App Router). Vercel serves any assets stored in the `/public` directory verbatim from the site root.

## Directory structure
- `public/` – files here are available at `https://life-nervous-system.com/<filename>`.
- `public/docs/` – files here are available at `https://life-nervous-system.com/docs/<filename>`.

## Adding PDFs
1. Place the PDF file in the correct folder:
   - `public/docs/dawn-of-a-new-epoch.pdf` → `https://life-nervous-system.com/docs/dawn-of-a-new-epoch.pdf`
   - `public/dawn.pdf` (optional alias) → `https://life-nervous-system.com/dawn.pdf`
2. Commit the binary PDFs to the repository so they are deployed by Vercel.
3. Redeploy via Vercel; no additional configuration is required.

## Notes
- File names are case-sensitive. Use lowercase, hyphenated names to avoid confusion.
- Replacing an existing file with a new version under the same name will cause Vercel to update the asset on the next deployment.
- Browser caches may retain previous versions; append a query string (e.g., `?v=2`) when sharing links after an update if immediate refresh is required.
