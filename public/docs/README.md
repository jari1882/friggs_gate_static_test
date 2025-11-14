# Static PDF Documents

Place finalized PDF assets for the public site in this directory. Files stored here are deployed verbatim by Next.js/Vercel and become available at matching URLs on https://life-nervous-system.com.

## Naming conventions
- Use lowercase, hyphen-separated filenames (e.g., `dawn-of-a-new-epoch.pdf`).
- Keep names stable to avoid breaking existing links.

## Deployment mapping
- `public/docs/<filename>.pdf` → `https://life-nervous-system.com/docs/<filename>.pdf`
- To expose a PDF at the root (e.g., `/dawn.pdf`), place the file directly in `public/` instead.

## Adding the Dawn manifesto
1. Export the finalized PDF as `dawn-of-a-new-epoch.pdf`.
2. Copy it into this folder before committing: `public/docs/dawn-of-a-new-epoch.pdf`.
3. (Optional) If you want a shorter alias like `/dawn.pdf`, duplicate the file into `public/dawn.pdf` as well.

> ⚠️ Do not commit placeholder or non-PDF files with a `.pdf` extension. Keep this directory clean to ensure correct content-type headers.
