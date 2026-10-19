# SEO Agent Next.js apply adapter

Drop-in apply layer for [SEO Agent](https://github.com/shlomiandadi/seo-agent) (`nextjs-adapter/seo-agent-apply`).

Overrides are stored in **Neon Postgres** (`seo_agent_state`, same `DATABASE_URL` as the rest of the site). The table is created on first use. Netlify Blobs are only a mirror for Edge redirects and a one-time import of payloads saved before this table existed.

`generateMetadata` reads Neon. A Blobs-only write is invisible to static/ISR renders on Netlify (no Blobs context), so those pages kept their hardcoded `<title>`.

## Env

Set the same secret in Netlify and in the SEO Agent UI:

```
SEO_AGENT_WEBHOOK_SECRET
```

Optional Blobs fallback (only if automatic Netlify context is missing):

```
SEO_AGENT_BLOBS_SITE_ID
SEO_AGENT_BLOBS_TOKEN
```

Webhook URL:

```
https://adi-phone.co.il/api/seo-agent/webhook
```

## What it applies

- Title / meta / OG / canonical overrides via `generateMetadata`
- FAQ + JSON-LD via `<SeoAgentPageExtras path="..." />`
- 301/302 redirects in `middleware.ts` (existing `next.config.js` / `netlify.toml` redirects stay)
- `/llms.txt` served by `app/llms.txt/route.ts` (same body as the previous public file; store additions are appended)
- `revalidatePath` for the page, its layout, and the parent layout after each successful apply (service metadata lives on the nested layout)
- Existing article-publish payloads (`title` + `slug` + `contentHtml`) still write to Prisma
