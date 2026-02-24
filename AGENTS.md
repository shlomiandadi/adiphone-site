# AGENTS.md

## Cursor Cloud specific instructions

### Overview
This is a **Next.js 14** Hebrew RTL digital agency website ("Top Webstak / AdiPhone") using **TypeScript**, **Prisma ORM** with **PostgreSQL (Neon)**, and **Tailwind CSS**. See `README.md` for general project description.

### Running the application
- **Dev server**: `npm run dev` (port 3000)
- **Lint**: `npm run lint` (pre-existing lint errors in Hebrew content files are expected — they are `react/no-unescaped-entities` warnings from Hebrew quotation marks)
- **Build**: `npm run build`

### Key gotchas
- **`--legacy-peer-deps`**: Always use `npm install --legacy-peer-deps` when installing dependencies. Some packages (e.g. `react-quill`, `next-auth` beta) have peer-dep conflicts with React 18.
- **ESLint version**: This project requires **ESLint 8** and **eslint-config-next@14.1.0** (matching Next.js 14). ESLint 9+ is incompatible. The `.eslintrc.json` file must exist for `npm run lint` to work non-interactively.
- **Prisma and `.env`**: Prisma CLI reads `DATABASE_URL` from `.env` (not `.env.local`). Next.js reads from `.env.local`. Both files must exist with `DATABASE_URL` for the app and Prisma CLI to work.
- **Contact form UI**: The `/contact` page submits to `/api/contact/submit` which requires `RESEND_API_KEY`. Without it, UI form submissions fail (500).

### Environment variables
The following secrets must be configured in Cursor Cloud Secrets for full functionality:
- `DATABASE_URL` — Neon PostgreSQL connection string (the production/dev database)
- `RESEND_API_KEY` — required for contact form submission via the UI

Additional variables set in `.env.local`:
- `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` — admin auth
- `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL` — set to `http://localhost:3000` for dev

Optional: `OPENAI_API_KEY` (for AI chatbot)

### Database
This project uses **Neon** (cloud PostgreSQL). There is no local database — the `DATABASE_URL` secret should point to the Neon instance. No need to install or run PostgreSQL locally.
