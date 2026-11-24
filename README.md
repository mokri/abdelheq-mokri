# Abdelheq Mokri — Portfolio

Next.js 16 + Supabase portfolio with an admin dashboard and a Markdown blog.
The original single-file site is kept in `legacy/index.html` for reference; its CSS is ported 1:1 to `src/app/(site)/site.css`.

## Run locally

```bash
npm install
npm run dev
```

Without Supabase credentials the public site runs on the built-in content in `src/data/seed.ts` (the admin is disabled).

## Connect Supabase (enables the admin)

1. Create a project at supabase.com (free tier is fine).
2. `cp .env.example .env.local` and fill in the URL, anon key, service-role key, and the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you want to log in with.
3. Run the schema: paste each file in `supabase/migrations/` (in order) into the Supabase SQL editor (or `npx supabase db push`).
4. In Supabase → Authentication → Providers → Email, turn **off** "Allow new users to sign up".
5. `npm run seed` — loads all current content and creates your admin user.
   After you start editing in the admin, use `npm run seed -- --admin-only` (a full seed overwrites seeded rows).
6. Restart `npm run dev`, open http://localhost:3000/admin.

## Admin

| Area | What you can do |
|---|---|
| Blog posts | Markdown editor with live preview, math (`$x$`), code highlighting, paste/drop image upload, drafts, publish date, tags, cover image |
| Profile & hero | Name, typewriter lines, stats, bio, timeline, research keywords, contact links, SEO, **resume PDF** |
| Experiences, Projects, Papers, Certificates, Startups, Skills | Add / edit / delete, drag to reorder, publish toggle, image & PDF uploads |

Projects of kind **Client work** linked to an experience show as image cards under that experience (e.g. the LemsaInnov projects).
Every save revalidates the static pages, so changes are live immediately.

## Resume / CV

Visitors can download the resume from the hero, the nav (“CV ↓”) and the contact section.
- Default file: `public/resume/Abdelheq-Mokri-Resume.pdf`, generated from `resume/resume.html` with `npm run resume:pdf` (uses headless Google Chrome).
- To swap it without a deploy: Admin → Profile & hero → **Resume (PDF)** → Upload → Save. Clearing the field hides the download buttons.

## Deploy (Vercel)

Import the repo, add the same env vars (set `NEXT_PUBLIC_SITE_URL` to your domain), deploy.

## Notes

- This folder is on an exFAT drive, which creates `._*` files. They're git-ignored and excluded from TypeScript/ESLint; `npm run clean:appledouble` deletes them.
- Project screenshots for Evology.ai, OPU, SellForms, &Arise, Coordate and Primrecrut are in `public/images/projects/` (from dr1tch.dev).
