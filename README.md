# ARISE Conference

A modern registration and management website for the ARISE Christian Youth Conference.

## Stack

- Next.js App Router
- TailwindCSS
- Framer Motion
- Supabase Auth and PostgreSQL
- Netlify deployment

## Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and add your Supabase project values.
3. Run the SQL in `supabase/schema.sql`.
4. Start locally with `npm run dev`.

Required environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Admin users should be created in Supabase Auth. The `/admin/login` page is the secure login portal, and `/admin` is the protected dashboard that reads from the registration tables.

## Key Files

- Registration launch page: `src/app/register/page.tsx`
- Interest list form: `src/components/InterestForm.tsx`
- Full registration form behind `REGISTRATION_OPEN`: `src/components/RegistrationForm.tsx`
- Feature flag: `src/lib/feature-flags.ts`
- Registration success page: `src/app/register/success/page.tsx`
- Admin dashboard: `src/app/admin/page.tsx`
- Admin login portal: `src/app/admin/login/page.tsx`
- Supabase SQL schema and RLS policies: `supabase/schema.sql`
- Future confirmation hooks: `src/lib/future-confirmations.ts`
