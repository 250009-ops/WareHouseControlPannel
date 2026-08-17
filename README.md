# Ombor Nazorati

Full-stack warehouse control panel: Next.js API + server data layer, ready for Supabase and Vercel.

## Login

- Email: `makatbcounselor@gmail.com`
- Password: `13-makatbcounselor`

These are set in `.env.local` as `PANEL_EMAIL` / `PANEL_PASSWORD`.

## Architecture

- Frontend: Next.js App Router screens
- Backend: `/api/auth/*` and `/api/data` (httpOnly session cookie)
- Data: server file (`data/store.json`) until Supabase keys are present, then Postgres via the service role key

## Local run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Health check: [http://localhost:3000/api/health](http://localhost:3000/api/health).

## Environment

Copy `.env.example` to `.env.local` (already created locally):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | App origin |
| `NEXT_PUBLIC_PANEL_EMAIL` | Login form default email |
| `PANEL_EMAIL` | Server login email |
| `PANEL_PASSWORD` | Server login password |
| `AUTH_SECRET` | Signs the session cookie |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key for table writes |

## Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Project Settings → API: paste URL, anon key, and service role key into `.env.local`.
3. Run `supabase/schema.sql` in the SQL editor.
4. Authentication → Users → Add user with the panel email/password and confirm the email.
5. Restart `npm run dev`. `/api/health` should show `"backend": "supabase"`.

## Vercel

Set the same variables in the Vercel project (including `SUPABASE_SERVICE_ROLE_KEY`). Use your production URL for `NEXT_PUBLIC_APP_URL`.
