# SEO Agent Next.js apply adapter

Drop-in apply layer for [SEO Agent](https://github.com/shlomiandadi/seo-agent) (`nextjs-adapter/seo-agent-apply`).

This site copy stores overrides in **Netlify Blobs** (not `/tmp`) and no-ops when the store is empty, so current rendering stays unchanged until SEO Agent sends an apply payload.

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
- `revalidatePath` after each successful apply
- Existing article-publish payloads (`title` + `slug` + `contentHtml`) still write to Prisma
