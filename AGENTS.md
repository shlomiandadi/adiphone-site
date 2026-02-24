# AGENTS.md

## Cursor Cloud specific instructions

### Overview
This is a **Next.js 14** Hebrew RTL digital agency website ("Top Webstak / AdiPhone") using **TypeScript**, **Prisma ORM** with **PostgreSQL**, and **Tailwind CSS**. See `README.md` for general project description.

### Running the application
- **Dev server**: `npm run dev` (port 3000)
- **Lint**: `npm run lint` (pre-existing lint errors in Hebrew content files are expected — they are `react/no-unescaped-entities` warnings from Hebrew quotation marks)
- **Build**: `npm run build`

### Key gotchas
- **`--legacy-peer-deps`**: Always use `npm install --legacy-peer-deps` when installing dependencies. Some packages (e.g. `react-quill`, `next-auth` beta) have peer-dep conflicts with React 18.
- **ESLint version**: This project requires **ESLint 8** and **eslint-config-next@14.1.0** (matching Next.js 14). ESLint 9+ is incompatible. The `.eslintrc.json` file must exist for `npm run lint` to work non-interactively.
- **Prisma and `.env`**: Prisma CLI reads `DATABASE_URL` from `.env` (not `.env.local`). Next.js reads from `.env.local`. Both files must exist with `DATABASE_URL` for the app and Prisma CLI to work.
- **Contact form UI**: The `/contact` page submits to `/api/contact/submit` which requires `RESEND_API_KEY`. Without it, UI form submissions fail (500). The `/api/contact` endpoint (used for direct DB operations) works without Resend. This is existing behavior.
- **PostgreSQL**: Must be running before starting the dev server. After a fresh DB, run `npx prisma db push` to apply the schema.

### Environment variables
Copy `.env.example` to both `.env.local` and `.env`. Required variables:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` — admin auth
- `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL` — set to `http://localhost:3000` for dev

Optional: `RESEND_API_KEY`, `OPENAI_API_KEY`

### Database
PostgreSQL 16 is installed via apt. Start with:
```
sudo pg_ctlcluster 16 main start
```
Dev database: `adiphone`, user: `devuser`, password: `devpass`.
