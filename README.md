# AI Synthesis Radar

Automated operator intelligence and daily AI news synthesis blog backed by Astro and Git content collections.

## Architecture

- **Engine**: [Astro 4](https://astro.build) (Static mode, \$0 Cloudflare Pages / GitHub Pages hosting).
- **Validation**: Strict Zod content collection schemas enforcing confidence scores, 7-day theme acceleration deltas, and primary corroboration links.
- **Feeds**: Full RSS 2.0 endpoint at `/rss.xml`.
- **Pipeline Integration**: `scripts/export-briefing.mjs` ingests structured JSON/objects from morning ingestion runs and generates Astro markdown files.

## Quick Start

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build static output
npm run build
```

## Daily Publishing Flow

1. Ingestion pipeline extracts and scores morning newsletter data.
2. Step 8c runs `exportBriefing(payload)` to write `src/content/briefings/YYYY-MM-DD.md`.
3. GitHub Actions commits the new file to `main`.
4. Cloudflare Pages detects the commit and rebuilds the static edge site in ~20 seconds.
